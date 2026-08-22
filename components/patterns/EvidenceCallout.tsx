import React from 'react';

interface EvidenceCalloutProps {
  title?: string;
  type?: 'hypothesis' | 'experiment' | 'evidence' | 'lesson';
  children: React.ReactNode;
}

const typeConfig = {
  hypothesis: { label: 'HYPOTHESIS', color: 'var(--signal)', border: 'var(--signal)' },
  experiment: { label: 'EXPERIMENT', color: 'var(--accent)', border: 'var(--accent)' },
  evidence: { label: 'VERIFIED EVIDENCE', color: 'var(--accent)', border: 'var(--accent)' },
  lesson: { label: 'LESSON LEARNED', color: 'var(--text-faint)', border: 'var(--border-hi)' },
};

export function EvidenceCallout({
  title,
  type = 'evidence',
  children,
}: EvidenceCalloutProps) {
  const config = typeConfig[type] || typeConfig.evidence;

  return (
    <aside
      className="my-6 overflow-hidden rounded-xl p-5 transition-all"
      style={{
        border: '1px solid var(--border)',
        borderLeft: `4px solid ${config.border}`,
        backgroundColor: 'var(--doc-panel-bg)',
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className="rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
          style={{
            backgroundColor: 'var(--surface-hi)',
            color: config.color,
            border: '1px solid var(--border)',
          }}
        >
          {config.label}
        </span>
        {title && (
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {title}
          </h4>
        )}
      </div>
      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {children}
      </div>
    </aside>
  );
}
