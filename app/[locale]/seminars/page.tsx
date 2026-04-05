import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getSeminars } from '@/lib/content';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SeminarsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'seminars' });
  const seminars = getSeminars(lang);
  const base = lang === 'en' ? '/en' : '/ko';

  // Group by year
  const byYear = seminars.reduce<Record<string, typeof seminars>>((acc, s) => {
    const year = s.date.slice(0, 4);
    (acc[year] = acc[year] || []).push(s);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {t('title')}
        </h1>
        <p className="text-sm font-mono" style={{ color: 'var(--text-faint)' }}>{seminars.length} talks</p>
      </div>

      <div className="space-y-10 slide-enter-content">
        {years.map(year => (
          <div key={year}>
            <div className="text-xs font-mono mb-3" style={{ color: 'var(--text-faint)' }}>{year}</div>
            <div style={{ borderTop: '1px solid var(--border)' }}>
              {byYear[year].map(seminar => (
                <Link
                  key={seminar.slug}
                  href={`${base}/seminars/${seminar.slug}`}
                  className="group flex items-start justify-between gap-4 py-3.5 transition-opacity hover:opacity-70"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm block truncate" style={{ color: 'var(--text)' }}>
                      {seminar.title}
                    </span>
                    <span className="text-xs mt-0.5 block" style={{ color: 'var(--text-faint)' }}>
                      {seminar.event}
                      {seminar.location && ` · ${seminar.location}`}
                    </span>
                  </div>
                  <time className="text-xs font-mono flex-shrink-0 mt-0.5" style={{ color: 'var(--text-faint)' }}>
                    {seminar.date.slice(5, 10)}
                  </time>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
