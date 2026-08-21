import { notFound } from 'next/navigation';
import { getDocs, getProjectBySlug } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import OssProjectShell from '@/components/oss/OssProjectShell';

export function generateStaticParams() {
  return [{ project: 'openforge' }];
}

export default async function OssProjectHomeEn({ params }: { params: Promise<{ project: string }> }) {
  const { project: projectSlug } = await params;
  const project = getProjectBySlug(projectSlug, 'en');
  if (!project) notFound();
  const docs = getDocs('en').filter((d) => d.slug.startsWith(`${projectSlug}/`));

  return (
    <OssProjectShell project={project.meta} docs={docs} locale="en">
      <div className="relative mb-10 overflow-hidden rounded-2xl border border-[#e5e3dc] bg-gradient-to-br from-[#f5fbfa] via-white to-[#f8f7f2] px-7 py-8 sm:px-9 sm:py-10">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-[#0f766e]" />
        <div className="mb-4 flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#0f766e] shadow-[0_0_0_5px_#ccfbf1]" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f766e]">OpenForge Documentation</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-[#171717] sm:text-5xl">{project.meta.title}</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5f625d]">{project.meta.description}</p>
      </div>
      <article className="prose prose-neutral max-w-3xl prose-headings:scroll-mt-24 prose-headings:text-[#20201d] prose-a:text-[#0f766e] prose-a:no-underline hover:prose-a:underline prose-code:text-[#33413e] prose-strong:text-[#20201d]">
        <MDXContent source={project.content} />
      </article>
    </OssProjectShell>
  );
}
