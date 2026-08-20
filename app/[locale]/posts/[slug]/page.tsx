import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getPostBySlug, getPosts } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { MDXContent } from '@/components/MDXContent';
import { routing } from '@/i18n/routing';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  routing.locales.forEach(locale => {
    const lang = locale as 'ko' | 'en';
    getPosts(lang).forEach(p => params.push({ locale, slug: p.slug }));
  });
  return params;
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const lang = locale as 'ko' | 'en';
  const result = getPostBySlug(slug, lang);
  if (!result) notFound();
  const { meta, content } = result;
  const t = await getTranslations({ locale, namespace: 'common' });
  const base = lang === 'en' ? '/en' : '/ko';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <Link href={`${base}/posts`} className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft className="w-4 h-4" />{t('back')}
      </Link>

      <header className="mb-10">
        <div className="overflow-hidden rounded-2xl mb-7" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
          <img src="/images/notes-cover.svg" alt="" className="block w-full h-auto" loading="eager" />
        </div>
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <time className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>{meta.pubDate.slice(0, 10)}</time>
          {meta.featured && <span className="text-xs font-mono px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>Featured</span>}
          {meta.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4" style={{ color: 'var(--text)' }}>{meta.title}</h1>
        {meta.description && <p className="text-base sm:text-lg max-w-3xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>{meta.description}</p>}
      </header>

      <div className="rounded-2xl p-4 sm:p-5 mb-10" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[.18em] font-mono mb-1" style={{ color: 'var(--text-faint)' }}>Engineering note</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>A public record of what was built, tested, learned, and changed.</div>
          </div>
          <ArrowUpRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
        </div>
      </div>

      <article className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-a:text-emerald-600">
        <MDXContent source={content} />
      </article>
    </div>
  );
}
