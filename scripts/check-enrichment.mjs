#!/usr/bin/env node
/** Verify daily digest AI enrichment; --strict is the automatic publication gate. */
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const strict = argv.includes('--strict');
const dateArg = argv.indexOf('--date');
const DATE = dateArg !== -1 && argv[dateArg + 1]
  ? argv[dateArg + 1]
  : new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

if (!/^\d{4}-\d{2}-\d{2}$/.test(DATE)) {
  console.log(`::error::--date 는 YYYY-MM-DD 형식이어야 한다 (받은 값: "${DATE}")`);
  process.exit(1);
}

const DATA = path.join('src/content/posts/.digest-data', `${DATE}.json`);
const KO = path.join('src/content/posts', `daily-digest-${DATE}.md`);
const warn = (m) => console.log(`::warning::${m}`);
const fail = (m) => { console.log(`::error::${m}`); process.exit(1); };

console.log(`enrichment check — ${DATE}${strict ? ' (strict)' : ''}`);

if (!fs.existsSync(DATA)) {
  if (strict) fail(`${DATE} 다이제스트 데이터가 없다: ${DATA}`);
  warn(`${DATE} 다이제스트가 없다 — 발행된 글이 없는 상태다.`);
  process.exit(0);
}

const articles = JSON.parse(fs.readFileSync(DATA, 'utf-8')).articles ?? [];
if (articles.length === 0) {
  if (strict) fail(`${DATE} 다이제스트 기사 0건 — 자동 발행을 중단한다.`);
  console.log(`${DATE} 기사 0건 — 검사 생략.`);
  process.exit(0);
}

const enriched = articles.filter((a) =>
  a.summaryKo && String(a.summaryKo).trim() &&
  a.summaryEn && String(a.summaryEn).trim()
);
const pct = Math.round((enriched.length / articles.length) * 100);

if (enriched.length === 0) {
  if (strict) fail(`${DATE} AI 보강이 하나도 없다 (0/${articles.length}건). 자동 발행을 중단한다.`);
  warn(`${DATE} 다이제스트가 보강 없이 발행됐다 (0/${articles.length}건). 한국어 포스트에 한국어 요약이 없고 영문 발췌만 나간다. 보강 세션이 실패했거나 발행 경로가 막혔는지 확인하라.`);
  process.exit(0);
}
if (strict && enriched.length !== articles.length) {
  fail(`${DATE} AI 보강이 불완전하다 (${enriched.length}/${articles.length}건, ${pct}%). 자동 발행을 중단한다.`);
}

if (fs.existsSync(KO)) {
  const squash = (s) => String(s).replace(/[^0-9A-Za-z가-힣]/g, '');
  const needle = squash(enriched[0].summaryKo).slice(0, 40);
  const haystack = squash(fs.readFileSync(KO, 'utf-8'));
  if (needle.length >= 20 && !haystack.includes(needle)) {
    if (strict) {
      fail(`${DATE}: JSON에는 AI 보강이 있지만 ko 마크다운에 반영되지 않았다. 마크다운을 JSON에서 재생성하라.`);
    }
    warn(`${DATE}: JSON에는 AI 보강이 있지만 ko 마크다운에 반영되지 않았다. 마크다운을 JSON에서 재생성하라.`);
    process.exit(0);
  }
}

if (enriched.length < articles.length) {
  warn(`${DATE} 부분 보강: ${enriched.length}/${articles.length}건 (${pct}%). 자동 발행은 차단된다.`);
  process.exit(0);
}
console.log(`✓ ${DATE} AI 보강 완료 — ${enriched.length}/${articles.length}건 (100%)`);
