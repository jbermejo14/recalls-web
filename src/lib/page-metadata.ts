import type { Metadata } from 'next';
import { buildPageMetadata } from './seo';
import {
  seoBrandDescription,
  seoBrandTitle,
  seoCampaignDescription,
  seoCampaignTitle,
  seoModelDescription,
  seoModelTitle
} from './seo-text';
import { getBrandBySlug, getModelBySlugs, getRecallBySlug } from './safety-gate-service';
import { getLocale } from './site';

function pageMetadataYearRange(years: number[]): string {
  const valid = years.filter(Boolean);
  if (valid.length === 0) return '';
  const first = Math.min(...valid);
  const last = Math.max(...valid);
  return first === last ? String(first) : `${first}-${last}`;
}

/** Metadatos de la página de una marca; objeto vacío si la marca no existe. */
export function brandPageMetadata(brandSlug: string): Metadata {
  const data = getBrandBySlug(brandSlug);
  if (!data) return {};
  const locale = getLocale();
  const { brand } = data;
  return buildPageMetadata({
    path: `/marca/${brandSlug}`,
    title: seoBrandTitle(brand.brand, locale),
    description: seoBrandDescription(brand.brand, brand.totalRecalls, brand.models.length, locale)
  });
}

/** Metadatos de la página de un modelo; objeto vacío si no existe. */
export function modelPageMetadata(brandSlug: string, modelSlug: string): Metadata {
  const data = getModelBySlugs(brandSlug, modelSlug);
  if (!data) return {};
  const locale = getLocale();
  const years = pageMetadataYearRange(data.recalls.map(recall => recall.publicationYear));
  return buildPageMetadata({
    path: `/marca/${brandSlug}/${modelSlug}`,
    title: seoModelTitle(data.brand.brand, data.model.name, locale),
    description: seoModelDescription(data.brand.brand, data.model.name, data.recalls.length, years, locale)
  });
}

/** Metadatos de la página de una campaña; objeto vacío si no existe. */
export function campaignPageMetadata(slug: string): Metadata {
  const recall = getRecallBySlug(slug);
  if (!recall) return {};
  const locale = getLocale();
  return buildPageMetadata({
    path: `/campana/${slug}`,
    title: seoCampaignTitle(recall, locale),
    description: seoCampaignDescription(recall, locale),
    ogType: 'article'
  });
}
