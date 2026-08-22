'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { Doc } from '@/lib/types';
import { groupDocsByProject } from '@/lib/docs';

interface SidebarProps {
  docs: Doc[];
  locale: 'ko' | 'en';
}

export default function Sidebar({ docs, locale }: SidebarProps) {
  const pathname = usePathname();
  const base = locale === 'en' ? '/en' : '/ko';
  const groups = groupDocsByProject(docs);
  const activeGroup = groups.find(([, projectDocs]) => projectDocs.some((doc) => {
    const href = `${base}/docs/${doc.slug}`;
    return pathname === href || pathname === href + '/';
  }))?.[0];
  const [manualOverrides, setManualOverrides] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleGroup = (project: string, currentlyOpen: boolean) => {
    setManualOverrides((prev) => ({ ...prev, [project]: !currentlyOpen }));
  };

  return (
    <aside className="w-full lg:w-64 lg:flex-shrink-0 mb-6 lg:mb-0">
      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        aria-expanded={mobileOpen}
        className="lg:hidden w-full flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium"
        style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
      >
        <span>{locale === 'en' ? 'All documents' : '문서 목록'}</span>
        <svg className={`h-4 w-4 flex-shrink-0 transition-transform ${mobileOpen ? 'rotate-0' : '-rotate-90'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      <nav className={`${mobileOpen ? 'block' : 'hidden'} mt-2 max-h-[60vh] overflow-y-auto lg:block lg:mt-0 lg:max-h-none lg:overflow-visible lg:sticky lg:top-20`}>
        {groups.map(([project, projectDocs]) => {
          const isOpen = manualOverrides[project] ?? project === activeGroup;
          return (
            <div key={project} className="mt-5 first:mt-0 space-y-1">
              <button
                type="button"
                onClick={() => toggleGroup(project, isOpen)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-[0.14em] transition hover:text-[var(--text)]"
                style={{ color: 'var(--text-faint)' }}
              >
                <span>{project}</span>
                <svg className={`h-3 w-3 flex-shrink-0 transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              {isOpen && projectDocs.map((doc) => {
                const href = `${base}/docs/${doc.slug}`;
                const active = pathname === href || pathname === href + '/';
                return (
                  <Link
                    key={doc.slug}
                    href={href}
                    className={`block px-3.5 py-1.5 text-sm rounded-lg transition-all ${active ? 'bg-[var(--accent-dim)] font-semibold' : 'hover:bg-[var(--surface-hi)] hover:text-[var(--text)]'}`}
                    style={active
                      ? { color: 'var(--accent)', borderLeft: '2px solid var(--accent)', borderRadius: '0 0.5rem 0.5rem 0' }
                      : { color: 'var(--text-muted)' }}
                  >
                    {doc.title}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
