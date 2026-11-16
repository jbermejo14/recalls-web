import Link from 'next/link';
import { ShieldAlert, Car, ExternalLink } from 'lucide-react';
import type { Locale } from '../i18n/config';
import { getDictionary } from '../i18n/get-dictionary';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--bg-page)]/90 border-b border-[var(--border-color)]">
      {/* Top micro banner */}
      <div className="bg-[#050608] text-[11px] py-1 border-b border-[#FF5500]/20 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse"></span>
            <span className="text-[#FF5500] font-bold">SAFETY GATE</span>
            <span className="hidden sm:inline">| {dict.officialSourceNotice}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>2005 - 2026</span>
            <span className="text-gray-300">🇪🇺 {lang === 'es' ? 'Unión Europea' : 'European Union'}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6A00] to-[#D43E00] flex items-center justify-center text-white shadow-lg shadow-[#FF5500]/25 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-lg sm:text-xl tracking-tight leading-none text-[var(--text-primary)]">
              RECALL<span className="text-[#FF5500]">SCOPE</span>
            </div>
            <div className="text-[10px] font-semibold tracking-wider uppercase text-[var(--text-muted)] mt-0.5">
              {dict.siteTagline}
            </div>
          </div>
        </Link>

        {/* Links & Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="hidden md:flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]">
            <Link
              href={`/${lang}`}
              className="px-3 py-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
            >
              {dict.nav.home}
            </Link>
            <Link
              href={`/${lang}#marcas`}
              className="px-3 py-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors flex items-center gap-1.5"
            >
              <Car className="w-4 h-4 text-[#FF5500]" />
              <span>{dict.nav.brands}</span>
            </Link>
            <a
              href="https://ec.europa.eu/safety-gate-alerts/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors flex items-center gap-1 text-xs text-[var(--text-muted)]"
            >
              <span>{dict.nav.safetyGate}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </nav>

          <LanguageSwitcher currentLocale={lang} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
