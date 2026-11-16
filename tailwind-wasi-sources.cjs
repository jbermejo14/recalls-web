const fs = require("node:fs");
const path = require("node:path");
const { Scanner } = require("@tailwindcss/oxide");

const PLUGIN_NAME = "tailwind-wasi-sources";
const SOURCE_DIRECTORY = path.join(__dirname, "src");
const SOURCE_GLOB = "**/*.{ts,tsx,css}";
const SCANNED_EXTENSIONS = new Set([".ts", ".tsx", ".css"]);
// Caracteres que romperían la cadena o la expansión de llaves de @source inline().
const UNSAFE_CANDIDATE = /["'\{}\s]/;

/**
 * Indica si el escáner de Tailwind puede leer ficheros del disco. Con el binario
 * WASI en Windows no puede: devuelve cero candidatos aunque el fichero exista.
 */
function tailwindWasiCanReadFiles() {
  const scanner = new Scanner({});
  const ownFile = { file: __filename, extension: "cjs" };
  return scanner.scanFiles([ownFile]).length > 0;
}

function listSourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listSourceFiles(entryPath);
    return SCANNED_EXTENSIONS.has(path.extname(entry.name)) ? [entryPath] : [];
  });
}

function collectCandidates() {
  const scanner = new Scanner({});
  const contents = listSourceFiles(SOURCE_DIRECTORY).map((file) => ({
    content: fs.readFileSync(file, "utf8"),
    extension: path.extname(file).slice(1),
  }));
  return scanner.scanFiles(contents).filter((candidate) => !UNSAFE_CANDIDATE.test(candidate));
}

/**
 * Plugin de PostCSS que sustituye al escaneo de ficheros de Tailwind cuando solo
 * está disponible el binario WASI (Windows con el binario nativo bloqueado): lee
 * el código en Node y se lo pasa a Tailwind con `@source inline()`. Si el escáner
 * normal funciona (Linux, binario nativo), no hace nada.
 *
 * Next.js carga los plugins por nombre con `require`, por eso es un módulo CommonJS.
 */
function tailwindWasiSources() {
  if (tailwindWasiCanReadFiles()) {
    return { postcssPlugin: PLUGIN_NAME };
  }
  return {
    postcssPlugin: PLUGIN_NAME,
    Once(root, { AtRule, result }) {
      // Hace que el modo dev vuelva a procesar el CSS cuando cambie el código fuente.
      result.messages.push({
        type: "dir-dependency",
        plugin: PLUGIN_NAME,
        dir: SOURCE_DIRECTORY,
        glob: SOURCE_GLOB,
        parent: result.opts.from,
      });
      const candidates = collectCandidates().join(" ");
      root.append(new AtRule({ name: "source", params: `inline("${candidates}")` }));
    },
  };
}
tailwindWasiSources.postcss = true;

module.exports = tailwindWasiSources;
