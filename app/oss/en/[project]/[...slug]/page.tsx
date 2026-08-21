import { notFound } from 'next/navigation';
import { getDocs, getDocBySlug, getProjectBySlug } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import OssProjectShell from '@/components/oss/OssProjectShell';

export function generateStaticParams() {
  return ['overview', 'concepts', 'getting-started', 'standards', 'templates', 'blueprints', 'operations', 'reference', 'troubleshooting', 'adr'].map((section) => ({
    project: 'openforge',
    slug: [section],
  }));
}

export default async function OssDocPageEn({ params }: { params: Promise<{ project: string; slug: string[] }> }) {
  const { project: projectSlug, slug: segments } = await params;
  const project = getProjectBySlug(projectSlug, 'en');
  const doc = getDocBySlug(`${projectSlug}/${segments.join('/')}`, 'en');
  if (!project || !doc) notFound();
  const docs = getDocs('en').filter((d) => d.slug.startsWith(`${projectSlug}/`));

  return (
    <OssProjectShell project={project.meta} docs={docs} locale="en">
      <div className="mb-10 border-b border-[#ecece7] pb-8">
        <div className="mb-3 font-mono text-[11px] font-medium text-[#9a9a92]">/oss/en/{projectSlug}/{segments.join('/')}</div>
        <h2 className="text-4xl font-bold tracking-tight text-[#171717] sm:text-5xl">{doc.meta.title}</h2>
        {doc.meta.description && <p className="mt-4 max-w-3xl text-lg leading-8 text-[#686861]">{doc.meta.description}</p>}
      </div>
      <article id="oss-doc-content" className="prose prose-neutral max-w-3xl prose-headings:scroll-mt-24 prose-a:text-[#0f766e] prose-a:no-underline hover:prose-a:underline">
        <MDXContent source={doc.content} />
      </article>
    </OssProjectShell>
  );
}
