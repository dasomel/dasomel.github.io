import { notFound } from 'next/navigation';
import OssStoryHorizontal from '@/components/oss/OssStoryHorizontal';
import OssStoryMobileNav from '@/components/oss/OssStoryMobileNav';
import styles from './oss-story.module.css';
import { routing } from '@/i18n/routing';

export default async function OssStoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ko' | 'en')) notFound();
  const currentLocale = locale as 'ko' | 'en';
  return (
    <div className={styles.scope}>
      <OssStoryHorizontal locale={currentLocale} />
      <OssStoryMobileNav locale={currentLocale} />
    </div>
  );
}
