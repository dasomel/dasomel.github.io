import Link from 'next/link';

type Props = { base: string; compact?: boolean };
type Layer = { role: string; tone: string; nodes: { slug: string; label: string; detail: string }[] };

const layers: Layer[] = [
  { role: 'STANDARDS', tone: 'var(--signal)', nodes: [{ slug: 'openforge', label: 'OpenForge', detail: 'Repository rules · CI/CD · security · docs · release' }] },
  { role: 'BASELINE', tone: 'var(--accent-2)', nodes: [{ slug: 'kube-ready-box', label: 'kube-ready-box', detail: 'Reproducible Kubernetes lab foundation' }] },
  { role: 'PLATFORM', tone: 'var(--accent)', nodes: [{ slug: 'narwhal', label: 'Narwhal', detail: 'IDP · GitOps · SSO · network · observability' }, { slug: 'narwhal-portal', label: 'Narwhal Portal', detail: 'Developer-facing platform experience' }] },
  { role: 'CAPABILITIES', tone: 'var(--accent-2)', nodes: [{ slug: 'ldapium', label: 'ldapium', detail: 'Identity capability' }, { slug: 'nfs-quota-agent', label: 'nfs-quota-agent', detail: 'Storage quota capability' }] },
  { role: 'WORKLOADS', tone: 'var(--signal)', nodes: [{ slug: 'beluga', label: 'Beluga', detail: 'Data platform workload' }, { slug: 'kubemetal', label: 'KubeMetal', detail: 'AI / Edge workload' }] },
];

export function EngineeringLabMap({ base, compact = false }: Props) {
  return (
    <figure className="rounded-[28px] border p-4 sm:p-6" style={{ borderColor: 'var(--border)', background: 'linear-gradient(145deg,var(--surface),var(--surface-hi))' }}>
      <figcaption className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] font-semibold tracking-[0.14em]" style={{ color: 'var(--accent)' }}>OPEN ENGINEERING LAB / LIVING SYSTEM MAP</div>
          <h2 className={`${compact ? 'text-xl' : 'text-2xl sm:text-3xl'} mt-2 font-semibold tracking-[-0.04em]`} style={{ color: 'var(--text)' }}>Standards → Baseline → Platform → Capabilities → Workloads</h2>
        </div>
        <div className="font-mono text-[9px] tracking-[0.1em]" style={{ color: 'var(--text-faint)' }}>BUILD · VERIFY · LEARN · SHARE</div>
      </figcaption>

      <div className={`${compact ? 'mt-5' : 'mt-7'} space-y-2 sm:space-y-3`}>
        {layers.map((layer, index) => (
          <div key={layer.role}>
            <div className="grid gap-2 sm:grid-cols-[110px_1fr] sm:items-stretch">
              <div className="flex items-center font-mono text-[9px] font-semibold tracking-[0.12em]" style={{ color: layer.tone }}>{layer.role}</div>
              <div className={`grid gap-2 ${layer.nodes.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                {layer.nodes.map(node => (
                  <Link key={node.slug} href={`${base}/projects/${node.slug}`} className={`group rounded-2xl border ${compact ? 'p-3' : 'p-4'} transition-colors hover:bg-[var(--surface-hi)]`} style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className={`${compact ? 'text-sm' : 'text-base sm:text-lg'} font-semibold group-hover:text-[var(--accent)]`} style={{ color: 'var(--text)' }}>{node.label}</div>
                        {!compact && <p className="mt-1 text-xs leading-5" style={{ color: 'var(--text-muted)' }}>{node.detail}</p>}
                      </div>
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: layer.tone }} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {index < layers.length - 1 && <div className="ml-[53px] h-5 border-l sm:ml-[164px]" style={{ borderColor: 'var(--border-strong)' }} aria-hidden="true" />}
          </div>
        ))}
      </div>
      {!compact && <p className="mt-6 max-w-4xl text-xs leading-5" style={{ color: 'var(--text-faint)' }}>The map is intentionally read top-to-bottom on mobile: engineering rules create a reproducible baseline, the platform integrates shared capabilities, and workloads expose the seams that need verification.</p>}
    </figure>
  );
}
