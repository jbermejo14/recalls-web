import type { Locale } from './site';

const LABELS_RISK_SEPARATOR = ',';
const LABELS_JOINER = ', ';
const LABELS_JOINER_Y = ' y ';
const LABELS_JOINER_E = ' e ';
const LABELS_JOINER_EN = ' & ';
// Ante una palabra que empieza por "i" la conjunción española es "e".
const LABELS_STARTS_WITH_I = /^i/i;

/** Componentes de riesgo de Safety Gate (vocabulario cerrado) y su traducción al español. */
const LABELS_RISK_COMPONENTS: Record<string, string> = {
  injuries: 'Lesiones',
  fire: 'Incendio',
  environment: 'Medio ambiente',
  burns: 'Quemaduras',
  chemical: 'Químico',
  'electric shock': 'Descarga eléctrica',
  security: 'Seguridad',
  cuts: 'Cortes',
  asphyxiation: 'Asfixia',
  'damage to hearing': 'Daños auditivos',
  'health risk / other': 'Riesgo para la salud u otro',
  entrapment: 'Atrapamiento',
  suffocation: 'Sofocación',
  'not type approved and therefore not legal': 'Sin homologación (no legal)'
};

/** Países y territorios de los datos de Safety Gate cuyo nombre español difiere del inglés. */
const LABELS_COUNTRIES: Record<string, string> = {
  Algeria: 'Argelia',
  Belgium: 'Bélgica',
  Brazil: 'Brasil',
  Canada: 'Canadá',
  Cyprus: 'Chipre',
  Czechia: 'Chequia',
  Denmark: 'Dinamarca',
  Finland: 'Finlandia',
  France: 'Francia',
  Germany: 'Alemania',
  Greece: 'Grecia',
  Hungary: 'Hungría',
  Ireland: 'Irlanda',
  Italy: 'Italia',
  Japan: 'Japón',
  Lithuania: 'Lituania',
  Luxembourg: 'Luxemburgo',
  Malaysia: 'Malasia',
  Mexico: 'México',
  Morocco: 'Marruecos',
  Norway: 'Noruega',
  Philippines: 'Filipinas',
  Poland: 'Polonia',
  Romania: 'Rumanía',
  Slovakia: 'Eslovaquia',
  Slovenia: 'Eslovenia',
  'South Africa': 'Sudáfrica',
  Spain: 'España',
  Sweden: 'Suecia',
  Switzerland: 'Suiza',
  Taiwan: 'Taiwán',
  Thailand: 'Tailandia',
  'The Netherlands': 'Países Bajos',
  Tunisia: 'Túnez',
  Türkiye: 'Turquía',
  'United Kingdom': 'Reino Unido',
  'United Kingdom in respect of Northern Ireland': 'Reino Unido (Irlanda del Norte)',
  'United States': 'Estados Unidos',
  Unknown: 'Desconocido',
  'Republic of Korea': 'Corea del Sur',
  "People's Republic of China": 'China'
};

/** Resto de texto que puede seguir al tipo de vehículo: fin, separador, o referencia (con dígito o en mayúsculas). */
const LABELS_PRODUCT_BOUNDARY = /^(?:$|\s*[-–—:,(/.'"“‘]|\s+\S*\d|\s+\p{Lu}{2,}\b)/u;
const LABELS_PLURAL_ENDING = /s(?:\s*\(ATV\))?$/i;

interface LabelsProductRule {
  /** Patrón del tipo de vehículo, anclado al inicio y sin distinguir mayúsculas. */
  pattern: RegExp;
  singular: string;
  plural: string;
}

function labelsProductRule(source: string, singular: string, plural: string = singular): LabelsProductRule {
  return { pattern: new RegExp(`^(?:${source})`, 'iu'), singular, plural };
}

// El orden importa: los patrones más largos van antes que los que son prefijo suyo.
const LABELS_PRODUCT_RULES: readonly LabelsProductRule[] = [
  labelsProductRule('passenger cars?\\s*/\\s*van', 'Turismo o furgoneta'),
  labelsProductRule('passenger cars?', 'Turismo', 'Turismos'),
  labelsProductRule('passenger van', 'Furgoneta de pasajeros'),
  labelsProductRule('camper van', 'Camper'),
  labelsProductRule('van', 'Furgoneta'),
  labelsProductRule('motorcycles?', 'Motocicleta', 'Motocicletas'),
  labelsProductRule('lorry|truck', 'Camión'),
  labelsProductRule('bus', 'Autobús'),
  labelsProductRule('pick-?up truck', 'Pick-up'),
  labelsProductRule('light commercial vehicles?', 'Vehículo comercial ligero', 'Vehículos comerciales ligeros'),
  labelsProductRule('trailer', 'Remolque'),
  labelsProductRule('all[- ]terrain vehicles?(?:\\s*\\(ATV\\))?', 'Vehículo todoterreno (ATV)', 'Vehículos todoterreno (ATV)'),
  labelsProductRule('vehicle (?:part|component)', 'Componente de vehículo'),
  labelsProductRule('motorhome', 'Autocaravana'),
  labelsProductRule('scooter', 'Scooter')
];

function labelsIsPlural(rule: LabelsProductRule, matched: string): boolean {
  return rule.plural !== rule.singular && LABELS_PLURAL_ENDING.test(matched);
}

function labelsLowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function labelsRiskComponent(component: string): string | null {
  return LABELS_RISK_COMPONENTS[component.toLowerCase()] ?? null;
}

function labelsJoinList(items: string[], lang: Locale): string {
  if (items.length < 2) return items.join('');
  const last = items[items.length - 1];
  const lastJoiner = lang === 'en' ? LABELS_JOINER_EN : LABELS_STARTS_WITH_I.test(last) ? LABELS_JOINER_E : LABELS_JOINER_Y;
  return `${items.slice(0, -1).join(LABELS_JOINER)}${lastJoiner}${last}`;
}

/**
 * Traduce un tipo de riesgo de Safety Gate (lista separada por comas) al idioma indicado.
 * En español une los componentes con ", " y " y " (" e " ante una palabra que empieza por "i")
 * y deja solo la primera letra en mayúscula; un componente desconocido se conserva tal cual.
 * En inglés conserva los componentes y los une con ", " y " & " antes del último ("Burns, Fire & Injuries").
 */
export function riskLabel(risk: string, lang: Locale): string {
  const trimmed = (risk || '').trim();
  if (trimmed === '') return trimmed;
  const components = trimmed
    .split(LABELS_RISK_SEPARATOR)
    .map(part => part.trim())
    .filter(Boolean);
  if (lang === 'en') return labelsJoinList(components, lang);
  return labelsJoinList(components.map(labelsTranslateRiskComponent), lang);
}

function labelsTranslateRiskComponent(component: string, index: number): string {
  const translated = labelsRiskComponent(component);
  if (translated === null) return component;
  return index === 0 ? translated : labelsLowerFirst(translated);
}

/**
 * Nombre de un país (notificador u origen) en el idioma indicado.
 * Un país sin traducción se devuelve tal cual; en inglés, solo recortado.
 */
export function countryLabel(country: string, lang: Locale): string {
  const trimmed = (country || '').trim();
  if (lang === 'en') return trimmed;
  return LABELS_COUNTRIES[trimmed] ?? trimmed;
}

/**
 * Traduce solo el tipo de vehículo con el que empieza el texto de producto
 * (sin distinguir mayúsculas y aceptando plural); el resto del texto se conserva.
 * Solo traduce si tras el tipo hay fin de texto, un separador o una referencia (con dígito o en
 * mayúsculas): "Motorcycle helmet" o "Truck tyre" no son vehículos y quedan igual.
 * En inglés devuelve el valor recortado.
 */
export function productLabel(product: string, lang: Locale): string {
  const trimmed = (product || '').trim();
  if (lang === 'en') return trimmed;
  for (const rule of LABELS_PRODUCT_RULES) {
    const match = rule.pattern.exec(trimmed);
    if (!match) continue;
    const rest = trimmed.slice(match[0].length);
    if (!LABELS_PRODUCT_BOUNDARY.test(rest)) continue;
    return `${labelsIsPlural(rule, match[0]) ? rule.plural : rule.singular}${rest}`;
  }
  return trimmed;
}
