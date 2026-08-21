import { notFound } from 'next/navigation';
import { getDocs, getDocBySlug } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import OssProjectShell from '@/components/oss/OssProjectShell';
import { getProjectBySlug } from '@/lib/content';

export function generateStaticParams() {
  return ['overview','concepts','getting-started','standards','templates','blueprints','operations','reference','troubleshooting','adr'].map((section) => ({ project: 'openforge', slug: [section] }));
}

export default function OssDocPage({ params }: { params: { project: string; slug: string[] } }) {
  const project = getProjectBySlug(params.project, 'ko');
  const slug = `${params.project}/${params.slug.join('/')}`;
  const doc = getDocBySlug(slug, 'ko');
  if (!project || !doc) notFound();
  const docs = getDocs('ko').filter((d) => d.slug.startsWith(`${params.project}/`));
  return <OssProjectShell project={project.meta} docs={docs} locale="ko"><div className="mb-10"><div className="mb-3 font-mono text-xs text-slate-500">/oss/{params.project}/{params.slug.join('/')}</div><h2 className="text-4xl font-bold tracking-tight">{doc.meta.title}</h2>{doc.meta.description && <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{doc.meta.description}</p>}</div><article className="prose prose-invert max-w-3xl prose-headings:scroll-mt-24"><MDXContent source={doc.content} /></article></OssProjectShell>;
}
