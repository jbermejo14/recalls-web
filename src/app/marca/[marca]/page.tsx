import type { Metadata } from 'next';
import InternalLink from '../../../components/InternalLink';
import { notFound } from 'next/navigation';
import { ShieldAlert, Car, Calendar, ArrowRight, ArrowLeft, ExternalLink, Activity, AlertTriangle, Layers } from 'lucide-react';
import { getLocale } from '../../../lib/site';
import { riskLabel, countryLabel, productLabel } from '../../../lib/labels';
import { getDictionary, formatText } from '../../../i18n/get-dictionary';
import { getAllBrands, getBrandBySlug } from '../../../lib/safety-gate-service';
import { brandPageMetadata } from '../../../lib/page-metadata';
import Breadcrumbs from '../../../components/Breadcrumbs';
import AdSlot from '../../../components/AdSlot';
import DisclaimerBanner from '../../../components/DisclaimerBanner';
import RiskBadge from '../../../components/RiskBadge';

export const dynamicParams = false;

export async function generateStaticParams() {
  const brands = getAllBrands();
  const params: { marca: string }[] = [];
  for (const b of brands) {
    params.push({ marca: b.brandSlug });
  }
  return params;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ marca: string }>;
}): Promise<Metadata> {
  const { marca } = await params;
  return brandPageMetadata(marca);
}

export default async function BrandPage({
  params
}: {
  params: Promise<{ marca: string }>;
}) {
  const { marca } = await params;

  const brandData = getBrandBySlug(marca);
  if (!brandData) {
    notFound();
  }

  const locale = getLocale();
  const dict = getDictionary(locale);
  const { brand, recalls } = brandData;

  const breadcrumbs = [
    { name: dict.breadcrumbs.home, url: '/' },
    { name: dict.breadcrumbs.brands, url: '/#marcas' },
    { name: brand.brand, url: `/marca/${brand.brandSlug}` }
  ];

  // Sort risks by count descending
  const sortedRisks = Object.entries(brand.risksBreakdown || {}).sort((a, b) => b[1] - a[1]);

  // Sort years descending
  const sortedYears = Object.entries(brand.yearsBreakdown || {}).sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* Brand Header */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold uppercase tracking-wider">
              <Car className="w-3.5 h-3.5" />
              <span>{dict.officialSourceNotice}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
              {brand.brand}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              {formatText(dict.brandPage.description, { brand: brand.brand })}
            </p>
          </div>

          {/* Quick stats badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-center min-w-[110px]">
              <div className="text-2xl font-black text-accent">
                {brand.totalRecalls}
              </div>
              <div className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                {dict.breadcrumbs.campaigns}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-center min-w-[110px]">
              <div className="text-2xl font-black text-[var(--text-primary)]">
                {brand.models.length}
              </div>
              <div className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                {dict.breadcrumbs.models}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-center col-span-2 sm:col-span-1 min-w-[110px]">
              <div className="text-sm font-black text-[var(--text-primary)] mt-1 font-mono">
                {brand.lastRecallDate || 'N/A'}
              </div>
              <div className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                {formatText(dict.brandPage.lastCampaign, { date: '' }).replace(':', '').trim()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objective notice banner */}
      <DisclaimerBanner lang={locale} />

      {/* Objective Breakdowns Grid: Risks & Years */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Type Breakdown */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent" />
            <span>{dict.brandPage.riskBreakdown}</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            {locale === 'es'
              ? 'Distribución de alertas según la categoría de riesgo notificada por las autoridades europeas.'
              : 'Distribution of recall alerts by danger classification reported by European authorities.'}
          </p>

          <div className="space-y-3 pt-2">
            {sortedRisks.length === 0 ? (
              <div className="text-xs text-[var(--text-muted)] py-4 text-center">N/A</div>
            ) : (
              sortedRisks.map(([risk, count]) => {
                const percent = Math.round((count / brand.totalRecalls) * 100);
                return (
                  <div key={risk} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--text-secondary)]">{riskLabel(risk, locale)}</span>
                      <span className="font-mono text-[var(--text-muted)] font-bold">
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--bg-body)] overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Year Breakdown */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            <span>{dict.brandPage.yearBreakdown}</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            {locale === 'es'
              ? 'Número de campañas publicadas en el sistema europeo Safety Gate por año.'
              : 'Number of recall campaigns published on European Safety Gate per year.'}
          </p>

          <div className="max-h-72 overflow-y-auto space-y-2 pr-2">
            {sortedYears.map(([yr, count]) => (
              <div
                key={yr}
                className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-body)] text-xs border border-[var(--border-color)]"
              >
                <span className="font-mono font-bold text-[var(--text-primary)]">{yr}</span>
                <span className="font-bold text-accent">{count} {dict.breadcrumbs.campaigns}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdSlot />

      {/* Brand Models List */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border-color)] pb-3 flex items-center justify-between">
          <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent" />
            <span>{formatText(dict.brandPage.modelsHeader, { brand: brand.brand })}</span>
          </h2>
          <span className="text-xs font-bold text-[var(--text-muted)]">
            {brand.models.length} {dict.breadcrumbs.models}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {brand.models.map(m => (
            <InternalLink
              key={m.slug}
              href={`/marca/${brand.brandSlug}/${m.slug}`}
              className="group p-4 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] hover:border-accent transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)] group-hover:text-accent transition-colors truncate">
                  {m.name}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  {m.recallsCount} {dict.breadcrumbs.campaigns}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-accent font-semibold">
                <span>{dict.breadcrumbs.campaigns}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </InternalLink>
          ))}
        </div>
      </section>

      {/* Recalls List for Brand */}
      <section className="space-y-4 pt-4">
        <div className="border-b border-[var(--border-color)] pb-3 flex items-center justify-between">
          <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-accent" />
            <span>{formatText(dict.brandPage.campaignsHeader, { brand: brand.brand })} ({recalls.length})</span>
          </h2>
        </div>

        <div className="space-y-3">
          {recalls.map(r => (
            <InternalLink
              key={r.slug}
              href={`/campana/${r.slug}`}
              className="group block p-5 rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] hover:border-accent transition-all shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-mono font-bold text-accent bg-accent-soft px-2.5 py-1 rounded-md">
                      {r.caseNumber}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {r.publicationDate}
                    </span>
                    <RiskBadge risk={r.riskType} lang={locale} />
                  </div>

                  {r.product && (
                    <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-accent transition-colors">
                      {productLabel(r.product, locale)}
                    </h3>
                  )}

                  {r.models.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap text-xs text-[var(--text-muted)]">
                      <span className="font-semibold text-[var(--text-secondary)]">{dict.breadcrumbs.models}:</span>
                      {r.models.map(m => (
                        <span key={m} className="px-2 py-0.5 rounded bg-[var(--bg-body)] border border-[var(--border-color)] text-[var(--text-primary)]">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed pt-1">
                    {r.danger}
                  </p>
                </div>

                <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-2 md:pt-0">
                  <span className="text-xs font-bold text-accent inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{dict.breadcrumbs.campaigns}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </InternalLink>
          ))}
        </div>
      </section>

      <AdSlot />
    </div>
  );
}
