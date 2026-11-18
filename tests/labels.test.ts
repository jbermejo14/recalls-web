import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { riskLabel, countryLabel, productLabel } from '../src/lib/labels';
import data from '../src/data/safety-gate-data.json';

const recalls = data.recalls as Array<{ riskType: string; notifyingCountry: string; countryOfOrigin: string }>;

const KNOWN_RISK_COMPONENTS_ES = [
  'Lesiones', 'Incendio', 'Medio ambiente', 'Quemaduras', 'Químico', 'Descarga eléctrica', 'Seguridad',
  'Cortes', 'Asfixia', 'Daños auditivos', 'Riesgo para la salud u otro', 'Atrapamiento',
  'Sofocación', 'Sin homologación (no legal)'
].map(label => label.toLowerCase());

const PRODUCT_TRANSLATIONS = [
  'Turismo o furgoneta', 'Turismos', 'Turismo', 'Furgoneta de pasajeros', 'Furgoneta', 'Camper', 'Motocicletas',
  'Motocicleta', 'Camión', 'Autobús', 'Pick-up', 'Vehículos comerciales ligeros', 'Vehículo comercial ligero',
  'Remolque', 'Vehículos todoterreno (ATV)', 'Vehículo todoterreno (ATV)', 'Componente de vehículo',
  'Autocaravana', 'Scooter'
];

// Nombres de país que se escriben igual en inglés y en español: única fuente de verdad.
const COUNTRIES_SAME_IN_SPANISH = [
  'Argentina', 'Austria', 'Bulgaria', 'India', 'Indonesia', 'Liechtenstein', 'Malta', 'Portugal', 'Serbia', 'Vietnam'
];

function labelsSplitSpanishList(label: string): string[] {
  return label
    .split(/,| [ye] (?=[^,]*$)/)
    .map(part => part.trim().toLowerCase())
    .filter(Boolean);
}

describe('riskLabel', () => {
  test('traduce riesgos simples', () => {
    assert.equal(riskLabel('Injuries', 'es'), 'Lesiones');
    assert.equal(riskLabel('Electric shock', 'es'), 'Descarga eléctrica');
    assert.equal(riskLabel('Not type approved and therefore not legal', 'es'), 'Sin homologación (no legal)');
  });

  test('une riesgos compuestos con coma y " y " y solo la primera en mayúscula', () => {
    assert.equal(riskLabel('Burns, Fire, Injuries', 'es'), 'Quemaduras, incendio y lesiones');
    assert.equal(riskLabel('Fire, Injuries', 'es'), 'Incendio y lesiones');
  });

  test('deja tal cual un componente desconocido', () => {
    assert.equal(riskLabel('Radiation', 'es'), 'Radiation');
    assert.equal(riskLabel('Fire, Radiation', 'es'), 'Incendio y Radiation');
  });

  test('usa "e" ante una palabra que empieza por i', () => {
    assert.equal(riskLabel('Burns, Fire', 'es'), 'Quemaduras e incendio');
    assert.equal(riskLabel('Environment, Fire', 'es'), 'Medio ambiente e incendio');
  });

  test('traduce Suffocation como Sofocación', () => {
    assert.equal(riskLabel('Suffocation', 'es'), 'Sofocación');
  });

  test('en inglés conserva los componentes y une con " & " antes del último', () => {
    assert.equal(riskLabel(' Burns,Fire ', 'en'), 'Burns & Fire');
    assert.equal(riskLabel('Fire, Injuries', 'en'), 'Fire & Injuries');
    assert.equal(riskLabel('Burns, Fire, Injuries', 'en'), 'Burns, Fire & Injuries');
    assert.equal(riskLabel('Injuries', 'en'), 'Injuries');
  });

  test('todos los riskType de los datos se traducen por completo', () => {
    const untranslated = new Set<string>();
    for (const recall of recalls) {
      const label = riskLabel(recall.riskType, 'es');
      const hasUnknown = labelsSplitSpanishList(label).some(part => !KNOWN_RISK_COMPONENTS_ES.includes(part));
      if (hasUnknown) untranslated.add(`${recall.riskType} -> ${label}`);
    }
    assert.deepEqual([...untranslated], []);
  });
});

describe('countryLabel', () => {
  test('traduce países y territorios', () => {
    assert.equal(countryLabel('Germany', 'es'), 'Alemania');
    assert.equal(countryLabel('The Netherlands', 'es'), 'Países Bajos');
    assert.equal(countryLabel('United Kingdom in respect of Northern Ireland', 'es'), 'Reino Unido (Irlanda del Norte)');
  });

  test('deja tal cual un país desconocido', () => {
    assert.equal(countryLabel('Atlantis', 'es'), 'Atlantis');
  });

  test('en inglés no cambia nada', () => {
    assert.equal(countryLabel('Germany', 'en'), 'Germany');
  });

  test('todos los países de los datos tienen traducción al español', () => {
    const untranslated = new Set<string>();
    for (const recall of recalls) {
      for (const country of [recall.notifyingCountry, recall.countryOfOrigin]) {
        const unchanged = countryLabel(country, 'es') === country;
        if (country && unchanged && !COUNTRIES_SAME_IN_SPANISH.includes(country)) untranslated.add(country);
      }
    }
    assert.deepEqual([...untranslated], []);
  });
});

describe('productLabel', () => {
  test('traduce solo el tipo de vehículo inicial', () => {
    assert.equal(productLabel('Passenger car S80, S60', 'es'), 'Turismo S80, S60');
    assert.equal(productLabel('passenger cars - various', 'es'), 'Turismos - various');
    assert.equal(productLabel('Passenger car/van', 'es'), 'Turismo o furgoneta');
    assert.equal(productLabel('Passenger van / minibus', 'es'), 'Furgoneta de pasajeros / minibus');
    assert.equal(productLabel('Motorcycles', 'es'), 'Motocicletas');
    assert.equal(productLabel('Pick-up truck', 'es'), 'Pick-up');
    assert.equal(productLabel('Pickup truck', 'es'), 'Pick-up');
    assert.equal(productLabel('Lorry', 'es'), 'Camión');
    assert.equal(productLabel('All terrain vehicle', 'es'), 'Vehículo todoterreno (ATV)');
    assert.equal(productLabel('Vehicle part / seat', 'es'), 'Componente de vehículo / seat');
    assert.equal(productLabel('Camper van', 'es'), 'Camper');
    assert.equal(productLabel('Light commercial vehicle', 'es'), 'Vehículo comercial ligero');
    assert.equal(productLabel('Light commercial vehicles', 'es'), 'Vehículos comerciales ligeros');
    assert.equal(productLabel('All terrain vehicles (ATV) - X', 'es'), 'Vehículos todoterreno (ATV) - X');
    assert.equal(productLabel('Passenger car – Ford Focus', 'es'), 'Turismo – Ford Focus');
    assert.equal(productLabel('Passenger car "Avensis"', 'es'), 'Turismo "Avensis"');
    assert.equal(productLabel('Motorcycle KTM', 'es'), 'Motocicleta KTM');
  });

  test('no traduce cuando el texto no es un vehículo', () => {
    const unchanged = [
      'Motorcycle helmet', 'Motorcycle helmet "Exo-400"', 'Truck tyre', 'Truck Tyre', 'Bus tyre',
      'Lorry combination', 'Trailer with woodchipper', 'Passenger cars and lorries', 'Passenger car or van',
      'Passenger car manufactured by Fiat', 'Passenger car911 Turbo', 'All terrain'
    ];
    for (const product of unchanged) assert.equal(productLabel(product, 'es'), product);
  });

  test('ninguna salida de los datos deja una palabra inglesa en minúsculas tras la traducción', () => {
    const offenders: string[] = [];
    for (const recall of data.recalls as Array<{ product: string }>) {
      const label = productLabel(recall.product, 'es');
      if (label === recall.product.trim()) continue;
      const translation = PRODUCT_TRANSLATIONS.filter(t => label.startsWith(t)).sort((a, b) => b.length - a.length)[0];
      if (/^ [a-z]/.test(label.slice(translation.length))) offenders.push(`${recall.product} -> ${label}`);
    }
    assert.deepEqual(offenders, []);
  });

  test('no toca textos que solo empiezan por las mismas letras', () => {
    assert.equal(productLabel('Busbar', 'es'), 'Busbar');
    assert.equal(productLabel('Tractor', 'es'), 'Tractor');
  });

  test('en inglés no cambia nada', () => {
    assert.equal(productLabel('Passenger car S80', 'en'), 'Passenger car S80');
  });
});
