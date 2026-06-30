import { getTranslations } from 'next-intl/server';
import { getSeoulEvents } from '@/lib/content';
import { routing } from '@/i18n/routing';
import EventsBrowser from './EventsBrowser';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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

  // 일정이 끝난 행사는 제외 — 진행 중·예정만 노출
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter(e => !e.endDate || e.endDate >= today);

  const updatedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 slide-enter-content">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          {t('title')}
        </h1>
        <p className="text-base mb-1" style={{ color: 'var(--text-muted)' }}>
          {t('subtitle')}
        </p>
        {updatedDate && (
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            {t('updated_at', { date: updatedDate })}
          </p>
        )}
      </div>

      {upcoming.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
          <p className="text-lg mb-2">{t('no_events')}</p>
          <p className="text-sm">{t('no_events_desc')}</p>
        </div>
      ) : (
        <EventsBrowser events={upcoming} />
      )}
    </div>
  );
}
