import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getSeminars } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Presentation } from 'lucide-react';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SeminarsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'seminars' });
  const seminars = getSeminars(lang);
  const base = lang === 'en' ? '/en' : '/ko';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">{t('title')}</h1>
      <div className="space-y-3">
        {seminars.map((seminar) => (
          <Link key={seminar.slug} href={`${base}/seminars/${seminar.slug}`}
            className="block p-5 bg-white border border-gray-100 rounded-xl hover:border-l-emerald-500 hover:shadow-sm transition-all group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{seminar.title}</h2>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-gray-500"><Presentation className="w-3 h-3" />{seminar.event}</span>
                  {seminar.location && <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin className="w-3 h-3" />{seminar.location}</span>}
                </div>
                {seminar.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {seminar.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
                  </div>
                )}
              </div>
              <time className="font-mono text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                <Calendar className="w-3 h-3" />{seminar.date.slice(0, 10)}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
