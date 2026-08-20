import { getTranslations } from 'next-intl/server';
import { getNotes, getPostBySlug } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { PostList } from '@/components/posts/PostList';
import { Rss } from 'lucide-react';
import Link from 'next/link';
import readingTime from 'reading-time';

export function generateStaticParams() { return routing.locales.map(locale => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const t = await getTranslations({ locale, namespace: 'notes' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function NotesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const lang = locale as 'ko' | 'en'; const t = await getTranslations({ locale, namespace: 'notes' }); const posts = getNotes(lang); const base = lang === 'en' ? '/en' : '/ko'; const rss = lang === 'en' ? '/rss-en.xml' : '/rss.xml';
  const postsWithReadTime = posts.map(post => { const detail = getPostBySlug(post.slug, lang); const rt = detail ? readingTime(detail.content) : null; return { slug: post.slug, title: post.title, description: post.description, tags: post.tags, pubDate: post.pubDate, featured: post.featured, readTime: rt ? `${Math.ceil(rt.minutes)} ${t('min_read')}` : '' }; });
  return <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 slide-enter-content"><div className="flex items-start justify-between gap-4 mb-3"><div><div className="workbench-eyebrow mb-2">NOTES</div><h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>{t('title')}</h1></div><Link href={rss} className="inline-flex items-center gap-2 text-xs font-mono px-3 py-2 rounded-lg" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}><Rss className="w-3.5 h-3.5" aria-hidden="true" />RSS</Link></div><p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p><PostList posts={postsWithReadTime} base={base} translations={{ featured: t('featured'), all_posts: t('all_posts') }} /></div>;
}
