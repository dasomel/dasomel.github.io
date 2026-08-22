import React from 'react';
import Link from 'next/link';

interface DigestCardProps {
  category: string;
  title: string;
  summary: string;
  sourceUrl?: string;
  sourceLabel?: string;
  tags?: string[];
}

export function DigestCard({
  category,
  title,
  summary,
  sourceUrl,
  sourceLabel,
  tags = [],
}: DigestCardProps) {
  return (
    <article
      className="my-5 rounded-xl p-5 transition-all hover:bg-[var(--surface-hi)]"
      style={{
        border: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
          style={{
            backgroundColor: 'var(--accent-dim)',
            color: 'var(--accent)',
            border: '1px solid var(--accent-glow)',
          }}
        >
          {category}
        </span>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono font-medium transition hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            {sourceLabel || 'Source'} ↗
          </a>
        )}
      </div>
      <h4 className="mb-2 text-base font-semibold" style={{ color: 'var(--text)' }}>
        {title}
      </h4>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {summary}
      </p>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded px-2 py-0.5 font-mono text-[10px]"
              style={{
                backgroundColor: 'var(--surface-hi)',
                color: 'var(--text-faint)',
                border: '1px solid var(--border-soft)',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
