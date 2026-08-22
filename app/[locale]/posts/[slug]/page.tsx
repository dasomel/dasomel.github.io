import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getPostBySlug, getPosts, getProjects } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { MDXContent } from '@/components/MDXContent';
import { routing } from '@/i18n/routing';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import readingTime from 'reading-time';
import styles from './PostRefresh.module.css';

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  routing.locales.forEach(locale => {
    const lang = locale as 'ko' | 'en';
    getPosts(lang).forEach(p => params.push({ locale, slug: p.slug }));
  });
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = locale as 'ko' | 'en';
  const result = getPostBySlug(slug, lang);
  if (!result) return {};
  const { meta } = result;
  const url = `https://cne.io.kr/${lang}/posts/${slug}`;
  const image = meta.image ?? '/images/notes-cover.svg';
  const digest = slug.startsWith('daily-digest-');
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title: meta.title, description: meta.description, publishedTime: meta.pubDate, modifiedTime: meta.updatedDate, tags: meta.tags, images: [{ url: image, alt: `${meta.title} cover` }] },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description, images: [image] },
    other: { 'article:section': digest ? 'Tech Digest' : 'Engineering Notes' },
  };
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const lang = locale as 'ko' | 'en';
  const result = getPostBySlug(slug, lang);
  if (!result) notFound();
  const { meta, content } = result;
  const t = await getTranslations({ locale, namespace: 'common' });
  const p = await getTranslations({ locale, namespace: 'post' });
  const base = lang === 'en' ? '/en' : '/ko';
  const digest = slug.startsWith('daily-digest-');
  const projects = getProjects(lang);
  const read = readingTime(content);
  const explicitlyLinkedProjects = projects.filter(project => meta.projects?.includes(project.slug));
  const relatedProjects = digest
    ? explicitlyLinkedProjects
    : explicitlyLinkedProjects.length > 0
      ? explicitlyLinkedProjects
      : projects.filter(project => {
          const terms = [project.slug, project.title, ...project.tags].map(v => v.toLowerCase());
          return meta.tags.some(tag => terms.includes(tag.toLowerCase())) || meta.title.toLowerCase().includes(project.title.toLowerCase());
        }).slice(0, 3);

  return (
    <div className="post-shell max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="sr-only">{styles.refresh}</div>
      <Link href={digest ? `${base}/tech-digest` : `${base}/notes`} className="post-back inline-flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />{t('back')}
      </Link>

      <header className="post-hero mb-12">
        <div className="post-hero-copy">
          <div className="post-kicker-row flex items-center gap-3 flex-wrap mb-5">
            <span className="post-kicker text-[10px] uppercase tracking-[.18em] font-mono px-2.5 py-1.5 rounded-full" style={{ backgroundColor: digest ? 'var(--surface)' : 'var(--accent-dim)', color: digest ? 'var(--text-muted)' : 'var(--accent)', border: '1px solid var(--border)' }}>
              {digest ? p('tech_digest') : p('engineering_note')}
            </span>
            <time className="font-mono text-xs" dateTime={meta.pubDate} style={{ color: 'var(--text-faint)' }}>{meta.pubDate.slice(0, 10)}</time>
            <span className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>{Math.max(1, Math.ceil(read.minutes))} {p('min_read')}</span>
            {meta.updatedDate && <time className="font-mono text-xs" dateTime={meta.updatedDate} style={{ color: 'var(--text-faint)' }}>{p('updated')} {meta.updatedDate.slice(0, 10)}</time>}
            {meta.featured && <span className="text-xs font-mono px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>{p('featured')}</span>}
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-[-0.055em] leading-[0.98] mb-5" style={{ color: 'var(--text)' }}>{meta.title}</h1>
          {meta.description && <p className="text-base sm:text-lg max-w-3xl leading-8" style={{ color: 'var(--text-muted)' }}>{meta.description}</p>}
          <div className="mt-6 flex flex-wrap gap-1.5">{meta.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}</div>
        </div>
        <div className="post-cover-frame" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
          <Image src={meta.image ?? (digest ? '/images/digest-cover.svg' : '/images/notes-cover.svg')} alt="" aria-hidden="true" width={1600} height={900} unoptimized className="block w-full h-auto" loading="eager" />
        </div>
      </header>

      <div className="post-layout">
        <aside className="post-aside">
          <div className="post-aside-card" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="text-[10px] uppercase tracking-[.18em] font-mono mb-3" style={{ color: 'var(--text-faint)' }}>{digest ? p('curated_signal') : p('engineering_record')}</div>
            <p className="text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{digest ? p('digest_description') : p('note_description')}</p>
            <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--border-soft)' }}>
              <div className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{read.words.toLocaleString()} {p('words')}</div>
              {meta.updatedDate && <div className="text-xs font-mono mt-1" style={{ color: 'var(--text-faint)' }}>{p('updated')} {meta.updatedDate.slice(0, 10)}</div>}
            </div>
          </div>
        </aside>

        <article className="post-article prose prose-lg cne-doc-prose max-w-none prose-headings:font-bold">
          <MDXContent source={content} />

          {relatedProjects.length > 0 && (
            <section className="post-related mt-16 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="text-xs font-mono uppercase tracking-[.16em] mb-4" style={{ color: 'var(--text-faint)' }}>{digest ? p('related_projects_digest') : p('related_oss')}</div>
              <div className="grid sm:grid-cols-3 gap-3 not-prose">
                {relatedProjects.map(project => (
                  <Link key={project.slug} href={`${base}/projects/${project.slug}`} className="group rounded-2xl p-4 transition-all" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>{project.title}</div>
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" style={{ color: 'var(--text-faint)' }} />
                    </div>
                    <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
