import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default async function LocalizedOssPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ko' | 'en')) redirect('/');
  redirect(locale === 'en' ? '/oss/en/' : '/oss/');
}
