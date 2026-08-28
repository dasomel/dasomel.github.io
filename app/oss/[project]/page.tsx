import { notFound } from 'next/navigation';
import { getDocs, getProjectBySlug } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import OssProjectShell from '@/components/oss/OssProjectShell';
import { OssProjectPositioning } from '@/components/oss/OssProjectPositioning';
import { OssProjectPrinciples } from '@/components/oss/OssProjectPrinciples';
import { OssProjectEvidence } from '@/components/oss/OssProjectEvidence';
import { OssProjectStartHere } from '@/components/oss/OssProjectStartHere';

export function generateStaticParams() {
  const docs = getDocs('ko').filter((d) => d.slug.includes('/'));
  const projects = [...new Set(docs.map((d) => d.slug.split('/')[0]))];
  return projects.map((project) => ({ project }));
}

export default async function OssProjectHome({ params }: { params: Promise<{ project: string }> }) {
  const { project: projectSlug } = await params;
  const project = getProjectBySlug(projectSlug, 'ko');
  if (!project) notFound();
  const docs = getDocs('ko').filter((d) => d.slug.startsWith(`${projectSlug}/`));
  const latestDocDate = docs.map((doc) => doc.lastModified || doc.date).filter(Boolean).sort().at(-1);

  return <OssProjectShell project={project.meta} docs={docs} locale="ko">
    <div className="relative mb-8 overflow-hidden rounded-2xl p-7 sm:p-9" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}>
      <div className="absolute left-0 top-0 h-full w-1.5" style={{ backgroundColor:'var(--accent)' }} />
      <div className="mb-4 flex flex-wrap items-center gap-3"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor:'var(--accent)', boxShadow:'0 0 0 4px var(--accent-dim)' }} /><span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color:'var(--accent)' }}>{project.meta.title} · OSS Project</span>{project.meta.status&&<span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--text-muted)', backgroundColor:'var(--surface-hi)', border:'1px solid var(--border)' }}>{project.meta.status}</span>}</div>
      <h2 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ color:'var(--text)' }}>{project.meta.title}</h2><p className="mt-4 max-w-4xl text-lg leading-8" style={{ color:'var(--text-muted)' }}>{project.meta.description}</p>
      <div className="mt-7 flex flex-wrap gap-2">{project.meta.tags.map((tag)=><span key={tag} className="rounded-full px-3 py-1.5 text-xs font-medium" style={{ color:'var(--text-muted)', backgroundColor:'var(--bg)', border:'1px solid var(--border)' }}>{tag}</span>)}</div>
      <div className="mt-7 grid gap-3 sm:grid-cols-3"><a href={project.meta.github} target="_blank" rel="noreferrer" className="rounded-xl px-4 py-3 text-sm font-semibold transition hover:border-[var(--accent)]" style={{ color:'var(--text)', backgroundColor:'var(--bg)', border:'1px solid var(--border)' }}><span className="block text-[10px] font-mono uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>Repository</span><span className="mt-1 block truncate">GitHub ↗</span></a><div className="rounded-xl px-4 py-3" style={{ color:'var(--text)', backgroundColor:'var(--bg)', border:'1px solid var(--border)' }}><span className="block text-[10px] font-mono uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>Documentation</span><span className="mt-1 block font-semibold">{docs.length} sections</span></div><div className="rounded-xl px-4 py-3" style={{ color:'var(--text)', backgroundColor:'var(--bg)', border:'1px solid var(--border)' }}><span className="block text-[10px] font-mono uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>Updated</span><span className="mt-1 block font-semibold">{latestDocDate??'Current'}</span></div></div>
    </div>
    <OssProjectPositioning slug={projectSlug} />
    {(project.meta.problem||project.meta.solution)&&<section className="mb-10 grid gap-4 md:grid-cols-2">{project.meta.problem&&<div className="rounded-2xl p-6" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color:'var(--text-faint)' }}>Problem</div><p className="text-[15px] leading-7" style={{ color:'var(--text-muted)' }}>{project.meta.problem}</p></div>}{project.meta.solution&&<div className="rounded-2xl p-6" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color:'var(--accent)' }}>Approach</div><p className="text-[15px] leading-7" style={{ color:'var(--text-muted)' }}>{project.meta.solution}</p></div>}</section>}
    <OssProjectEvidence slug={projectSlug} />
    <OssProjectStartHere slug={projectSlug} />
    <OssProjectPrinciples />
    <article id="oss-doc-content" className="prose cne-doc-prose max-w-3xl prose-headings:scroll-mt-24"><MDXContent source={project.content} /></article>
  </OssProjectShell>;
}
