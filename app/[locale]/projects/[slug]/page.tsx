import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjects, getProjectBySlug } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import { routing } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, GitFork } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  routing.locales.forEach(locale => {
    getProjects(locale as 'ko' | 'en').forEach(p => params.push({ locale, slug: p.slug }));
  });
  return params;
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const lang = locale as 'ko' | 'en';
  const result = getProjectBySlug(slug, lang);
  if (!result) notFound();
  const { meta, content } = result;
  const tc = await getTranslations({ locale, namespace: 'common' });
  const base = lang === 'en' ? '/en' : '/ko';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <Link href={`${base}/projects`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />{tc('back')}
      </Link>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          {meta.type === 'fork' && <GitFork className="w-6 h-6 text-gray-400" />}
          {meta.title}
        </h1>
        <p className="text-gray-500 mb-4">{meta.description}</p>
        <div className="flex items-center gap-3 flex-wrap">
          {meta.github && (
            <Button asChild size="sm">
              <a href={meta.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <Github className="w-4 h-4" />{tc('github')}
              </a>
            </Button>
          )}
          {meta.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
        </div>
      </header>
      <article className="prose prose-gray max-w-none prose-a:text-emerald-600">
        <MDXContent source={content} />
      </article>
    </div>
  );
}
