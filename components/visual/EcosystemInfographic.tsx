import Link from 'next/link';

const items = [
  { slug: 'openforge', label: 'STANDARDS', title: 'OpenForge', detail: 'Engineering standards · CI · security · templates', tone: '#f0a35a' },
  { slug: 'narwhal', label: 'PLATFORM', title: 'Narwhal', detail: 'Kubernetes IDP · GitOps · SSO · observability', tone: 'var(--accent)' },
  { slug: 'beluga', label: 'DATA', title: 'Beluga', detail: 'Kafka · Flink · Iceberg · Trino · Airflow', tone: '#55b8db' },
  { slug: 'kubemetal', label: 'AI / EDGE', title: 'KubeMetal', detail: 'K3s control plane · macOS MLX compute', tone: '#f0a35a' },
] as const;

export function EcosystemInfographic({ base }: { base: string }) {
  return (
    <figure className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="border-b px-5 py-4 sm:px-6" style={{ borderColor: 'var(--border)' }}>
        <div className="font-mono text-[10px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>OSS ECOSYSTEM / RELATIONSHIP MAP</div>
        <h2 className="mt-2 text-xl font-semibold sm:text-2xl" style={{ color: 'var(--text)' }}>One workbench, different platform layers</h2>
      </div>
      <div className="grid gap-3 px-4 py-5 sm:px-6 lg:grid-cols-4 lg:gap-0">
        {items.map((item, index) => (
          <div key={item.slug} className="relative lg:px-2">
            <Link href={`${base}/projects/${item.slug}`} className="block h-full rounded-xl border p-4 transition-transform hover:-translate-y-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
              <div className="font-mono text-[10px] tracking-[0.08em]" style={{ color: item.tone }}>{item.label}</div>
              <div className="mt-2 text-lg font-semibold" style={{ color: 'var(--text)' }}>{item.title}</div>
              <div className="mt-2 text-xs leading-5" style={{ color: 'var(--text-muted)' }}>{item.detail}</div>
            </Link>
            {index < items.length - 1 && <div className="hidden lg:block absolute -right-1 top-1/2 -translate-y-1/2 z-10 text-lg" style={{ color: '#55b8db' }}>→</div>}
          </div>
        ))}
      </div>
      <div className="grid gap-2 border-t px-5 py-4 text-xs sm:grid-cols-3 sm:px-6" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
        <div><span className="font-semibold" style={{ color: 'var(--text)' }}>Supporting OSS</span><br />ldapium · nfs-quota-agent · kube-ready-box</div>
        <div><span className="font-semibold" style={{ color: 'var(--text)' }}>Common baseline</span><br />reproducibility · evidence · documentation</div>
        <div><span className="font-semibold" style={{ color: 'var(--text)' }}>Learning loop</span><br />incident → lesson → verification → standard</div>
      </div>
      <figcaption className="sr-only">OpenForge provides engineering standards, Narwhal covers platform engineering, Beluga covers data platforms, and KubeMetal covers local AI and edge MLOps, supported by smaller infrastructure projects.</figcaption>
    </figure>
  );
}
