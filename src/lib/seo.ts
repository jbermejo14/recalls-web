import type { Metadata } from 'next';
import { SITE_NAME, absoluteUrl, alternateUrls, getLocale, getSiteUrl } from './site';

const OPEN_GRAPH_LOCALES = { es: 'es_ES', en: 'en_US' } as const;

/** Metadatos de una página: canonical, hreflang, Open Graph y Twitter, en el idioma de la compilación. */
export function buildPageMetadata({
  path,
  title,
  description,
  ogType = 'website'
}: {
  path: string;
  title: string;
  description: string;
  ogType?: 'website' | 'article';
}): Metadata {
  const canonical = absoluteUrl(path);
  const ogImageUrl = `${getSiteUrl()}/brand/ododex-og.png`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: alternateUrls(path)
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: OPEN_GRAPH_LOCALES[getLocale()],
      type: ogType,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} · ${SITE_NAME}`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl]
    }
  };
}

export interface BreadcrumbItem {
  name: string;
  /** URL absoluta de la miga. */
  item: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item
    }))
  };
}
