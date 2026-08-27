import Link from 'next/link';
import { getProjects, getDocs } from '@/lib/content';
import { OSS_PORTFOLIO_GROUPS } from '@/lib/oss';
import { OssSubnav } from '@/components/oss/OssSubnav';
import { OssStartPaths } from '@/components/oss/OssStartPaths';
import { OssEvidenceStrip } from '@/components/oss/OssEvidenceStrip';
import { OssArchitectureFlow } from '@/components/oss/OssArchitectureFlow';

const groups = OSS_PORTFOLIO_GROUPS;

export default function OssHubEn() {
  const projects = getProjects('en');
  const docs = getDocs('en');
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const docsByProject = new Map<string, number>();
  for (const doc of docs) { const root = doc.slug.split('/')[0]; docsByProject.set(root, (docsByProject.get(root) ?? 0) + 1); }

  return <main style={{ color:'var(--text)' }}>
    <OssSubnav locale="en" active="hub" />
    <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-7 lg:py-20">
      <section className="max-w-5xl"><div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color:'var(--accent)' }}><span className="h-px w-8" style={{ backgroundColor:'var(--accent)' }}/> OSS ENGINEERING LAB</div><h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">Not a repository list.<br/>A continuously evolving engineering workbench.</h1><p className="mt-5 max-w-4xl text-lg leading-8" style={{ color:'var(--text-muted)' }}>Real platform problems become OSS systems, integration seams are verified, and progress stays visible through commits, releases, documentation and operating records.</p></section>

      <OssStartPaths locale="en" />
      <OssEvidenceStrip locale="en" />

      <section className="mt-14"><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>SYSTEM OF SYSTEMS</div><h2 className="mt-3 text-3xl font-semibold">Read the work from standards to workloads.</h2><p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>This is not a runtime dependency graph. It shows recurring engineering practice and real usage paths across independent OSS projects.</p><OssArchitectureFlow locale="en" /></section>

      <div className="mt-16 space-y-14">{groups.map((group) => <section key={group.label}><div className="max-w-3xl"><div className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color:'var(--accent)' }}>{group.label}</div><p className="mt-2 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{group.description}</p></div><div className="mt-5 grid gap-5 md:grid-cols-2">{group.projects.map((slug) => { const project=bySlug.get(slug); if(!project) return null; const pageCount=docsByProject.get(slug)??0; return <Link key={slug} href={`/oss/en/${slug}/`} className="group rounded-2xl p-7 transition hover:-translate-y-0.5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="flex items-start justify-between gap-5"><div><div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color:'var(--text-faint)' }}>Open Source System</div><h3 className="mt-2 text-2xl font-semibold tracking-tight">{project.title}</h3><p className="mt-3 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{project.description}</p></div><div className="shrink-0 rounded-full px-3 py-1.5 text-[11px]" style={{ border:'1px solid var(--border)', color:'var(--text-faint)' }}>{pageCount} docs</div></div>{project.problem&&<div className="mt-6 border-l-2 pl-4" style={{ borderColor:'var(--signal)' }}><div className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--text-faint)' }}>Problem</div><p className="mt-2 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{project.problem}</p></div>}<div className="mt-6 flex flex-wrap gap-2">{project.tags.slice(0,6).map(tag=><span key={tag} className="rounded-md px-2.5 py-1.5 text-[11px]" style={{ backgroundColor:'var(--surface-hi)', color:'var(--text-faint)' }}>{tag}</span>)}</div><div className="mt-7 text-sm font-semibold" style={{ color:'var(--accent)' }}>Architecture · Evidence · Docs →</div></Link>; })}</div></section>)}</div>

      <section className="mt-16 border-t pt-10" style={{ borderColor:'var(--border)' }}><div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color:'var(--text-faint)' }}>DOCUMENTATION PRACTICE</div><h2 className="mt-3 text-2xl font-semibold">The work does not end at README.</h2><p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>Problem · Architecture · Decision · Verification · Operations · Troubleshooting · ADR keep implementation and engineering judgement together.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/oss/en/openforge/standards/documentation/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border:'1px solid var(--accent)', color:'var(--accent)' }}>Documentation Standard →</Link><Link href="/en/oss/story/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border:'1px solid var(--border)' }}>Engineering Story →</Link><Link href="/en/projects/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border:'1px solid var(--border)' }}>All Work →</Link></div></section>
    </div>
  </main>;
}
