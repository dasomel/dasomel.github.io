'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Item = { id: string; label: string; level: number };

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^\p{Letter}\p{Number}\s-]/gu, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export default function OssTableOfContents({ contentId = 'oss-doc-content', title = 'On this page' }: { contentId?: string; title?: string }) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const root = document.getElementById(contentId);
      if (!root) return;
      const headings = Array.from(root.querySelectorAll<HTMLHeadingElement>('h2, h3'));
      const counts = new Map<string, number>();
      const nextItems: Item[] = headings.map((heading) => {
        const base = heading.id || slugify(heading.textContent || 'section') || 'section';
        const count = counts.get(base) ?? 0;
        counts.set(base, count + 1);
        const id = count === 0 ? base : `${base}-${count + 1}`;
        heading.id = id;
        return { id, label: heading.textContent?.trim() || 'Section', level: heading.tagName === 'H3' ? 3 : 2 };
      });
      setItems(nextItems);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [contentId]);

  if (!items.length) return null;

  return (
    <aside className="hidden lg:block" style={{ borderLeft: '1px solid var(--border)' }}>
      <div className="sticky top-[60px] max-h-[calc(100vh-60px)] overflow-y-auto px-5 py-8">
        <div className="text-[11px] font-mono font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>{title}</div>
        <div className="mt-3 h-px" style={{ backgroundColor: 'var(--border-soft)' }} />
        <nav className="mt-4 space-y-1" aria-label={title}>
          {items.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className="block rounded-md py-1.5 text-xs leading-5 transition hover:text-[var(--accent)] hover:bg-[var(--surface-hi)]"
              style={{
                marginLeft: item.level === 3 ? '0.75rem' : undefined,
                paddingLeft: '0.6rem',
                paddingRight: '0.6rem',
                color: item.level === 3 ? 'var(--text-faint)' : 'var(--text-muted)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
