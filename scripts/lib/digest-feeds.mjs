/**
 * Shared config + helpers for the daily digest scripts.
 *
 * Used by both `collect-feeds.mjs` (RSS collection) and
 * `generate-daily-digest.mjs` (markdown generation) so the feed list,
 * category mapping, and small utilities stay in one place.
 *
 * No external API / network deps here — pure config + string helpers.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** src/content/posts — where the blog reads markdown from. */
export const POSTS_DIR = path.join(__dirname, '../../src/content/posts');
/**
 * Raw collected data lives in a dot-prefixed subdir so the content loader
 * (which only reads *.md / *.mdx) ignores it.
 */
export const DATA_DIR = path.join(POSTS_DIR, '.digest-data');

/** Category keys are stable; labels are localized at render time. */
export const CATEGORIES = [
  { key: 'k8s', ko: 'Kubernetes & Cloud Native', en: 'Kubernetes & Cloud Native' },
  { key: 'ai', ko: 'AI & ML', en: 'AI & ML' },
  { key: 'cloud', ko: '클라우드 업데이트', en: 'Cloud Updates' },
  { key: 'devops', ko: 'DevOps & 인프라', en: 'DevOps & Infrastructure' },
];

/**
 * Feed list. `category` is derived purely from the source — no AI needed.
 *  - Kubernetes / CNCF / AWS Containers → container & cloud-native
 *  - OpenAI / Hugging Face             → AI & ML
 *  - Google Cloud                      → cloud provider updates
 *  - HashiCorp / The New Stack / Grafana → DevOps & infra/observability
 */
export const FEEDS = [
  { name: 'Kubernetes', url: 'https://kubernetes.io/feed.xml', category: 'k8s' },
  { name: 'CNCF', url: 'https://www.cncf.io/blog/feed/', category: 'k8s' },
  { name: 'AWS Containers', url: 'https://aws.amazon.com/blogs/containers/feed/', category: 'k8s' },
  { name: 'OpenAI', url: 'https://openai.com/news/rss.xml', category: 'ai' },
  { name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', category: 'ai' },
  { name: 'Google Cloud', url: 'https://cloudblog.withgoogle.com/rss/', category: 'cloud' },
  { name: 'HashiCorp', url: 'https://www.hashicorp.com/blog/feed.xml', category: 'devops' },
  { name: 'The New Stack', url: 'https://thenewstack.io/feed/', category: 'devops' },
  { name: 'Grafana', url: 'https://grafana.com/blog/index.xml', category: 'devops' },
];

const SOURCE_TO_CATEGORY = Object.fromEntries(FEEDS.map((f) => [f.name, f.category]));

export function categoryForSource(source) {
  return SOURCE_TO_CATEGORY[source] || 'devops';
}

export function categoryLabel(key, lang) {
  const c = CATEGORIES.find((x) => x.key === key);
  if (!c) return key;
  return lang === 'en' ? c.en : c.ko;
}

/** Today's date in KST (the cron fires at 00:00 UTC = 09:00 KST). */
export function kstDateString() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

export function cleanText(s) {
  if (!s) return '';
  return String(s)
    .replace(/<[^>]+>/g, ' ') // strip HTML tags
    .replace(/&[a-z]+;/gi, ' ') // strip named entities
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Strip WordPress feed boilerplate like
 * "The post <title> appeared first on <site>." which many RSS feeds
 * (e.g. The New Stack) append to every item's content.
 */
export function stripBoilerplate(text) {
  if (!text) return '';
  return text
    .replace(/\s*The post\b.*?\bappeared first on\b.*?(?:\.|$)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** First 1-2 sentences from an RSS description/summary, capped in length. */
export function excerptFrom(raw, maxLen = 320) {
  const text = stripBoilerplate(cleanText(raw));
  if (!text) return '';
  const sentences = text.match(/[^.!?。]+[.!?。]?/g) || [text];
  let out = '';
  for (const s of sentences) {
    if (out && (out + s).length > maxLen) break;
    out += s;
    if (out.length >= maxLen) break;
    // stop after ~2 sentences
    if ((out.match(/[.!?。]/g) || []).length >= 2) break;
  }
  out = out.trim();
  if (out.length > maxLen) out = out.slice(0, maxLen).trim() + '…';
  return out;
}

export function log(...args) {
  console.log('[digest]', ...args);
}
