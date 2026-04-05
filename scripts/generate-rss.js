const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { Feed } = require('feed');

const BASE_URL = 'https://dasomel.github.io';
const contentDir = path.join(__dirname, '../src/content/posts');
const outDir = path.join(__dirname, '../out');

function getPosts(lang) {
  if (!fs.existsSync(contentDir)) return [];
  return fs.readdirSync(contentDir)
    .filter(f => {
      if (lang === 'en') return f.endsWith('-en.md') || f.endsWith('-en.mdx');
      return (f.endsWith('.md') || f.endsWith('.mdx')) && !f.endsWith('-en.md') && !f.endsWith('-en.mdx');
    })
    .map(f => {
      const raw = fs.readFileSync(path.join(contentDir, f), 'utf-8');
      const { data } = matter(raw);
      const slug = f.replace(/\.(md|mdx)$/, '').replace(/-en$/, '');
      return { ...data, slug };
    })
    .filter(p => !p.draft)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

function generateFeed(lang) {
  const isEn = lang === 'en';
  const base = isEn ? `${BASE_URL}/en` : BASE_URL;
  const feed = new Feed({
    title: 'dasomel',
    description: isEn
      ? 'Cloud & DevOps Engineer - K-PaaS, Kubernetes, DevOps blog'
      : 'Cloud & DevOps Engineer - K-PaaS, Kubernetes, DevOps 기술 블로그',
    id: `${base}/`,
    link: `${base}/`,
    language: isEn ? 'en' : 'ko',
    image: `${BASE_URL}/images/logo.png`,
    favicon: `${BASE_URL}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} dasomel`,
    author: { name: 'dasomel', link: BASE_URL },
  });

  getPosts(lang).forEach(post => {
    feed.addItem({
      title: post.title,
      id: `${base}/posts/${post.slug}/`,
      link: `${base}/posts/${post.slug}/`,
      description: post.description || '',
      date: new Date(post.pubDate),
    });
  });

  return feed;
}

if (!fs.existsSync(outDir)) {
  console.log('out/ directory not found, skipping RSS generation');
  process.exit(0);
}

const koFeed = generateFeed('ko');
fs.writeFileSync(path.join(outDir, 'rss.xml'), koFeed.rss2());
fs.writeFileSync(path.join(outDir, 'rss-en.xml'), generateFeed('en').rss2());
console.log('RSS feeds generated: out/rss.xml, out/rss-en.xml');
