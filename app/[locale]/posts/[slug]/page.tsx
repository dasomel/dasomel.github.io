import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getPostBySlug, getPosts, getProjects } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import { routing } from '@/i18n/routing';
import readingTime from 'reading-time';

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  routing.locales.forEach(locale => {
    const lang = locale as 'ko' | 'en';
    getPosts(lang).forEach(post => params.push({ locale, slug: post.slug }));
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
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title: meta.title, description: meta.description, publishedTime: meta.pubDate, modifiedTime: meta.updatedDate, tags: meta.tags, images: [{ url: image, alt: `${meta.title} cover` }] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const lang = locale as 'ko' | 'en';
  const result = getPostBySlug(slug, lang);
  if (!result) notFound();
  const { meta, content } = result;
  const base = lang === 'en' ? '/en' : '/ko';
  const digest = slug.startsWith('daily-digest-');
  const read = readingTime(content);
  const projects = getProjects(lang);
  const explicit = projects.filter(project => meta.projects?.includes(project.slug));
  const related = explicit.length > 0
    ? explicit
    : projects.filter(project => {
        const terms = [project.slug, project.title, ...project.tags].map(value => value.toLowerCase());
        return meta.tags.some(tag => terms.includes(tag.toLowerCase())) || meta.title.toLowerCase().includes(project.title.toLowerCase());
      }).slice(0, 3);

  return (
    <main>
      <div className="mx-auto max-w-[820px] px-5 pt-8 sm:px-8">
        <Link href={digest ? `${base}/tech-digest` : `${base}/notes`} className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft className="h-4 w-4" /> {lang === 'en' ? 'Back' : '뒤로'}
        </Link>
      </div>

      <header className="mx-auto max-w-[820px] px-5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: digest ? 'var(--signal)' : 'var(--accent)' }}>
          {digest ? 'TECH DIGEST' : 'ENGINEERING NOTE'} / {meta.pubDate.slice(0, 10)} · {Math.max(1, Math.ceil(read.minutes))} MIN
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl sm:leading-[1.08]" style={{ color: 'var(--text)' }}>{meta.title}</h1>
        {meta.description && <p className="mt-5 text-base leading-7 sm:text-lg sm:leading-8" style={{ color: 'var(--text-muted)' }}>{meta.description}</p>}
        <div className="mt-5 font-mono text-[10px] uppercase leading-6 tracking-[0.08em]" style={{ color: 'var(--text-faint)' }}>{meta.tags.join(' · ')}</div>
      </header>

      <article className="cne-doc-prose prose prose-lg mx-auto max-w-[820px] px-5 pb-16 sm:px-8 prose-headings:font-semibold">
        <MDXContent source={content} />
      </article>

      {related.length > 0 && (
        <section className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
          <div className="mx-auto max-w-[820px] px-5 py-9 sm:px-8">
            <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: digest ? 'var(--signal)' : 'var(--accent)' }}>RELATED</div>
            <div className="mt-4 space-y-2">
              {related.map(project => (
                <Link key={project.slug} href={`${base}/projects/${project.slug}`} className="group flex items-center justify-between gap-4 rounded-xl border px-4 py-3" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                  <span className="text-sm font-semibold group-hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>{project.title}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--text-faint)' }} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
