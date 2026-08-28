import Link from 'next/link';

type Path = { label:string; title:string; href:string; detailKo:string; detailEn:string };

const PATHS: Record<string, Path[]> = {
  narwhal: [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/narwhal/architecture/', detailKo:'HA control plane, network, service layout과 platform boundary를 먼저 봅니다.', detailEn:'Start with the HA control plane, network, service layout, and platform boundaries.' },
    { label:'VERIFY', title:'Testing', href:'/oss/narwhal/testing/', detailKo:'Regression, live cluster verification, SSO verification이 어떻게 분리되는지 확인합니다.', detailEn:'See how regression, live cluster verification, and SSO verification are separated.' },
    { label:'OPERATE', title:'Operations', href:'/oss/narwhal/operations/', detailKo:'Backup, restore, upgrade, air-gap을 포함한 day-2 운영 경로입니다.', detailEn:'Follow the day-2 path for backup, restore, upgrade, and air-gapped operations.' },
  ],
  'narwhal-portal': [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/narwhal-portal/architecture/', detailKo:'Portal이 Narwhal platform APIs와 source systems를 어떻게 연결하는지 봅니다.', detailEn:'See how the portal connects Narwhal platform APIs and authoritative source systems.' },
    { label:'START', title:'Getting Started', href:'/oss/narwhal-portal/getting-started/', detailKo:'Next.js 개발 환경과 Skaffold/Kaniko 기반 cluster development 경로를 확인합니다.', detailEn:'Set up the Next.js development environment and the Skaffold/Kaniko cluster-development path.' },
    { label:'OPERATE', title:'Operations', href:'/oss/narwhal-portal/operations/', detailKo:'배포, image build, secrets, runtime 상태 확인 경계를 봅니다.', detailEn:'Review deployment, image-build, secret, and runtime-state boundaries.' },
  ],
  'nfs-quota-agent': [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/nfs-quota-agent/architecture/', detailKo:'PV → NFS path mapping → filesystem quota enforcement 경계를 봅니다.', detailEn:'Understand the PV → NFS path mapping → filesystem quota enforcement boundary.' },
    { label:'START', title:'Getting Started', href:'/oss/nfs-quota-agent/getting-started/', detailKo:'NFS server node 준비와 Helm 설치 흐름을 확인합니다.', detailEn:'Prepare the NFS server node and follow the Helm installation path.' },
    { label:'OPERATE', title:'Operations', href:'/oss/nfs-quota-agent/operations/', detailKo:'Monitoring, cleanup, dry-run, 장애 대응을 확인합니다.', detailEn:'Review monitoring, cleanup, dry-run, and failure-response operations.' },
  ],
  kubemetal: [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/kubemetal/architecture/', detailKo:'Tauri ↔ Kubernetes control plane ↔ macOS host MLX compute 경계를 봅니다.', detailEn:'Understand the Tauri ↔ Kubernetes control plane ↔ macOS host MLX compute split.' },
    { label:'WORKFLOW', title:'MLOps', href:'/oss/kubemetal/mlops/', detailKo:'Model lifecycle, fine-tuning, registration, serving 흐름을 확인합니다.', detailEn:'Follow model lifecycle, fine-tuning, registration, and serving workflows.' },
    { label:'INTEGRATE', title:'External Cluster', href:'/oss/kubemetal/integration/', detailKo:'Agent-first integration과 opt-in full-stack deployment의 차이를 봅니다.', detailEn:'Compare agent-first integration with opt-in full-stack deployment.' },
  ],
  openforge: [
    { label:'POLICY', title:'Standards', href:'/oss/openforge/standards/', detailKo:'프로젝트가 달성해야 할 engineering outcome과 원칙을 확인합니다.', detailEn:'Review the engineering outcomes and principles projects are expected to meet.' },
    { label:'IMPLEMENT', title:'Templates', href:'/oss/openforge/templates/', detailKo:'CI/CD, security, repository 운영에 재사용할 구현 자산을 봅니다.', detailEn:'Browse reusable implementation assets for CI/CD, security, and repository operations.' },
    { label:'EVIDENCE', title:'Reference', href:'/oss/openforge/reference/', detailKo:'실제 OSS 적용 사례와 trade-off를 확인합니다.', detailEn:'Review concrete OSS applications and the trade-offs recorded from them.' },
  ],
  clusterdeck: [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/clusterdeck/architecture/', detailKo:'Tauri UI → Rust core → OpenSSH/kubectl/filesystem 경계를 먼저 봅니다.', detailEn:'Start with the Tauri UI → Rust core → OpenSSH/kubectl/filesystem boundary.' },
    { label:'START', title:'Getting Started', href:'/oss/clusterdeck/getting-started/', detailKo:'macOS 개발 환경과 Profile 기반 SSH·kubeconfig 연결 흐름을 확인합니다.', detailEn:'Set up the macOS development environment and Profile-based SSH/kubeconfig workflow.' },
    { label:'SCOPE', title:'Overview', href:'/oss/clusterdeck/overview/', detailKo:'Kubernetes console이 아니라 workstation access layer라는 제품 경계를 확인합니다.', detailEn:'Understand the product boundary as a workstation access layer rather than a Kubernetes console.' },
  ],
  ldapium: [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/ldapium/architecture/', detailKo:'OpenLDAP server, optional UI, Helm chart와 persistent data 경계를 먼저 봅니다.', detailEn:'Start with the OpenLDAP server, optional UI, Helm chart, and persistent-data boundary.' },
    { label:'START', title:'Getting Started', href:'/oss/ldapium/getting-started/', detailKo:'Docker Compose와 Kubernetes Helm 배포의 기본 경로를 확인합니다.', detailEn:'Follow the baseline Docker Compose and Kubernetes Helm deployment paths.' },
    { label:'OPERATE', title:'Operations', href:'/oss/ldapium/operations/', detailKo:'TLS, backup/restore, replication과 운영 주의점을 확인합니다.', detailEn:'Review TLS, backup/restore, replication, and operational caveats.' },
  ],
  'kube-ready-box': [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/kube-ready-box/architecture/', detailKo:'Ubuntu image → Packer → Vagrant Box → local Kubernetes node baseline 흐름을 봅니다.', detailEn:'Understand the Ubuntu image → Packer → Vagrant Box → local Kubernetes node-baseline flow.' },
    { label:'START', title:'Getting Started', href:'/oss/kube-ready-box/getting-started/', detailKo:'Ubuntu, filesystem, provider 조합을 선택해 로컬 VM을 시작합니다.', detailEn:'Choose an Ubuntu, filesystem, and provider combination and start a local VM.' },
    { label:'VERIFY', title:'Verification', href:'/oss/kube-ready-box/verification/', detailKo:'Boot 성공이 아니라 kernel, network, filesystem, prerequisite baseline을 검증합니다.', detailEn:'Verify kernel, network, filesystem, and prerequisite readiness rather than boot success alone.' },
  ],
  beluga: [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/beluga/architecture/', detailKo:'CDC → streaming → lakehouse → query → BI 전체 데이터 흐름을 먼저 봅니다.', detailEn:'Start with the CDC → streaming → lakehouse → query → BI data flow.' },
    { label:'START', title:'Getting Started', href:'/oss/beluga/getting-started/', detailKo:'VM, k3s, GitOps bootstrap과 local resource profile을 확인합니다.', detailEn:'Review the VM, k3s, GitOps bootstrap, and local resource profile.' },
    { label:'OPERATE', title:'Operations', href:'/oss/beluga/operations/', detailKo:'플랫폼 상태, upgrade와 data lifecycle 운영 경계를 확인합니다.', detailEn:'Review platform state, upgrade, and data-lifecycle operational boundaries.' },
  ],
  'beluga-manager': [
    { label:'UNDERSTAND', title:'Architecture', href:'/oss/beluga-manager/architecture/', detailKo:'Adapter → correlation → domain API → UI 구조와 authoritative state 경계를 봅니다.', detailEn:'Understand the Adapter → correlation → domain API → UI structure and authoritative-state boundary.' },
    { label:'BUILD', title:'Development', href:'/oss/beluga-manager/development/', detailKo:'Unified API와 frontend가 upstream OSS API와 어떻게 분리되는지 확인합니다.', detailEn:'See how the unified API and frontend remain separated from upstream OSS APIs.' },
    { label:'OPERATE', title:'Operations', href:'/oss/beluga-manager/operations/', detailKo:'Early-stage control plane의 배포 및 운영 기준을 확인합니다.', detailEn:'Review deployment and operations criteria for the early-stage control plane.' },
  ],
};

export function OssProjectStartHere({ slug, locale='ko' }: { slug:string; locale?:'ko'|'en' }) {
  const items=PATHS[slug];
  if (!items) return null;
  const en=locale==='en';
  return <section className="mb-10"><div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color:'var(--text-faint)' }}>START HERE</div><h3 className="mt-2 text-2xl font-semibold tracking-tight">{en?'You do not need to read the README from top to bottom.':'README를 처음부터 읽지 않아도 됩니다.'}</h3><div className="mt-5 grid gap-3 md:grid-cols-3">{items.map((item)=>{const href=en?item.href.replace('/oss/','/oss/en/'):item.href;return <Link key={href} href={href} className="group rounded-2xl p-5 transition hover:-translate-y-0.5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>{item.label}</div><div className="mt-2 text-lg font-semibold">{item.title} →</div><p className="mt-2 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{en?item.detailEn:item.detailKo}</p></Link>;})}</div></section>;
}
