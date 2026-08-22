import { notFound } from 'next/navigation';
import { getDocs, getDocBySlug, getProjectBySlug } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import OssProjectShell from '@/components/oss/OssProjectShell';

export function generateStaticParams() {
  const docs = getDocs('en').filter((d) => d.slug.includes('/'));
  return docs.map((doc) => {
    const [project, ...slug] = doc.slug.split('/');
    return {
      project,
      slug,
    };
  });
}

export default async function OssDocPageEn({ params }: { params: Promise<{ project: string; slug: string[] }> }) {
  const { project: projectSlug, slug: segments } = await params;
  const project = getProjectBySlug(projectSlug, 'en');
  const doc = getDocBySlug(`${projectSlug}/${segments.join('/')}`, 'en');
  if (!project || !doc) notFound();
  const docs = getDocs('en').filter((d) => d.slug.startsWith(`${projectSlug}/`));

  return (
    <OssProjectShell project={project.meta} docs={docs} locale="en">
      <div className="mb-10 border-b pb-8" style={{ borderColor: 'var(--border-soft)' }}>
        <div className="mb-3 font-mono text-[11px] font-medium" style={{ color: 'var(--text-faint)' }}>/oss/en/{projectSlug}/{segments.join('/')}</div>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: 'var(--text)' }}>{doc.meta.title}</h2>
        {doc.meta.description && <p className="mt-4 max-w-3xl text-lg leading-8" style={{ color: 'var(--text-muted)' }}>{doc.meta.description}</p>}
      </div>
      <article id="oss-doc-content" className="prose cne-doc-prose max-w-3xl prose-headings:scroll-mt-24">
        <MDXContent source={doc.content} />
      </article>
    </OssProjectShell>
  );
}
