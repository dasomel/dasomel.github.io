import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getPostBySlug, getPosts, getProjects } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { MDXContent } from '@/components/MDXContent';
import { routing } from '@/i18n/routing';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';

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
  const base = lang === 'en' ? '/en' : '/ko';
  const digest = slug.startsWith('daily-digest-');
  const projects = getProjects(lang);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <Link href={digest ? `${base}/tech-digest` : `${base}/notes`} className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />{t('back')}
      </Link>

      <header className="mb-10">
        <div className="overflow-hidden rounded-2xl mb-7" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
          <Image src={meta.image ?? (digest ? '/images/digest-cover.svg' : '/images/notes-cover.svg')} alt="" aria-hidden="true" width={1600} height={900} unoptimized className="block w-full h-auto" loading="eager" />
        </div>
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <span className="text-[10px] uppercase tracking-[.18em] font-mono px-2 py-1 rounded-full" style={{ backgroundColor: digest ? 'var(--surface)' : 'var(--accent-dim)', color: digest ? 'var(--text-muted)' : 'var(--accent)', border: '1px solid var(--border)' }}>
            {digest ? 'TECH DIGEST' : 'ENGINEERING NOTE'}
          </span>
          <time className="font-mono text-xs" dateTime={meta.pubDate} style={{ color: 'var(--text-faint)' }}>{meta.pubDate.slice(0, 10)}</time>
          {meta.updatedDate && <time className="font-mono text-xs" dateTime={meta.updatedDate} style={{ color: 'var(--text-faint)' }}>updated {meta.updatedDate.slice(0, 10)}</time>}
          {meta.featured && <span className="text-xs font-mono px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>Featured</span>}
          {meta.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4" style={{ color: 'var(--text)' }}>{meta.title}</h1>
        {meta.description && <p className="text-base sm:text-lg max-w-3xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>{meta.description}</p>}
      </header>

      <div className="rounded-2xl p-4 sm:p-5 mb-10" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[.18em] font-mono mb-1" style={{ color: 'var(--text-faint)' }}>{digest ? 'Curated digest' : 'Engineering note'}</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{digest ? 'A source-first technology digest, kept separate from original engineering writing.' : 'A public record of what was built, tested, learned, and changed.'}</div>
          </div>
          <ArrowUpRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" style={{ color: 'var(--accent)' }} />
        </div>
      </div>

      <article className="prose prose-lg cne-doc-prose max-w-none prose-headings:font-bold">
        <MDXContent source={content} />
      </article>

      {relatedProjects.length > 0 && (
        <section className="mt-14 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-xs font-mono uppercase tracking-wider mb-4" style={{ color: 'var(--text-faint)' }}>{digest ? 'Projects influenced by this digest' : 'Related OSS'}</div>
          <div className="grid sm:grid-cols-3 gap-3">
            {relatedProjects.map(project => (
              <Link key={project.slug} href={`${base}/projects/${project.slug}`} className="group rounded-xl p-4 transition-all hover:bg-[var(--surface-hi)]" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
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
    </div>
  );
}
