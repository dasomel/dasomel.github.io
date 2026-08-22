import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getDocs } from '@/lib/content';
import { groupDocsByProject } from '@/lib/docs';
import { routing } from '@/i18n/routing';

export function generateStaticParams() { return routing.locales.map((locale) => ({ locale })); }

export default async function DocsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'nav' });
  // Hierarchical OSS documentation belongs to /oss, not the general workbench Docs lane.
  const groups = groupDocsByProject(getDocs(lang).filter((doc) => !doc.slug.includes('/')));
  const base = lang === 'en' ? '/en' : '/ko';
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 slide-enter-content">
      <div className="workbench-eyebrow mb-3">DOCUMENTATION</div>
      <h1 className="text-3xl font-bold mb-10" style={{ color: 'var(--text)' }}>{t('docs')}</h1>
      {groups.map(([project, projectDocs]) => (
        <section key={project} className="mt-10 first:mt-0">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-faint)' }}>{project}</h2>
          <ul className="space-y-2">
            {projectDocs.map((doc) => (
              <li key={doc.slug}>
                <Link href={`${base}/docs/${doc.slug}`} className="flex items-center justify-between p-4 rounded-xl transition-all hover:bg-[var(--surface-hi)] hover:border-[var(--border-hi)] group" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                  <span className="font-medium group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>{doc.title}</span>
                  {doc.lastModified && <span className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>{doc.lastModified.slice(0, 10)}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
