#!/usr/bin/env node
/**
 * Seoul cultural events fetcher — 서울 열린데이터광장 culturalEventInfo API
 *
 * 로컬 cron에서 실행하여 데이터를 수집하고 GitHub에 푸시합니다.
 * (openapi.seoul.go.kr은 한국 IP에서만 접근 가능하므로 로컬 실행)
 *
 * Environment variables:
 *   SEOUL_API_KEY  — data.seoul.go.kr에서 발급받은 API 키
 *
 * Usage:
 *   SEOUL_API_KEY=xxx node scripts/fetch-seoul-events.mjs
 *   npm run events:fetch
 *
 * 로컬 cron 등록 (매일 08:30 KST):
 *   crontab -e
 *   30 8 * * * cd /path/to/dasomel.github.io && npm run events:fetch >> /tmp/events.log 2>&1
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_FILE = path.join(ROOT, 'src/content/events/data.json');

const API_KEY = process.env.SEOUL_API_KEY;
if (!API_KEY) {
  console.error('[events] Error: SEOUL_API_KEY env var is required.');
  process.exit(1);
}

const BASE_URL = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo`;
const PAGE_SIZE = 100;
const MAX_PAGES = 5;
const FETCH_TIMEOUT_MS = 20000;

function log(msg) { console.log(`[events] ${msg}`); }

function kstToday() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function parseDate(raw) {
  if (!raw) return '';
  const cleaned = String(raw).replace(/\./g, '-').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
  return cleaned.slice(0, 10);
}

async function fetchPage(start, end) {
  const url = `${BASE_URL}/${start}/${end}/`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function normalizeEvent(raw) {
  // 유무료 플래그는 IS_FREE 필드("무료"/"유료")가 정답. (TICKET은 예매처 구분값이라 무관)
  const isFree = String(raw.IS_FREE || '').trim() === '무료';
  return {
    id: String(raw.CULTCODE || raw.TITLE || Math.random()),
    title: String(raw.TITLE || '').trim(),
    category: String(raw.CODENAME || '').trim(),
    place: String(raw.PLACE || '').trim(),
    guName: String(raw.GUNAME || '').trim(),
    startDate: parseDate(raw.STRTDATE),
    endDate: parseDate(raw.END_DATE),
    dateRange: String(raw.DATE_RANGE || '').trim(),
    isFree,
    link: String(raw.MAIN_LINK || raw.ORG_LINK || '').trim(),
    imageUrl: String(raw.MAIN_IMG || '').trim(),
    organizer: String(raw.ORG_NAME || '').trim(),
    thema: String(raw.THEMA || '').trim(),
  };
}

function gitPush(eventCount) {
  try {
    const today = kstToday();
    execSync('git add src/content/events/data.json', { cwd: ROOT, stdio: 'inherit' });

    const diffResult = execSync('git diff --cached --name-only', { cwd: ROOT }).toString().trim();
    if (!diffResult) {
      log('No changes to commit.');
      return;
    }

    execSync(
      `git commit -m "chore(events): 서울 행사 데이터 업데이트 — ${eventCount}건 (${today})"`,
      { cwd: ROOT, stdio: 'inherit' }
    );
    execSync('git push origin main', { cwd: ROOT, stdio: 'inherit' });
    log('Pushed to GitHub. Deploy will trigger automatically.');
  } catch (err) {
    log(`Git push failed: ${err.message}`);
    process.exit(1);
  }
}

async function main() {
  const today = kstToday();
  log(`Fetching Seoul cultural events (today KST: ${today})...`);

  const allEvents = [];
  let totalCount = 0;

  for (let page = 0; page < MAX_PAGES; page++) {
    const start = page * PAGE_SIZE + 1;
    const end = start + PAGE_SIZE - 1;
    let data;
    try {
      data = await fetchPage(start, end);
    } catch (err) {
      log(`Page ${page + 1} fetch failed: ${err.message}`);
      if (page === 0) process.exit(1);
      break;
    }

    const result = data?.culturalEventInfo;
    if (!result) {
      log(`Unexpected API response: ${JSON.stringify(data).slice(0, 200)}`);
      process.exit(1);
    }
    if (result.RESULT?.CODE !== 'INFO-000') {
      const code = result.RESULT?.CODE;
      const msg = result.RESULT?.MESSAGE;
      if (code === 'INFO-200') { log('No more results.'); }
      else { log(`API error: ${code} — ${msg}`); process.exit(1); }
      break;
    }

    if (page === 0) {
      totalCount = result.list_total_count || 0;
      log(`Total events in API: ${totalCount}`);
    }

    const rows = result.row || [];
    allEvents.push(...rows.map(normalizeEvent));
    log(`Page ${page + 1}: ${rows.length} events (total so far: ${allEvents.length})`);
    if (allEvents.length >= totalCount) break;
  }

  const upcoming = allEvents
    .filter(e => e.endDate >= today || !e.endDate)
    .sort((a, b) => (a.startDate > b.startDate ? 1 : -1));

  log(`Upcoming: ${upcoming.length} / ${allEvents.length}`);

  const output = { updatedAt: new Date().toISOString(), events: upcoming };
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2) + '\n', 'utf-8');
  log(`Saved ${upcoming.length} events to ${path.relative(ROOT, OUT_FILE)}`);

  if (process.env.GITHUB_ACTIONS === 'true') {
    log('GitHub Actions detected — skipping internal git push (workflow handles commit/push).');
  } else {
    gitPush(upcoming.length);
  }
}

main().catch(err => {
  console.error('[events] Fatal:', err);
  process.exit(1);
});
