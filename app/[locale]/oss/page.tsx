import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { routing } from '@/i18n/routing';
import { getProjects } from '@/lib/content';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

const layers = [
  ['BASELINE', 'kube-ready-box · ldapium · nfs-quota-agent'],
  ['PLATFORM', 'Narwhal · Narwhal Portal'],
  ['DATA', 'Beluga · Beluga Manager'],
  ['AI / EDGE', 'KubeMetal · Siqoq'],
  ['STANDARDS', 'OpenForge'],
] as const;

const featured = [
  ['narwhal', 'INTEGRATION'],
  ['narwhal-portal', 'EXPERIENCE'],
  ['beluga', 'DATA'],
  ['kubemetal', 'AI / EDGE'],
  ['kube-ready-box', 'BASELINE'],
  ['ldapium', 'IDENTITY'],
  ['nfs-quota-agent', 'STORAGE'],
  ['openforge', 'STANDARDS'],
  ['siqoq', 'PHYSICAL AI'],
] as const;

const portfolioGuide = [
  { slug:'kube-ready-box', title:'Reproducible node baseline', problem:'Kubernetes 실습·PoC마다 OS와 VM 상태가 달라지는 문제', architecture:'Packer로 Ubuntu LTS를 빌드하고 AMD64/ARM64, VirtualBox/VMware 경로를 검증', evidence:'이미지 빌드·부팅·quota·네트워크 검증과 릴리스 artifact', status:'기반 이미지와 실행 경로를 제공하는 foundation' },
  { slug:'ldapium', title:'Identity foundation', problem:'LDAP 계정·그룹과 플랫폼 OIDC/RBAC 사이의 단절', architecture:'디렉터리 데이터와 인증 경계를 분리하고 플랫폼 서비스가 재사용할 수 있는 identity layer', evidence:'스키마·초기화·인증 흐름과 운영 문서', status:'Narwhal 등 플랫폼 통합을 위한 reusable identity' },
  { slug:'nfs-quota-agent', title:'Storage policy enforcement', problem:'NFS PV를 팀 단위로 공유할 때 용량 초과와 책임 경계가 불명확한 문제', architecture:'XFS/ext4/Btrfs project quota, Kubernetes workload, Helm, metrics와 CLI/UI', evidence:'quota 적용·초과·복구·관측성 테스트', status:'공유 스토리지를 운영 가능한 Kubernetes capability로 확장' },
  { slug:'narwhal', title:'Kubernetes IDP', problem:'클러스터를 구성해도 SSO·GitOps·보안·관측성이 따로 운영되는 문제', architecture:'HA Kubernetes, kube-vip, ArgoCD/Gitea, Keycloak OIDC, Cilium/Istio/APISIX, observability와 backup', evidence:'120+ cluster checks, 49 SSO tests, 51 regression checks', status:'전체 포트폴리오의 통합·운영 중심' },
  { slug:'narwhal-portal', title:'Platform experience', problem:'플랫폼 기능이 있어도 사용자가 어디서 무엇을 실행해야 하는지 알기 어려운 문제', architecture:'Next.js/React 기반으로 서비스·문서·상태·진입 경로를 하나의 portal experience로 구성', evidence:'route·link·콘텐츠 parity, build와 UI smoke 검증', status:'Narwhal의 운영 기능을 사용자 경험으로 노출' },
  { slug:'beluga', title:'Cloud Native data platform', problem:'데이터 수집·저장·처리·조회 구성요소를 매번 별도로 조합하는 문제', architecture:'K3s 기반 위에 CDC, object/lake storage, query와 orchestration 경계를 조합', evidence:'서비스 기동, 데이터 흐름, endpoint와 운영 시나리오', status:'재현 가능한 data platform reference' },
  { slug:'beluga-manager', title:'Data control-plane boundary', problem:'데이터 플랫폼의 target architecture와 현재 구현 범위가 섞이는 문제', architecture:'control-plane 계약·상태 모델·운영 경계를 먼저 정의하고 실제 구현과 planned adapter를 분리', evidence:'문서 계약, verify script, CI와 구현 범위의 명시적 구분', status:'실행 제품보다 architecture foundation에 가까운 단계' },
  { slug:'siqoq', title:'Simulation-to-edge Physical AI', problem:'센서·이벤트·정책·액션을 하드웨어에 바로 연결하면 검증이 어려운 문제', architecture:'CPU-first event/action contract, safety gate, adapter와 simulation을 분리해 edge 확장', evidence:'mock→CPU→accelerator→hardware 단계별 parity와 trace', status:'Physical AI infrastructure를 검증하는 초기 foundation' },
] as const;

const adoptionPaths = [
  ['01', '기반부터 시작', 'kube-ready-box → ldapium → nfs-quota-agent', '노드, identity, storage를 먼저 재현합니다.'],
  ['02', '플랫폼으로 통합', 'narwhal → narwhal-portal', 'GitOps, SSO, observability, policy를 하나의 운영 경로로 연결합니다.'],
  ['03', '데이터 workload 확장', 'beluga → beluga-manager', '데이터 서비스와 control-plane의 경계를 확인합니다.'],
  ['04', 'AI / edge로 확장', 'kubemetal → siqoq', '로컬 AI compute와 Physical AI action contract를 검증합니다.'],
] as const;

const principles = [
  'Repository as source of truth',
  'Integration is a product feature',
  'Evidence-based completion',
  'Failure becomes durable knowledge',
  'Static where possible',
  'Bilingual parity',
] as const;

export default async function LocalizedOssPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = routing.locales.includes(locale as 'ko' | 'en') ? (locale as 'ko' | 'en') : 'ko';
  const base = lang === 'en' ? '/en' : '/ko';
  const projects = getProjects(lang);

  const items = featured.flatMap(([slug, label]) => {
    const project = projects.find(item => item.slug === slug);
    return project ? [{ project, label }] : [];
  });

  return (
    <main>
      <section className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20">
          <div className="font-mono text-xs font-medium tracking-[0.12em]" style={{ color: 'var(--accent)' }}>DASOMEL / OSS ECOSYSTEM</div>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-[3.5rem]" style={{ color: 'var(--text)' }}>
            {lang === 'en' ? 'Open source as one engineering system.' : '오픈소스를 하나의 엔지니어링 시스템으로.'}
          </h1>
          <p className="mt-6 max-w-5xl text-base leading-7 sm:text-lg sm:leading-8" style={{ color: 'var(--text-muted)' }}>
            Projects are connected by common principles: reproducibility, integration, evidence, documentation, and long-lived engineering knowledge.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>ECOSYSTEM / LAYERS</div>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--text)' }}>Baseline → Platform → Data → AI → Experience</h2>
        <div className="mt-6 space-y-3">
          {layers.map(([label, value]) => (
            <div key={label} className="rounded-xl border px-4 py-3" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div className="font-mono text-[10px] tracking-[0.08em]" style={{ color: 'var(--accent)' }}>{label}</div>
              <div className="mt-1 text-sm font-semibold" style={{ color: 'var(--text)' }}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16">
          <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>FEATURED OSS</div>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--text)' }}>{lang === 'en' ? 'Core projects in the workbench' : '현재 Workbench의 핵심 프로젝트'}</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {items.map(({ project, label }) => (
              <Link key={project.slug} href={`${base}/projects/${project.slug}`} className="group rounded-2xl border p-5 transition-transform hover:-translate-y-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <div className="font-mono text-[10px] tracking-[0.08em]" style={{ color: 'var(--accent)' }}>{label}</div>
                <h3 className="mt-2 text-xl font-semibold group-hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>{project.title}</h3>
                <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{project.description || project.problem}</p>
                <div className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.08em]" style={{ color: 'var(--accent)' }}>VIEW PROJECT <ArrowUpRight className="h-3 w-3" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16">
          <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>WHAT THIS PORTFOLIO EXPLAINS</div>
          <h2 className="mt-3 max-w-4xl text-2xl font-semibold leading-tight sm:text-3xl" style={{ color: 'var(--text)' }}>
            {lang === 'en' ? 'These repositories are boundaries in one platform story.' : '각 저장소는 하나의 플랫폼 이야기 안에서 서로 다른 경계를 책임집니다.'}
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 sm:text-base" style={{ color: 'var(--text-muted)' }}>
            {lang === 'en' ? 'This is not a collection of unrelated demos. The portfolio shows how a reproducible node becomes a platform, how identity and storage become platform capabilities, and how data and AI workloads are connected with explicit operational evidence.' : '서로 관계없는 데모를 나열한 것이 아닙니다. 재현 가능한 노드가 플랫폼으로 확장되고, identity와 storage가 플랫폼 기능이 되며, data와 AI workload가 운영 증거와 함께 연결되는 과정을 보여줍니다.'}
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {portfolioGuide.map((item) => {
              const { slug } = item;
              const project = projects.find(item => item.slug === slug);
              return <Link key={slug} href={`${base}/projects/${slug}`} className="rounded-2xl border p-5 transition hover:-translate-y-0.5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <div className="flex items-start justify-between gap-4"><div><div className="font-mono text-[10px] tracking-[0.08em]" style={{ color: 'var(--accent)' }}>{slug}</div><h3 className="mt-2 text-lg font-semibold" style={{ color: 'var(--text)' }}>{project?.title || slug}</h3></div><ArrowUpRight className="h-4 w-4 shrink-0" style={{ color: 'var(--accent)' }} /></div>
                <p className="mt-3 text-sm font-medium leading-6" style={{ color: 'var(--text)' }}>{item.title}</p>
                <div className="mt-4 grid gap-2 border-t pt-3 text-xs leading-5" style={{ borderColor: 'var(--border)' }}>
                  <div><span className="font-mono text-[9px] uppercase tracking-[0.08em]" style={{ color: 'var(--accent)' }}>PROBLEM</span><p style={{ color: 'var(--text-muted)' }}>{item.problem}</p></div>
                  <div><span className="font-mono text-[9px] uppercase tracking-[0.08em]" style={{ color: 'var(--accent)' }}>ARCHITECTURE</span><p style={{ color: 'var(--text-muted)' }}>{item.architecture}</p></div>
                  <div><span className="font-mono text-[9px] uppercase tracking-[0.08em]" style={{ color: 'var(--accent)' }}>EVIDENCE / STATUS</span><p style={{ color: 'var(--text-muted)' }}>{item.evidence} · {item.status}</p></div>
                </div>
              </Link>;
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>ADOPTION PATHS</div>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--text)' }}>{lang === 'en' ? 'Read the portfolio as an operating sequence.' : '포트폴리오는 운영 순서로 읽을 수 있습니다.'}</h2>
        <div className="mt-6 grid gap-3 lg:grid-cols-4">
          {adoptionPaths.map(([number, title, chain, note]) => <div key={number} className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}><div className="font-mono text-xs" style={{ color: 'var(--accent)' }}>{number}</div><h3 className="mt-4 text-base font-semibold" style={{ color: 'var(--text)' }}>{lang === 'en' ? title : title}</h3><div className="mt-3 font-mono text-[11px] leading-5" style={{ color: 'var(--accent)' }}>{chain}</div><p className="mt-3 text-xs leading-5" style={{ color: 'var(--text-muted)' }}>{note}</p></div>)}
        </div>
        <div className="mt-6 rounded-2xl border p-5 text-sm leading-7" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
          {lang === 'en' ? 'Projects remain independently adoptable. The arrows describe a useful learning and integration path, not mandatory runtime dependencies.' : '각 프로젝트는 독립적으로 활용할 수 있습니다. 화살표는 필수 런타임 의존성이 아니라 학습·통합을 위한 권장 경로를 뜻합니다.'}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>ENGINEERING PRINCIPLES</div>
        <div className="mt-5 divide-y" style={{ borderColor: 'var(--border)' }}>
          {principles.map((principle, index) => (
            <div key={principle} className="grid grid-cols-[32px_1fr] gap-3 py-3">
              <span className="font-mono text-[10px]" style={{ color: 'var(--text-faint)' }}>{String(index + 1).padStart(2, '0')}</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{principle}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
