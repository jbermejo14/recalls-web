import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldAlert, Car, Calendar, ExternalLink, ArrowLeft, Globe, Wrench, AlertTriangle, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { locales, isSupportedLocale, type Locale } from '../../../../i18n/config';
import { getDictionary, formatText } from '../../../../i18n/get-dictionary';
import { getSafetyGateDataset, getRecallBySlug, getBrandBySlug } from '../../../../lib/safety-gate-service';
import { buildPageMetadata } from '../../../../lib/seo';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import DisclaimerBanner from '../../../../components/DisclaimerBanner';
import RiskBadge from '../../../../components/RiskBadge';

export const dynamicParams = false;

export async function generateStaticParams() {
  const dataset = getSafetyGateDataset();
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    for (const r of dataset.recalls) {
      params.push({ lang, slug: r.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isSupportedLocale(lang)) return {};

  const recall = getRecallBySlug(slug);
  if (!recall) return {};

  const dict = getDictionary(lang as Locale);
  const primaryModel = recall.models[0] || '';
  const brandAndModel = primaryModel ? `${recall.brand} ${primaryModel}` : recall.brand;

  const title = `${formatText(dict.campaignPage.title, {
    caseNumber: recall.caseNumber,
    brand: recall.brand,
    models: recall.models.join(', ') || ''
  })} | Safety Gate UE`;

  const description = `${recall.brand} (${recall.caseNumber}): ${recall.riskType}. ${recall.danger.slice(0, 140)}...`;

  return buildPageMetadata({
    locale: lang as Locale,
    path: `/campana/${slug}`,
    title,
    description,
    ogType: 'article'
  });
}

export default async function CampaignPage({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const recall = getRecallBySlug(slug);
  if (!recall) {
    notFound();
  }

  const locale = lang as Locale;
  const dict = getDictionary(locale);

  const primaryModel = recall.models[0] || null;
  const primaryModelSlug = recall.modelSlugs[0] || null;

  const breadcrumbs = [
    { name: dict.breadcrumbs.home, url: `/${locale}` },
    { name: recall.brand, url: `/${locale}/marca/${recall.brandSlug}` }
  ];

  if (primaryModel && primaryModelSlug) {
    breadcrumbs.push({
      name: primaryModel,
      url: `/${locale}/marca/${recall.brandSlug}/${primaryModelSlug}`
    });
  }

  breadcrumbs.push({
    name: recall.caseNumber,
    url: `/${locale}/campana/${recall.slug}`
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      <Breadcrumbs lang={locale} items={breadcrumbs} />

      {/* Campaign Header Box */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs sm:text-sm font-bold text-[#FF5500] bg-[#FF5500]/10 border border-[#FF5500]/30 px-3 py-1 rounded-lg">
                {dict.campaignPage.caseNumber} {recall.caseNumber}
              </span>
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {recall.publicationDate}
              </span>
              <RiskBadge risk={recall.riskType} lang={locale} />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-primary)] tracking-tight">
              {recall.brand} {recall.models.length > 0 ? `• ${recall.models.join(', ')}` : ''}
            </h1>

            {recall.product && (
              <div className="text-sm text-[var(--text-secondary)] font-medium">
                {recall.product}
              </div>
            )}
          </div>

          {/* Official Button */}
          {recall.officialUrl && (
            <a
              href={recall.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-sm transition-all shadow-md shadow-[#FF5500]/25 shrink-0"
            >
              <span>{dict.viewOfficialAlert}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Affected Models badges */}
        {recall.models.length > 0 && (
          <div className="pt-4 border-t border-[var(--border-color)] space-y-2">
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              {dict.campaignPage.affectedModels}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {recall.models.map((modName, idx) => {
                const mSlug = recall.modelSlugs[idx];
                if (!mSlug) {
                  return (
                    <span key={modName} className="px-3 py-1 rounded-lg bg-[var(--bg-page)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)]">
                      {modName}
                    </span>
                  );
                }
                return (
                  <Link
                    key={modName}
                    href={`/${locale}/marca/${recall.brandSlug}/${mSlug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-page)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] hover:border-[#FF5500]/40 text-xs font-semibold text-[var(--text-primary)] hover:text-[#FF5500] transition-colors"
                  >
                    <Car className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>{modName}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Objective notice */}
      <DisclaimerBanner lang={locale} />

      {/* Main Details Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metadata Card */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4 md:col-span-1">
          <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FF5500]" />
            <span>{dict.campaignPage.typeApprovalSection}</span>
          </h2>

          <dl className="space-y-3 text-xs">
            <div>
              <dt className="text-[var(--text-muted)] font-semibold">{dict.breadcrumbs.brands}:</dt>
              <dd className="font-bold text-[var(--text-primary)] mt-0.5">
                <Link href={`/${locale}/marca/${recall.brandSlug}`} className="text-[#FF5500] hover:underline">
                  {recall.brand}
                </Link>
              </dd>
            </div>

            <div>
              <dt className="text-[var(--text-muted)] font-semibold">{dict.campaignPage.notifyingCountry}</dt>
              <dd className="font-bold text-[var(--text-primary)] mt-0.5">
                {recall.notifyingCountry || 'UE'}
              </dd>
            </div>

            {recall.countryOfOrigin && (
              <div>
                <dt className="text-[var(--text-muted)] font-semibold">{dict.campaignPage.countryOfOrigin}</dt>
                <dd className="font-bold text-[var(--text-primary)] mt-0.5">
                  {recall.countryOfOrigin}
                </dd>
              </div>
            )}

            {recall.typeApproval && (
              <div>
                <dt className="text-[var(--text-muted)] font-semibold">{dict.campaignPage.typeApprovalSection}:</dt>
                <dd className="font-mono text-[var(--text-secondary)] mt-0.5 break-words">
                  {recall.typeApproval}
                </dd>
              </div>
            )}

            {recall.productionDates && (
              <div>
                <dt className="text-[var(--text-muted)] font-semibold">{dict.campaignPage.productionDatesSection}:</dt>
                <dd className="text-[var(--text-secondary)] mt-0.5">
                  {recall.productionDates}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Danger & Measures Sections */}
        <div className="md:col-span-2 space-y-6">
          {/* Danger description box */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#FF5500]" />
                <span>{dict.campaignPage.dangerSection}</span>
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[var(--bg-page)] border border-[var(--border-color)] text-[var(--text-muted)]">
                {dict.originalTextBadge}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-sans whitespace-pre-wrap">
              {recall.danger || (lang === 'es' ? 'No disponible en el registro oficial.' : 'Not available in official record.')}
            </div>
          </div>

          {/* Measures description box */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#FF5500]" />
                <span>{dict.campaignPage.measuresSection}</span>
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[var(--bg-page)] border border-[var(--border-color)] text-[var(--text-muted)]">
                {dict.originalTextBadge}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-sans whitespace-pre-wrap">
              {recall.measures || (lang === 'es' ? 'No constan medidas adicionales.' : 'No additional measures specified.')}
            </div>
          </div>
        </div>
      </section>

      {/* Free EU Repair Legal Notice */}
      <section className="p-6 rounded-2xl bg-[#FF5500]/10 border border-[#FF5500]/30 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FF5500] text-white flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[var(--text-primary)]">
            {lang === 'es' ? 'Garantía legal europea de reparación gratuita' : 'European Legal Guarantee of Free Repair'}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          {dict.campaignPage.freeRepairNotice}
        </p>
      </section>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Link
          href={`/${locale}/marca/${recall.brandSlug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF5500] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {lang === 'es' ? `Volver a ${recall.brand}` : `Back to ${recall.brand}`}
          </span>
        </Link>

        {recall.officialUrl && (
          <a
            href={recall.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[#FF5500] transition-colors"
          >
            <span>{dict.officialSourceNotice}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
