export interface SafetyGateRecall {
  caseNumber: string;
  slug: string;
  publicationDate: string; // ISO YYYY-MM-DD
  publicationYear: number;
  officialUrl: string;
  brand: string;
  brandSlug: string;
  models: string[];
  modelSlugs: string[];
  product?: string;
  typeNumberOfModel?: string;
  riskType: string;
  danger: string;
  measures: string;
  typeApproval: string;
  productionDates: string;
  notifyingCountry: string;
  countryOfOrigin: string;
  category: string;
}

export interface BrandSummary {
  brand: string;
  brandSlug: string;
  totalRecalls: number;
  lastRecallDate: string;
  risksBreakdown: Record<string, number>;
  yearsBreakdown: Record<string, number>;
  models: Array<{
    name: string;
    slug: string;
    recallsCount: number;
    lastRecallDate: string;
  }>;
}

export interface ModelSummary {
  brand: string;
  brandSlug: string;
  model: string;
  modelSlug: string;
  totalRecalls: number;
  lastRecallDate: string;
  risksBreakdown: Record<string, number>;
  yearsBreakdown: Record<string, number>;
}

export interface SafetyGateDataset {
  version: string;
  importedAt: string;
  source: string;
  sourceLicense: string;
  totalRecalls: number;
  totalBrands: number;
  totalModels: number;
  uninterpretedCount: number;
  recalls: SafetyGateRecall[];
  brands: BrandSummary[];
}
