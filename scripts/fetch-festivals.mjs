#!/usr/bin/env node
/**
 * Nationwide festival fetcher — 한국관광공사 KorService2 축제정보 API
 *
 * 전국 축제 데이터를 수집해 기존 data.json(서울 행사)에 병합합니다.
 * 'tour-' 접두어 항목만 교체하므로 서울 행사 데이터는 보존됩니다.
 *
 * Environment variables:
 *   TOUR_API_KEY  — data.go.kr 한국관광공사 일반 인증키(Decoding)
 *
 * Usage:
 *   TOUR_API_KEY=xxx node scripts/fetch-festivals.mjs
 *   npm run festivals:fetch
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_FILE = path.join(ROOT, 'src/content/events/data.json');

const RAW_API_KEY = process.env.TOUR_API_KEY;
if (!RAW_API_KEY) {
  console.error('[festivals] Error: TOUR_API_KEY env var is required.');
  process.exit(1);
}

// data.go.kr는 Encoding/Decoding 키를 구분 없이 "일반 인증키"로 제공한다.
// 이미 퍼센트 인코딩된(Encoding) 키라면 한 번 디코딩해 원본으로 되돌린 뒤,
// URLSearchParams가 일관되게 한 번만 인코딩하도록 정규화한다. (이중 인코딩 방지)
const API_KEY = /%[0-9A-Fa-f]{2}/.test(RAW_API_KEY)
  ? decodeURIComponent(RAW_API_KEY)
  : RAW_API_KEY;

const BASE_URL = 'https://apis.data.go.kr/B551011/KorService2/searchFestival2';
const PAGE_SIZE = 100;
const MAX_PAGES = 5;
const FETCH_TIMEOUT_MS = 20000;

/** 시·도 areacode → 지역명 매핑 */
const AREA_MAP = {
  1: '서울', 2: '인천', 3: '대전', 4: '대구', 5: '광주',
  6: '부산', 7: '울산', 8: '세종', 31: '경기', 32: '강원',
  33: '충북', 34: '충남', 35: '경북', 36: '경남', 37: '전북',
  38: '전남', 39: '제주',
};

function log(msg) { console.log(`[festivals] ${msg}`); }

function kstToday() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function parseDate(raw) {
  if (!raw) return '';
  const cleaned = String(raw).replace(/\./g, '-').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
  return cleaned.slice(0, 10);
}

/** eventStartDate: 오늘 KST에서 92일 전 (YYYYMMDD) */
function startDateParam() {
  const d = new Date(Date.now() + 9 * 60 * 60 * 1000 - 92 * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10).replaceAll('-', '');
}

async function fetchPage(pageNo) {
  const params = new URLSearchParams({
    serviceKey: API_KEY,
    MobileOS: 'ETC',
    MobileApp: 'dasomel',
    _type: 'json',
    numOfRows: String(PAGE_SIZE),
    pageNo: String(pageNo),
    arrange: 'A',
    eventStartDate: startDateParam(),
  });
  const url = `${BASE_URL}?${params.toString()}`;
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

function normalizeItems(raw) {
  if (!raw || raw === '') return [];
  if (Array.isArray(raw)) return raw;
  return [raw];
}

/** detailIntro2로 관람료(usetimefestival) 조회 → '무료' 포함 시 true. 실패 시 null(판정 불가). */
async function fetchFee(contentId) {
  const params = new URLSearchParams({
    serviceKey: API_KEY,
    MobileOS: 'ETC',
    MobileApp: 'dasomel',
    _type: 'json',
    contentId: String(contentId),
    contentTypeId: '15',
  });
  const url = `https://apis.data.go.kr/B551011/KorService2/detailIntro2?${params.toString()}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.response?.header?.resultCode !== '0000') return null;
    const item = normalizeItems(data.response.body?.items?.item)[0];
    const fee = String(item?.usetimefestival || '').replace(/<[^>]*>/g, '').trim();
    if (!fee) return null;
    return fee.includes('무료') && !fee.includes('유료');
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** 동시성 제한 풀로 작업 실행 */
async function runPool(items, limit, worker) {
  const results = new Array(items.length);
  let idx = 0;
  async function next() {
    while (idx < items.length) {
      const cur = idx++;
      results[cur] = await worker(items[cur], cur);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next));
  return results;
}

function normalizeEvent(item) {
  const startDate = parseDate(item.eventstartdate);
  const endDate = parseDate(item.eventenddate);
  let dateRange = '';
  if (startDate && endDate) {
    dateRange = `${startDate.replaceAll('-', '.')} ~ ${endDate.replaceAll('-', '.')}`;
  } else if (startDate) {
    dateRange = startDate.replaceAll('-', '.');
  } else if (endDate) {
    dateRange = endDate.replaceAll('-', '.');
  }

  return {
    id: `tour-${item.contentid}`,
    title: String(item.title || '').trim(),
    category: '축제',
    place: String(item.addr1 || '').trim(),
    guName: AREA_MAP[Number(item.areacode)] || '',
    startDate,
    endDate,
    dateRange,
    isFree: false,
    link: '',
    imageUrl: String(item.firstimage || item.firstimage2 || '').trim(),
    organizer: '',
    thema: '',
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
      `git commit -m "chore(events): 전국 축제 데이터 업데이트 — ${eventCount}건 (${today})"`,
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
  log(`Fetching nationwide festivals (today KST: ${today})...`);

  const festivalEvents = [];
  let totalCount = 0;

  for (let page = 1; page <= MAX_PAGES; page++) {
    let data;
    try {
      data = await fetchPage(page);
    } catch (err) {
      log(`Page ${page} fetch failed: ${err.message}`);
      if (page === 1) process.exit(1);
      break;
    }

    const header = data?.response?.header;
    if (!header) {
      log(`Unexpected API response: ${JSON.stringify(data).slice(0, 200)}`);
      process.exit(1);
    }
    if (header.resultCode !== '0000') {
      log(`API error: ${header.resultCode} — ${header.resultMsg}`);
      if (page === 1) process.exit(1);
      break;
    }

    const body = data.response.body;
    if (page === 1) {
      totalCount = body.totalCount || 0;
      log(`Total festivals in API: ${totalCount}`);
    }

    const items = normalizeItems(body.items?.item);
    if (items.length === 0) {
      log('No more results.');
      break;
    }

    const events = items
      .map(normalizeEvent)
      .filter(e => e.title !== '');
    festivalEvents.push(...events);
    log(`Page ${page}: ${items.length} items (total so far: ${festivalEvents.length})`);
    if (festivalEvents.length >= totalCount) break;
  }

  // 관람료 상세 조회로 무료/유료 판정 (목록 API엔 요금이 없음)
  log(`Fetching fee detail for ${festivalEvents.length} festivals...`);
  const fees = await runPool(festivalEvents, 6, (e) => fetchFee(e.id.replace(/^tour-/, '')));
  let freeCount = 0;
  festivalEvents.forEach((e, i) => {
    if (fees[i] === true) { e.isFree = true; freeCount++; }
  });
  log(`Fee detail done — 무료 ${freeCount} / 유료·미상 ${festivalEvents.length - freeCount}`);

  // 기존 data.json 읽기
  let existingData = { updatedAt: '', events: [] };
  try {
    const raw = fs.readFileSync(OUT_FILE, 'utf-8');
    existingData = JSON.parse(raw);
  } catch {
    log('No existing data.json or parse failed — starting fresh.');
  }

  // 기존 서울 행사 보존 (id가 'tour-'로 시작하지 않는 항목만)
  const seoulEvents = (existingData.events || []).filter(e => !String(e.id || '').startsWith('tour-'));
  log(`기존 서울 ${seoulEvents.length}건 유지, 축제 ${festivalEvents.length}건 추가`);

  // 합치기 + 중복 제거 (id 기준)
  const mergedMap = new Map();
  for (const e of [...seoulEvents, ...festivalEvents]) {
    mergedMap.set(e.id, e);
  }

  // 오늘 기준 upcoming 필터 + startDate 정렬
  const upcoming = [...mergedMap.values()]
    .filter(e => e.endDate >= today || !e.endDate)
    .sort((a, b) => (a.startDate > b.startDate ? 1 : -1));

  log(`기존 서울 ${seoulEvents.length}건 유지, 축제 ${festivalEvents.length}건 추가, 총 ${upcoming.length}건`);

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
  console.error('[festivals] Fatal:', err);
  process.exit(1);
});
