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
 *   pick target -> verify enrichment -> regenerate markdown -> commit -> push
 *
 * There are two targets, because the digest may or may not still be an open PR
 * when the enrichment finishes:
 *
 *   branch mode — origin/daily-digest/<date> still exists (PR open). Commit and
 *                 push there; digest-fallback merges it and the site follows.
 *   main mode   — the date is already published on main. Commit straight to
 *                 main; the push triggers deploy.yml and the published post is
 *                 updated in place.
 *
 * main mode is not an edge case, it is the normal one. The fallback merge lands
 * at ~06:47-07:53 KST while the enrichment session runs at ~08:05, so by the
 * time enrichment finishes the branch is usually already merged and deleted.
 * Before this mode existed the script simply refused, and four days of Korean
 * summaries (2026-08-06..09) were generated and then thrown away — the 08-11
 * run had all 23 articles enriched on disk and could not publish a single one.
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

// DATE becomes both a file path and a git ref. Pin the shape.
if (!/^\d{4}-\d{2}-\d{2}$/.test(DATE)) {
  console.error(`\n✗ --date 는 YYYY-MM-DD 형식이어야 한다 (받은 값: "${DATE}")\n`);
  process.exit(1);
}

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

// --- 1. Which target? ------------------------------------------------------
// Mode detection reads remote state, so the remote refs must be current. Without
// the prune a deleted digest branch lingers as a stale origin/ ref and the script
// picks branch mode for a date that was merged hours ago.
try {
  git('fetch', 'origin', '--prune', '--quiet');
} catch (err) {
  die(
    `git fetch 실패 — 원격 상태를 못 읽어 대상을 정할 수 없다.\n` +
      `  ${String(err.stderr || err.message).trim().split('\n')[0]}\n` +
      `  'cannot lock ref' 라면 stale 락이다. 이름을 바꾸지 말고 지워라:\n` +
      `    find .git -name '*.lock' -not -path '*/.stale-trash/*' -ls   # 확인 후 rm`
  );
}

const exists = (ref) => {
  try {
    git('rev-parse', '--verify', '--quiet', ref);
    return true;
  } catch {
    return false;
  }
};
const publishedOnMain = (() => {
  try {
    git('cat-file', '-e', `origin/main:${`src/content/posts/daily-digest-${DATE}.md`}`);
    return true;
  } catch {
    return false;
  }
})();

// Published wins over branch-exists: once the post is on main, main is the thing
// readers actually see, so that is what enrichment has to update. (A branch may
// still exist for a published date — e.g. a --force regenerated replacement —
// and pushing enrichment there would update a PR nobody is going to merge.)
const MODE = publishedOnMain ? 'main' : exists(`origin/${BRANCH}`) ? 'branch' : null;
if (!MODE) {
  die(
    `${DATE} 다이제스트를 origin 어디에서도 못 찾았다.\n` +
      `  origin/${BRANCH} 도 없고 origin/main 에도 발행돼 있지 않다.\n` +
      `  수집이 아직 안 돌았거나 날짜가 틀렸다.`
  );
}

const TARGET = MODE === 'main' ? 'main' : BRANCH;
const current = git('rev-parse', '--abbrev-ref', 'HEAD');
if (current !== TARGET) {
  die(
    MODE === 'main'
      ? `${DATE} 는 이미 main 에 발행돼 있으므로 보강은 main 위에서 커밋한다.\n` +
        `  현재 브랜치는 '${current}' 다.\n` +
        `  이동:  git checkout main && git pull --ff-only origin main`
      : `현재 브랜치가 '${current}' 다. 보강 커밋은 '${BRANCH}' 위에서만 한다.\n` +
        `  수집 브랜치로 이동:  git checkout -B ${BRANCH} origin/${BRANCH}`
  );
}
log(`대상: ${MODE === 'main' ? 'main (이미 발행됨 — 발행본을 갱신한다)' : `${BRANCH} (PR 미머지)`}`);

// Committing straight to main is the one place a stray staged file would land in
// production, so refuse when anything unrelated is already staged.
const preStaged = git('diff', '--cached', '--name-only')
  .split('\n')
  .filter(Boolean);
if (preStaged.length) {
  die(
    `이미 스테이징된 파일이 있다 — 보강과 무관한 변경이 함께 커밋된다.\n` +
      preStaged.map((p) => `    ${p}`).join('\n') +
      `\n  먼저 정리하라:  git restore --staged <파일>`
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
  log(`[dry run] push: origin ${TARGET}`);
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
  git('rev-parse', '--verify', `origin/${TARGET}`);
  ahead = git('rev-list', '--count', `origin/${TARGET}..HEAD`);
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
    return git('rev-list', '--count', `HEAD..origin/${TARGET}`);
  } catch {
    return '0';
  }
})();
if (behind !== '0') {
  die(
    `원격 ${TARGET} 에 로컬에 없는 커밋이 ${behind}개 있다 (분기 상태).\n` +
      `  강제 푸시하지 않는다 — 남의 커밋을 지울 수 있다.\n` +
      `  먼저 합쳐라:  git pull --rebase origin ${TARGET}   그리고 이 명령을 다시 실행.`
  );
}

log(`push: origin ${TARGET} (${ahead === 'new' ? '신규 브랜치' : `${ahead} 커밋`})`);
try {
  execFileSync('git', ['push', 'origin', TARGET], { stdio: 'inherit' });
} catch {
  die(`push 실패 — 위 git 출력을 확인하라. 보강 커밋은 로컬에 남아 있으니 재실행하면 다시 시도한다.`);
}

log(
  MODE === 'main'
    ? `\n✓ 보강 발행 완료 — main 에 올렸다. 이 push 가 deploy.yml 을 깨우므로 몇 분 뒤 사이트에 반영된다.`
    : `\n✓ 보강 발행 완료 — PR 이 갱신됐다. digest-fallback 이 머지하면 사이트에 반영된다.`
);
