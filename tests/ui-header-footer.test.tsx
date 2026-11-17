import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import BrandLogo from '../src/components/BrandLogo';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import RiskBadge from '../src/components/RiskBadge';

const RECALLS_LANG = 'RECALLS_LANG';
const SECTIONS_LABEL = 'aria-label="Secciones"';

function headerWithLocale(locale: string, run: () => void): void {
  const previous = process.env[RECALLS_LANG];
  process.env[RECALLS_LANG] = locale;
  try {
    run();
  } finally {
    if (previous === undefined) delete process.env[RECALLS_LANG];
    else process.env[RECALLS_LANG] = previous;
  }
}

test('BrandLogo: dos variantes del logo con la ruta base del idioma', () => {
  headerWithLocale('es', () => {
    const html = renderToStaticMarkup(<BrandLogo />);
    assert.ok(html.includes('src="/es/llamadas-revision/brand/ododex-logo-light.svg"'));
    assert.ok(html.includes('src="/es/llamadas-revision/brand/ododex-logo-dark.svg"'));
  });
  headerWithLocale('en', () => {
    assert.ok(renderToStaticMarkup(<BrandLogo />).includes('src="/en/recalls/brand/ododex-logo-light.svg"'));
  });
});

test('Header en español: sección, Inicio, Marcas y ancla de la lista de marcas', () => {
  headerWithLocale('es', () => {
    const html = renderToStaticMarkup(<Header />);
    assert.ok(html.includes('Llamadas a revisión'));
    assert.ok(html.includes(SECTIONS_LABEL));
    assert.ok(html.includes('>Inicio<'));
    assert.ok(html.includes('>Marcas<'));
    assert.ok(html.includes('#marcas'));
    assert.ok(html.includes('Modo oscuro'));
  });
});

test('Header en inglés: sección, Home y Brands', () => {
  headerWithLocale('en', () => {
    const html = renderToStaticMarkup(<Header />);
    assert.ok(html.includes('Vehicle recalls'));
    assert.ok(html.includes('aria-label="Sections"'));
    assert.ok(html.includes('>Home<'));
    assert.ok(html.includes('>Brands<'));
    assert.ok(!html.includes('Inicio'));
  });
});

test('Footer: fuente de datos, aviso de sitio no oficial y consentimiento solo si se pide', () => {
  headerWithLocale('es', () => {
    const without = renderToStaticMarkup(<Footer />);
    assert.ok(without.includes('https://ec.europa.eu/safety-gate-alerts/'));
    assert.match(without, /no es una web oficial/);
    assert.ok(!without.includes('Configurar cookies'));
    assert.ok(renderToStaticMarkup(<Footer showConsent />).includes('Configurar cookies'));
  });
  headerWithLocale('en', () => {
    assert.match(renderToStaticMarkup(<Footer showConsent />), /not an official website/);
    assert.ok(renderToStaticMarkup(<Footer showConsent />).includes('Cookie settings'));
  });
});

test('RiskBadge: tag-red para incendio, tag-warning para lesiones y tag-green para medio ambiente', () => {
  const cases: Array<[string, string]> = [
    ['Fire', 'tag-red'],
    ['Injuries', 'tag-warning'],
    ['Environment', 'tag-green']
  ];
  for (const [risk, expectedClass] of cases) {
    assert.ok(renderToStaticMarkup(<RiskBadge risk={risk} lang="es" />).includes(expectedClass), risk);
  }
});
