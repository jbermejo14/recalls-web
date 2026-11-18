'use client';

import { useEffect, useRef } from 'react';
import { getAdSenseClient } from './AdSenseScript';
import { getDictionary } from '../i18n/get-dictionary';
import { getLocale } from '../lib/site';

const ADSENSE_SLOT_PATTERN = /^\d{10}$/;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Unidad de anuncio configurada (NEXT_PUBLIC_ADSENSE_SLOT), o null si falta o no tiene 10 dígitos. */
export function getAdSenseSlot(): string | null {
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT ?? '';
  return ADSENSE_SLOT_PATTERN.test(slot) ? slot : null;
}

/**
 * Hueco de anuncio manual. No renderiza nada si falta un cliente válido
 * (NEXT_PUBLIC_ADSENSE_CLIENT) o una unidad válida (NEXT_PUBLIC_ADSENSE_SLOT, 10 dígitos).
 */
export default function AdSlot({ className }: { className?: string }) {
  const client = getAdSenseClient();
  const slot = getAdSenseSlot();
  const pushed = useRef(false);

  useEffect(() => {
    // La ref evita el segundo push que provoca el modo estricto al montar dos veces.
    if (!client || !slot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('No se pudo cargar el anuncio de AdSense', error);
    }
  }, [client, slot]);

  if (!client || !slot) return null;
  const label = getDictionary(getLocale()).adLabel;
  return (
    <aside aria-label={label} className={className ? `ad-slot ${className}` : 'ad-slot'}>
      <span className="ad-slot__label">{label}</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
