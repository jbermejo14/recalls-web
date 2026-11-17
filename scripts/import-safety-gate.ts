/**
 * Safety Gate XML Importer (scripts/import-safety-gate.ts)
 * --------------------------------------------------------
 * Official Source: Safety Gate (Rapid Alert System for dangerous non-food products),
 * Directorate-General for Justice and Consumers, European Commission.
 * Portal: https://ec.europa.eu/safety-gate-alerts/
 *
 * Update Automation Note:
 * 1. Weekly automated feeds can be retrieved from:
 *    https://ec.europa.eu/safety-gate-alerts/api/download/weeklyReport/list/xml/en
 * 2. Full historical multi-year category exports ("Motor vehicles"):
 *    - Visit https://ec.europa.eu/safety-gate-alerts/
 *    - Under "Category", select "Motor vehicles"
 *    - Click "Search" and then "Export XML"
 *    - Save the resulting file as `raw-data/safety-gate-motor-vehicles.xml`
 *    - Run `npm run import`
 *
 * Reuse conditions:
 * European Commission Decision 2011/833/EU of 12 December 2011 on the reuse of Commission documents.
 * Free commercial and non-commercial reuse with attribution: "Datos: Safety Gate, Comisión Europea".
 */

import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import { normalizeBrand, extractModels, slugify, caseNumberToSlug, cleanSourceText } from '../src/lib/normalizer';
import type { SafetyGateRecall, BrandSummary, SafetyGateDataset } from '../src/types/safety-gate';

const DEFAULT_XML_PATH = path.join(process.cwd(), 'raw-data', 'safety-gate-motor-vehicles.xml');
const OUTPUT_DATA_PATH = path.join(process.cwd(), 'src', 'data', 'safety-gate-data.json');
const LOG_FILE_PATH = path.join(process.cwd(), 'import.log');

function getTagValue(val: unknown): string {
  if (!val) return '';
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'object' && val !== null) {
    const obj = val as Record<string, unknown>;
    if (obj.__cdata !== undefined) return String(obj.__cdata).trim();
    if (obj._text !== undefined) return String(obj._text).trim();
  }
  return String(val).trim();
}

function parseEuropeanDate(dateStr: string): { iso: string; year: number } {
  // Expected formats: "DD-MM-YYYY" or "YYYY-MM-DD"
  const clean = dateStr.trim();
  const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(clean);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    return {
      iso: `${year}-${month}-${day}`,
      year: parseInt(year, 10)
    };
  }
  const yyyymmdd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(clean);
  if (yyyymmdd) {
    const [, year, month, day] = yyyymmdd;
    return {
      iso: `${year}-${month}-${day}`,
      year: parseInt(year, 10)
    };
  }
  return { iso: clean, year: 0 };
}

export async function importSafetyGate(
  xmlPath: string = DEFAULT_XML_PATH,
  outputPath: string | null = OUTPUT_DATA_PATH,
  logPath: string = LOG_FILE_PATH
): Promise<SafetyGateDataset> {
  console.log(`[Import] Starting Safety Gate import from: ${xmlPath}`);

  if (!fs.existsSync(xmlPath)) {
    throw new Error(`XML source file not found at: ${xmlPath}. Please download the export and place it in raw-data/`);
  }

  const logLines: string[] = [];
  const log = (msg: string) => {
    logLines.push(`[${new Date().toISOString()}] ${msg}`);
  };

  log(`Reading XML from ${xmlPath}`);
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');

  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: false,
    trimValues: true,
    cdataPropName: '__cdata'
  });

  const parsed = parser.parse(xmlContent);
  const rawNotifications = parsed['Safety-Gate']?.notifications || [];

  if (!Array.isArray(rawNotifications)) {
    throw new Error('Unexpected XML structure: <notifications> element is not an array.');
  }

  log(`Found ${rawNotifications.length} raw notification elements.`);

  const validRecalls: SafetyGateRecall[] = [];
  let uninterpretedCount = 0;
  const brandMap = new Map<string, {
    brand: string;
    brandSlug: string;
    recalls: SafetyGateRecall[];
    modelsMap: Map<string, { name: string; slug: string; recalls: SafetyGateRecall[] }>;
    risksBreakdown: Record<string, number>;
    yearsBreakdown: Record<string, number>;
  }>();

  for (let i = 0; i < rawNotifications.length; i++) {
    const raw = rawNotifications[i];
    const caseNumber = getTagValue(raw.caseNumber);
    const rawBrand = getTagValue(raw.brand);
    const rawProduct = getTagValue(raw.product);
    const rawName = getTagValue(raw.name);
    const rawTypeMod = getTagValue(raw.type_numberOfModel);
    const rawRisk = getTagValue(raw.riskType) || 'Injuries';
    const rawDanger = cleanSourceText(getTagValue(raw.danger));
    const rawMeasures = cleanSourceText(getTagValue(raw.measures));
    const rawRef = getTagValue(raw.reference);
    const rawPubDate = getTagValue(raw.publicationDate);
    const notifyingCountry = getTagValue(raw.notifyingCountry);
    const countryOfOrigin = getTagValue(raw.countryOfOrigin);
    const category = getTagValue(raw.category) || 'Motor vehicles';
    const productionDates = getTagValue(raw.productionDates);

    // Normalize Brand
    const normalizedBrand = normalizeBrand(rawBrand, rawTypeMod || rawProduct);

    if (!normalizedBrand) {
      uninterpretedCount++;
      log(`[SKIPPED] Record #${i + 1} (Case: ${caseNumber || 'N/A'}) - Brand could not be identified (rawBrand: "${rawBrand}", product: "${rawProduct.slice(0, 40)}")`);
      continue;
    }

    // Extract Models
    const extractedModels = extractModels(normalizedBrand, rawProduct, rawName, rawTypeMod);
    const modelSlugs = extractedModels.map(slugify);

    const { iso: publicationDate, year: publicationYear } = parseEuropeanDate(rawPubDate);
    const brandSlug = slugify(normalizedBrand);
    const slug = caseNumberToSlug(caseNumber);

    const recall: SafetyGateRecall = {
      caseNumber: caseNumber || `ALERT-${i + 1}`,
      slug,
      publicationDate,
      publicationYear,
      officialUrl: rawRef || `https://ec.europa.eu/safety-gate-alerts/screen/webReport/alertDetail/-${caseNumber}`,
      brand: normalizedBrand,
      brandSlug,
      models: extractedModels,
      modelSlugs,
      product: rawProduct,
      typeNumberOfModel: rawTypeMod,
      riskType: rawRisk,
      danger: rawDanger,
      measures: rawMeasures,
      typeApproval: rawTypeMod,
      productionDates,
      notifyingCountry,
      countryOfOrigin,
      category
    };

    validRecalls.push(recall);

    // Group by Brand
    if (!brandMap.has(brandSlug)) {
      brandMap.set(brandSlug, {
        brand: normalizedBrand,
        brandSlug,
        recalls: [],
        modelsMap: new Map(),
        risksBreakdown: {},
        yearsBreakdown: {}
      });
    }

    const bEntry = brandMap.get(brandSlug)!;
    bEntry.recalls.push(recall);

    // Risks breakdown
    bEntry.risksBreakdown[rawRisk] = (bEntry.risksBreakdown[rawRisk] || 0) + 1;

    // Years breakdown
    if (publicationYear > 1990 && publicationYear < 2050) {
      bEntry.yearsBreakdown[publicationYear] = (bEntry.yearsBreakdown[publicationYear] || 0) + 1;
    }

    // Models under this brand
    for (let mIdx = 0; mIdx < extractedModels.length; mIdx++) {
      const mName = extractedModels[mIdx];
      const mSlug = modelSlugs[mIdx];
      if (!bEntry.modelsMap.has(mSlug)) {
        bEntry.modelsMap.set(mSlug, {
          name: mName,
          slug: mSlug,
          recalls: []
        });
      }
      bEntry.modelsMap.get(mSlug)!.recalls.push(recall);
    }
  }

  // Compile Brand Summaries
  const brandsSummary: BrandSummary[] = Array.from(brandMap.values())
    .map(b => {
      const sortedRecalls = [...b.recalls].sort((x, y) => y.publicationDate.localeCompare(x.publicationDate));
      const lastRecallDate = sortedRecalls[0]?.publicationDate || '';

      const modelsList = Array.from(b.modelsMap.values())
        .map(m => {
          const sortedM = [...m.recalls].sort((x, y) => y.publicationDate.localeCompare(x.publicationDate));
          return {
            name: m.name,
            slug: m.slug,
            recallsCount: m.recalls.length,
            lastRecallDate: sortedM[0]?.publicationDate || ''
          };
        })
        .sort((a, b) => b.recallsCount - a.recallsCount);

      return {
        brand: b.brand,
        brandSlug: b.brandSlug,
        totalRecalls: b.recalls.length,
        lastRecallDate,
        risksBreakdown: b.risksBreakdown,
        yearsBreakdown: b.yearsBreakdown,
        models: modelsList
      };
    })
    .sort((a, b) => b.totalRecalls - a.totalRecalls);

  const totalModelsCount = brandsSummary.reduce((acc, b) => acc + b.models.length, 0);

  const dataset: SafetyGateDataset = {
    version: '1.0.0',
    importedAt: new Date().toISOString(),
    source: 'Safety Gate, European Commission (Directorate-General for Justice and Consumers)',
    sourceLicense: 'European Commission Decision 2011/833/EU (reuse of Commission documents)',
    totalRecalls: validRecalls.length,
    totalBrands: brandsSummary.length,
    totalModels: totalModelsCount,
    uninterpretedCount,
    recalls: validRecalls,
    brands: brandsSummary
  };

  // Write dataset if outputPath provided
  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2), 'utf8');
  }

  log(`Successfully written normalized dataset to ${OUTPUT_DATA_PATH}`);
  log(`Summary: ${validRecalls.length} valid recalls, ${brandsSummary.length} brands, ${totalModelsCount} models, ${uninterpretedCount} uninterpreted.`);

  // Write log file
  fs.writeFileSync(logPath, logLines.join('\n'), 'utf8');
  console.log(`[Import] Completed. Log written to ${logPath}`);
  console.log(` - Valid recalls: ${validRecalls.length}`);
  console.log(` - Discarded / Uninterpreted records: ${uninterpretedCount}`);
  console.log(` - Unique brands: ${brandsSummary.length}`);
  console.log(` - Unique models: ${totalModelsCount}`);

  return dataset;
}

// Run if called directly
if (require.main === module || process.argv[1]?.endsWith('import-safety-gate.ts')) {
  importSafetyGate().catch(err => {
    console.error('[Import] Fatal error:', err);
    process.exit(1);
  });
}
