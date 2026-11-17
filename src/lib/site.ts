/** Nombre de la marca de la red de webs. */
export const SITE_NAME = 'Ododex';

export type Locale = 'es' | 'en';

/** Idiomas admitidos, en el orden en que aparecen en hreflang. */
export const LOCALES: readonly Locale[] = ['es', 'en'];

/** Idioma por defecto y destino de x-default. */
export const DEFAULT_LOCALE: Locale = 'es';

/** Rutas base públicas por idioma. Sin barra final. */
export const BASE_PATHS: Record<Locale, string> = {
  es: '/es/llamadas-revision',
  en: '/en/recalls'
};

/** Nombre de la sección en la cabecera, por idioma. */
export const SECTION_NAMES: Record<Locale, string> = {
  es: 'Llamadas a revisión',
  en: 'Vehicle recalls'
};

const DEFAULT_SITE_URL = 'http://localhost:3050';
const X_DEFAULT = 'x-default';
// '/campana/<slug>' o '/marca/<marca>/<modelo>', con barra final opcional.
const HTML_ONLY_ROUTE = /^\/(campana\/[^/]+|marca\/[^/]+\/[^/]+)\/?$/;

function siteIsLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

function siteRoutePart(path: string): string {
  if (path === '' || path === '/') return '';
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Idioma de esta compilación, leído de RECALLS_LANG (por defecto 'es').
 * Se accede a process.env.RECALLS_LANG de forma literal para que Next lo inyecte también en el cliente.
 * Lanza Error si el valor no es un idioma admitido.
 */
export function getLocale(): Locale {
  const value = process.env.RECALLS_LANG || DEFAULT_LOCALE;
  if (!siteIsLocale(value)) {
    throw new Error(`RECALLS_LANG="${value}" no es válido. Valores admitidos: ${LOCALES.join(', ')}.`);
  }
  return value;
}

/** Ruta base de esta compilación: BASE_PATHS[getLocale()]. */
export function getBasePath(): string {
  return BASE_PATHS[getLocale()];
}

/** Origen sin barra final: NEXT_PUBLIC_SITE_URL o http://localhost:3050. */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  return url.replace(/\/+$/, '');
}

/** URL absoluta de una ruta interna en el idioma indicado (por defecto, el de la compilación). */
export function absoluteUrl(path: string, locale: Locale = getLocale()): string {
  return `${getSiteUrl()}${BASE_PATHS[locale]}${siteRoutePart(path)}`;
}

/** Ruta base + ruta, para <img>, <a> sin next/link y fetch. */
export function assetPath(path: string): string {
  return `${getBasePath()}${siteRoutePart(path)}`;
}

/** Ruta pública (sin origen) de la misma página en el otro idioma: BASE_PATHS[otro] + path. */
export function otherLocalePath(path: string): string {
  const other = LOCALES.find(locale => locale !== getLocale()) as Locale;
  return `${BASE_PATHS[other]}${siteRoutePart(path)}`;
}

/** { es, en, 'x-default' (= es) } con URLs absolutas, para hreflang. */
export function alternateUrls(path: string): Record<string, string> {
  const urls: Record<string, string> = {};
  for (const locale of LOCALES) {
    urls[locale] = absoluteUrl(path, locale);
  }
  urls[X_DEFAULT] = absoluteUrl(path, DEFAULT_LOCALE);
  return urls;
}

/** true para '/campana/<slug>' y '/marca/<marca>/<modelo>': páginas publicadas solo como HTML. */
export function isHtmlOnlyRoute(path: string): boolean {
  return HTML_ONLY_ROUTE.test(path.split(/[?#]/)[0]);
}
