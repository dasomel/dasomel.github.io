'use client';
import { useEffect, useState } from 'react';

interface Heading { id: string; text: string; level: number; }

export default function TOC() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState('');

  useEffect(() => {
    const els = document.querySelectorAll('article h2, article h3');
    // The TOC is derived from the rendered article DOM; this state update is intentionally
    // performed after mount because the headings do not exist during server rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(
      Array.from(els)
        .map((el, i) => ({
          id: el.id || `heading-${i}`,
          text: el.textContent ?? '',
          level: parseInt(el.tagName[1]),
        }))
        .filter(h => h.text.trim())
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (!headings.length) return null;

  return (
    <aside className="w-48 flex-shrink-0 hidden xl:block">
      <div className="sticky top-20">
        <p className="font-mono text-[11px] font-bold mb-3 uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>목차</p>
        <nav className="space-y-1">
          {headings.map(h => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`block text-xs py-1.5 px-2 rounded-md transition-all hover:text-[var(--accent)] hover:bg-[var(--surface-hi)] ${h.level === 3 ? 'ml-2' : ''}`}
              style={{
                color: active === h.id ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: active === h.id ? 600 : 400,
                backgroundColor: active === h.id ? 'var(--accent-dim)' : 'transparent',
              }}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
