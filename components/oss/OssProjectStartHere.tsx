import Link from 'next/link';

type Path = { label: string; title: string; href: string; detail: string };

const PATHS: Record<string, Path[]> = {
  narwhal: [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/narwhal/architecture/', detail:'HA control plane, network, service layout과 platform boundary를 먼저 봅니다.' },
    { label:'VERIFY', title:'Testing', href:'/oss/narwhal/testing/', detail:'Regression, live cluster verification, SSO verification이 어떻게 분리되는지 확인합니다.' },
    { label:'OPERATE', title:'Operations', href:'/oss/narwhal/operations/', detail:'Backup, restore, upgrade, air-gap을 포함한 day-2 운영 경로입니다.' },
  ],
  'nfs-quota-agent': [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/nfs-quota-agent/architecture/', detail:'PV → NFS path mapping → filesystem quota enforcement 경계를 봅니다.' },
    { label:'START', title:'Getting Started', href:'/oss/nfs-quota-agent/getting-started/', detail:'NFS server node 준비와 Helm 설치 흐름을 확인합니다.' },
    { label:'OPERATE', title:'Operations', href:'/oss/nfs-quota-agent/operations/', detail:'Monitoring, cleanup, dry-run, 장애 대응을 확인합니다.' },
  ],
  kubemetal: [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/kubemetal/architecture/', detail:'Tauri ↔ Kubernetes control plane ↔ macOS host MLX compute 경계를 봅니다.' },
    { label:'WORKFLOW', title:'MLOps', href:'/oss/kubemetal/mlops/', detail:'Model lifecycle, fine-tuning, registration, serving 흐름을 확인합니다.' },
    { label:'INTEGRATE', title:'External Cluster', href:'/oss/kubemetal/integration/', detail:'Agent-first integration과 opt-in full-stack deployment의 차이를 봅니다.' },
  ],
  openforge: [
    { label:'POLICY', title:'Standards', href:'/oss/openforge/standards/', detail:'프로젝트가 달성해야 할 engineering outcome과 원칙을 확인합니다.' },
    { label:'IMPLEMENT', title:'Templates', href:'/oss/openforge/templates/', detail:'CI/CD, security, repository 운영에 재사용할 구현 자산을 봅니다.' },
    { label:'EVIDENCE', title:'Reference', href:'/oss/openforge/reference/', detail:'실제 OSS 적용 사례와 trade-off를 확인합니다.' },
  ],
};

export function OssProjectStartHere({ slug }: { slug:string }) {
  const items = PATHS[slug];
  if (!items) return null;
  return <section className="mb-10"><div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color:'var(--text-faint)' }}>START HERE</div><h3 className="mt-2 text-2xl font-semibold tracking-tight">README를 처음부터 읽지 않아도 됩니다.</h3><div className="mt-5 grid gap-3 md:grid-cols-3">{items.map((item)=><Link key={item.href} href={item.href} className="group rounded-2xl p-5 transition hover:-translate-y-0.5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>{item.label}</div><div className="mt-2 text-lg font-semibold">{item.title} →</div><p className="mt-2 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{item.detail}</p></Link>)}</div></section>;
}
