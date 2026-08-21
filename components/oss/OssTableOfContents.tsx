'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Item = { id: string; label: string; level: number };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
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
    <aside className="hidden border-l border-[#deded8] bg-[#fafaf7] lg:block">
      <div className="sticky top-[60px] max-h-[calc(100vh-60px)] overflow-y-auto px-5 py-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77776f]">{title}</div>
        <div className="mt-3 h-px bg-[#e8e8e1]" />
        <nav className="mt-4 space-y-1" aria-label={title}>
          {items.map((item) => (
            <Link key={item.id} href={`#${item.id}`} className={`block border-l-2 py-1.5 text-xs leading-5 transition ${item.level === 3 ? 'ml-3 border-transparent pl-3 text-[#8a8a82] hover:border-[#5b8c87] hover:text-[#34342f]' : 'border-transparent pl-3 text-[#5c5c55] hover:border-[#0f766e] hover:text-[#171717]'}`}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
