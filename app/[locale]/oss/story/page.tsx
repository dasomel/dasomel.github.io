import { notFound } from 'next/navigation';
import OssStoryInfographic from '@/components/oss/OssStoryInfographic';
import OssStoryMobileInfographic from '@/components/oss/OssStoryMobileInfographic';
import styles from './oss-story.module.css';
import { routing } from '@/i18n/routing';

export default async function OssStoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ko' | 'en')) notFound();
  const currentLocale = locale as 'ko' | 'en';
  return (
    <div className={styles.scope}>
      <div className="hidden min-[761px]:block">
        <OssStoryInfographic locale={currentLocale} />
      </div>
      <div className="min-[761px]:hidden">
        <OssStoryMobileInfographic locale={currentLocale} />
      </div>
    </div>
  );
}
