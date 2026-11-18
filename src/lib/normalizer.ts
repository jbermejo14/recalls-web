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

// Delimitadores entre modelos: coma, "and", "&", "y" y "/".
const NORMALIZER_DELIMITERS = /,|\band\b|&|\by\b|\//i;
// Versión adherente (sticky): comprueba si hay un delimitador justo en `lastIndex`.
const NORMALIZER_DELIMITER_AT_POSITION = /,|\band\b|&|\by\b|\//iy;

function normalizerCleanChunks(chunks: string[]): string[] {
  return chunks.map(chunk => chunk.trim()).filter(Boolean);
}

/**
 * Divide un texto de modelos por los delimitadores solo a profundidad 0 de paréntesis.
 * Si los paréntesis quedan sin cerrar, vuelve al partido simple por todos los delimitadores.
 */
function normalizerSplitModelText(text: string): string[] {
  const chunks: string[] = [];
  let depth = 0;
  let chunkStart = 0;
  let index = 0;
  while (index < text.length) {
    const char = text[index];
    if (char === '(') depth++;
    if (char === ')' && depth > 0) depth--;
    NORMALIZER_DELIMITER_AT_POSITION.lastIndex = index;
    const delimiter = depth === 0 ? NORMALIZER_DELIMITER_AT_POSITION.exec(text) : null;
    if (delimiter) {
      chunks.push(text.slice(chunkStart, index));
      index += delimiter[0].length;
      chunkStart = index;
    } else {
      index++;
    }
  }
  chunks.push(text.slice(chunkStart));
  if (depth !== 0) return normalizerCleanChunks(text.split(NORMALIZER_DELIMITERS));
  return normalizerCleanChunks(chunks);
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
  const chunks = normalizerSplitModelText(sourceText);

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
