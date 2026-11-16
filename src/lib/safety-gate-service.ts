import fs from 'fs';
import path from 'path';
import type { SafetyGateDataset, SafetyGateRecall, BrandSummary, ModelSummary } from '../types/safety-gate';

let cachedDataset: SafetyGateDataset | null = null;

export function getSafetyGateDataset(): SafetyGateDataset {
  if (cachedDataset) {
    return cachedDataset;
  }

  const jsonPath = path.join(process.cwd(), 'src', 'data', 'safety-gate-data.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error('Safety Gate dataset not found. Please run npm run import first.');
  }

  const content = fs.readFileSync(jsonPath, 'utf8');
  cachedDataset = JSON.parse(content) as SafetyGateDataset;
  return cachedDataset;
}

export function getAllBrands(): BrandSummary[] {
  const dataset = getSafetyGateDataset();
  return dataset.brands;
}

export function getBrandBySlug(brandSlug: string): { brand: BrandSummary; recalls: SafetyGateRecall[] } | null {
  const dataset = getSafetyGateDataset();
  const brand = dataset.brands.find(b => b.brandSlug === brandSlug);
  if (!brand) return null;

  const recalls = dataset.recalls
    .filter(r => r.brandSlug === brandSlug)
    .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate));

  return { brand, recalls };
}

export function getModelBySlugs(brandSlug: string, modelSlug: string): {
  brand: BrandSummary;
  model: { name: string; slug: string; recallsCount: number; lastRecallDate: string };
  recalls: SafetyGateRecall[];
  risksBreakdown: Record<string, number>;
  yearsBreakdown: Record<string, number>;
} | null {
  const dataset = getSafetyGateDataset();
  const brand = dataset.brands.find(b => b.brandSlug === brandSlug);
  if (!brand) return null;

  const model = brand.models.find(m => m.slug === modelSlug);
  if (!model) return null;

  const recalls = dataset.recalls
    .filter(r => r.brandSlug === brandSlug && r.modelSlugs.includes(modelSlug))
    .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate));

  const risksBreakdown: Record<string, number> = {};
  const yearsBreakdown: Record<string, number> = {};

  for (const r of recalls) {
    risksBreakdown[r.riskType] = (risksBreakdown[r.riskType] || 0) + 1;
    if (r.publicationYear) {
      yearsBreakdown[r.publicationYear] = (yearsBreakdown[r.publicationYear] || 0) + 1;
    }
  }

  return {
    brand,
    model,
    recalls,
    risksBreakdown,
    yearsBreakdown
  };
}

export function getRecallBySlug(slug: string): SafetyGateRecall | null {
  const dataset = getSafetyGateDataset();
  const recall = dataset.recalls.find(r => r.slug === slug || r.caseNumber === slug);
  return recall || null;
}

export function getLatestRecalls(limit: number = 10): SafetyGateRecall[] {
  const dataset = getSafetyGateDataset();
  return [...dataset.recalls]
    .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate))
    .slice(0, limit);
}

export function getTopBrands(limit: number = 12): BrandSummary[] {
  const dataset = getSafetyGateDataset();
  return dataset.brands.slice(0, limit);
}
