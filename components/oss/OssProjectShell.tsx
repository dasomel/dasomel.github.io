import Link from 'next/link';
import type { Doc, Project } from '@/lib/types';

function sectionName(slug: string) {
  const parts = slug.split('/');
  return parts.length > 1 ? parts[1].replace(/-/g, ' ') : 'overview';
}

export default function OssProjectShell({ project, docs, locale, children }: { project: Project; docs: Doc[]; locale: 'ko' | 'en'; children: React.ReactNode }) {
  const base = locale === 'en' ? `/oss/en/${project.slug}` : `/oss/${project.slug}`;
  const overview = docs.find((d) => d.slug === `${project.slug}/overview`);
  const sections = docs.reduce<Record<string, Doc[]>>((acc, doc) => {
    const key = sectionName(doc.slug);
    (acc[key] ??= []).push(doc);
    return acc;
  }, {});
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="border-b border-white/10 lg:min-h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r">
        <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto px-5 py-8">
          <Link href={locale === 'en' ? '/oss/en/' : '/oss/'} className="text-xs text-slate-400 hover:text-white">← {locale === 'en' ? 'All OSS projects' : 'OSS 프로젝트 전체'}</Link>
          <h1 className="mt-5 text-xl font-semibold">{project.title}</h1>
          <p className="mt-2 text-xs leading-5 text-slate-500">{project.description}</p>
          {project.github && <a className="mt-4 inline-block text-xs text-cyan-300 hover:text-cyan-200" href={project.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
          <nav className="mt-8 space-y-5">
            {overview && <Link href={`${base}/`} className="block text-sm font-medium text-cyan-200">{locale === 'en' ? 'Overview' : '개요'}</Link>}
            {Object.entries(sections).map(([section, pages]) => (
              <div key={section}>
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{section}</div>
                <div className="space-y-1">
                  {pages.map((page) => <Link key={page.slug} href={`${base}/${page.slug.split('/').slice(1).join('/')}/`} className="block rounded-md px-2 py-1.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white">{page.title}</Link>)}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>
      <div className="min-w-0 px-5 py-10 sm:px-8 lg:px-12 lg:py-14">{children}</div>
    </div>
  );
}
