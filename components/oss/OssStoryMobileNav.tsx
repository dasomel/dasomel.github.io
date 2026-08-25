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
    const left = next * width;
    scroller.scrollLeft = left;
    scroller.scrollTo({ left, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const scroller = getScroller();
    if (!scroller) return;
    const onTouchStart = (event: TouchEvent) => {
      const target = event.target as Element | null;
      if (target?.closest('button, a, input, textarea, select')) { activeGesture.current = false; return; }
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

  // Mobile navigation is gesture-first. Keep the component mounted for swipe handling,
  // but render no visible controls so the story content remains unobstructed.
  void locale;
  return null;
}
