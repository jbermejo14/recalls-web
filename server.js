const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3050;
const XML_FILE_PATH = path.join(__dirname, 'data', 'search_list_notifications.xml');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.text({ type: 'application/xml', limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory database
let db = {
  notifications: [],
  brands: {},
  stats: {},
  modelsByBrand: {},
  lastLoaded: null,
  filePath: XML_FILE_PATH,
  fileSizeMB: 0
};

function cleanText(t) {
  if (!t) return '';
  return t.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

function extractTag(block, tag) {
  const startTag = '<' + tag;
  const startIdx = block.indexOf(startTag);
  if (startIdx === -1) return '';
  const closeTagIdx = block.indexOf('>', startIdx);
  if (closeTagIdx === -1) return '';
  const endTag = '</' + tag + '>';
  const endIdx = block.indexOf(endTag, closeTagIdx);
  if (endIdx === -1) return '';
  let content = block.substring(closeTagIdx + 1, endIdx).trim();
  if (content.startsWith('<![CDATA[') && content.endsWith(']]>')) {
    content = content.substring(9, content.length - 3).trim();
  }
  return content;
}

function normalizeBrand(raw) {
  if (!raw) return 'Sin Marca';
  let b = raw.trim();
  const lower = b.toLowerCase();
  if (lower === 'mercedes' || lower.startsWith('mercedes-benz') || lower.startsWith('mercedes benz')) return 'Mercedes-Benz';
  if (lower === 'bmw') return 'BMW';
  if (lower === 'vw' || lower.startsWith('volkswagen')) return 'Volkswagen';
  if (lower === 'citroen' || lower === 'citroën') return 'Citroën';
  if (lower === 'peugeot') return 'Peugeot';
  if (lower === 'renault') return 'Renault';
  if (lower === 'ford') return 'Ford';
  if (lower === 'opel') return 'Opel';
  if (lower === 'audi') return 'Audi';
  if (lower === 'toyota') return 'Toyota';
  if (lower === 'nissan') return 'Nissan';
  if (lower === 'fiat') return 'Fiat';
  if (lower === 'volvo') return 'Volvo';
  if (lower === 'seat') return 'SEAT';
  if (lower === 'skoda' || lower === 'škoda') return 'Škoda';
  if (lower === 'hyundai') return 'Hyundai';
  if (lower === 'kia') return 'Kia';
  if (lower === 'mitsubishi') return 'Mitsubishi';
  if (lower === 'honda') return 'Honda';
  if (lower === 'suzuki') return 'Suzuki';
  if (lower === 'porsche') return 'Porsche';
  if (lower === 'mazda') return 'Mazda';
  if (lower === 'land rover' || lower.startsWith('land rover')) return 'Land Rover';
  if (lower === 'jeep') return 'Jeep';
  if (lower === 'alfa romeo') return 'Alfa Romeo';
  if (lower === 'tesla') return 'Tesla';
  if (lower === 'subaru') return 'Subaru';
  if (lower === 'ds' || lower.startsWith('ds auto')) return 'DS Automobiles';
  if (lower === 'dacia') return 'Dacia';
  if (lower === 'jaguar') return 'Jaguar';
  if (lower === 'cupra') return 'CUPRA';
  if (lower === 'ducati') return 'Ducati';
  if (lower === 'yamaha') return 'Yamaha';
  if (lower === 'kawasaki') return 'Kawasaki';
  if (lower === 'ktm') return 'KTM';
  if (lower === 'iveco') return 'Iveco';
  if (lower === 'man') return 'MAN';
  if (lower === 'scania') return 'Scania';
  if (lower === 'dodge' || lower === 'ram') return 'Dodge / RAM';
  if (lower === 'chevrolet') return 'Chevrolet';
  if (lower === 'chrysler') return 'Chrysler';
  if (lower === 'ferrari') return 'Ferrari';
  if (lower === 'lamborghini') return 'Lamborghini';
  if (lower === 'maserati') return 'Maserati';
  if (lower === 'bentley') return 'Bentley';
  if (lower === 'aston martin') return 'Aston Martin';
  return b.charAt(0).toUpperCase() + b.slice(1);
}

function detectComponents(text) {
  const t = text.toLowerCase();
  const res = [];
  if (t.includes('airbag') || t.includes('inflat') || t.includes('takata') || t.includes('cushion')) res.push('Airbag');
  if (t.includes('brake') || t.includes('freno') || t.includes('abs') || t.includes('esp') || t.includes('caliper') || t.includes('booster')) res.push('Frenos / ABS');
  if (t.includes('fire') || t.includes('fuego') || t.includes('incendio') || t.includes('fuel leak') || t.includes('combustible') || t.includes('diesel leak') || t.includes('petrol leak') || t.includes('exhaust')) res.push('Fuego / Combustible');
  if (t.includes('battery') || t.includes('batería') || t.includes('bateria') || t.includes('high voltage') || t.includes('alto voltaje') || t.includes('short circuit') || t.includes('cortocircuito') || t.includes('ev ') || t.includes('hybrid') || t.includes('inverter') || t.includes('charger')) res.push('Batería / EV');
  if (t.includes('steer') || t.includes('direcci') || t.includes('tie rod') || t.includes('steering column') || t.includes('rack')) res.push('Dirección');
  if (t.includes('suspens') || t.includes('amortigu') || t.includes('spring') || t.includes('axle') || t.includes('chassis') || t.includes('chasis') || t.includes('ball joint') || t.includes('control arm')) res.push('Suspensión / Ejes');
  if (t.includes('seat') || t.includes('belt') || t.includes('cintur') || t.includes('asiento') || t.includes('isofix') || t.includes('buckle')) res.push('Cinturones / Asientos');
  if (t.includes('software') || t.includes('program') || t.includes('ecu') || t.includes('sensor') || t.includes('camera') || t.includes('cámara') || t.includes('display') || t.includes('radar') || t.includes('adas') || t.includes('firmware')) res.push('Software / Sensores');
  if (t.includes('engine') || t.includes('motor') || t.includes('transmission') || t.includes('gearbox') || t.includes('embrague') || t.includes('clutch') || t.includes('turbo') || t.includes('oil')) res.push('Motor / Transmisión');
  if (t.includes('tyre') || t.includes('tire') || t.includes('neumát') || t.includes('wheel') || t.includes('rueda') || t.includes('llanta') || t.includes('rim')) res.push('Neumáticos / Ruedas');
  if (res.length === 0) res.push('Otros Componentes');
  return res;
}

function cleanModelName(product, name, type_numberOfModel) {
  let m = (name || '').trim();
  if (m) return m;

  let prod = (product || '').trim();
  const isGeneric = /^(Passenger car|Van|Commercial vehicle|Light commercial vehicle|Bus|Motorcycle|Scooter|Estate car|Saloon|Off-road vehicle|Lorry|Truck|Car|Vehicles|Vehicle|Automobile|Heavy goods vehicle)s?$/i.test(prod);
  
  if (!isGeneric && prod) {
    const stripped = prod.replace(/^(Passenger car|Van|Commercial vehicle|Light commercial vehicle|Bus|Motorcycle|Scooter|Estate car|Saloon|Off-road vehicle|Lorry|Truck)\s*[-–/:]*\s*/i, '').trim();
    if (stripped && stripped.length > 1) return stripped;
  }

  // Look into type_numberOfModel
  if (type_numberOfModel) {
    let raw = type_numberOfModel.split(/\r?\n/)[0].trim();
    raw = raw.replace(/EC type[- ]approval.*$/i, '')
             .replace(/e\d+\*.*$/i, '')
             .replace(/,\s*e\d+.*$/i, '')
             .replace(/chassis numbers?.*$/i, '')
             .replace(/types?:/i, '')
             .trim();
    if (raw.endsWith(',')) raw = raw.slice(0, -1).trim();
    if (raw.length > 1 && raw.length < 60) return raw;
  }

  return prod || 'Vehículo General';
}

function loadAndParseXML(filePath = XML_FILE_PATH) {
  console.log('Loading XML Database from:', filePath);
  const startTimer = Date.now();
  
  if (!fs.existsSync(filePath)) {
    throw new Error('XML file not found at: ' + filePath);
  }

  const stat = fs.statSync(filePath);
  const xml = fs.readFileSync(filePath, 'utf8');

  const notifications = [];
  const brandCounts = {};
  const riskCounts = {};
  const yearCounts = {};
  const componentCounts = {};
  const modelsByBrand = {};
  const countryCounts = {};

  let idx = 0;
  while (true) {
    const start = xml.indexOf('<notifications', idx);
    if (start === -1) break;
    const end = xml.indexOf('</notifications>', start);
    if (end === -1) break;
    const block = xml.substring(start, end + 16);
    idx = end + 16;

    const rawBrand = extractTag(block, 'brand');
    const brand = normalizeBrand(rawBrand);
    const product = extractTag(block, 'product');
    const name = extractTag(block, 'name');
    const type_numberOfModel = extractTag(block, 'type_numberOfModel');
    const model = cleanModelName(product, name, type_numberOfModel);
    const riskType = extractTag(block, 'riskType') || 'Injuries';
    const danger = extractTag(block, 'danger');
    const measures = extractTag(block, 'measures');
    const reference = extractTag(block, 'reference');
    const publicationDate = extractTag(block, 'publicationDate');
    const caseNumber = extractTag(block, 'caseNumber');
    const companyRecallCode = extractTag(block, 'companyRecallCode');
    const productionDates = extractTag(block, 'productionDates');
    const notifyingCountry = extractTag(block, 'notifyingCountry') || 'Desconocido';
    const countryOfOrigin = extractTag(block, 'countryOfOrigin') || 'Desconocido';
    const level = extractTag(block, 'level') || 'Serious risk';
    const description = extractTag(block, 'description');

    const fullSearchText = [brand, model, product, name, type_numberOfModel, danger, riskType, companyRecallCode, caseNumber, description].join(' ');
    const components = detectComponents(fullSearchText);

    const dateParts = publicationDate.split('-');
    const year = dateParts.length === 3 ? parseInt(dateParts[2], 10) : 0;

    const item = {
      order: notifications.length + 1,
      caseNumber: caseNumber || `REF-${notifications.length + 1}`,
      publicationDate,
      year,
      reference,
      brand,
      rawBrand,
      product,
      name,
      model,
      type_numberOfModel,
      riskType,
      danger,
      measures,
      description,
      notifyingCountry,
      countryOfOrigin,
      level,
      companyRecallCode,
      productionDates,
      components,
      searchIndex: fullSearchText.toLowerCase()
    };

    notifications.push(item);

    // Aggregates
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    riskCounts[riskType] = (riskCounts[riskType] || 0) + 1;
    if (year > 1990 && year < 2050) {
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    }
    countryCounts[notifyingCountry] = (countryCounts[notifyingCountry] || 0) + 1;

    components.forEach(c => {
      componentCounts[c] = (componentCounts[c] || 0) + 1;
    });

    if (!modelsByBrand[brand]) {
      modelsByBrand[brand] = {};
    }
    modelsByBrand[brand][model] = (modelsByBrand[brand][model] || 0) + 1;
  }

  // Calculate brand reliability score
  // Scale 0 to 100: Base 95, penalize by serious risk, fires, and volume
  const brandReliability = {};
  for (const [b, totalRecalls] of Object.entries(brandCounts)) {
    const brandItems = notifications.filter(n => n.brand === b);
    const fireRecalls = brandItems.filter(n => n.riskType.toLowerCase().includes('fire') || n.components.includes('Fuego / Combustible')).length;
    const airbagRecalls = brandItems.filter(n => n.components.includes('Airbag')).length;
    const brakeRecalls = brandItems.filter(n => n.components.includes('Frenos / ABS')).length;
    const recentRecalls = brandItems.filter(n => n.year >= 2020).length;

    // Severity calculation
    // More recalls -> lower score, but scaled logarithmically so large manufacturers aren't unfairly rated 0
    let penalty = 0;
    penalty += Math.min(35, Math.log10(totalRecalls + 1) * 12);
    penalty += Math.min(25, (fireRecalls / (totalRecalls || 1)) * 30);
    penalty += Math.min(20, (brakeRecalls / (totalRecalls || 1)) * 25);
    penalty += Math.min(15, (recentRecalls / (totalRecalls || 1)) * 15);

    let score = Math.max(30, Math.min(98, Math.round(100 - penalty)));
    let grade = 'A+';
    if (score < 50) grade = 'F';
    else if (score < 65) grade = 'D';
    else if (score < 75) grade = 'C';
    else if (score < 85) grade = 'B';
    else if (score < 92) grade = 'A';

    brandReliability[b] = {
      score,
      grade,
      totalRecalls,
      fireRecalls,
      airbagRecalls,
      brakeRecalls,
      recentRecalls,
      topModels: Object.entries(modelsByBrand[b] || {})
        .sort((a,b) => b[1] - a[1])
        .slice(0, 10)
        .map(([mName, count]) => ({ model: mName, count }))
    };
  }

  db = {
    notifications,
    brands: brandCounts,
    brandReliability,
    modelsByBrand,
    stats: {
      totalRecalls: notifications.length,
      uniqueBrands: Object.keys(brandCounts).length,
      riskTypes: riskCounts,
      years: yearCounts,
      components: componentCounts,
      countries: countryCounts,
      parseTimeMs: Date.now() - startTimer
    },
    lastLoaded: new Date().toISOString(),
    filePath,
    fileSizeMB: (stat.size / (1024 * 1024)).toFixed(2)
  };

  console.log(`Parsed ${notifications.length} recalls in ${db.stats.parseTimeMs}ms. Size: ${db.fileSizeMB} MB`);
}

// Initial load
try {
  loadAndParseXML();
} catch (err) {
  console.error('Error during initial XML load:', err);
}

// ================= API ENDPOINTS ================= //

// Status & DB info
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    filePath: db.filePath,
    fileSizeMB: db.fileSizeMB,
    totalRecords: db.notifications.length,
    lastLoaded: db.lastLoaded,
    parseTimeMs: db.stats.parseTimeMs
  });
});

// Overall Stats for charts & KPIs
app.get('/api/stats', (req, res) => {
  // Sort top 15 brands
  const sortedBrands = Object.entries(db.brands)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([brand, count]) => ({
      brand,
      count,
      score: db.brandReliability[brand]?.score || 75,
      grade: db.brandReliability[brand]?.grade || 'B'
    }));

  res.json({
    totalRecalls: db.stats.totalRecalls,
    uniqueBrands: db.stats.uniqueBrands,
    topBrands: sortedBrands,
    riskTypes: db.stats.riskTypes,
    years: db.stats.years,
    components: db.stats.components,
    countries: db.stats.countries
  });
});

// Brands & Models
app.get('/api/brands', (req, res) => {
  const list = Object.entries(db.brands)
    .sort((a, b) => b[1] - a[1])
    .map(([brand, count]) => ({
      brand,
      count,
      reliability: db.brandReliability[brand]
    }));
  res.json(list);
});

// Models for a specific brand
app.get('/api/models', (req, res) => {
  const brand = req.query.brand;
  if (!brand || !db.modelsByBrand[brand]) {
    return res.json([]);
  }
  const models = Object.entries(db.modelsByBrand[brand])
    .sort((a, b) => b[1] - a[1])
    .map(([model, count]) => ({ model, count }));
  res.json(models);
});

// Search & Filter recalls
app.get('/api/recalls', (req, res) => {
  let {
    q,
    brand,
    model,
    risk,
    component,
    yearFrom,
    yearTo,
    level,
    country,
    sortBy = 'date_desc',
    page = 1,
    limit = 20
  } = req.query;

  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  let results = db.notifications;

  if (q) {
    const qLower = q.toLowerCase().trim();
    const queryTokens = qLower.split(/\s+/).filter(t => t.length > 0);
    results = results.filter(item => {
      return queryTokens.every(token => item.searchIndex.includes(token));
    });
  }

  if (brand && brand !== 'all') {
    results = results.filter(item => item.brand.toLowerCase() === brand.toLowerCase());
  }

  if (model && model !== 'all') {
    const mLower = model.toLowerCase();
    results = results.filter(item => item.model.toLowerCase().includes(mLower) || item.product.toLowerCase().includes(mLower));
  }

  if (risk && risk !== 'all') {
    const rLower = risk.toLowerCase();
    results = results.filter(item => item.riskType.toLowerCase().includes(rLower));
  }

  if (component && component !== 'all') {
    results = results.filter(item => item.components.includes(component));
  }

  if (level && level !== 'all') {
    results = results.filter(item => item.level.toLowerCase() === level.toLowerCase());
  }

  if (country && country !== 'all') {
    results = results.filter(item => item.notifyingCountry.toLowerCase() === country.toLowerCase());
  }

  if (yearFrom) {
    const yFrom = parseInt(yearFrom, 10);
    results = results.filter(item => item.year >= yFrom);
  }

  if (yearTo) {
    const yTo = parseInt(yearTo, 10);
    results = results.filter(item => item.year <= yTo);
  }

  // Sorting
  results = [...results].sort((a, b) => {
    if (sortBy === 'date_asc') return (a.year - b.year) || a.order - b.order;
    if (sortBy === 'brand_asc') return a.brand.localeCompare(b.brand);
    if (sortBy === 'severity') {
      const isFireA = a.riskType.toLowerCase().includes('fire') ? 2 : 1;
      const isFireB = b.riskType.toLowerCase().includes('fire') ? 2 : 1;
      return isFireB - isFireA || (b.year - a.year);
    }
    // Default: date_desc
    return (b.year - a.year) || (b.order - a.order);
  });

  const total = results.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = results.slice(offset, offset + limit);

  res.json({
    total,
    page,
    limit,
    totalPages,
    recalls: paginated
  });
});

// Single recall detail
app.get('/api/recalls/:order', (req, res) => {
  const order = parseInt(req.params.order, 10);
  const found = db.notifications.find(n => n.order === order || n.caseNumber === req.params.order);
  if (!found) {
    return res.status(404).json({ error: 'Recall not found' });
  }
  res.json(found);
});

// Brand Reliability Dossier
app.get('/api/reliability/:brand', (req, res) => {
  const brandName = req.params.brand;
  const brandKey = Object.keys(db.brandReliability).find(
    k => k.toLowerCase() === brandName.toLowerCase()
  );

  if (!brandKey) {
    return res.status(404).json({ error: 'Brand not found' });
  }

  const reliability = db.brandReliability[brandKey];
  const recalls = db.notifications.filter(n => n.brand === brandKey);

  // Failure components distribution for this brand
  const compDist = {};
  recalls.forEach(r => {
    r.components.forEach(c => {
      compDist[c] = (compDist[c] || 0) + 1;
    });
  });

  // Risk types distribution
  const riskDist = {};
  recalls.forEach(r => {
    riskDist[r.riskType] = (riskDist[r.riskType] || 0) + 1;
  });

  // Year breakdown
  const yearDist = {};
  recalls.forEach(r => {
    if (r.year) yearDist[r.year] = (yearDist[r.year] || 0) + 1;
  });

  // Recent 5 major recalls
  const recentCritical = recalls
    .filter(r => r.riskType.toLowerCase().includes('fire') || r.level === 'Serious risk')
    .slice(0, 5);

  res.json({
    brand: brandKey,
    reliability,
    totalRecalls: recalls.length,
    componentDistribution: compDist,
    riskDistribution: riskDist,
    yearDistribution: yearDist,
    recentCritical,
    recommendations: generateRecommendations(brandKey, reliability, compDist)
  });
});

function generateRecommendations(brand, reliability, compDist) {
  const recs = [];
  if (reliability.score >= 85) {
    recs.push(`La marca ${brand} cuenta con un historial de fiabilidad excelente en la base de datos oficial.`);
  } else if (reliability.score >= 70) {
    recs.push(`Fiabilidad media-alta. Se aconseja verificar en concesionario que todas las campañas han sido aplicadas.`);
  } else {
    recs.push(`¡Atención pre-compra! Presenta un volumen considerable de llamadas a revisión por fallos de seguridad graves.`);
  }

  // Top component alert
  const sortedComps = Object.entries(compDist).sort((a,b) => b[1] - a[1]);
  if (sortedComps.length > 0 && sortedComps[0][0] !== 'Otros Componentes') {
    recs.push(`Componente con mayor incidencia: **${sortedComps[0][0]}** (${sortedComps[0][1]} campañas). Presta especial atención a este sistema.`);
  }

  if (reliability.fireRecalls > 10) {
    recs.push(`Se han registrado ${reliability.fireRecalls} alertas con riesgo de incendio (fugas de combustible, cortocircuitos o sobrecalentamiento). Solicita siempre comprobante de taller oficial.`);
  }

  if (reliability.airbagRecalls > 5) {
    recs.push(`Cuenta con campañas activas de Airbag (como infladores Takata). Es mandatorio confirmar el reemplazo gratuito.`);
  }

  return recs;
}

// Compare 2 or 3 brands/models
app.get('/api/compare', (req, res) => {
  const queryBrands = (req.query.brands || '').split(',').map(s => s.trim()).filter(Boolean);
  if (queryBrands.length === 0) {
    return res.status(400).json({ error: 'Debe especificar al menos una marca para comparar.' });
  }

  const comparison = queryBrands.map(bName => {
    const brandKey = Object.keys(db.brandReliability).find(
      k => k.toLowerCase() === bName.toLowerCase()
    );
    if (!brandKey) return null;

    const brandItems = db.notifications.filter(n => n.brand === brandKey);
    const rel = db.brandReliability[brandKey];

    const compCounts = {};
    brandItems.forEach(n => {
      n.components.forEach(c => compCounts[c] = (compCounts[c] || 0) + 1);
    });

    return {
      brand: brandKey,
      reliability: rel,
      totalRecalls: brandItems.length,
      fireRate: Math.round((rel.fireRecalls / (brandItems.length || 1)) * 100),
      airbagRecalls: rel.airbagRecalls,
      brakeRecalls: rel.brakeRecalls,
      topComponent: Object.entries(compCounts).sort((a,b)=>b[1]-a[1])[0] || ['N/A', 0]
    };
  }).filter(Boolean);

  res.json(comparison);
});

// Reload XML from disk
app.post('/api/reload-xml', (req, res) => {
  try {
    loadAndParseXML();
    res.json({
      success: true,
      message: 'Base de datos XML recargada correctamente.',
      records: db.notifications.length,
      parseTimeMs: db.stats.parseTimeMs
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` RECALLSCOPE - Consultor de Campañas & Fiabilidad Activo`);
  console.log(` Servidor disponible en: http://localhost:${PORT}`);
  console.log(` Base de datos XML: ${XML_FILE_PATH}`);
  console.log(`=======================================================`);
});
