import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getPosts } from '@/lib/content';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PostsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'posts' });
  const posts = getPosts(lang);
  const base = lang === 'en' ? '/en' : '/ko';

  // Group by year
  const byYear = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = post.pubDate.slice(0, 4);
    (acc[year] = acc[year] || []).push(post);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {t('title')}
        </h1>
        <p className="text-sm font-mono" style={{ color: 'var(--text-faint)' }}>{posts.length} posts</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('empty')}</p>
      ) : (
        <div className="space-y-10 slide-enter-content">
          {years.map(year => (
            <div key={year}>
              <div className="text-xs font-mono mb-3" style={{ color: 'var(--text-faint)' }}>{year}</div>
              <div style={{ borderTop: '1px solid var(--border)' }}>
                {byYear[year].map(post => (
                  <Link
                    key={post.slug}
                    href={`${base}/posts/${post.slug}`}
                    className="group flex items-baseline justify-between gap-4 py-3 transition-opacity hover:opacity-70"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <span className="text-sm flex-1 min-w-0 truncate" style={{ color: 'var(--text)' }}>
                      {post.title}
                    </span>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {post.tags.slice(0, 1).map(tag => (
                        <span key={tag} className="text-xs font-mono hidden sm:block" style={{ color: 'var(--text-faint)' }}>
                          {tag}
                        </span>
                      ))}
                      <time className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>
                        {post.pubDate.slice(5, 10)}
                      </time>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
