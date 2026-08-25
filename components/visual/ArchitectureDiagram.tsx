type Tone = 'mint' | 'cyan' | 'orange';

type NodeSpec = {
  title: string;
  detail: string;
  tone?: Tone;
};

type DiagramSpec = {
  title: string;
  caption: string;
  nodes: NodeSpec[];
};

const diagrams: Record<string, DiagramSpec> = {
  narwhal: {
    title: 'Narwhal Internal Developer Platform',
    caption: 'Developer access flows through gateway and identity into GitOps-managed Kubernetes, with platform services operated as one integrated system.',
    nodes: [
      { title: 'Developer / Operator', detail: 'Portal · service access', tone: 'mint' },
      { title: 'APISIX + Keycloak', detail: 'Gateway · OIDC · SSO', tone: 'cyan' },
      { title: 'Argo CD + Gitea', detail: 'GitOps app-of-apps', tone: 'orange' },
      { title: 'Kubernetes HA', detail: 'Cilium · Istio ambient · kube-vip', tone: 'mint' },
      { title: 'Platform Services', detail: 'Observability · storage · backup · policy', tone: 'cyan' },
    ],
  },
  kubemetal: {
    title: 'KubeMetal Control / Compute Separation',
    caption: 'Kubernetes owns the MLOps control plane while Metal GPU workloads run directly on macOS because Apple Silicon GPU passthrough is not available to the Linux VM.',
    nodes: [
      { title: 'Tauri Desktop', detail: 'React UI · Rust backend', tone: 'mint' },
      { title: 'Colima / K3s', detail: 'MLOps control plane', tone: 'cyan' },
      { title: 'MLflow + SeaweedFS', detail: 'Tracking · registry · artifacts', tone: 'orange' },
      { title: 'macOS Host MLX', detail: 'LoRA fine-tuning · serving · Metal GPU', tone: 'mint' },
    ],
  },
  beluga: {
    title: 'Beluga Data Platform Pipeline',
    caption: 'A GitOps-deployed data platform from streaming and CDC ingestion through stream processing and Iceberg storage to query, BI, and orchestration.',
    nodes: [
      { title: 'Kafka + Debezium', detail: 'Events · CDC', tone: 'mint' },
      { title: 'Flink', detail: 'Stream processing', tone: 'cyan' },
      { title: 'Iceberg + Lakekeeper', detail: 'Lakehouse · REST catalog', tone: 'orange' },
      { title: 'Trino + Superset', detail: 'Distributed SQL · BI', tone: 'mint' },
      { title: 'Airflow', detail: 'Orchestration', tone: 'cyan' },
    ],
  },
  'nfs-quota-agent': {
    title: 'NFS Quota Enforcement Flow',
    caption: 'PVC capacity becomes a real filesystem quota by watching NFS PersistentVolumes and applying the appropriate quota mechanism on the NFS server node.',
    nodes: [
      { title: 'PVC / PV', detail: 'Requested storage capacity', tone: 'mint' },
      { title: 'Agent DaemonSet', detail: 'Watches NFS PersistentVolumes', tone: 'cyan' },
      { title: 'Quota Adapter', detail: 'XFS · ext4 · Btrfs', tone: 'orange' },
      { title: 'Filesystem', detail: 'Project / qgroup quota enforced', tone: 'mint' },
      { title: 'Metrics / UI', detail: 'Annotations · Prometheus · dashboard', tone: 'cyan' },
    ],
  },
  openforge: {
    title: 'OpenForge OSS Lifecycle',
    caption: 'The blueprint turns repeated OSS engineering work into a lifecycle: bootstrap, standards, verification, release, operations, and learning back into the baseline.',
    nodes: [
      { title: 'Idea', detail: 'Project definition', tone: 'mint' },
      { title: 'Bootstrap', detail: 'Repository · docs · architecture', tone: 'cyan' },
      { title: 'Standards', detail: 'CI · security · templates', tone: 'orange' },
      { title: 'Release', detail: 'Verification · publish', tone: 'mint' },
      { title: 'Learning Loop', detail: 'Operations → lessons → metrics', tone: 'cyan' },
    ],
  },
};

const toneColor: Record<Tone, string> = {
  mint: 'var(--accent)',
  cyan: '#55b8db',
  orange: '#f0a35a',
};

export function ArchitectureDiagram({ slug }: { slug: string }) {
  const diagram = diagrams[slug];
  if (!diagram) return null;

  return (
    <figure className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="border-b px-5 py-4 sm:px-6" style={{ borderColor: 'var(--border)' }}>
        <div className="font-mono text-[10px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>ARCHITECTURE / HOW IT WORKS</div>
        <h2 className="mt-2 text-xl font-semibold sm:text-2xl" style={{ color: 'var(--text)' }}>{diagram.title}</h2>
      </div>
      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <div className="grid gap-2 lg:grid-cols-[repeat(9,minmax(0,1fr))] lg:items-stretch">
          {diagram.nodes.map((node, index) => (
            <div key={node.title} className="contents">
              <div className="rounded-xl border p-4 lg:col-span-1 lg:min-w-0" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
                <div className="font-mono text-[10px] tracking-[0.06em]" style={{ color: toneColor[node.tone ?? 'mint'] }}>{String(index + 1).padStart(2, '0')}</div>
                <div className="mt-2 text-sm font-semibold" style={{ color: 'var(--text)' }}>{node.title}</div>
                <div className="mt-1 text-xs leading-5" style={{ color: 'var(--text-muted)' }}>{node.detail}</div>
              </div>
              {index < diagram.nodes.length - 1 && (
                <div aria-hidden="true" className="flex items-center justify-center py-1 text-xl lg:col-span-1 lg:py-0" style={{ color: '#55b8db' }}>
                  <span className="lg:hidden">↓</span><span className="hidden lg:inline">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="border-t px-5 py-3 text-xs leading-5 sm:px-6" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>{diagram.caption}</figcaption>
    </figure>
  );
}
