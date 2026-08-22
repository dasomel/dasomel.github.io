import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getDocs } from '@/lib/content';
import { groupDocsByProject } from '@/lib/docs';
import { routing } from '@/i18n/routing';
import styles from '../ContentCollections.module.css';

export function generateStaticParams() { return routing.locales.map((locale) => ({ locale })); }

export default async function DocsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'nav' });
  const groups = groupDocsByProject(getDocs(lang).filter((doc) => !doc.slug.includes('/')));
  const base = lang === 'en' ? '/en' : '/ko';
  const count = groups.reduce((total, [, docs]) => total + docs.length, 0);
  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 slide-enter-content ${styles['collection-page']}`}>
      <section className={`${styles['collection-hero']} mb-10`}><div className={styles['collection-kicker']}>REFERENCE / DOCS</div><div className="mt-3 flex items-end justify-between gap-5"><div><h1 className="text-3xl sm:text-5xl font-semibold tracking-tight" style={{ color: 'var(--text)' }}>{t('docs')}</h1><p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed" style={{ color:'var(--text-muted)' }}>{count} references across {groups.length} projects.</p></div><div className="font-mono text-xs" style={{ color:'var(--text-faint)' }}>STATIC / VERIFIED</div></div></section>
      <div className="space-y-10">{groups.map(([project, projectDocs]) => <section key={project} className={styles['docs-group']}><div className="flex items-baseline justify-between gap-4 mb-3"><div><div className="workbench-eyebrow mb-1">PROJECT</div><h2 className="text-lg sm:text-xl font-semibold" style={{ color:'var(--text)' }}>{project}</h2></div><span className="font-mono text-xs" style={{ color:'var(--text-faint)' }}>{projectDocs.length}</span></div><div className={styles['docs-list']}>{projectDocs.map(doc => <Link key={doc.slug} href={`${base}/docs/${doc.slug}`} className={`${styles['docs-card']} group`}><div className="flex items-start justify-between gap-3"><span className="font-medium group-hover:text-[var(--accent)] transition-colors" style={{ color:'var(--text)' }}>{doc.title}</span><span style={{ color:'var(--text-faint)' }}>↗</span></div>{doc.description && <p className="text-xs mt-3 line-clamp-2" style={{ color:'var(--text-muted)' }}>{doc.description}</p>}{doc.lastModified && <div className="font-mono text-[0.65rem] mt-4" style={{ color:'var(--text-faint)' }}>{doc.lastModified.slice(0,10)}</div>}</Link>)}</div></section>)}</div>
    </div>
  );
}
