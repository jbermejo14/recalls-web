import type { Metadata } from 'next';
import Breadcrumbs from '../../components/Breadcrumbs';
import { getTitular, valorOPendiente, type Titular } from '../../lib/legal';
import { legalLastReview, legalMetadata } from '../../lib/legal-page';
import { getLocale } from '../../lib/site';
import { formatText, getDictionary } from '../../i18n/get-dictionary';

const ROUTE = '/privacidad';
const AEPD_URL = 'https://www.aepd.es';
const AEPD_LABEL = 'aepd.es';

export function generateMetadata(): Metadata {
  const texts = getDictionary(getLocale()).legal.privacy;
  return legalMetadata(ROUTE, texts.title, texts.description);
}

export default function PrivacyPage() {
  const dict = getDictionary(getLocale());
  const texts = dict.legal.privacy;
  const owner = getTitular();
  const field = (name: keyof Titular) => valorOPendiente(owner, name);

  return (
    <div className="main-wrapper">
      <Breadcrumbs
        items={[
          { name: dict.breadcrumbs.home, url: '/' },
          { name: texts.breadcrumb, url: ROUTE }
        ]}
      />
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">{texts.title}</h1>
      <div className="card legal-text">
        <h2>{texts.controllerHeading}</h2>
        <p>
          {formatText(texts.controller, {
            name: field('nombre'),
            taxId: field('nif'),
            address: field('domicilio'),
            email: field('email')
          })}
        </p>

        <h2>{texts.dataHeading}</h2>
        <p>{texts.dataIntro}</p>
        <ul>
          <li>{texts.dataTheme}</li>
          <li>{texts.dataEmail}</li>
          <li>{texts.dataLogs}</li>
          <li>{texts.dataAds}</li>
        </ul>

        <h2>{texts.transfersHeading}</h2>
        <p>{texts.transfers}</p>

        <h2>{texts.retentionHeading}</h2>
        <p>{texts.retention}</p>

        <h2>{texts.rightsHeading}</h2>
        <p>{formatText(texts.rights, { email: field('email') })}</p>

        <h2>{texts.complaintsHeading}</h2>
        <p>
          {texts.complaints}{' '}
          <a href={AEPD_URL} target="_blank" rel="noopener noreferrer">{AEPD_LABEL}</a>.
        </p>

        <p className="text-xs text-muted">{legalLastReview()}</p>
      </div>
    </div>
  );
}
