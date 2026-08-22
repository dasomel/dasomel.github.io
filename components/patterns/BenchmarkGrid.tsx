import React from 'react';

interface MetricItem {
  label: string;
  before: string;
  after: string;
  diff: string;
  isPositive?: boolean;
}

interface BenchmarkGridProps {
  title?: string;
  metrics: MetricItem[];
}

export function BenchmarkGrid({ title, metrics }: BenchmarkGridProps) {
  return (
    <div
      className="my-6 overflow-hidden rounded-xl p-5"
      style={{
        border: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
      }}
    >
      {title && (
        <h4 className="mb-4 text-sm font-bold tracking-tight" style={{ color: 'var(--text)' }}>
          {title}
        </h4>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="rounded-lg p-3.5"
            style={{
              border: '1px solid var(--border-soft)',
              backgroundColor: 'var(--surface-hi)',
            }}
          >
            <div className="text-xs font-mono font-medium" style={{ color: 'var(--text-faint)' }}>
              {metric.label}
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {metric.after}
              </div>
              <div className="text-xs line-through" style={{ color: 'var(--text-faint)' }}>
                {metric.before}
              </div>
            </div>
            <div
              className="mt-1.5 inline-block text-[11px] font-mono font-bold"
              style={{
                color: metric.isPositive !== false ? 'var(--accent)' : 'var(--signal)',
              }}
            >
              {metric.diff}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
