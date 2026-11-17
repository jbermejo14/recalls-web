import brandRules from '../data/rules/brand-rules.json';
import modelRules from '../data/rules/model-rules.json';

export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD') // separate accents from characters
    .replace(/[\u0300-\u036f]/g, '') // remove accent diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with -
    .replace(/^-+|-+$/g, ''); // remove leading/trailing hyphens
}

export function caseNumberToSlug(caseNumber: string): string {
  if (!caseNumber) return 'alerta';
  return slugify(caseNumber.replace(/\//g, '-'));
}

export function normalizeBrand(rawBrand: string, fallbackText: string = ''): string | null {
  let b = (rawBrand || '').trim();

  // If brand is empty, try extracting from fallback text (e.g. type_numberOfModel)
  if (!b && fallbackText) {
    for (const pattern of brandRules.extractFromTextRegex) {
      const match = new RegExp(pattern, 'i').exec(fallbackText);
      if (match && match[1]) {
        b = match[1].trim();
        break;
      }
    }
  }

  if (!b) return null;

  const lower = b.toLowerCase();
  if (brandRules.ignoredBrands.includes(lower)) {
    return null;
  }

  // Check aliases dictionary
  const aliasMap = brandRules.aliases as Record<string, string>;
  if (aliasMap[lower]) {
    return aliasMap[lower];
  }

  // Title case if not in aliases
  return b
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function extractModels(
  brand: string,
  rawProduct: string,
  rawName: string,
  rawTypeMod: string
): string[] {
  const modelsFound = new Set<string>();

  // 1. Check known brand models dictionary
  const knownDict = modelRules.knownModelsByBrand as Record<string, string[]>;
  const knownList = knownDict[brand] || [];

  const combinedSearchText = ` ${rawProduct} ${rawName} ${rawTypeMod} `;

  for (const km of knownList) {
    // Regex boundary match to avoid false positives (e.g. "C3" in "C30")
    const escaped = km.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[\\s,;:/\\-"'“(])${escaped}(?:$|[\\s,;:/\\-"'”)])`, 'i');
    if (regex.test(combinedSearchText)) {
      modelsFound.add(km);
    }
  }

  // 2. If known models found, return them
  if (modelsFound.size > 0) {
    return Array.from(modelsFound);
  }

  // 3. Fallback: Parse from rawProduct or rawName using generic cleaning
  let sourceText = (rawName || '').trim();
  if (!sourceText) {
    sourceText = (rawProduct || '').trim();
  }

  if (!sourceText && rawTypeMod) {
    const firstLine = rawTypeMod.split(/\r?\n/)[0].split(',')[0].replace(/e\d+\*.*$/, '').trim();
    if (firstLine.length > 1 && firstLine.length < 40 && !firstLine.toLowerCase().includes('type')) {
      sourceText = firstLine;
    }
  }

  if (!sourceText) return [];

  // Remove generic prefixes
  for (const prefix of modelRules.genericPrefixes) {
    sourceText = sourceText.replace(new RegExp(prefix, 'i'), '');
  }

  // Remove quotes and punctuation
  sourceText = sourceText.replace(/^[“”"'«»]+|[“”"'«»]+$/g, '').trim();

  // Split on delimiters (commas, "and", "&", " y ")
  const chunks = sourceText
    .split(/,|\band\b|&|\by\b|\//i)
    .map(s => s.trim())
    .filter(Boolean);

  const genericSet = new Set(modelRules.genericTerms.map(t => t.toLowerCase()));

  for (let chunk of chunks) {
    // Clean chunk
    chunk = chunk.replace(/^[–\-—:]+\s*/, '').trim();
    const chunkLower = chunk.toLowerCase();

    // Check alias
    const aliasMap = modelRules.modelAliases as Record<string, string>;
    if (aliasMap[chunkLower]) {
      chunk = aliasMap[chunkLower];
    }

    if (chunk.length > 0 && !genericSet.has(chunk.toLowerCase()) && chunk.length < 50) {
      modelsFound.add(chunk);
    }
  }

  return Array.from(modelsFound);
}

// El XML de Safety Gate antepone a veces la cadena literal "null " a los textos
// (p. ej. "null The product poses a risk…"): es un defecto del origen, no un valor.
const SOURCE_NULL_PREFIX = /^null\s+/i;

/**
 * Limpia un texto libre del XML de Safety Gate: recorta espacios y quita el prefijo
 * literal "null " que el origen añade a algunas descripciones.
 */
export function cleanSourceText(text: string): string {
  return text.trim().replace(SOURCE_NULL_PREFIX, '');
}
