import type { MetadataRoute } from 'next';
import { getSafetyGateDataset } from '../lib/safety-gate-service';
import { getSiteUrl, buildCanonicalUrl, buildHreflangAlternates } from '../lib/seo';
import { locales } from '../i18n/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dataset = getSafetyGateDataset();
  const siteUrl = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [];

  // Home pages
  for (const locale of locales) {
    entries.push({
      url: `${siteUrl}/${locale}`,
      lastModified: new Date(dataset.importedAt),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: buildHreflangAlternates('/')
      }
    });
  }

  // Brand pages
  for (const brand of dataset.brands) {
    for (const locale of locales) {
      entries.push({
        url: buildCanonicalUrl(`/marca/${brand.brandSlug}`, locale),
        lastModified: brand.lastRecallDate ? new Date(brand.lastRecallDate) : new Date(dataset.importedAt),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: buildHreflangAlternates(`/marca/${brand.brandSlug}`)
        }
      });
    }

    // Model pages
    for (const model of brand.models) {
      for (const locale of locales) {
        entries.push({
          url: buildCanonicalUrl(`/marca/${brand.brandSlug}/${model.slug}`, locale),
          lastModified: model.lastRecallDate ? new Date(model.lastRecallDate) : new Date(dataset.importedAt),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: buildHreflangAlternates(`/marca/${brand.brandSlug}/${model.slug}`)
          }
        });
      }
    }
  }

  // Campaign pages
  for (const recall of dataset.recalls) {
    for (const locale of locales) {
      entries.push({
        url: buildCanonicalUrl(`/campana/${recall.slug}`, locale),
        lastModified: recall.publicationDate ? new Date(recall.publicationDate) : new Date(dataset.importedAt),
        changeFrequency: 'yearly',
        priority: 0.6,
        alternates: {
          languages: buildHreflangAlternates(`/campana/${recall.slug}`)
        }
      });
    }
  }

  return entries;
}
