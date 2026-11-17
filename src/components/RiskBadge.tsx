import { Flame, AlertTriangle, Leaf, Zap, HelpCircle } from 'lucide-react';
import type { Locale } from '../lib/site';
import { getDictionary } from '../i18n/get-dictionary';

export default function RiskBadge({
  risk,
  lang,
  size = 'md'
}: {
  risk: string;
  lang: Locale;
  size?: 'sm' | 'md';
}) {
  const dict = getDictionary(lang);
  const rLower = (risk || '').toLowerCase();

  let label = risk;
  const riskMap = dict.risks as Record<string, string>;
  if (riskMap[risk]) {
    label = riskMap[risk];
  } else if (rLower.includes('fire') && rLower.includes('injuries')) {
    label = lang === 'es' ? 'Incendio y Lesiones' : 'Fire & Injuries';
  } else if (rLower.includes('fire')) {
    label = lang === 'es' ? 'Incendio' : 'Fire';
  } else if (rLower.includes('injuries')) {
    label = lang === 'es' ? 'Lesiones' : 'Injuries';
  } else if (rLower.includes('environment')) {
    label = lang === 'es' ? 'Medio Ambiente' : 'Environment';
  }

  const isFire = rLower.includes('fire') || rLower.includes('burn');
  const isInjuries = rLower.includes('injur');
  const isEnv = rLower.includes('environ');

  const colorClass = isFire
    ? 'bg-red-500/15 text-red-400 border-red-500/30'
    : isEnv
    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    : isInjuries
    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    : 'bg-blue-500/15 text-blue-400 border-blue-500/30';

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border ${colorClass} ${sizeClass}`}>
      {isFire && <Flame className="w-3.5 h-3.5" />}
      {isInjuries && !isFire && <AlertTriangle className="w-3.5 h-3.5" />}
      {isEnv && <Leaf className="w-3.5 h-3.5" />}
      {!isFire && !isInjuries && !isEnv && <Zap className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </span>
  );
}
