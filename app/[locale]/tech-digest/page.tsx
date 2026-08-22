import { getTranslations } from 'next-intl/server';
import { getTechDigests, getPostBySlug } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { PostList } from '@/components/posts/PostList';
import { Rss } from 'lucide-react';
import Link from 'next/link';
import readingTime from 'reading-time';
import styles from '../ContentCollections.module.css';

export function generateStaticParams() { return routing.locales.map(locale => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const t = await getTranslations({ locale, namespace: 'tech_digest' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function TechDigestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const lang = locale as 'ko' | 'en'; const t = await getTranslations({ locale, namespace: 'tech_digest' }); const posts = getTechDigests(lang); const base = lang === 'en' ? '/en' : '/ko'; const rss = lang === 'en' ? '/tech-digest-en.xml' : '/tech-digest.xml';
  const postsWithReadTime = posts.map(post => { const detail = getPostBySlug(post.slug, lang); const rt = detail ? readingTime(detail.content) : null; return { slug: post.slug, title: post.title, description: post.description, tags: post.tags, pubDate: post.pubDate, featured: post.featured, readTime: rt ? `${Math.ceil(rt.minutes)} ${t('min_read')}` : '' }; });
  const featured = postsWithReadTime.slice(0, 1);
  return <div className={`max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 slide-enter-content ${styles['collection-page']}`}><section className={`${styles['collection-hero']} ${styles['digest-hero']} mb-8`}><div className={styles['collection-kicker']}>TECH SIGNAL</div><div className="flex items-end justify-between gap-5 mt-3"><div><h1 className="text-3xl sm:text-5xl font-semibold tracking-tight" style={{ color: 'var(--text)' }}>{t('title')}</h1><p className="mt-3 text-sm sm:text-base max-w-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p></div><Link href={rss} className="inline-flex items-center gap-2 text-xs font-mono px-3 py-2 rounded-lg" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><Rss className="w-3.5 h-3.5" aria-hidden="true" />RSS</Link></div></section><div className="rounded-xl px-4 py-3 mb-9 text-sm" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)', color:'var(--text-muted)' }}>{t('notice')}</div>{featured.length > 0 && <section className="mb-10"><div className={styles['collection-list']}>{featured.map(post => <Link key={post.slug} href={`${base}/posts/${post.slug}`} className={`${styles['collection-card']} ${styles['collection-featured']} group`}><div className="min-w-0"><div className={styles['collection-meta']}><span>{post.pubDate.slice(0,10)}</span>{post.readTime && <span>{post.readTime}</span>}{post.tags.slice(0,3).map(tag => <span key={tag} className={styles['collection-tag']}>{tag}</span>)}</div><h2 className={`${styles['collection-title']} mt-3 font-semibold group-hover:text-[var(--signal)] transition-colors`} style={{ color: 'var(--text)' }}>{post.title}</h2>{post.description && <p className="mt-2 text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--text-muted)' }}>{post.description}</p>}</div><span className="font-mono text-xs" style={{ color: 'var(--signal)' }}>OPEN ↗</span></Link>)}</div></section>}<section><div className="workbench-eyebrow mb-3">ARCHIVE</div><PostList posts={postsWithReadTime} base={base} showTagFilter={false} translations={{ featured: t('featured'), all_posts: t('all_posts') }} /></section></div>;
}
