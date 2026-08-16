#!/usr/bin/env node
/**
 * Validate a worker lane's enrichment output and merge it into the digest data.
 *
 * The batch-recovery flow (see digest-enrich-lane-prompt.md) hands an `agyp`
 * worker a list of articles and gets back JSON. The worker never touches the
 * repository — this script is the only thing that writes, so every check that
 * matters lives here rather than in a prompt the model may or may not honour.
 *
 * The checks are not hypothetical. Each one is a defect that actually shipped
 * or was caught on its way to shipping:
 *   - CJK in an English field ("people每 week" reached a published post)
 *   - a Korean field with no Hangul at all
 *   - summaryEn returned as a verbatim copy of the RSS excerpt
 *   - a rewritten `link`, which silently drops the article from the merge
 *   - machine mistranslations (초고전압 for "throughput", 1분기 관리형 for
 *     "fully managed") — caught here as a wordlist, extended as new ones appear
 *
 * It refuses to write anything unless every article passes. A half-merged
 * digest is worse than an unenriched one: the post looks finished.
 *
 * Usage:
 *   node scripts/enrich-apply.mjs --date 2026-08-13 --from /tmp/out-2026-08-13.json
 *   node scripts/enrich-apply.mjs --date 2026-08-13 --from ... --dry-run
 *
 * Exit codes:  0 = merged (or dry run clean)    1 = refused
 */

import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : null;
};
const DRY = argv.includes('--dry-run');
const DATE = flag('--date');
const FROM = flag('--from');

if (!DATE || !FROM) {
  console.error('사용법: node scripts/enrich-apply.mjs --date YYYY-MM-DD --from <worker-output.json> [--dry-run]');
  process.exit(1);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(DATE)) {
  console.error(`✗ --date 는 YYYY-MM-DD 형식이어야 한다 (받은 값: "${DATE}")`);
  process.exit(1);
}

const DATA = path.join('src/content/posts/.digest-data', `${DATE}.json`);
const FIELDS = ['summaryKo', 'summaryEn', 'insightKo', 'insightEn'];
// 원본 필드 — 보강은 여기에 절대 손대면 안 된다.
const CORE = ['source', 'category', 'title', 'link', 'date', 'excerpt'];

const CJK = /[぀-ヿ㐀-䶿一-鿿가-힯]/;
const HANGUL = /[가-힯]/;
// 기계 오역. 실제로 발견해 고친 것만 넣는다 — 추측으로 늘리지 말 것.
const MISTRANSLATIONS = [
  ['초고통량', '초고처리량'],
  ['초고전압', '초고처리량'],
  ['고통량', '고처리량'],
  ['1분기 관리형', '완전 관리형'],
  ['파브릭', '패브릭'],
  ['그래운딩', '그라운딩'],
  ['인베딩', '임베딩'],
  ['멀티 텐런트', '멀티 테넌트'],
  ['미업', '미트업'],
  ['보안 수트', '보안 스위트'],
];

const errs = [];
const warns = [];

if (!fs.existsSync(DATA)) {
  console.error(`✗ 수집 데이터가 없다: ${DATA}`);
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(DATA, 'utf-8'));
const articles = data.articles ?? [];
const incoming = JSON.parse(fs.readFileSync(FROM, 'utf-8'));

if (!Array.isArray(incoming)) {
  console.error('✗ 워커 출력이 배열이 아니다.');
  process.exit(1);
}
if (incoming.length !== articles.length) {
  errs.push(`개수 불일치: 수집 ${articles.length}건 vs 워커 출력 ${incoming.length}건`);
}

const byLink = new Map(incoming.map((o) => [o.link, o]));
const short = (a) => String(a.title).slice(0, 45);

for (const a of articles) {
  const o = byLink.get(a.link);
  if (!o) {
    errs.push(`링크 누락 — 워커가 link 를 고쳤을 수 있다: ${short(a)}`);
    continue;
  }
  for (const f of FIELDS) {
    const v = o[f];
    if (typeof v !== 'string' || !v.trim()) {
      errs.push(`${f} 비어있음: ${short(a)}`);
      continue;
    }
    if (f.endsWith('En')) {
      // 괄호 안 고유명사 병기(저자명 등)는 허용, 그 밖의 CJK 는 깨진 텍스트로 본다.
      const outsideParens = v.replace(/\([^)]*\)/g, '');
      if (CJK.test(outsideParens)) {
        errs.push(`${f} 에 CJK 혼입: "${outsideParens.match(new RegExp(`.{0,15}${CJK.source}.{0,15}`))?.[0]?.trim()}" — ${short(a)}`);
      } else if (CJK.test(v)) {
        warns.push(`${f} 괄호 안에 CJK(고유명사로 간주): ${short(a)}`);
      }
    }
    if (f.endsWith('Ko') && !HANGUL.test(v)) {
      errs.push(`${f} 에 한글이 없다: ${short(a)}`);
    }
    for (const [bad, good] of MISTRANSLATIONS) {
      if (v.includes(bad)) errs.push(`${f} 기계 오역 "${bad}" (→ "${good}"): ${short(a)}`);
    }
  }
  if (a.excerpt && o.summaryEn && o.summaryEn.trim() === a.excerpt.trim()) {
    errs.push(`summaryEn 이 excerpt 복붙: ${short(a)}`);
  }
  const sentences = (o.summaryKo?.match(/[.!?。]/g) || []).length;
  if (sentences < 3) warns.push(`summaryKo 가 짧다(${sentences}문장): ${short(a)}`);
}

const extra = incoming.filter((o) => !articles.some((a) => a.link === o.link));
if (extra.length) errs.push(`수집 데이터에 없는 링크 ${extra.length}건 — 워커가 기사를 지어냈을 수 있다`);

console.log(`[${DATE}] 기사 ${articles.length}건 | 오류 ${errs.length} | 경고 ${warns.length}`);
warns.forEach((w) => console.log('  ⚠', w));
errs.forEach((e) => console.log('  ✗', e));

if (errs.length) {
  console.error(`\n✗ ${DATE}: 검증 실패 — 아무것도 쓰지 않았다. 절반만 병합된 다이제스트는 보강 없는 것보다 나쁘다.`);
  process.exit(1);
}
if (DRY) {
  console.log(`\n[dry run] ${DATE}: 검증 통과. 병합 대상 ${articles.length}건.`);
  process.exit(0);
}

const snapshot = (list) => JSON.stringify(list.map((a) => Object.fromEntries(CORE.map((k) => [k, a[k]]))));
const before = snapshot(articles);
for (const a of articles) {
  const o = byLink.get(a.link);
  for (const f of FIELDS) a[f] = o[f];
}
if (snapshot(articles) !== before) {
  console.error(`\n✗ ${DATE}: 병합 과정에서 원본 필드가 변경됐다 — 쓰지 않는다.`);
  process.exit(1);
}

fs.writeFileSync(DATA, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log(`✓ ${DATE}: ${articles.length}건 병합 — ${DATA}`);
console.log(`  다음:  npm run digest:enrich-publish -- --date ${DATE}`);
