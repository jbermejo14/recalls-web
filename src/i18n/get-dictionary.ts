import type { Locale } from './config';
import es from './dictionaries/es.json';
import en from './dictionaries/en.json';

const dictionaries: Record<Locale, typeof es> = {
  es,
  en
};

export function getDictionary(locale: Locale): typeof es {
  return dictionaries[locale] || dictionaries.es;
}

export function formatText(template: string, replacements: Record<string, string | number>): string {
  let str = template;
  for (const [k, v] of Object.entries(replacements)) {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  return str;
}
