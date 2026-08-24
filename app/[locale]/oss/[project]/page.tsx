import { notFound, redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default async function LocalizedOssProjectRedirect({ params }: { params: Promise<{ locale: string; project: string }> }) {
  const { locale, project } = await params;
  if (!routing.locales.includes(locale as 'ko' | 'en')) notFound();
  redirect(`/${locale}/projects/${project}/`);
}
