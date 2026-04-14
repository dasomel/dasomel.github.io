import { getTranslations } from 'next-intl/server';
import { getPosts, getPostBySlug } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { PostList } from '@/components/posts/PostList';
import readingTime from 'reading-time';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return { title: t('title') };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'blog' });
  const posts = getPosts(lang);
  const base = lang === 'en' ? '/en' : '/ko';

  const postsWithReadTime = posts.map(post => {
    const detail = getPostBySlug(post.slug, lang);
    const rt = detail ? readingTime(detail.content) : null;
    return {
      slug: post.slug,
      title: post.title,
      description: post.description,
      tags: post.tags,
      pubDate: post.pubDate,
      featured: post.featured,
      readTime: rt ? `${Math.ceil(rt.minutes)} ${t('min_read')}` : '',
    };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 slide-enter-content">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
        {t('title')}
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        {t('subtitle')}
      </p>
      <PostList
        posts={postsWithReadTime}
        base={base}
        translations={{
          featured: t('featured'),
          all_posts: t('all_posts'),
        }}
      />
    </div>
  );
}
