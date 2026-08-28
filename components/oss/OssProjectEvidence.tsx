type Evidence = { label: string; value: string; detail: string };

const EVIDENCE: Record<string, Evidence[]> = {
  narwhal: [
    { label: 'Integration', value: '35 apps', detail: 'GitOps-managed applications integrated into one reproducible IDP.' },
    { label: 'Regression', value: '51 checks', detail: 'CI regression checks derived from previously solved integration failures.' },
    { label: 'Live verification', value: '120+ / 49', detail: 'Cluster checks and SSO end-to-end checks are maintained separately.' },
    { label: 'Incident knowledge', value: '263', detail: 'Documented incidents are converted into discriminators and future upgrade gates.' },
  ],
  'nfs-quota-agent': [
    { label: 'Storage boundary', value: 'PV → FS', detail: 'Maps Kubernetes PersistentVolumes to the actual NFS server filesystem quota boundary.' },
    { label: 'Filesystem', value: '3 types', detail: 'Supports XFS project quota, ext4 project quota, and Btrfs qgroup-based enforcement.' },
    { label: 'Deployment', value: 'DaemonSet', detail: 'Runs on NFS server nodes because quota commands must execute against the local filesystem.' },
    { label: 'Operations', value: 'Observable', detail: 'Exposes quota state through PV annotations, Prometheus metrics, alerts, audit/history, and optional UI.' },
  ],
  kubemetal: [
    { label: 'Architecture', value: 'Split plane', detail: 'Kubernetes/Colima hosts control-plane services while macOS runs Metal/MLX compute.' },
    { label: 'Workspace', value: '8 tabs', detail: 'Dashboard, kagent Ops, Pipeline, Model Hub, MLX Studio, Data, Access Console, and Air-Gap Management.' },
    { label: 'External cluster', value: 'Agent-first', detail: 'Default integration observes and diagnoses existing clusters rather than re-provisioning them.' },
    { label: 'Measured baseline', value: '196–198 tok/s', detail: 'Documented Apple M4 Pro packaged-app VLM serving baseline; presented as a reference, not a guarantee.' },
  ],
  openforge: [
    { label: 'Standards', value: '29', detail: 'Detailed engineering standards spanning repository, CI/CD, security, supply chain, release, and governance.' },
    { label: 'Reusable scope', value: '15 areas', detail: 'Implementation templates cover recurring OSS engineering and delivery concerns.' },
    { label: 'Operating model', value: '3 tiers', detail: 'Separates policy (Standards), implementation (Templates), and evidence (Reference Implementation).' },
    { label: 'Feedback loop', value: 'Closed loop', detail: 'Standard → Apply → Measure → Learn → Improve → Standardize.' },
  ],
};

export function OssProjectEvidence({ slug }: { slug: string }) {
  const items = EVIDENCE[slug];
  if (!items) return null;
  return <section className="mb-10"><div className="flex items-end justify-between gap-4"><div><div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color:'var(--accent)' }}>ENGINEERING EVIDENCE</div><h3 className="mt-2 text-2xl font-semibold tracking-tight">숫자보다 검증 가능한 근거를 보여줍니다.</h3></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{items.map((item)=><div key={item.label} className="rounded-2xl p-5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--text-faint)' }}>{item.label}</div><div className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</div><p className="mt-3 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{item.detail}</p></div>)}</div></section>;
}
