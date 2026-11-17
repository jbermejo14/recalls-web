import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { SECTION_NAMES, SITE_NAME } from '../src/lib/site';

const SOURCE_DIRECTORY = 'src';
const OLD_BRAND_PATTERN = /RECALLSCOPE|recallscope|recalls-theme/i;
const OLD_ACCENT_PATTERN = /#ff5500/i;

function brandListFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? brandListFiles(fullPath) : [fullPath];
  });
}

function brandOffenders(pattern: RegExp): string[] {
  return brandListFiles(path.join(process.cwd(), SOURCE_DIRECTORY))
    .filter(file => pattern.test(readFileSync(file, 'utf-8')))
    .map(file => path.relative(process.cwd(), file));
}

test('marca: SITE_NAME es Ododex y hay un nombre de sección por idioma', () => {
  assert.equal(SITE_NAME, 'Ododex');
  assert.equal(SECTION_NAMES.es, 'Llamadas a revisión');
  assert.equal(SECTION_NAMES.en, 'Vehicle recalls');
});

test('marca: ningún fichero de src menciona RECALLSCOPE ni su clave de tema', () => {
  assert.deepEqual(brandOffenders(OLD_BRAND_PATTERN), []);
});

test('marca: ningún fichero de src conserva el naranja #FF5500', () => {
  assert.deepEqual(brandOffenders(OLD_ACCENT_PATTERN), []);
});
