import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import ConsentSettingsButton from './ConsentSettingsButton';
import { getLocale, SITE_NAME } from '../lib/site';
import { getDictionary } from '../i18n/get-dictionary';

const SAFETY_GATE_URL = 'https://ec.europa.eu/safety-gate-alerts/';

export interface FooterProps {
  /** Muestra el botón para cambiar el consentimiento; solo si AdSense está configurado. */
  showConsent?: boolean;
}

/** Pie de página: legales, fuente de los datos y aviso de sitio independiente. */
export default function Footer({ showConsent = false }: FooterProps) {
  const dict = getDictionary(getLocale());

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <p className="footer-text">
          <strong>{SITE_NAME}</strong> &bull; {dict.footer.tagline}
        </p>
        <p className="footer-subtext">
          {dict.footer.sourceLead}{' '}
          <a href={SAFETY_GATE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
            <span>{dict.footer.sourceName}</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </p>
        <p className="footer-subtext">{dict.footer.independentNotice}</p>
        <nav aria-label={dict.footer.legalLabel} className="footer-legal">
          <Link href="/aviso-legal">{dict.footer.legalNotice}</Link>
          <Link href="/privacidad">{dict.footer.privacy}</Link>
          <Link href="/cookies">{dict.footer.cookies}</Link>
          {showConsent && <ConsentSettingsButton label={dict.footer.configureCookies} />}
        </nav>
      </div>
    </footer>
  );
}
