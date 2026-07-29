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
 * excerpt per-field when they are absent. This is how the Phase 2 Cowork
 * scheduled task works: Claude reads the collected JSON, fills in those
 * optional fields, then this script regenerates the markdown with richer
 * summaries and "why it matters" insights — all on the Claude subscription,
 * no extra API cost.
 *
 * There is a cheaper middle tier: translation. Every source feed is English, so
 * without it the *Korean* post shows English headings and English excerpts —
 * which is what a fallback-published digest looked like. titleKo/excerptKo hold
 * a plain translation of the original title and RSS excerpt (no summarizing, no
 * invention), and the Korean document prefers them. They need no flag: the
 * per-field fallback below makes using them strictly better than not.
 *
 * Precedence, Korean document:  summaryKo (--enrich only) -> excerptKo -> excerpt
 * Precedence, English document: summaryEn (--enrich only) -> excerpt
 * Heading, Korean document:     titleKo -> title
 *
 * Optional per-article fields (see collect-feeds.mjs for the full schema):
 * titleKo, excerptKo, summaryKo, summaryEn, insightKo, insightEn — all strings,
 * all optional. Missing fields gracefully fall back to the original English.
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

// MDX parses a bare `{...}` as a JSX expression, so JSON/object-literal text
// like {"mode": "EXPRESS"} in a summary breaks the build. Wrap any brace pair
// in inline code, skipping spans that are already backtick-delimited so we
// never double-wrap.
function escapeMdxBraces(text) {
  if (!text) return text;
  const s = String(text);
  if (!s.includes('{') && !s.includes('}')) return s;
  // Split into alternating [plain, code, plain, ...]; code spans land at odd
  // indices thanks to the capturing group and are left untouched.
  return s
    .split(/(`[^`]*`)/)
    .map((part, i) => (i % 2 === 1 ? part : part.replace(/\{[^{}]*\}/g, (m) => `\`${m}\``)))
    .join('');
}

function buildMarkdown(lang, { date, articles }, enrich = false) {
  const isEn = lang === 'en';

  const clean = (v) => (v && String(v).trim() ? escapeMdxBraces(String(v).trim()) : '');

  // Body text. Korean walks summary -> translated excerpt -> original excerpt;
  // English has no translation tier because every source is already English.
  const summaryOf = (a) => {
    if (enrich) {
      const s = clean(isEn ? a.summaryEn : a.summaryKo);
      if (s) return s;
    }
    if (!isEn) {
      const t = clean(a.excerptKo);
      if (t) return t;
    }
    return clean(a.excerpt);
  };

  // Headings. Titles were previously interpolated raw; a title containing a
  // brace pair would break the MDX build, so they go through the same escape.
  const titleOf = (a) => (isEn ? '' : clean(a.titleKo)) || clean(a.title);

  // Which tier actually produced this document decides what the footer may claim.
  // Checked against rendered output, not the raw JSON: a partial run must not
  // let the footer promise more than the page delivers.
  const usedSummary =
    enrich && articles.some((a) => clean(isEn ? a.summaryEn : a.summaryKo));
  const usedTranslation =
    !isEn && articles.some((a) => clean(a.titleKo) || clean(a.excerptKo));

  const footer = (() => {
    if (usedSummary) {
      return isEn
        ? '_This digest was collected from RSS feeds and summarized by AI (Claude). See the original links for full details._'
        : '_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._';
    }
    if (usedTranslation) {
      // Say plainly that this is a translated excerpt, not a summary — the text
      // is as short as the source excerpt and stops where the excerpt stops.
      return '_이 다이제스트는 RSS 피드에서 자동 수집한 뒤 제목과 발췌문을 AI(Claude)가 번역했습니다. 요약이 아니라 원문 발췌를 옮긴 것이므로, 자세한 내용은 원문 링크를 확인하세요._';
    }
    return isEn
      ? '_This digest was automatically collected from RSS feeds. Excerpts are taken verbatim from each source — see the original links for full details._'
      : '_이 다이제스트는 RSS 피드에서 자동 수집되었습니다. 발췌문은 각 피드 원문에서 그대로 가져온 것으로, 자세한 내용은 원문 링크를 확인하세요._';
  })();

  const L = {
    headline: isEn ? '🔥 Top Story' : '🔥 오늘의 주요 소식',
    quick: isEn ? '⚡ Quick News' : '⚡ 빠른 소식',
    readMore: isEn ? 'Read more' : '원문 보기',
    why: isEn ? 'Why it matters' : '왜 중요한가',
    footer,
  };
  // Insight only appears in enrich mode and only when the field is present.
  const insightOf = (a) => (enrich ? clean(isEn ? a.insightEn : a.insightKo) : '');

  const top = articles[0];
  const rest = articles.slice(1);

  const lines = [];

  // Headline / top story
  lines.push(`## ${L.headline}`, '');
  lines.push(`### ${titleOf(top)}`, '');
  const topBody = summaryOf(top);
  if (topBody) lines.push(topBody, '');
  const topInsight = insightOf(top);
  if (topInsight) lines.push(`> 💡 **${L.why}**: ${topInsight}`, '');
  lines.push(`🔗 [${L.readMore}](${top.link}) · _${top.source}_`, '');

  // Categorized sections — articles (excl. top) that have body text.
  const detailed = rest.filter((a) => summaryOf(a));
  for (const cat of CATEGORIES) {
    const inCat = detailed.filter((a) => categoryForSource(a.source) === cat.key);
    if (inCat.length === 0) continue;
    lines.push('---', '', `## ${categoryLabel(cat.key, lang)}`, '');
    for (const a of inCat) {
      lines.push(`### [${titleOf(a)}](${a.link})`, '', `_${a.source}_`, '');
      lines.push(summaryOf(a), '');
      const ins = insightOf(a);
      if (ins) lines.push(`> 💡 ${ins}`, '');
    }
  }

  // Quick news — everything else (no body text available), as compact bullets.
  const briefs = rest.filter((a) => !summaryOf(a));
  if (briefs.length) {
    lines.push('---', '', `## ${L.quick}`, '');
    for (const a of briefs) {
      lines.push(`- [${titleOf(a)}](${a.link}) — _${a.source}_`);
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
  const enrich = process.argv.includes('--enrich');
  const dataPath = path.join(DATA_DIR, `${date}.json`);
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

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  const koPath = path.join(POSTS_DIR, `daily-digest-${date}.md`);
  const enPath = path.join(POSTS_DIR, `daily-digest-${date}-en.md`);
  fs.writeFileSync(koPath, buildMarkdown('ko', { date, articles }, enrich), 'utf-8');
  fs.writeFileSync(enPath, buildMarkdown('en', { date, articles }, enrich), 'utf-8');

  // Report both tiers separately. A run that translated everything but summarized
  // nothing is a good outcome, not a failed enrichment — the counts must be able
  // to say so, or a healthy translation-only day reads as "0 fields, broken".
  const translated = articles.filter((a) => a.titleKo || a.excerptKo).length;
  const enrichedCount = enrich
    ? articles.filter((a) => a.summaryKo || a.summaryEn || a.insightKo || a.insightEn).length
    : 0;

  log(`wrote ${path.relative(process.cwd(), koPath)}`);
  log(`wrote ${path.relative(process.cwd(), enPath)}`);
  const parts = [`${articles.length} article(s)`];
  if (translated) parts.push(`${translated} translated`);
  if (enrich) parts.push(`${enrichedCount} with AI fields`);
  log(`done: ${parts.join(', ')}`);
}

main();
