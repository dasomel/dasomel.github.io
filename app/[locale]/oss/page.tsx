import { notFound } from 'next/navigation';
import OssHub from '@/components/oss/OssHub';
import { routing } from '@/i18n/routing';

export default async function LocalizedOssPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ko' | 'en')) notFound();
  return <OssHub locale={locale as 'ko' | 'en'} />;
}
