import { notFound } from 'next/navigation';
import { getDocs, getProjectBySlug } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import OssProjectShell from '@/components/oss/OssProjectShell';

export function generateStaticParams() { return [{ project: 'openforge' }]; }

export default async function OssProjectHomeEn({ params }: { params: Promise<{ project: string }> }) {
  const { project: projectSlug } = await params;
  const project = getProjectBySlug(projectSlug, 'en');
  if (!project) notFound();
  const docs = getDocs('en').filter((d) => d.slug.startsWith(`${projectSlug}/`));
  return <OssProjectShell project={project.meta} docs={docs} locale="en"><div className="mb-10"><p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">OSS Documentation</p><h2 className="text-4xl font-bold tracking-tight">{project.meta.title}</h2><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{project.meta.description}</p></div><article className="prose prose-invert max-w-3xl prose-headings:scroll-mt-24"><MDXContent source={project.content} /></article></OssProjectShell>;
}
