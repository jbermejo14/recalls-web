import type { Metadata } from 'next';
import InternalLink from '../../../../components/InternalLink';
import { notFound } from 'next/navigation';
import { ShieldAlert, Car, Calendar, ArrowRight, ArrowLeft, AlertTriangle, ExternalLink, ShieldCheck, Layers } from 'lucide-react';
import { getLocale } from '../../../../lib/site';
import { riskLabel, countryLabel, productLabel } from '../../../../lib/labels';
import { getDictionary, formatText } from '../../../../i18n/get-dictionary';
import { getAllBrands, getModelBySlugs } from '../../../../lib/safety-gate-service';
import { buildPageMetadata } from '../../../../lib/seo';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import AdSlot from '../../../../components/AdSlot';
import DisclaimerBanner from '../../../../components/DisclaimerBanner';
import RiskBadge from '../../../../components/RiskBadge';

export const dynamicParams = false;

export async function generateStaticParams() {
  const brands = getAllBrands();
  const params: { marca: string; modelo: string }[] = [];
  for (const b of brands) {
    for (const m of b.models) {
      params.push({ marca: b.brandSlug, modelo: m.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ marca: string; modelo: string }>;
}): Promise<Metadata> {
  const { marca, modelo } = await params;

  const modelData = getModelBySlugs(marca, modelo);
  if (!modelData) return {};

  const dict = getDictionary(getLocale());
  const { brand, model } = modelData;

  const title = `${formatText(dict.modelPage.title, {
    brand: brand.brand,
    model: model.name
  })}`;
  const description = formatText(dict.modelPage.description, {
    brand: brand.brand,
    model: model.name
  });

  return buildPageMetadata({
    path: `/marca/${marca}/${modelo}`,
    title,
    description
  });
}

export default async function ModelPage({
  params
}: {
  params: Promise<{ marca: string; modelo: string }>;
}) {
  const { marca, modelo } = await params;

  const modelData = getModelBySlugs(marca, modelo);
  if (!modelData) {
    notFound();
  }

  const locale = getLocale();
  const dict = getDictionary(locale);
  const { brand, model, recalls, risksBreakdown, yearsBreakdown } = modelData;

  const headingTitle = formatText(dict.modelPage.heading, {
    brand: brand.brand,
    model: model.name
  });

  const breadcrumbs = [
    { name: dict.breadcrumbs.home, url: '/' },
    { name: dict.breadcrumbs.brands, url: '/#marcas' },
    { name: brand.brand, url: `/marca/${brand.brandSlug}` },
    { name: model.name, url: `/marca/${brand.brandSlug}/${model.slug}` }
  ];

  const sortedRisks = Object.entries(risksBreakdown).sort((a, b) => b[1] - a[1]);
  const sortedYears = Object.entries(yearsBreakdown).sort((a, b) => b[0].localeCompare(a[0]));
  const siblingModels = brand.models.filter((m) => m.slug !== model.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      {/* Model Header */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold uppercase tracking-wider">
              <Car className="w-3.5 h-3.5" />
              <InternalLink href={`/marca/${brand.brandSlug}`} className="hover:underline">
                {brand.brand}
              </InternalLink>
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
            <div className="p-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-center min-w-[120px]">
              <div className="text-3xl font-black text-accent">
                {model.recallsCount}
              </div>
              <div className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                {dict.breadcrumbs.campaigns}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-center min-w-[120px]">
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
            <AlertTriangle className="w-5 h-5 text-accent" />
            <span>{dict.modelPage.riskBreakdown}</span>
          </h2>

          <div className="space-y-3 pt-2">
            {sortedRisks.map(([risk, count]) => {
              const percent = Math.round((count / model.recallsCount) * 100);
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
            })}
          </div>
        </div>

        {/* Year Breakdown */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            <span>{dict.modelPage.yearBreakdown}</span>
          </h2>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
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

      {/* Model Recalls List */}
      <section className="space-y-4">
        <div className="border-b border-[var(--border-color)] pb-3 flex items-center justify-between">
          <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-accent" />
            <span>{formatText(dict.modelPage.campaignListTitle, { brand: brand.brand, model: model.name })} ({recalls.length})</span>
          </h2>
        </div>

        <div className="space-y-3">
          {recalls.map(r => (
            <InternalLink
              key={r.slug}
              href={`/campana/${r.slug}`}
              className="group block p-5 rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] hover:border-accent transition-all shadow-sm"
            >
              <div className="space-y-2">
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

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                  {r.danger}
                </p>

                <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">
                    {dict.campaignPage.notifyingCountry} <strong className="text-[var(--text-primary)]">{countryLabel(r.notifyingCountry, locale) || 'UE'}</strong>
                  </span>
                  <span className="font-bold text-accent inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{dict.breadcrumbs.campaigns}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </InternalLink>
          ))}
        </div>
      </section>

      {/* Sibling Models */}
      {siblingModels.length > 0 && (
        <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent" />
            <span>
              {locale === 'es'
                ? `Otros modelos de ${brand.brand} con avisos Safety Gate`
                : `Other ${brand.brand} models with Safety Gate recalls`}
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
            {siblingModels.slice(0, 12).map((m) => (
              <InternalLink
                key={m.slug}
                href={`/marca/${brand.brandSlug}/${m.slug}`}
                className="p-3 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] hover:border-accent transition-colors block text-left"
              >
                <div className="text-sm font-bold text-[var(--text-primary)] truncate">
                  {m.name}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  {m.recallsCount} {locale === 'es' ? 'campañas' : 'recalls'}
                </div>
              </InternalLink>
            ))}
          </div>
          {siblingModels.length > 12 && (
            <div className="pt-2">
              <InternalLink
                href={`/marca/${brand.brandSlug}`}
                className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
              >
                <span>
                  {locale === 'es'
                    ? `Ver todos los ${siblingModels.length + 1} modelos de ${brand.brand}`
                    : `View all ${siblingModels.length + 1} ${brand.brand} models`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </InternalLink>
            </div>
          )}
        </section>
      )}

      {/* Red Ododex Cross-linking */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>{locale === 'es' ? 'Red Ododex · Trámites y Guías del Vehículo' : 'Ododex Network · Vehicle Tools & Guides'}</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
          {locale === 'es'
            ? `¿Vas a comprar un ${brand.brand} ${model.name} de segunda mano?`
            : `Buying a used ${brand.brand} ${model.name}?`}
        </h3>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          {locale === 'es'
            ? `Además de revisar las llamadas a revisión oficiales del sistema Safety Gate, comprueba el Impuesto de Transmisiones Patrimoniales (ITP) de tu comunidad autónoma y las tablas oficiales de Hacienda.`
            : `Along with Safety Gate recall checks, calculate transfer taxes and official valuation tables before closing the purchase.`}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="https://ododex.com/es/impuestos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent text-white font-semibold text-xs hover:opacity-90 transition-opacity"
          >
            <span>{locale === 'es' ? 'Calculadora ITP Coche Usado' : 'Car Transfer Tax Calculator'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://ododex.com/es/gasolineras"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-xs hover:border-accent transition-colors"
          >
            <span>{locale === 'es' ? 'Gasolineras Baratas España' : 'Fuel Prices Spain'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Back to Brand Link */}
      <div className="pt-4 flex items-center justify-between">
        <InternalLink
          href={`/marca/${brand.brandSlug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {locale === 'es' ? `Ver todos los modelos de ${brand.brand}` : `View all ${brand.brand} models`}
          </span>
        </InternalLink>
      </div>

      <AdSlot />
    </div>
  );
}
