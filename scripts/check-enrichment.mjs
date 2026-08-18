#!/usr/bin/env node
/**
 * Does the published Korean digest actually contain Korean?
 *
 * Every success signal this pipeline had was blind to enrichment: the workflows
 * were green, the site returned 200, the post existed — while the Korean digest
 * carried nothing but English RSS excerpts for four days straight (2026-08-06..09)
 * and nobody noticed until a human read it. This closes that gap and nothing else.
 *
 * It reports; it does not gate publication. Publishing without enrichment is a
 * deliberate design choice (digest-fallback does it on purpose), so a missing
 * enrichment is an alert, not a reason to withhold the post.
 *
 * Usage:
 *   node scripts/check-enrichment.mjs               # today (KST)
 *   node scripts/check-enrichment.mjs --date 2026-08-06
 *   npm run digest:check
 *
 * Exit codes:  0 = enriched, or no digest today    1 = published without enrichment
 */

import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const dateArg = argv.indexOf('--date');
const DATE =
  dateArg !== -1 && argv[dateArg + 1]
    ? argv[dateArg + 1]
    : new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10); // KST

// DATE lands in a file path, and this script is reachable from workflow_dispatch
// input. Pin the shape so it can never walk out of the content directory.
if (!/^\d{4}-\d{2}-\d{2}$/.test(DATE)) {
  console.log(`::error::--date 는 YYYY-MM-DD 형식이어야 한다 (받은 값: "${DATE}")`);
  process.exit(1);
}

const DATA = path.join('src/content/posts/.digest-data', `${DATE}.json`);
const KO = path.join('src/content/posts', `daily-digest-${DATE}.md`);

const log = (m) => console.log(m);
// GitHub picks these up as run annotations; harmless noise in a local shell.
const warn = (m) => console.log(`::warning::${m}`);
const fail = (m) => {
  console.log(`::error::${m}`);
  process.exit(1);
};

log(`enrichment check — ${DATE}`);

// No file means no post went out that day. The collector does skip genuinely
// quiet days by design, so this is not a failure — but it was silent, and that
// silence hid a real gap: 2026-08-17 had no digest at all because dedup emptied
// the window, and this check passed without a word. Surface it.
if (!fs.existsSync(DATA)) {
  warn(`${DATE} 다이제스트가 없다 — 그날 발행된 글이 없다. 수집이 0건이었는지 확인하라.`);
  process.exit(0);
}

const articles = JSON.parse(fs.readFileSync(DATA, 'utf-8')).articles ?? [];
if (articles.length === 0) {
  log(`${DATE} 기사 0건 — 검사 생략.`);
  process.exit(0);
}

const enriched = articles.filter((a) => a.summaryKo && String(a.summaryKo).trim());
const pct = Math.round((enriched.length / articles.length) * 100);

if (enriched.length === 0) {
  fail(
    `${DATE} 다이제스트가 보강 없이 발행됐다 (0/${articles.length}건). ` +
      `한국어 포스트에 한국어 요약이 없고 영문 발췌만 나간다. ` +
      `보강 세션이 실패했거나 발행 경로가 막혔다 — 복구: npm run digest:enrich-publish -- --date ${DATE}`
  );
}

// The markdown is generated from the JSON, so the two diverge only when a run
// updated one and not the other — which is exactly the state that publishes an
// enriched JSON alongside an unenriched post.
//
// Do NOT test this by looking for Hangul: the generator's footer is Korean in
// both modes, so that check can never fail. Match an actual summary instead,
// compared on letters/digits only so markdown escaping and rewrapping can't
// cause a false alarm.
if (fs.existsSync(KO)) {
  const squash = (s) => String(s).replace(/[^0-9A-Za-z가-힣]/g, '');
  const needle = squash(enriched[0].summaryKo).slice(0, 40);
  const haystack = squash(fs.readFileSync(KO, 'utf-8'));
  if (needle.length >= 20 && !haystack.includes(needle)) {
    fail(
      `${DATE}: JSON 에는 보강이 ${enriched.length}건 있는데 ko 마크다운에 그 요약이 없다 — ` +
        `마크다운이 JSON 보다 오래됐다. 재생성: npm run digest -- --enrich --date ${DATE}`
    );
  }
}

if (enriched.length < articles.length) {
  warn(`${DATE} 부분 보강: ${enriched.length}/${articles.length}건 (${pct}%). 나머지는 영문 발췌로 나간다.`);
  process.exit(0);
}

log(`✓ ${DATE} 보강 완료 — ${enriched.length}/${articles.length}건 (100%)`);
