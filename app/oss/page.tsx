import Link from 'next/link';
import { getProjects, getDocs } from '@/lib/content';
import { OSS_PORTFOLIO_GROUPS } from '@/lib/oss';
import { OssSubnav } from '@/components/oss/OssSubnav';
import { OssStartPaths } from '@/components/oss/OssStartPaths';
import { OssEvidenceStrip } from '@/components/oss/OssEvidenceStrip';
import { OssArchitectureFlow } from '@/components/oss/OssArchitectureFlow';
import { OssActivityFreshness } from '@/components/oss/OssActivityFreshness';
import { OssSystemPulse } from '@/components/oss/OssSystemPulse';
import { OssDocsCoverage } from '@/components/oss/OssDocsCoverage';
import { OssPortfolioMatrix } from '@/components/oss/OssPortfolioMatrix';
import { OssPortfolioHealth } from '@/components/oss/OssPortfolioHealth';
import { OssPortfolioReadiness } from '@/components/oss/OssPortfolioReadiness';

const groups = OSS_PORTFOLIO_GROUPS;

export default function OssHubKo() {
  const projects = getProjects('ko');
  const docs = getDocs('ko');
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const docsByProject = new Map<string, number>();
  for (const doc of docs) { const root = doc.slug.split('/')[0]; docsByProject.set(root, (docsByProject.get(root) ?? 0) + 1); }
  const coverage = groups.flatMap((group)=>group.projects).map((slug)=>({ name:slug, docs:docsByProject.get(slug)??0 }));
  const featured = ['narwhal', 'nfs-quota-agent', 'kubemetal'].map((slug) => bySlug.get(slug)).filter(Boolean);

  return <main style={{ color:'var(--text)' }}>
    <OssSubnav locale="ko" active="hub" />
    <section className="relative overflow-hidden border-b" style={{ borderColor:'var(--border)', background:'linear-gradient(180deg, var(--bg-subtle), var(--bg))' }}>
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-[1180px] px-5 py-16 sm:px-7 lg:py-24">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color:'var(--accent)' }}><span className="h-px w-8" style={{ backgroundColor:'var(--accent)' }}/> CLOUD NATIVE · PLATFORM ENGINEERING · AI INFRASTRUCTURE</div>
        <h1 className="mt-6 max-w-5xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Production problem에서 시작한<br/>Open Source Engineering Systems.</h1>
        <p className="mt-6 max-w-4xl text-lg leading-8" style={{ color:'var(--text-muted)' }}>Kubernetes 플랫폼, 재사용 가능한 인프라 컴포넌트, 로컬 AI 실험, 그리고 공통 엔지니어링 표준을 하나의 생태계로 연결합니다. 마케팅 문구보다 source · test · release · operations evidence를 우선합니다.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/oss/narwhal/" className="rounded-full px-5 py-2.5 text-sm font-semibold" style={{ backgroundColor:'var(--accent)', color:'var(--accent-fg)' }}>Flagship: Narwhal →</Link><Link href="/ko/oss/evidence/" className="rounded-full px-5 py-2.5 text-sm font-semibold" style={{ border:'1px solid var(--border-hi)' }}>Evidence Method</Link><Link href="/oss/openforge/" className="rounded-full px-5 py-2.5 text-sm font-semibold" style={{ border:'1px solid var(--border-hi)' }}>Engineering Standards</Link></div>
        <OssActivityFreshness locale="ko" />
      </div>
    </section>

    <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-7 lg:py-20">
      <section><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>FLAGSHIP PROJECTS</div><h2 className="mt-3 text-3xl font-semibold">역할이 다른 핵심 OSS를 먼저 봅니다.</h2><p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>Narwhal은 flagship platform, NFS Quota Agent는 독립 재사용 컴포넌트, KubeMetal은 cloud-native AI 방향을 검증하는 emerging project입니다.</p><div className="mt-6 grid gap-5 lg:grid-cols-3">{featured.map((project) => project && <Link key={project.slug} href={`/oss/${project.slug}/`} className="group rounded-2xl p-7 transition hover:-translate-y-0.5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color:'var(--accent)' }}>{project.slug==='narwhal'?'Flagship Platform':project.slug==='nfs-quota-agent'?'Reusable Component':'Emerging / AI'}</div><h3 className="mt-3 text-2xl font-semibold">{project.title}</h3><p className="mt-3 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{project.description}</p><div className="mt-6 text-sm font-semibold" style={{ color:'var(--accent)' }}>Project system 보기 →</div></Link>)}</div></section>

      <OssStartPaths locale="ko" />
      <OssEvidenceStrip locale="ko" />
      <OssPortfolioHealth locale="ko" docs={coverage} />
      <OssPortfolioReadiness locale="ko" docs={coverage} />
      <OssSystemPulse locale="ko" />

      <section className="mt-14"><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>ONE ECOSYSTEM, INDEPENDENT PROJECTS</div><h2 className="mt-3 text-3xl font-semibold">Standards에서 Workload까지 한 흐름으로 읽습니다.</h2><p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>OpenForge의 공통 practice를 공유하지만 각 프로젝트는 독립 설치·검증·릴리스를 지향합니다. 아래 지도는 런타임 의존성이 아니라 engineering practice와 실제 사용 시나리오의 연결입니다.</p><OssArchitectureFlow locale="ko" /></section>

      <OssPortfolioMatrix />

      <div className="mt-16 space-y-14">{groups.map((group) => <section key={group.label}><div className="max-w-3xl"><div className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color:'var(--accent)' }}>{group.label}</div><p className="mt-2 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{group.description}</p></div><div className="mt-5 grid gap-5 md:grid-cols-2">{group.projects.map((slug) => { const project=bySlug.get(slug); if(!project) return null; const pageCount=docsByProject.get(slug)??0; return <Link key={slug} href={`/oss/${slug}/`} className="group rounded-2xl p-7 transition hover:-translate-y-0.5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="flex items-start justify-between gap-5"><div><div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color:'var(--text-faint)' }}>Open Source System</div><h3 className="mt-2 text-2xl font-semibold tracking-tight">{project.title}</h3><p className="mt-3 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{project.description}</p></div><div className="shrink-0 rounded-full px-3 py-1.5 text-[11px]" style={{ border:'1px solid var(--border)', color:'var(--text-faint)' }}>{pageCount} docs</div></div>{project.problem&&<div className="mt-6 border-l-2 pl-4" style={{ borderColor:'var(--signal)' }}><div className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--text-faint)' }}>Problem</div><p className="mt-2 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{project.problem}</p></div>}<div className="mt-6 flex flex-wrap gap-2">{project.tags.slice(0,6).map(tag=><span key={tag} className="rounded-md px-2.5 py-1.5 text-[11px]" style={{ backgroundColor:'var(--surface-hi)', color:'var(--text-faint)' }}>{tag}</span>)}</div><div className="mt-7 text-sm font-semibold" style={{ color:'var(--accent)' }}>Architecture · Evidence · Docs 보기 →</div></Link>; })}</div></section>)}</div>

      <OssDocsCoverage items={coverage} locale="ko" />
      <section className="mt-16 border-t pt-10" style={{ borderColor:'var(--border)' }}><div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color:'var(--text-faint)' }}>DOCUMENTATION PRACTICE</div><h2 className="mt-3 text-2xl font-semibold">README에서 끝내지 않습니다.</h2><p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>Problem · Architecture · Decision · Verification · Operations · Troubleshooting · ADR을 분리해 구현 결과와 판단 근거가 함께 남도록 합니다.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/ko/oss/evidence/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border:'1px solid var(--signal)', color:'var(--signal)' }}>Evidence Method →</Link><Link href="/oss/openforge/standards/documentation/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border:'1px solid var(--accent)', color:'var(--accent)' }}>Documentation Standard →</Link><Link href="/ko/oss/story/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border:'1px solid var(--border)' }}>Engineering Story →</Link><Link href="/ko/projects/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border:'1px solid var(--border)' }}>전체 Work →</Link></div></section>
    </div>
  </main>;
}
