import { Info } from 'lucide-react';
import type { Locale } from '../i18n/config';
import { getDictionary } from '../i18n/get-dictionary';

export default function DisclaimerBanner({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 flex items-start gap-3.5 my-6">
      <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500 shrink-0 mt-0.5">
        <Info className="w-5 h-5" />
      </div>
      <div className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
        <strong className="text-amber-500 font-bold block mb-1">
          {lang === 'es' ? 'Aviso sobre fiabilidad y volumen de ventas:' : 'Notice on reliability & sales volume:'}
        </strong>
        {dict.disclaimerText}
      </div>
    </div>
  );
}
