'use client';
import { useEffect, useState } from 'react';

interface Heading { id: string; text: string; level: number; }

export default function TOC() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState('');

  useEffect(() => {
    const els = document.querySelectorAll('article h2, article h3');
    setHeadings(Array.from(els).map(el => ({
      id: el.id,
      text: el.textContent ?? '',
      level: parseInt(el.tagName[1]),
    })));

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
        <p className="font-mono text-xs text-gray-400 mb-3 uppercase tracking-wider">목차</p>
        <nav className="space-y-1">
          {headings.map(h => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`block text-xs py-0.5 transition-colors ${h.level === 3 ? 'pl-3' : ''} ${
                active === h.id ? 'text-emerald-600 font-medium' : 'text-gray-400 hover:text-emerald-600'
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
