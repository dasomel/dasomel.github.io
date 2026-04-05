import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getPosts } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { ArrowRight, Calendar } from 'lucide-react';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PostsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'posts' });
  const posts = getPosts(lang);
  const base = lang === 'en' ? '/en' : '/ko';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Page header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-500 font-mono text-sm">{posts.length} posts</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-400 text-sm">{t('empty')}</p>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <Link key={post.slug} href={`${base}/posts/${post.slug}`}
              className="group flex items-start gap-5 p-5 bg-white border border-gray-100 rounded-2xl hover:border-emerald-100 hover:bg-emerald-50/20 transition-all card-lift">
              {/* Date column */}
              <div className="flex-shrink-0 w-20 text-right hidden sm:block">
                <time className="font-mono text-xs text-gray-400">{post.pubDate.slice(0, 10)}</time>
              </div>
              <div className="w-px bg-gray-100 self-stretch hidden sm:block" />
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors mb-1 leading-snug">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{post.description}</p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1 font-mono text-xs text-gray-400 sm:hidden">
                    <Calendar className="w-3 h-3" />{post.pubDate.slice(0, 10)}
                  </span>
                  {post.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-md text-xs font-mono text-gray-500">{tag}</span>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 flex-shrink-0 mt-0.5 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
