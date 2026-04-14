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
        border: '1px solid var(--accent)',
        background: 'linear-gradient(135deg, var(--bg-subtle), var(--bg))',
      }}
    >
      {badge && (
        <span
          className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-3"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
        >
          {badge}
        </span>
      )}
      {children}
    </div>
  );
}
