import { notFound } from 'next/navigation';
import OssStory from '@/components/oss/OssStory';
import { routing } from '@/i18n/routing';

export default async function OssStoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ko' | 'en')) notFound();
  return <OssStory locale={locale as 'ko' | 'en'} />;
}
