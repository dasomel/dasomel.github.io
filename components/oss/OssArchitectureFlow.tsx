import Link from 'next/link';

export function OssArchitectureFlow({ locale }: { locale: 'ko' | 'en' }) {
  const en = locale === 'en';
  const prefix = en ? '/oss/en' : '/oss';
  const layers = [
    { role:'Engineering', name:'OpenForge', href:`${prefix}/openforge/`, note:en?'standards · supply chain · documentation':'standards · supply chain · documentation' },
    { role:'Node & Access', name:'Kube-Ready-Box · ClusterDeck', href:`${prefix}/kube-ready-box/`, note:en?'reproducible nodes + workstation access':'재현 가능한 node + workstation access' },
    { role:'Platform', name:'Narwhal · Narwhal Portal', href:`${prefix}/narwhal/`, note:en?'platform runtime + developer/operator experience':'platform runtime + developer/operator experience' },
    { role:'Reusable Infra', name:'NFS Quota Agent · ldapium', href:`${prefix}/nfs-quota-agent/`, note:en?'storage enforcement + identity infrastructure':'storage enforcement + identity infrastructure' },
    { role:'Data', name:'Beluga · Beluga Manager', href:`${prefix}/beluga/`, note:en?'reference data platform + control plane':'reference data platform + control plane' },
    { role:'AI / Edge', name:'KubeMetal', href:`${prefix}/kubemetal/`, note:en?'Apple Silicon compute + Kubernetes control':'Apple Silicon compute + Kubernetes control' },
  ];

  return <div className="mt-8">
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{layers.map((node,index)=><Link key={node.role} href={node.href} className="group relative rounded-2xl p-5 transition hover:-translate-y-0.5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface-hi)' }}><div className="flex items-center justify-between gap-3"><div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color:index===2?'var(--accent)':'var(--text-faint)' }}>{String(index+1).padStart(2,'0')} / {node.role}</div><span className="text-xs" style={{ color:'var(--text-faint)' }}>↗</span></div><div className="mt-3 text-lg font-semibold">{node.name}</div><div className="mt-2 text-xs leading-5" style={{ color:'var(--text-muted)' }}>{node.note}</div></Link>)}</div>
    <div className="mt-4 rounded-xl px-4 py-3 text-xs leading-5" style={{ border:'1px dashed var(--border-hi)', color:'var(--text-faint)', backgroundColor:'var(--bg-subtle)' }}>{en?'Relationship lines describe engineering and usage context, not mandatory runtime dependency. Independent projects can be adopted without Narwhal when their own architecture allows it.':'이 지도는 필수 런타임 의존성이 아니라 engineering practice와 사용 맥락을 나타냅니다. 독립 프로젝트는 자체 아키텍처가 허용하는 범위에서 Narwhal 없이도 사용할 수 있습니다.'}</div>
  </div>;
}
