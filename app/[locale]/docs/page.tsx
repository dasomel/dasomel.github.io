import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getDocs } from '@/lib/content';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function DocsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'nav' });
  const docs = getDocs(lang);
  const base = lang === 'en' ? '/en' : '/ko';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">{t('docs')}</h1>
      <ul className="space-y-2">
        {docs.map((doc) => (
          <li key={doc.slug}>
            <Link href={`${base}/docs/${doc.slug}`}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-l-emerald-500 hover:shadow-sm transition-all group">
              <span className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">{doc.title}</span>
              {doc.lastModified && (
                <span className="font-mono text-xs text-gray-400">{doc.lastModified.slice(0, 10)}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
