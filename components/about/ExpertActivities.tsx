'use client';

import { useState } from 'react';
import type { ExpertActivity } from '@/lib/data/about';

interface Props {
  activities: ExpertActivity[];
  labels: {
    all: string;
    advisory: string;
    review: string;
    mentoring: string;
  };
}

export function ExpertActivities({ activities, labels }: Props) {
  const [category, setCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: labels.all },
    { key: 'advisory', label: labels.advisory },
    { key: 'review', label: labels.review },
    { key: 'mentoring', label: labels.mentoring },
  ];

  const filtered = category === 'all'
    ? activities
    : activities.filter(a => a.category === category);

  const sorted = [...filtered].sort((a, b) => b.year - a.year);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all"
            style={{
              backgroundColor: category === cat.key ? 'var(--accent)' : 'transparent',
              color: category === cat.key ? '#fff' : 'var(--text-muted)',
              border: category === cat.key ? 'none' : '1px solid var(--border)',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {sorted.map((activity, i) => (
          <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg"
            style={{ border: '1px solid var(--border)' }}>
            <div>
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                ◆ {activity.title}
              </span>
              <span className="text-xs ml-2" style={{ color: 'var(--text-faint)' }}>
                {activity.org}
              </span>
            </div>
            <span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>
              {activity.year}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
