import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldAlert, Car, Calendar, ExternalLink, ArrowRight, ShieldCheck, Database, Layers } from 'lucide-react';
import { isSupportedLocale, type Locale } from '../../i18n/config';
import { getDictionary, formatText } from '../../i18n/get-dictionary';
import { getSafetyGateDataset, getTopBrands, getLatestRecalls } from '../../lib/safety-gate-service';
import { buildPageMetadata, generateBreadcrumbSchema } from '../../lib/seo';
import SearchClient from '../../components/SearchClient';
import DisclaimerBanner from '../../components/DisclaimerBanner';
import RiskBadge from '../../components/RiskBadge';

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) return {};

  const dict = getDictionary(lang as Locale);
  return buildPageMetadata({
    locale: lang as Locale,
    path: '/',
    title: `${dict.siteTitle} | Safety Gate UE`,
    description: dict.siteTagline
  });
}

export default async function HomePage({
  params
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const dataset = getSafetyGateDataset();
  const topBrands = getTopBrands(36);
  const latestRecalls = getLatestRecalls(24);

  const breadcrumbsJsonLd = generateBreadcrumbSchema([
    { name: dict.breadcrumbs.home, item: `/${locale}` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-4 sm:pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 text-[#FF5500] text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
            <span>Safety Gate UE • RAPEX</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-tight max-w-4xl mx-auto">
            {lang === 'es' ? (
              <>
                Consultor de <span className="text-[#FF5500]">Llamadas a Revisión</span> y Alertas de Vehículos
              </>
            ) : (
              <>
                European Vehicle <span className="text-[#FF5500]">Recall & Safety</span> Gate Alerts Directory
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            {dict.siteTagline}. {lang === 'es'
              ? 'Consulta las alertas oficiales publicadas por las autoridades de consumo de la Unión Europea para turismos, motocicletas, furgonetas y vehículos comerciales.'
              : 'Search official alerts published by European Union consumer safety authorities for passenger cars, motorcycles, vans, and commercial vehicles.'}
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4">
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-[#FF5500]">
                {dataset.totalRecalls.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                {dict.home.statsRecalls}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
                {dataset.totalBrands.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                {dict.home.statsBrands}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
                {dataset.totalModels.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                {dict.home.statsModels}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-[#FF5500]">
                2005 - 2026
              </div>
              <div className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                {lang === 'es' ? 'Histórico Oficial' : 'Official Archive'}
              </div>
            </div>
          </div>
        </section>

        {/* Objective Reliability Disclaimer Banner */}
        <DisclaimerBanner lang={locale} />

        {/* Interactive Search Client */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-[#FF5500]" />
              <span>{dict.home.searchHeader}</span>
            </h2>
            <span className="text-xs text-[var(--text-muted)]">
              {lang === 'es' ? 'Búsqueda en tiempo real' : 'Real-time search'}
            </span>
          </div>

          <SearchClient
            lang={locale}
            brands={topBrands}
            recentRecalls={latestRecalls}
          />
        </section>

        {/* Brands Directory Grid */}
        <section id="marcas" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[var(--border-color)] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] flex items-center gap-2">
                <Car className="w-6 h-6 text-[#FF5500]" />
                <span>{dict.home.topBrandsTitle}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                {dict.home.browseByBrand}
              </p>
            </div>
            <div className="text-xs font-bold text-[var(--text-secondary)]">
              {topBrands.length} / {dataset.totalBrands} {dict.breadcrumbs.brands}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {topBrands.map(b => (
              <Link
                key={b.brandSlug}
                href={`/${locale}/marca/${b.brandSlug}`}
                className="group p-4 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] hover:border-[#FF5500]/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="text-sm font-black text-[var(--text-primary)] group-hover:text-[#FF5500] transition-colors truncate">
                    {b.brand}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    {b.models.length} {dict.breadcrumbs.models}
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#FF5500]">
                    {b.totalRecalls} {dict.breadcrumbs.campaigns}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:translate-x-1 group-hover:text-[#FF5500] transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Recalls Section */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[var(--border-color)] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#FF5500]" />
                <span>{dict.home.latestRecallsTitle}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                {lang === 'es'
                  ? 'Últimas notificaciones notificadas a través de la red europea Safety Gate.'
                  : 'Latest notifications reported through the European Safety Gate network.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestRecalls.slice(0, 12).map(r => (
              <Link
                key={r.slug}
                href={`/${locale}/campana/${r.slug}`}
                className="group p-5 rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] hover:border-[#FF5500]/50 transition-all shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[#FF5500] bg-[#FF5500]/10 px-2.5 py-1 rounded-md">
                      {r.caseNumber}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {r.publicationDate}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-base text-[var(--text-primary)] group-hover:text-[#FF5500] transition-colors">
                      {r.brand} {r.models.length > 0 ? `• ${r.models.join(', ')}` : ''}
                    </h3>
                    {r.product && (
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">
                        {r.product}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {r.danger}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                  <RiskBadge risk={r.riskType} lang={locale} />
                  <span className="text-xs font-bold text-[#FF5500] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{dict.breadcrumbs.campaigns}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Institutional & Legal Re-use notice */}
        <section className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003399] text-white flex items-center justify-center font-bold text-sm">
              🇪🇺
            </div>
            <div>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                {dict.officialSourceNotice}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {dict.sourceLicenseNotice}
              </p>
            </div>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {lang === 'es'
              ? 'Safety Gate es el sistema de alerta rápida de la Comisión Europea para productos peligrosos no alimentarios. Si su vehículo está afectado por una llamada a revisión por motivos de seguridad, el fabricante está obligado por ley a realizar las reparaciones o sustituciones de componentes de forma gratuita en su red oficial de concesionarios.'
              : 'Safety Gate is the European Commission rapid alert system for dangerous non-food products. If your vehicle is affected by an official safety recall, the manufacturer is legally required to carry out all necessary repairs or component replacements free of charge at their authorized service centers.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
            <a
              href="https://ec.europa.eu/safety-gate-alerts/screen/webReport"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#FF5500] hover:underline"
            >
              <span>{dict.viewOfficialAlert}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-[var(--text-muted)]">|</span>
            <span className="text-[var(--text-muted)]">
              {formatText(dict.lastImportDate, {
                date: new Date(dataset.importedAt).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')
              })}
            </span>
          </div>
        </section>
      </div>
    </>
  );
}
