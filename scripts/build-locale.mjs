// Compila la web en un idioma: node scripts/build-locale.mjs <es|en>.
// Existe porque `VAR=valor comando` no funciona en cmd de Windows.
import { spawnSync } from 'node:child_process';

const SUPPORTED_LOCALES = ['es', 'en'];
const EXIT_USAGE = 2;

const locale = process.argv[2];
if (!SUPPORTED_LOCALES.includes(locale)) {
  console.error(`Idioma "${locale}" no válido. Uso: node scripts/build-locale.mjs <${SUPPORTED_LOCALES.join('|')}>`);
  process.exit(EXIT_USAGE);
}

const result = spawnSync('npx next build --webpack', {
  shell: true,
  stdio: 'inherit',
  env: { ...process.env, RECALLS_LANG: locale }
});

if (result.error) {
  console.error(`No se pudo lanzar next build: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
