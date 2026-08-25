import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { VisualRefresh } from '@/components/ui/VisualRefresh';

export const metadata: Metadata = {
  metadataBase: new URL('https://cne.io.kr'),
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
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
  const currentLocale = locale as 'ko' | 'en';
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <VisualRefresh />
      <Header locale={currentLocale} />
      <div className="flex-1">{children}</div>
      <Footer locale={currentLocale} />
    </NextIntlClientProvider>
  );
}
