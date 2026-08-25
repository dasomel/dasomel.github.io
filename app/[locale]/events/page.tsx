import { getTranslations } from 'next-intl/server';
import { getSeoulEvents } from '@/lib/content';
import { routing } from '@/i18n/routing';
import EventsBrowser from './EventsBrowser';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'events' });
  return { title: t('title') };
}

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'events' });
  const { updatedAt, events } = getSeoulEvents();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter(event => !event.endDate || event.endDate >= today);
  const snapshot = updatedAt ? new Date(updatedAt).toISOString().slice(0, 10) : null;

  return (
    <main>
      <section className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16 lg:py-16">
          <div className="font-mono text-xs font-medium tracking-[0.12em]" style={{ color: 'var(--accent)' }}>EVENTS / CURATED DATA</div>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl" style={{ color: 'var(--text)' }}>
            {locale === 'en' ? 'Events and schedules available now.' : '지금 볼 수 있는 행사와 일정.'}
          </h1>
          <p className="mt-5 max-w-5xl text-base leading-7 sm:text-lg" style={{ color: 'var(--text-muted)' }}>
            Repository-generated events data is refreshed by automation.{snapshot ? ` Current data snapshot: ${snapshot}.` : ''}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-16">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>ONGOING / UPCOMING</div>
        <div className="mt-5">
          {upcoming.length === 0 ? (
            <div className="rounded-2xl border px-5 py-16 text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-muted)' }}>
              <p className="text-lg">{t('no_events')}</p>
              <p className="mt-2 text-sm">{t('no_events_desc')}</p>
            </div>
          ) : (
            <EventsBrowser events={upcoming} />
          )}
        </div>
      </section>

      <section className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-16">
          <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>DATA NOTE</div>
          <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
            {locale === 'en' ? 'Ended events are excluded; only ongoing and upcoming schedules are shown.' : '화면에서는 종료된 행사를 제외하고 진행 중·예정 일정만 노출합니다.'}
          </p>
        </div>
      </section>
    </main>
  );
}
