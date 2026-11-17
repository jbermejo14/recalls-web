import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  BASE_PATHS,
  absoluteUrl,
  alternateUrls,
  assetPath,
  getBasePath,
  getLocale,
  getSiteUrl,
  isHtmlOnlyRoute,
  otherLocalePath
} from '../src/lib/site';

const SITE_ORIGIN = 'https://ododex.com';

function withEnv(name: string, value: string | undefined, run: () => void): void {
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

const NEXT_CONFIG_LOADER = "import('./next.config.ts').then(module => console.log(JSON.stringify(module.default.default ?? module.default)))";

// tsx anida el export por defecto de un .ts (default.default). next.config.ts lee RECALLS_LANG al importarse, así que cada idioma se carga en un proceso aparte.
function loadNextConfig(locale: string | undefined) {
  const env = { ...process.env };
  if (locale === undefined) delete env.RECALLS_LANG;
  else env.RECALLS_LANG = locale;
  const output = execFileSync(process.execPath, ['--import', 'tsx', '-e', NEXT_CONFIG_LOADER], {
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
  return JSON.parse(output);
}

function loadNextConfigError(locale: string): string {
  try {
    loadNextConfig(locale);
  } catch (error) {
    return String((error as { stderr?: string }).stderr);
  }
  return '';
}

test('getLocale: por defecto es, acepta es y en, y rechaza otros valores diciendo cuáles se admiten', () => {
  withEnv('RECALLS_LANG', undefined, () => assert.equal(getLocale(), 'es'));
  withEnv('RECALLS_LANG', 'es', () => assert.equal(getLocale(), 'es'));
  withEnv('RECALLS_LANG', 'en', () => assert.equal(getLocale(), 'en'));
  withEnv('RECALLS_LANG', 'fr', () => assert.throws(() => getLocale(), /RECALLS_LANG="fr".*es, en/));
});

test('getBasePath sigue al idioma de la compilación', () => {
  withEnv('RECALLS_LANG', 'es', () => assert.equal(getBasePath(), '/es/llamadas-revision'));
  withEnv('RECALLS_LANG', 'en', () => assert.equal(getBasePath(), '/en/recalls'));
});

test('getSiteUrl quita barras finales y usa localhost por defecto', () => {
  withEnv('NEXT_PUBLIC_SITE_URL', `${SITE_ORIGIN}/`, () => assert.equal(getSiteUrl(), SITE_ORIGIN));
  withEnv('NEXT_PUBLIC_SITE_URL', undefined, () => assert.equal(getSiteUrl(), 'http://localhost:3050'));
});

test('absoluteUrl: raíz, rutas con y sin barra, e idioma explícito', () => {
  withEnv('NEXT_PUBLIC_SITE_URL', SITE_ORIGIN, () => {
    withEnv('RECALLS_LANG', 'es', () => {
      assert.equal(absoluteUrl('/'), `${SITE_ORIGIN}/es/llamadas-revision`);
      assert.equal(absoluteUrl(''), `${SITE_ORIGIN}/es/llamadas-revision`);
      assert.equal(absoluteUrl('/marca/seat'), `${SITE_ORIGIN}/es/llamadas-revision/marca/seat`);
      assert.equal(absoluteUrl('marca/seat'), `${SITE_ORIGIN}/es/llamadas-revision/marca/seat`);
      assert.equal(absoluteUrl('/marca/seat', 'en'), `${SITE_ORIGIN}/en/recalls/marca/seat`);
    });
    withEnv('RECALLS_LANG', 'en', () => {
      assert.equal(absoluteUrl('/'), `${SITE_ORIGIN}/en/recalls`);
    });
  });
});

test('assetPath antepone la ruta base del idioma', () => {
  withEnv('RECALLS_LANG', 'es', () => {
    assert.equal(assetPath('/brand/x.svg'), '/es/llamadas-revision/brand/x.svg');
    assert.equal(assetPath('brand/x.svg'), '/es/llamadas-revision/brand/x.svg');
  });
  withEnv('RECALLS_LANG', 'en', () => assert.equal(assetPath('/campana/a'), '/en/recalls/campana/a'));
});

test('otherLocalePath devuelve la misma página bajo el otro idioma', () => {
  withEnv('RECALLS_LANG', 'es', () => {
    assert.equal(otherLocalePath('/marca/seat'), '/en/recalls/marca/seat');
    assert.equal(otherLocalePath('/'), '/en/recalls');
  });
  withEnv('RECALLS_LANG', 'en', () => assert.equal(otherLocalePath('/marca/seat'), '/es/llamadas-revision/marca/seat'));
});

test('alternateUrls: es, en y x-default (= es) con URLs absolutas', () => {
  withEnv('NEXT_PUBLIC_SITE_URL', SITE_ORIGIN, () => {
    withEnv('RECALLS_LANG', 'en', () => {
      assert.deepEqual(alternateUrls('/campana/x'), {
        es: `${SITE_ORIGIN}/es/llamadas-revision/campana/x`,
        en: `${SITE_ORIGIN}/en/recalls/campana/x`,
        'x-default': `${SITE_ORIGIN}/es/llamadas-revision/campana/x`
      });
    });
  });
});

test('isHtmlOnlyRoute: solo campaña y modelo', () => {
  assert.equal(isHtmlOnlyRoute('/campana/abc-123'), true);
  assert.equal(isHtmlOnlyRoute('/marca/seat/ibiza'), true);
  assert.equal(isHtmlOnlyRoute('/marca/seat/ibiza/'), true);
  assert.equal(isHtmlOnlyRoute('/campana/abc#x'), true);
  assert.equal(isHtmlOnlyRoute('/'), false);
  assert.equal(isHtmlOnlyRoute('/#marcas'), false);
  assert.equal(isHtmlOnlyRoute('/marca/seat'), false);
  assert.equal(isHtmlOnlyRoute('/campana'), false);
  assert.equal(isHtmlOnlyRoute('/marca/seat/ibiza/extra'), false);
});

test('next.config.ts: basePath, distDir, export estático y RECALLS_LANG por idioma', () => {
  for (const locale of ['es', 'en'] as const) {
    const config = loadNextConfig(locale);
    assert.equal(config.basePath, BASE_PATHS[locale]);
    assert.equal(config.distDir, `out-${locale}`);
    assert.equal(config.output, 'export');
    assert.deepEqual(config.images, { unoptimized: true });
    assert.equal(config.env.RECALLS_LANG, locale);
  }
});

test('next.config.ts usa es por defecto y falla con un idioma no válido', () => {
  assert.equal(loadNextConfig(undefined).basePath, BASE_PATHS.es);
  assert.match(loadNextConfigError('fr'), /RECALLS_LANG="fr".*es, en/);
});
