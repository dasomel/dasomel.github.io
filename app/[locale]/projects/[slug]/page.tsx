import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjects, getProjectBySlug, getNotes, getDocs, getTechDigests } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import { ProjectVisual } from '@/components/projects/ProjectVisual';
import { ProjectSourceSnapshot } from '@/components/projects/ProjectSourceSnapshot';
import { routing } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, GitFork, ArrowUpRight, FileText, BookOpen, Activity, Newspaper } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import styles from './ProjectDetailRefresh.module.css';

const visualProjects = new Set(['narwhal', 'beluga', 'oh-my-cursor', 'kubemetal', 'kube-ready-box', 'ldapium', 'nfs-quota-agent', 'egovframe-launcher', 'k-paas']);
const projectImage = (slug: string) => `/images/projects/${visualProjects.has(slug) ? slug : 'default'}.svg`;

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  routing.locales.forEach(locale => {
    getProjects(locale as 'ko' | 'en').forEach(p => params.push({ locale, slug: p.slug }));
  });
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = locale as 'ko' | 'en';
  const result = getProjectBySlug(slug, lang);
  if (!result) return {};
  const { meta } = result;
  const url = `https://cne.io.kr/${lang}/projects/${slug}`;
  const image = projectImage(slug);
  return { title: meta.title, description: meta.description, alternates: { canonical: url }, openGraph: { type: 'article', url, title: meta.title, description: meta.description, images: [{ url: image, alt: `${meta.title} project visual` }] }, twitter: { card: 'summary_large_image', title: meta.title, description: meta.description, images: [image] } };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const lang = locale as 'ko' | 'en';
  const result = getProjectBySlug(slug, lang);
  if (!result) notFound();
  const { meta, content } = result;
  const tc = await getTranslations({ locale, namespace: 'common' });
  const tp = await getTranslations({ locale, namespace: 'project' });
  const base = lang === 'en' ? '/en' : '/ko';
  const image = projectImage(slug);
  const notes = getNotes(lang);
  const docs = getDocs(lang);
  const digests = getTechDigests(lang);
  const projectTerms = new Set([slug.toLowerCase(), meta.title.toLowerCase(), ...meta.tags.map(tag => tag.toLowerCase())]);
  const explicitlyLinkedNotes = notes.filter(note => note.projects?.includes(slug));
  const relatedNotes = (explicitlyLinkedNotes.length > 0 ? explicitlyLinkedNotes : notes.filter(note => [...note.tags, note.title, note.description ?? ''].some(value => { const normalized = value.toLowerCase(); return projectTerms.has(normalized) || normalized.includes(slug.toLowerCase()) || normalized.includes(meta.title.toLowerCase()); }))).slice(0, 4);
  const relatedDocs = docs.filter(doc => { const haystack = `${doc.project} ${doc.slug} ${doc.title}`.toLowerCase(); return haystack.includes(slug.toLowerCase()) || haystack.includes(meta.title.toLowerCase()); }).slice(0, 6);
  const relatedDigests = digests.filter(digest => digest.projects?.includes(slug)).slice(0, 4);

  return (
    <div className={styles.detail}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link href={`${base}/projects`} className="inline-flex items-center gap-2 text-sm mb-5 transition-colors" style={{ color: 'var(--text-muted)' }}><ArrowLeft className="w-4 h-4" aria-hidden="true" />{tc('back')}</Link>

        <header className="project-hero">
          <div className="project-hero-copy">
            <div className="project-kicker">
              <span className="workbench-eyebrow">OSS PROJECT</span>
              {meta.type === 'fork' && <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}><GitFork className="w-3 h-3" aria-hidden="true" />Fork</span>}
              {meta.featured && <span className="text-[10px] font-mono px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>ACTIVE</span>}
            </div>
            <h1 className="project-title font-semibold" style={{ color: 'var(--text)' }}>{meta.title}</h1>
            <p className="project-lede mt-6" style={{ color: 'var(--text-muted)' }}>{meta.description}</p>
            <div className="project-actions">
              {meta.github && <Button asChild size="sm"><a href={meta.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2"><Github className="w-4 h-4" aria-hidden="true" />{tc('github')}<ArrowUpRight className="w-3 h-3" /></a></Button>}
              <Link href={`${base}/projects`} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>All Projects</Link>
            </div>
            <div className="project-tags">{meta.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}</div>
          </div>
          <div className="project-visual-frame">
            <ProjectVisual src={image} alt="" className="block w-full h-auto" loading="eager" />
          </div>
        </header>

        {meta.github && <ProjectSourceSnapshot github={meta.github} lang={lang} />}

        {(meta.problem || meta.solution) && <section className="project-evidence" aria-label={tp('summary')}>
          {meta.problem && <div className="project-problem"><div className="project-evidence-label">{tp('problem')}</div><p className="project-evidence-text">{meta.problem}</p></div>}
          {meta.solution && <div className="project-response"><div className="project-evidence-label">{tp('response')}</div><p className="project-evidence-text">{meta.solution}</p></div>}
        </section>}

        <section className="project-signals" aria-label={tp('context')}>
          <div className="project-signal"><div className="project-signal-label"><Activity className="inline w-3 h-3 mr-1" aria-hidden="true" />Signals</div><div className="project-signal-value">{meta.tags.length}</div><div className="text-xs" style={{ color: 'var(--text-muted)' }}>{tp('signals_desc')}</div></div>
          <div className="project-signal"><div className="project-signal-label"><BookOpen className="inline w-3 h-3 mr-1" aria-hidden="true" />Docs</div><div className="project-signal-value">{relatedDocs.length}</div><div className="text-xs" style={{ color: 'var(--text-muted)' }}>{tp('docs_desc')}</div></div>
          <div className="project-signal"><div className="project-signal-label"><FileText className="inline w-3 h-3 mr-1" aria-hidden="true" />Notes</div><div className="project-signal-value">{relatedNotes.length}</div><div className="text-xs" style={{ color: 'var(--text-muted)' }}>{tp('notes_desc')}</div></div>
          <div className="project-signal"><div className="project-signal-label"><Newspaper className="inline w-3 h-3 mr-1" aria-hidden="true" />Digest</div><div className="project-signal-value">{relatedDigests.length}</div><div className="text-xs" style={{ color: 'var(--text-muted)' }}>Explicit source links</div></div>
        </section>

        {(relatedDocs.length > 0 || relatedNotes.length > 0 || relatedDigests.length > 0) && <section className="project-links-grid">
          {relatedDocs.length > 0 && <div className="project-link-group"><h2>{tp('docs')}</h2><div className="project-link-list">{relatedDocs.map(doc => <Link key={doc.slug} href={`${base}/docs/${doc.slug}`} className="project-link-card group"><div><div className="project-link-title group-hover:text-[var(--accent)] transition-colors">{doc.title}</div>{doc.description && <div className="project-link-meta line-clamp-2">{doc.description}</div>}</div><ArrowUpRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-faint)' }} /></Link>)}</div></div>}
          {relatedNotes.length > 0 && <div className="project-link-group"><h2>{tp('related_notes')}</h2><div className="project-link-list">{relatedNotes.map(note => <Link key={note.slug} href={`${base}/posts/${note.slug}`} className="project-link-card group"><div><div className="project-link-title group-hover:text-[var(--accent)] transition-colors">{note.title}</div><div className="project-link-meta">{note.pubDate.slice(0, 10)} · {note.tags.slice(0, 3).join(' · ')}</div></div><ArrowUpRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-faint)' }} /></Link>)}</div></div>}
          {relatedDigests.length > 0 && <div className="project-link-group"><h2>Tech Digest</h2><div className="project-link-list">{relatedDigests.map(digest => <Link key={digest.slug} href={`${base}/posts/${digest.slug}`} className="project-link-card group"><div><div className="project-link-title group-hover:text-[var(--accent)] transition-colors">{digest.title}</div><div className="project-link-meta">{digest.pubDate.slice(0, 10)} · {digest.tags.slice(0, 3).join(' · ')}</div></div><ArrowUpRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-faint)' }} /></Link>)}</div></div>}
        </section>}

        <div className="project-body-wrap">
          <article className="project-body prose cne-doc-prose max-w-none prose-headings:font-bold"><MDXContent source={content} /></article>
          <aside className="project-body-aside hidden lg:block"><div className="project-body-aside-label">PROJECT RECORD</div><div className="project-body-aside-box">This page connects the project narrative to its source repository, documentation, engineering notes, and curated digest references.</div></aside>
        </div>
      </div>
    </div>
  );
}
