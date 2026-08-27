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

const groups = OSS_PORTFOLIO_GROUPS;

export default function OssHubKo() {
  const projects = getProjects('ko');
  const docs = getDocs('ko');
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const docsByProject = new Map<string, number>();
  for (const doc of docs) { const root = doc.slug.split('/')[0]; docsByProject.set(root, (docsByProject.get(root) ?? 0) + 1); }
  const coverage = groups.flatMap((group)=>group.projects).map((slug)=>({ name:slug, docs:docsByProject.get(slug)??0 }));

  return <main style={{ color:'var(--text)' }}>
    <OssSubnav locale="ko" active="hub" />
    <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-7 lg:py-20">
      <section className="max-w-5xl"><div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color:'var(--accent)' }}><span className="h-px w-8" style={{ backgroundColor:'var(--accent)' }}/> OSS ENGINEERING LAB</div><h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">저장소가 아니라,<br/>계속 진화하는 Engineering Workbench.</h1><p className="mt-5 max-w-4xl text-lg leading-8" style={{ color:'var(--text-muted)' }}>실제 플랫폼 문제를 OSS로 만들고, 경계를 검증하고, commit·release·문서·운영 기록을 통해 계속 발전시키는 과정을 한 곳에서 보여줍니다.</p><OssActivityFreshness locale="ko" /></section>

      <OssStartPaths locale="ko" />
      <OssEvidenceStrip locale="ko" />
      <OssSystemPulse locale="ko" />

      <section className="mt-14"><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>SYSTEM OF SYSTEMS</div><h2 className="mt-3 text-3xl font-semibold">Standards에서 Workload까지 한 흐름으로 읽습니다.</h2><p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>런타임 의존성 지도가 아니라, 반복되는 engineering practice와 실제 사용 시나리오의 연결입니다.</p><OssArchitectureFlow locale="ko" /></section>

      <div className="mt-16 space-y-14">{groups.map((group) => <section key={group.label}><div className="max-w-3xl"><div className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color:'var(--accent)' }}>{group.label}</div><p className="mt-2 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{group.description}</p></div><div className="mt-5 grid gap-5 md:grid-cols-2">{group.projects.map((slug) => { const project=bySlug.get(slug); if(!project) return null; const pageCount=docsByProject.get(slug)??0; return <Link key={slug} href={`/oss/${slug}/`} className="group rounded-2xl p-7 transition hover:-translate-y-0.5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="flex items-start justify-between gap-5"><div><div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color:'var(--text-faint)' }}>Open Source System</div><h3 className="mt-2 text-2xl font-semibold tracking-tight">{project.title}</h3><p className="mt-3 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{project.description}</p></div><div className="shrink-0 rounded-full px-3 py-1.5 text-[11px]" style={{ border:'1px solid var(--border)', color:'var(--text-faint)' }}>{pageCount} docs</div></div>{project.problem&&<div className="mt-6 border-l-2 pl-4" style={{ borderColor:'var(--signal)' }}><div className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--text-faint)' }}>Problem</div><p className="mt-2 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{project.problem}</p></div>}<div className="mt-6 flex flex-wrap gap-2">{project.tags.slice(0,6).map(tag=><span key={tag} className="rounded-md px-2.5 py-1.5 text-[11px]" style={{ backgroundColor:'var(--surface-hi)', color:'var(--text-faint)' }}>{tag}</span>)}</div><div className="mt-7 text-sm font-semibold" style={{ color:'var(--accent)' }}>Architecture · Evidence · Docs 보기 →</div></Link>; })}</div></section>)}</div>

      <OssDocsCoverage items={coverage} locale="ko" />
      <section className="mt-16 border-t pt-10" style={{ borderColor:'var(--border)' }}><div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color:'var(--text-faint)' }}>DOCUMENTATION PRACTICE</div><h2 className="mt-3 text-2xl font-semibold">README에서 끝내지 않습니다.</h2><p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>Problem · Architecture · Decision · Verification · Operations · Troubleshooting · ADR을 분리해 구현 결과와 판단 근거가 함께 남도록 합니다.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/ko/oss/evidence/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border:'1px solid var(--signal)', color:'var(--signal)' }}>Evidence Method →</Link><Link href="/oss/openforge/standards/documentation/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border:'1px solid var(--accent)', color:'var(--accent)' }}>Documentation Standard →</Link><Link href="/ko/oss/story/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border:'1px solid var(--border)' }}>Engineering Story →</Link><Link href="/ko/projects/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border:'1px solid var(--border)' }}>전체 Work →</Link></div></section>
    </div>
  </main>;
}
