'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  translations: {
    featured: string;
    all_posts: string;
  };
}

export function PostList({ posts, base, translations }: Props) {
  const [selected, setSelected] = useState('all');

  const allTags = [...new Set(posts.flatMap(p => p.tags))];
  const filtered = selected === 'all'
    ? posts
    : posts.filter(p => p.tags.includes(selected));

  const featuredPost = filtered.find(p => p.featured);
  const regularPosts = filtered.filter(p => !p.featured);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <>
      <TagFilter tags={allTags} selected={selected} onChange={setSelected} />

      {/* Featured post */}
      {featuredPost && (
        <FeaturedCard badge={translations.featured}>
          <Link href={`${base}/posts/${featuredPost.slug}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>
                {featuredPost.readTime}
              </span>
            </div>
            <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>
              {featuredPost.title}
            </h3>
            {featuredPost.description && (
              <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>
                {featuredPost.description}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {featuredPost.tags.map(tag => (
                <span key={tag} className="px-1.5 py-0.5 text-xs font-mono rounded"
                  style={{ border: '1px solid var(--border)', color: 'var(--accent)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        </FeaturedCard>
      )}

      {/* All posts header */}
      <h2 className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>
        {translations.all_posts}
      </h2>

      {/* Post list */}
      <div className="space-y-2">
        {regularPosts.map(post => (
          <Link key={post.slug} href={`${base}/posts/${post.slug}`}
            className="block p-4 rounded-xl transition-all hover:bg-gray-50 group"
            style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium mb-1 group-hover:text-emerald-400 transition-colors"
                  style={{ color: 'var(--text)' }}>
                  {post.title}
                </h3>
                {post.description && (
                  <p className="text-sm mb-2 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                    {post.description}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>
                      {tag}
                    </span>
                  ))}
                  <span className="text-xs" style={{ color: 'var(--text-faint)' }}>·</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>
                    {post.readTime}
                  </span>
                </div>
              </div>
              <time className="text-xs font-mono flex-shrink-0 pt-0.5" style={{ color: 'var(--text-faint)' }}>
                {formatDate(post.pubDate)}
              </time>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="text-sm text-center py-12" style={{ color: 'var(--text-faint)' }}>
          No posts found.
        </p>
      )}
    </>
  );
}
