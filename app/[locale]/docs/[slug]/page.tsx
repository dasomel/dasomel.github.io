import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDocBySlug, getDocs } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import { routing } from '@/i18n/routing';
import Sidebar from '@/components/layout/Sidebar';
import TOC from '@/components/layout/TOC';

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  routing.locales.forEach(locale => {
    getDocs(locale as 'ko' | 'en').forEach(d => params.push({ locale, slug: d.slug }));
  });
  return params;
}

export default async function DocPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const lang = locale as 'ko' | 'en';
  const result = getDocBySlug(slug, lang);
  if (!result) notFound();
  const { meta, content } = result;
  const docs = getDocs(lang);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex gap-8">
        <Sidebar docs={docs} locale={lang} />
        <div className="flex-1 min-w-0">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{meta.title}</h1>
            {meta.description && <p className="text-gray-500">{meta.description}</p>}
            {meta.lastModified && (
              <p className="font-mono text-xs text-gray-400 mt-2">{meta.lastModified.slice(0, 10)}</p>
            )}
          </header>
          <article className="prose prose-gray max-w-none prose-a:text-emerald-600 prose-headings:scroll-mt-20">
            <MDXContent source={content} />
          </article>
        </div>
        <TOC />
      </div>
    </div>
  );
}
