import Link from 'next/link';

type Props = {
  base: string;
  compact?: boolean;
};

type LabNode = {
  slug: string;
  label: string;
  role: string;
  tone: string;
};

const nodes: LabNode[] = [
  { slug: 'openforge', label: 'OpenForge', role: 'Standards', tone: 'var(--signal)' },
  { slug: 'kube-ready-box', label: 'kube-ready-box', role: 'Baseline', tone: 'var(--text-faint)' },
  { slug: 'narwhal', label: 'Narwhal', role: 'Platform', tone: 'var(--accent)' },
  { slug: 'narwhal-portal', label: 'Narwhal Portal', role: 'Experience', tone: 'var(--accent)' },
  { slug: 'ldapium', label: 'ldapium', role: 'Identity', tone: 'var(--accent)' },
  { slug: 'nfs-quota-agent', label: 'nfs-quota-agent', role: 'Storage', tone: 'var(--accent)' },
  { slug: 'beluga', label: 'Beluga', role: 'Data workload', tone: 'var(--accent)' },
  { slug: 'kubemetal', label: 'KubeMetal', role: 'AI / Edge', tone: 'var(--signal)' },
];

export function EngineeringLabMap({ base, compact = false }: Props) {
  const headingClass = compact
    ? 'mt-2 text-xl font-semibold tracking-[-0.035em]'
    : 'mt-2 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl';
  const gridClass = compact
    ? 'mt-6 grid grid-cols-2 gap-2 sm:gap-3'
    : 'mt-6 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4';

  return (
    <figure
      className="rounded-[28px] border p-4 sm:p-6"
      style={{
        borderColor: 'var(--border)',
        background: 'linear-gradient(145deg, var(--surface), var(--surface-hi))',
      }}
    >
      <figcaption className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] font-semibold tracking-[0.14em]" style={{ color: 'var(--accent)' }}>
            OPEN ENGINEERING LAB / SYSTEM MAP
          </div>
          <h2 className={headingClass} style={{ color: 'var(--text)' }}>
            Standards → Platform → Capabilities → Workloads
          </h2>
        </div>
        <div className="font-mono text-[9px] tracking-[0.1em]" style={{ color: 'var(--text-faint)' }}>
          BUILD · VERIFY · LEARN · SHARE
        </div>
      </figcaption>

      <div className={gridClass}>
        {nodes.map((node, index) => (
          <Link
            key={node.slug}
            href={`${base}/projects/${node.slug}`}
            className={`group relative overflow-hidden rounded-2xl border transition-transform hover:-translate-y-0.5 ${compact ? 'min-h-24 p-3' : 'min-h-28 p-4 sm:min-h-32'}`}
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <span className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: node.tone }} />
            <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ color: node.tone }}>
              {node.role}
            </div>
            <div className={`${compact ? 'mt-2 text-sm' : 'mt-3 text-base sm:text-lg'} font-semibold group-hover:text-[var(--accent)]`} style={{ color: 'var(--text)' }}>
              {node.label}
            </div>
            {!compact && (
              <div className="mt-4 font-mono text-[9px]" style={{ color: 'var(--text-faint)' }}>
                {String(index + 1).padStart(2, '0')} / 08
              </div>
            )}
          </Link>
        ))}
      </div>

      {!compact && (
        <div className="mt-5 grid gap-2 font-mono text-[9px] uppercase tracking-[0.08em] sm:grid-cols-5" style={{ color: 'var(--text-faint)' }}>
          <span>Standards</span>
          <span>Baseline</span>
          <span>Platform</span>
          <span>Capability</span>
          <span>Evidence / Workload</span>
        </div>
      )}
    </figure>
  );
}
