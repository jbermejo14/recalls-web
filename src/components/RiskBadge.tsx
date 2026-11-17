import { Flame, AlertTriangle, Leaf, Zap } from 'lucide-react';
import type { Locale } from '../lib/site';
import { getDictionary } from '../i18n/get-dictionary';

type RiskLevel = 'fire' | 'injuries' | 'environment' | 'other';

const RISK_TAG_CLASSES: Record<RiskLevel, string> = {
  fire: 'tag tag-red',
  injuries: 'tag tag-warning',
  environment: 'tag tag-green',
  other: 'tag'
};

const RISK_LABELS: Record<Exclude<RiskLevel, 'other'>, Record<Locale, string>> = {
  fire: { es: 'Incendio', en: 'Fire' },
  injuries: { es: 'Lesiones', en: 'Injuries' },
  environment: { es: 'Medio Ambiente', en: 'Environment' }
};

const FIRE_AND_INJURIES_LABEL: Record<Locale, string> = { es: 'Incendio y Lesiones', en: 'Fire & Injuries' };

function riskLevelOf(risk: string): RiskLevel {
  const normalized = risk.toLowerCase();
  if (normalized.includes('fire') || normalized.includes('burn')) return 'fire';
  if (normalized.includes('injur')) return 'injuries';
  if (normalized.includes('environ')) return 'environment';
  return 'other';
}

function riskLabelOf(risk: string, level: RiskLevel, lang: Locale): string {
  const dictionaryLabel = (getDictionary(lang).risks as Record<string, string>)[risk];
  if (dictionaryLabel) return dictionaryLabel;
  const normalized = risk.toLowerCase();
  if (level === 'fire' && normalized.includes('injur')) return FIRE_AND_INJURIES_LABEL[lang];
  return level === 'other' ? risk : RISK_LABELS[level][lang];
}

function RiskIcon({ level }: { level: RiskLevel }) {
  if (level === 'fire') return <Flame className="w-3.5 h-3.5" />;
  if (level === 'injuries') return <AlertTriangle className="w-3.5 h-3.5" />;
  if (level === 'environment') return <Leaf className="w-3.5 h-3.5" />;
  return <Zap className="w-3.5 h-3.5" />;
}

/** Etiqueta de riesgo: rojo para incendio, ámbar para lesiones, verde para medio ambiente y neutra para el resto. */
export default function RiskBadge({
  risk,
  lang,
  size = 'md'
}: {
  risk: string;
  lang: Locale;
  size?: 'sm' | 'md';
}) {
  const level = riskLevelOf(risk || '');
  const sizeClass = size === 'sm' ? 'tag-xs' : '';

  return (
    <span className={`${RISK_TAG_CLASSES[level]} ${sizeClass} inline-flex items-center gap-1.5 whitespace-normal font-bold uppercase tracking-wider`}>
      <RiskIcon level={level} />
      <span>{riskLabelOf(risk || '', level, lang)}</span>
    </span>
  );
}
