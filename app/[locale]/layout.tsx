import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '@/app/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dasomel.github.io'),
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ko' | 'en')) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Pretendard — 한국어 가독성 최적화 variable font */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
      </head>
      <body
        className="min-h-screen flex flex-col font-sans"
        style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100svh' }}
      >
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale as 'ko' | 'en'} />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
