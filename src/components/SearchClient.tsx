'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, Flame, ShieldAlert, ArrowRight, Car } from 'lucide-react';
import type { Locale } from '../i18n/config';
import type { SafetyGateRecall, BrandSummary } from '../types/safety-gate';
import RiskBadge from './RiskBadge';

export default function SearchClient({
  lang,
  brands,
  recentRecalls
}: {
  lang: Locale;
  brands: BrandSummary[];
  recentRecalls: SafetyGateRecall[];
}) {
  const [query, setQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');

  // Filtered recalls from recent or query
  const filteredRecalls = useMemo(() => {
    let list = recentRecalls;

    if (selectedBrand !== 'all') {
      list = list.filter(r => r.brandSlug === selectedBrand);
    }

    if (selectedRisk !== 'all') {
      list = list.filter(r => r.riskType.toLowerCase().includes(selectedRisk.toLowerCase()));
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      const tokens = q.split(/\s+/);
      list = list.filter(r => {
        const full = `${r.brand} ${r.models.join(' ')} ${r.caseNumber} ${r.danger} ${r.riskType}`.toLowerCase();
        return tokens.every(token => full.includes(token));
      });
    }

    return list.slice(0, 24);
  }, [recentRecalls, query, selectedBrand, selectedRisk]);

  // Filtered brands for quick selector
  const filteredBrands = useMemo(() => {
    if (!query.trim()) return brands.slice(0, 18);
    const q = query.toLowerCase().trim();
    return brands.filter(b => b.brand.toLowerCase().includes(q) || b.models.some(m => m.name.toLowerCase().includes(q))).slice(0, 18);
  }, [brands, query]);

  return (
    <div className="space-y-8">
      {/* Search Input Box */}
      <div className="relative max-w-3xl mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-[#FF5500] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === 'es'
                ? 'Buscar por marca, modelo (ej: 3008, Golf, Clase C), código de recall o caso...'
                : 'Search by make, model (e.g. 3008, Golf, C-Class), recall code or case number...'
            }
            className="w-full h-14 pl-12 pr-12 text-sm sm:text-base rounded-2xl bg-[var(--bg-surface-elevated)] border-2 border-[var(--border-color)] focus:border-[#FF5500] focus:outline-none text-[var(--text-primary)] transition-all shadow-lg shadow-black/20"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 p-1 rounded-full hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)]"
              title="Limpiar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Chips (wrapping without scrollbars) */}
        <div className="flex items-center gap-2 mt-4 flex-wrap text-xs">
          <span className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[11px] mr-1">
            {lang === 'es' ? 'Filtros Rápidos:' : 'Quick Filters:'}
          </span>
          <button
            onClick={() => { setSelectedRisk('all'); setSelectedBrand('all'); }}
            className={`px-3 py-1.5 rounded-full font-semibold border transition-all ${
              selectedRisk === 'all' && selectedBrand === 'all'
                ? 'bg-[#FF5500] text-white border-[#FF5500]'
                : 'bg-[var(--bg-surface-elevated)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[#FF5500]'
            }`}
          >
            {lang === 'es' ? 'Todos los registros' : 'All alerts'}
          </button>
          <button
            onClick={() => setSelectedRisk(selectedRisk === 'fire' ? 'all' : 'fire')}
            className={`px-3 py-1.5 rounded-full font-semibold border transition-all flex items-center gap-1.5 ${
              selectedRisk === 'fire'
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-[var(--bg-surface-elevated)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-red-500'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'Riesgo de Incendio' : 'Fire Hazard'}</span>
          </button>
          <button
            onClick={() => setSelectedRisk(selectedRisk === 'injuries' ? 'all' : 'injuries')}
            className={`px-3 py-1.5 rounded-full font-semibold border transition-all flex items-center gap-1.5 ${
              selectedRisk === 'injuries'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-[var(--bg-surface-elevated)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-amber-500'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'Riesgo de Lesiones' : 'Injuries'}</span>
          </button>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-1.5 rounded-full font-semibold bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[#FF5500] text-xs focus:outline-none"
          >
            <option value="all">{lang === 'es' ? 'Todas las marcas' : 'All makes'}</option>
            {brands.slice(0, 30).map(b => (
              <option key={b.brandSlug} value={b.brandSlug}>{b.brand} ({b.totalRecalls})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Matching Brands Quick Links if searching */}
      {query && filteredBrands.length > 0 && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5">
          <div className="text-xs font-bold text-[#FF5500] uppercase tracking-wider mb-3">
            {lang === 'es' ? 'Marcas coincidentes:' : 'Matching makes:'}
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredBrands.map(b => (
              <Link
                key={b.brandSlug}
                href={`/${lang}/marca/${b.brandSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] hover:border-[#FF5500] text-xs font-bold text-[var(--text-primary)] transition-all group"
              >
                <span>{b.brand}</span>
                <span className="text-[10px] text-[var(--text-muted)]">({b.totalRecalls})</span>
                <ArrowRight className="w-3 h-3 text-[#FF5500] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recalls Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <span>{query ? (lang === 'es' ? 'Resultados de la búsqueda' : 'Search results') : (lang === 'es' ? 'Últimas campañas notificadas' : 'Latest published campaigns')}</span>
            <span className="text-xs font-normal text-[var(--text-muted)]">({filteredRecalls.length})</span>
          </h3>
        </div>

        {filteredRecalls.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-[var(--bg-surface)] border border-dashed border-[var(--border-color)]">
            <Car className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
            <h4 className="font-bold text-[var(--text-primary)] mb-1">
              {lang === 'es' ? 'No se encontraron campañas' : 'No recall campaigns found'}
            </h4>
            <p className="text-xs text-[var(--text-muted)]">
              {lang === 'es' ? 'Prueba con otros términos o selecciona otra marca.' : 'Try different keywords or select another make.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecalls.map(r => (
              <Link
                key={r.caseNumber}
                href={`/${lang}/campana/${r.slug}`}
                className="group p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[#FF5500] hover:shadow-lg hover:shadow-[#FF5500]/10 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-black tracking-wider text-[#FF5500] uppercase">
                      {r.brand}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">
                      {r.publicationDate}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[var(--text-primary)] line-clamp-1 mb-1.5 group-hover:text-[#FF5500] transition-colors">
                    {r.models.length > 0 ? r.models.join(', ') : r.brand}
                  </h4>

                  <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed mb-4">
                    {r.danger || 'Safety Gate recall notification.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                  <RiskBadge risk={r.riskType} lang={lang} size="sm" />
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    {r.caseNumber}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
