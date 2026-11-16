import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import path from 'path';
import { normalizeBrand, extractModels, slugify, caseNumberToSlug } from '../src/lib/normalizer';
import { importSafetyGate } from '../scripts/import-safety-gate';
import { buildCanonicalUrl, buildHreflangAlternates, generateBreadcrumbSchema } from '../src/lib/seo';
import { getBrandBySlug, getModelBySlugs, getRecallBySlug } from '../src/lib/safety-gate-service';
import sitemap from '../src/app/sitemap';

describe('Normalizer & Slugs Unit Tests', () => {
  test('slugify generates URL-safe strings without accents or special chars', () => {
    assert.equal(slugify('Citroën C3 Aircross'), 'citroen-c3-aircross');
    assert.equal(slugify('Škoda Octavia II'), 'skoda-octavia-ii');
    assert.equal(slugify('Mercedes-Benz / EvoBus'), 'mercedes-benz-evobus');
    assert.equal(slugify('  Van “Primastar”  '), 'van-primastar');
  });

  test('caseNumberToSlug transforms case number into clean URL slug', () => {
    assert.equal(caseNumberToSlug('0014/11'), '0014-11');
    assert.equal(caseNumberToSlug('A12/00115/26'), 'a12-00115-26');
    assert.equal(caseNumberToSlug(''), 'alerta');
  });

  test('normalizeBrand maps aliases and corrects diacritics', () => {
    assert.equal(normalizeBrand('mercedes benz'), 'Mercedes-Benz');
    assert.equal(normalizeBrand('CITROEN'), 'Citroën');
    assert.equal(normalizeBrand('vw'), 'Volkswagen');
    assert.equal(normalizeBrand('Seat'), 'SEAT');
    assert.equal(normalizeBrand('skoda'), 'Škoda');
    assert.equal(normalizeBrand('Bmw'), 'BMW');
  });

  test('normalizeBrand discards empty or unknown brands', () => {
    assert.equal(normalizeBrand(''), null);
    assert.equal(normalizeBrand('unknown'), null);
    assert.equal(normalizeBrand('   '), null);
    assert.equal(normalizeBrand('various'), null);
  });

  test('extractModels separates multiple models correctly', () => {
    const volvoModels = extractModels(
      'Volvo',
      'Passenger car S80, S60, V70, V60, XC60, XC70, C30, S40, V50',
      '',
      'S80 - e4*2001/116*0057*14'
    );
    assert.ok(volvoModels.includes('S80'));
    assert.ok(volvoModels.includes('XC60'));
    assert.ok(volvoModels.includes('V70'));
    assert.ok(volvoModels.includes('C30'));
    assert.ok(volvoModels.length >= 8);
  });

  test('extractModels parses models with quotes and and-conjunctions', () => {
    const nissanModels = extractModels('Nissan', 'Van “Primastar”', '', 'Primastar X83');
    assert.deepEqual(nissanModels, ['Primastar']);

    const peugeotModels = extractModels('Peugeot', 'Van', 'Traveller and Expert', 'e2*2007/46*0532*00');
    assert.ok(peugeotModels.includes('Traveller'));
    assert.ok(peugeotModels.includes('Expert'));
  });
});

describe('Offline XML Fixture Import & Structural Integrity Tests', () => {
  const fixturePath = path.join(__dirname, 'fixtures', 'sample-safety-gate.xml');

  test('importer correctly processes fixture without network and discards invalid records', async () => {
    const dataset = await importSafetyGate(fixturePath, null);

    // 6 records in fixture, 1 is invalid (no brand) -> 5 valid recalls, 1 uninterpreted
    assert.equal(dataset.totalRecalls, 5);
    assert.equal(dataset.uninterpretedCount, 1);

    // Verify brands
    const brandNames = dataset.brands.map(b => b.brand);
    assert.ok(brandNames.includes('Volvo'));
    assert.ok(brandNames.includes('Nissan'));
    assert.ok(brandNames.includes('Mercedes-Benz'));
    assert.ok(brandNames.includes('Citroën'));
    assert.ok(brandNames.includes('Peugeot'));
    assert.ok(!brandNames.includes('')); // No empty brand allowed

    // Verify slug existence
    for (const r of dataset.recalls) {
      assert.ok(r.slug.length > 0);
      assert.ok(r.brandSlug.length > 0);
      assert.ok(!r.slug.includes('/'));
      assert.ok(r.officialUrl.startsWith('https://'));
    }
  });

  test('simulated 404 validation for nonexistent brand or model', async () => {
    const dataset = await importSafetyGate(fixturePath, null);
    const brandMap = new Map(dataset.brands.map(b => [b.brandSlug, b]));

    // Known brand should exist
    assert.ok(brandMap.has('volvo'));
    // Unknown brand slug must yield undefined (triggering notFound() / 404)
    assert.equal(brandMap.has('marca-fantasma-inexistente'), false);
    assert.equal(brandMap.has('ferrari-404'), false);
  });

  test('service lookups return null for nonexistent entities (triggering 404)', () => {
    assert.equal(getBrandBySlug('marca-que-no-existe-nunca-12345'), null);
    assert.equal(getModelBySlugs('mercedes-benz', 'modelo-ficticio-xyz-999'), null);
    assert.equal(getRecallBySlug('alerta-inexistente-0000000'), null);
  });

  test('hreflang alternates and canonical SEO URLs include reciprocal links and x-default', () => {
    const path = '/marca/seat';
    const alternates = buildHreflangAlternates(path);

    assert.ok(alternates['es']);
    assert.ok(alternates['en']);
    assert.ok(alternates['x-default']);
    assert.ok(alternates['es'].endsWith('/es/marca/seat'));
    assert.ok(alternates['en'].endsWith('/en/marca/seat'));
    assert.equal(alternates['x-default'], alternates['es']);

    const canonicalEs = buildCanonicalUrl(path, 'es');
    assert.ok(canonicalEs.endsWith('/es/marca/seat'));
  });

  test('sitemap generates valid XML route entries with language alternates', async () => {
    const entries = await sitemap();
    assert.ok(Array.isArray(entries));
    assert.ok(entries.length > 100);

    // Verify home entries
    const homeEntry = entries.find(e => e.url.endsWith('/es'));
    assert.ok(homeEntry);
    assert.equal(homeEntry.priority, 1.0);
    assert.ok(homeEntry.alternates?.languages?.['es']);
    assert.ok(homeEntry.alternates?.languages?.['en']);
    assert.ok(homeEntry.alternates?.languages?.['x-default']);

    // Verify brand entries
    const brandEntry = entries.find(e => e.url.includes('/marca/'));
    assert.ok(brandEntry);
    assert.ok(brandEntry.priority && brandEntry.priority >= 0.7);
  });
});
