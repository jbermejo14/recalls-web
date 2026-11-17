# Ododex · Llamadas a revisión (Safety Gate UE)

Plataforma de SEO programático bilingüe (Español / Inglés) para la consulta de campañas de llamada a revisión (recalls), defectos de seguridad y alertas publicadas sobre vehículos de motor notificadas a través de **Safety Gate** (sistema de alerta rápida de la Comisión Europea / RAPEX).

Forma parte de la red **Ododex** y se publica como sitio estático, una compilación por idioma:

| Idioma | URL pública | Exportación |
|---|---|---|
| Español | `https://ododex.com/es/llamadas-revision` | `out-es/` |
| Inglés | `https://ododex.com/en/recalls` | `out-en/` |

El diseño está en [`ARCHITECTURE.md`](ARCHITECTURE.md). La publicación (ensamblado, Workers de Cloudflare, `robots.txt`) la hace el proyecto hermano `../ododex-sitio`.

---

## 🚀 Características Principales

1. **SEO Programático Completo**:
   Rutas internas, iguales en los dos idiomas bajo su ruta base:
   - `/` (Home): buscador, estadísticas globales, directorio de marcas y últimas campañas.
   - `/marca/[marca]`: Ficha completa por fabricante con desglose objetivo por categoría de peligro, desglose por año y catálogo de modelos.
   - `/marca/[marca]/[modelo]`: *"Llamadas a revisión del {marca} {modelo}"*, con histórico íntegro de campañas que afectan al modelo.
   - `/campana/[caseNumber-slug]`: Ficha técnica de la alerta con el peligro descrito en Safety Gate, medidas correctoras impuestas/adoptadas, fechas de fabricación, país notificador y enlace directo a la alerta original en ec.europa.eu.
2. **Sin Puntuaciones Engañosas**:
   - Eliminadas las notas artificiales (A+ a F) y puntuaciones ficticias de fiabilidad.
   - Presentación de métricas objetivas (volumen de campañas, categorías de riesgo, años y fechas publicadas) acompañadas de un aviso metodológico transparente: **el número de llamadas a revisión no mide la fiabilidad de un vehículo**, puesto que no pondera el volumen de ventas del fabricante ni la diligencia voluntaria de la marca para subsanar defectos preventivos.
3. **Bilingüe con SEO Internacional**:
   - Cada idioma se compila aparte con `RECALLS_LANG` (`es` o `en`), que fija la ruta base y la carpeta de exportación (`src/lib/site.ts`, `next.config.ts`).
   - Etiquetas `hreflang` recíprocas entre `/es/llamadas-revision` y `/en/recalls`, con `x-default` en español.
   - `canonical` absoluto configurable mediante `NEXT_PUBLIC_SITE_URL`.
   - Datos estructurados Schema.org `BreadcrumbList` en todas las páginas.
   - `sitemap.xml` estático por idioma. `robots.txt` lo sirve la raíz de `ododex.com`.
   - Campañas y modelos se enlazan con `<a>` normales (`InternalLink`): se publican solo como HTML para caber en el límite de ficheros de Cloudflare.
   - Los textos de peligro y medidas se presentan en su idioma original de Safety Gate acompañados del distintivo *"Texto original de Safety Gate"*, evitando traducciones automáticas imprecisas en componentes críticos de seguridad.
4. **Marca, diseño y legales de Ododex**:
   - Tokens de color de la red Ododex por tema (`data-theme`, preferencia en `localStorage['ododex-theme']`), sin colores fijos en los componentes; contraste AA comprobado por pruebas.
   - Aviso legal, privacidad y cookies en el idioma de la compilación, con los datos del titular de `config/titular.json` (fuera de git; plantilla en `config/titular.example.json`).
   - AdSense con el mensaje de consentimiento de Google si `NEXT_PUBLIC_ADSENSE_CLIENT` tiene un `ca-pub-` válido.
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
- **Tailwind CSS**: `4.3.3` (integrado con `@tailwindcss/postcss` `4.3.3` vía `postcss.config.mjs`)
- **@tailwindcss/oxide-wasm32-wasi**: `4.3.3` (ver nota de compilación)
- **fast-xml-parser**: `5.0.8`
- **lucide-react**: `1.73.0`
- **TypeScript**: `5.7.3`
- **tsx**: `4.19.2`

*(Todas las dependencias están fijadas sin `^` en `package.json`).*

---

## 📥 Proceso de Importación de Datos (Safety Gate)

### Fuente de los datos
Los datos provienen de Safety Gate, el sistema de alerta de la Comisión Europea (este proyecto es independiente y no está afiliado a ella):
- **Portal web**: [ec.europa.eu/safety-gate-alerts](https://ec.europa.eu/safety-gate-alerts/)
- **API de informes semanales**:
  `https://ec.europa.eu/safety-gate-alerts/api/download/weeklyReport/list/xml/en`
  *(Nota: la API de la Comisión Europea ofrece descargas automatizadas semana a semana. Para el histórico acumulado multianual de "Motor vehicles", el sistema proporciona la opción de exportación XML directa desde el buscador del portal).*

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

| Variable | Uso | Por defecto |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Origen sin barra final para canonical, hreflang y sitemap. En producción, `https://ododex.com` | `http://localhost:3050` |
| `RECALLS_LANG` | Idioma de la compilación: `es` o `en`. Otro valor hace fallar la compilación | `es` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Editor de AdSense (`ca-pub-` y 16 dígitos). Vacía: sin AdSense ni botón de cookies | vacía |

`../ododex-sitio` pasa estas variables al compilar para producción.

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

Compila los dos idiomas en serie (`build:es` y `build:en`, que usan `scripts/build-locale.mjs`) y genera `out-es/` y `out-en/`. Con exportación estática no hay `npm start`: para ver el resultado como en producción, usa `npm run preview` en `../ododex-sitio`.

Nota: `npm run build` usa `--webpack`. En Windows con una política de Control de Aplicaciones que bloquea los binarios nativos (`@next/swc-win32-x64-msvc`, `@tailwindcss/oxide-win32-x64-msvc`), Next.js cae a WASM y Turbopack no funciona. Tailwind se procesa entonces con `@tailwindcss/oxide-wasm32-wasi`, que npm solo instala con `npm install --force` porque su `cpu` es `wasm32`. Además, el escáner de ficheros de ese binario WASI no encuentra ninguno en Windows (el CSS saldría sin utilidades), por lo que `tailwind-wasi-sources.cjs` lee `src/` con Node y se lo pasa a Tailwind con `@source inline()`; con el binario nativo (Linux) no hace nada. Si cambias la configuración y el CSS no cambia, la caché de webpack (`.next/cache`) puede devolver el anterior: modifica `src/app/globals.css` para invalidarla. Turbopack lee el mismo `postcss.config.mjs`.

---

## ⚖️ Reutilización de Datos y Atribución Legal

Los datos se reutilizan de conformidad con la **Decisión 2011/833/UE de la Comisión Europea**, de 12 de diciembre de 2011, relativa a la reutilización de los documentos de la Comisión (DO L 330 de 14.12.2011, p. 39).
- **Atribución visible obligatoria**: *"Datos: Safety Gate, Comisión Europea"*.
- **Enlace a la alerta original**: Cada ficha enlaza a la alerta original en el portal europeo.
- **Aviso legal de reparación**: Conforme a la normativa europea de homologación y seguridad general de los productos (Directiva 2001/95/CE), las reparaciones preventivas vinculadas a llamadas a revisión de seguridad son completamente gratuitas para el propietario en la red autorizada del fabricante.
