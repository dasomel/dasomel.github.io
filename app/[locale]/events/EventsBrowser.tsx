'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import type { SeoulEvent } from '@/lib/types';

const PAGE = 24;
const STEP = 30;

type Tab = 'all' | 'seoul' | 'festival';

function isFestival(e: SeoulEvent) {
  return e.id.startsWith('tour-');
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

function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 text-sm rounded-lg font-medium transition-colors flex items-center gap-1.5"
      style={{
        backgroundColor: active ? 'var(--text)' : 'var(--surface)',
        color: active ? 'var(--bg)' : 'var(--text-muted)',
        border: '1px solid var(--border)',
      }}
    >
      {label}
      <span className="text-xs font-mono opacity-70">{count}</span>
    </button>
  );
}

export default function EventsBrowser({ events }: { events: SeoulEvent[] }) {
  const t = useTranslations('events');
  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [freeOnly, setFreeOnly] = useState(false);
  const [visible, setVisible] = useState(PAGE);

  const counts = useMemo(() => {
    const festival = events.filter(isFestival).length;
    return { all: events.length, seoul: events.length - festival, festival };
  }, [events]);

  const byTab = useMemo(() => {
    if (tab === 'seoul') return events.filter(e => !isFestival(e));
    if (tab === 'festival') return events.filter(isFestival);
    return events;
  }, [events, tab]);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of byTab) {
      const c = e.category || '기타';
      map.set(c, (map.get(c) || 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c);
  }, [byTab]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return byTab.filter(e => {
      if (freeOnly && !e.isFree) return false;
      if (category !== 'all' && (e.category || '기타') !== category) return false;
      if (q && !`${e.title} ${e.place} ${e.guName}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [byTab, category, query, freeOnly]);

  // 탭이 바뀌면 분류 필터 초기화 (이전 탭의 분류가 빈 결과를 만들지 않도록)
  useEffect(() => { setCategory('all'); }, [tab]);
  // 필터가 바뀌면 노출 개수 초기화
  useEffect(() => { setVisible(PAGE); }, [tab, query, category, freeOnly]);

  // 무한 스크롤 — 센티넬이 보이면 다음 묶음 로드
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (visible >= filtered.length) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisible(v => v + STEP); },
      { rootMargin: '600px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, filtered.length]);

  const shown = filtered.slice(0, visible);
  const freeLabel = t('free');
  const paidLabel = t('paid');

  return (
    <div>
      {/* 출처별 탭 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <TabButton active={tab === 'all'} onClick={() => setTab('all')} label={t('tab_all')} count={counts.all} />
        <TabButton active={tab === 'seoul'} onClick={() => setTab('seoul')} label={t('tab_seoul')} count={counts.seoul} />
        <TabButton active={tab === 'festival'} onClick={() => setTab('festival')} label={t('tab_festival')} count={counts.festival} />
        <button
          type="button"
          onClick={() => setFreeOnly(v => !v)}
          aria-pressed={freeOnly}
          className="px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ml-auto"
          style={{
            backgroundColor: freeOnly ? 'rgb(22,163,74)' : 'var(--surface)',
            color: freeOnly ? '#fff' : 'var(--text-muted)',
            border: `1px solid ${freeOnly ? 'rgb(22,163,74)' : 'var(--border)'}`,
          }}
        >
          {freeOnly ? '✓ ' : ''}{t('free_only')}
        </button>
      </div>

      {/* 검색 */}
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={t('search_placeholder')}
        className="w-full px-4 py-2.5 mb-3 text-sm rounded-lg outline-none"
        style={{ backgroundColor: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
      />

      {/* 카테고리 칩 */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className="px-2.5 py-1 text-xs rounded-full font-medium transition-colors"
            style={{
              backgroundColor: category === 'all' ? 'var(--text)' : 'var(--surface)',
              color: category === 'all' ? 'var(--bg)' : 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}
          >
            {t('category_all')}
          </button>
          {categories.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className="px-2.5 py-1 text-xs rounded-full font-medium transition-colors"
              style={{
                backgroundColor: category === c ? 'var(--text)' : 'var(--surface)',
                color: category === c ? 'var(--bg)' : 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* 결과 수 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-muted)' }}>
          {filtered.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
          <p className="text-sm">{t('no_result')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shown.map(event => (
              <EventCard key={event.id} event={event} freeLabel={freeLabel} paidLabel={paidLabel} />
            ))}
          </div>
          {filtered.length > visible && (
            <div ref={sentinelRef} className="h-10 flex justify-center items-center mt-6 text-xs" style={{ color: 'var(--text-muted)' }}>
              {t('loading_more', { n: filtered.length - visible })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
