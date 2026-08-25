import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getSeminars } from '@/lib/content';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function SeminarsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const seminars = getSeminars(lang);
  const base = lang === 'en' ? '/en' : '/ko';
  const featured = seminars.filter(item => item.featured).slice(0, 2);
  const fallbackFeatured = featured.length >= 2 ? featured : seminars.slice(0, 2);
  const grouped = seminars.reduce((acc, seminar) => {
    const year = seminar.date.slice(0, 4);
    (acc[year] ??= []).push(seminar);
    return acc;
  }, {} as Record<string, typeof seminars>);
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));
  const topics = [...new Set(seminars.flatMap(item => item.tags))].slice(0, 10);

  return (
    <main>
      <section className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16 lg:py-16">
          <div className="font-mono text-xs font-medium tracking-[0.12em]" style={{ color: 'var(--accent)' }}>OSS WORKBENCH / SPEAKING</div>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl" style={{ color: 'var(--text)' }}>
            {lang === 'en' ? 'Share what survived practice.' : '현장에서 검증된 것을 공유합니다.'}
          </h1>
          <p className="mt-5 max-w-5xl text-base leading-7 sm:text-lg" style={{ color: 'var(--text-muted)' }}>
            Cloud Native, Platform Engineering, K-PaaS, networking, service mesh and OSS lessons shared through seminars and communities.
          </p>
        </div>
      </section>

      {fallbackFeatured.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-16">
          <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>FEATURED TALKS</div>
          <div className="mt-4 space-y-3">
            {fallbackFeatured.map(seminar => (
              <Link key={seminar.slug} href={`${base}/seminars/${seminar.slug}`} className="group flex items-start justify-between gap-4 rounded-2xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <div className="min-w-0">
                  <div className="font-mono text-[10px]" style={{ color: 'var(--text-faint)' }}>{seminar.date} · {seminar.event}</div>
                  <h2 className="mt-2 text-lg font-semibold group-hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>{seminar.title}</h2>
                  <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{seminar.tags.slice(0, 5).join(' · ')}</p>
                </div>
                <ArrowUpRight className="mt-1 h-4 w-4 shrink-0" style={{ color: 'var(--text-faint)' }} />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="border-y" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-16">
          <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>TIMELINE / ARCHIVE</div>
          <div className="mt-4 space-y-3">
            {years.map(year => (
              <div key={year} className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <div className="font-mono text-[11px]" style={{ color: 'var(--accent)' }}>{year}</div>
                <div className="mt-3 space-y-2">
                  {grouped[year].map(seminar => (
                    <Link key={seminar.slug} href={`${base}/seminars/${seminar.slug}`} className="block rounded-xl px-2 py-2 transition-colors hover:bg-[var(--surface-hi)]">
                      <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{seminar.title}</div>
                      <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{seminar.event} · {seminar.date.slice(5)}</div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-16">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>TOPICS</div>
        <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{topics.join(' · ')}</p>
      </section>
    </main>
  );
}
