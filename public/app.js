/**
 * RECALLSCOPE - Consultor de Campañas & Fiabilidad
 * Frontend Application Controller with i18n & Table Sorting
 */

// ========================================================
// I18N DICTIONARIES (ES / EN)
// ========================================================
const I18N = {
  es: {
    bannerTag: 'BASE DE DATOS XML ACTIVA',
    bannerLoading: 'Cargando base de datos oficial Safety Gate...',
    bannerYears: 'Datos: 2005 - 2026',
    bannerEu: '🇪🇺 Comisión Europea (RAPEX)',
    brandSubtitle: 'Consultor de Recalls & Fiabilidad Automotriz',

    // Tabs
    tabSearch: 'Buscador de Campañas',
    tabReliability: 'Índice de Fiabilidad',
    tabComparator: 'Comparador',
    tabUsedCar: 'Asesor Pre-Compra',
    tabStats: 'Estadísticas',
    tabDatabase: 'Base de Datos XML',

    // Theme
    themeDark: 'Modo Oscuro',
    themeLight: 'Modo Claro',

    // Hero Stats
    heroRecallsTitle: 'Campañas de Revisión',
    heroRecallsDesc: 'Registros oficiales en el XML',
    heroFireTitle: 'Riesgo de Fuego',
    heroFireDesc: 'Fugas, cableado e inyección',
    heroAirbagTitle: 'Airbags & Takata',
    heroAirbagDesc: 'Proyectiles y fallo inflador',
    heroBrandsTitle: 'Marcas Indexadas',
    heroBrandsDesc: 'Turismos, motos y vehículos comerciales',

    // Search & Filters
    searchPlaceholder: 'Buscar por marca, modelo (ej: 3008, Clase A, Qashqai, Golf), código de recall (K07, Takata), número de caso o defecto...',
    searchBtnText: 'Buscar',
    quickChipsLabel: 'Filtros Rápidos:',

    // Chip names
    chipAll: 'Todos los Sistemas',
    chipFire: '🔥 Fuego / Combustible',
    chipAirbag: '💥 Airbags / Takata',
    chipBrakes: '🛑 Frenos / ABS',
    chipBattery: '⚡ Batería / EV e Híbridos',
    chipSteering: '🔄 Dirección y Eje',
    chipSuspension: '🛠️ Suspensión / Chasis',
    chipSoftware: '💻 Software / ADAS',
    chipSeatbelts: '💺 Cinturones y Asientos',

    labelBrand: 'Marca de Vehículo',
    optAllBrands: 'Todas las Marcas',
    labelRisk: 'Tipo de Riesgo',
    optAllRisks: 'Todos los Riesgos',
    optInjuries: 'Lesiones (Injuries)',
    optFire: 'Incendio (Fire)',
    optEnvironment: 'Medio Ambiente / Emisiones',
    optBurns: 'Quemaduras (Burns)',
    optChemical: 'Químico (Chemical)',
    labelYear: 'Año Publicación',
    optYearFrom: 'Desde (Cualquiera)',
    optYearTo: 'Hasta (2026)',
    labelLevel: 'Nivel de Alerta',
    optAllLevels: 'Todos los Niveles',
    optSeriousRisk: 'Riesgo Grave (Serious risk)',
    optOtherRisk: 'Otros niveles de riesgo',
    resetFiltersBtn: 'Limpiar todos los filtros',
    sortByLabel: 'Ordenar por:',
    sortDateDesc: 'Más recientes primero (2026 → 2005)',
    sortDateAsc: 'Más antiguos primero',
    sortSeverity: 'Mayor criticidad (Fuego / Grave)',
    sortBrandAsc: 'Marca (A → Z)',
    exportCsvText: 'Exportar CSV',
    prevPageText: 'Anterior',
    nextPageText: 'Siguiente',
    pageOf: 'Página {page} de {total}',
    resultsCountText: '{count} Campañas Encontradas',
    resultsFilteredSub: '(Filtrado por criterios de seguridad)',
    resultsAllSub: '(Catálogo completo Safety Gate UE)',
    noRecallsTitle: 'No se encontraron llamadas a revisión',
    noRecallsDesc: 'Prueba a modificar los términos de búsqueda, seleccionar "Todas las Marcas" o limpiar los filtros activos.',
    viewDossierLink: 'Ver Expediente',
    caseLabel: 'Caso: ',

    // Reliability Tab
    relPill: 'ÍNDICE OFICIAL AUTOMOTRIZ',
    relHeading: 'Consultor de Fiabilidad por Marca & Modelo',
    relDesc: 'Puntuación de fiabilidad (0 a 100) calculada algorítmicamente en base a las 6.457 alertas del Safety Gate. Pondera el volumen de llamadas, recurrencia de peligro de incendio, fallos en frenos y campañas críticas recientes.',
    legendAPlusTitle: 'Excelente (90-100)',
    legendAPlusDesc: 'Mínima tasa de alertas graves',
    legendATitle: 'Muy Bueno (80-89)',
    legendADesc: 'Incidencias aisladas o menores',
    legendBTitle: 'Aceptable (70-79)',
    legendBDesc: 'Campañas habituales de ajuste',
    legendCTitle: 'Atención (55-69)',
    legendCDesc: 'Recurrencia en componentes clave',
    legendDTitle: 'Alerta Crítica (<55)',
    legendDDesc: 'Alto volumen de fuego o fallos graves',
    dossierSelectHeader: 'Selecciona una Marca para ver su Expediente Técnico de Fiabilidad',
    dossierSelectDesc: 'Accede a estadísticas de componentes vulnerables, modelos más afectados y consejos de inspección.',
    optSelectBrand: 'Selecciona una marca...',
    dossierBtnText: 'Consultar Expediente',
    rankingTableTitle: 'Ranking de Fiabilidad de las Principales Marcas (Clic en cabecera para ordenar)',
    rankingSearchPlaceholder: 'Filtrar marcas en el ranking...',

    // Table Headers
    thBrand: 'Marca',
    thScore: 'Índice de Fiabilidad',
    thGrade: 'Calificación',
    thTotal: 'Total Recalls',
    thFire: 'Riesgo Fuego',
    thAirbag: 'Airbag / Takata',
    thBrakes: 'Frenos / ABS',
    thActions: 'Acciones',
    btnViewFile: 'Ver Ficha',

    // Comparator Tab
    compPill: 'HERRAMIENTA CARA A CARA',
    compHeading: 'Comparador de Fiabilidad & Llamadas a Revisión',
    compDesc: 'Compara directamente hasta 3 marcas o modelos para descubrir cuál tiene un historial más limpio, menos peligro de fuego y mayor seguridad a largo plazo.',
    compBrand1Label: 'Vehículo / Marca 1',
    compBrand2Label: 'Vehículo / Marca 2',
    compBrand3Label: 'Vehículo / Marca 3 (Opcional)',
    compSelectFirst: 'Selecciona primera marca...',
    compSelectSecond: 'Selecciona segunda marca...',
    compSelectThird: '(Opcional) Tercera marca...',
    compRunBtn: 'Comparar Modelos Ahora',
    compPresetsLabel: 'Comparativas Populares:',
    compWinnerBadge: '★ Más Fiable',
    compVerdictTitle: 'Veredicto de Seguridad & Fiabilidad',
    compVerdictDesc: 'Vehículo más recomendable por menor índice de incidencias graves: {brand}.',
    compMetricTotal: 'Total Campañas Registradas:',
    compMetricFire: 'Peligro de Incendio:',
    compMetricAirbag: 'Campañas Airbag / Takata:',
    compMetricBrakes: 'Fallos en Frenos / ABS:',
    compMetricTopComp: 'Componente Más Afectado:',

    // Used Car Advisor
    advPill: 'INSPECCIÓN SEGUNDA MANO',
    advHeading: 'Asesor Técnico Pre-Compra & Alertas VIN',
    advDesc: '¿Vas a comprar un coche de segunda mano? Comprueba en segundos si el modelo tiene llamadas a revisión críticas obligatorias que el anterior dueño debió subsanar en taller oficial.',
    advBrandLabel: '1. Marca del Vehículo',
    advModelLabel: '2. Modelo (o escribe palabras clave)',
    advYearLabel: '3. Año de Fabricación / Matriculación',
    advSelectBrand: 'Selecciona la marca...',
    advSelectYear: 'Cualquier año (2005 - 2026)',
    advGenerateBtn: 'Generar Diagnóstico Pre-Compra',
    advRiskLow: 'Bajo',
    advRiskMod: 'Moderado',
    advRiskHigh: 'Alto / Atención Requerida',
    advRiskTitle: 'Nivel de Riesgo en Segunda Mano',

    // Stats
    statsPill: 'PANEL DE INTELIGENCIA DE DATOS',
    statsHeading: 'Radiografía y Estadísticas Oficiales de Recalls',
    statsDesc: 'Evolución temporal, análisis de componentes defectuosos y distribución de riesgos en los 6.457 registros del Safety Gate.',
    chartYearsTitle: 'Evolución Histórica de Llamadas a Revisión (2005 - 2026)',
    chartYearsBadge: '6.457 Alertas analizadas',
    chartTopBrandsTitle: 'Top 10 Marcas con Más Campañas de Revisión',
    chartTopBrandsBadge: 'Volumen total',
    chartRiskTitle: 'Distribución por Tipo de Riesgo',
    chartRiskBadge: 'Fuego, Lesiones, Entorno',
    chartCompsTitle: 'Sistemas y Componentes Críticos Más Afectados',
    chartCompsBadge: 'Distribución de fallos mecánicos y electrónicos',

    // Database Manager
    dbPill: 'FUENTE DE DATOS PRIMARIA',
    dbHeading: 'Gestor de la Base de Datos XML',
    dbDesc: 'Información del archivo XML utilizado como backend, estadísticas de análisis y herramientas para recargar o actualizar datos en caliente.',
    dbCardHeaderTitle: 'Base de Datos XML Activa',
    dbConnectedBadge: '● Conectado y Verificado',
    dbLabelFileName: 'Archivo de Origen:',
    dbLabelFilePath: 'Ubicación física:',
    dbLabelFileSize: 'Tamaño del archivo:',
    dbLabelTotalRecords: 'Total de Campañas Registradas:',
    dbLabelParseTime: 'Tiempo de parseo XML en memoria:',
    dbLabelLastLoaded: 'Última lectura:',
    dbReloadBtnText: 'Recargar Base de Datos XML',
    dbUploadCardTitle: 'Cargar o Reemplazar XML',
    dbUploadCardDesc: '¿Tienes una versión actualizada descargada de la Comisión Europea?',
    dropZoneTitle: 'Arrastra y suelta tu archivo XML aquí',
    dropZoneDesc: 'o haz clic para examinar desde tu equipo',
    dbUploadNote: 'El formato aceptado es el estándar de exportación de <strong>Safety Gate Motor Vehicles Weekly Report (XML)</strong> de la Unión Europea.',

    // Modal
    modalCaseLabel: 'Nº de Caso Safety Gate:',
    modalPubDateLabel: 'Fecha Publicación:',
    modalCodeLabel: 'Código Campaña Fabricante:',
    modalDangerTitle: 'Defecto Técnico & Peligro para la Seguridad',
    modalMeasuresTitle: 'Medidas Oficiales & Reparación Gratuita',
    modalTechTitle: 'Modelos Afectados, Homologaciones & Fechas de Producción',
    modalNotifyingLabel: 'País Notificante (UE):',
    modalOriginLabel: 'País de Origen de Fabricación:',
    modalComponentsLabel: 'Categoría de Componente:',
    modalEuLinkBtn: 'Ver Alerta Oficial en Safety Gate UE',
    modalCopyRefBtn: 'Copiar Referencia',
    modalPrintBtn: 'Imprimir Expediente'
  },

  en: {
    bannerTag: 'ACTIVE XML DATABASE',
    bannerLoading: 'Loading official Safety Gate database...',
    bannerYears: 'Data: 2005 - 2026',
    bannerEu: '🇪🇺 European Commission (RAPEX)',
    brandSubtitle: 'Automotive Recalls & Reliability Consultant',

    // Tabs
    tabSearch: 'Campaign Search',
    tabReliability: 'Reliability Index',
    tabComparator: 'Comparator',
    tabUsedCar: 'Pre-Purchase Advisor',
    tabStats: 'Statistics',
    tabDatabase: 'XML Database',

    // Theme
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',

    // Hero Stats
    heroRecallsTitle: 'Recall Campaigns',
    heroRecallsDesc: 'Official records in XML',
    heroFireTitle: 'Fire Hazard',
    heroFireDesc: 'Leaks, wiring & injection',
    heroAirbagTitle: 'Airbags & Takata',
    heroAirbagDesc: 'Projectiles & inflator failures',
    heroBrandsTitle: 'Indexed Makes',
    heroBrandsDesc: 'Passenger cars, bikes & commercial',

    // Search & Filters
    searchPlaceholder: 'Search by make, model (e.g. 3008, A-Class, Qashqai, Golf), recall code (K07, Takata), case number or defect...',
    searchBtnText: 'Search',
    quickChipsLabel: 'Quick Filters:',

    // Chip names
    chipAll: 'All Systems',
    chipFire: '🔥 Fire / Fuel',
    chipAirbag: '💥 Airbags / Takata',
    chipBrakes: '🛑 Brakes / ABS',
    chipBattery: '⚡ Battery / EV & Hybrid',
    chipSteering: '🔄 Steering & Axle',
    chipSuspension: '🛠️ Suspension / Chassis',
    chipSoftware: '💻 Software / ADAS',
    chipSeatbelts: '💺 Seatbelts & Seats',

    labelBrand: 'Vehicle Make',
    optAllBrands: 'All Makes',
    labelRisk: 'Risk Type',
    optAllRisks: 'All Risks',
    optInjuries: 'Injuries',
    optFire: 'Fire',
    optEnvironment: 'Environment / Emissions',
    optBurns: 'Burns',
    optChemical: 'Chemical',
    labelYear: 'Publication Year',
    optYearFrom: 'From (Any)',
    optYearTo: 'To (2026)',
    labelLevel: 'Alert Level',
    optAllLevels: 'All Levels',
    optSeriousRisk: 'Serious risk',
    optOtherRisk: 'Other risk levels',
    resetFiltersBtn: 'Clear all filters',
    sortByLabel: 'Sort by:',
    sortDateDesc: 'Most recent first (2026 → 2005)',
    sortDateAsc: 'Oldest first',
    sortSeverity: 'Highest severity (Fire / Serious)',
    sortBrandAsc: 'Make (A → Z)',
    exportCsvText: 'Export CSV',
    prevPageText: 'Previous',
    nextPageText: 'Next',
    pageOf: 'Page {page} of {total}',
    resultsCountText: '{count} Campaigns Found',
    resultsFilteredSub: '(Filtered by safety criteria)',
    resultsAllSub: '(Complete EU Safety Gate catalog)',
    noRecallsTitle: 'No recall campaigns found',
    noRecallsDesc: 'Try adjusting your search terms, selecting "All Makes" or clearing active filters.',
    viewDossierLink: 'View Dossier',
    caseLabel: 'Case: ',

    // Reliability Tab
    relPill: 'OFFICIAL AUTOMOTIVE INDEX',
    relHeading: 'Reliability Consultant by Make & Model',
    relDesc: 'Reliability rating (0 to 100) algorithmically calculated from 6,457 official EU Safety Gate recall notices. Factors in total recall volume, fire hazard frequency, brake/steering failures, and recent critical campaigns.',
    legendAPlusTitle: 'Excellent (90-100)',
    legendAPlusDesc: 'Minimal serious alert rate',
    legendATitle: 'Very Good (80-89)',
    legendADesc: 'Isolated or minor issues',
    legendBTitle: 'Acceptable (70-79)',
    legendBDesc: 'Standard adjustment recalls',
    legendCTitle: 'Caution (55-69)',
    legendCDesc: 'Recurrence in key components',
    legendDTitle: 'Critical Alert (<55)',
    legendDDesc: 'High volume of fire or major failures',
    dossierSelectHeader: 'Select a Make to View its Technical Reliability Dossier',
    dossierSelectDesc: 'Access statistics on vulnerable components, most affected models, and inspection tips.',
    optSelectBrand: 'Select a make...',
    dossierBtnText: 'View Dossier',
    rankingTableTitle: 'Brand Reliability Ranking (Click column header to sort)',
    rankingSearchPlaceholder: 'Filter makes in ranking...',

    // Table Headers
    thBrand: 'Make / Brand',
    thScore: 'Reliability Index',
    thGrade: 'Grade',
    thTotal: 'Total Recalls',
    thFire: 'Fire Hazard',
    thAirbag: 'Airbag / Takata',
    thBrakes: 'Brakes / ABS',
    thActions: 'Actions',
    btnViewFile: 'View Dossier',

    // Comparator Tab
    compPill: 'HEAD-TO-HEAD TOOL',
    compHeading: 'Reliability & Recall Comparator',
    compDesc: 'Directly compare up to 3 makes or models to discover which has a cleaner history, fewer fire hazards, and higher long-term safety.',
    compBrand1Label: 'Vehicle / Make 1',
    compBrand2Label: 'Vehicle / Make 2',
    compBrand3Label: 'Vehicle / Make 3 (Optional)',
    compSelectFirst: 'Select first make...',
    compSelectSecond: 'Select second make...',
    compSelectThird: '(Optional) Third make...',
    compRunBtn: 'Compare Models Now',
    compPresetsLabel: 'Popular Comparisons:',
    compWinnerBadge: '★ Most Reliable',
    compVerdictTitle: 'Safety & Reliability Verdict',
    compVerdictDesc: 'Most recommended vehicle due to lowest critical failure rate: {brand}.',
    compMetricTotal: 'Total Registered Recalls:',
    compMetricFire: 'Fire Hazard Rate:',
    compMetricAirbag: 'Airbag / Takata Recalls:',
    compMetricBrakes: 'Brakes / ABS Failures:',
    compMetricTopComp: 'Top Affected Component:',

    // Used Car Advisor
    advPill: 'USED CAR INSPECTION',
    advHeading: 'Pre-Purchase Technical Advisor & VIN Alerts',
    advDesc: 'Buying a used car? Check in seconds if the model has mandatory critical recall campaigns that the previous owner must have completed at an official dealership.',
    advBrandLabel: '1. Vehicle Make',
    advModelLabel: '2. Model (or enter keywords)',
    advYearLabel: '3. Production / Registration Year',
    advSelectBrand: 'Select make...',
    advSelectYear: 'Any year (2005 - 2026)',
    advGenerateBtn: 'Generate Pre-Purchase Report',
    advRiskLow: 'Low',
    advRiskMod: 'Moderate',
    advRiskHigh: 'High / Attention Required',
    advRiskTitle: 'Used Car Risk Level',

    // Stats
    statsPill: 'DATA INTELLIGENCE DASHBOARD',
    statsHeading: 'Official Recall Demographics & Statistics',
    statsDesc: 'Historical evolution, vulnerable component breakdown, and risk distribution across the 6,457 Safety Gate records.',
    chartYearsTitle: 'Historical Recall Evolution (2005 - 2026)',
    chartYearsBadge: '6,457 Analyzed alerts',
    chartTopBrandsTitle: 'Top 10 Makes with Most Recall Campaigns',
    chartTopBrandsBadge: 'Total volume',
    chartRiskTitle: 'Risk Type Distribution',
    chartRiskBadge: 'Fire, Injuries, Environment',
    chartCompsTitle: 'Most Affected Systems & Components',
    chartCompsBadge: 'Distribution of mechanical and electrical defects',

    // Database Manager
    dbPill: 'PRIMARY DATA SOURCE',
    dbHeading: 'XML Database Manager',
    dbDesc: 'Information about the XML file powering the database, parsing performance, and hot-reload tools.',
    dbCardHeaderTitle: 'Active XML Database',
    dbConnectedBadge: '● Connected and Verified',
    dbLabelFileName: 'Source File:',
    dbLabelFilePath: 'Disk Location:',
    dbLabelFileSize: 'File Size:',
    dbLabelTotalRecords: 'Total Registered Campaigns:',
    dbLabelParseTime: 'In-memory XML Parse Time:',
    dbLabelLastLoaded: 'Last Read:',
    dbReloadBtnText: 'Reload XML Database',
    dbUploadCardTitle: 'Upload or Replace XML',
    dbUploadCardDesc: 'Have an updated weekly export from the European Commission?',
    dropZoneTitle: 'Drag and drop your XML file here',
    dropZoneDesc: 'or click to browse from your device',
    dbUploadNote: 'Accepted format is the standard <strong>Safety Gate Motor Vehicles Weekly Report (XML)</strong> from the European Union.',

    // Modal
    modalCaseLabel: 'Safety Gate Case No:',
    modalPubDateLabel: 'Publication Date:',
    modalCodeLabel: 'Manufacturer Campaign Code:',
    modalDangerTitle: 'Technical Defect & Safety Hazard',
    modalMeasuresTitle: 'Official Measures & Free Repair',
    modalTechTitle: 'Affected Models, Type-Approvals & Production Dates',
    modalNotifyingLabel: 'Notifying Country (EU):',
    modalOriginLabel: 'Manufacturing Country of Origin:',
    modalComponentsLabel: 'Component Category:',
    modalEuLinkBtn: 'View Official Alert on EU Safety Gate',
    modalCopyRefBtn: 'Copy Reference',
    modalPrintBtn: 'Print Dossier'
  }
};

// State
const state = {
  theme: localStorage.getItem('recallscope_theme') || 'dark',
  lang: localStorage.getItem('recallscope_lang') || 'es',
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
  rankingSort: {
    column: 'score', // default sorted by reliability score
    direction: 'desc'
  },
  brandsList: [],
  charts: {},
  statsData: null,
  currentModalRecall: null
};

// Helper translation
function t(key, replacements = {}) {
  const dict = I18N[state.lang] || I18N.es;
  let text = dict[key] || I18N.es[key] || key;
  for (const [k, v] of Object.entries(replacements)) {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
  }
  return text;
}

// Translations for Data Fields (Risk types, severity, components)
function translateRiskType(risk) {
  if (state.lang === 'en') return risk || 'Injuries';
  const r = (risk || '').trim();
  const map = {
    'Injuries': 'Lesiones',
    'Fire': 'Incendio',
    'Fire, Injuries': 'Incendio, Lesiones',
    'Environment': 'Medio Ambiente',
    'Burns': 'Quemaduras',
    'Chemical': 'Químico',
    'Burns, Fire': 'Quemaduras, Incendio',
    'Burns, Injuries': 'Quemaduras, Lesiones',
    'Burns, Fire, Injuries': 'Quemaduras, Incendio, Lesiones',
    'Environment, Fire': 'Medio Ambiente, Incendio',
    'Other': 'Otros'
  };
  return map[r] || r;
}

function translateLevel(level) {
  if (state.lang === 'en') return level || 'Serious risk';
  if ((level || '').toLowerCase().includes('serious')) return 'Riesgo Grave';
  return 'Riesgo Moderado';
}

function translateComponent(comp) {
  if (state.lang === 'es') return comp;
  const map = {
    'Fuego / Combustible': 'Fire / Fuel',
    'Airbag': 'Airbag / Takata',
    'Frenos / ABS': 'Brakes / ABS',
    'Batería / EV': 'Battery / EV',
    'Dirección': 'Steering',
    'Suspensión / Ejes': 'Suspension / Axles',
    'Cinturones / Asientos': 'Seatbelts / Seats',
    'Software / Sensores': 'Software / Sensors',
    'Motor / Transmisión': 'Engine / Transmission',
    'Neumáticos / Ruedas': 'Tires / Wheels',
    'Otros Componentes': 'Other Components'
  };
  return map[comp] || comp;
}

function translateMeasuresText(text) {
  if (!text || state.lang === 'en') return text;
  return text
    .replace(/Type of economic operator taking notified measure\(s\):/gi, 'Tipo de operador económico que adopta la medida:')
    .replace(/Category of measure\(s\):/gi, 'Categoría de la medida:')
    .replace(/Voluntary corrective action taken by the manufacturer\./gi, 'Acción correctiva voluntaria adoptada por el fabricante.')
    .replace(/Voluntary corrective actions taken by the manufacturer\./gi, 'Acciones correctivas voluntarias del fabricante.')
    .replace(/Date of entry into force:\s*Unknown/gi, 'Fecha de entrada en vigor: Desconocida')
    .replace(/Recall of the product from end users/gi, 'Llamada a revisión del producto a los usuarios finales')
    .replace(/Other/gi, 'Otro');
}

// DOM Elements
const docEl = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeLabel = document.getElementById('themeLabel');
const langSelector = document.getElementById('langSelector');
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
const reliabilityTable = document.getElementById('reliabilityTable');
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
    themeLabel.textContent = t('themeDark');
  } else {
    themeLabel.textContent = t('themeLight');
  }

  updateChartsTheme();
}

function toggleTheme() {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  showToast(state.lang === 'es' ? `Cambiado a ${newTheme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}` : `Switched to ${newTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}`);
}

themeToggleBtn.addEventListener('click', toggleTheme);

// ========================================================
// LANGUAGE SWITCHING (ES / EN)
// ========================================================
function applyLanguage(lang) {
  state.lang = lang;
  docEl.setAttribute('lang', lang);
  localStorage.setItem('recallscope_lang', lang);

  // Update active button state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Update chip labels
  document.querySelectorAll('[data-i18n-chip]').forEach(el => {
    const chipKey = el.getAttribute('data-i18n-chip');
    const map = {
      all: 'chipAll',
      fire: 'chipFire',
      airbag: 'chipAirbag',
      brakes: 'chipBrakes',
      battery: 'chipBattery',
      steering: 'chipSteering',
      suspension: 'chipSuspension',
      software: 'chipSoftware',
      seatbelts: 'chipSeatbelts'
    };
    if (map[chipKey]) el.textContent = t(map[chipKey]);
  });

  // Update placeholders
  mainSearchInput.setAttribute('placeholder', t('searchPlaceholder'));
  rankingSearchInput.setAttribute('placeholder', t('rankingSearchPlaceholder'));

  // Update theme label text
  themeLabel.textContent = state.theme === 'dark' ? t('themeDark') : t('themeLight');

  // Update active sort indicator
  updateSortHeaderIcons();

  // Re-render ranking table & current search results
  if (state.brandsList && state.brandsList.length > 0) {
    renderReliabilityRanking();
  }
  fetchRecalls();

  // If comparator or advisor views are displayed, re-render them
  if (comparisonResults.style.display !== 'none' && compareBrand1.value && compareBrand2.value) {
    runComparison();
  }
}

langSelector.addEventListener('click', (e) => {
  const btn = e.target.closest('.lang-btn');
  if (!btn) return;
  const newLang = btn.getAttribute('data-lang');
  if (newLang !== state.lang) {
    applyLanguage(newLang);
    showToast(newLang === 'es' ? 'Idioma cambiado a Español 🇪🇸' : 'Language switched to English 🇬🇧');
  }
});

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
  }, 3200);
}

// ========================================================
// API DATA INITIALIZATION
// ========================================================
async function initApp() {
  applyTheme(state.theme);
  applyLanguage(state.lang);

  try {
    // 1. Fetch Status
    const statusRes = await fetch('/api/status');
    const statusData = await statusRes.json();
    bannerDbText.textContent = `${statusData.totalRecords.toLocaleString()} ${state.lang === 'es' ? 'campañas activas' : 'active campaigns'} | ${state.lang === 'es' ? 'Archivo:' : 'File:'} ${statusData.filePath.split(/[\\/]/).pop()}`;
    
    dbFileName.textContent = statusData.filePath.split(/[\\/]/).pop();
    dbFilePath.textContent = statusData.filePath;
    dbFileSize.textContent = `${statusData.fileSizeMB} MB`;
    dbTotalRecords.textContent = `${statusData.totalRecords.toLocaleString()} ${state.lang === 'es' ? 'notificaciones' : 'notifications'}`;
    dbParseTime.textContent = `${statusData.parseTimeMs} ms`;
    dbLastLoaded.textContent = new Date(statusData.lastLoaded).toLocaleString(state.lang === 'es' ? 'es-ES' : 'en-US');

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
    setupTableSorting();
    renderReliabilityRanking();

    // Initial search
    await fetchRecalls();

  } catch (err) {
    console.error('Initialization error:', err);
    bannerDbText.textContent = state.lang === 'es' ? 'Modo autónomo o error de conexión al servidor.' : 'Standalone mode or server connection error.';
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

  // Pre-select popular brands for comparator
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
      <div style="color:var(--orange-primary);font-size:1.5rem;font-weight:700;margin-bottom:8px;">
        ${state.lang === 'es' ? 'Buscando alertas de seguridad...' : 'Searching safety alerts...'}
      </div>
      <div style="color:var(--text-muted);font-size:0.9rem;">
        ${state.lang === 'es' ? 'Consultando la base de datos oficial XML' : 'Querying official XML database'}
      </div>
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
        <h3>${state.lang === 'es' ? 'Error al consultar la base de datos' : 'Database query error'}</h3>
      </div>
    `;
  }
}

function renderResultsHeader(total) {
  resultsCount.textContent = t('resultsCountText', { count: total.toLocaleString() });
  if (state.searchQuery || state.activeBrand !== 'all' || state.activeComponent !== 'all') {
    resultsSub.textContent = t('resultsFilteredSub');
  } else {
    resultsSub.textContent = t('resultsAllSub');
  }
}

function renderRecallsGrid(recalls) {
  if (!recalls || recalls.length === 0) {
    recallsGrid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:64px 20px;background:var(--bg-surface);border-radius:var(--radius-lg);border:1px dashed var(--border-strong);">
        <div style="font-size:2.5rem;margin-bottom:12px;">🔍</div>
        <h3 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:6px;">${t('noRecallsTitle')}</h3>
        <p style="color:var(--text-muted);font-size:0.9rem;max-width:500px;margin:0 auto 16px;">${t('noRecallsDesc')}</p>
        <button class="primary-btn" onclick="resetAllFilters()">${t('resetFiltersBtn')}</button>
      </div>
    `;
    paginationWrapper.style.display = 'none';
    return;
  }

  paginationWrapper.style.display = 'flex';

  recallsGrid.innerHTML = recalls.map(r => {
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

    const translatedRisk = translateRiskType(r.riskType);

    const componentBadges = (r.components || []).slice(0, 3).map(c => {
      const isCritical = c.includes('Airbag') || c.includes('Fuego') || c.includes('Frenos') || c.includes('Batería');
      return `<span class="component-tag ${isCritical ? 'alert' : ''}">${escapeHtml(translateComponent(c))}</span>`;
    }).join('');

    return `
      <article class="recall-card ${riskClass}" onclick="openRecallModal(${r.order})">
        <div class="card-top">
          <span class="card-brand-badge">${escapeHtml(r.brand)}</span>
          <div class="card-badges-right">
            <span class="badge-risk ${riskBadgeClass}">
              ${riskBadgeClass === 'fire' ? '🔥' : '⚠️'} ${escapeHtml(translatedRisk)}
            </span>
            <span class="badge-year-tag">${r.year || 'N/D'}</span>
          </div>
        </div>

        <h3 class="card-model-title">${escapeHtml(r.model || r.product)}</h3>

        <p class="card-danger-snippet">
          ${escapeHtml(r.danger || (state.lang === 'es' ? 'Defecto técnico reportado en la campaña de seguridad.' : 'Technical defect reported in safety campaign.'))}
        </p>

        <div class="card-components-row">
          ${componentBadges}
        </div>

        <div class="card-footer">
          <span class="card-case-number">${t('caseLabel')}${escapeHtml(r.caseNumber)}</span>
          <span class="card-action-link">
            <span>${t('viewDossierLink')}</span>
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
  pageSummary.textContent = t('pageOf', { page, total: totalPages });

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
  if (state.searchQuery) tags.push({ label: `${state.lang === 'es' ? 'Texto' : 'Query'}: "${state.searchQuery}"`, key: 'q' });
  if (state.activeBrand !== 'all') tags.push({ label: `${state.lang === 'es' ? 'Marca' : 'Make'}: ${state.activeBrand}`, key: 'brand' });
  if (state.activeComponent !== 'all') tags.push({ label: `${state.lang === 'es' ? 'Sistema' : 'System'}: ${translateComponent(state.activeComponent)}`, key: 'component' });
  if (state.activeRisk !== 'all') tags.push({ label: `${state.lang === 'es' ? 'Riesgo' : 'Risk'}: ${translateRiskType(state.activeRisk)}`, key: 'risk' });
  if (state.activeLevel !== 'all') tags.push({ label: `${state.lang === 'es' ? 'Nivel' : 'Level'}: ${translateLevel(state.activeLevel)}`, key: 'level' });
  if (state.activeYearFrom) tags.push({ label: `${state.lang === 'es' ? 'Desde' : 'From'}: ${state.activeYearFrom}`, key: 'yearFrom' });
  if (state.activeYearTo) tags.push({ label: `${state.lang === 'es' ? 'Hasta' : 'To'}: ${state.activeYearTo}`, key: 'yearTo' });

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
  showToast(state.lang === 'es' ? 'Filtros restablecidos.' : 'Filters cleared.');
};

resetFiltersBtn.addEventListener('click', resetAllFilters);

// Export CSV
exportCsvBtn.addEventListener('click', async () => {
  showToast(state.lang === 'es' ? 'Generando archivo CSV de resultados...' : 'Generating CSV export...');
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
    showToast(state.lang === 'es' ? 'Exportación CSV completada.' : 'CSV export completed.');
  } catch (err) {
    showToast(state.lang === 'es' ? 'Error al exportar CSV.' : 'Error exporting CSV.', 'error');
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
    modalRiskBadge.textContent = translateRiskType(r.riskType);
    modalLevel.textContent = translateLevel(r.level);
    modalProductTitle.textContent = r.model || r.product || (state.lang === 'es' ? 'Modelo no especificado' : 'Unspecified model');
    modalCaseNumber.textContent = r.caseNumber;
    modalPubDate.textContent = r.publicationDate;
    modalRecallCode.textContent = r.companyRecallCode || (state.lang === 'es' ? 'No especificado (campaña interna)' : 'Not specified (internal campaign)');
    modalDangerText.textContent = r.danger || (state.lang === 'es' ? 'Sin descripción detallada del peligro.' : 'No detailed hazard description available.');
    
    modalMeasuresText.textContent = translateMeasuresText(r.measures) || (state.lang === 'es' ? 'Medida correctiva voluntaria del fabricante (revisión e inspección en concesionario oficial sin coste).' : 'Voluntary corrective measure taken by manufacturer (free repair at authorized dealership).');

    let techDetails = '';
    if (r.type_numberOfModel) techDetails += `${state.lang === 'es' ? 'Homologaciones / Tipos:' : 'Type Approvals / Models:'}\n${r.type_numberOfModel}\n\n`;
    if (r.productionDates) techDetails += `${state.lang === 'es' ? 'Fechas de Producción Afectadas:' : 'Affected Production Dates:'}\n${r.productionDates}\n\n`;
    if (r.description) techDetails += `${state.lang === 'es' ? 'Descripción adicional:' : 'Additional description:'}\n${r.description}`;
    modalTechnicalContent.textContent = techDetails.trim() || (state.lang === 'es' ? 'No se registraron números de bastidor específicos en la notificación inicial.' : 'No specific chassis numbers were listed in initial notification.');

    modalNotifyingCountry.textContent = r.notifyingCountry || (state.lang === 'es' ? 'Comisión Europea' : 'European Commission');
    modalOriginCountry.textContent = r.countryOfOrigin || (state.lang === 'es' ? 'Internacional' : 'International');
    modalComponents.textContent = (r.components || []).map(translateComponent).join(', ') || (state.lang === 'es' ? 'General' : 'General');

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
    showToast(state.lang === 'es' ? 'No se pudo cargar el expediente.' : 'Failed to load dossier.', 'error');
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
  const text = `[RECALL EU] Make: ${state.currentModalRecall.brand} | Model: ${state.currentModalRecall.model} | Case: ${state.currentModalRecall.caseNumber} | Risk: ${state.currentModalRecall.riskType} | Link: ${state.currentModalRecall.reference}`;
  navigator.clipboard.writeText(text);
  showToast(state.lang === 'es' ? 'Referencia copiada al portapapeles.' : 'Reference copied to clipboard.');
});

modalPrintBtn.addEventListener('click', () => {
  window.print();
});

// ========================================================
// TAB 2: RELIABILITY TABLE SORTING & DOSSIER
// ========================================================
function setupTableSorting() {
  const headers = reliabilityTable.querySelectorAll('th.sortable');
  headers.forEach(th => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-sort');
      if (state.rankingSort.column === col) {
        state.rankingSort.direction = state.rankingSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.rankingSort.column = col;
        state.rankingSort.direction = col === 'brand' ? 'asc' : 'desc';
      }
      updateSortHeaderIcons();
      renderReliabilityRanking();
    });
  });
}

function updateSortHeaderIcons() {
  const headers = reliabilityTable.querySelectorAll('th.sortable');
  headers.forEach(th => {
    const col = th.getAttribute('data-sort');
    const icon = document.getElementById(`sortIcon-${col}`);
    if (state.rankingSort.column === col) {
      th.classList.add('active');
      if (icon) icon.textContent = state.rankingSort.direction === 'asc' ? '▲' : '▼';
    } else {
      th.classList.remove('active');
      if (icon) icon.textContent = '↕';
    }
  });
}

function renderReliabilityRanking() {
  if (!state.brandsList || state.brandsList.length === 0) return;

  const col = state.rankingSort.column;
  const dir = state.rankingSort.direction === 'asc' ? 1 : -1;

  // Grade score order map
  const gradeWeight = { 'A+': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };

  const sorted = [...state.brandsList].sort((a, b) => {
    const relA = a.reliability || { score: 0, grade: 'F', fireRecalls: 0, airbagRecalls: 0, brakeRecalls: 0 };
    const relB = b.reliability || { score: 0, grade: 'F', fireRecalls: 0, airbagRecalls: 0, brakeRecalls: 0 };

    if (col === 'brand') {
      return dir * a.brand.localeCompare(b.brand);
    } else if (col === 'score') {
      return dir * (relA.score - relB.score);
    } else if (col === 'grade') {
      return dir * ((gradeWeight[relA.grade] || 0) - (gradeWeight[relB.grade] || 0));
    } else if (col === 'total') {
      return dir * (a.count - b.count);
    } else if (col === 'fire') {
      return dir * (relA.fireRecalls - relB.fireRecalls);
    } else if (col === 'airbag') {
      return dir * (relA.airbagRecalls - relB.airbagRecalls);
    } else if (col === 'brakes') {
      return dir * (relA.brakeRecalls - relB.brakeRecalls);
    }
    return 0;
  });

  const tableRows = sorted.map(({ brand, count, reliability }) => {
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
          <button class="table-btn" onclick="consultBrandDossier('${escapeHtml(brand)}')">${t('btnViewFile')}</button>
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
  brandDossierView.scrollIntoView({ behavior: 'smooth' });
};

loadDossierBtn.addEventListener('click', () => {
  const selected = dossierBrandSelect.value;
  if (!selected) {
    showToast(state.lang === 'es' ? 'Selecciona una marca para consultar.' : 'Select a make to view.', 'warning');
    return;
  }
  loadBrandDossier(selected);
});

async function loadBrandDossier(brandName) {
  brandDossierView.style.display = 'block';
  brandDossierView.innerHTML = `
    <div style="text-align:center;padding:32px;">
      <div style="color:var(--orange-primary);font-size:1.3rem;font-weight:700;">
        ${state.lang === 'es' ? `Generando expediente de fiabilidad para ${brandName}...` : `Generating reliability dossier for ${brandName}...`}
      </div>
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
        <strong style="color:var(--orange-primary);">${m.count} ${state.lang === 'es' ? 'alertas' : 'alerts'}</strong>
      </li>
    `).join('');

    brandDossierView.innerHTML = `
      <div class="dossier-header-layout">
        <div>
          <span class="badge-pill orange">${state.lang === 'es' ? 'EXPEDIENTE OFICIAL DE FIABILIDAD' : 'OFFICIAL RELIABILITY DOSSIER'}</span>
          <h2 class="dossier-brand-title">${escapeHtml(data.brand)}</h2>
          <p style="color:var(--text-muted);font-size:0.9rem;">
            ${state.lang === 'es' ? `Análisis de seguridad derivado de ${data.totalRecalls} llamadas a revisión registradas en la Unión Europea.` : `Safety analysis derived from ${data.totalRecalls} official EU Safety Gate recall notices.`}
          </p>
        </div>
        <div class="dossier-score-badge">
          <div class="score-circle">${rel.grade}</div>
          <div class="score-text-area">
            <span class="score-val">${rel.score} / 100</span>
            <span class="score-rating">${state.lang === 'es' ? 'Índice de Fiabilidad Global' : 'Global Reliability Score'}</span>
          </div>
        </div>
      </div>

      <div class="dossier-kpis-grid">
        <div class="dossier-kpi">
          <div class="kpi-title">${state.lang === 'es' ? 'Total de Recalls' : 'Total Recalls'}</div>
          <div class="kpi-num">${data.totalRecalls}</div>
          <div class="kpi-desc">${state.lang === 'es' ? 'Campañas de revisión notificadas' : 'Registered recall campaigns'}</div>
        </div>
        <div class="dossier-kpi">
          <div class="kpi-title">${state.lang === 'es' ? 'Peligro de Incendio' : 'Fire Hazard'}</div>
          <div class="kpi-num" style="color:var(--red-danger);">${rel.fireRecalls}</div>
          <div class="kpi-desc">${Math.round((rel.fireRecalls/data.totalRecalls)*100)}% ${state.lang === 'es' ? 'del total de incidencias' : 'of all safety alerts'}</div>
        </div>
        <div class="dossier-kpi">
          <div class="kpi-title">Airbags / Takata</div>
          <div class="kpi-num" style="color:var(--amber-warning);">${rel.airbagRecalls}</div>
          <div class="kpi-desc">${state.lang === 'es' ? 'Campañas de infladores o sensores' : 'Inflator or sensor campaigns'}</div>
        </div>
        <div class="dossier-kpi">
          <div class="kpi-title">${state.lang === 'es' ? 'Frenos y Dirección' : 'Brakes & Steering'}</div>
          <div class="kpi-num" style="color:var(--orange-primary);">${rel.brakeRecalls}</div>
          <div class="kpi-desc">${state.lang === 'es' ? 'Fallo de frenado o guiado' : 'Critical guidance/braking defects'}</div>
        </div>
      </div>

      <div class="dossier-recs-box">
        <div class="recs-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>${state.lang === 'es' ? 'Diagnóstico y Consejos Técnicos de Inspección:' : 'Technical Diagnosis & Inspection Advice:'}</span>
        </div>
        <ul class="recs-list">
          ${data.recommendations.map(r => `<li>${escapeHtml(r).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
        </ul>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
        <div style="background:var(--bg-surface-elevated);padding:20px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
          <h4 style="font-size:0.92rem;font-weight:700;color:var(--text-primary);margin-bottom:12px;">
            ${state.lang === 'es' ? 'Modelos con Mayor Número de Alertas:' : 'Models with Most Recall Campaigns:'}
          </h4>
          <ul style="list-style:none;">
            ${topModelsList || `<li style="color:var(--text-muted);">${state.lang === 'es' ? 'Sin desglose de modelos específicos.' : 'No specific model breakdown.'}</li>`}
          </ul>
        </div>
        <div style="background:var(--bg-surface-elevated);padding:20px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
          <h4 style="font-size:0.92rem;font-weight:700;color:var(--text-primary);margin-bottom:12px;">
            ${state.lang === 'es' ? `Sistemas Más Vulnerables en ${escapeHtml(data.brand)}:` : `Most Vulnerable Systems in ${escapeHtml(data.brand)}:`}
          </h4>
          <ul style="list-style:none;">
            ${sortedComps.map(([c, cnt]) => `
              <li style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border-subtle);font-size:0.85rem;">
                <span>${escapeHtml(translateComponent(c))}</span>
                <strong style="color:var(--text-primary);">${cnt} ${state.lang === 'es' ? 'avisos' : 'recalls'}</strong>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <div style="margin-top:24px;text-align:right;">
        <button class="primary-btn" onclick="filterByBrandFromDossier('${escapeHtml(data.brand)}')">
          ${state.lang === 'es' ? `Ver las ${data.totalRecalls} llamadas de ${escapeHtml(data.brand)} en el Buscador` : `Search all ${data.totalRecalls} recalls for ${escapeHtml(data.brand)}`}
        </button>
      </div>
    `;

  } catch (err) {
    brandDossierView.innerHTML = `<p style="color:var(--red-danger);">${state.lang === 'es' ? 'Error al cargar el informe de fiabilidad.' : 'Error loading reliability dossier.'}</p>`;
  }
}

window.filterByBrandFromDossier = function(brandName) {
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
    showToast(state.lang === 'es' ? 'Selecciona al menos dos marcas para comparar.' : 'Select at least two makes to compare.', 'warning');
    return;
  }

  comparisonResults.style.display = 'block';
  comparisonResults.innerHTML = `
    <div style="text-align:center;padding:32px;">
      <div style="color:var(--orange-primary);font-size:1.3rem;font-weight:700;">
        ${state.lang === 'es' ? 'Calculando matriz comparativa de fiabilidad...' : 'Calculating head-to-head reliability matrix...'}
      </div>
    </div>
  `;

  try {
    const res = await fetch(`/api/compare?brands=${encodeURIComponent(brandsToCompare.join(','))}`);
    const data = await res.json();

    const sortedByScore = [...data].sort((a,b) => b.reliability.score - a.reliability.score);
    const winnerBrand = sortedByScore[0]?.brand;

    comparisonResults.innerHTML = `
      <div class="section-heading" style="margin-bottom:16px;">
        <span class="badge-pill orange">${t('compPill')}</span>
        <h2>${t('compVerdictTitle')}</h2>
        <p class="section-desc">${t('compVerdictDesc', { brand: `<strong>${winnerBrand}</strong>` })}</p>
      </div>

      <div class="comparison-grid">
        ${data.map(item => {
          const isWinner = item.brand === winnerBrand;
          return `
            <div class="comparison-card ${isWinner ? 'winner' : ''}">
              ${isWinner ? `<span class="winner-crown">${t('compWinnerBadge')}</span>` : ''}
              <h3 class="comp-brand-title">${escapeHtml(item.brand)}</h3>

              <div class="comp-metric-row">
                <span class="comp-metric-label">${t('thScore')}:</span>
                <span class="comp-metric-val" style="font-size:1.15rem;color:var(--orange-primary);">
                  ${item.reliability.score}/100 (${item.reliability.grade})
                </span>
              </div>

              <div class="comp-metric-row">
                <span class="comp-metric-label">${t('compMetricTotal')}</span>
                <span class="comp-metric-val">${item.totalRecalls} recalls</span>
              </div>

              <div class="comp-metric-row">
                <span class="comp-metric-label">${t('compMetricFire')}</span>
                <span class="comp-metric-val" style="color:${item.fireRate > 25 ? 'var(--red-danger)' : 'inherit'};">
                  ${item.reliability.fireRecalls} (${item.fireRate}%)
                </span>
              </div>

              <div class="comp-metric-row">
                <span class="comp-metric-label">${t('compMetricAirbag')}</span>
                <span class="comp-metric-val">${item.airbagRecalls}</span>
              </div>

              <div class="comp-metric-row">
                <span class="comp-metric-label">${t('compMetricBrakes')}</span>
                <span class="comp-metric-val">${item.brakeRecalls}</span>
              </div>

              <div class="comp-metric-row">
                <span class="comp-metric-label">${t('compMetricTopComp')}</span>
                <span class="comp-metric-val">${escapeHtml(translateComponent(item.topComponent[0]))}</span>
              </div>

              <div style="margin-top:20px;">
                <button class="table-btn" style="width:100%;padding:10px;" onclick="consultBrandDossier('${escapeHtml(item.brand)}')">
                  ${t('btnViewFile')}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

  } catch (err) {
    comparisonResults.innerHTML = `<p style="color:var(--red-danger);">${state.lang === 'es' ? 'Error al ejecutar la comparativa.' : 'Error running comparison.'}</p>`;
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
    showToast(state.lang === 'es' ? 'Por favor, selecciona al menos una marca.' : 'Please select a make.', 'warning');
    return;
  }

  advisorReportView.style.display = 'block';
  advisorReportView.innerHTML = `
    <div style="text-align:center;padding:32px;">
      <div style="color:var(--orange-primary);font-size:1.3rem;font-weight:700;">
        ${state.lang === 'es' ? `Consultando historial oficial de ${brand} ${model || ''}...` : `Querying safety recall history for ${brand} ${model || ''}...`}
      </div>
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

    let riskLevel = t('advRiskLow');
    let riskBadgeColor = 'var(--green-safe)';
    if (data.total > 15 || criticalFires.length > 3) {
      riskLevel = t('advRiskHigh');
      riskBadgeColor = 'var(--red-danger)';
    } else if (data.total > 5) {
      riskLevel = t('advRiskMod');
      riskBadgeColor = 'var(--amber-warning)';
    }

    const checklistEs = `
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
    `;

    const checklistEn = `
      <ul class="checklist-items">
        <li class="checklist-item">
          <span class="check-box-icon">✔</span>
          <span><strong>Official VIN Recall Certificate:</strong> Request a written certificate from an authorized dealer confirming that the VIN has zero outstanding or unresolved recall campaigns.</span>
        </li>
        ${criticalAirbags.length > 0 ? `
          <li class="checklist-item">
            <span class="check-box-icon">✔</span>
            <span><strong>Takata Airbag / Inflator Verification:</strong> This make has ${criticalAirbags.length} critical airbag alerts. Verify that inflators were replaced free of charge at a dealership.</span>
          </li>
        ` : ''}
        ${criticalFires.length > 0 ? `
          <li class="checklist-item">
            <span class="check-box-icon">✔</span>
            <span><strong>Fuel Line & Fire Prevention:</strong> There are recorded fuel leak or wiring short-circuit notices. Check that engine bay recalls were performed.</span>
          </li>
        ` : ''}
        ${criticalBrakes.length > 0 ? `
          <li class="checklist-item">
            <span class="check-box-icon">✔</span>
            <span><strong>Brake Booster & ABS Module:</strong> Brake-related notices exist. Ask for brake diagnostic confirmation and brake fluid line inspection.</span>
          </li>
        ` : ''}
        <li class="checklist-item">
          <span class="check-box-icon">✔</span>
          <span><strong>Free Repairs Guaranteed by EU Law:</strong> Remember that any official Safety Gate recall campaign must be repaired by the manufacturer free of charge, regardless of vehicle age or owner transfer.</span>
        </li>
      </ul>
    `;

    advisorReportView.innerHTML = `
      <div class="report-header">
        <div class="report-title-area">
          <span class="badge-pill orange">${t('advPill')}</span>
          <h3>${state.lang === 'es' ? 'Historial de Alertas:' : 'Safety Alerts History:'} ${escapeHtml(brand)} ${escapeHtml(model || '')} ${year ? `(${year})` : ''}</h3>
          <p>${state.lang === 'es' ? `Se han identificado <strong>${data.total}</strong> campañas que afectan a modelos relacionados.` : `Identified <strong>${data.total}</strong> campaigns related to this vehicle family.`}</p>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.75rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;">${t('advRiskTitle')}</div>
          <div style="font-family:var(--font-display);font-size:1.4rem;font-weight:800;color:${riskBadgeColor};">${riskLevel}</div>
        </div>
      </div>

      <div class="checklist-card">
        <h4>${state.lang === 'es' ? '📋 Checklist de Preguntas Obligatorias para el Vendedor o Concesionario:' : '📋 Mandatory Inspection Checklist for Dealer / Seller:'}</h4>
        ${state.lang === 'es' ? checklistEs : checklistEn}
      </div>

      <h4 style="font-size:1.1rem;font-weight:700;margin-bottom:12px;color:var(--text-primary);">
        ${state.lang === 'es' ? 'Principales Campañas Detectadas para este Criterio:' : 'Major Recalls Found for this Search:'}
      </h4>
      <div class="recalls-grid">
        ${data.recalls.slice(0, 6).map(r => `
          <div class="recall-card risk-${r.riskType.toLowerCase().includes('fire') ? 'fire' : 'injuries'}" onclick="openRecallModal(${r.order})">
            <div class="card-top">
              <span class="card-brand-badge">${escapeHtml(r.brand)}</span>
              <span class="badge-risk ${r.riskType.toLowerCase().includes('fire') ? 'fire' : 'injuries'}">
                ${escapeHtml(translateRiskType(r.riskType))}
              </span>
            </div>
            <h4 class="card-model-title" style="font-size:1rem;">${escapeHtml(r.model || r.product)}</h4>
            <p class="card-danger-snippet" style="-webkit-line-clamp:2;">${escapeHtml(r.danger)}</p>
            <div class="card-footer">
              <span class="card-case-number">${escapeHtml(r.caseNumber)} (${r.year})</span>
              <span class="card-action-link">${t('viewDossierLink')} →</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

  } catch (err) {
    advisorReportView.innerHTML = `<p style="color:var(--red-danger);">${state.lang === 'es' ? 'Error al generar el informe pre-compra.' : 'Error generating pre-purchase report.'}</p>`;
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
          label: state.lang === 'es' ? 'Campañas Publicadas' : 'Published Recalls',
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
          label: state.lang === 'es' ? 'Número de Recalls' : 'Total Recalls',
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
    const riskLabels = sortedRisks.map(r => translateRiskType(r[0]));
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
        labels: sortedComps.map(c => translateComponent(c[0])),
        datasets: [{
          label: state.lang === 'es' ? 'Alertas por Componente' : 'Alerts per System',
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
  reloadXmlBtn.innerHTML = `<span>${state.lang === 'es' ? 'Recargando base de datos...' : 'Reloading database...'}</span>`;

  try {
    const res = await fetch('/api/reload-xml', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast(state.lang === 'es' ? `Base de datos XML recargada (${data.records.toLocaleString()} registros en ${data.parseTimeMs}ms)` : `XML database reloaded (${data.records.toLocaleString()} records in ${data.parseTimeMs}ms)`);
      await initApp();
    } else {
      showToast(`Error: ${data.error}`, 'error');
    }
  } catch (err) {
    showToast(state.lang === 'es' ? 'Error de comunicación con el servidor.' : 'Server communication error.', 'error');
  } finally {
    reloadXmlBtn.disabled = false;
    reloadXmlBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
      <span>${t('dbReloadBtnText')}</span>
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
    showToast(state.lang === 'es' ? 'Por favor, selecciona un archivo con extensión .xml' : 'Please drop a valid .xml file', 'warning');
  }
});

xmlFileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleUploadedXml(e.target.files[0]);
  }
});

function handleUploadedXml(file) {
  showToast(state.lang === 'es' ? `Analizando archivo XML: ${file.name}...` : `Parsing XML file: ${file.name}...`);
  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const xmlText = event.target.result;
      const count = (xmlText.match(/<notifications/g) || []).length;
      showToast(state.lang === 'es' ? `Archivo XML validado con éxito (${count} notificaciones).` : `XML file validated (${count} notifications).`);
    } catch (err) {
      showToast(state.lang === 'es' ? 'No se pudo procesar el archivo XML.' : 'Failed to process XML file.', 'error');
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
