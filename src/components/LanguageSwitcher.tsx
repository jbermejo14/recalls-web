'use client';

import { usePathname } from 'next/navigation';
import { LOCALES, otherLocalePath, type Locale } from '../lib/site';

const LANGUAGE_LABELS: Record<Locale, { flag: string; code: string; title: string }> = {
  es: { flag: '🇪🇸', code: 'ES', title: 'Español' },
  en: { flag: '🇬🇧', code: 'EN', title: 'English' }
};

const ITEM_BASE = 'px-2.5 py-1 rounded-full transition-all';
const ITEM_ACTIVE = 'bg-accent-solid text-on-accent shadow-sm';
const ITEM_INACTIVE = 'text-[var(--text-muted)] hover:text-[var(--text-primary)]';

/**
 * Selector de idioma. Cada idioma es otro Worker, así que el cambio es un <a> normal
 * (no next/link) a la misma página bajo la ruta base del otro idioma.
 * usePathname() no incluye el basePath: es la ruta interna.
 */
export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname() || '/';

  return (
    <div className="flex items-center gap-1 p-1 bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-full text-xs font-bold">
      {LOCALES.map(locale => {
        const label = LANGUAGE_LABELS[locale];
        const content = `${label.flag} ${label.code}`;
        if (locale === currentLocale) {
          return (
            <span key={locale} className={`${ITEM_BASE} ${ITEM_ACTIVE}`} title={label.title} aria-current="true">
              {content}
            </span>
          );
        }
        return (
          <a key={locale} href={otherLocalePath(pathname)} hrefLang={locale} className={`${ITEM_BASE} ${ITEM_INACTIVE}`} title={label.title}>
            {content}
          </a>
        );
      })}
    </div>
  );
}
