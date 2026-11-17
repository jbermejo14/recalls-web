import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const MIN_TEXT_CONTRAST = 4.5;
const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const ON_ACCENT_BACKGROUND = '#C2410C';
const WHITE = '#FFFFFF';

const globalsCss = readFileSync(path.join(process.cwd(), 'src', 'app', 'globals.css'), 'utf-8').replace(/\r\n/g, '\n');

const LIGHT_THEME_BLOCK = /:root\s*,\s*\[data-theme="light"\]\s*\{([^}]*)\}/;
const DARK_THEME_BLOCK = /\[data-theme="dark"\]\s*\{([^}]*)\}/;

/** Extrae las variables de color del bloque que casa con `blockPattern` (grupo 1 = cuerpo). */
function uiReadThemeTokens(blockPattern: RegExp): Record<string, string> {
  const match = blockPattern.exec(globalsCss);
  assert.ok(match, `No se encuentra el bloque ${blockPattern} en globals.css`);
  const tokens: Record<string, string> = {};
  for (const token of match[1].matchAll(/(--[a-z-]+):\s*(#[0-9a-fA-F]{6});/g)) {
    tokens[token[1]] = token[2];
  }
  return tokens;
}

function uiChannelToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

function uiLuminance(hex: string): number {
  assert.match(hex, HEX_COLOR);
  const [red, green, blue] = [1, 3, 5].map(start => uiChannelToLinear(parseInt(hex.slice(start, start + 2), 16)));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function uiContrast(foreground: string, background: string): number {
  const [lighter, darker] = [uiLuminance(foreground), uiLuminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

const THEMES: Record<string, Record<string, string>> = {
  claro: uiReadThemeTokens(LIGHT_THEME_BLOCK),
  oscuro: uiReadThemeTokens(DARK_THEME_BLOCK)
};

const TEXT_TOKENS = ['--text-primary', '--text-secondary', '--text-muted'];
const SURFACE_TOKENS = ['--bg-body', '--bg-surface', '--bg-surface-elevated'];

for (const [themeName, tokens] of Object.entries(THEMES)) {
  test(`contraste: texto sobre fondos en tema ${themeName}`, () => {
    for (const text of TEXT_TOKENS) {
      for (const surface of SURFACE_TOKENS) {
        const ratio = uiContrast(tokens[text], tokens[surface]);
        assert.ok(ratio >= MIN_TEXT_CONTRAST, `${text} sobre ${surface} en tema ${themeName}: ${ratio.toFixed(2)}`);
      }
    }
  });

  test(`contraste: acento sobre fondo y superficie en tema ${themeName}`, () => {
    for (const surface of ['--bg-body', '--bg-surface']) {
      const ratio = uiContrast(tokens['--accent-primary'], tokens[surface]);
      assert.ok(ratio >= MIN_TEXT_CONTRAST, `--accent-primary sobre ${surface} en tema ${themeName}: ${ratio.toFixed(2)}`);
    }
  });
}

test('contraste: blanco sobre #C2410C', () => {
  assert.ok(uiContrast(WHITE, ON_ACCENT_BACKGROUND) >= MIN_TEXT_CONTRAST);
});

const STATE_TOKENS = ['--positive', '--negative', '--warning'];

for (const [themeName, tokens] of Object.entries(THEMES)) {
  test(`contraste: colores de estado sobre fondo y superficies en tema ${themeName}`, () => {
    for (const state of STATE_TOKENS) {
      for (const surface of SURFACE_TOKENS) {
        const ratio = uiContrast(tokens[state], tokens[surface]);
        assert.ok(ratio >= MIN_TEXT_CONTRAST, `${state} sobre ${surface} en tema ${themeName}: ${ratio.toFixed(2)}`);
      }
    }
  });
}

const CONSTANTS_BLOCK = /:root\s*\{([^}]*)\}/;
const RGBA_COLOR = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/;

/** Lee un token de color con alfa (rgba) del bloque indicado. */
function uiReadRgbaToken(blockPattern: RegExp, name: string): { channels: number[]; alpha: number } {
  const block = blockPattern.exec(globalsCss);
  assert.ok(block, `No se encuentra el bloque ${blockPattern} en globals.css`);
  const declaration = new RegExp(`${name}:\\s*([^;]+);`).exec(block[1]);
  assert.ok(declaration, `No se encuentra ${name}`);
  const parts = RGBA_COLOR.exec(declaration[1].trim());
  assert.ok(parts, `${name} no es un rgba(): ${declaration[1]}`);
  return { channels: parts.slice(1, 4).map(Number), alpha: Number(parts[4]) };
}

/** Mezcla un rgba sobre un fondo opaco hex y devuelve el hex resultante. */
function uiBlend(overlay: { channels: number[]; alpha: number }, backgroundHex: string): string {
  const background = [1, 3, 5].map(start => parseInt(backgroundHex.slice(start, start + 2), 16));
  const mixed = overlay.channels.map((channel, index) => Math.round(channel * overlay.alpha + background[index] * (1 - overlay.alpha)));
  return `#${mixed.map(channel => channel.toString(16).padStart(2, '0')).join('')}`;
}

const THEME_BLOCKS: Record<string, RegExp> = { claro: LIGHT_THEME_BLOCK, oscuro: DARK_THEME_BLOCK };
const TINTED_PAIRS = [
  { text: '--negative', tint: '--negative-bg' },
  { text: '--warning', tint: '--warning-bg' }
];

for (const [themeName, tokens] of Object.entries(THEMES)) {
  test(`contraste: texto de estado sobre fondos teñidos en tema ${themeName}`, () => {
    for (const { text, tint } of TINTED_PAIRS) {
      const background = uiBlend(uiReadRgbaToken(THEME_BLOCKS[themeName], tint), tokens['--bg-surface']);
      const ratio = uiContrast(tokens[text], background);
      assert.ok(ratio >= MIN_TEXT_CONTRAST, `${text} sobre ${tint} en tema ${themeName}: ${ratio.toFixed(2)}`);
    }
  });

  test(`contraste: acento y positivo sobre --accent-subtle en tema ${themeName}`, () => {
    for (const text of ['--accent-primary', '--positive']) {
      const ratio = uiContrast(tokens[text], tokens['--accent-subtle']);
      assert.ok(ratio >= MIN_TEXT_CONTRAST, `${text} sobre --accent-subtle en tema ${themeName}: ${ratio.toFixed(2)}`);
    }
  });
}

test('contraste: --on-accent-text sobre --on-accent-bg y su hover', () => {
  const match = CONSTANTS_BLOCK.exec(globalsCss);
  assert.ok(match, 'No se encuentra el bloque de constantes :root');
  const read = (name: string) => new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6});`).exec(match[1])?.[1] ?? '';
  for (const background of ['--on-accent-bg', '--on-accent-bg-hover']) {
    const ratio = uiContrast(read('--on-accent-text'), read(background));
    assert.ok(ratio >= MIN_TEXT_CONTRAST, `--on-accent-text sobre ${background}: ${ratio.toFixed(2)}`);
  }
});
