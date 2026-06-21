import { getTranslations } from 'next-intl/server';
import { getSeoulEvents } from '@/lib/content';
import { routing } from '@/i18n/routing';
import type { SeoulEvent } from '@/lib/types';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'events' });
  return { title: t('title') };
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 text-xs rounded-full font-medium"
      style={{ backgroundColor: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
    >
      {category}
    </span>
  );
}

function FreeBadge({ isFree, freeLabel, paidLabel }: { isFree: boolean; freeLabel: string; paidLabel: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 text-xs rounded-full font-medium"
      style={{
        backgroundColor: isFree ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.1)',
        color: isFree ? 'rgb(22,163,74)' : 'rgb(234,88,12)',
      }}
    >
      {isFree ? freeLabel : paidLabel}
    </span>
  );
}

function EventCard({ event, freeLabel, paidLabel }: { event: SeoulEvent; freeLabel: string; paidLabel: string }) {
  return (
    <a
      href={event.link || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl p-5 transition-all hover:scale-[1.01]"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {event.imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9', backgroundColor: 'var(--bg-subtle)' }}>
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: 'var(--text)' }}>
          {event.title}
        </h3>
        <FreeBadge isFree={event.isFree} freeLabel={freeLabel} paidLabel={paidLabel} />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <CategoryBadge category={event.category} />
        {event.thema && event.thema !== event.category && (
          <CategoryBadge category={event.thema} />
        )}
      </div>
      <div className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
        <div>{event.place}{event.guName ? ` · ${event.guName}` : ''}</div>
        <div>{event.dateRange}</div>
        {event.organizer && <div>{event.organizer}</div>}
      </div>
    </a>
  );
}

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'events' });
  const { updatedAt, events } = getSeoulEvents();

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter(e => e.endDate >= today);
  const past = events.filter(e => e.endDate < today).slice(0, 10);

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
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{t('upcoming')}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-muted)' }}>
              {upcoming.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {upcoming.map(event => (
              <EventCard key={event.id} event={event} freeLabel={t('free')} paidLabel={t('paid')} />
            ))}
          </div>
        </>
      )}

      {past.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4 mt-8">
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{t('past')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
            {past.map(event => (
              <EventCard key={event.id} event={event} freeLabel={t('free')} paidLabel={t('paid')} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
