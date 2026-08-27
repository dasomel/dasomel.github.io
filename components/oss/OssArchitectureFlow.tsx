import Link from 'next/link';

export function OssArchitectureFlow({ locale }: { locale: 'ko' | 'en' }) {
  const en = locale === 'en';
  const nodes = [
    { role: 'Standards', name: 'OpenForge', href: en ? '/oss/en/openforge/' : '/oss/openforge/', note: en ? 'engineering rules · supply chain · docs' : 'engineering 규칙 · supply chain · 문서' },
    { role: 'Baseline', name: 'kube-ready-box', href: en ? '/oss/en/kube-ready-box/' : '/oss/kube-ready-box/', note: en ? 'reproducible Kubernetes node baseline' : '재현 가능한 Kubernetes node baseline' },
    { role: 'Platform', name: 'Narwhal', href: en ? '/oss/en/narwhal/' : '/oss/narwhal/', note: en ? 'identity · delivery · network · observability' : 'identity · delivery · network · observability' },
    { role: 'Capabilities', name: 'ldapium · nfs-quota-agent', href: en ? '/oss/en/ldapium/' : '/oss/ldapium/', note: en ? 'identity and storage building blocks' : 'identity와 storage building block' },
    { role: 'Workloads', name: 'Beluga · KubeMetal', href: en ? '/oss/en/beluga/' : '/oss/beluga/', note: en ? 'data and AI/edge constraints' : 'data와 AI/edge workload 제약' },
  ];

  return (
    <div className="mt-8 grid gap-3 lg:grid-cols-5">
      {nodes.map((node, index) => (
        <div key={node.role} className="relative">
          <Link href={node.href} className="block h-full rounded-2xl p-5 transition hover:-translate-y-0.5" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface-hi)' }}>
            <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: index === 2 ? 'var(--accent)' : 'var(--text-faint)' }}>{String(index + 1).padStart(2, '0')} / {node.role}</div>
            <div className="mt-3 text-lg font-semibold">{node.name}</div>
            <div className="mt-2 text-xs leading-5" style={{ color: 'var(--text-muted)' }}>{node.note}</div>
          </Link>
          {index < nodes.length - 1 && <div aria-hidden="true" className="py-1 text-center font-mono text-xs lg:absolute lg:-right-3 lg:top-1/2 lg:z-10 lg:-translate-y-1/2 lg:py-0" style={{ color: 'var(--accent)' }}>→</div>}
        </div>
      ))}
    </div>
  );
}
