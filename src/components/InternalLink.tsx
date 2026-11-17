import type { ReactNode } from 'react';
import Link from 'next/link';
import { assetPath, isHtmlOnlyRoute } from '../lib/site';

interface InternalLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/**
 * Enlace interno. Las páginas publicadas solo como HTML (campaña y modelo) no se prerrenderizan
 * como datos RSC, así que se enlazan con <a href={assetPath(href)}>; el resto usa next/link.
 */
export default function InternalLink({ href, className, children }: InternalLinkProps) {
  if (isHtmlOnlyRoute(href)) {
    return (
      <a href={assetPath(href)} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
