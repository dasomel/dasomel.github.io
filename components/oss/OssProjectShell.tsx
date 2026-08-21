import Link from 'next/link';
import type { Doc, Project } from '@/lib/types';
import OssTableOfContents from '@/components/oss/OssTableOfContents';

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
    <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[224px_minmax(0,1fr)_190px]">
      <aside className="border-r border-[#e5e3dc] bg-[#fafaf7] lg:min-h-[calc(100vh-60px)]">
        <div className="sticky top-[60px] max-h-[calc(100vh-60px)] overflow-y-auto px-4 py-7">
          <Link href={locale === 'en' ? '/oss/en/' : '/oss/'} className="mb-6 block px-2 text-xs font-medium text-[#7b7b73] transition hover:text-[#171717]">← {locale === 'en' ? 'All OSS projects' : 'OSS 프로젝트 전체'}</Link>
          <nav className="space-y-5" aria-label={locale === 'en' ? 'Documentation' : '문서'}>
            {overview && <Link href={`${base}/`} className="group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-[#171717] transition hover:bg-white"><span className="h-1.5 w-1.5 rounded-full bg-[#0f766e] ring-2 ring-[#ccfbf1]" />{locale === 'en' ? 'Overview' : '개요'}</Link>}
            {Object.entries(sections).map(([section, pages]) => (
              <div key={section}>
                <div className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a9a91]">{section}</div>
                <div className="space-y-0.5">{pages.map((page) => <Link key={page.slug} href={`${base}/${page.slug.split('/').slice(1).join('/')}/`} className="block rounded-lg border-l-2 border-transparent px-2.5 py-1.5 text-sm text-[#66665f] transition hover:border-[#99d5cf] hover:bg-white hover:text-[#171717]">{page.title}</Link>)}</div>
              </div>
            ))}
          </nav>
          <div className="mt-8 border-t border-[#e5e3dc] pt-5"><Link href={languageHref} className="inline-flex items-center rounded-md border border-[#d8d7d0] bg-white px-2.5 py-1.5 font-mono text-[10px] font-semibold text-[#45453f] transition hover:border-[#a8cbc6] hover:text-[#0f766e]">{locale === 'en' ? 'KO' : 'EN'}</Link></div>
        </div>
      </aside>
      <div className="min-w-0 bg-white px-5 py-10 sm:px-8 lg:px-12 lg:py-14">{children}</div>
      <OssTableOfContents title={locale === 'en' ? 'On this page' : '이 페이지의 내용'} />
    </div>
  );
}
