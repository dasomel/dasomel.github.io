type Evidence = { label: string; value: string; detail: string };

const EVIDENCE: Record<string, Evidence[]> = {
  narwhal: [
    { label: 'Integration', value: '35 apps', detail: 'GitOps-managed applications integrated into one reproducible IDP.' },
    { label: 'Regression', value: '51 checks', detail: 'CI regression checks derived from previously solved integration failures.' },
    { label: 'Live verification', value: '120+ / 49', detail: 'Cluster checks and SSO end-to-end checks are maintained separately.' },
    { label: 'Incident knowledge', value: '263', detail: 'Documented incidents are converted into discriminators and future upgrade gates.' },
  ],
  'narwhal-portal': [
    { label: 'Experience', value: 'Day-0 → Day-2', detail: 'Combines onboarding, catalog, platform operations, security, governance, and tools in one workbench.' },
    { label: 'Platform views', value: '10+ areas', detail: 'Dashboard, onboarding, catalog/apps, nodes, cost, security/compliance, governance, architecture, tools, and settings.' },
    { label: 'Delivery', value: 'Kaniko + Skaffold', detail: 'Supports in-cluster image builds and live development without requiring a local Docker daemon for the normal cluster workflow.' },
    { label: 'State boundary', value: 'Authoritative sources', detail: 'Reads platform state from Kubernetes, Argo CD, Keycloak, and other source systems instead of replacing them.' },
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
  clusterdeck: [
    { label: 'User model', value: 'Profile-first', detail: 'Keeps a stable environment identity while VM or cluster IP addresses change.' },
    { label: 'Access path', value: 'SSH + Bastion', detail: 'Orchestrates connectivity, public-key bootstrap, aliases, and ProxyJump with native OpenSSH behavior.' },
    { label: 'Kubernetes', value: 'kubeconfig sync', detail: 'Fetches remote kubeconfig, normalizes endpoint/context names, and stores per-Profile local configuration.' },
    { label: 'Verification', value: '3 layers', detail: 'Separates SSH, kubeconfig, and Kubernetes API connectivity so failures are visible at the correct boundary.' },
  ],
  ldapium: [
    { label: 'Upstream', value: 'OpenLDAP 2.6.14', detail: 'Builds the server image directly from the upstream source tarball instead of relying on an opaque legacy image.' },
    { label: 'Security default', value: 'No defaults', detail: 'Ships with no default admin password and no sample directory data.' },
    { label: 'Delivery', value: 'Image + UI + Helm', detail: 'Packages the server, optional management UI, Helm chart, Compose path, backup tooling, and offline bundle.' },
    { label: 'Supply chain', value: 'SBOM + provenance', detail: 'Release boundary includes checksums, SBOM, provenance, pinned actions/tools, and verification-oriented offline assets.' },
  ],
  'kube-ready-box': [
    { label: 'Ubuntu', value: '24.04 / 26.04', detail: 'Maintains conservative and latest-LTS node baselines for local Kubernetes environments.' },
    { label: 'Architecture', value: 'ARM64 / AMD64', detail: 'Targets Apple Silicon and x86 local development environments.' },
    { label: 'Filesystem', value: 'ext4 / XFS', detail: 'Separates general-purpose and quota/storage-oriented filesystem variants.' },
    { label: 'Boundary', value: 'OS readiness', detail: 'Prepares kernel, networking, storage prerequisites, time sync, and diagnostics without bundling Kubernetes itself.' },
  ],
  beluga: [
    { label: 'Data flow', value: 'CDC → BI', detail: 'Connects Kafka/Debezium, Flink, Iceberg, Trino, Superset, and Airflow across one reproducible environment.' },
    { label: 'Validation', value: '2 E2E paths', detail: 'Uses synthetic clickstream and PostgreSQL CDC scenarios to verify actual data movement across system boundaries.' },
    { label: 'Deployment', value: 'GitOps', detail: 'Uses Helm and Argo CD App-of-Apps as the deployment contract rather than one-off local installation steps.' },
    { label: 'Scale', value: '32GB+ host', detail: 'Documents realistic local resource requirements instead of presenting the full stack as a lightweight demo.' },
  ],
  'beluga-manager': [
    { label: 'Domain model', value: '4 domains', detail: 'Pipeline, Data Asset, Service, and Operations provide cross-system platform context.' },
    { label: 'Integration', value: 'Adapter-based', detail: 'Keeps Kafka, Flink, Iceberg, Trino, and Airflow authoritative while normalizing access behind adapters.' },
    { label: 'State model', value: '4 classes', detail: 'Separates authoritative state, short-lived cache, correlation index, and Beluga-owned metadata.' },
    { label: 'Maturity', value: 'Early / read-first', detail: 'Prioritizes discovery, correlation, health, and drill-down before broad destructive operations.' },
  ],
};

export function OssProjectEvidence({ slug, locale='ko' }: { slug:string; locale?:'ko'|'en' }) {
  const items=EVIDENCE[slug];
  if (!items) return null;
  const en=locale==='en';
  return <section className="mb-10"><div className="flex items-end justify-between gap-4"><div><div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color:'var(--accent)' }}>ENGINEERING EVIDENCE</div><h3 className="mt-2 text-2xl font-semibold tracking-tight">{en?'Show reviewable engineering evidence instead of relying on headline numbers.':'숫자보다 검증 가능한 근거를 보여줍니다.'}</h3></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{items.map((item)=><div key={item.label} className="rounded-2xl p-5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--text-faint)' }}>{item.label}</div><div className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</div><p className="mt-3 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{item.detail}</p></div>)}</div></section>;
}
