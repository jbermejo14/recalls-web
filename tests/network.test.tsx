import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Footer from '../src/components/Footer';
import {
  NETWORK_FILE_VARIABLE,
  getFooterNetworkSections,
  getNetworkSections,
  loadNetwork
} from '../src/lib/network';
import { BASE_PATHS } from '../src/lib/site';

const RECALLS_LANG = 'RECALLS_LANG';
const OWN_ROUTE = BASE_PATHS.es;
const OTHER_ROUTE = '/es/gasolineras';
const NETWORK_LABEL = 'Otras webs de Ododex';

const NETWORK = {
  version: 1,
  generado: '2026-11-19T18:00:00.000Z',
  secciones: [
    { ruta: OWN_ROUTE, nombre: 'Propia', descripcion: 'La propia web.' },
    { ruta: OTHER_ROUTE, nombre: 'Gasolineras', descripcion: 'Precios.' }
  ],
  enlaces: {}
};

function temporaryFile(name: string, content: string): string {
  const file = join(mkdtempSync(join(tmpdir(), 'network-')), name);
  writeFileSync(file, content);
  return file;
}

function withEnvironment(name: string, value: string | undefined, run: () => void): void {
  const previous = process.env[name];
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
  try {
    run();
  } finally {
    if (previous === undefined) delete process.env[name];
    else process.env[name] = previous;
  }
}

test('sin variable de entorno ni ruta, devuelve null sin error', () => {
  withEnvironment(NETWORK_FILE_VARIABLE, undefined, () => {
    assert.equal(loadNetwork(), null);
    assert.equal(getNetworkSections(), null);
  });
});

test('fichero inexistente devuelve null sin error', () => {
  assert.equal(loadNetwork(join(tmpdir(), 'no-existe-red-enlaces.json')), null);
});

test('JSON roto lanza un error claro en español', () => {
  const file = temporaryFile('roto.json', '{ no es json');
  assert.throws(() => loadNetwork(file), /no es válido: no es JSON/);
});

test('versión distinta de 1 lanza un error claro', () => {
  const file = temporaryFile('version.json', JSON.stringify({ ...NETWORK, version: 2 }));
  assert.throws(() => loadNetwork(file), /se esperaba version 1/);
});

test('las secciones excluyen la propia', () => {
  const file = temporaryFile('red.json', JSON.stringify(NETWORK));
  assert.deepEqual(getNetworkSections(OWN_ROUTE, file)?.map((section) => section.ruta), [OTHER_ROUTE]);
});

test('el pie de red solo existe en la compilación española', () => {
  const file = temporaryFile('idioma.json', JSON.stringify(NETWORK));
  withEnvironment(RECALLS_LANG, 'es', () => {
    assert.deepEqual(getFooterNetworkSections(file)?.map((section) => section.ruta), [OTHER_ROUTE]);
  });
  withEnvironment(RECALLS_LANG, 'en', () => {
    assert.equal(getFooterNetworkSections(file), null);
  });
});

test('Footer pinta las otras webs con <a href> tal cual y nada sin red', () => {
  const sections = [{ ruta: OTHER_ROUTE, nombre: 'Gasolineras', descripcion: 'Precios.' }];
  withEnvironment(RECALLS_LANG, 'es', () => {
    const html = renderToStaticMarkup(<Footer networkSections={sections} />);
    assert.ok(html.includes(NETWORK_LABEL));
    assert.ok(html.includes(`href="${OTHER_ROUTE}"`));
    assert.ok(!renderToStaticMarkup(<Footer networkSections={null} />).includes(NETWORK_LABEL));
    assert.ok(!renderToStaticMarkup(<Footer />).includes(NETWORK_LABEL));
  });
});
