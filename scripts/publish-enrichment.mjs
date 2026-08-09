#!/usr/bin/env node
/**
 * Commit and push the day's AI enrichment to its digest branch — one step.
 *
 * Why this exists: the enrichment task is a Claude subscription session running
 * on a local machine (no API cost, see digest-enrich-prompt.md). It used to end
 * with a hand-written sequence of git commands. If the session died anywhere in
 * that tail — and it did, three days running — the enriched files sat
 * uncommitted in the working tree, the draft PR kept the unenriched text, and
 * digest-fallback published the plain version. Nothing errored; the work was
 * just silently thrown away.
 *
 * So the tail is one idempotent command instead of a checklist:
 *   verify branch -> verify enrichment -> regenerate markdown -> commit -> push
 *
 * Re-running is always safe. It commits stranded work from an earlier run,
 * skips whatever is already done, and exits 0 when there is nothing left to do.
 * It refuses — loudly, non-zero — when it cannot tell that the state is right,
 * because a wrong commit is worse than a missed one.
 *
 * Usage:
 *   node scripts/publish-enrichment.mjs              # today (KST)
 *   node scripts/publish-enrichment.mjs --date 2026-07-26
 *   node scripts/publish-enrichment.mjs --dry-run    # report, change nothing
 *   npm run digest:enrich-publish
 *
 * Exit codes:  0 = pushed, or nothing to do    1 = refused (state is wrong)
 */

import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const argv = process.argv.slice(2);
const DRY = argv.includes('--dry-run');
const dateArg = argv.indexOf('--date');
const DATE =
  dateArg !== -1 && argv[dateArg + 1]
    ? argv[dateArg + 1]
    : new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10); // KST

const BRANCH = `daily-digest/${DATE}`;
const DATA = `src/content/posts/.digest-data/${DATE}.json`;
const KO = `src/content/posts/daily-digest-${DATE}.md`;
const EN = `src/content/posts/daily-digest-${DATE}-en.md`;

const log = (m) => console.log(m);
const die = (m) => {
  console.error(`\n✗ ${m}\n`);
  process.exit(1);
};

const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

log(`enrichment publish — ${DATE}${DRY ? ' (dry run)' : ''}`);

// --- 1. Right branch? ------------------------------------------------------
// Committing enrichment onto main (or onto yesterday's branch) is the one
// failure this script must never cause, so this is a hard gate, not a warning.
const current = git('rev-parse', '--abbrev-ref', 'HEAD');
if (current !== BRANCH) {
  die(
    `현재 브랜치가 '${current}' 다. 보강 커밋은 '${BRANCH}' 위에서만 한다.\n` +
      `  수집 브랜치로 이동:  git checkout -B ${BRANCH} origin/${BRANCH}\n` +
      `  이미 발행된 날짜라면 보강할 것이 없다.`
  );
}

// --- 2. Enrichment actually present? --------------------------------------
if (!fs.existsSync(DATA)) {
  die(`수집 데이터가 없다: ${DATA}\n  수집 워크플로가 아직 안 돌았거나 날짜가 틀렸다.`);
}
const data = JSON.parse(fs.readFileSync(DATA, 'utf-8'));
const articles = data.articles ?? [];
const enriched = articles.filter((a) => a.summaryKo || a.summaryEn);

if (articles.length === 0) die(`${DATA} 에 기사가 없다.`);
if (enriched.length === 0) {
  die(
    `보강 필드(summaryKo/summaryEn)가 하나도 없다 — 보강을 먼저 끝내라.\n` +
      `  보강 없는 발행은 digest-fallback 이 알아서 한다. 이 스크립트가 할 일이 아니다.`
  );
}
if (enriched.length < articles.length) {
  // Partial enrichment is publishable — generate-daily-digest falls back to the
  // raw excerpt per field — but it is nearly always a truncated run, so say so.
  log(`⚠ 부분 보강: ${enriched.length}/${articles.length} 건만 보강됨 (나머지는 발췌문으로 나간다)`);
} else {
  log(`보강 확인: ${enriched.length}/${articles.length} 건`);
}

// --- 3. Regenerate markdown from the (possibly updated) JSON ---------------
// Cheap and idempotent, so always re-run it: this is what keeps the .md files
// in sync with the JSON when a previous run edited only one of the two.
if (!DRY) {
  log('마크다운 재생성 (--enrich)...');
  execFileSync('node', ['scripts/generate-daily-digest.mjs', '--enrich', '--date', DATE], {
    stdio: 'inherit',
  });
}

// --- 4. Commit whatever changed -------------------------------------------
const paths = [DATA, KO, EN];
const missing = paths.filter((p) => !fs.existsSync(p));
if (missing.length) die(`생성물이 없다: ${missing.join(', ')}\n  마크다운 생성이 실패했을 수 있다.`);

if (DRY) {
  log(`\n[dry run] 커밋 대상: ${paths.join(', ')}`);
  log(`[dry run] 커밋 메시지: "✨ AI 요약 보강 - ${DATE}"`);
  log(`[dry run] push: origin ${BRANCH}`);
  process.exit(0);
}

git('add', ...paths);
const staged = git('diff', '--cached', '--name-only');

if (staged) {
  log(`커밋: ${staged.split('\n').join(', ')}`);
  execFileSync('git', ['commit', '-m', `✨ AI 요약 보강 - ${DATE}`], { stdio: 'inherit' });
} else {
  log('커밋할 변경 없음 — 이전 실행에서 이미 커밋됨.');
}

// --- 5. Push (only when the remote is actually behind) --------------------
let ahead = '0';
try {
  git('rev-parse', '--verify', `origin/${BRANCH}`);
  ahead = git('rev-list', '--count', `origin/${BRANCH}..HEAD`);
} catch {
  ahead = 'new'; // branch does not exist on the remote yet
}

if (ahead === '0') {
  log('원격이 이미 최신 — push 생략. 할 일 없음.');
  process.exit(0);
}

// A diverged branch makes git reject the push. That is the right call — force-pushing
// someone else's digest branch would destroy work — but the raw execFileSync throw is a
// Node stack dump, which reads as "the script is broken" rather than "your branch
// diverged". Say what happened and what to do about it.
const behind = (() => {
  try {
    return git('rev-list', '--count', `HEAD..origin/${BRANCH}`);
  } catch {
    return '0';
  }
})();
if (behind !== '0') {
  die(
    `원격 ${BRANCH} 에 로컬에 없는 커밋이 ${behind}개 있다 (분기 상태).\n` +
      `  강제 푸시하지 않는다 — 남의 보강 커밋을 지울 수 있다.\n` +
      `  먼저 합쳐라:  git pull --rebase origin ${BRANCH}   그리고 이 명령을 다시 실행.`
  );
}

log(`push: origin ${BRANCH} (${ahead === 'new' ? '신규 브랜치' : `${ahead} 커밋`})`);
try {
  execFileSync('git', ['push', 'origin', BRANCH], { stdio: 'inherit' });
} catch {
  die(`push 실패 — 위 git 출력을 확인하라. 보강 커밋은 로컬에 남아 있으니 재실행하면 다시 시도한다.`);
}

log(`\n✓ 보강 발행 완료 — PR 이 갱신됐다. digest-fallback 이 08:25 KST 에 머지한다.`);
