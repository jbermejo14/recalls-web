export const defaultLocale = 'es';
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export function isSupportedLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}
