'use client';

const THEME_STORAGE_KEY = 'ododex-theme';
const THEME_ICON_SIZE = 18;
const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

type Theme = 'dark' | 'light';

/** Tema activo: el atributo de <html> que fija el script de layout.tsx o, si falta, la preferencia del sistema. */
function themeCurrent(root: HTMLElement): Theme {
  const attribute = root.getAttribute('data-theme');
  if (attribute === 'dark' || attribute === 'light') return attribute;
  const prefersDark = typeof window.matchMedia === 'function' && window.matchMedia(DARK_SCHEME_QUERY).matches;
  return prefersDark ? 'dark' : 'light';
}

function themeToggle(): void {
  const root = document.documentElement;
  const next: Theme = themeCurrent(root) === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Sin localStorage (modo privado, cookies bloqueadas) el tema solo dura la visita.
  }
}

/**
 * Conmutador de tema. El icono y el texto de cada tema se alternan por CSS según [data-theme],
 * así el marcado inicial es idéntico en servidor y cliente y no hace falta estado en React.
 */
export default function ThemeSwitch({ lightLabel, darkLabel }: { lightLabel: string; darkLabel: string }) {
  return (
    <button className="theme-toggle-btn" type="button" onClick={themeToggle}>
      <span className="theme-when-dark" title={lightLabel}>
        <svg viewBox="0 0 24 24" width={THEME_ICON_SIZE} height={THEME_ICON_SIZE} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <span className="sr-only md:not-sr-only">{lightLabel}</span>
      </span>
      <span className="theme-when-light" title={darkLabel}>
        <svg viewBox="0 0 24 24" width={THEME_ICON_SIZE} height={THEME_ICON_SIZE} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <span className="sr-only md:not-sr-only">{darkLabel}</span>
      </span>
    </button>
  );
}
