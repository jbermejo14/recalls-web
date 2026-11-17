import type { Metadata, Viewport } from 'next';
import { getLocale, getSiteUrl, SITE_NAME } from '../lib/site';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#FF5500',
  width: 'device-width',
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('recalls-theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] antialiased transition-colors duration-200">
        <Navbar lang={locale} />
        <main className="flex-1">
          {children}
        </main>
        <Footer lang={locale} />
      </body>
    </html>
  );
}
