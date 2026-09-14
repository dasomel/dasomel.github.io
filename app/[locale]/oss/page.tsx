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
  ['kube-ready-box', '재현 가능한 Ubuntu 기반 노드와 Kubernetes 준비 환경', '운영체제·가상화·아키텍처별 기반을 먼저 고정합니다.'],
  ['ldapium', 'LDAP/OIDC 중심의 identity foundation', '사용자·그룹·디렉터리 경계를 플랫폼에 연결합니다.'],
  ['nfs-quota-agent', 'NFS PV의 프로젝트 단위 quota enforcement', '공유 스토리지에서 팀별 사용량과 정책을 집행합니다.'],
  ['narwhal', 'GitOps·SSO·관측성·보안을 통합한 Kubernetes IDP', '각 기반 기능을 실제 운영 가능한 플랫폼으로 묶습니다.'],
  ['narwhal-portal', '플랫폼 기능을 탐색하고 실행하는 사용자 경험', '운영자와 개발자가 같은 플랫폼 상태를 이해하도록 합니다.'],
  ['beluga', '데이터 서비스를 묶은 Cloud Native data platform', '수집·저장·처리·조회 흐름을 실행 가능한 조합으로 검증합니다.'],
  ['beluga-manager', '데이터 플랫폼을 위한 control-plane 계약과 운영 경계', '현재 구현과 목표 아키텍처를 분리해 다음 작업을 정의합니다.'],
  ['siqoq', '시뮬레이션에서 edge action까지 연결하는 Physical AI 계약', '센서·이벤트·정책·액션을 CPU 우선으로 검증합니다.'],
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
            {portfolioGuide.map(([slug, title, note]) => {
              const project = projects.find(item => item.slug === slug);
              return <Link key={slug} href={`${base}/projects/${slug}`} className="rounded-2xl border p-5 transition hover:-translate-y-0.5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <div className="flex items-start justify-between gap-4"><div><div className="font-mono text-[10px] tracking-[0.08em]" style={{ color: 'var(--accent)' }}>{slug}</div><h3 className="mt-2 text-lg font-semibold" style={{ color: 'var(--text)' }}>{project?.title || slug}</h3></div><ArrowUpRight className="h-4 w-4 shrink-0" style={{ color: 'var(--accent)' }} /></div>
                <p className="mt-3 text-sm font-medium leading-6" style={{ color: 'var(--text)' }}>{lang === 'en' ? title : title}</p>
                <p className="mt-1 text-xs leading-5" style={{ color: 'var(--text-muted)' }}>{lang === 'en' ? note : note}</p>
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
