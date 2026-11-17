import { ChevronRight } from 'lucide-react';
import InternalLink from './InternalLink';
import { absoluteUrl } from '../lib/site';
import { generateBreadcrumbSchema, type BreadcrumbItem } from '../lib/seo';

export default function Breadcrumbs({
  items
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schemaItems: BreadcrumbItem[] = items.map(item => ({
    name: item.name,
    item: absoluteUrl(item.url)
  }));

  const jsonLd = generateBreadcrumbSchema(schemaItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] py-3 overflow-x-auto whitespace-nowrap">
        {items.map((crumb, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <div key={crumb.url} className="flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />}
              {isLast ? (
                <span className="font-semibold text-[var(--text-primary)]">{crumb.name}</span>
              ) : (
                <InternalLink href={crumb.url} className="hover:text-[#FF5500] transition-colors">
                  {crumb.name}
                </InternalLink>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}
