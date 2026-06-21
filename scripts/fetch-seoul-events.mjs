#!/usr/bin/env node
/**
 * Seoul cultural events fetcher — 한국관광공사 Tour API (apis.data.go.kr)
 *
 * 공공데이터포털(data.go.kr) 한국관광공사 Tour API를 통해 서울(areaCode=1) 축제/행사 정보를 수집.
 * openapi.seoul.go.kr은 GitHub Actions 미국 서버에서 차단되어 이 API로 대체.
 *
 * API 신청: https://www.data.go.kr/data/15101578/openapi.do
 *   (한국관광공사_국문 관광정보 서비스_GW → festivalList1)
 *
 * Environment variables:
 *   KOREA_API_KEY  — 공공데이터포털에서 발급받은 Decoding 키
 *
 * Usage:
 *   node scripts/fetch-seoul-events.mjs
 *   npm run events:fetch
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_FILE = path.join(ROOT, 'src/content/events/data.json');

const API_KEY = process.env.KOREA_API_KEY;
if (!API_KEY) {
  console.error('[events] Error: KOREA_API_KEY env var is required.');
  console.error('  Register at: https://www.data.go.kr/data/15101578/openapi.do');
  process.exit(1);
}

const BASE_URL = 'https://apis.data.go.kr/B551011/KorService2/festivalList2';
const FETCH_TIMEOUT_MS = 20000;

function log(msg) { console.log(`[events] ${msg}`); }

function kstToday() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, '');
}

async function fetchPage(start, end, eventStartDate) {
  const params = new URLSearchParams({
    serviceKey: API_KEY,
    numOfRows: String(end - start + 1),
    pageNo: String(Math.ceil(start / (end - start + 1))),
    MobileOS: 'ETC',
    MobileApp: 'dasomel-blog',
    _type: 'json',
    areaCode: '1',        // 서울
    eventStartDate,       // YYYYMMDD
    listYN: 'Y',
    arrange: 'A',
  });

  const url = `${BASE_URL}?${params}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    log(`Fetching: ${BASE_URL}?areaCode=1&eventStartDate=${eventStartDate}&pageNo=${params.get('pageNo')}`);
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${body.slice(0, 300)}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function normalizeEvent(item) {
  const startDate = String(item.eventstartdate || '');
  const endDate = String(item.eventenddate || '');
  const formatDate = (d) => d.length === 8 ? `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}` : d;

  return {
    id: String(item.contentid || item.title || Math.random()),
    title: String(item.title || '').trim(),
    category: String(item.cat2 || '행사').trim(),
    place: String(item.addr1 || '서울').trim(),
    guName: String(item.addr2 || '').trim(),
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    dateRange: startDate && endDate
      ? `${formatDate(startDate)} ~ ${formatDate(endDate)}`
      : formatDate(startDate),
    isFree: false,
    link: item.firstimage ? '' : '',
    imageUrl: String(item.firstimage || item.firstimage2 || '').trim(),
    organizer: '',
    thema: String(item.cat3 || '').trim(),
  };
}

async function main() {
  const today = kstToday();
  log(`Fetching Seoul festivals/events (today KST: ${today})...`);

  // 오늘부터 3개월 후까지
  const threeMonthsLater = new Date(Date.now() + 9 * 60 * 60 * 1000 + 90 * 24 * 60 * 60 * 1000)
    .toISOString().slice(0, 10).replace(/-/g, '');

  let data;
  try {
    data = await fetchPage(1, 100, today);
  } catch (err) {
    log(`Fetch failed: ${err.message}`);
    process.exit(1);
  }

  const response = data?.response;
  if (!response) {
    log(`Unexpected response shape: ${JSON.stringify(data).slice(0, 300)}`);
    process.exit(1);
  }

  const header = response.header;
  if (header?.resultCode !== '0000' && header?.resultCode !== '00') {
    log(`API error: ${header?.resultCode} — ${header?.resultMessage}`);
    process.exit(1);
  }

  const items = response.body?.items?.item;
  if (!items) {
    log('No items in response.');
    const output = { updatedAt: new Date().toISOString(), events: [] };
    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
    fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2) + '\n', 'utf-8');
    return;
  }

  const list = Array.isArray(items) ? items : [items];
  log(`Total events fetched: ${list.length}`);

  const todayDash = `${today.slice(0,4)}-${today.slice(4,6)}-${today.slice(6,8)}`;
  const upcoming = list
    .map(normalizeEvent)
    .filter(e => !e.endDate || e.endDate >= todayDash)
    .sort((a, b) => (a.startDate > b.startDate ? 1 : -1));

  log(`Upcoming events: ${upcoming.length}`);

  const output = { updatedAt: new Date().toISOString(), events: upcoming };
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2) + '\n', 'utf-8');
  log(`Saved ${upcoming.length} events to ${path.relative(ROOT, OUT_FILE)}`);
}

main().catch(err => {
  console.error('[events] Fatal:', err);
  process.exit(1);
});
