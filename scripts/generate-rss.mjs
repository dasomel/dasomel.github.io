import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Feed } from 'feed';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'out');
const contentDir = path.join(root, 'src/content/posts');
const SITE_URL = 'https://dasomel.github.io';

function getPosts(lang) {
  const dir = contentDir;
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .filter((f) => (lang === 'en' ? f.endsWith('-en.md') : !f.endsWith('-en.md')))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
      const { data } = matter(raw);
      const slug = f.replace(/\.md$/, '').replace(/-en$/, '');
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? '',
        pubDate: data.pubDate ? new Date(data.pubDate) : new Date(),
        tags: data.tags ?? [],
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => b.pubDate - a.pubDate);
}

function buildFeed(lang) {
  const isEn = lang === 'en';
  const base = isEn ? `${SITE_URL}/en` : SITE_URL;
  const feed = new Feed({
    title: isEn ? 'dasomel — Cloud & DevOps' : 'dasomel — Cloud & DevOps',
    description: isEn
      ? 'Posts on Cloud, Kubernetes, DevOps by dasomel'
      : 'Cloud, Kubernetes, DevOps 기술 포스트 by dasomel',
    id: `${base}/`,
    link: `${base}/`,
    language: lang,
    copyright: `© ${new Date().getFullYear()} dasomel`,
    author: { name: 'dasomel', link: SITE_URL },
  });

  for (const post of getPosts(lang)) {
    feed.addItem({
      title: post.title,
      id: `${base}/posts/${post.slug}`,
      link: `${base}/posts/${post.slug}`,
      description: post.description,
      date: post.pubDate,
      category: post.tags.map((t) => ({ name: t })),
    });
  }
  return feed;
}

// Write RSS feeds
const koFeed = buildFeed('ko');
const enFeed = buildFeed('en');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const enOutDir = path.join(outDir, 'en');
if (!fs.existsSync(enOutDir)) fs.mkdirSync(enOutDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'rss.xml'), koFeed.rss2());
fs.writeFileSync(path.join(outDir, 'feed.json'), koFeed.json1());
fs.writeFileSync(path.join(enOutDir, 'rss.xml'), enFeed.rss2());

console.log('RSS feeds generated successfully.');
