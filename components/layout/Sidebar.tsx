'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Doc } from '@/lib/types';

interface SidebarProps {
  docs: Doc[];
  locale: 'ko' | 'en';
}

export default function Sidebar({ docs, locale }: SidebarProps) {
  const pathname = usePathname();
  const base = locale === 'en' ? '/en' : '/ko';

  return (
    <aside className="w-64 flex-shrink-0">
      <nav className="sticky top-20 space-y-1">
        {docs.map((doc) => {
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
      </nav>
    </aside>
  );
}
