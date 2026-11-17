import type { Metadata } from 'next';
import Breadcrumbs from '../../components/Breadcrumbs';
import { legalLastReview, legalMetadata } from '../../lib/legal-page';
import { getLocale } from '../../lib/site';
import { getDictionary } from '../../i18n/get-dictionary';

const ROUTE = '/cookies';
const THEME_STORAGE_NAME = 'ododex-theme';
const GOOGLE_COOKIES_LABEL = 'policies.google.com';

export function generateMetadata(): Metadata {
  const texts = getDictionary(getLocale()).legal.cookies;
  return legalMetadata(ROUTE, texts.title, texts.description);
}

export default function CookiesPage() {
  const dict = getDictionary(getLocale());
  const texts = dict.legal.cookies;

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
        <h2>{texts.whatHeading}</h2>
        <p>{texts.what}</p>

        <h2>{texts.usedHeading}</h2>
        <div className="table-responsive mb-4">
          <table className="guide-table">
            <thead>
              <tr>
                <th>{texts.columnName}</th>
                <th>{texts.columnPurpose}</th>
                <th>{texts.columnType}</th>
                <th>{texts.columnExpiry}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>{THEME_STORAGE_NAME}</code> (localStorage)</td>
                <td>{texts.themePurpose}</td>
                <td>{texts.themeType}</td>
                <td>{texts.themeExpiry}</td>
              </tr>
              <tr>
                <td>{texts.adsName}</td>
                <td>{texts.adsPurpose}</td>
                <td>{texts.adsType}</td>
                <td>{texts.adsExpiry}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          {texts.googleInfo}{' '}
          <a href={texts.googleUrl} target="_blank" rel="noopener noreferrer">{GOOGLE_COOKIES_LABEL}</a>.
        </p>

        <h2>{texts.changeHeading}</h2>
        <p>{texts.change}</p>

        <h2>{texts.deleteHeading}</h2>
        <p>
          {texts.deleteBefore} <code>{THEME_STORAGE_NAME}</code>
          {texts.deleteAfter}
        </p>

        <p className="text-xs text-muted">{legalLastReview()}</p>
      </div>
    </div>
  );
}
