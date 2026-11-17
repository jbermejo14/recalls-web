import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldAlert, Car, Calendar, ArrowRight, ArrowLeft, AlertTriangle, ExternalLink, ShieldCheck, Layers } from 'lucide-react';
import { locales, isSupportedLocale, type Locale } from '../../../../../i18n/config';
import { getDictionary, formatText } from '../../../../../i18n/get-dictionary';
import { getAllBrands, getModelBySlugs } from '../../../../../lib/safety-gate-service';
import { buildPageMetadata } from '../../../../../lib/seo';
import Breadcrumbs from '../../../../../components/Breadcrumbs';
import DisclaimerBanner from '../../../../../components/DisclaimerBanner';
import RiskBadge from '../../../../../components/RiskBadge';

export const dynamicParams = false;

export async function generateStaticParams() {
  const brands = getAllBrands();
  const params: { lang: string; marca: string; modelo: string }[] = [];
  for (const lang of locales) {
    for (const b of brands) {
      for (const m of b.models) {
        params.push({
          lang,
          marca: b.brandSlug,
          modelo: m.slug
        });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string; marca: string; modelo: string }>;
}): Promise<Metadata> {
  const { lang, marca, modelo } = await params;
  if (!isSupportedLocale(lang)) return {};

  const modelData = getModelBySlugs(marca, modelo);
  if (!modelData) return {};

  const dict = getDictionary(lang as Locale);
  const { brand, model } = modelData;

  const title = `${formatText(dict.modelPage.title, {
    brand: brand.brand,
    model: model.name
  })} | Safety Gate UE`;
  const description = formatText(dict.modelPage.description, {
    brand: brand.brand,
    model: model.name
  });

  return buildPageMetadata({
    locale: lang as Locale,
    path: `/marca/${marca}/${modelo}`,
    title,
    description
  });
}

export default async function ModelPage({
  params
}: {
  params: Promise<{ lang: string; marca: string; modelo: string }>;
}) {
  const { lang, marca, modelo } = await params;
  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const modelData = getModelBySlugs(marca, modelo);
  if (!modelData) {
    notFound();
  }

  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const { brand, model, recalls, risksBreakdown, yearsBreakdown } = modelData;

  const headingTitle = formatText(dict.modelPage.heading, {
    brand: brand.brand,
    model: model.name
  });

  const breadcrumbs = [
    { name: dict.breadcrumbs.home, url: `/${locale}` },
    { name: dict.breadcrumbs.brands, url: `/${locale}#marcas` },
    { name: brand.brand, url: `/${locale}/marca/${brand.brandSlug}` },
    { name: model.name, url: `/${locale}/marca/${brand.brandSlug}/${model.slug}` }
  ];

  const sortedRisks = Object.entries(risksBreakdown).sort((a, b) => b[1] - a[1]);
  const sortedYears = Object.entries(yearsBreakdown).sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <Breadcrumbs lang={locale} items={breadcrumbs} />

      {/* Model Header */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5500]/10 text-[#FF5500] text-xs font-bold uppercase tracking-wider">
              <Car className="w-3.5 h-3.5" />
              <Link href={`/${locale}/marca/${brand.brandSlug}`} className="hover:underline">
                {brand.brand}
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight">
              {headingTitle}
            </h1>

            <p className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              {formatText(dict.modelPage.description, { brand: brand.brand, model: model.name })}
            </p>
          </div>

          {/* Quick stats badges */}
          <div className="flex items-center gap-3">
            <div className="p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] text-center min-w-[120px]">
              <div className="text-3xl font-black text-[#FF5500]">
                {model.recallsCount}
              </div>
              <div className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                {dict.breadcrumbs.campaigns}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] text-center min-w-[120px]">
              <div className="text-sm font-black text-[var(--text-primary)] mt-1 font-mono">
                {model.lastRecallDate || 'N/A'}
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
        {/* Risk Breakdown */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#FF5500]" />
            <span>{dict.modelPage.riskBreakdown}</span>
          </h2>

          <div className="space-y-3 pt-2">
            {sortedRisks.map(([risk, count]) => {
              const percent = Math.round((count / model.recallsCount) * 100);
              return (
                <div key={risk} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--text-secondary)]">{risk}</span>
                    <span className="font-mono text-[var(--text-muted)] font-bold">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--bg-page)] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF5500] to-[#E04B00] rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Year Breakdown */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FF5500]" />
            <span>{dict.modelPage.yearBreakdown}</span>
          </h2>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {sortedYears.map(([yr, count]) => (
              <div
                key={yr}
                className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-page)] text-xs border border-[var(--border-color)]"
              >
                <span className="font-mono font-bold text-[var(--text-primary)]">{yr}</span>
                <span className="font-bold text-[#FF5500]">{count} {dict.breadcrumbs.campaigns}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Model Recalls List */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border-color)] pb-3 flex items-center justify-between">
          <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#FF5500]" />
            <span>{dict.modelPage.campaignListTitle} ({recalls.length})</span>
          </h2>
        </div>

        <div className="space-y-3">
          {recalls.map(r => (
            <Link
              key={r.slug}
              href={`/${locale}/campana/${r.slug}`}
              className="group block p-5 rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] hover:border-[#FF5500]/50 transition-all shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-mono font-bold text-[#FF5500] bg-[#FF5500]/10 px-2.5 py-1 rounded-md">
                    {r.caseNumber}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {r.publicationDate}
                  </span>
                  <RiskBadge risk={r.riskType} lang={locale} />
                </div>

                {r.product && (
                  <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[#FF5500] transition-colors">
                    {r.product}
                  </h3>
                )}

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                  {r.danger}
                </p>

                <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">
                    {dict.campaignPage.notifyingCountry} <strong className="text-[var(--text-primary)]">{r.notifyingCountry || 'UE'}</strong>
                  </span>
                  <span className="font-bold text-[#FF5500] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{dict.breadcrumbs.campaigns}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Back to Brand Link */}
      <div className="pt-4 flex items-center justify-between">
        <Link
          href={`/${locale}/marca/${brand.brandSlug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF5500] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {lang === 'es' ? `Ver todos los modelos de ${brand.brand}` : `View all ${brand.brand} models`}
          </span>
        </Link>
      </div>
    </div>
  );
}
