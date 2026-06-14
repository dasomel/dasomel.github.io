#!/usr/bin/env node
/**
 * Daily Tech Digest markdown generator (no AI, no external API cost).
 *
 * Reads the raw data collected by `collect-feeds.mjs`:
 *   src/content/posts/.digest-data/YYYY-MM-DD.json
 * and renders two markdown posts in the blog's frontmatter format:
 *   src/content/posts/daily-digest-YYYY-MM-DD.md      (Korean labels)
 *   src/content/posts/daily-digest-YYYY-MM-DD-en.md   (English labels)
 *
 * Each article is rendered from its original title, an excerpt taken from the
 * RSS description/summary field, a source-based category, and the original
 * link — no summarization model is involved. (A Cowork scheduled task can
 * later run Claude over the same JSON to attach richer summaries.)
 *
 * Usage:
 *   node scripts/generate-daily-digest.mjs            # today (KST)
 *   node scripts/generate-daily-digest.mjs --date 2026-06-14
 *
 * If the data file is missing or has no articles, it exits 0 without writing.
 * Re-running on the same day overwrites the same files (idempotent).
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  CATEGORIES,
  POSTS_DIR,
  DATA_DIR,
  kstDateString,
  categoryForSource,
  categoryLabel,
  log,
} from './lib/digest-feeds.mjs';

function parseDateArg() {
  const idx = process.argv.indexOf('--date');
  if (idx !== -1 && process.argv[idx + 1]) {
    const v = process.argv[idx + 1];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      console.error(`[digest] ERROR: --date must be YYYY-MM-DD (got "${v}")`);
      process.exit(1);
    }
    return v;
  }
  return kstDateString();
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

function buildMarkdown(lang, { date, articles }) {
  const isEn = lang === 'en';
  const L = {
    headline: isEn ? '🔥 Top Story' : '🔥 오늘의 주요 소식',
    quick: isEn ? '⚡ Quick News' : '⚡ 빠른 소식',
    readMore: isEn ? 'Read more' : '원문 보기',
    footer: isEn
      ? '_This digest was automatically collected from RSS feeds. Excerpts are taken verbatim from each source — see the original links for full details._'
      : '_이 다이제스트는 RSS 피드에서 자동 수집되었습니다. 발췌문은 각 피드 원문에서 그대로 가져온 것으로, 자세한 내용은 원문 링크를 확인하세요._',
  };

  const top = articles[0];
  const rest = articles.slice(1);

  const lines = [];

  // Headline / top story
  lines.push(`## ${L.headline}`, '');
  lines.push(`### ${top.title}`, '');
  if (top.excerpt) lines.push(top.excerpt, '');
  lines.push(`🔗 [${L.readMore}](${top.link}) · _${top.source}_`, '');

  // Categorized sections — articles (excl. top) that carry an excerpt.
  const detailed = rest.filter((a) => a.excerpt);
  for (const cat of CATEGORIES) {
    const inCat = detailed.filter((a) => categoryForSource(a.source) === cat.key);
    if (inCat.length === 0) continue;
    lines.push('---', '', `## ${categoryLabel(cat.key, lang)}`, '');
    for (const a of inCat) {
      lines.push(`### [${a.title}](${a.link})`, '', `_${a.source}_`, '');
      lines.push(a.excerpt, '');
    }
  }

  // Quick news — everything else (no excerpt available), as compact bullets.
  const briefs = rest.filter((a) => !a.excerpt);
  if (briefs.length) {
    lines.push('---', '', `## ${L.quick}`, '');
    for (const a of briefs) {
      lines.push(`- [${a.title}](${a.link}) — _${a.source}_`);
    }
    lines.push('');
  }

  // Footer
  lines.push('---', '', L.footer, '');

  const count = articles.length;
  const title = isEn ? `📰 Daily Tech Digest - ${date}` : `📰 데일리 테크 다이제스트 - ${date}`;
  const description = isEn
    ? `${count} curated updates from the Cloud, Kubernetes, AI & DevOps world for ${date}.`
    : `${date} Cloud, Kubernetes, AI, DevOps 소식 ${count}건 — 자동 큐레이션 다이제스트.`;
  const tags = isEn
    ? ['Daily Digest', 'Kubernetes', 'Cloud Native', 'AI', 'DevOps']
    : ['데일리 다이제스트', 'Kubernetes', 'Cloud Native', 'AI', 'DevOps'];

  return frontmatter({ title, description, date, tags }) + lines.join('\n');
}

function main() {
  const date = parseDateArg();
  const dataPath = path.join(DATA_DIR, `${date}.json`);
  log(`generating digest markdown for ${date}`);

  if (!fs.existsSync(dataPath)) {
    log(`no collected data at ${path.relative(process.cwd(), dataPath)} — run "npm run digest:collect" first. Skipping (no files written).`);
    process.exit(0);
  }

  const payload = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const articles = Array.isArray(payload.articles) ? payload.articles : [];
  if (articles.length === 0) {
    log('data file has no articles — skipping (no files written).');
    process.exit(0);
  }

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  const koPath = path.join(POSTS_DIR, `daily-digest-${date}.md`);
  const enPath = path.join(POSTS_DIR, `daily-digest-${date}-en.md`);
  fs.writeFileSync(koPath, buildMarkdown('ko', { date, articles }), 'utf-8');
  fs.writeFileSync(enPath, buildMarkdown('en', { date, articles }), 'utf-8');

  log(`wrote ${path.relative(process.cwd(), koPath)}`);
  log(`wrote ${path.relative(process.cwd(), enPath)}`);
  log(`done: ${articles.length} article(s)`);
}

main();
