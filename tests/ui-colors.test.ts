import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const SOURCE_DIRECTORY = 'src';
const TSX_EXTENSION = '.tsx';

// Colores fijos y degradados prohibidos: todo color sale de los tokens de globals.css.
// El lookbehind evita que "translate-" cuente como "slate-".
const FORBIDDEN_PATTERNS: RegExp[] = [
  /(?<![a-z])neutral-/,
  /(?<![a-z])zinc-/,
  /(?<![a-z])slate-/,
  /(?<![a-z])gray-/,
  /text-orange-/,
  /bg-orange-/,
  /#ff6b00/i,
  /#ff5500/i,
  /bg-gradient/
];

function uiListTsxFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return uiListTsxFiles(fullPath);
    return fullPath.endsWith(TSX_EXTENSION) ? [fullPath] : [];
  });
}

test('estilo: ningún .tsx de src usa colores fijos ni degradados', () => {
  const offenders: string[] = [];
  for (const file of uiListTsxFiles(path.join(process.cwd(), SOURCE_DIRECTORY))) {
    const content = readFileSync(file, 'utf-8');
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(content)) offenders.push(`${path.relative(process.cwd(), file)}: ${pattern}`);
    }
  }
  assert.deepEqual(offenders, []);
});
