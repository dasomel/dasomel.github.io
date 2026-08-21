import Link from 'next/link';
import type { Doc, Project } from '@/lib/types';

function sectionName(slug: string) {
  const parts = slug.split('/');
  return parts.length > 1 ? parts[1].replace(/-/g, ' ') : 'overview';
}

export default function OssProjectShell({ project, docs, locale, children }: { project: Project; docs: Doc[]; locale: 'ko' | 'en'; children: React.ReactNode }) {
  const base = locale === 'en' ? `/oss/en/${project.slug}` : `/oss/${project.slug}`;
  const languageHref = locale === 'en' ? `/oss/${project.slug}/` : `/oss/en/${project.slug}/`;
  const overview = docs.find((d) => d.slug === `${project.slug}/overview`);
  const sections = docs.reduce<Record<string, Doc[]>>((acc, doc) => {
    const key = sectionName(doc.slug);
    if (key === 'overview') return acc;
    (acc[key] ??= []).push(doc);
    return acc;
  }, {});

  return (
    <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_210px]">
      <aside className="border-r border-[#deded8] bg-[#f3f3ef] lg:min-h-[calc(100vh-60px)]">
        <div className="sticky top-[60px] max-h-[calc(100vh-60px)] overflow-y-auto px-6 py-8">
          <Link href={locale === 'en' ? '/oss/en/' : '/oss/'} className="text-xs font-medium text-[#77776f] transition hover:text-[#171717]">
            ← {locale === 'en' ? 'All OSS projects' : 'OSS 프로젝트 전체'}
          </Link>
          <div className="mt-7 border-b border-[#deded8] pb-6">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#85857d]">OSS project</div>
            <h1 className="mt-2 text-xl font-semibold tracking-tight text-[#171717]">{project.title}</h1>
            <p className="mt-2 text-xs leading-5 text-[#686861]">{project.description}</p>
            <div className="mt-4 flex items-center gap-2">
              {project.github && <a className="rounded-md border border-[#d0d0c9] bg-white px-2.5 py-1.5 text-xs font-medium text-[#34342f] transition hover:border-[#b8b8b0]" href={project.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
              <Link href={languageHref} className="rounded-md border border-[#d0d0c9] bg-white px-2.5 py-1.5 font-mono text-[10px] font-semibold text-[#34342f] transition hover:border-[#b8b8b0]">{locale === 'en' ? 'KO' : 'EN'}</Link>
            </div>
          </div>

          <nav className="mt-7 space-y-6">
            {overview && (
              <Link href={`${base}/`} className="block rounded-md px-2 py-1.5 text-sm font-semibold text-[#171717] transition hover:bg-white">
                {locale === 'en' ? 'Overview' : '개요'}
              </Link>
            )}
            {Object.entries(sections).map(([section, pages]) => (
              <div key={section}>
                <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#909089]">{section}</div>
                <div className="space-y-0.5">
                  {pages.map((page) => (
                    <Link key={page.slug} href={`${base}/${page.slug.split('/').slice(1).join('/')}/`} className="block rounded-md px-2 py-1.5 text-sm text-[#686861] transition hover:bg-white hover:text-[#171717]">
                      {page.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      <div className="min-w-0 bg-white px-5 py-10 sm:px-8 lg:px-12 lg:py-14">{children}</div>

      <aside className="hidden border-l border-[#deded8] bg-white lg:block">
        <div className="sticky top-[60px] px-6 py-10">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#999990]">On this page</div>
          <div className="mt-3 h-px bg-[#ecece7]" />
          <p className="mt-4 text-xs leading-5 text-[#8a8a82]">Headings and reference links appear here as the documentation grows.</p>
        </div>
      </aside>
    </div>
  );
}
