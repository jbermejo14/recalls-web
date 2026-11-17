import Link from 'next/link';
import { AlertCircle, Home } from 'lucide-react';
import { getLocale, type Locale } from '../lib/site';

const NOT_FOUND_TEXTS: Record<Locale, { title: string; message: string; home: string }> = {
  es: {
    title: 'Página no encontrada',
    message: 'La marca, modelo o campaña que estás buscando no existe o ha sido reclasificada en los datos de Safety Gate.',
    home: 'Inicio'
  },
  en: {
    title: 'Page not found',
    message: 'The brand, model or campaign you are looking for does not exist or has been reclassified in Safety Gate data.',
    home: 'Home'
  }
};

export default function NotFound() {
  const texts = NOT_FOUND_TEXTS[getLocale()];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-[#FF5500]/10 text-[#FF5500] flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">404</h1>
        <h2 className="text-lg font-bold text-[var(--text-secondary)] mb-4">{texts.title}</h2>

        <p className="text-sm text-[var(--text-muted)] mb-8 leading-relaxed">{texts.message}</p>

        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-sm transition-all shadow-md shadow-[#FF5500]/25"
        >
          <Home className="w-4 h-4" />
          <span>{texts.home}</span>
        </Link>
      </div>
    </div>
  );
}
