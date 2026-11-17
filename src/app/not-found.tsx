import Link from 'next/link';
import { AlertCircle, ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-[#FF5500]/10 text-[#FF5500] flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">404</h1>
        <h2 className="text-lg font-bold text-[var(--text-secondary)] mb-4">
          Página no encontrada / Page not found
        </h2>

        <p className="text-sm text-[var(--text-muted)] mb-8 leading-relaxed">
          La marca, modelo o campaña que estás buscando no existe o ha sido reclasificada en los datos de Safety Gate.
          <br /><br />
          The brand, model or campaign you are looking for does not exist or has been reclassified in Safety Gate data.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/es"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-sm transition-all shadow-md shadow-[#FF5500]/25"
          >
            <Home className="w-4 h-4" />
            <span>Inicio (ES)</span>
          </Link>
          <Link
            href="/en"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm transition-all border border-[var(--border-color)]"
          >
            <Home className="w-4 h-4" />
            <span>Home (EN)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
