import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getSeminars } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { ImpactStats } from '@/components/ui/impact-stats';
import styles from './SeminarsRefresh.module.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SeminarsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'speaking' });
  const seminars = getSeminars(lang);
  const base = lang === 'en' ? '/en' : '/ko';
  const yearsActive = new Date().getFullYear() - 2013;
  const conferenceCount = new Set(seminars.map((s) => s.event)).size;
  const featured = seminars.filter((s) => s.featured).slice(0, 6);
  const grouped = seminars.reduce((acc, seminar) => {
    const year = seminar.date.slice(0, 4);
    (acc[year] ??= []).push(seminar);
    return acc;
  }, {} as Record<string, typeof seminars>);
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <main className={styles.speakingPage}>
      <section className={styles.speakingHero}>
        <div>
          <div className={styles.speakingKicker}>OSS WORKBENCH · SPEAKING</div>
          <h1 className={styles.speakingTitle}>{t('title')}</h1>
          <p className={styles.speakingLead}>
            {yearsActive}{t('subtitle_prefix')} {seminars.length}+ {t('subtitle_suffix')}
          </p>
        </div>
        <aside className={styles.speakingAside}>
          <div className={styles.speakingAsideLabel}>{t('highlights')}</div>
          <div className={styles.speakingAsideValue}>{conferenceCount}+</div>
          <div className={styles.speakingAsideMeta}>
            {lang === 'en' ? 'Conferences and communities across the platform-engineering journey.' : '플랫폼 엔지니어링 여정에서 만난 컨퍼런스와 커뮤니티의 기록입니다.'}
          </div>
        </aside>
      </section>

      <div className={styles.speakingStats}>
        <ImpactStats stats={[
          { value: String(seminars.length), label: t('total') },
          { value: `${conferenceCount}+`, label: t('conferences') },
          { value: `${yearsActive}yr`, label: t('years_active') },
        ]} />
      </div>

      {featured.length > 0 && (
        <section>
          <div className={styles.speakingSectionLabel}>{t('highlights')}</div>
          <div className={styles.speakingFeatured}>
            {featured.map((seminar) => (
              <Link key={seminar.slug} href={`${base}/seminars/${seminar.slug}`} className={styles.speakingFeature}>
                <div className={styles.speakingFeatureEvent}>{seminar.event} · {seminar.date.slice(0, 4)}</div>
                <div className={styles.speakingFeatureTitle}>{seminar.title}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className={styles.speakingSectionLabel}>{t('timeline')}</div>
        <div className={styles.speakingTimeline}>
          {years.map((year) => (
            <div key={year} className={styles.speakingYearGroup}>
              <div className={styles.speakingYear}>{year}</div>
              <div className={styles.speakingItems}>
                {grouped[year].map((seminar) => (
                  <Link key={seminar.slug} href={`${base}/seminars/${seminar.slug}`} className={styles.speakingItem}>
                    <div className={styles.speakingBadge}>{seminar.event.substring(0, 3).toUpperCase()}</div>
                    <div className={styles.speakingItemMain}>
                      <div className={styles.speakingItemTitle}>{seminar.title}</div>
                      <div className={styles.speakingItemMeta}>{seminar.event} · {new Date(seminar.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
