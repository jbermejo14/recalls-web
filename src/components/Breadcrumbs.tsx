import React from 'react';
import InternalLink from './InternalLink';
import { absoluteUrl, getLocale } from '../lib/site';
import { generateBreadcrumbSchema, type BreadcrumbItem } from '../lib/seo';
import { getDictionary } from '../i18n/get-dictionary';

/** Migas de pan con su JSON-LD. `url` son rutas internas (sin ruta base). */
export default function Breadcrumbs({
  items
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schemaItems: BreadcrumbItem[] = items.map(item => ({
    name: item.name,
    item: absoluteUrl(item.url)
  }));
  const label = getDictionary(getLocale()).header.breadcrumbsLabel;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(schemaItems)) }}
      />
      <nav aria-label={label} className="breadcrumbs">
        {items.map((crumb, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={`${index}-${crumb.url}`}>
              {index > 0 && <span className="sep">/</span>}
              {isLast ? (
                <span className="current" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <InternalLink href={crumb.url}>{crumb.name}</InternalLink>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}
