// El primer plugin solo actúa con el binario WASI de Tailwind (ver README).
// Next.js exige nombres de plugin y opciones no vacías, de ahí `enabled`.
const postcssConfig = {
  plugins: {
    "./tailwind-wasi-sources.cjs": { enabled: true },
    "@tailwindcss/postcss": {},
  },
};

export default postcssConfig;
