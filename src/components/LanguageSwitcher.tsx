'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { Locale } from '../i18n/config';

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname() || `/${currentLocale}`;

  // Replace current locale prefix with target locale
  const getLocalizedPath = (targetLocale: Locale) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return `/${targetLocale}`;
    segments[0] = targetLocale;
    return `/${segments.join('/')}`;
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] rounded-full text-xs font-bold">
      <Link
        href={getLocalizedPath('es')}
        className={`px-2.5 py-1 rounded-full transition-all ${
          currentLocale === 'es'
            ? 'bg-[#FF5500] text-white shadow-sm'
            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
        }`}
        title="Español"
      >
        🇪🇸 ES
      </Link>
      <Link
        href={getLocalizedPath('en')}
        className={`px-2.5 py-1 rounded-full transition-all ${
          currentLocale === 'en'
            ? 'bg-[#FF5500] text-white shadow-sm'
            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
        }`}
        title="English"
      >
        🇬🇧 EN
      </Link>
    </div>
  );
}
