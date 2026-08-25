'use client';

import { useEffect, useRef } from 'react';

type Locale = 'ko' | 'en';

const getScroller = () => document.querySelector<HTMLElement>('.oss-horizontal .deck-scroll');

export default function OssStoryMobileNav({ locale }: { locale: Locale }) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const move = (direction: -1 | 1) => {
    const scroller = getScroller();
    if (!scroller) return;
    scroller.scrollBy({ left: direction * scroller.clientWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      if (touch) { startX.current = touch.clientX; startY.current = touch.clientY; }
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (startX.current === null || startY.current === null) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;
      startX.current = null;
      startY.current = null;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      move(dx < 0 ? 1 : -1);
    };
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const en = locale === 'en';
  return <div className="oss-mobile-side-nav" aria-label={en ? 'Story navigation' : '스토리 이동'}>
    <button type="button" aria-label={en ? 'Previous slide' : '이전 슬라이드'} onClick={() => move(-1)}><span aria-hidden="true">‹</span></button>
    <button type="button" aria-label={en ? 'Next slide' : '다음 슬라이드'} onClick={() => move(1)}><span aria-hidden="true">›</span></button>
    <style jsx>{`.oss-mobile-side-nav{position:fixed;z-index:1000;inset:0;display:none;align-items:center;justify-content:space-between;padding:0 max(8px,env(safe-area-inset-right)) 0 max(8px,env(safe-area-inset-left));pointer-events:none}.oss-mobile-side-nav button{pointer-events:auto;width:48px;height:48px;border:1px solid color-mix(in srgb,var(--border) 90%,transparent);border-radius:999px;background:color-mix(in srgb,var(--surface) 94%,transparent);color:var(--text);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 8px 28px rgba(0,0,0,.16);display:grid;place-items:center;padding:0;font-size:30px;line-height:1;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.oss-mobile-side-nav button:active{transform:scale(.94)}@media(max-width:900px){.oss-mobile-side-nav{display:flex}}`}</style>
  </div>;
}
