import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getPosts } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PostsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'posts' });
  const posts = getPosts(lang);
  const base = lang === 'en' ? '/en' : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">{t('title')}</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">{t('empty')}</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`${base}/posts/${post.slug}`}
              className="block p-5 bg-white border border-gray-100 rounded-xl hover:border-l-emerald-500 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{post.title}</h2>
                  {post.description && <p className="text-gray-500 text-sm mt-1">{post.description}</p>}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {post.tags.map(tag => <Badge key={tag} variant="default">{tag}</Badge>)}
                    </div>
                  )}
                </div>
                <time className="font-mono text-xs text-gray-400 whitespace-nowrap">{post.pubDate.slice(0, 10)}</time>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
