import Link from 'next/link';
import BrandLogo from './BrandLogo';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitch from './ThemeSwitch';
import { getLocale, SECTION_NAMES } from '../lib/site';
import { getDictionary } from '../i18n/get-dictionary';

/** Cabecera: logo, nombre de la sección, selector de idioma, conmutador de tema y fila de navegación. */
export default function Header() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const sectionLinks = [
    { label: dict.nav.home, href: '/' },
    { label: dict.nav.brands, href: '/#marcas' }
  ];

  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="brand">
          <BrandLogo />
          <span className="brand-separator" aria-hidden="true" />
          <span className="brand-section">{SECTION_NAMES[locale]}</span>
        </Link>

        <div className="header-actions">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeSwitch lightLabel={dict.header.themeToLight} darkLabel={dict.header.themeToDark} />
        </div>
      </div>
      <nav aria-label={dict.header.sectionsLabel} className="header-nav">
        {sectionLinks.map(link => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
