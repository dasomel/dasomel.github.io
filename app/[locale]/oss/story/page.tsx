import { notFound } from 'next/navigation';
import OssStoryHorizontal from '@/components/oss/OssStoryHorizontal';
import '@/app/[locale]/oss/story/oss-story.module.css';
import { routing } from '@/i18n/routing';

export default async function OssStoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ko' | 'en')) notFound();
  return <OssStoryHorizontal locale={locale as 'ko' | 'en'} />;
}
