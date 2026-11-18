import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import AdSlot from '../src/components/AdSlot';

const VALID_CLIENT = 'ca-pub-0000000000000000';
const VALID_SLOT = '0000000000';
const MAX_SLOTS_PER_PAGE = 3;
const APP_DIRECTORY = path.join('src', 'app');
const COMPONENTS_DIRECTORY = path.join('src', 'components');
const LEGAL_PAGES = ['aviso-legal', 'privacidad', 'cookies'];
const COMPONENT_IMPORT_PATTERN = /from '(?:\.\.\/)+components\/(\w+)'/g;
const ADSLOT_USAGE_PATTERN = /<AdSlot[\s/>]/g;

function adSlotSetEnv(name: string, value: string | undefined): void {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

function adSlotRender(client: string | undefined, slot: string | undefined, locale = 'es'): string {
  const previous = {
    client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
    slot: process.env.NEXT_PUBLIC_ADSENSE_SLOT,
    locale: process.env.RECALLS_LANG
  };
  adSlotSetEnv('NEXT_PUBLIC_ADSENSE_CLIENT', client);
  adSlotSetEnv('NEXT_PUBLIC_ADSENSE_SLOT', slot);
  adSlotSetEnv('RECALLS_LANG', locale);
  try {
    return renderToStaticMarkup(<AdSlot />);
  } finally {
    adSlotSetEnv('NEXT_PUBLIC_ADSENSE_CLIENT', previous.client);
    adSlotSetEnv('NEXT_PUBLIC_ADSENSE_SLOT', previous.slot);
    adSlotSetEnv('RECALLS_LANG', previous.locale);
  }
}

function adSlotListPages(directory: string): string[] {
  return readdirSync(directory).flatMap(name => {
    const fullPath = path.join(directory, name);
    if (statSync(fullPath).isDirectory()) return adSlotListPages(fullPath);
    return name === 'page.tsx' ? [fullPath] : [];
  });
}

/** Cuenta los `<AdSlot` de un fichero y de los componentes que importa, sin repetir ficheros. */
function adSlotCount(file: string, visited: Set<string> = new Set()): number {
  if (visited.has(file) || !existsSync(file)) return 0;
  visited.add(file);
  const source = readFileSync(file, 'utf8');
  const own = source.match(ADSLOT_USAGE_PATTERN)?.length ?? 0;
  const imported = [...source.matchAll(COMPONENT_IMPORT_PATTERN)]
    .filter(([, name]) => name !== 'AdSlot')
    .map(([, name]) => path.join(COMPONENTS_DIRECTORY, `${name}.tsx`));
  return own + imported.reduce((sum, child) => sum + adSlotCount(child, visited), 0);
}

describe('AdSlot', () => {

  test('sin cliente o sin unidad no renderiza nada', () => {
    assert.equal(adSlotRender(undefined, undefined), '');
    assert.equal(adSlotRender(VALID_CLIENT, undefined), '');
    assert.equal(adSlotRender(undefined, VALID_SLOT), '');
  });

  test('con valores inválidos no renderiza nada', () => {
    assert.equal(adSlotRender('ca-pub-123', VALID_SLOT), '');
    assert.equal(adSlotRender(VALID_CLIENT, '123456789'), '');
    assert.equal(adSlotRender(VALID_CLIENT, '12345678901'), '');
    assert.equal(adSlotRender(VALID_CLIENT, '000000000a'), '');
  });

  test('con valores válidos renderiza el bloque y el texto en español', () => {
    const html = adSlotRender(VALID_CLIENT, VALID_SLOT, 'es');
    assert.ok(html.includes('class="adsbygoogle"'));
    assert.ok(html.includes(`data-ad-client="${VALID_CLIENT}"`));
    assert.ok(html.includes(`data-ad-slot="${VALID_SLOT}"`));
    assert.ok(html.includes('data-ad-format="auto"'));
    assert.ok(html.includes('>Publicidad<'));
  });

  test('en inglés el texto es Advertisement', () => {
    const html = adSlotRender(VALID_CLIENT, VALID_SLOT, 'en');
    assert.ok(html.includes('>Advertisement<'));
    assert.ok(!html.includes('Publicidad'));
  });
});

describe('uso de AdSlot en las páginas', () => {
  test('ninguna página legal ni la 404 usan AdSlot', () => {
    for (const legal of LEGAL_PAGES) {
      assert.equal(adSlotCount(path.join(APP_DIRECTORY, legal, 'page.tsx')), 0, legal);
    }
    assert.equal(adSlotCount(path.join(APP_DIRECTORY, 'not-found.tsx')), 0);
  });

  test(`ninguna página pasa de ${MAX_SLOTS_PER_PAGE} AdSlot`, () => {
    for (const page of adSlotListPages(APP_DIRECTORY)) {
      assert.ok(adSlotCount(page) <= MAX_SLOTS_PER_PAGE, page);
    }
  });
});
