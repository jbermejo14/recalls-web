'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('recallscope_theme') as 'dark' | 'light' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle('light', saved === 'light');
      document.documentElement.classList.toggle('dark', saved === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('recallscope_theme', next);
    document.documentElement.classList.toggle('light', next === 'light');
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border border-[var(--border-color)] bg-[var(--bg-surface-elevated)] hover:border-[#FF5500] transition-colors"
      title={theme === 'dark' ? 'Cambiar a Modo Claro / Switch to Light' : 'Cambiar a Modo Oscuro / Switch to Dark'}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <>
          <Moon className="w-3.5 h-3.5 text-[#FF5500]" />
          <span className="hidden sm:inline text-xs">Modo Oscuro</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline text-xs">Modo Claro</span>
        </>
      )}
    </button>
  );
}
