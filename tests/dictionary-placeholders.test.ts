import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import es from '../src/i18n/dictionaries/es.json';
import en from '../src/i18n/dictionaries/en.json';

const PLACEHOLDER_PATTERN = /\{\w+\}/;
// Solo cubre el acceso literal `dict.x.y`: no detecta accesos indirectos (`const texts = dict.x; texts.y`).
// Captura el acceso `dict.a.b` y, si lo hay, el `formatText(` que lo precede.
const DICT_ACCESS_PATTERN = /(formatText\(\s*)?\bdict((?:\.\w+)+)/g;
const SCAN_DIRECTORIES = ['src/app', 'src/components', 'src/lib'];
const ROOT = path.resolve(__dirname, '..');

type DictionaryNode = string | { [key: string]: DictionaryNode } | undefined;

function placeholdersResolve(dictionary: object, keyPath: string): DictionaryNode {
  let node: DictionaryNode = dictionary as DictionaryNode;
  for (const key of keyPath.split('.').filter(Boolean)) {
    if (typeof node !== 'object' || node === null) return undefined;
    node = node[key];
  }
  return node;
}

function placeholdersHasTemplate(keyPath: string): boolean {
  return [es, en].some(dictionary => {
    const value = placeholdersResolve(dictionary, keyPath);
    return typeof value === 'string' && PLACEHOLDER_PATTERN.test(value);
  });
}

/** Devuelve las rutas `dict.x.y` cuyo texto lleva `{palabra}` y se usan fuera de `formatText(...)`. */
function findUnformattedPlaceholders(source: string): string[] {
  const offenders: string[] = [];
  for (const match of source.matchAll(DICT_ACCESS_PATTERN)) {
    const [, formatCall, keyPath] = match;
    if (!formatCall && placeholdersHasTemplate(keyPath)) offenders.push(`dict${keyPath}`);
  }
  return offenders;
}

function placeholdersListSources(directory: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...placeholdersListSources(fullPath));
    else if (/\.tsx?$/.test(entry.name)) files.push(fullPath);
  }
  return files;
}

describe('Plantillas del diccionario sin rellenar', () => {
  test('el detector encuentra una plantilla pintada sin formatText', () => {
    const broken = '<span>{dict.modelPage.campaignListTitle} ({recalls.length})</span>';
    assert.deepEqual(findUnformattedPlaceholders(broken), ['dict.modelPage.campaignListTitle']);
  });

  test('el detector acepta una plantilla dentro de formatText y textos sin marcadores', () => {
    const valid = `
      {formatText(dict.modelPage.campaignListTitle, { brand: 'a', model: 'b' })}
      {formatText(
        dict.brandPage.campaignsHeader, { brand: 'a' })}
      {dict.breadcrumbs.home}`;
    assert.deepEqual(findUnformattedPlaceholders(valid), []);
  });

  test('ningún .ts/.tsx de src/app, src/components ni src/lib pinta una plantilla sin rellenar', () => {
    const failures: string[] = [];
    for (const directory of SCAN_DIRECTORIES) {
      for (const file of placeholdersListSources(path.join(ROOT, directory))) {
        const offenders = findUnformattedPlaceholders(fs.readFileSync(file, 'utf8'));
        failures.push(...offenders.map(offender => `${path.relative(ROOT, file)}: ${offender}`));
      }
    }
    assert.deepEqual(failures, []);
  });
});
