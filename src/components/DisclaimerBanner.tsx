import { Info } from 'lucide-react';
import type { Locale } from '../lib/site';
import { getDictionary } from '../i18n/get-dictionary';

export default function DisclaimerBanner({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);

  return (
    <div className="alert-warning flex items-start gap-3.5 my-6">
      <Info className="w-5 h-5 text-warning shrink-0 mt-0.5" aria-hidden="true" />
      <div className="text-xs sm:text-sm leading-relaxed">
        <strong className="text-warning font-bold block mb-1">
          {lang === 'es' ? 'Aviso sobre fiabilidad y volumen de ventas:' : 'Notice on reliability & sales volume:'}
        </strong>
        {dict.disclaimerText}
      </div>
    </div>
  );
}
