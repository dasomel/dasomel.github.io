import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getDocs } from '@/lib/content';
import { groupDocsByProject } from '@/lib/docs';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function DocsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const base = lang === 'en' ? '/en' : '/ko';
  const groups = groupDocsByProject(getDocs(lang));

  return (
    <main>
      <section className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16 lg:py-16">
          <div className="font-mono text-xs font-medium tracking-[0.12em]" style={{ color: 'var(--accent)' }}>DOCUMENTATION / WORKBENCH</div>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl" style={{ color: 'var(--text)' }}>
            {lang === 'en' ? 'Documentation is part of the product.' : '문서도 제품의 일부입니다.'}
          </h1>
          <p className="mt-5 max-w-5xl text-base leading-7 sm:text-lg" style={{ color: 'var(--text-muted)' }}>
            Project documentation is kept alongside source content and organized by project, not as detached marketing pages.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-16">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>PROJECT INDEX</div>
        <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{groups.map(([project]) => project).join(' · ')}</p>
      </section>

      <section className="border-y" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
        <div className="mx-auto max-w-[1440px] space-y-9 px-5 py-10 sm:px-8 lg:px-16">
          {groups.map(([project, docs]) => (
            <section key={project}>
              <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>{project.toUpperCase()}</div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {docs.map(doc => (
                  <Link key={doc.slug} href={`${base}/docs/${doc.slug}`} className="group rounded-2xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-semibold group-hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>{doc.title}</h2>
                        <div className="mt-1 font-mono text-[10px]" style={{ color: 'var(--text-faint)' }}>{project}</div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0" style={{ color: 'var(--text-faint)' }} />
                    </div>
                    {doc.description && <p className="mt-3 line-clamp-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{doc.description}</p>}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-16">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>READING PATH</div>
        <div className="mt-3 space-y-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
          <p>1. Start with architecture</p>
          <p>2. Follow project-specific Getting Started</p>
          <p>3. Use Operations docs for Day-2 work</p>
          <p>4. Return to project detail for Notes / Source / Evidence</p>
        </div>
      </section>
    </main>
  );
}
