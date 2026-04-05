import type { MetadataRoute } from 'next';
import { getPosts, getProjects, getSeminars, getDocs } from '@/lib/content';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ locale: 'ko' }, { locale: 'en' }];
}

const BASE_URL = 'https://dasomel.github.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['ko', 'en'] as const;
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    const base = lang === 'en' ? `${BASE_URL}/en` : BASE_URL;

    // Static pages
    entries.push(
      { url: `${base}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
      { url: `${base}/posts`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
      { url: `${base}/projects`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${base}/seminars`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${base}/docs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
      { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    );

    // Posts
    for (const post of getPosts(lang)) {
      entries.push({
        url: `${base}/posts/${post.slug}`,
        lastModified: new Date(post.pubDate),
        changeFrequency: 'yearly',
        priority: 0.7,
      });
    }

    // Projects
    for (const project of getProjects(lang)) {
      entries.push({
        url: `${base}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.6,
      });
    }

    // Seminars
    for (const seminar of getSeminars(lang)) {
      entries.push({
        url: `${base}/seminars/${seminar.slug}`,
        lastModified: new Date(seminar.date),
        changeFrequency: 'yearly',
        priority: 0.6,
      });
    }

    // Docs
    for (const doc of getDocs(lang)) {
      entries.push({
        url: `${base}/docs/${doc.slug}`,
        lastModified: doc.lastModified ? new Date(doc.lastModified) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
