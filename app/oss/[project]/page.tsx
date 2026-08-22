import { notFound } from 'next/navigation';
import { getDocs, getProjectBySlug } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import OssProjectShell from '@/components/oss/OssProjectShell';

export function generateStaticParams() {
  return [{ project: 'openforge' }];
}

export default async function OssProjectHome({ params }: { params: Promise<{ project: string }> }) {
  const { project: projectSlug } = await params;
  const project = getProjectBySlug(projectSlug, 'ko');
  if (!project) notFound();
  const docs = getDocs('ko').filter((d) => d.slug.startsWith(`${projectSlug}/`));

  return (
    <OssProjectShell project={project.meta} docs={docs} locale="ko">
      <div className="relative mb-10 overflow-hidden rounded-2xl p-7 sm:p-9" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="absolute left-0 top-0 h-full w-1.5" style={{ backgroundColor: 'var(--accent)' }} />
        <div className="mb-4 flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 0 4px var(--accent-dim)' }} />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>OpenForge Documentation</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: 'var(--text)' }}>{project.meta.title}</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8" style={{ color: 'var(--text-muted)' }}>{project.meta.description}</p>
      </div>
      <article id="oss-doc-content" className="prose cne-doc-prose max-w-3xl prose-headings:scroll-mt-24">
        <MDXContent source={project.content} />
      </article>
    </OssProjectShell>
  );
}
