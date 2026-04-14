import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getSeminars } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { ImpactStats } from '@/components/ui/impact-stats';
import { FeaturedCard } from '@/components/ui/featured-card';

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
  const conferenceCount = new Set(seminars.map(s => s.event)).size;
  const featured = seminars.filter(s => s.featured);

  // 연도별 그룹핑
  const grouped = seminars.reduce((acc, s) => {
    const year = s.date.slice(0, 4);
    if (!acc[year]) acc[year] = [];
    acc[year].push(s);
    return acc;
  }, {} as Record<string, typeof seminars>);
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          {t('title')}
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          {yearsActive}{t('subtitle_prefix')} {seminars.length}+ {t('subtitle_suffix')}
        </p>
        <ImpactStats stats={[
          { value: String(seminars.length), label: t('total') },
          { value: `${conferenceCount}+`, label: t('conferences') },
          { value: `${yearsActive}yr`, label: t('years_active') },
        ]} />
      </div>

      <div className="slide-enter-content">
        {featured.length > 0 && (
          <section className="mt-10 mb-10">
            <h2 className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: 'var(--text-faint)' }}>
              {t('highlights')}
            </h2>
            {featured.map(seminar => (
              <FeaturedCard key={seminar.slug}>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[8px] font-mono"
                    style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}
                  >
                    {seminar.event.substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <Link href={`${base}/seminars/${seminar.slug}`}>
                      <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>{seminar.title}</h3>
                    </Link>
                    <p className="text-xs" style={{ color: 'var(--accent)' }}>{seminar.event} · {seminar.date.slice(0, 4)}</p>
                  </div>
                </div>
              </FeaturedCard>
            ))}
          </section>
        )}

        <section>
          <h2 className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: 'var(--text-faint)' }}>
            {t('timeline')}
          </h2>
          {years.map((year, yi) => (
            <div key={year} className="flex gap-4 mb-6">
              {/* 왼쪽: 연도 + 세로선 */}
              <div className="flex flex-col items-center w-10 flex-shrink-0">
                <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{year}</span>
                {yi < years.length - 1 && (
                  <div className="w-0.5 flex-1 mt-2" style={{ backgroundColor: 'var(--border)' }} />
                )}
              </div>
              {/* 오른쪽: 세미나 목록 */}
              <div className="flex-1 flex flex-col gap-2 pb-2">
                {grouped[year].map(seminar => (
                  <Link
                    key={seminar.slug}
                    href={`${base}/seminars/${seminar.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-50 group"
                    style={{ border: '1px solid var(--border)' }}
                  >
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-[7px] font-mono flex-shrink-0"
                      style={{ backgroundColor: 'var(--surface)', color: 'var(--text-faint)' }}
                    >
                      {seminar.event.substring(0, 3).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-sm font-medium truncate group-hover:text-emerald-400 transition-colors"
                        style={{ color: 'var(--text)' }}
                      >
                        {seminar.title}
                      </h3>
                      <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
                        {seminar.event} · {new Date(seminar.date).toLocaleDateString('en-US', { month: 'short' })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
