import type { Metadata } from 'next';
import Breadcrumbs from '../../components/Breadcrumbs';
import { getTitular, valorOPendiente, type Titular } from '../../lib/legal';
import { legalLastReview, legalMetadata } from '../../lib/legal-page';
import { getLocale, SITE_NAME } from '../../lib/site';
import { formatText, getDictionary } from '../../i18n/get-dictionary';

const ROUTE = '/aviso-legal';

export function generateMetadata(): Metadata {
  const texts = getDictionary(getLocale()).legal.notice;
  return legalMetadata(ROUTE, texts.title, texts.description);
}

export default function LegalNoticePage() {
  const dict = getDictionary(getLocale());
  const texts = dict.legal.notice;
  const owner = getTitular();
  const field = (template: string, name: keyof Titular) => formatText(template, { value: valorOPendiente(owner, name) });

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
        <h2>{texts.ownerHeading}</h2>
        <p>{texts.ownerIntro}</p>
        <ul>
          <li>{field(texts.ownerName, 'nombre')}</li>
          <li>{field(texts.ownerTaxId, 'nif')}</li>
          <li>{field(texts.ownerAddress, 'domicilio')}</li>
          <li>{field(texts.ownerEmail, 'email')}</li>
          {owner.tipo === 'empresa' && <li>{field(texts.ownerRegistry, 'registroMercantil')}</li>}
        </ul>

        <h2>{texts.purposeHeading}</h2>
        <p>{formatText(texts.purpose, { site: SITE_NAME })}</p>

        <h2>{texts.unofficialHeading}</h2>
        <p>{texts.unofficial}</p>

        <h2>{texts.dataHeading}</h2>
        <p>{texts.data}</p>

        <h2>{texts.liabilityHeading}</h2>
        <p>{texts.liability}</p>

        <h2>{texts.ipHeading}</h2>
        <p>{texts.ip}</p>

        <h2>{texts.linksHeading}</h2>
        <p>{texts.links}</p>

        <h2>{texts.lawHeading}</h2>
        <p>{texts.law}</p>

        <p className="text-xs text-muted">{legalLastReview()}</p>
      </div>
    </div>
  );
}
