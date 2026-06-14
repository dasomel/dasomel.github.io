import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getSeminarBySlug, getSeminars } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MDXContent } from '@/components/MDXContent';
import { routing } from '@/i18n/routing';
import { ArrowLeft, ExternalLink, Video, Calendar, MapPin } from 'lucide-react';

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  routing.locales.forEach(locale => {
    getSeminars(locale as 'ko' | 'en').forEach(s => params.push({ locale, slug: s.slug }));
  });
  return params;
}

export default async function SeminarPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const lang = locale as 'ko' | 'en';
  const result = getSeminarBySlug(slug, lang);
  if (!result) notFound();
  const { meta, content } = result;
  const ts = await getTranslations({ locale, namespace: 'seminars' });
  const tc = await getTranslations({ locale, namespace: 'common' });
  const base = lang === 'en' ? '/en' : '/ko';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <Link href={`${base}/seminars`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />{tc('back')}
      </Link>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{meta.title}</h1>
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{meta.date.slice(0, 10)}</span>
          <span>{meta.event}</span>
          {meta.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{meta.location}</span>}
        </div>
        <div className="flex gap-3 flex-wrap">
          {meta.slides && (
            <Button asChild size="sm" variant="outline">
              <a href={meta.slides} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />{ts('slides')}
              </a>
            </Button>
          )}
          {meta.video && (
            <Button asChild size="sm" variant="outline">
              <a href={meta.video} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <Video className="w-4 h-4" />{ts('video')}
              </a>
            </Button>
          )}
        </div>
        {meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {meta.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
          </div>
        )}
      </header>
      <article className="prose prose-lg prose-gray max-w-none prose-a:text-emerald-600">
        <MDXContent source={content} />
      </article>
    </div>
  );
}
