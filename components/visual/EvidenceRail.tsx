type Item = { value: string; label: string; detail?: string };

export function EvidenceRail({ items, title = 'ENGINEERING EVIDENCE' }: { items: readonly Item[]; title?: string }) {
  return (
    <section className="border-y" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-16">
        <div className="font-mono text-[10px] font-semibold tracking-[0.13em]" style={{ color: 'var(--signal)' }}>{title}</div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(item => (
            <div key={`${item.value}-${item.label}`} className="border-l pl-4" style={{ borderColor: 'var(--border-strong)' }}>
              <div className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl" style={{ color: 'var(--text)' }}>{item.value}</div>
              <div className="mt-1 text-sm font-semibold" style={{ color: 'var(--text)' }}>{item.label}</div>
              {item.detail && <p className="mt-1 text-xs leading-5" style={{ color: 'var(--text-muted)' }}>{item.detail}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
