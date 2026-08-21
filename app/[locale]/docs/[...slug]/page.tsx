import { notFound } from 'next/navigation';
import { getDocBySlug, getDocs } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import { routing } from '@/i18n/routing';
import Sidebar from '@/components/layout/Sidebar';
import TOC from '@/components/layout/TOC';

export function generateStaticParams() {
  const params: { locale: string; slug: string[] }[] = [];
  routing.locales.forEach((locale) => {
    getDocs(locale as 'ko' | 'en').filter((d) => !d.slug.includes('/')).forEach((d) => params.push({ locale, slug: d.slug.split('/') }));
  });
  return params;
}

export default async function DocPage({ params }: { params: Promise<{ locale: string; slug: string[] }> }) {
  const { locale, slug: segments } = await params;
  const slug = segments.join('/');
  if (slug.includes('/')) notFound();
  const lang = locale as 'ko' | 'en';
  const result = getDocBySlug(slug, lang);
  if (!result) notFound();
  const docs = getDocs(lang).filter((doc) => !doc.slug.includes('/'));
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <Sidebar docs={docs} locale={lang} />
        <div className="flex-1 min-w-0">
          <header className="mb-8 lg:mb-10"><h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{result.meta.title}</h1>{result.meta.description && <p className="text-gray-500">{result.meta.description}</p>}</header>
          <article className="prose prose-gray sm:prose-lg max-w-none prose-a:text-emerald-600 prose-headings:scroll-mt-20"><MDXContent source={result.content} /></article>
        </div>
        <TOC />
      </div>
    </div>
  );
}
