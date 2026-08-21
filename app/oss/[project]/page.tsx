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
      <div className="mb-10 border-b border-[#ecece7] pb-8">
        <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#85857d]">OSS Documentation</p>
        <h2 className="text-4xl font-bold tracking-tight text-[#171717] sm:text-5xl">{project.meta.title}</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#686861]">{project.meta.description}</p>
      </div>
      <article className="prose prose-neutral max-w-3xl prose-headings:scroll-mt-24 prose-a:text-[#0f766e] prose-a:no-underline hover:prose-a:underline">
        <MDXContent source={project.content} />
      </article>
    </OssProjectShell>
  );
}
