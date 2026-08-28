import Link from 'next/link';

type Path = { label: string; title: string; href: string; detail: string };

const PATHS: Record<string, Path[]> = {
  narwhal: [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/narwhal/architecture/', detail:'HA control plane, network, service layout과 platform boundary를 먼저 봅니다.' },
    { label:'VERIFY', title:'Testing', href:'/oss/narwhal/testing/', detail:'Regression, live cluster verification, SSO verification이 어떻게 분리되는지 확인합니다.' },
    { label:'OPERATE', title:'Operations', href:'/oss/narwhal/operations/', detail:'Backup, restore, upgrade, air-gap을 포함한 day-2 운영 경로입니다.' },
  ],
  'narwhal-portal': [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/narwhal-portal/architecture/', detail:'Portal이 Narwhal platform APIs와 source systems를 어떻게 연결하는지 봅니다.' },
    { label:'START', title:'Getting Started', href:'/oss/narwhal-portal/getting-started/', detail:'Next.js 개발 환경과 Skaffold/Kaniko 기반 cluster development 경로를 확인합니다.' },
    { label:'OPERATE', title:'Operations', href:'/oss/narwhal-portal/operations/', detail:'배포, image build, secrets, runtime 상태 확인 경계를 봅니다.' },
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
  clusterdeck: [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/clusterdeck/architecture/', detail:'Tauri UI → Rust core → OpenSSH/kubectl/filesystem 경계를 먼저 봅니다.' },
    { label:'START', title:'Getting Started', href:'/oss/clusterdeck/getting-started/', detail:'macOS 개발 환경과 Profile 기반 SSH·kubeconfig 연결 흐름을 확인합니다.' },
    { label:'SCOPE', title:'Overview', href:'/oss/clusterdeck/overview/', detail:'Kubernetes console이 아니라 workstation access layer라는 제품 경계를 확인합니다.' },
  ],
  ldapium: [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/ldapium/architecture/', detail:'OpenLDAP server, optional UI, Helm chart와 persistent data 경계를 먼저 봅니다.' },
    { label:'START', title:'Getting Started', href:'/oss/ldapium/getting-started/', detail:'Docker Compose와 Kubernetes Helm 배포의 기본 경로를 확인합니다.' },
    { label:'OPERATE', title:'Operations', href:'/oss/ldapium/operations/', detail:'TLS, backup/restore, replication과 운영 주의점을 확인합니다.' },
  ],
  'kube-ready-box': [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/kube-ready-box/architecture/', detail:'Ubuntu image → Packer → Vagrant Box → local Kubernetes node baseline 흐름을 봅니다.' },
    { label:'START', title:'Getting Started', href:'/oss/kube-ready-box/getting-started/', detail:'Ubuntu, filesystem, provider 조합을 선택해 로컬 VM을 시작합니다.' },
    { label:'VERIFY', title:'Verification', href:'/oss/kube-ready-box/verification/', detail:'Boot 성공이 아니라 kernel, network, filesystem, prerequisite baseline을 검증합니다.' },
  ],
  beluga: [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/beluga/architecture/', detail:'CDC → streaming → lakehouse → query → BI 전체 데이터 흐름을 먼저 봅니다.' },
    { label:'START', title:'Getting Started', href:'/oss/beluga/getting-started/', detail:'VM, k3s, GitOps bootstrap과 local resource profile을 확인합니다.' },
    { label:'OPERATE', title:'Operations', href:'/oss/beluga/operations/', detail:'플랫폼 상태, upgrade와 data lifecycle 운영 경계를 확인합니다.' },
  ],
  'beluga-manager': [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/beluga-manager/architecture/', detail:'Adapter → correlation → domain API → UI 구조와 authoritative state 경계를 봅니다.' },
    { label:'BUILD', title:'Development', href:'/oss/beluga-manager/development/', detail:'Unified API와 frontend가 upstream OSS API와 어떻게 분리되는지 확인합니다.' },
    { label:'OPERATE', title:'Operations', href:'/oss/beluga-manager/operations/', detail:'Early-stage control plane의 배포 및 운영 기준을 확인합니다.' },
  ],
};

export function OssProjectStartHere({ slug }: { slug:string }) {
  const items = PATHS[slug];
  if (!items) return null;
  return <section className="mb-10"><div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color:'var(--text-faint)' }}>START HERE</div><h3 className="mt-2 text-2xl font-semibold tracking-tight">README를 처음부터 읽지 않아도 됩니다.</h3><div className="mt-5 grid gap-3 md:grid-cols-3">{items.map((item)=><Link key={item.href} href={item.href} className="group rounded-2xl p-5 transition hover:-translate-y-0.5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>{item.label}</div><div className="mt-2 text-lg font-semibold">{item.title} →</div><p className="mt-2 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{item.detail}</p></Link>)}</div></section>;
}
