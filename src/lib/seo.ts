import type { Metadata } from 'next';
import { locales, defaultLocale, type Locale } from '../i18n/config';

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3050';
  return url.replace(/\/+$/, '');
}

export function buildCanonicalUrl(path: string, locale: Locale): string {
  const base = getSiteUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}

export function buildHreflangAlternates(path: string): Record<string, string> {
  const base = getSiteUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const pathPart = cleanPath === '/' ? '' : cleanPath;

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${base}/${loc}${pathPart}`;
  }
  // x-default points to defaultLocale (es)
  languages['x-default'] = `${base}/${defaultLocale}${pathPart}`;

  return languages;
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  ogType = 'website'
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  ogType?: 'website' | 'article';
}): Metadata {
  const canonical = buildCanonicalUrl(path, locale);
  const alternates = buildHreflangAlternates(path);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: alternates
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'RECALLSCOPE | Safety Gate UE',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: ogType
    },
    twitter: {
      card: 'summary',
      title,
      description
    }
  };
}

export interface BreadcrumbItem {
  name: string;
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
