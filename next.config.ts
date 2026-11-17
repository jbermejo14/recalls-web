import type { NextConfig } from "next";

// Debe coincidir con BASE_PATHS de src/lib/site.ts (lo comprueba tests/site.test.ts).
// No se importa de allí porque Next compila este fichero a ESM y no resuelve
// importaciones TypeScript sin extensión.
const BASE_PATHS: Record<string, string> = {
  es: "/es/llamadas-revision",
  en: "/en/recalls",
};

function resolveLocale(): string {
  const locale = process.env.RECALLS_LANG || "es";
  if (!(locale in BASE_PATHS)) {
    throw new Error(
      `RECALLS_LANG="${locale}" no es válido. Valores admitidos: ${Object.keys(BASE_PATHS).join(", ")}.`
    );
  }
  return locale;
}

const locale = resolveLocale();

// Una compilación por idioma: cada una exporta a su carpeta (out-es, out-en) y se despliega
// en su propio Worker. `env` inyecta RECALLS_LANG en el código de cliente, que no ve variables
// de entorno sin prefijo NEXT_PUBLIC_.
const nextConfig: NextConfig = {
  basePath: BASE_PATHS[locale],
  distDir: `out-${locale}`,
  output: "export",
  images: { unoptimized: true },
  env: { RECALLS_LANG: locale },
};

export default nextConfig;
