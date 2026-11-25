import type { Metadata } from 'next';
import { SITE_NAME, absoluteUrl, alternateUrls, getLocale } from './site';

/** Ruta de la imagen social, dentro de public/ (cuelga de la ruta base de la sección). */
export const OG_IMAGE_PATH = '/brand/ododex-og.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

// Open Graph y Twitter no aplican la plantilla de título del layout: el nombre se añade aquí.
const SITE_SUFFIX = ` | ${SITE_NAME}`;
const OPEN_GRAPH_LOCALES = { es: 'es_ES', en: 'en_GB' } as const;

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
  const ogImageUrl = absoluteUrl(OG_IMAGE_PATH);
  const socialTitle = title.endsWith(SITE_SUFFIX) ? title : `${title}${SITE_SUFFIX}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: alternateUrls(path)
    },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: OPEN_GRAPH_LOCALES[getLocale()],
      type: ogType,
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: socialTitle
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
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
