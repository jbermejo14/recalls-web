import type { MetadataRoute } from 'next';
import { getSafetyGateDataset } from '../lib/safety-gate-service';
import { absoluteUrl, alternateUrls } from '../lib/site';

export const dynamic = 'force-static';

const HOME_PRIORITY = 1.0;
const BRAND_PRIORITY = 0.8;
const MODEL_PRIORITY = 0.7;
const RECALL_PRIORITY = 0.6;

function sitemapEntry(
  path: string,
  lastModified: Date,
  changeFrequency: 'weekly' | 'monthly' | 'yearly',
  priority: number
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: alternateUrls(path) }
  };
}

function sitemapDateOrFallback(date: string | undefined, fallback: Date): Date {
  return date ? new Date(date) : fallback;
}

/** Mapa del sitio con solo las URLs del idioma de esta compilación; el otro idioma lo publica su propio Worker. */
export default function sitemap(): MetadataRoute.Sitemap {
  const dataset = getSafetyGateDataset();
  const importedAt = new Date(dataset.importedAt);
  const entries: MetadataRoute.Sitemap = [sitemapEntry('/', importedAt, 'weekly', HOME_PRIORITY)];

  for (const brand of dataset.brands) {
    const brandPath = `/marca/${brand.brandSlug}`;
    entries.push(sitemapEntry(brandPath, sitemapDateOrFallback(brand.lastRecallDate, importedAt), 'monthly', BRAND_PRIORITY));
    for (const model of brand.models) {
      entries.push(
        sitemapEntry(`${brandPath}/${model.slug}`, sitemapDateOrFallback(model.lastRecallDate, importedAt), 'monthly', MODEL_PRIORITY)
      );
    }
  }

  for (const recall of dataset.recalls) {
    entries.push(
      sitemapEntry(`/campana/${recall.slug}`, sitemapDateOrFallback(recall.publicationDate, importedAt), 'yearly', RECALL_PRIORITY)
    );
  }

  return entries;
}
