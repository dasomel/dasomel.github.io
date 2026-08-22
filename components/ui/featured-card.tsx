import { ReactNode } from 'react';

interface FeaturedCardProps {
  badge?: string;
  children: ReactNode;
}

export function FeaturedCard({ badge, children }: FeaturedCardProps) {
  return (
    <div
      className="rounded-xl p-5 mb-6"
      style={{
        border: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
      }}
    >
      {badge && (
        <span
          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-medium mb-3"
          style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-glow)' }}
        >
          {badge}
        </span>
      )}
      {children}
    </div>
  );
}
