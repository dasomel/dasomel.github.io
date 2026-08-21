import Link from 'next/link';
import type { Doc, Project } from '@/lib/types';
import OssTableOfContents from '@/components/oss/OssTableOfContents';

function sectionName(slug: string) {
  const parts = slug.split('/');
  return parts.length > 1 ? parts[1].replace(/-/g, ' ') : 'overview';
}

export default function OssProjectShell({ project, docs, locale, children }: { project: Project; docs: Doc[]; locale: 'ko' | 'en'; children: React.ReactNode }) {
  const base = locale === 'en' ? `/oss/en/${project.slug}` : `/oss/${project.slug}`;
  const overview = docs.find((d) => d.slug === `${project.slug}/overview`);
  const sections = docs.reduce<Record<string, Doc[]>>((acc, doc) => {
    const key = sectionName(doc.slug);
    if (key === 'overview') return acc;
    (acc[key] ??= []).push(doc);
    return acc;
  }, {});

  return (
    <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[224px_minmax(0,1fr)_190px]" style={{ backgroundColor: 'var(--bg)' }}>
      <aside className="lg:min-h-[calc(100vh-60px)]" style={{ borderRight: '1px solid var(--border)', backgroundColor: 'var(--bg-subtle)' }}>
        <div className="sticky top-[60px] max-h-[calc(100vh-60px)] overflow-y-auto px-4 py-7">
          <Link href={locale === 'en' ? '/oss/en/' : '/oss/'} className="mb-6 block px-2 text-xs font-medium transition" style={{ color: 'var(--text-faint)' }}>← {locale === 'en' ? 'All OSS projects' : 'OSS 프로젝트 전체'}</Link>
          <nav className="space-y-5" aria-label={locale === 'en' ? 'Documentation' : '문서'}>
            {overview && <Link href={`${base}/`} className="group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold transition" style={{ color: 'var(--text)' }}><span className="h-1.5 w-1.5 rounded-full ring-2" style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent-dim)' }} />{locale === 'en' ? 'Overview' : '개요'}</Link>}
            {Object.entries(sections).map(([section, pages]) => (
              <div key={section}>
                <div className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--text-faint)' }}>{section}</div>
                <div className="space-y-0.5">{pages.map((page) => <Link key={page.slug} href={`${base}/${page.slug.split('/').slice(1).join('/')}/`} className="block rounded-lg border-l-2 border-transparent px-2.5 py-1.5 text-sm transition" style={{ color: 'var(--text-muted)' }}>{page.title}</Link>)}</div>
              </div>
            ))}
          </nav>
        </div>
      </aside>
      <div id="oss-doc-content" className="min-w-0 px-5 py-10 sm:px-8 lg:px-12 lg:py-14" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>{children}</div>
      <OssTableOfContents title={locale === 'en' ? 'On this page' : '이 페이지의 내용'} />
    </div>
  );
}
