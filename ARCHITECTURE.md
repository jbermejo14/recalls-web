# Arquitectura: Ododex · Llamadas a revisión (Safety Gate UE)

## 1. Objetivo y alcance

Web de consulta de campañas de llamada a revisión de vehículos publicadas en **Safety Gate** (Comisión Europea). Forma parte de la red **Ododex** y se publica gratis como sitio estático en Cloudflare, con **una compilación por idioma**:

| Idioma | URL pública | Carpeta de exportación | Worker |
|---|---|---|---|
| Español | `https://ododex.com/es/llamadas-revision` | `out-es/` | `ododex-llamadas-revision` |
| Inglés | `https://ododex.com/en/recalls` | `out-en/` | `ododex-recalls` |

Cada idioma tiene unas 11 400 páginas (6 307 campañas, 652 marcas y 4 440 modelos). Las dos juntas pasarían de los 20 000 ficheros que admite un Worker gratuito, así que cada idioma va en su propio Worker. Lo ensambla y despliega `../ododex-sitio`.

Este documento cubre:

- la reestructuración para exportar por idioma;
- la marca, el estilo y los textos legales de Ododex;
- el SEO.

Fuera de alcance:

- Cambiar los datos o la importación (`scripts/import-safety-gate.ts`, `src/lib/normalizer.ts`, `src/data/`).
- Cambiar la lógica de `src/lib/safety-gate-service.ts`, salvo lo que exija la nueva estructura.

Referencias de solo lectura:

- `../multas-dgt`: misma migración a Ododex; sirve de modelo. Ficheros: `src/lib/site.ts`, `src/lib/legal.ts`, `src/components/{Header,Footer,BrandLogo,Breadcrumbs,AdSenseScript,ConsentSettingsButton}.tsx`, `src/app/{aviso-legal,privacidad,cookies}/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `config/titular.example.json` y las pruebas `test/site.test.ts`, `test/legal*.test.*`, `test/ui-*.test.ts`.
- `../calculadora-impuestos/app/globals.css`: tokens de color originales.
- `../brand/README.md`: marca.

## 2. Módulos

### R1 — Idioma y rutas (`src/lib/site.ts`, `next.config.ts`)

El idioma de cada compilación sale de la variable de entorno `RECALLS_LANG` (`es` o `en`; por defecto `es`). Cualquier otro valor hace fallar la compilación con un mensaje que dice qué valores se admiten.

```ts
export const SITE_NAME = 'Ododex';
export type Locale = 'es' | 'en';
/** Rutas base públicas por idioma. Sin barra final. */
export const BASE_PATHS: Record<Locale, string> = { es: '/es/llamadas-revision', en: '/en/recalls' };
/** Nombre de la sección en la cabecera, por idioma. */
export const SECTION_NAMES: Record<Locale, string> = { es: 'Llamadas a revisión', en: 'Vehicle recalls' };
/** Idioma de esta compilación (RECALLS_LANG). Lanza Error si el valor no es válido. */
export function getLocale(): Locale;
/** Ruta base de esta compilación: BASE_PATHS[getLocale()]. */
export function getBasePath(): string;
/** Origen sin barra final: NEXT_PUBLIC_SITE_URL o http://localhost:3050. */
export function getSiteUrl(): string;
/** URL absoluta de una ruta interna en el idioma indicado (por defecto, el de la compilación). */
export function absoluteUrl(path: string, locale?: Locale): string;
/** Ruta base + ruta, para <img>, <a> sin next/link y fetch. */
export function assetPath(path: string): string;
/** Ruta pública (sin origen) de la misma página en el otro idioma: BASE_PATHS[otro] + path. */
export function otherLocalePath(path: string): string;
/** { es, en, 'x-default' (= es) } con URLs absolutas, para hreflang. */
export function alternateUrls(path: string): Record<string, string>;
/** true para '/campana/<slug>' y '/marca/<marca>/<modelo>': páginas publicadas solo como HTML. */
export function isHtmlOnlyRoute(path: string): boolean;
```

`next.config.ts`:

- calcula `basePath` y `distDir` a partir de `RECALLS_LANG` con una tabla duplicada de `BASE_PATHS` (con el comentario de por qué está duplicada, como en multas). Una prueba comprueba que coinciden;
- `distDir: 'out-es'` o `'out-en'`;
- `output: 'export'` e `images: { unoptimized: true }`.

Antes de implementar, comprobar en `node_modules/next/dist/docs/` que con `output: 'export'` la exportación se escribe en `distDir`. Si no es así, documentarlo e informar.

`package.json`:

- `"build": "npm run build:es && npm run build:en"`;
- `"build:es"` y `"build:en"`: `next build --webpack` con `RECALLS_LANG` fijado. Como `VAR=x` no funciona en `cmd` de Windows, se usa un script `scripts/build-locale.mjs <es|en>` que lanza `next build --webpack` con la variable en el entorno y propaga el código de salida;
- `.gitignore`: `out-*/`.

### R2 — Rutas sin `[lang]`

- El contenido de `src/app/[lang]/` pasa a `src/app/`. La sesión principal hace los `git mv` antes de empezar. Las páginas obtienen el idioma con `getLocale()` en lugar de `params.lang`. `generateStaticParams` ya no incluye `lang`.
- Se mantienen las rutas internas `/`, `/marca/[marca]`, `/marca/[marca]/[modelo]` y `/campana/[slug]`, iguales en los dos idiomas. Así el selector de idioma y los hreflang solo cambian la ruta base.
- `src/proxy.ts` y `src/app/robots.ts` desaparecen (los borra la sesión principal). `robots.txt` lo sirve la raíz de `ododex.com`.
- `LanguageSwitcher`: un `<a href={otherLocalePath(rutaActual)}>` normal. Es otro Worker, así que no se usa `next/link`.
- Enlaces a páginas publicadas solo como HTML (`isHtmlOnlyRoute`): componente `InternalLink`, como en `../gasolineras/src/components/InternalLink.tsx` (léelo): `<a href={assetPath(href)}>` si es solo HTML; `next/link` si no.
- `src/i18n/` sigue igual: diccionarios por idioma; `get-dictionary` recibe `getLocale()`.
- Si la home pasa al componente cliente `SearchClient` las 6 307 campañas completas, se reduce a los campos que usa la búsqueda. El objetivo es que el HTML de la home no pase de 1,5 MB; hay que informar del tamaño antes y después.

### R3 — SEO

- Canonical: `absoluteUrl(path)`. Hreflang (`alternates.languages`): `alternateUrls(path)`. JSON-LD de migas: `absoluteUrl`.
- `sitemap.ts`: `dynamic = 'force-static'`. Solo incluye las URLs del idioma de la compilación, cada una con `alternates.languages`.
- `not-found.tsx` en la raíz de `src/app/`, en el idioma de la compilación.
- Metadatos: plantilla `'%s | Ododex'`. `siteName`: "Ododex". `<html lang>` según el idioma.

### R4 — Marca, estilo y legales de Ododex

Como en `../multas-dgt` (secciones 2.2, 2.3 y 2.6 de su `ARCHITECTURE.md`):

- **Marca:**
  - `public/brand/` con los logos de `../brand/` y `src/app/icon.svg`. La sesión principal los copia;
  - `BrandLogo`;
  - `Header`: logo, separador, `SECTION_NAMES[locale]`, selector de idioma y conmutador de tema con `localStorage['ododex-theme']` y `data-theme`. Una fila de navegación con "Inicio" y "Marcas" (la ancla de la lista de marcas de la home), en el idioma de la compilación;
  - `Footer`: legales, botón de consentimiento si hay AdSense, fuente de los datos (Safety Gate, Comisión Europea) y aviso de que el sitio es independiente y no es oficial;
  - fuentes Inter y JetBrains Mono.
  - Desaparece toda mención a "RECALLSCOPE". Una prueba lo vigila.
- **Estilo:**
  - `src/app/globals.css` con los tokens, `@theme inline` y las clases de multas (`card`, `btn`, `tag`, `breadcrumbs`, etc.), con las clases de componentes en `@layer components`;
  - colores semánticos en todos los `.tsx`. Una prueba prohíbe `neutral-`, `zinc-`, `slate-`, `gray-`, `text-orange-`, `bg-orange-`, `#ff6b00` y `bg-gradient`;
  - la gravedad de riesgo (`RiskBadge`) con `tag-green`, `tag-warning` o `tag-red`;
  - sin desbordamiento horizontal a 375 px.
- **Legales:**
  - `src/lib/legal.ts` y `config/titular.example.json`, copiados de multas. La sesión principal copia `config/titular.json`, que está fuera de git;
  - páginas `/aviso-legal`, `/privacidad` y `/cookies` en el idioma de la compilación, con textos para esta web: datos de Safety Gate, sitio no oficial, sin formularios, tema en `localStorage`, AdSense con consentimiento y teselas si las hubiera (si no hay mapa, no se mencionan). Las tres con `noindex, follow` y fuera del sitemap. El texto en inglés es una traducción fiel del español;
  - `AdSenseScript` y `ConsentSettingsButton`, como en multas.

## 3. Orden de implementación

1. **R1 + R2 + R3**: estructura y exportación. Sin cambios visuales salvo los necesarios.
2. **R4**: marca, estilo y legales.

## 4. Criterios de aceptación

- `npm test` pasa: las 11 pruebas actuales, adaptadas, más estas nuevas:
  - `tests/site.test.ts`: `getLocale` (válido, por defecto e inválido), `absoluteUrl`, `assetPath`, `otherLocalePath`, `alternateUrls`, `isHtmlOnlyRoute` y la coincidencia de `next.config.ts` con `BASE_PATHS`.
  - `tests/links.test.ts`: ningún `<Link` apunta a `/campana/` ni a `/marca/x/y`.
  - En R4: pruebas de marca, colores, contraste y legales, como las de multas.
- `npx tsc --noEmit` pasa.
- `npm run build` termina y genera `out-es/` y `out-en/`. En cada una:
  - `index.html`, `404.html`, `sitemap.xml`;
  - una página por campaña, marca y modelo.
- En pantalla (sesión principal, servida con `../ododex-sitio`): la home, una marca, un modelo, una campaña, el cambio de idioma y los legales, en los dos idiomas, en claro y oscuro, a 375 y 1280 px.

## 5. Anuncios

Bloques manuales de AdSense según la sección 8 de `../ododex-sitio/ARCHITECTURE.md`.

- `src/components/AdSlot.tsx` (componente de cliente, export por defecto): no renderiza nada si `NEXT_PUBLIC_ADSENSE_CLIENT` no es `ca-pub-` más 16 dígitos (`getAdSenseClient`) o `NEXT_PUBLIC_ADSENSE_SLOT` no tiene 10 dígitos (`getAdSenseSlot`). Hace el `push` una sola vez (`useEffect` y `useRef`) y registra con `console.error` si falla.
- Texto visible: clave `adLabel` de los diccionarios ("Publicidad" en `es`, "Advertisement" en `en`).
- La clase `.ad-slot` está en `@layer components` de `src/app/globals.css`: 280 px de alto mínimo en móvil y 250 px desde `md`, con `--bg-surface`, `--border-color`, `--radius-md` y `--text-muted`.
- Huecos (máximo 3 por página; ninguno dentro de formularios, listas de resultados ni pegado a botones):

| Página | Hueco 1 | Hueco 2 |
|---|---|---|
| `/` | tras el buscador y antes del directorio de marcas | al final, tras el aviso institucional y antes del pie |
| `/marca/[marca]` | tras el bloque principal (cabecera, aviso y desgloses) y antes de los modelos | al final, tras la lista de campañas |
| `/marca/[marca]/[modelo]` | tras el bloque principal y antes de la lista de campañas | al final, tras el enlace de vuelta |
| `/campana/[slug]` | tras la ficha y los detalles, antes del aviso de reparación gratuita | al final, tras la navegación inferior |

- Sin anuncios: `/aviso-legal`, `/privacidad`, `/cookies` y la 404.
- Pruebas: `tests/ad-slot.test.tsx`.

## 6. Enlaces de red de Ododex (2026-11-19)

- `src/lib/network.ts` lee en compilación el JSON de `ODODEX_RED_ENLACES` (formato en `../ododex-sitio/ARCHITECTURE.md` §10), con caché por ruta. Sin variable o sin fichero devuelve `null`; JSON inválido o `version !== 1` lanza un `Error` en español.
- Esta web solo recibe el pie (no hay enlaces por marca): `src/components/Footer.tsx` (parámetro `networkSections`, que pasa `src/app/layout.tsx` desde `getFooterNetworkSections()`) pinta « Otras webs de Ododex » con las secciones sin la propia, con `<a href>` tal cual (son de otra sección: sin `next/link` ni `assetPath`). Sin red no se pinta.
- Solo en la compilación española: con `RECALLS_LANG=en` `getFooterNetworkSections()` devuelve `null`, porque las webs de la red están en español. El rótulo del bloque no está en los diccionarios por ese motivo.
- Pruebas: `tests/network.test.tsx`.
