'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { TagFilter } from '@/components/ui/tag-filter';
import { FeaturedCard } from '@/components/ui/featured-card';

interface PostItem {
  slug: string;
  title: string;
  description?: string;
  tags: string[];
  pubDate: string;
  featured?: boolean;
  readTime: string;
}

interface Props {
  posts: PostItem[];
  base: string;
  showTagFilter?: boolean;
  translations: {
    featured: string;
    all_posts: string;
  };
}

export function PostList({ posts, base, showTagFilter = true, translations }: Props) {
  const [selected, setSelected] = useState('all');
  const allTags = [...new Set(posts.flatMap(p => p.tags))];
  const filtered = selected === 'all' ? posts : posts.filter(p => p.tags.includes(selected));
  const featuredPost = filtered.find(p => p.featured);
  const regularPosts = filtered.filter(p => !p.featured);
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <>
      {showTagFilter && <TagFilter tags={allTags} selected={selected} onChange={setSelected} />}
      {featuredPost && (
        <FeaturedCard badge={translations.featured}>
          <Link href={`${base}/posts/${featuredPost.slug}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] rounded-lg">
            <div className="flex items-center gap-2 mb-2"><span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{featuredPost.readTime}</span></div>
            <div className="flex items-start justify-between gap-3"><h3 className="text-base font-semibold mb-1 min-w-0" style={{ color: 'var(--text)' }}>{featuredPost.title}</h3><ArrowUpRight className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-opacity" aria-hidden="true" /></div>
            {featuredPost.description && <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>{featuredPost.description}</p>}
            <div className="flex flex-wrap gap-1.5">{featuredPost.tags.slice(0, 5).map(tag => <span key={tag} className="px-1.5 py-0.5 text-xs font-mono rounded" style={{ border: '1px solid var(--border)', color: 'var(--accent)', backgroundColor: 'var(--accent-dim)' }}>{tag}</span>)}</div>
          </Link>
        </FeaturedCard>
      )}

      <h2 className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>{translations.all_posts}</h2>
      <div className="space-y-2">
        {regularPosts.map(post => (
          <Link key={post.slug} href={`${base}/posts/${post.slug}`} className="group block rounded-xl p-4 sm:p-4 transition-[background-color,border-color,box-shadow] hover:bg-[var(--surface-hi)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3"><h3 className="text-base font-medium mb-1 min-w-0 transition-colors group-hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>{post.title}</h3><ArrowUpRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--text-faint)] group-hover:text-[var(--accent)] transition-colors" aria-hidden="true" /></div>
                {post.description && <p className="text-sm mb-2 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{post.description}</p>}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono" style={{ color: 'var(--text-faint)' }}>
                  <time>{formatDate(post.pubDate)}</time><span aria-hidden="true">·</span><span>{post.readTime}</span>
                  {post.tags.slice(0, 2).map(tag => <span key={tag} className="rounded-full px-1.5 py-0.5" style={{ backgroundColor: 'var(--surface-hi)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>{tag}</span>)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-sm text-center py-12" style={{ color: 'var(--text-faint)' }}>No posts found.</p>}
    </>
  );
}
