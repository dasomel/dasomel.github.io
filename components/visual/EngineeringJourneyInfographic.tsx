const stages = [
  ['FRAMEWORK', 'Reusable application foundations'],
  ['DEVOPS', 'Automation · CI/CD · delivery'],
  ['CLOUD NATIVE', 'Kubernetes · data · AI platforms'],
  ['PLATFORM ENGINEERING', 'Self-service · IDP · GitOps'],
  ['OSS + AI', 'Open source · teaching · assisted engineering'],
] as const;

export function EngineeringJourneyInfographic() {
  return (
    <figure className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="border-b px-5 py-4 sm:px-6" style={{ borderColor: 'var(--border)' }}>
        <div className="font-mono text-[10px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>ENGINEERING JOURNEY / SHIFT IN CONSTRAINTS</div>
        <h2 className="mt-2 text-xl font-semibold sm:text-2xl" style={{ color: 'var(--text)' }}>Framework → DevOps → Cloud Native → Platform Engineering → OSS + AI</h2>
      </div>
      <div className="grid gap-2 px-4 py-5 sm:px-6 lg:grid-cols-[repeat(9,minmax(0,1fr))] lg:items-stretch">
        {stages.map(([title, detail], index) => (
          <div key={title} className="contents">
            <div className="rounded-xl border p-4 lg:col-span-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
              <div className="font-mono text-[10px]" style={{ color: index % 3 === 0 ? 'var(--accent)' : index % 3 === 1 ? '#55b8db' : '#f0a35a' }}>{String(index + 1).padStart(2, '0')}</div>
              <div className="mt-2 text-sm font-semibold" style={{ color: 'var(--text)' }}>{title}</div>
              <div className="mt-1 text-xs leading-5" style={{ color: 'var(--text-muted)' }}>{detail}</div>
            </div>
            {index < stages.length - 1 && <div aria-hidden="true" className="flex items-center justify-center py-1 text-xl lg:col-span-1 lg:py-0" style={{ color: '#55b8db' }}><span className="lg:hidden">↓</span><span className="hidden lg:inline">→</span></div>}
          </div>
        ))}
      </div>
      <figcaption className="border-t px-5 py-3 text-xs leading-5 sm:px-6" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>The story is organized around how the engineering problem changed over time, not around a flat list of tools.</figcaption>
    </figure>
  );
}
