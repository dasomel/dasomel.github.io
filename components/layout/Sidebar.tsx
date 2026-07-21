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

  const activeGroup = groups.find(([, projectDocs]) =>
    projectDocs.some((doc) => {
      const href = `${base}/docs/${doc.slug}`;
      return pathname === href || pathname === href + '/';
    })
  )?.[0];

  // Only tracks groups the user has explicitly toggled; everything else falls
  // back to the active-group default below so navigation keeps working.
  const [manualOverrides, setManualOverrides] = useState<Record<string, boolean>>({});

  const toggleGroup = (project: string, currentlyOpen: boolean) => {
    setManualOverrides((prev) => ({ ...prev, [project]: !currentlyOpen }));
  };

  return (
    <aside className="w-64 flex-shrink-0">
      <nav className="sticky top-20">
        {groups.map(([project, projectDocs]) => {
          const isOpen = manualOverrides[project] ?? project === activeGroup;
          return (
            <div key={project} className="mt-5 first:mt-0 space-y-1">
              <button
                type="button"
                onClick={() => toggleGroup(project, isOpen)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide"
              >
                <span>{project}</span>
                <svg
                  className={`h-3 w-3 flex-shrink-0 transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isOpen &&
                projectDocs.map((doc) => {
                  const href = `${base}/docs/${doc.slug}`;
                  const active = pathname === href || pathname === href + '/';
                  return (
                    <Link
                      key={doc.slug}
                      href={href}
                      className={`block px-4 py-2 text-sm rounded-lg transition-all ${
                        active
                          ? 'text-emerald-600 font-medium border-l-2 border-emerald-600 bg-emerald-50 rounded-l-none'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
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
