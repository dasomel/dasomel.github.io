#!/usr/bin/env node
/**
 * Daily Tech Digest generator.
 *
 * 1. Fetches a curated set of Cloud / Kubernetes / AI / DevOps RSS feeds.
 * 2. Filters articles published within the last 24 hours.
 * 3. Uses the Anthropic Claude API (haiku) to summarize + add a "why it matters"
 *    insight (Korean & English) and categorize each article.
 * 4. Writes two markdown posts that match the blog's frontmatter format:
 *      src/content/posts/daily-digest-YYYY-MM-DD.md      (Korean)
 *      src/content/posts/daily-digest-YYYY-MM-DD-en.md   (English)
 *
 * If no articles are found in the last 24h, it exits 0 without writing files.
 * Re-running on the same day overwrites the same files (idempotent).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Parser from 'rss-parser';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '../src/content/posts');

const MODEL = 'claude-haiku-4-5-20251001';
const WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_ARTICLES = 40; // cap to bound API cost
const CHUNK_SIZE = 20;
const SNIPPET_LEN = 320;

const FEEDS = [
  { name: 'Kubernetes', url: 'https://kubernetes.io/feed.xml' },
  { name: 'CNCF', url: 'https://www.cncf.io/blog/feed/' },
  { name: 'The New Stack', url: 'https://thenewstack.io/feed/' },
  { name: 'AWS Containers', url: 'https://aws.amazon.com/blogs/containers/feed/' },
  { name: 'Google Cloud', url: 'https://cloudblog.withgoogle.com/rss/' },
  { name: 'OpenAI', url: 'https://openai.com/blog/rss/' },
  { name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml' },
  { name: 'HashiCorp', url: 'https://www.hashicorp.com/blog/feed.xml' },
  { name: 'Grafana', url: 'https://grafana.com/blog/index.xml' },
];

// Category keys are stable; labels are localized.
const CATEGORIES = [
  { key: 'k8s', ko: 'Kubernetes & Cloud Native', en: 'Kubernetes & Cloud Native' },
  { key: 'ai', ko: 'AI & ML', en: 'AI & ML' },
  { key: 'cloud', ko: '클라우드 업데이트', en: 'Cloud Updates' },
  { key: 'devops', ko: 'DevOps & 인프라', en: 'DevOps & Infrastructure' },
];
// The model is asked to return one of the Korean labels; map back to a key.
const KO_LABEL_TO_KEY = Object.fromEntries(CATEGORIES.map((c) => [c.ko, c.key]));

function log(...args) {
  console.log('[digest]', ...args);
}

/** Today's date in KST (the cron fires at 00:00 UTC = 09:00 KST). */
function kstDateString() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

function articleDate(item) {
  const raw = item.isoDate || item.pubDate || item.published || item.date;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function cleanText(s) {
  if (!s) return '';
  return String(s)
    .replace(/<[^>]+>/g, ' ') // strip HTML
    .replace(/&[a-z]+;/gi, ' ') // strip entities
    .replace(/\s+/g, ' ')
    .trim();
}

/** Fetch all feeds, skipping any that fail, and return recent articles. */
async function collectArticles() {
  const parser = new Parser({ timeout: 20000 });
  const cutoff = Date.now() - WINDOW_MS;
  const articles = [];

  for (const feed of FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      let count = 0;
      for (const item of parsed.items || []) {
        const date = articleDate(item);
        if (!date || date.getTime() < cutoff) continue;
        const link = (item.link || '').trim();
        const title = cleanText(item.title);
        if (!link || !title) continue;
        articles.push({
          source: feed.name,
          title,
          link,
          date: date.toISOString(),
          snippet: cleanText(item.contentSnippet || item.content || item.summary).slice(0, SNIPPET_LEN),
        });
        count++;
      }
      log(`${feed.name}: ${count} recent article(s)`);
    } catch (err) {
      log(`WARN: failed to fetch ${feed.name} (${feed.url}): ${err.message}`);
    }
  }

  // Newest first, then cap.
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  return articles.slice(0, MAX_ARTICLES);
}

function extractJson(text) {
  if (!text) throw new Error('empty model response');
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf('[');
  const end = candidate.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error('no JSON array in model response');
  return JSON.parse(candidate.slice(start, end + 1));
}

function buildPrompt(chunk) {
  const list = chunk
    .map(
      (a, i) =>
        `[#${i}] SOURCE: ${a.source}\nTITLE: ${a.title}\nEXCERPT: ${a.snippet || '(none)'}`,
    )
    .join('\n\n');

  return `You are a senior Cloud/DevOps engineer curating a daily tech digest.
For each article below, return a JSON array (no prose, JSON only). Each element:
{
  "index": <the #N number>,
  "category": one of exactly ["Kubernetes & Cloud Native", "AI & ML", "클라우드 업데이트", "DevOps & 인프라"],
  "importance": integer 1-10 (how significant for a Cloud/DevOps audience),
  "highlight": boolean (true for the most noteworthy ~60%, false for minor news),
  "titleKo": Korean translation of the title (natural, concise),
  "summaryKo": 2-3 sentence Korean summary,
  "insightKo": one Korean sentence — why it matters from a Cloud/DevOps engineer's perspective,
  "summaryEn": 2-3 sentence English summary,
  "insightEn": one English sentence — why it matters from a Cloud/DevOps engineer's perspective
}
Return exactly ${chunk.length} elements, one per article. JSON array only.

ARTICLES:
${list}`;
}

/** Enrich articles with summaries/insights/categories via Claude. */
async function enrichArticles(client, articles) {
  const enriched = [];
  for (let i = 0; i < articles.length; i += CHUNK_SIZE) {
    const chunk = articles.slice(i, i + CHUNK_SIZE);
    log(`summarizing articles ${i + 1}-${i + chunk.length} of ${articles.length}`);
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 8000,
      messages: [{ role: 'user', content: buildPrompt(chunk) }],
    });
    const text = msg.content.find((b) => b.type === 'text')?.text ?? '';
    let parsed;
    try {
      parsed = extractJson(text);
    } catch (err) {
      log(`WARN: failed to parse model output for chunk ${i / CHUNK_SIZE}: ${err.message}`);
      continue;
    }
    for (const item of parsed) {
      const src = chunk[item.index];
      if (!src) continue;
      enriched.push({
        ...src,
        categoryKey: KO_LABEL_TO_KEY[item.category] || 'devops',
        importance: Number(item.importance) || 0,
        highlight: Boolean(item.highlight),
        titleKo: item.titleKo || src.title,
        summaryKo: item.summaryKo || '',
        insightKo: item.insightKo || '',
        summaryEn: item.summaryEn || '',
        insightEn: item.insightEn || '',
      });
    }
  }
  enriched.sort((a, b) => b.importance - a.importance);
  return enriched;
}

function frontmatter({ title, description, date, tags }) {
  const tagList = tags.map((t) => `"${t}"`).join(', ');
  return [
    '---',
    `title: "${title.replace(/"/g, "'")}"`,
    `description: "${description.replace(/"/g, "'")}"`,
    `pubDate: ${date}`,
    `tags: [${tagList}]`,
    'featured: false',
    'draft: false',
    '---',
    '',
  ].join('\n');
}

function buildMarkdown(lang, { date, top, enriched }) {
  const isEn = lang === 'en';
  const L = {
    title: isEn ? `📰 Daily Tech Digest - ${date}` : `📰 데일리 테크 다이제스트 - ${date}`,
    headline: isEn ? '🔥 Top Story' : '🔥 오늘의 주요 소식',
    why: isEn ? 'Why it matters' : '왜 중요한가',
    quick: isEn ? '⚡ Quick News' : '⚡ 빠른 소식',
    readMore: isEn ? 'Read more' : '원문 보기',
    footer: isEn
      ? '_This digest was automatically curated by AI (Claude). Summaries and insights are AI-generated and may contain inaccuracies — please verify against the original sources._'
      : '_이 다이제스트는 AI(Claude)가 자동으로 큐레이션했습니다. 요약과 인사이트는 AI가 생성한 것으로 부정확할 수 있으니 원문을 반드시 확인하세요._',
  };
  const titleOf = (a) => (isEn ? a.title : a.titleKo);
  const summaryOf = (a) => (isEn ? a.summaryEn : a.summaryKo);
  const insightOf = (a) => (isEn ? a.insightEn : a.insightKo);
  const catLabel = (key) => {
    const c = CATEGORIES.find((x) => x.key === key);
    return isEn ? c.en : c.ko;
  };

  const lines = [];

  // Headline / top story
  lines.push(`## ${L.headline}`, '');
  lines.push(`### ${titleOf(top)}`, '');
  if (summaryOf(top)) lines.push(summaryOf(top), '');
  if (insightOf(top)) lines.push(`> 💡 **${L.why}**: ${insightOf(top)}`, '');
  lines.push(`🔗 [${L.readMore}](${top.link}) · _${top.source}_`, '');

  // Categorized highlights (exclude the top story)
  const highlights = enriched.filter((a) => a !== top && a.highlight);
  for (const cat of CATEGORIES) {
    const inCat = highlights.filter((a) => a.categoryKey === cat.key);
    if (inCat.length === 0) continue;
    lines.push('---', '', `## ${catLabel(cat.key)}`, '');
    for (const a of inCat) {
      lines.push(`### [${titleOf(a)}](${a.link})`, '', `_${a.source}_`, '');
      if (summaryOf(a)) lines.push(summaryOf(a), '');
      if (insightOf(a)) lines.push(`> 💡 ${insightOf(a)}`, '');
    }
  }

  // Quick news (everything else)
  const briefs = enriched.filter((a) => a !== top && !a.highlight);
  if (briefs.length) {
    lines.push('---', '', `## ${L.quick}`, '');
    for (const a of briefs) {
      lines.push(`- [${titleOf(a)}](${a.link}) — _${a.source}_`);
    }
    lines.push('');
  }

  // Footer
  lines.push('---', '', L.footer, '');

  const count = enriched.length;
  const description = isEn
    ? `Today's top story: ${top.title} — and ${count - 1} more curated updates from the Cloud, Kubernetes, AI & DevOps world.`
    : `오늘의 주요 소식: ${top.titleKo} 외 ${count - 1}건 — Cloud, Kubernetes, AI, DevOps 큐레이션 다이제스트.`;

  const tags = isEn
    ? ['Daily Digest', 'Kubernetes', 'Cloud Native', 'AI', 'DevOps']
    : ['데일리 다이제스트', 'Kubernetes', 'Cloud Native', 'AI', 'DevOps'];

  return frontmatter({ title: L.title, description, date, tags }) + lines.join('\n');
}

async function main() {
  const date = kstDateString();
  log(`generating digest for ${date}`);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[digest] ERROR: ANTHROPIC_API_KEY is not set');
    process.exit(1);
  }

  const articles = await collectArticles();
  if (articles.length === 0) {
    log('no articles found in the last 24h — skipping today (no files written)');
    process.exit(0);
  }
  log(`collected ${articles.length} article(s) total`);

  const client = new Anthropic({ apiKey });
  const enriched = await enrichArticles(client, articles);
  if (enriched.length === 0) {
    log('enrichment produced no usable articles — skipping (no files written)');
    process.exit(0);
  }

  const top = enriched[0]; // highest importance
  const payload = { date, top, enriched };

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  const koPath = path.join(POSTS_DIR, `daily-digest-${date}.md`);
  const enPath = path.join(POSTS_DIR, `daily-digest-${date}-en.md`);
  fs.writeFileSync(koPath, buildMarkdown('ko', payload), 'utf-8');
  fs.writeFileSync(enPath, buildMarkdown('en', payload), 'utf-8');

  log(`wrote ${path.relative(process.cwd(), koPath)}`);
  log(`wrote ${path.relative(process.cwd(), enPath)}`);
  log(`done: ${enriched.length} article(s), top story "${top.titleKo}"`);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  main().catch((err) => {
    console.error('[digest] FATAL:', err);
    process.exit(1);
  });
}

export {
  kstDateString,
  collectArticles,
  enrichArticles,
  buildMarkdown,
  FEEDS,
  POSTS_DIR,
};
