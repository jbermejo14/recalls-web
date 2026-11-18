import { Flame, AlertTriangle, Leaf, Zap } from 'lucide-react';
import type { Locale } from '../lib/site';
import { riskLabel } from '../lib/labels';

type RiskLevel = 'fire' | 'injuries' | 'environment' | 'other';

const RISK_TAG_CLASSES: Record<RiskLevel, string> = {
  fire: 'tag tag-red',
  injuries: 'tag tag-warning',
  environment: 'tag tag-green',
  other: 'tag'
};

function riskLevelOf(risk: string): RiskLevel {
  const normalized = risk.toLowerCase();
  if (normalized.includes('fire') || normalized.includes('burn')) return 'fire';
  if (normalized.includes('injur')) return 'injuries';
  if (normalized.includes('environ')) return 'environment';
  return 'other';
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
      <span>{riskLabel(risk || '', lang)}</span>
    </span>
  );
}
