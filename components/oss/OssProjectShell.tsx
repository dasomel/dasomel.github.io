'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Doc, Project } from '@/lib/types';
import OssTableOfContents from '@/components/oss/OssTableOfContents';

function sectionName(slug: string) {
  const parts = slug.split('/');
  return parts.length > 1 ? parts[1].replace(/-/g, ' ') : 'overview';
}

export default function OssProjectShell({ project, docs, locale, children }: { project: Project; docs: Doc[]; locale: 'ko' | 'en'; children: React.ReactNode }) {
  const pathname = usePathname();
  const base = locale === 'en' ? `/oss/en/${project.slug}` : `/oss/${project.slug}`;
  const overview = docs.find((d) => d.slug === `${project.slug}/overview`);
  const isOverviewActive = pathname === base || pathname === `${base}/` || pathname === `${base}/overview` || pathname === `${base}/overview/`;
  const sections = docs.reduce<Record<string, Doc[]>>((acc, doc) => {
    const key = sectionName(doc.slug);
    if (key === 'overview') return acc;
    (acc[key] ??= []).push(doc);
    return acc;
  }, {});

  const navigation = (
    <nav className="space-y-6" aria-label={locale === 'en' ? 'Documentation' : '문서'}>
      {overview && (
        <Link
          href={`${base}/`}
          className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${isOverviewActive ? 'bg-[var(--accent-dim)] font-semibold' : 'hover:bg-[var(--surface-hi)] hover:text-[var(--text)]'}`}
          style={{ color: isOverviewActive ? 'var(--accent)' : 'var(--text)' }}
        >
          <span className="h-1.5 w-1.5 rounded-full ring-2" style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent-dim)' }} />
          {locale === 'en' ? 'Overview' : '개요'}
        </Link>
      )}
      {Object.entries(sections).map(([section, pages]) => (
        <div key={section}>
          <div className="mb-1.5 px-3 text-[11px] font-mono font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>
            {section}
          </div>
          <div className="space-y-0.5">
            {pages.map((page) => {
              const pageHref = `${base}/${page.slug.split('/').slice(1).join('/')}/`;
              const pageHrefNoSlash = pageHref.slice(0, -1);
              const isActive = pathname === pageHref || pathname === pageHrefNoSlash;
              return (
                <Link
                  key={page.slug}
                  href={pageHref}
                  className={`block rounded-lg px-3 py-1.5 text-sm transition ${isActive ? 'bg-[var(--accent-dim)] font-semibold' : 'hover:bg-[var(--surface-hi)] hover:text-[var(--text)]'}`}
                  style={{
                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  }}
                >
                  {page.title}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="w-full" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_220px]">
        <aside className="hidden lg:block lg:min-h-[calc(100vh-60px)]" style={{ borderRight: '1px solid var(--border)' }}>
          <div className="sticky top-[60px] max-h-[calc(100vh-60px)] overflow-y-auto px-4 py-8">
            <Link href={locale === 'en' ? '/oss/en/' : '/oss/'} className="mb-6 inline-flex items-center gap-1.5 px-2.5 text-xs font-semibold transition hover:text-[var(--accent)]" style={{ color: 'var(--text-muted)' }}>
              ← {locale === 'en' ? 'All OSS projects' : 'OSS 프로젝트 전체'}
            </Link>
            {navigation}
          </div>
        </aside>

        <div className="min-w-0 px-6 py-8 sm:px-10 lg:px-14 lg:py-14" style={{ color: 'var(--text)' }}>
          <details className="mb-8 rounded-xl border p-4 lg:hidden" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <summary className="cursor-pointer text-sm font-semibold" style={{ color: 'var(--text)' }}>
              {locale === 'en' ? 'Browse OpenForge documentation' : 'OpenForge 문서 목차 보기'}
            </summary>
            <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--border-soft)' }}>
              <Link href={locale === 'en' ? '/oss/en/' : '/oss/'} className="mb-4 inline-flex items-center gap-1.5 px-2.5 text-xs font-semibold transition hover:text-[var(--accent)]" style={{ color: 'var(--text-muted)' }}>
                ← {locale === 'en' ? 'All OSS projects' : 'OSS 프로젝트 전체'}
              </Link>
              {navigation}
            </div>
          </details>
          {children}
        </div>

        <OssTableOfContents title={locale === 'en' ? 'On this page' : '이 페이지의 내용'} />
      </div>
    </div>
  );
}
