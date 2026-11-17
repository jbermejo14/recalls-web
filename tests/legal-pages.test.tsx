import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import LegalNoticePage, { generateMetadata as noticeMetadata } from '../src/app/aviso-legal/page';
import PrivacyPage, { generateMetadata as privacyMetadata } from '../src/app/privacidad/page';
import CookiesPage, { generateMetadata as cookiesMetadata } from '../src/app/cookies/page';
import AdSenseScript from '../src/components/AdSenseScript';
import { getTitular, valorOPendiente } from '../src/lib/legal';

const RECALLS_LANG = 'RECALLS_LANG';
const TEST_ADSENSE_CLIENT = 'ca-pub-0000000000000000';
const NOINDEX = { index: false, follow: true };

function pagesWithEnv(name: string, value: string | undefined, run: () => void): void {
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

function pagesHtml(locale: string): { notice: string; privacy: string; cookies: string } {
  let html = { notice: '', privacy: '', cookies: '' };
  pagesWithEnv(RECALLS_LANG, locale, () => {
    html = {
      notice: renderToStaticMarkup(<LegalNoticePage />),
      privacy: renderToStaticMarkup(<PrivacyPage />),
      cookies: renderToStaticMarkup(<CookiesPage />)
    };
  });
  return html;
}

test('aviso legal en español: titular, LSSI, objeto Safety Gate y carácter no oficial', () => {
  const { notice } = pagesHtml('es');
  assert.ok(notice.includes(valorOPendiente(getTitular(), 'nombre')));
  assert.ok(notice.includes('LSSI'));
  assert.ok(notice.includes('Safety Gate'));
  assert.match(notice, /No es una web oficial de la Comisión Europea/);
});

test('privacidad en español: titular, AEPD, Google Ireland, localStorage y sin formularios ni teselas', () => {
  const { privacy } = pagesHtml('es');
  assert.ok(privacy.includes(valorOPendiente(getTitular(), 'nombre')));
  assert.ok(privacy.includes('AEPD'));
  assert.ok(privacy.includes('Google Ireland'));
  assert.ok(privacy.includes('ododex-theme'));
  assert.match(privacy, /no tiene formularios ni cuentas/);
  assert.doesNotMatch(privacy, /teselas|openstreetmap/i);
});

test('cookies en español: documenta ododex-theme y el enlace de Google', () => {
  const { cookies } = pagesHtml('es');
  assert.ok(cookies.includes('ododex-theme'));
  assert.ok(cookies.includes('https://policies.google.com/technologies/cookies?hl=es'));
  assert.ok(cookies.includes('Configurar cookies'));
});

test('las tres páginas en inglés están en inglés y mantienen los datos legales', () => {
  const { notice, privacy, cookies } = pagesHtml('en');
  assert.ok(notice.includes('Legal notice'));
  assert.match(notice, /not an official website of the European Commission/);
  assert.ok(notice.includes('LSSI'));
  assert.ok(privacy.includes('Privacy policy'));
  assert.ok(privacy.includes('AEPD'));
  assert.ok(cookies.includes('Cookie policy'));
  assert.ok(cookies.includes('https://policies.google.com/technologies/cookies?hl=en'));
  for (const html of [notice, privacy, cookies]) {
    assert.doesNotMatch(html, /Aviso legal|Política de|Última revisión/);
  }
});

test('las páginas legales no mencionan impuestos ni radares de otras webs de la red', () => {
  for (const locale of ['es', 'en']) {
    const { notice, privacy, cookies } = pagesHtml(locale);
    for (const html of [notice, privacy, cookies]) {
      assert.doesNotMatch(html, /impuesto|AEAT|Hacienda|DGT|radar/i);
    }
  }
});

test('las tres páginas legales no se indexan y apuntan a su ruta canónica', () => {
  pagesWithEnv(RECALLS_LANG, 'es', () => {
    pagesWithEnv('NEXT_PUBLIC_SITE_URL', 'https://ododex.com', () => {
      const expected: Array<[ReturnType<typeof noticeMetadata>, string]> = [
        [noticeMetadata(), '/aviso-legal'],
        [privacyMetadata(), '/privacidad'],
        [cookiesMetadata(), '/cookies']
      ];
      for (const [metadata, route] of expected) {
        assert.deepEqual(metadata.robots, NOINDEX);
        assert.equal(metadata.alternates?.canonical, `https://ododex.com/es/llamadas-revision${route}`);
      }
    });
  });
});

test('AdSenseScript no renderiza nada sin variable o con valor inválido', () => {
  pagesWithEnv('NEXT_PUBLIC_ADSENSE_CLIENT', undefined, () => assert.equal(AdSenseScript(), null));
  pagesWithEnv('NEXT_PUBLIC_ADSENSE_CLIENT', '', () => assert.equal(AdSenseScript(), null));
  pagesWithEnv('NEXT_PUBLIC_ADSENSE_CLIENT', 'ca-pub-123', () => assert.equal(AdSenseScript(), null));
});

test('AdSenseScript renderiza el script con un ca-pub válido', () => {
  pagesWithEnv('NEXT_PUBLIC_ADSENSE_CLIENT', TEST_ADSENSE_CLIENT, () => {
    const element = AdSenseScript();
    assert.ok(element);
    assert.equal(
      element.props.src,
      `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${TEST_ADSENSE_CLIENT}`
    );
    assert.equal(element.props.strategy, 'afterInteractive');
    assert.equal(element.props.crossOrigin, 'anonymous');
  });
});
