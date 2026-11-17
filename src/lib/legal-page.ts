import type { Metadata } from 'next';
import { FECHA_TEXTOS_LEGALES } from './legal';
import { buildPageMetadata } from './seo';
import { getLocale, SITE_NAME } from './site';
import { formatText, getDictionary } from '../i18n/get-dictionary';

/** Robots de las páginas legales: no se indexan, pero se siguen sus enlaces. */
export const LEGAL_ROBOTS = { index: false, follow: true } as const;

/** Metadatos de una página legal: título y descripción en el idioma de la compilación, sin indexar. */
export function legalMetadata(path: string, title: string, descriptionTemplate: string): Metadata {
  return {
    ...buildPageMetadata({
      path,
      title,
      description: formatText(descriptionTemplate, { site: SITE_NAME })
    }),
    robots: LEGAL_ROBOTS
  };
}

/** Línea "Última revisión: <fecha>" en el idioma de la compilación. */
export function legalLastReview(): string {
  return formatText(getDictionary(getLocale()).legal.lastReview, { date: FECHA_TEXTOS_LEGALES });
}
