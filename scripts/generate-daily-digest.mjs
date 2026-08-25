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
 * By default each article is rendered from its original title, an excerpt
 * taken from the RSS description/summary field, a source-based category, and
 * the original link — no summarization model is involved.
 *
 * With --enrich, the script uses AI-authored fields (summaryKo/summaryEn/
 * insightKo/insightEn) when present in the JSON, falling back to the raw
 * excerpt per-field when they are absent. Existing Korean posts are also
 * treated as a recovery source: when an older digest was manually enriched
 * before its JSON data carried AI fields, regeneration preserves that Korean
 * summary/insight by matching the article's canonical link. This makes the
 * repaired post durable instead of a one-off Markdown edit.
 *
 * Optional per-article enrichment fields (see collect-feeds.mjs for the full
 * schema): summaryKo, summaryEn, insightKo, insightEn — all strings, all
 * optional. Missing fields gracefully fall back to the existing Korean post
 * (Korean only) or the RSS excerpt.
 *
 * Usage:
 *   node scripts/generate-daily-digest.mjs                 # today (KST), excerpts
 *   node scripts/generate-daily-digest.mjs --date 2026-06-14
 *   node scripts/generate-daily-digest.mjs --enrich        # use AI fields if present
 *   npm run digest -- --enrich                             # same, via npm
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

// MDX parses a bare `{...}` as a JSX expression and a bare `<` as a tag, so
// JSON/object-literal text like {"mode": "EXPRESS"} or a statistic like p<0.05
// in a summary breaks the build. Wrap any brace pair in inline code and
// backslash-escape a `<` that cannot start a tag, skipping spans that are
// already backtick-delimited so we never double-wrap.
function escapeMdxBraces(text) {
  if (!text) return text;
  const s = String(text);
  if (!/[{}<]/.test(s)) return s;
  return s
    .split(/(`[^`]*`)/)
    .map((part, i) => {
      if (i % 2 === 1) return part;
      return part
        .replace(/\{[^{}]*\}/g, (m) => `\`${m}\``)
        // A tag or autolink starts with a letter, `/`, `!`, `$` or `_`; anything
        // else after `<` (a digit, a space, `=`) is literal text in prose.
        .replace(/<(?![A-Za-z/!$_])/g, '\\<');
    })
    .join('');
}

/**
 * Recover previously enriched Korean article bodies from the existing post.
 * This is intentionally a read-only recovery path: the JSON remains the
 * primary source when enrichment fields exist. Matching is by canonical link,
 * so article ordering changes do not matter.
 */
function loadExistingKoreanEnrichment(filePath) {
  const result = new Map();
  if (!fs.existsSync(filePath)) return result;

  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    if (!lines[i].startsWith('### ')) continue;

    const heading = lines[i].slice(4).trim();
    const headingMatch = heading.match(/^\[.*?\]\((https?:\/\/[^)]+)\)$/);
    let link = headingMatch?.[1] ?? null;
    let end = i + 1;
    while (end < lines.length && !lines[end].startsWith('### ') && !lines[end].startsWith('## ') && lines[end] !== '---') {
      if (!link) {
        const linkMatch = lines[end].match(/\[원문 보기\]\((https?:\/\/[^)]+)\)/);
        if (linkMatch) link = linkMatch[1];
      }
      end += 1;
    }
    if (!link) continue;

    const body = lines.slice(i + 1, end);
    let insight = '';
    const insightIndex = body.findIndex((line) => line.trim().startsWith('> 💡'));
    if (insightIndex >= 0) {
      insight = body[insightIndex]
        .replace(/^\s*>\s*💡\s*/, '')
        .replace(/^\*\*왜 중요한가\*\*:\s*/, '')
        .trim();
    }

    const summaryLines = body
      .slice(0, insightIndex >= 0 ? insightIndex : body.length)
      .filter((line) => line.trim() && !/^_.*_$/.test(line.trim()) && !line.includes('[원문 보기]('));
    const summary = summaryLines.join('\n').trim();

    if (summary || insight) {
      result.set(link, { summaryKo: summary, insightKo: insight });
    }
  }

  return result;
}

function buildMarkdown(lang, { date, articles }, enrich = false, legacyKo = new Map()) {
  const isEn = lang === 'en';
  const L = {
    headline: isEn ? '🔥 Top Story' : '🔥 오늘의 주요 소식',
    quick: isEn ? '⚡ Quick News' : '⚡ 빠른 소식',
    readMore: isEn ? 'Read more' : '원문 보기',
    why: isEn ? 'Why it matters' : '왜 중요한가',
    footer: enrich
      ? isEn
        ? '_This digest was collected from RSS feeds and summarized by AI (Claude). See the original links for full details._'
        : '_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._'
      : isEn
        ? '_This digest was automatically collected from RSS feeds. Excerpts are taken verbatim from each source — see the original links for full details._'
        : '_이 다이제스트는 RSS 피드에서 자동 수집되었습니다. 발췌문은 각 피드 원문에서 그대로 가져온 것으로, 자세한 내용은 원문 링크를 확인하세요._',
  };

  const summaryOf = (a) => {
    if (enrich) {
      const s = isEn ? a.summaryEn : a.summaryKo;
      if (s && String(s).trim()) return escapeMdxBraces(String(s).trim());
      if (!isEn) {
        const recovered = legacyKo.get(a.link)?.summaryKo;
        if (recovered) return escapeMdxBraces(recovered);
      }
    }
    return a.excerpt ? escapeMdxBraces(String(a.excerpt).trim()) : '';
  };

  const insightOf = (a) => {
    if (!enrich) return '';
    const s = isEn ? a.insightEn : a.insightKo;
    if (s && String(s).trim()) return escapeMdxBraces(String(s).trim());
    if (!isEn) {
      const recovered = legacyKo.get(a.link)?.insightKo;
      if (recovered) return escapeMdxBraces(recovered);
    }
    return '';
  };

  const top = articles[0];
  const rest = articles.slice(1);
  const lines = [];

  lines.push(`## ${L.headline}`, '');
  lines.push(`### ${top.title}`, '');
  const topBody = summaryOf(top);
  if (topBody) lines.push(topBody, '');
  const topInsight = insightOf(top);
  if (topInsight) lines.push(`> 💡 **${L.why}**: ${topInsight}`, '');
  lines.push(`🔗 [${L.readMore}](${top.link}) · _${top.source}_`, '');

  const detailed = rest.filter((a) => summaryOf(a));
  for (const cat of CATEGORIES) {
    const inCat = detailed.filter((a) => categoryForSource(a.source) === cat.key);
    if (inCat.length === 0) continue;
    lines.push('---', '', `## ${categoryLabel(cat.key, lang)}`, '');
    for (const a of inCat) {
      lines.push(`### [${a.title}](${a.link})`, '', `_${a.source}_`, '');
      lines.push(summaryOf(a), '');
      const ins = insightOf(a);
      if (ins) lines.push(`> 💡 ${ins}`, '');
    }
  }

  const briefs = rest.filter((a) => !summaryOf(a));
  if (briefs.length) {
    lines.push('---', '', `## ${L.quick}`, '');
    for (const a of briefs) {
      lines.push(`- [${a.title}](${a.link}) — _${a.source}_`);
    }
    lines.push('');
  }

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
  const enrich = process.argv.includes('--enrich');
  const dataPath = path.join(DATA_DIR, `${date}.json`);
  const koPath = path.join(POSTS_DIR, `daily-digest-${date}.md`);
  log(`generating digest markdown for ${date}${enrich ? ' (enrich mode)' : ''}`);

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

  const legacyKo = enrich ? loadExistingKoreanEnrichment(koPath) : new Map();
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  const enPath = path.join(POSTS_DIR, `daily-digest-${date}-en.md`);
  fs.writeFileSync(koPath, buildMarkdown('ko', { date, articles }, enrich, legacyKo), 'utf-8');
  fs.writeFileSync(enPath, buildMarkdown('en', { date, articles }, enrich, legacyKo), 'utf-8');

  const enrichedCount = enrich
    ? articles.filter((a) =>
        a.summaryKo || a.summaryEn || a.insightKo || a.insightEn || legacyKo.has(a.link),
      ).length
    : 0;

  log(`wrote ${path.relative(process.cwd(), koPath)}`);
  log(`wrote ${path.relative(process.cwd(), enPath)}`);
  log(
    enrich
      ? `done: ${articles.length} article(s), ${enrichedCount} with AI/recovered fields`
      : `done: ${articles.length} article(s)`,
  );
}

main();
