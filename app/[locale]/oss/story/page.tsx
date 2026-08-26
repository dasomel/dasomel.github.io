import { notFound } from 'next/navigation';
import OssStoryInfographic from '@/components/oss/OssStoryInfographic';
import OssStoryMobileNav from '@/components/oss/OssStoryMobileNav';
import styles from './oss-story.module.css';
import { routing } from '@/i18n/routing';

export default async function OssStoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ko' | 'en')) notFound();
  const currentLocale = locale as 'ko' | 'en';
  return (
    <div className={styles.scope}>
      <OssStoryInfographic locale={currentLocale} />
      <OssStoryMobileNav locale={currentLocale} />
    </div>
  );
}
