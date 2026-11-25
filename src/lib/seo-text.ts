import { riskLabel } from './labels';
import { SITE_NAME, type Locale } from './site';
import type { SafetyGateRecall } from '../types/safety-gate';

/** Longitud máxima objetivo de un título completo (con « | Ododex»). */
export const SEO_TITLE_TARGET = 60;
/** Longitud máxima admitida de un título completo (con « | Ododex»). */
export const SEO_TITLE_MAX = 65;
/** Longitud mínima de una descripción. */
export const SEO_DESCRIPTION_MIN = 120;
/** Longitud máxima de una descripción. */
export const SEO_DESCRIPTION_MAX = 160;

/** Sufijo que la plantilla del layout añade a los títulos de las páginas. */
const SEO_TITLE_SUFFIX = ` | ${SITE_NAME}`;
// Tope de las partes variables cuando el nombre completo no cabe en ningún título (reservan sitio al resto).
const SEO_SHORT_BRAND_MAX = 22;
const SEO_SHORT_MODEL_MAX = 22;
// Tope del último intento de un título de modelo: marcas compuestas con modelos largos no caben con los de arriba.
const SEO_TIGHT_BRAND_MAX = 12;
const SEO_TIGHT_MODEL_MAX = 16;
const SEO_SHORT_CAMPAIGN_BRAND_MAX = 28;
const SEO_SHORT_DESCRIPTION_NAME_MAX = 40;
const SEO_MIN_SEGMENT_LENGTH = 3;
// Separadores tras los cuales el resto del nombre se considera un añadido (listas, aclaraciones, guiones largos).
const SEO_NAME_SEPARATOR = /\s[–—-]\s|[,;:(\n/]|\.\s/;
const SEO_WHITESPACE = /\s+/g;
const SEO_ELLIPSIS = '…';
const SEO_REGEX_SPECIALS = /[.*+?^${}()|[\]\\]/g;
// Un sufijo de cierre sin palabras sueltas: se retiran signos finales del texto cortado.
const SEO_TRAILING_PUNCTUATION = /[\s,;:.\-–—(]+$/;
const SEO_LIST_SEPARATOR = ', ';

/** Normaliza espacios y saltos de línea de un texto de los datos. */
export function seoClean(text: string): string {
  return (text || '').replace(SEO_WHITESPACE, ' ').trim();
}

/**
 * Acorta un nombre a `max` caracteres sin añadir puntos suspensivos: primero se queda con la parte
 * anterior al primer separador (coma, dos puntos, guion largo...) y, si aún no cabe, corta en el
 * último límite de palabra. Un nombre que ya cabe se devuelve tal cual (normalizado).
 */
export function seoShortenName(name: string, max: number): string {
  const clean = seoClean(name);
  if (clean.length <= max) return clean;
  const separator = SEO_NAME_SEPARATOR.exec(clean);
  const firstPart = separator && separator.index >= SEO_MIN_SEGMENT_LENGTH ? clean.slice(0, separator.index).trim() : clean;
  if (firstPart.length <= max) return firstPart;
  const cut = firstPart.slice(0, max + 1);
  const lastSpace = cut.lastIndexOf(' ');
  const wordCut = lastSpace >= SEO_MIN_SEGMENT_LENGTH ? cut.slice(0, lastSpace) : firstPart.slice(0, max);
  return wordCut.replace(SEO_TRAILING_PUNCTUATION, '');
}

function seoEscapeRegex(text: string): string {
  return text.replace(SEO_REGEX_SPECIALS, '\\$&');
}

function seoWordPattern(word: string, flags: string): RegExp {
  return new RegExp(`(?<![\\p{L}\\p{N}])${seoEscapeRegex(word)}(?![\\p{L}\\p{N}])`, flags);
}

/** Número de veces que aparece `word` como palabra completa en `text`, sin distinguir mayúsculas. */
export function seoCountWord(text: string, word: string): number {
  const clean = seoClean(word);
  if (clean === '') return 0;
  return (text.match(seoWordPattern(clean, 'giu')) || []).length;
}

/** Quita la marca del inicio de un modelo ("BMW X5" de la marca "BMW" queda "X5"). */
function seoStripBrandPrefix(brand: string, model: string): string {
  const prefix = seoClean(brand);
  const clean = seoClean(model);
  if (prefix === '' || clean.length <= prefix.length) return clean;
  const startsWithBrand = clean.slice(0, prefix.length).toLowerCase() === prefix.toLowerCase() && clean[prefix.length] === ' ';
  return startsWithBrand ? clean.slice(prefix.length + 1).trim() : clean;
}

/** Corta el modelo justo antes de la segunda aparición de la marca ("Mini Cooper S Mini Cooper S Clubman" queda "Mini Cooper S"). */
function seoCutRepeatedBrand(model: string, brand: string): string {
  const matches = [...model.matchAll(seoWordPattern(brand, 'giu'))];
  if (matches.length < 2) return model;
  return model.slice(0, matches[1].index).replace(SEO_TRAILING_PUNCTUATION, '');
}

/** Marca + modelo sin repetir la marca cuando el nombre del modelo ya la incluye. */
export function seoBrandAndModel(brand: string, model: string): string {
  const cleanBrand = seoClean(brand);
  const cleanModel = seoClean(model);
  if (cleanModel === '') return cleanBrand;
  if (seoCountWord(cleanModel, cleanBrand) > 0) return seoCutRepeatedBrand(cleanModel, cleanBrand);
  return `${cleanBrand} ${cleanModel}`;
}

function seoFullLength(title: string): number {
  return title.length + SEO_TITLE_SUFFIX.length;
}

function seoRepeatsBrand(title: string, brand: string): boolean {
  return seoCountWord(title, brand) > 1;
}

/** Primer candidato que cabe en el objetivo; si ninguno, el primero que cabe en el máximo; si no, null. */
function seoPickTitle(candidates: string[], brand: string): string | null {
  const valid = candidates.filter(title => !seoRepeatsBrand(title, brand));
  for (const limit of [SEO_TITLE_TARGET, SEO_TITLE_MAX]) {
    const fit = valid.find(title => seoFullLength(title) <= limit);
    if (fit !== undefined) return fit;
  }
  return null;
}

/** Prueba cada intento en orden (de nombres completos a nombres acortados) y devuelve el primer título que cabe. */
function seoFirstFit(attempts: Array<() => string[]>, brand: string): string {
  const tried: string[] = [];
  for (const attempt of attempts) {
    const candidates = attempt();
    const fit = seoPickTitle(candidates, brand);
    if (fit !== null) return fit;
    tried.push(...candidates);
  }
  throw new Error(`Ninguna variante de título cabe en ${SEO_TITLE_MAX} caracteres con la marca: ${tried.join(' / ')}. Añade una variante más corta.`);
}

/** Título (sin « | Ododex») de la página de una marca. */
export function seoBrandTitle(brand: string, locale: Locale): string {
  const build = (name: string): string[] =>
    locale === 'es' ? [`Llamadas a revisión de ${name}`, `Revisiones de ${name}`, `${name}: revisiones`] : [`${name} Recall Campaigns`, `${name} Recalls`];
  return seoFirstFit([() => build(seoClean(brand)), () => build(seoShortenName(brand, SEO_SHORT_BRAND_MAX))], brand);
}

/** Título (sin « | Ododex») de la página de un modelo. */
export function seoModelTitle(brand: string, model: string, locale: Locale): string {
  const build = (name: string): string[] =>
    locale === 'es' ? [`Llamadas a revisión de ${name}`, `Revisiones de ${name}`, `${name}: revisiones`] : [`${name} Recall Campaigns`, `${name} Recalls`];
  const shortBrand = seoShortenName(brand, SEO_SHORT_BRAND_MAX);
  const tightBrand = seoShortenName(brand, SEO_TIGHT_BRAND_MAX);
  return seoFirstFit(
    [
      () => build(seoBrandAndModel(brand, model)),
      () => build(seoBrandAndModel(shortBrand, seoShortenName(model, SEO_SHORT_MODEL_MAX))),
      () => build(seoBrandAndModel(tightBrand, seoShortenName(model, SEO_TIGHT_MODEL_MAX)))
    ],
    brand
  );
}

function seoCampaignModels(brand: string, models: string[]): string {
  const stripped = models.map(model => seoStripBrandPrefix(brand, model)).filter(Boolean);
  return stripped.join(SEO_LIST_SEPARATOR);
}

function seoCampaignCandidates(recall: SafetyGateRecall, brand: string, models: string[], locale: Locale): string[] {
  const full = locale === 'es' ? 'Campaña Safety Gate' : 'Safety Gate Recall';
  const lastResort = locale === 'es' ? 'Campaña' : 'Recall';
  const prefixes = [full, 'Safety Gate', lastResort].map(prefix => `${prefix} ${recall.caseNumber}: `);
  const withModels = models.length > 0 ? [seoBrandAndModel(brand, seoCampaignModels(brand, models))] : [];
  const withFirstModel = models.length > 1 ? [seoBrandAndModel(brand, models[0])] : [];
  const subjects = [...withModels, ...withFirstModel, brand];
  const candidates: string[] = [];
  for (const subject of subjects) {
    candidates.push(`${prefixes[0]}${subject}`);
  }
  candidates.push(`${prefixes[1]}${withFirstModel[0] ?? withModels[0] ?? brand}`, `${prefixes[1]}${brand}`, `${prefixes[2]}${brand}`);
  return candidates;
}

/** Título (sin « | Ododex») de la página de una campaña. */
export function seoCampaignTitle(recall: SafetyGateRecall, locale: Locale): string {
  const brand = seoClean(recall.brand);
  const models = recall.models.map(seoClean).filter(Boolean);
  const shortBrand = seoShortenName(brand, SEO_SHORT_CAMPAIGN_BRAND_MAX);
  const shortModels = models.slice(0, 1).map(model => seoShortenName(model, SEO_SHORT_MODEL_MAX));
  return seoFirstFit(
    [
      () => seoCampaignCandidates(recall, brand, models, locale),
      () => seoCampaignCandidates(recall, shortBrand, shortModels, locale)
    ],
    brand
  );
}

/**
 * Primer texto de 120-160 caracteres: cada base sola, o una base más una frase de relleno
 * (primero cada una por separado y luego acumuladas en orden). Devuelve null si ninguna combinación cabe.
 */
export function seoFitDescription(bases: string[], fillers: string[]): string | null {
  const inRange = (text: string) => text.length >= SEO_DESCRIPTION_MIN && text.length <= SEO_DESCRIPTION_MAX;
  for (const base of bases) {
    const prefixes = fillers.slice(1).map((_, index) => `${base}${fillers.slice(0, index + 2).join('')}`);
    const options = [base, ...fillers.map(filler => `${base}${filler}`), ...prefixes];
    const fit = options.find(inRange);
    if (fit !== undefined) return fit;
  }
  return null;
}

function seoFirstDescription(attempts: Array<() => string | null>): string {
  let last: string | null = null;
  for (const attempt of attempts) {
    last = attempt();
    if (last !== null) return last;
  }
  throw new Error('No hay ninguna combinación de descripción de 120 a 160 caracteres para esta página.');
}

const SEO_FILLERS: Record<Locale, string[]> = {
  es: [' Datos de Safety Gate, el sistema de alerta de la UE.', ' Consulta el historial completo.', ' Datos de Safety Gate (UE).'],
  en: [' Data from Safety Gate, the EU alert system.', ' Browse the full history.', ' Data from Safety Gate (EU).']
};

const SEO_CAMPAIGN_FILLERS: Record<Locale, string[]> = {
  es: [' Medidas adoptadas e información técnica de la UE.', ' Datos de Safety Gate (UE).', ' Consulta el peligro y las medidas.', ' Llamada a revisión notificada por los Estados miembros.'],
  en: [' Measures adopted and technical information from the EU.', ' Data from Safety Gate (EU).', ' Safety Gate.', ' Recall notified by the EU member states.']
};

function seoCountText(count: number, one: string, many: string): string {
  return count === 1 ? `1 ${one}` : `${count} ${many}`;
}

function seoCampaignsText(count: number, locale: Locale): string {
  return locale === 'es' ? seoCountText(count, 'campaña', 'campañas') : seoCountText(count, 'recall campaign', 'recall campaigns');
}

/** Descripción (120-160) de la página de una marca. */
export function seoBrandDescription(brand: string, campaigns: number, models: number, locale: Locale): string {
  const campaignsText = seoCampaignsText(campaigns, locale);
  const modelsText = locale === 'es' ? seoCountText(models, 'modelo', 'modelos') : seoCountText(models, 'model', 'models');
  const build = (name: string): string[] =>
    locale === 'es'
      ? [
          `Consulta ${campaignsText} de llamada a revisión de ${name} en Safety Gate (UE), con ${modelsText}, riesgos, fechas y medidas adoptadas.`,
          `Consulta ${campaignsText} de llamada a revisión de ${name} en Safety Gate (UE): riesgos, fechas y medidas.`,
          `${name}: ${campaignsText} de llamada a revisión en Safety Gate (UE). Modelos, riesgos, fechas y medidas.`,
          `${name}: ${campaignsText} en Safety Gate.`
        ]
      : [
          `Browse ${campaignsText} for ${name} in the EU Safety Gate system, covering ${modelsText}, safety risks, dates and the measures adopted.`,
          `Browse ${campaignsText} for ${name} in the EU Safety Gate system: risks, dates and measures.`,
          `${name}: ${campaignsText} in the EU Safety Gate system. Models, risks, dates and measures.`,
          `${name}: ${campaignsText} in Safety Gate.`
        ];
  return seoFirstDescription([
    () => seoFitDescription(build(seoClean(brand)), SEO_FILLERS[locale]),
    () => seoFitDescription(build(seoShortenName(brand, SEO_SHORT_DESCRIPTION_NAME_MAX)), SEO_FILLERS[locale])
  ]);
}

/** Descripción (120-160) de la página de un modelo; `years` es el intervalo "2011-2019" o el año único. */
export function seoModelDescription(brand: string, model: string, campaigns: number, years: string, locale: Locale): string {
  const campaignsText = seoCampaignsText(campaigns, locale);
  // Sin años (datos sin fecha de publicación) se omite el fragmento entero, no solo el valor.
  const yearsList = years === '' ? '' : `, ${years}`;
  const yearsParens = years === '' ? '' : ` (${years})`;
  const build = (name: string): string[] =>
    locale === 'es'
      ? [
          `Historial de alertas de seguridad de ${name}: ${campaignsText} de llamada a revisión en Safety Gate (UE)${yearsList}, con riesgos y medidas.`,
          `${name}: ${campaignsText} de llamada a revisión en Safety Gate (UE)${yearsList}. Riesgos, fechas y medidas adoptadas.`,
          `${name}: ${campaignsText} de llamada a revisión en Safety Gate (UE)${yearsParens}.`,
          `${name}: ${campaignsText} en Safety Gate.`
        ]
      : [
          `Safety recall history for the ${name}: ${campaignsText} in the EU Safety Gate system${yearsList}, with the risks and measures involved.`,
          `${name}: ${campaignsText} in the EU Safety Gate system${yearsList}. Risks, dates and measures adopted.`,
          `${name}: ${campaignsText} in the EU Safety Gate system${yearsParens}.`,
          `${name}: ${campaignsText} in Safety Gate.`
        ];
  const shortName = seoBrandAndModel(
    seoShortenName(brand, SEO_SHORT_BRAND_MAX),
    seoShortenName(model, SEO_SHORT_DESCRIPTION_NAME_MAX - SEO_SHORT_BRAND_MAX)
  );
  return seoFirstDescription([
    () => seoFitDescription(build(seoBrandAndModel(brand, model)), SEO_FILLERS[locale]),
    () => seoFitDescription(build(shortName), SEO_FILLERS[locale])
  ]);
}

/** Corta el peligro en un límite de palabra para que quepa en `room` caracteres, con puntos suspensivos. */
function seoDangerSnippet(danger: string, room: number): string {
  const clean = seoClean(danger);
  if (clean.length <= room) return clean;
  const cut = clean.slice(0, room - SEO_ELLIPSIS.length + 1);
  const lastSpace = cut.lastIndexOf(' ');
  const words = lastSpace > 0 ? cut.slice(0, lastSpace) : cut.slice(0, room - SEO_ELLIPSIS.length);
  return `${words.replace(SEO_TRAILING_PUNCTUATION, '')}${SEO_ELLIPSIS}`;
}

/** Descripción (120-160) de la página de una campaña: marca, caso, riesgo y comienzo del peligro. */
export function seoCampaignDescription(recall: SafetyGateRecall, locale: Locale): string {
  const risk = riskLabel(recall.riskType, locale);
  const build = (brand: string): string[] => {
    const head = `${brand} (${recall.caseNumber}): ${risk}.`;
    const room = SEO_DESCRIPTION_MAX - head.length - 1;
    const withDanger = seoClean(recall.danger) !== '' && room > SEO_DESCRIPTION_MIN / 4 ? [`${head} ${seoDangerSnippet(recall.danger, room)}`] : [];
    return [...withDanger, head, `${brand} (${recall.caseNumber}).`];
  };
  const fillers = SEO_CAMPAIGN_FILLERS[locale];
  return seoFirstDescription([
    () => seoFitDescription(build(seoClean(recall.brand)), fillers),
    () => seoFitDescription(build(seoShortenName(recall.brand, SEO_SHORT_DESCRIPTION_NAME_MAX)), fillers)
  ]);
}
