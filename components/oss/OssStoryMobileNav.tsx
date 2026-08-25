'use client';

import { useCallback, useEffect, useRef } from 'react';

type Locale = 'ko' | 'en';

const getScroller = () => document.querySelector<HTMLElement>('.oss-horizontal .deck-scroll');

export default function OssStoryMobileNav({ locale }: { locale: Locale }) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const activeGesture = useRef(false);

  const go = useCallback((direction: -1 | 1) => {
    const scroller = getScroller();
    if (!scroller) return;
    const width = scroller.clientWidth;
    if (!width) return;
    const index = Math.round(scroller.scrollLeft / width);
    const next = Math.max(0, Math.min(7, index + direction));
    scroller.scrollTo({ left: next * width, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const scroller = getScroller();
    if (!scroller) return;

    const onTouchStart = (event: TouchEvent) => {
      const target = event.target as Element | null;
      if (target?.closest('button, a, input, textarea, select')) {
        activeGesture.current = false;
        return;
      }
      const touch = event.touches[0];
      if (!touch) return;
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      activeGesture.current = true;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!activeGesture.current || startX.current === null || startY.current === null) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;
      startX.current = null;
      startY.current = null;
      activeGesture.current = false;
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      go(dx < 0 ? 1 : -1);
    };

    scroller.addEventListener('touchstart', onTouchStart, { passive: true });
    scroller.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      scroller.removeEventListener('touchstart', onTouchStart);
      scroller.removeEventListener('touchend', onTouchEnd);
    };
  }, [go]);

  const en = locale === 'en';
  return (
    <div className="oss-mobile-side-nav" aria-label={en ? 'Story navigation' : '스토리 이동'}>
      <button type="button" aria-label={en ? 'Previous slide' : '이전 슬라이드'} onClick={() => go(-1)}><span aria-hidden="true">‹</span></button>
      <button type="button" aria-label={en ? 'Next slide' : '다음 슬라이드'} onClick={() => go(1)}><span aria-hidden="true">›</span></button>
      <style jsx>{`.oss-mobile-side-nav{position:fixed;z-index:1100;inset:0;display:none;align-items:center;justify-content:space-between;padding:0 max(10px,env(safe-area-inset-right)) 0 max(10px,env(safe-area-inset-left));pointer-events:none}.oss-mobile-side-nav button{pointer-events:auto;width:52px;height:52px;border:1px solid color-mix(in srgb,var(--border) 90%,transparent);border-radius:999px;background:color-mix(in srgb,var(--surface) 94%,transparent);color:var(--text);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 8px 28px rgba(0,0,0,.16);display:grid;place-items:center;padding:0;font-size:30px;line-height:1;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.oss-mobile-side-nav button:active{transform:scale(.94)}@media(max-width:900px){.oss-mobile-side-nav{display:flex}}`}</style>
    </div>
  );
}
