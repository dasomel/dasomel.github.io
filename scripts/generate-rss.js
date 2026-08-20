const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { Feed } = require('feed');

const BASE_URL = 'https://cne.io.kr';
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

function isTechDigest(post) {
  return post.slug.startsWith('daily-digest-');
}

function generateFeed(lang, kind) {
  const isEn = lang === 'en';
  const isDigest = kind === 'tech-digest';
  const base = isEn ? `${BASE_URL}/en` : `${BASE_URL}/ko`;
  const section = isDigest ? 'tech-digest' : 'notes';
  const title = isDigest ? 'dasomel Tech Digest' : 'dasomel Notes';
  const description = isDigest
    ? (isEn ? 'Curated technology news and developments from dasomel.' : 'dasomel이 큐레이션한 기술 소식과 변화.')
    : (isEn ? 'Engineering notes on Cloud Native, OSS, and AI-assisted development.' : 'Cloud Native, OSS, AI-assisted 개발에 대한 엔지니어링 노트.');

  const feed = new Feed({
    title,
    description,
    id: `${base}/${section}/`,
    link: `${base}/${section}/`,
    language: isEn ? 'en' : 'ko',
    image: `${BASE_URL}/images/workbench-hero.svg`,
    favicon: `${BASE_URL}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} dasomel`,
    author: { name: 'dasomel', link: BASE_URL },
  });

  getPosts(lang)
    .filter(post => (isDigest ? isTechDigest(post) : !isTechDigest(post)))
    .forEach(post => {
      feed.addItem({
        title: post.title,
        id: `${base}/${section}/${post.slug}/`,
        link: `${base}/${section}/${post.slug}/`,
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

const koNotes = generateFeed('ko', 'notes');
const enNotes = generateFeed('en', 'notes');
const koDigest = generateFeed('ko', 'tech-digest');
const enDigest = generateFeed('en', 'tech-digest');

// Legacy feed URLs remain available as Notes-only feeds for compatibility.
fs.writeFileSync(path.join(outDir, 'rss.xml'), koNotes.rss2());
fs.writeFileSync(path.join(outDir, 'rss-en.xml'), enNotes.rss2());
fs.writeFileSync(path.join(outDir, 'tech-digest.xml'), koDigest.rss2());
fs.writeFileSync(path.join(outDir, 'tech-digest-en.xml'), enDigest.rss2());
console.log('RSS feeds generated: rss.xml, rss-en.xml, tech-digest.xml, tech-digest-en.xml');
