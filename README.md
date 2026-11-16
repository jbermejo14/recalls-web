# RECALLSCOPE | Consultor Oficial de Llamadas a Revisión (Safety Gate UE)

Plataforma de SEO programático bilingüe (Español / Inglés) para la consulta de campañas de llamada a revisión (recalls), defectos de seguridad y alertas oficiales sobre vehículos de motor notificadas a través de **Safety Gate** (sistema de alerta rápida de la Comisión Europea / RAPEX).

---

## 🚀 Características Principales

1. **SEO Programático Completo**:
   - `/[lang]` (Home): Buscador en tiempo real, estadísticas globales, directorio de marcas y últimas campañas oficiales.
   - `/[lang]/marca/[marca]`: Ficha completa por fabricante con desglose objetivo por categoría de peligro, desglose por año y catálogo de modelos.
   - `/[lang]/marca/[marca]/[modelo]`: *"Llamadas a revisión del {marca} {modelo}"*, con histórico íntegro de campañas oficiales que afectan al modelo.
   - `/[lang]/campana/[caseNumber-slug]`: Ficha técnica de la alerta con el peligro oficial, medidas correctoras impuestas/adoptadas, fechas de fabricación, país notificador y enlace directo a la alerta oficial en ec.europa.eu.
2. **Sin Puntuaciones Engañosas**:
   - Eliminadas las notas artificiales (A+ a F) y puntuaciones ficticias de fiabilidad.
   - Presentación de métricas objetivas (volumen de campañas, categorías de riesgo, años y fechas oficiales) acompañadas de un aviso metodológico transparente: **el número de llamadas a revisión no mide la fiabilidad de un vehículo**, puesto que no pondera el volumen de ventas del fabricante ni la diligencia voluntaria de la marca para subsanar defectos preventivos.
3. **Bilingüe con SEO Internacional**:
   - Soporte nativo para `/es/...` y `/en/...`.
   - Etiquetas `hreflang` recíprocas (`es`, `en`) y fallback canónico `x-default`.
   - `canonical` absoluto configurable mediante `NEXT_PUBLIC_SITE_URL`.
   - Datos estructurados Schema.org `BreadcrumbList` en todas las páginas.
   - Generación automática de `sitemap.xml` dinámico y `robots.txt`.
   - Los textos oficiales de peligro y medidas se presentan en su idioma original de Safety Gate acompañados del distintivo *"Texto original de Safety Gate"*, evitando traducciones automáticas imprecisas en componentes críticos de seguridad.
4. **Diseño y Modo Oscuro**:
   - Paleta de diseño basada en Negro y Naranja (`#FF5500`), con selector rápido de modo oscuro / claro y persistencia en `localStorage`.
   - Totalmente responsivo y adaptado a móviles.
5. **Seguridad y Privacidad de Datos**:
   - Eliminados endpoints inseguros (`POST /api/reload-xml`) y políticas CORS abiertas.
   - Los datos se importan exclusivamente mediante CLI offline con `fast-xml-parser`.
   - Los ficheros XML de origen se mantienen fuera de `public/` y están ignorados en git.

---

## 🛠️ Tecnologías y Versiones Fijadas

- **Next.js**: `16.4.6` (App Router)
- **React**: `19.3.0`
- **React DOM**: `19.3.0`
- **Tailwind CSS**: `4.3.3`
- **fast-xml-parser**: `5.0.8`
- **lucide-react**: `1.73.0`
- **TypeScript**: `5.7.3`
- **tsx**: `4.19.2`

*(Todas las dependencias están fijadas sin `^` en `package.json`).*

---

## 📥 Proceso de Importación de Datos (Safety Gate)

### Fuente Oficial
Los datos provienen del sistema oficial de la Comisión Europea:
- **Portal web**: [ec.europa.eu/safety-gate-alerts](https://ec.europa.eu/safety-gate-alerts/)
- **API oficial de informes semanales**:
  `https://ec.europa.eu/safety-gate-alerts/api/download/weeklyReport/list/xml/en`
  *(Nota: la API oficial de la Comisión Europea ofrece descargas automatizadas semana a semana. Para el histórico acumulado multianual de "Motor vehicles", el sistema oficial proporciona la opción de exportación XML directa desde el buscador del portal).*

### Exportación Manual del Histórico Multianual:
1. Accede a [ec.europa.eu/safety-gate-alerts](https://ec.europa.eu/safety-gate-alerts/).
2. En el filtro de categoría, selecciona **"Motor vehicles"**.
3. Pulsa **"Search"** y a continuación haz clic en **"Export XML"**.
4. Guarda el fichero resultante en la raíz del proyecto como:
   `raw-data/safety-gate-motor-vehicles.xml`
5. Ejecuta el comando de importación:
   ```bash
   npm run import
   ```

### Reglas de Normalización y Logs:
- Las reglas de normalización de marcas y modelos se encuentran desacopladas del código en ficheros JSON independientes con sus correspondientes tests:
  - `src/data/rules/brand-rules.json`: Marcas canónicas, alias (ej. *VW -> Volkswagen*, *mercedes benz -> Mercedes-Benz*) y extractores.
  - `src/data/rules/model-rules.json`: Prefijos genéricos de vehículos comerciales (*Van, Passenger car, PKW*), modelos conocidos y alias.
- Los registros incompletos o que no contienen información de marca identificable se descartan automáticamente y quedan registrados en:
  `import.log`

---

## ⚙️ Variables de Entorno

Copia el fichero `.env.example` a `.env`:
```bash
cp .env.example .env
```

Configuración requerida:
```env
# URL base para canonicals, hreflang y sitemap.xml (sin barra final)
NEXT_PUBLIC_SITE_URL=http://localhost:3050
```

---

## 🧪 Pruebas Unitarias (Offline)

Las pruebas unitarias se ejecutan de forma completamente offline (sin conexión a internet) utilizando un fixture XML reducido (`tests/fixtures/sample-safety-gate.xml`):
```bash
npm test
```

Aspectos evaluados en las pruebas:
- Parseo estricto con `fast-xml-parser`.
- Normalización de marcas y eliminación de caracteres no válidos.
- Extracción y desagregación de modelos múltiples en un único campo.
- Generación de slugs seguros para URLs (`slugify`, `caseNumberToSlug`).
- Comprobación de que entidades inexistentes devuelven `null` (disparando 404 `notFound()`).
- Estructura canónica y etiquetas `hreflang` recíprocas con `x-default`.
- Generación del índice `sitemap.xml`.

---

## 💻 Desarrollo y Compilación

### Instalación de dependencias:
```bash
npm install
```

### Ejecutar en modo desarrollo:
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3050](http://localhost:3050).

### Compilar para producción:
```bash
npm run build
```

### Iniciar servidor de producción:
```bash
npm start
```

---

## ⚖️ Reutilización de Datos y Atribución Legal

Los datos se reutilizan de conformidad con la **Decisión 2011/833/UE de la Comisión Europea**, de 12 de diciembre de 2011, relativa a la reutilización de los documentos de la Comisión (DO L 330 de 14.12.2011, p. 39).
- **Atribución visible obligatoria**: *"Datos: Safety Gate, Comisión Europea"*.
- **Enlace a la alerta oficial**: Cada ficha enlaza a la alerta oficial original en el portal europeo.
- **Aviso legal de reparación**: Conforme a la normativa europea de homologación y seguridad general de los productos (Directiva 2001/95/CE), las reparaciones preventivas vinculadas a llamadas a revisión oficiales de seguridad son completamente gratuitas para el propietario en la red autorizada del fabricante.
