import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { brandPageMetadata, campaignPageMetadata, modelPageMetadata } from '../src/lib/page-metadata';
import { OG_IMAGE_PATH, buildPageMetadata } from '../src/lib/seo';
import {
  SEO_DESCRIPTION_MAX,
  SEO_DESCRIPTION_MIN,
  SEO_TITLE_MAX,
  seoBrandAndModel,
  seoBrandTitle,
  seoCampaignTitle,
  seoCountWord,
  seoFitDescription,
  seoModelDescription,
  seoModelTitle,
  seoShortenName
} from '../src/lib/seo-text';
import { getSafetyGateDataset } from '../src/lib/safety-gate-service';
import { BASE_PATHS, LOCALES, SITE_NAME, type Locale } from '../src/lib/site';
import { getDictionary } from '../src/i18n/get-dictionary';
import type { SafetyGateRecall } from '../src/types/safety-gate';

const SEO_TEST_ORIGIN = 'https://ododex.com';
const SEO_TEST_TITLE_SUFFIX = ` | ${SITE_NAME}`;
const SEO_TEST_OPEN_GRAPH_LOCALE: Record<Locale, string> = { es: 'es_ES', en: 'en_GB' };
const SEO_TEST_WORST_LENGTH = 200;
const SEO_TEST_MAX_REPORTED = 10;
const SEO_TEST_LONG_BRAND = 'Carthago Reisemobilbau Gmbh, Dometic Scandinavia Ab, Fendt-caravan Gmbh, Knaus Tabbert Gmbh';

function seoTestWithLocale(locale: Locale, run: () => void): void {
  const previousLang = process.env.RECALLS_LANG;
  const previousUrl = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.RECALLS_LANG = locale;
  process.env.NEXT_PUBLIC_SITE_URL = SEO_TEST_ORIGIN;
  try {
    run();
  } finally {
    if (previousLang === undefined) delete process.env.RECALLS_LANG;
    else process.env.RECALLS_LANG = previousLang;
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previousUrl;
  }
}

function seoTestRecall(overrides: Partial<SafetyGateRecall>): SafetyGateRecall {
  return {
    caseNumber: '0014/11',
    slug: '0014-11',
    publicationDate: '2011-01-14',
    publicationYear: 2011,
    officialUrl: '',
    brand: 'Volvo',
    brandSlug: 'volvo',
    models: ['S80', 'S60'],
    modelSlugs: ['s80', 's60'],
    riskType: 'Fire',
    danger: 'The products pose a risk of fire because the high pressure fuel pipes may not have been correctly installed.',
    measures: '',
    typeApproval: '',
    productionDates: '',
    notifyingCountry: 'Ireland',
    countryOfOrigin: 'Sweden',
    category: 'Motor vehicles',
    ...overrides
  };
}

function seoTestFullLength(title: unknown): number {
  assert.equal(typeof title, 'string');
  return (title as string).length + SEO_TEST_TITLE_SUFFIX.length;
}

function seoTestProblems(metadata: Metadata, locale: Locale, brand: string, label: string): string[] {
  const problems: string[] = [];
  const title = metadata.title as string;
  const description = metadata.description as string;
  const expectedImage = `${SEO_TEST_ORIGIN}${BASE_PATHS[locale]}${OG_IMAGE_PATH}`;
  if (seoTestFullLength(title) > SEO_TITLE_MAX) problems.push(`${label}: título de ${seoTestFullLength(title)}: ${title}`);
  if (seoCountWord(title, brand) > 1) problems.push(`${label}: marca repetida en el título: ${title}`);
  if (title.includes(SITE_NAME)) problems.push(`${label}: el título ya contiene ${SITE_NAME}: ${title}`);
  if (description.length < SEO_DESCRIPTION_MIN || description.length > SEO_DESCRIPTION_MAX) {
    problems.push(`${label}: descripción de ${description.length}: ${description}`);
  }
  const openGraph = metadata.openGraph as { images?: Array<{ url: string }>; locale?: string };
  const twitter = metadata.twitter as { card?: string; images?: string[] };
  if (openGraph.images?.[0]?.url !== expectedImage) problems.push(`${label}: og:image ${openGraph.images?.[0]?.url}`);
  if (openGraph.locale !== SEO_TEST_OPEN_GRAPH_LOCALE[locale]) problems.push(`${label}: og:locale ${openGraph.locale}`);
  if (twitter.card !== 'summary_large_image' || twitter.images?.[0] !== expectedImage) problems.push(`${label}: twitter incorrecto`);
  return problems;
}

function seoTestAllProblems(locale: Locale): string[] {
  const dataset = getSafetyGateDataset();
  const problems: string[] = [];
  seoTestWithLocale(locale, () => {
    for (const brand of dataset.brands) {
      problems.push(...seoTestProblems(brandPageMetadata(brand.brandSlug), locale, brand.brand, `marca ${brand.brandSlug}`));
      for (const model of brand.models) {
        problems.push(...seoTestProblems(modelPageMetadata(brand.brandSlug, model.slug), locale, brand.brand, `modelo ${brand.brandSlug}/${model.slug}`));
      }
    }
    for (const recall of dataset.recalls) {
      problems.push(...seoTestProblems(campaignPageMetadata(recall.slug), locale, recall.brand, `campaña ${recall.slug}`));
    }
  });
  return problems;
}

for (const locale of LOCALES) {
  test(`[${locale}] todas las marcas, modelos y campañas cumplen título, descripción e imagen`, () => {
    const problems = seoTestAllProblems(locale);
    assert.deepEqual(problems.slice(0, SEO_TEST_MAX_REPORTED), [], `${problems.length} problemas`);
  });
}

test('la imagen OG existe en public/brand', () => {
  assert.ok(fs.existsSync(path.join(process.cwd(), 'public', OG_IMAGE_PATH)));
});

test('buildPageMetadata: imagen con la ruta base de la sección, locale y título social con marca', () => {
  for (const locale of LOCALES) {
    seoTestWithLocale(locale, () => {
      const metadata = buildPageMetadata({ path: '/', title: 'Prueba', description: 'Descripción' });
      const openGraph = metadata.openGraph as { images: Array<{ url: string }>; locale: string; title: string };
      assert.equal(openGraph.images[0].url, `${SEO_TEST_ORIGIN}${BASE_PATHS[locale]}/brand/ododex-og.png`);
      assert.equal(openGraph.locale, SEO_TEST_OPEN_GRAPH_LOCALE[locale]);
      assert.equal(openGraph.title, `Prueba${SEO_TEST_TITLE_SUFFIX}`);
      assert.equal((metadata.twitter as { card: string }).card, 'summary_large_image');
    });
  }
});

test('la portada cumple título y descripción en los dos idiomas', () => {
  for (const locale of LOCALES) {
    const dictionary = getDictionary(locale);
    const title = `${dictionary.siteTitle}${SEO_TEST_TITLE_SUFFIX}`;
    assert.ok(title.length <= SEO_TITLE_MAX, title);
    const tagline = dictionary.siteTagline;
    assert.ok(tagline.length >= SEO_DESCRIPTION_MIN && tagline.length <= SEO_DESCRIPTION_MAX, tagline);
  }
});

test('seoShortenName: conserva lo que cabe y corta en separador o palabra', () => {
  assert.equal(seoShortenName('  Volvo \n Cars ', 20), 'Volvo Cars');
  assert.equal(seoShortenName('Triumph, United Kingdom, Sales Designation', 22), 'Triumph');
  assert.equal(seoShortenName('Manufacturer Of The Roof Canopy Mpk Metall', 22), 'Manufacturer Of The');
  assert.ok(seoShortenName('X'.repeat(SEO_TEST_WORST_LENGTH), 22).length <= 22);
});

test('seoBrandAndModel no repite la marca', () => {
  assert.equal(seoBrandAndModel('BMW', 'X5'), 'BMW X5');
  assert.equal(seoBrandAndModel('BMW', 'BMW X5'), 'BMW X5');
  assert.equal(seoBrandAndModel('Suzuki', 'Intercooler pipe in Suzuki Grand Vitara'), 'Intercooler pipe in Suzuki Grand Vitara');
  assert.equal(seoBrandAndModel('Volvo', ''), 'Volvo');
});

test('títulos cortos: se usa la plantilla completa en los dos idiomas', () => {
  assert.equal(seoBrandTitle('Seat', 'es'), 'Llamadas a revisión de Seat');
  assert.equal(seoBrandTitle('Seat', 'en'), 'Seat Recall Campaigns');
  assert.equal(seoModelTitle('Seat', 'Ibiza', 'es'), 'Llamadas a revisión de Seat Ibiza');
  assert.equal(seoModelTitle('Seat', 'Ibiza', 'en'), 'Seat Ibiza Recall Campaigns');
  assert.equal(seoCampaignTitle(seoTestRecall({ models: ['S80'] }), 'es'), 'Campaña Safety Gate 0014/11: Volvo S80');
});

test('títulos largos: variantes más cortas y nombres acortados, sin superar el máximo', () => {
  for (const locale of LOCALES) {
    const brandTitle = seoBrandTitle(SEO_TEST_LONG_BRAND, locale);
    assert.ok(seoTestFullLength(brandTitle) <= SEO_TITLE_MAX, brandTitle);
    const modelTitle = seoModelTitle(SEO_TEST_LONG_BRAND, 'Mobile homes – Roof canopy REMIStop 3 (400 x 400) Premium Edition', locale);
    assert.ok(seoTestFullLength(modelTitle) <= SEO_TITLE_MAX, modelTitle);
    const recall = seoTestRecall({ brand: SEO_TEST_LONG_BRAND, models: ['A'.repeat(SEO_TEST_WORST_LENGTH), 'B'.repeat(SEO_TEST_WORST_LENGTH)] });
    const campaignTitle = seoCampaignTitle(recall, locale);
    assert.ok(seoTestFullLength(campaignTitle) <= SEO_TITLE_MAX, campaignTitle);
  }
});

test('título de campaña: la marca se quita de cada modelo y no se repite', () => {
  const recall = seoTestRecall({ brand: 'BMW', models: ['BMW X5', 'BMW X6'] });
  assert.equal(seoCampaignTitle(recall, 'en'), 'Safety Gate Recall 0014/11: BMW X5, X6');
});

test('seoFitDescription: base en rango, relleno para las cortas, null si nada cabe', () => {
  const inRange = 'a'.repeat(SEO_DESCRIPTION_MIN);
  assert.equal(seoFitDescription([inRange], [' x']), inRange);
  const filled = seoFitDescription(['a'.repeat(SEO_DESCRIPTION_MIN - 5)], [' relleno largo largo', ' bien.']);
  assert.ok(filled !== null && filled.length >= SEO_DESCRIPTION_MIN && filled.length <= SEO_DESCRIPTION_MAX);
  assert.equal(seoFitDescription(['a'.repeat(SEO_DESCRIPTION_MAX + 1)], [' x']), null);
});

test('títulos y descripciones en español no usan el anglicismo "recall"', () => {
  const brandTitle = seoBrandTitle(SEO_TEST_LONG_BRAND, 'es');
  const modelTitle = seoModelTitle('Citroen, Opel, Peugeot', 'Peugeot C4 Picasso B78', 'es');
  const campaignTitle = seoCampaignTitle(seoTestRecall({ brand: SEO_TEST_LONG_BRAND, models: ['A'.repeat(SEO_TEST_WORST_LENGTH)] }), 'es');
  for (const title of [brandTitle, modelTitle, campaignTitle]) {
    assert.doesNotMatch(title, /recall/i, title);
  }
});

test('la descripción de un modelo sin años no deja comas vacías', () => {
  const description = seoModelDescription('Seat', 'Ibiza', 3, '', 'es');
  assert.doesNotMatch(description, /,\s*,/, description);
  assert.doesNotMatch(description, /\(\)/, description);
});
