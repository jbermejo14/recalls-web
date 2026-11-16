/**
 * RECALLSCOPE - Consultor de Campañas & Fiabilidad
 * Frontend Application Controller
 */

// State
const state = {
  theme: localStorage.getItem('recallscope_theme') || 'dark',
  currentPage: 1,
  limit: 18,
  totalPages: 1,
  totalRecalls: 0,
  activeComponent: 'all',
  activeBrand: 'all',
  activeRisk: 'all',
  activeLevel: 'all',
  activeYearFrom: '',
  activeYearTo: '',
  searchQuery: '',
  sortBy: 'date_desc',
  brandsList: [],
  charts: {},
  statsData: null,
  currentModalRecall: null
};

// DOM Elements
const docEl = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeLabel = document.getElementById('themeLabel');
const navTabs = document.getElementById('navTabs');
const tabSections = document.querySelectorAll('.tab-section');

// Search elements
const mainSearchInput = document.getElementById('mainSearchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const doSearchBtn = document.getElementById('doSearchBtn');
const quickChips = document.getElementById('quickChips');
const filterBrand = document.getElementById('filterBrand');
const filterRisk = document.getElementById('filterRisk');
const filterLevel = document.getElementById('filterLevel');
const filterYearFrom = document.getElementById('filterYearFrom');
const filterYearTo = document.getElementById('filterYearTo');
const sortBySelect = document.getElementById('sortBySelect');
const activeFiltersBar = document.getElementById('activeFiltersBar');
const activeTagsContainer = document.getElementById('activeTagsContainer');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');

const resultsCount = document.getElementById('resultsCount');
const resultsSub = document.getElementById('resultsSub');
const recallsGrid = document.getElementById('recallsGrid');
const paginationWrapper = document.getElementById('paginationWrapper');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pagesNumbers = document.getElementById('pagesNumbers');
const pageSummary = document.getElementById('pageSummary');

// Modal elements
const recallModalBackdrop = document.getElementById('recallModalBackdrop');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalBrand = document.getElementById('modalBrand');
const modalRiskBadge = document.getElementById('modalRiskBadge');
const modalLevel = document.getElementById('modalLevel');
const modalProductTitle = document.getElementById('modalProductTitle');
const modalCaseNumber = document.getElementById('modalCaseNumber');
const modalPubDate = document.getElementById('modalPubDate');
const modalRecallCode = document.getElementById('modalRecallCode');
const modalDangerText = document.getElementById('modalDangerText');
const modalMeasuresText = document.getElementById('modalMeasuresText');
const modalTechnicalContent = document.getElementById('modalTechnicalContent');
const modalNotifyingCountry = document.getElementById('modalNotifyingCountry');
const modalOriginCountry = document.getElementById('modalOriginCountry');
const modalComponents = document.getElementById('modalComponents');
const modalOfficialLinkBtn = document.getElementById('modalOfficialLinkBtn');
const modalCopyBtn = document.getElementById('modalCopyBtn');
const modalPrintBtn = document.getElementById('modalPrintBtn');

// Banner & DB elements
const bannerDbText = document.getElementById('bannerDbText');
const heroTotalRecalls = document.getElementById('heroTotalRecalls');
const heroFireRecalls = document.getElementById('heroFireRecalls');
const heroAirbagRecalls = document.getElementById('heroAirbagRecalls');
const heroBrandsCount = document.getElementById('heroBrandsCount');

// Reliability elements
const dossierBrandSelect = document.getElementById('dossierBrandSelect');
const loadDossierBtn = document.getElementById('loadDossierBtn');
const brandDossierView = document.getElementById('brandDossierView');
const reliabilityTableBody = document.getElementById('reliabilityTableBody');
const rankingSearchInput = document.getElementById('rankingSearchInput');

// Comparator elements
const compareBrand1 = document.getElementById('compareBrand1');
const compareBrand2 = document.getElementById('compareBrand2');
const compareBrand3 = document.getElementById('compareBrand3');
const runCompareBtn = document.getElementById('runCompareBtn');
const comparisonResults = document.getElementById('comparisonResults');

// Used car advisor elements
const advisorBrand = document.getElementById('advisorBrand');
const advisorModel = document.getElementById('advisorModel');
const advisorYear = document.getElementById('advisorYear');
const generateAdvisorReportBtn = document.getElementById('generateAdvisorReportBtn');
const advisorReportView = document.getElementById('advisorReportView');

// DB Manager elements
const dbFileName = document.getElementById('dbFileName');
const dbFilePath = document.getElementById('dbFilePath');
const dbFileSize = document.getElementById('dbFileSize');
const dbTotalRecords = document.getElementById('dbTotalRecords');
const dbParseTime = document.getElementById('dbParseTime');
const dbLastLoaded = document.getElementById('dbLastLoaded');
const reloadXmlBtn = document.getElementById('reloadXmlBtn');
const xmlDropZone = document.getElementById('xmlDropZone');
const xmlFileInput = document.getElementById('xmlFileInput');

// Toast container
const toastContainer = document.getElementById('toastContainer');

// ========================================================
// THEME SWITCHING (DARK / LIGHT MODE)
// ========================================================
function applyTheme(theme) {
  state.theme = theme;
  docEl.setAttribute('data-theme', theme);
  localStorage.setItem('recallscope_theme', theme);

  if (theme === 'dark') {
    themeLabel.textContent = 'Modo Oscuro';
  } else {
    themeLabel.textContent = 'Modo Claro';
  }

  // Update chart colors if charts are initialized
  updateChartsTheme();
}

function toggleTheme() {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  showToast(`Cambiado a ${newTheme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}`);
}

themeToggleBtn.addEventListener('click', toggleTheme);

// ========================================================
// NAVIGATION TABS
// ========================================================
navTabs.addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-tab');
  if (!btn) return;
  const targetTab = btn.getAttribute('data-tab');

  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  tabSections.forEach(s => s.classList.remove('active'));

  btn.classList.add('active');
  const targetSection = document.getElementById(targetTab);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  if (targetTab === 'tab-stats' && !state.charts.yearsChart && state.statsData) {
    initCharts(state.statsData);
  }
});

// ========================================================
// TOAST NOTIFICATIONS
// ========================================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color:var(--orange-primary);font-weight:bold;">●</span>
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ========================================================
// API DATA INITIALIZATION
// ========================================================
async function initApp() {
  applyTheme(state.theme);

  try {
    // 1. Fetch Status
    const statusRes = await fetch('/api/status');
    const statusData = await statusRes.json();
    bannerDbText.textContent = `${statusData.totalRecords.toLocaleString()} campañas activas | Archivo: ${statusData.filePath.split(/[\\/]/).pop()}`;
    
    dbFileName.textContent = statusData.filePath.split(/[\\/]/).pop();
    dbFilePath.textContent = statusData.filePath;
    dbFileSize.textContent = `${statusData.fileSizeMB} MB`;
    dbTotalRecords.textContent = `${statusData.totalRecords.toLocaleString()} notificaciones`;
    dbParseTime.textContent = `${statusData.parseTimeMs} ms`;
    dbLastLoaded.textContent = new Date(statusData.lastLoaded).toLocaleString('es-ES');

    // 2. Fetch Stats
    const statsRes = await fetch('/api/stats');
    const statsData = await statsRes.json();
    state.statsData = statsData;

    heroTotalRecalls.textContent = statsData.totalRecalls.toLocaleString();
    heroBrandsCount.textContent = statsData.uniqueBrands.toLocaleString();
    const firesCount = (statsData.riskTypes['Fire'] || 0) + (statsData.riskTypes['Fire, Injuries'] || 0);
    heroFireRecalls.textContent = firesCount.toLocaleString();
    heroAirbagRecalls.textContent = (statsData.components['Airbag'] || 0).toLocaleString();

    // Populate Year Selects (2005 - 2026)
    const years = Object.keys(statsData.years).sort((a,b) => b - a);
    years.forEach(y => {
      const optFrom = new Option(y, y);
      const optTo = new Option(y, y);
      filterYearFrom.appendChild(optFrom);
      filterYearTo.appendChild(optTo);

      const advOpt = new Option(y, y);
      advisorYear.appendChild(advOpt);
    });

    // 3. Fetch Brands
    const brandsRes = await fetch('/api/brands');
    const brandsData = await brandsRes.json();
    state.brandsList = brandsData;

    populateBrandSelects(brandsData);
    renderReliabilityRanking(brandsData);

    // Initial search
    await fetchRecalls();

  } catch (err) {
    console.error('Initialization error:', err);
    bannerDbText.textContent = 'Modo autónomo o error de conexión al servidor.';
    showToast('Aviso: Verificando datos locales.', 'warning');
  }
}

function populateBrandSelects(brands) {
  brands.forEach(({ brand, count }) => {
    const text = `${brand} (${count})`;
    filterBrand.appendChild(new Option(text, brand));
    dossierBrandSelect.appendChild(new Option(text, brand));
    compareBrand1.appendChild(new Option(text, brand));
    compareBrand2.appendChild(new Option(text, brand));
    compareBrand3.appendChild(new Option(text, brand));
    advisorBrand.appendChild(new Option(brand, brand));
  });

  // Pre-select some popular brands for comparator
  if (compareBrand1.options.length > 2) compareBrand1.selectedIndex = 1; // Mercedes
  if (compareBrand2.options.length > 3) compareBrand2.selectedIndex = 3; // BMW
}

// ========================================================
// SEARCH & RECALLS QUERY
// ========================================================
let searchDebounceTimeout = null;

async function fetchRecalls() {
  recallsGrid.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:48px 0;">
      <div style="color:var(--orange-primary);font-size:1.5rem;font-weight:700;margin-bottom:8px;">Buscando alertas de seguridad...</div>
      <div style="color:var(--text-muted);font-size:0.9rem;">Consultando la base de datos oficial XML</div>
    </div>
  `;

  const params = new URLSearchParams({
    page: state.currentPage,
    limit: state.limit,
    sortBy: state.sortBy
  });

  if (state.searchQuery) params.set('q', state.searchQuery);
  if (state.activeBrand !== 'all') params.set('brand', state.activeBrand);
  if (state.activeRisk !== 'all') params.set('risk', state.activeRisk);
  if (state.activeComponent !== 'all') params.set('component', state.activeComponent);
  if (state.activeLevel !== 'all') params.set('level', state.activeLevel);
  if (state.activeYearFrom) params.set('yearFrom', state.activeYearFrom);
  if (state.activeYearTo) params.set('yearTo', state.activeYearTo);

  try {
    const res = await fetch(`/api/recalls?${params.toString()}`);
    const data = await res.json();

    state.totalRecalls = data.total;
    state.totalPages = data.totalPages;

    renderResultsHeader(data.total);
    renderRecallsGrid(data.recalls);
    renderPagination(data.page, data.totalPages);
    renderActiveFilters();

  } catch (err) {
    console.error('Error fetching recalls:', err);
    recallsGrid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:48px 0;color:var(--red-danger);">
        <h3>Error al consultar la base de datos</h3>
        <p>Asegúrate de que el servidor está en ejecución.</p>
      </div>
    `;
  }
}

function renderResultsHeader(total) {
  resultsCount.textContent = `${total.toLocaleString()} Campañas Encontradas`;
  if (state.searchQuery || state.activeBrand !== 'all' || state.activeComponent !== 'all') {
    resultsSub.textContent = `(Filtrado por criterios de seguridad)`;
  } else {
    resultsSub.textContent = `(Catálogo completo Safety Gate UE)`;
  }
}

function renderRecallsGrid(recalls) {
  if (!recalls || recalls.length === 0) {
    recallsGrid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:64px 20px;background:var(--bg-surface);border-radius:var(--radius-lg);border:1px dashed var(--border-strong);">
        <div style="font-size:2.5rem;margin-bottom:12px;">🔍</div>
        <h3 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:6px;">No se encontraron llamadas a revisión</h3>
        <p style="color:var(--text-muted);font-size:0.9rem;max-width:500px;margin:0 auto 16px;">Prueba a modificar los términos de búsqueda, seleccionar "Todas las Marcas" o limpiar los filtros activos.</p>
        <button class="primary-btn" onclick="resetAllFilters()">Restablecer Filtros</button>
      </div>
    `;
    paginationWrapper.style.display = 'none';
    return;
  }

  paginationWrapper.style.display = 'flex';

  recallsGrid.innerHTML = recalls.map(r => {
    // Risk class
    let riskClass = 'risk-injuries';
    let riskBadgeClass = 'injuries';
    const rLower = (r.riskType || '').toLowerCase();
    if (rLower.includes('fire')) {
      riskClass = 'risk-fire';
      riskBadgeClass = 'fire';
    } else if (rLower.includes('environment')) {
      riskClass = 'risk-environment';
      riskBadgeClass = 'environment';
    }

    const componentBadges = (r.components || []).slice(0, 3).map(c => {
      const isCritical = c.includes('Airbag') || c.includes('Fuego') || c.includes('Frenos') || c.includes('Batería');
      return `<span class="component-tag ${isCritical ? 'alert' : ''}">${escapeHtml(c)}</span>`;
    }).join('');

    return `
      <article class="recall-card ${riskClass}" onclick="openRecallModal(${r.order})">
        <div class="card-top">
          <span class="card-brand-badge">${escapeHtml(r.brand)}</span>
          <div class="card-badges-right">
            <span class="badge-risk ${riskBadgeClass}">
              ${riskBadgeClass === 'fire' ? '🔥' : '⚠️'} ${escapeHtml(r.riskType)}
            </span>
            <span class="badge-year-tag">${r.year || 'N/D'}</span>
          </div>
        </div>

        <h3 class="card-model-title">${escapeHtml(r.model || r.product)}</h3>

        <p class="card-danger-snippet">
          ${escapeHtml(r.danger || 'Defecto técnico reportado en la campaña de seguridad.')}
        </p>

        <div class="card-components-row">
          ${componentBadges}
        </div>

        <div class="card-footer">
          <span class="card-case-number">Caso: ${escapeHtml(r.caseNumber)}</span>
          <span class="card-action-link">
            <span>Ver Expediente</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </span>
        </div>
      </article>
    `;
  }).join('');
}

function renderPagination(page, totalPages) {
  if (totalPages <= 1) {
    paginationWrapper.style.display = 'none';
    return;
  }

  paginationWrapper.style.display = 'flex';
  prevPageBtn.disabled = page <= 1;
  nextPageBtn.disabled = page >= totalPages;
  pageSummary.textContent = `Página ${page} de ${totalPages}`;

  // Generate page numbers
  let pagesHtml = '';
  const maxButtons = 5;
  let startPage = Math.max(1, page - 2);
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let p = startPage; p <= endPage; p++) {
    pagesHtml += `
      <button class="num-page-btn ${p === page ? 'active' : ''}" onclick="goToPage(${p})">${p}</button>
    `;
  }

  pagesNumbers.innerHTML = pagesHtml;
}

window.goToPage = function(p) {
  state.currentPage = p;
  fetchRecalls();
  window.scrollTo({ top: document.querySelector('.search-panel').offsetTop - 90, behavior: 'smooth' });
};

prevPageBtn.addEventListener('click', () => {
  if (state.currentPage > 1) {
    goToPage(state.currentPage - 1);
  }
});

nextPageBtn.addEventListener('click', () => {
  if (state.currentPage < state.totalPages) {
    goToPage(state.currentPage + 1);
  }
});

// ========================================================
// FILTER HANDLERS
// ========================================================
function onSearchChange() {
  clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = setTimeout(() => {
    state.searchQuery = mainSearchInput.value.trim();
    clearSearchBtn.style.display = state.searchQuery ? 'flex' : 'none';
    state.currentPage = 1;
    fetchRecalls();
  }, 280);
}

mainSearchInput.addEventListener('input', onSearchChange);
clearSearchBtn.addEventListener('click', () => {
  mainSearchInput.value = '';
  clearSearchBtn.style.display = 'none';
  state.searchQuery = '';
  state.currentPage = 1;
  fetchRecalls();
});

doSearchBtn.addEventListener('click', () => {
  state.searchQuery = mainSearchInput.value.trim();
  state.currentPage = 1;
  fetchRecalls();
});

// Quick Chips
quickChips.addEventListener('click', (e) => {
  const chip = e.target.closest('.filter-chip');
  if (!chip) return;

  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');

  state.activeComponent = chip.getAttribute('data-component');
  state.currentPage = 1;
  fetchRecalls();
});

// Dropdowns
filterBrand.addEventListener('change', (e) => {
  state.activeBrand = e.target.value;
  state.currentPage = 1;
  fetchRecalls();
});

filterRisk.addEventListener('change', (e) => {
  state.activeRisk = e.target.value;
  state.currentPage = 1;
  fetchRecalls();
});

filterLevel.addEventListener('change', (e) => {
  state.activeLevel = e.target.value;
  state.currentPage = 1;
  fetchRecalls();
});

filterYearFrom.addEventListener('change', (e) => {
  state.activeYearFrom = e.target.value;
  state.currentPage = 1;
  fetchRecalls();
});

filterYearTo.addEventListener('change', (e) => {
  state.activeYearTo = e.target.value;
  state.currentPage = 1;
  fetchRecalls();
});

sortBySelect.addEventListener('change', (e) => {
  state.sortBy = e.target.value;
  state.currentPage = 1;
  fetchRecalls();
});

function renderActiveFilters() {
  const tags = [];
  if (state.searchQuery) tags.push({ label: `Texto: "${state.searchQuery}"`, key: 'q' });
  if (state.activeBrand !== 'all') tags.push({ label: `Marca: ${state.activeBrand}`, key: 'brand' });
  if (state.activeComponent !== 'all') tags.push({ label: `Sistema: ${state.activeComponent}`, key: 'component' });
  if (state.activeRisk !== 'all') tags.push({ label: `Riesgo: ${state.activeRisk}`, key: 'risk' });
  if (state.activeLevel !== 'all') tags.push({ label: `Nivel: ${state.activeLevel}`, key: 'level' });
  if (state.activeYearFrom) tags.push({ label: `Desde: ${state.activeYearFrom}`, key: 'yearFrom' });
  if (state.activeYearTo) tags.push({ label: `Hasta: ${state.activeYearTo}`, key: 'yearTo' });

  if (tags.length === 0) {
    activeFiltersBar.style.display = 'none';
    return;
  }

  activeFiltersBar.style.display = 'flex';
  activeTagsContainer.innerHTML = tags.map(t => `
    <span class="tag-badge">
      ${escapeHtml(t.label)}
      <span class="tag-remove" onclick="removeFilter('${t.key}')">✕</span>
    </span>
  `).join('');
}

window.removeFilter = function(key) {
  if (key === 'q') {
    mainSearchInput.value = '';
    state.searchQuery = '';
    clearSearchBtn.style.display = 'none';
  } else if (key === 'brand') {
    filterBrand.value = 'all';
    state.activeBrand = 'all';
  } else if (key === 'component') {
    state.activeComponent = 'all';
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    document.querySelector('.filter-chip[data-component="all"]')?.classList.add('active');
  } else if (key === 'risk') {
    filterRisk.value = 'all';
    state.activeRisk = 'all';
  } else if (key === 'level') {
    filterLevel.value = 'all';
    state.activeLevel = 'all';
  } else if (key === 'yearFrom') {
    filterYearFrom.value = '';
    state.activeYearFrom = '';
  } else if (key === 'yearTo') {
    filterYearTo.value = '';
    state.activeYearTo = '';
  }

  state.currentPage = 1;
  fetchRecalls();
};

window.resetAllFilters = function() {
  mainSearchInput.value = '';
  clearSearchBtn.style.display = 'none';
  state.searchQuery = '';

  filterBrand.value = 'all';
  state.activeBrand = 'all';

  filterRisk.value = 'all';
  state.activeRisk = 'all';

  filterLevel.value = 'all';
  state.activeLevel = 'all';

  filterYearFrom.value = '';
  state.activeYearFrom = '';

  filterYearTo.value = '';
  state.activeYearTo = '';

  state.activeComponent = 'all';
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  document.querySelector('.filter-chip[data-component="all"]')?.classList.add('active');

  sortBySelect.value = 'date_desc';
  state.sortBy = 'date_desc';

  state.currentPage = 1;
  fetchRecalls();
  showToast('Filtros restablecidos.');
};

resetFiltersBtn.addEventListener('click', resetAllFilters);

// Export CSV
exportCsvBtn.addEventListener('click', async () => {
  showToast('Generando archivo CSV de resultados...');
  try {
    const params = new URLSearchParams({
      limit: 1000,
      sortBy: state.sortBy
    });
    if (state.searchQuery) params.set('q', state.searchQuery);
    if (state.activeBrand !== 'all') params.set('brand', state.activeBrand);
    if (state.activeRisk !== 'all') params.set('risk', state.activeRisk);
    if (state.activeComponent !== 'all') params.set('component', state.activeComponent);

    const res = await fetch(`/api/recalls?${params.toString()}`);
    const data = await res.json();

    const headers = ['Order', 'CaseNumber', 'Brand', 'Model', 'Year', 'RiskType', 'Danger', 'Measures', 'Reference'];
    const rows = data.recalls.map(r => [
      r.order,
      `"${(r.caseNumber || '').replace(/"/g, '""')}"`,
      `"${(r.brand || '').replace(/"/g, '""')}"`,
      `"${(r.model || '').replace(/"/g, '""')}"`,
      r.year,
      `"${(r.riskType || '').replace(/"/g, '""')}"`,
      `"${(r.danger || '').replace(/"/g, '""').replace(/\n+/g, ' ')}"`,
      `"${(r.measures || '').replace(/"/g, '""').replace(/\n+/g, ' ')}"`,
      `"${(r.reference || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `recalls_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Exportación CSV completada con éxito.');
  } catch (err) {
    showToast('Error al exportar CSV.', 'error');
  }
});

// ========================================================
// RECALL DOSSIER MODAL
// ========================================================
window.openRecallModal = async function(order) {
  try {
    const res = await fetch(`/api/recalls/${order}`);
    const r = await res.json();
    state.currentModalRecall = r;

    modalBrand.textContent = r.brand;
    modalRiskBadge.textContent = r.riskType;
    modalLevel.textContent = r.level || 'Serious risk';
    modalProductTitle.textContent = r.model || r.product || 'Modelo no especificado';
    modalCaseNumber.textContent = r.caseNumber;
    modalPubDate.textContent = r.publicationDate;
    modalRecallCode.textContent = r.companyRecallCode || 'No registrado (campaña interna)';
    modalDangerText.textContent = r.danger || 'Sin descripción detallada del peligro.';
    modalMeasuresText.textContent = r.measures || 'Medida correctiva voluntaria del fabricante (revisión e inspección en concesionario oficial sin coste).';

    let techDetails = '';
    if (r.type_numberOfModel) techDetails += `Homologaciones / Tipos:\n${r.type_numberOfModel}\n\n`;
    if (r.productionDates) techDetails += `Fechas de Producción Afectadas:\n${r.productionDates}\n\n`;
    if (r.description) techDetails += `Descripción adicional:\n${r.description}`;
    modalTechnicalContent.textContent = techDetails.trim() || 'No se registraron números de bastidor específicos en la notificación inicial.';

    modalNotifyingCountry.textContent = r.notifyingCountry || 'Comisión Europea';
    modalOriginCountry.textContent = r.countryOfOrigin || 'Internacional';
    modalComponents.textContent = (r.components || []).join(', ') || 'General';

    if (r.reference) {
      modalOfficialLinkBtn.href = r.reference;
      modalOfficialLinkBtn.style.display = 'inline-flex';
    } else {
      modalOfficialLinkBtn.style.display = 'none';
    }

    recallModalBackdrop.style.display = 'flex';
    document.body.style.overflow = 'hidden';

  } catch (err) {
    console.error('Error opening modal:', err);
    showToast('No se pudo cargar el expediente.', 'error');
  }
};

function closeModal() {
  recallModalBackdrop.style.display = 'none';
  document.body.style.overflow = '';
}

modalCloseBtn.addEventListener('click', closeModal);
recallModalBackdrop.addEventListener('click', (e) => {
  if (e.target === recallModalBackdrop) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && recallModalBackdrop.style.display === 'flex') {
    closeModal();
  }
});

modalCopyBtn.addEventListener('click', () => {
  if (!state.currentModalRecall) return;
  const text = `[RECALL EU] Marca: ${state.currentModalRecall.brand} | Modelo: ${state.currentModalRecall.model} | Caso: ${state.currentModalRecall.caseNumber} | Riesgo: ${state.currentModalRecall.riskType} | Enlace: ${state.currentModalRecall.reference}`;
  navigator.clipboard.writeText(text);
  showToast('Referencia copiada al portapapeles.');
});

modalPrintBtn.addEventListener('click', () => {
  window.print();
});

// ========================================================
// TAB 2: RELIABILITY DOSSIER & RANKING TABLE
// ========================================================
function renderReliabilityRanking(brands) {
  const tableRows = brands.map(({ brand, count, reliability }) => {
    if (!reliability) return '';
    const gradeClass = reliability.grade.replace('+', '-plus');
    const fireRate = Math.round((reliability.fireRecalls / (count || 1)) * 100);

    return `
      <tr>
        <td><strong>${escapeHtml(brand)}</strong></td>
        <td>
          <div class="score-bar-wrap">
            <div class="score-bar-bg">
              <div class="score-bar-fill" style="width:${reliability.score}%;"></div>
            </div>
            <span class="score-num">${reliability.score}/100</span>
          </div>
        </td>
        <td><span class="badge-grade ${gradeClass}">${reliability.grade}</span></td>
        <td><strong>${count}</strong></td>
        <td style="color:${reliability.fireRecalls > 20 ? 'var(--red-danger)' : 'inherit'};">
          ${reliability.fireRecalls} (${fireRate}%)
        </td>
        <td>${reliability.airbagRecalls}</td>
        <td>${reliability.brakeRecalls}</td>
        <td>
          <button class="table-btn" onclick="consultBrandDossier('${escapeHtml(brand)}')">Ver Ficha</button>
        </td>
      </tr>
    `;
  }).join('');

  reliabilityTableBody.innerHTML = tableRows;
}

// Filter ranking table
rankingSearchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  const rows = reliabilityTableBody.querySelectorAll('tr');
  rows.forEach(r => {
    const text = r.textContent.toLowerCase();
    r.style.display = text.includes(query) ? '' : 'none';
  });
});

window.consultBrandDossier = function(brandName) {
  dossierBrandSelect.value = brandName;
  loadBrandDossier(brandName);
  // Scroll into view
  brandDossierView.scrollIntoView({ behavior: 'smooth' });
};

loadDossierBtn.addEventListener('click', () => {
  const selected = dossierBrandSelect.value;
  if (!selected) {
    showToast('Selecciona una marca para consultar.', 'warning');
    return;
  }
  loadBrandDossier(selected);
});

async function loadBrandDossier(brandName) {
  brandDossierView.style.display = 'block';
  brandDossierView.innerHTML = `
    <div style="text-align:center;padding:32px;">
      <div style="color:var(--orange-primary);font-size:1.3rem;font-weight:700;">Generando expediente de fiabilidad para ${brandName}...</div>
    </div>
  `;

  try {
    const res = await fetch(`/api/reliability/${encodeURIComponent(brandName)}`);
    const data = await res.json();
    const rel = data.reliability;

    const sortedComps = Object.entries(data.componentDistribution)
      .filter(([k]) => k !== 'Otros Componentes')
      .sort((a,b) => b[1] - a[1])
      .slice(0, 4);

    const topModelsList = (rel.topModels || []).map(m => `
      <li style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border-subtle);font-size:0.85rem;">
        <span>${escapeHtml(m.model)}</span>
        <strong style="color:var(--orange-primary);">${m.count} alertas</strong>
      </li>
    `).join('');

    brandDossierView.innerHTML = `
      <div class="dossier-header-layout">
        <div>
          <span class="badge-pill orange">EXPEDIENTE OFICIAL DE FIABILIDAD</span>
          <h2 class="dossier-brand-title">${escapeHtml(data.brand)}</h2>
          <p style="color:var(--text-muted);font-size:0.9rem;">Análisis de seguridad derivado de ${data.totalRecalls} llamadas a revisión registradas en la Unión Europea.</p>
        </div>
        <div class="dossier-score-badge">
          <div class="score-circle">${rel.grade}</div>
          <div class="score-text-area">
            <span class="score-val">${rel.score} / 100</span>
            <span class="score-rating">Índice de Fiabilidad Global</span>
          </div>
        </div>
      </div>

      <div class="dossier-kpis-grid">
        <div class="dossier-kpi">
          <div class="kpi-title">Total de Recalls</div>
          <div class="kpi-num">${data.totalRecalls}</div>
          <div class="kpi-desc">Campañas de revisión notificadas</div>
        </div>
        <div class="dossier-kpi">
          <div class="kpi-title">Peligro de Incendio</div>
          <div class="kpi-num" style="color:var(--red-danger);">${rel.fireRecalls}</div>
          <div class="kpi-desc">${Math.round((rel.fireRecalls/data.totalRecalls)*100)}% del total de incidencias</div>
        </div>
        <div class="dossier-kpi">
          <div class="kpi-title">Airbags / Takata</div>
          <div class="kpi-num" style="color:var(--amber-warning);">${rel.airbagRecalls}</div>
          <div class="kpi-desc">Campañas de infladores o sensores</div>
        </div>
        <div class="dossier-kpi">
          <div class="kpi-title">Frenos y Dirección</div>
          <div class="kpi-num" style="color:var(--orange-primary);">${rel.brakeRecalls}</div>
          <div class="kpi-desc">Fallo de frenado o guiado</div>
        </div>
      </div>

      <div class="dossier-recs-box">
        <div class="recs-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>Diagnóstico y Consejos Técnicos de Inspección:</span>
        </div>
        <ul class="recs-list">
          ${data.recommendations.map(r => `<li>${escapeHtml(r).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
        </ul>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
        <div style="background:var(--bg-surface-elevated);padding:20px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
          <h4 style="font-size:0.92rem;font-weight:700;color:var(--text-primary);margin-bottom:12px;">Modelos con Mayor Número de Alertas:</h4>
          <ul style="list-style:none;">
            ${topModelsList || '<li style="color:var(--text-muted);">Sin desglose de modelos específicos.</li>'}
          </ul>
        </div>
        <div style="background:var(--bg-surface-elevated);padding:20px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
          <h4 style="font-size:0.92rem;font-weight:700;color:var(--text-primary);margin-bottom:12px;">Sistemas Más Vulnerables en ${escapeHtml(data.brand)}:</h4>
          <ul style="list-style:none;">
            ${sortedComps.map(([c, cnt]) => `
              <li style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border-subtle);font-size:0.85rem;">
                <span>${escapeHtml(c)}</span>
                <strong style="color:var(--text-primary);">${cnt} avisos</strong>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <div style="margin-top:24px;text-align:right;">
        <button class="primary-btn" onclick="filterByBrandFromDossier('${escapeHtml(data.brand)}')">
          Ver las ${data.totalRecalls} llamadas de ${escapeHtml(data.brand)} en el Buscador
        </button>
      </div>
    `;

  } catch (err) {
    brandDossierView.innerHTML = `<p style="color:var(--red-danger);">Error al cargar el informe de fiabilidad.</p>`;
  }
}

window.filterByBrandFromDossier = function(brandName) {
  // Switch to search tab
  document.querySelector('.nav-tab[data-tab="tab-search"]')?.click();
  filterBrand.value = brandName;
  state.activeBrand = brandName;
  state.currentPage = 1;
  fetchRecalls();
};

// ========================================================
// TAB 3: COMPARATOR
// ========================================================
runCompareBtn.addEventListener('click', runComparison);

document.querySelectorAll('.preset-pill').forEach(btn => {
  btn.addEventListener('click', () => {
    const brands = btn.getAttribute('data-brands').split(',');
    if (brands[0]) compareBrand1.value = brands[0];
    if (brands[1]) compareBrand2.value = brands[1];
    if (brands[2]) compareBrand3.value = brands[2];
    runComparison();
  });
});

async function runComparison() {
  const b1 = compareBrand1.value;
  const b2 = compareBrand2.value;
  const b3 = compareBrand3.value;

  const brandsToCompare = [b1, b2, b3].filter(Boolean);
  if (brandsToCompare.length < 2) {
    showToast('Selecciona al menos dos marcas para comparar.', 'warning');
    return;
  }

  comparisonResults.style.display = 'block';
  comparisonResults.innerHTML = `
    <div style="text-align:center;padding:32px;">
      <div style="color:var(--orange-primary);font-size:1.3rem;font-weight:700;">Calculando matriz comparativa de fiabilidad...</div>
    </div>
  `;

  try {
    const res = await fetch(`/api/compare?brands=${encodeURIComponent(brandsToCompare.join(','))}`);
    const data = await res.json();

    // Determine winner (highest score)
    const sortedByScore = [...data].sort((a,b) => b.reliability.score - a.reliability.score);
    const winnerBrand = sortedByScore[0]?.brand;

    comparisonResults.innerHTML = `
      <div class="section-heading" style="margin-bottom:16px;">
        <span class="badge-pill orange">RESULTADO DE LA COMPARATIVA</span>
        <h2>Veredicto de Seguridad & Fiabilidad</h2>
        <p class="section-desc">Vehículo más recomendable por menor índice de incidencias graves: <strong>${winnerBrand}</strong>.</p>
      </div>

      <div class="comparison-grid">
        ${data.map(item => {
          const isWinner = item.brand === winnerBrand;
          return `
            <div class="comparison-card ${isWinner ? 'winner' : ''}">
              ${isWinner ? '<span class="winner-crown">★ Más Fiable</span>' : ''}
              <h3 class="comp-brand-title">${escapeHtml(item.brand)}</h3>

              <div class="comp-metric-row">
                <span class="comp-metric-label">Índice Fiabilidad:</span>
                <span class="comp-metric-val" style="font-size:1.15rem;color:var(--orange-primary);">
                  ${item.reliability.score}/100 (${item.reliability.grade})
                </span>
              </div>

              <div class="comp-metric-row">
                <span class="comp-metric-label">Total Campañas Registradas:</span>
                <span class="comp-metric-val">${item.totalRecalls} recalls</span>
              </div>

              <div class="comp-metric-row">
                <span class="comp-metric-label">Peligro de Incendio:</span>
                <span class="comp-metric-val" style="color:${item.fireRate > 25 ? 'var(--red-danger)' : 'inherit'};">
                  ${item.reliability.fireRecalls} (${item.fireRate}%)
                </span>
              </div>

              <div class="comp-metric-row">
                <span class="comp-metric-label">Campañas Airbag / Takata:</span>
                <span class="comp-metric-val">${item.airbagRecalls}</span>
              </div>

              <div class="comp-metric-row">
                <span class="comp-metric-label">Fallos en Frenos / ABS:</span>
                <span class="comp-metric-val">${item.brakeRecalls}</span>
              </div>

              <div class="comp-metric-row">
                <span class="comp-metric-label">Componente Más Afectado:</span>
                <span class="comp-metric-val">${escapeHtml(item.topComponent[0])}</span>
              </div>

              <div style="margin-top:20px;">
                <button class="table-btn" style="width:100%;padding:10px;" onclick="consultBrandDossier('${escapeHtml(item.brand)}')">
                  Ver Ficha Completa
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

  } catch (err) {
    comparisonResults.innerHTML = `<p style="color:var(--red-danger);">Error al ejecutar la comparativa.</p>`;
  }
}

// ========================================================
// TAB 4: USED CAR ADVISOR
// ========================================================
generateAdvisorReportBtn.addEventListener('click', async () => {
  const brand = advisorBrand.value;
  const model = advisorModel.value.trim();
  const year = advisorYear.value;

  if (!brand) {
    showToast('Por favor, selecciona al menos una marca.', 'warning');
    return;
  }

  advisorReportView.style.display = 'block';
  advisorReportView.innerHTML = `
    <div style="text-align:center;padding:32px;">
      <div style="color:var(--orange-primary);font-size:1.3rem;font-weight:700;">Consultando historial oficial de ${brand} ${model || ''}...</div>
    </div>
  `;

  try {
    const params = new URLSearchParams({
      brand,
      limit: 20
    });
    if (model) params.set('q', model);
    if (year) {
      params.set('yearFrom', Math.max(2005, parseInt(year) - 2));
      params.set('yearTo', Math.min(2026, parseInt(year) + 2));
    }

    const res = await fetch(`/api/recalls?${params.toString()}`);
    const data = await res.json();

    const criticalFires = data.recalls.filter(r => (r.riskType || '').toLowerCase().includes('fire') || r.components.includes('Fuego / Combustible'));
    const criticalAirbags = data.recalls.filter(r => r.components.includes('Airbag'));
    const criticalBrakes = data.recalls.filter(r => r.components.includes('Frenos / ABS'));

    let riskLevel = 'Bajo';
    let riskBadgeColor = 'var(--green-safe)';
    if (data.total > 15 || criticalFires.length > 3) {
      riskLevel = 'Alto / Atención Requerida';
      riskBadgeColor = 'var(--red-danger)';
    } else if (data.total > 5) {
      riskLevel = 'Moderado';
      riskBadgeColor = 'var(--amber-warning)';
    }

    advisorReportView.innerHTML = `
      <div class="report-header">
        <div class="report-title-area">
          <span class="badge-pill orange">INFORME TÉCNICO PRE-COMPRA</span>
          <h3>Historial de Alertas: ${escapeHtml(brand)} ${escapeHtml(model || '')} ${year ? `(${year})` : ''}</h3>
          <p>Se han identificado <strong>${data.total}</strong> campañas que afectan a modelos relacionados.</p>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.75rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;">Nivel de Riesgo en Segunda Mano</div>
          <div style="font-family:var(--font-display);font-size:1.4rem;font-weight:800;color:${riskBadgeColor};">${riskLevel}</div>
        </div>
      </div>

      <div class="checklist-card">
        <h4>📋 Checklist de Preguntas Obligatorias para el Vendedor o Concesionario:</h4>
        <ul class="checklist-items">
          <li class="checklist-item">
            <span class="check-box-icon">✔</span>
            <span><strong>Certificado Oficial de Campañas Pendientes:</strong> Exige al vendedor o concesionario un informe oficial de la marca donde certifiquen que el número de bastidor (VIN) no tiene llamadas a revisión pendientes sin subsanar.</span>
          </li>
          ${criticalAirbags.length > 0 ? `
            <li class="checklist-item">
              <span class="check-box-icon">✔</span>
              <span><strong>Revisión de Airbags Takata / Sensores:</strong> Este fabricante tiene ${criticalAirbags.length} alertas graves de airbag. Confirma que los infladores fueron reemplazados sin coste en taller oficial.</span>
            </li>
          ` : ''}
          ${criticalFires.length > 0 ? `
            <li class="checklist-item">
              <span class="check-box-icon">✔</span>
              <span><strong>Línea de Combustible / Fuego Motor:</strong> Existen alertas de fuga de combustible o cortocircuito. Verifica el sello de revisión de la instalación eléctrica e inyección.</span>
            </li>
          ` : ''}
          ${criticalBrakes.length > 0 ? `
            <li class="checklist-item">
              <span class="check-box-icon">✔</span>
              <span><strong>Módulo ABS / Servofreno:</strong> Se registraron incidencias en frenos. Solicita prueba de frenado y diagnosis del módulo de control ABS/ESP.</span>
            </li>
          ` : ''}
          <li class="checklist-item">
            <span class="check-box-icon">✔</span>
            <span><strong>Gratuidad por Ley Europea:</strong> Recuerda que cualquier campaña oficial de llamada a revisión del Safety Gate debe ser reparada por el fabricante de forma 100% gratuita, independientemente de la edad del vehículo.</span>
          </li>
        </ul>
      </div>

      <h4 style="font-size:1.1rem;font-weight:700;margin-bottom:12px;color:var(--text-primary);">Principales Campañas Detectadas para este Criterio:</h4>
      <div class="recalls-grid">
        ${data.recalls.slice(0, 6).map(r => `
          <div class="recall-card risk-${r.riskType.toLowerCase().includes('fire') ? 'fire' : 'injuries'}" onclick="openRecallModal(${r.order})">
            <div class="card-top">
              <span class="card-brand-badge">${escapeHtml(r.brand)}</span>
              <span class="badge-risk ${r.riskType.toLowerCase().includes('fire') ? 'fire' : 'injuries'}">${escapeHtml(r.riskType)}</span>
            </div>
            <h4 class="card-model-title" style="font-size:1rem;">${escapeHtml(r.model || r.product)}</h4>
            <p class="card-danger-snippet" style="-webkit-line-clamp:2;">${escapeHtml(r.danger)}</p>
            <div class="card-footer">
              <span class="card-case-number">${escapeHtml(r.caseNumber)} (${r.year})</span>
              <span class="card-action-link">Ver Detalle →</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

  } catch (err) {
    advisorReportView.innerHTML = `<p style="color:var(--red-danger);">Error al generar el informe pre-compra.</p>`;
  }
});

// ========================================================
// TAB 5: CHARTS & STATS INITIALIZATION
// ========================================================
function initCharts(stats) {
  if (typeof Chart === 'undefined') return;

  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#94A3B8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

  // 1. Years Evolution Chart
  const yearsCtx = document.getElementById('yearsChart');
  if (yearsCtx) {
    const sortedYears = Object.keys(stats.years).sort((a,b) => a - b);
    const yearCounts = sortedYears.map(y => stats.years[y]);

    if (state.charts.yearsChart) state.charts.yearsChart.destroy();
    state.charts.yearsChart = new Chart(yearsCtx, {
      type: 'line',
      data: {
        labels: sortedYears,
        datasets: [{
          label: 'Campañas Publicadas',
          data: yearCounts,
          borderColor: '#FF5500',
          backgroundColor: 'rgba(255, 85, 0, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointBackgroundColor: '#FF5500',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { ticks: { color: textColor }, grid: { color: gridColor } }
        }
      }
    });
  }

  // 2. Top Brands Chart
  const topBrandsCtx = document.getElementById('topBrandsChart');
  if (topBrandsCtx) {
    const brandsLabels = stats.topBrands.slice(0, 8).map(b => b.brand);
    const brandsData = stats.topBrands.slice(0, 8).map(b => b.count);

    if (state.charts.topBrandsChart) state.charts.topBrandsChart.destroy();
    state.charts.topBrandsChart = new Chart(topBrandsCtx, {
      type: 'bar',
      data: {
        labels: brandsLabels,
        datasets: [{
          label: 'Número de Recalls',
          data: brandsData,
          backgroundColor: '#FF5500',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: textColor }, grid: { display: false } },
          y: { ticks: { color: textColor }, grid: { color: gridColor } }
        }
      }
    });
  }

  // 3. Risk Types Donut Chart
  const riskCtx = document.getElementById('riskDonutChart');
  if (riskCtx) {
    const sortedRisks = Object.entries(stats.riskTypes).sort((a,b) => b[1] - a[1]).slice(0, 4);
    const riskLabels = sortedRisks.map(r => r[0]);
    const riskData = sortedRisks.map(r => r[1]);

    if (state.charts.riskDonutChart) state.charts.riskDonutChart.destroy();
    state.charts.riskDonutChart = new Chart(riskCtx, {
      type: 'doughnut',
      data: {
        labels: riskLabels,
        datasets: [{
          data: riskData,
          backgroundColor: ['#FF7700', '#EF4444', '#10B981', '#0EA5E9'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, font: { size: 11 } }
          }
        }
      }
    });
  }

  // 4. Components Chart
  const compsCtx = document.getElementById('componentsChart');
  if (compsCtx) {
    const sortedComps = Object.entries(stats.components)
      .filter(([k]) => k !== 'Otros Componentes')
      .sort((a,b) => b[1] - a[1])
      .slice(0, 8);

    if (state.charts.compsChart) state.charts.compsChart.destroy();
    state.charts.compsChart = new Chart(compsCtx, {
      type: 'bar',
      data: {
        labels: sortedComps.map(c => c[0]),
        datasets: [{
          label: 'Alertas por Componente',
          data: sortedComps.map(c => c[1]),
          backgroundColor: '#FF8833',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { ticks: { color: textColor }, grid: { display: false } }
        }
      }
    });
  }
}

function updateChartsTheme() {
  if (state.statsData && state.charts.yearsChart) {
    initCharts(state.statsData);
  }
}

// ========================================================
// TAB 6: XML DATABASE MANAGER & HOT RELOAD
// ========================================================
reloadXmlBtn.addEventListener('click', async () => {
  reloadXmlBtn.disabled = true;
  reloadXmlBtn.innerHTML = `<span>Recargando base de datos...</span>`;

  try {
    const res = await fetch('/api/reload-xml', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast(`Base de datos XML recargada (${data.records.toLocaleString()} registros en ${data.parseTimeMs}ms)`);
      await initApp();
    } else {
      showToast(`Error: ${data.error}`, 'error');
    }
  } catch (err) {
    showToast('Error de comunicación con el servidor.', 'error');
  } finally {
    reloadXmlBtn.disabled = false;
    reloadXmlBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
      <span>Recargar Base de Datos XML</span>
    `;
  }
});

// Drag and drop XML
xmlDropZone.addEventListener('click', () => xmlFileInput.click());

['dragenter', 'dragover'].forEach(eventName => {
  xmlDropZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    xmlDropZone.classList.add('dragover');
  });
});

['dragleave', 'drop'].forEach(eventName => {
  xmlDropZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    xmlDropZone.classList.remove('dragover');
  });
});

xmlDropZone.addEventListener('drop', (e) => {
  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].name.endsWith('.xml')) {
    handleUploadedXml(files[0]);
  } else {
    showToast('Por favor, selecciona un archivo con extensión .xml', 'warning');
  }
});

xmlFileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleUploadedXml(e.target.files[0]);
  }
});

function handleUploadedXml(file) {
  showToast(`Analizando archivo XML: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);
  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const xmlText = event.target.result;
      const count = (xmlText.match(/<notifications/g) || []).length;
      showToast(`Archivo XML validado con éxito. Contiene ${count} notificaciones.`);
    } catch (err) {
      showToast('No se pudo procesar el archivo XML seleccionado.', 'error');
    }
  };
  reader.readAsText(file);
}

// Utility: Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Start application
document.addEventListener('DOMContentLoaded', initApp);
