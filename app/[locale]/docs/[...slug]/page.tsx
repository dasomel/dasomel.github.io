import { notFound } from 'next/navigation';
import { getDocBySlug, getDocs } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import { routing } from '@/i18n/routing';
import Sidebar from '@/components/layout/Sidebar';
import TOC from '@/components/layout/TOC';

export function generateStaticParams() {
  const params: { locale: string; slug: string[] }[] = [];
  routing.locales.forEach((locale) => {
    getDocs(locale as 'ko' | 'en').forEach((doc) => {
      params.push({ locale, slug: doc.slug.split('/') });
    });
  });
  return params;
}

export default async function DocPage({ params }: { params: Promise<{ locale: string; slug: string[] }> }) {
  const { locale, slug: segments } = await params;
  const slug = segments.join('/');
  const lang = locale as 'ko' | 'en';
  const result = getDocBySlug(slug, lang);
  if (!result) notFound();

  const docs = getDocs(lang);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <Sidebar docs={docs} locale={lang} />
        <div className="flex-1 min-w-0">
          <header className="mb-8 lg:mb-10 pb-6 border-b" style={{ borderColor: 'var(--border-soft)' }}>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: 'var(--text)' }}>{result.meta.title}</h1>
            {result.meta.description && <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>{result.meta.description}</p>}
          </header>
          <article className="prose cne-doc-prose max-w-none prose-headings:scroll-mt-20">
            <MDXContent source={result.content} />
          </article>
        </div>
        <TOC />
      </div>
    </div>
  );
}
