import Link from 'next/link';
import { ShieldCheck, ExternalLink, AlertTriangle } from 'lucide-react';
import type { Locale } from '../i18n/config';
import { getDictionary, formatText } from '../i18n/get-dictionary';
import { getSafetyGateDataset } from '../lib/safety-gate-service';

export default function Footer({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  let importDate = '2026';
  try {
    const dataset = getSafetyGateDataset();
    importDate = new Date(dataset.importedAt).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {}

  return (
    <footer className="mt-20 border-t border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)]">
      {/* Prominent Disclaimer Banner */}
      <div className="border-b border-[var(--border-color)] bg-[#FF5500]/5 py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-start gap-4">
          <div className="p-2 bg-[#FF5500]/10 rounded-lg text-[#FF5500] shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text-primary)] font-bold block mb-1">
              {lang === 'es' ? 'Metodología y Fiabilidad:' : 'Methodology & Reliability Notice:'}
            </strong>
            {dict.disclaimerText}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Col 1: About */}
          <div>
            <div className="font-black text-lg text-[var(--text-primary)] mb-2">
              RECALL<span className="text-[#FF5500]">SCOPE</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
              {dict.siteTagline}.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[#FF5500]">
              <ShieldCheck className="w-4 h-4" />
              <span>{dict.officialSourceNotice}</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <div className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider mb-3">
              {lang === 'es' ? 'Navegación' : 'Navigation'}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${lang}`} className="hover:text-[#FF5500] transition-colors">
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}#marcas`} className="hover:text-[#FF5500] transition-colors">
                  {dict.nav.brands}
                </Link>
              </li>
              <li>
                <a
                  href="https://ec.europa.eu/safety-gate-alerts/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF5500] transition-colors inline-flex items-center gap-1"
                >
                  <span>{dict.viewOfficialAlert}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Attribution & Legal */}
          <div>
            <div className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider mb-3">
              {lang === 'es' ? 'Fuente de los datos y reutilización' : 'Data Source & Reuse'}
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-2">
              {formatText(dict.lastImportDate, { date: importDate })}
            </p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {dict.sourceLicenseNotice}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--text-muted)] gap-2">
          <p>© {new Date().getFullYear()} RECALLSCOPE. {dict.officialSourceNotice}.</p>
          <p className="text-right">
            {lang === 'es' ? 'Portal independiente de consulta de llamadas a revisión en la UE' : 'Independent EU safety recall query portal'}
          </p>
        </div>
      </div>
    </footer>
  );
}
