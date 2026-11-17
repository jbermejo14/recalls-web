import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { camposPendientes, FECHA_TEXTOS_LEGALES, ficheroTitular, getTitular, valorOPendiente, type Titular } from '../src/lib/legal';

const LEGAL_COMPLETE_OWNER: Titular = {
  tipo: 'persona-fisica',
  nombre: 'Titular de prueba',
  nif: 'placeholder',
  domicilio: 'Calle de prueba 1',
  email: 'prueba@example.com',
  registroMercantil: ''
};

const LEGAL_EMPTY_TEMPLATE = { tipo: 'persona-fisica', nombre: '', nif: '', domicilio: '', email: '', registroMercantil: '' };

function legalConfigDirectory(files: Record<string, unknown>): string {
  const base = mkdtempSync(join(tmpdir(), 'legal-test-'));
  mkdirSync(join(base, 'config'));
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(base, 'config', name), JSON.stringify(content));
  }
  return base;
}

test('getTitular lee el fichero real con la forma esperada', () => {
  const owner = getTitular();
  assert.ok(['persona-fisica', 'empresa'].includes(owner.tipo));
  for (const field of ['nombre', 'nif', 'domicilio', 'email', 'registroMercantil'] as const) {
    assert.equal(typeof owner[field], 'string');
  }
});

test('camposPendientes: persona física ignora registroMercantil', () => {
  assert.deepEqual(camposPendientes(LEGAL_COMPLETE_OWNER), []);
  const empty: Titular = { ...LEGAL_COMPLETE_OWNER, nombre: '', email: '  ' };
  assert.deepEqual(camposPendientes(empty), ['nombre', 'email']);
});

test('camposPendientes: empresa exige registroMercantil', () => {
  const company: Titular = { ...LEGAL_COMPLETE_OWNER, tipo: 'empresa' };
  assert.deepEqual(camposPendientes(company), ['registroMercantil']);
  assert.deepEqual(camposPendientes({ ...company, registroMercantil: 'Tomo 1' }), []);
});

test('valorOPendiente devuelve el valor o el marcador', () => {
  assert.equal(valorOPendiente(LEGAL_COMPLETE_OWNER, 'nombre'), 'Titular de prueba');
  assert.equal(valorOPendiente(LEGAL_COMPLETE_OWNER, 'registroMercantil'), '[pendiente: registroMercantil]');
});

test('FECHA_TEXTOS_LEGALES es una fecha ISO', () => {
  assert.match(FECHA_TEXTOS_LEGALES, /^\d{4}-\d{2}-\d{2}$/);
});

test('getTitular usa la plantilla cuando no existe config/titular.json', () => {
  const base = legalConfigDirectory({ 'titular.example.json': LEGAL_EMPTY_TEMPLATE });
  assert.equal(ficheroTitular(base), join('config', 'titular.example.json'));
  assert.deepEqual(camposPendientes(getTitular(base)), ['nombre', 'nif', 'domicilio', 'email']);
});

test('getTitular prefiere config/titular.json a la plantilla', () => {
  const base = legalConfigDirectory({
    'titular.example.json': LEGAL_EMPTY_TEMPLATE,
    'titular.json': { ...LEGAL_COMPLETE_OWNER }
  });
  assert.equal(getTitular(base).nombre, 'Titular de prueba');
});

test('getTitular nombra el fichero cuando el tipo no es válido', () => {
  const base = legalConfigDirectory({ 'titular.json': { ...LEGAL_EMPTY_TEMPLATE, tipo: 'autonomo' } });
  assert.throws(() => getTitular(base), /config.titular\.json: el campo "tipo"/);
});
