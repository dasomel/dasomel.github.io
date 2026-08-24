'use client';

import { useCallback } from 'react';

type Locale = 'ko' | 'en';

export default function OssStoryMobileNav({ locale }: { locale: Locale }) {
  const clickExisting = useCallback((direction: 'prev' | 'next') => {
    const buttons = document.querySelectorAll<HTMLButtonElement>('.oss-horizontal .deck-nav button');
    const button = buttons[direction === 'prev' ? 0 : 1];
    button?.click();
  }, []);

  const en = locale === 'en';

  return (
    <div className="oss-mobile-side-nav" aria-label={en ? 'Story navigation' : '스토리 이동'}>
      <button type="button" aria-label={en ? 'Previous slide' : '이전 슬라이드'} onClick={() => clickExisting('prev')}>
        <span aria-hidden="true">‹</span>
      </button>
      <button type="button" aria-label={en ? 'Next slide' : '다음 슬라이드'} onClick={() => clickExisting('next')}>
        <span aria-hidden="true">›</span>
      </button>
      <style jsx>{`
        .oss-mobile-side-nav {
          position: fixed;
          z-index: 1000;
          inset: 0;
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 0 max(8px, env(safe-area-inset-right)) 0 max(8px, env(safe-area-inset-left));
          pointer-events: none;
        }
        .oss-mobile-side-nav button {
          pointer-events: auto;
          width: 48px;
          height: 48px;
          border: 1px solid color-mix(in srgb, var(--border) 90%, transparent);
          border-radius: 999px;
          background: color-mix(in srgb, var(--surface) 94%, transparent);
          color: var(--text);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 8px 28px rgba(0, 0, 0, .16);
          display: grid;
          place-items: center;
          font-size: 30px;
          line-height: 1;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .oss-mobile-side-nav button:active { transform: scale(.94); }
        @media (max-width: 900px) { .oss-mobile-side-nav { display: flex; } }
      `}</style>
    </div>
  );
}
