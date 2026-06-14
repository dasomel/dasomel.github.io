import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getPostBySlug, getPosts } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { MDXContent } from '@/components/MDXContent';
import { routing } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <Link href={`${base}/posts`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />{t('back')}
      </Link>
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{meta.title}</h1>
        {meta.description && <p className="text-lg text-gray-500 mb-4">{meta.description}</p>}
        <div className="flex items-center gap-4 flex-wrap">
          <time className="font-mono text-sm text-gray-400">{meta.pubDate.slice(0, 10)}</time>
          {meta.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
        </div>
      </header>
      <article className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-a:text-emerald-600">
        <MDXContent source={content} />
      </article>
    </div>
  );
}
