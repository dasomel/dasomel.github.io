import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjects, getProjectBySlug, getNotes, getDocs } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import { ProjectVisual } from '@/components/projects/ProjectVisual';
import { routing } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, GitFork, ArrowUpRight, FileText, BookOpen, Activity } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

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
  const image = `/images/projects/${['narwhal', 'beluga', 'kubemetal', 'kube-ready-box', 'ldapium', 'nfs-quota-agent', 'egovframe-launcher'].includes(slug) ? slug : 'default'}.svg`;
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
  const visualProjects = new Set(['narwhal', 'beluga', 'kubemetal', 'kube-ready-box', 'ldapium', 'nfs-quota-agent', 'egovframe-launcher']);
  const image = `/images/projects/${visualProjects.has(slug) ? slug : 'default'}.svg`;
  const notes = getNotes(lang);
  const docs = getDocs(lang);
  const projectTerms = new Set([slug.toLowerCase(), meta.title.toLowerCase(), ...meta.tags.map(tag => tag.toLowerCase())]);
  const relatedNotes = notes.filter(note => [...note.tags, note.title, note.description ?? ''].some(value => { const normalized = value.toLowerCase(); return projectTerms.has(normalized) || normalized.includes(slug.toLowerCase()) || normalized.includes(meta.title.toLowerCase()); })).slice(0, 4);
  const relatedDocs = docs.filter(doc => { const haystack = `${doc.project} ${doc.slug} ${doc.title}`.toLowerCase(); return haystack.includes(slug.toLowerCase()) || haystack.includes(meta.title.toLowerCase()); }).slice(0, 6);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <Link href={`${base}/projects`} className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: 'var(--text-muted)' }}><ArrowLeft className="w-4 h-4" aria-hidden="true" />{tc('back')}</Link>
      <header className="mb-10">
        <div className="overflow-hidden rounded-2xl mb-7" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><ProjectVisual src={image} alt="" className="block w-full h-auto" loading="eager" /></div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {meta.type === 'fork' && <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}><GitFork className="w-3 h-3" aria-hidden="true" />Fork</span>}
          {meta.featured && <span className="text-xs font-mono px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>Active</span>}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4" style={{ color: 'var(--text)' }}>{meta.title}</h1>
        <p className="text-base sm:text-lg max-w-3xl leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>{meta.description}</p>
        <div className="flex items-center gap-3 flex-wrap">{meta.github && <Button asChild size="sm"><a href={meta.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2"><Github className="w-4 h-4" aria-hidden="true" />{tc('github')}<ArrowUpRight className="w-3 h-3" aria-hidden="true" /></a></Button>}{meta.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}</div>
      </header>
      {(meta.problem || meta.solution) && <section className="grid md:grid-cols-2 gap-3 mb-10" aria-label={tp('summary')}>
        {meta.problem && <div className="rounded-2xl p-5" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-faint)' }}>{tp('problem')}</div><p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{meta.problem}</p></div>}
        {meta.solution && <div className="rounded-2xl p-5" style={{ border: '1px solid var(--accent-glow)', backgroundColor: 'var(--accent-dim)' }}><div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>{tp('response')}</div><p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{meta.solution}</p></div>}
      </section>}
      <section className="grid sm:grid-cols-3 gap-3 mb-10" aria-label={tp('context')}>
        <div className="rounded-2xl p-5" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-faint)' }}><Activity className="w-3.5 h-3.5" aria-hidden="true" />{tp('signals')}</div><div className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>{meta.tags.length}</div><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{tp('signals_desc')}</p></div>
        <div className="rounded-2xl p-5" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-faint)' }}><BookOpen className="w-3.5 h-3.5" aria-hidden="true" />{tp('docs')}</div><div className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>{relatedDocs.length}</div><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{tp('docs_desc')}</p></div>
        <div className="rounded-2xl p-5" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-faint)' }}><FileText className="w-3.5 h-3.5" aria-hidden="true" />{tp('related_notes')}</div><div className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>{relatedNotes.length}</div><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{tp('notes_desc')}</p></div>
      </section>
      {(relatedDocs.length > 0 || relatedNotes.length > 0) && <section className="grid lg:grid-cols-2 gap-5 mb-12">
        {relatedDocs.length > 0 && <div><div className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-faint)' }}>{tp('docs')}</div><div className="space-y-2">{relatedDocs.map(doc => <Link key={doc.slug} href={`${base}/docs/${doc.slug}`} className="group flex items-center justify-between gap-3 rounded-xl p-4" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><div><div className="text-sm font-medium group-hover:text-emerald-500" style={{ color: 'var(--text)' }}>{doc.title}</div>{doc.description && <div className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{doc.description}</div>}</div><ArrowUpRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-faint)' }} aria-hidden="true" /></Link>)}</div></div>}
        {relatedNotes.length > 0 && <div><div className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-faint)' }}>{tp('related_notes')}</div><div className="space-y-2">{relatedNotes.map(note => <Link key={note.slug} href={`${base}/posts/${note.slug}`} className="group block rounded-xl p-4" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><div className="text-sm font-medium group-hover:text-emerald-500" style={{ color: 'var(--text)' }}>{note.title}</div><div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{note.pubDate.slice(0, 10)} · {note.tags.slice(0, 3).join(' · ')}</div></Link>)}</div></div>}
      </section>}
      <article className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-a:text-emerald-600"><MDXContent source={content} /></article>
    </div>
  );
}
