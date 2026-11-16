import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { locales, isSupportedLocale, type Locale } from '../../i18n/config';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../globals.css';

export const viewport: Viewport = {
  themeColor: '#FF5500',
  width: 'device-width',
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3050'),
  icons: {
    icon: '/favicon.ico'
  }
};

export async function generateStaticParams() {
  return locales.map(lang => ({ lang }));
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  return (
    <html lang={lang} className="dark" suppressHydrationWarning>
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
        <Navbar lang={lang as Locale} />
        <main className="flex-1">
          {children}
        </main>
        <Footer lang={lang as Locale} />
      </body>
    </html>
  );
}
