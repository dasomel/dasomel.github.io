#!/usr/bin/env node
/**
 * Seoul cultural events fetcher.
 *
 * Fetches upcoming cultural events and festivals from Seoul Open Data Plaza API
 * (data.seoul.go.kr) and writes the result to:
 *
 *   src/content/events/data.json
 *
 * The page reads this JSON at build time and renders event cards.
 *
 * Environment variables:
 *   SEOUL_API_KEY   — API key from data.seoul.go.kr (required in production)
 *                     Sign up at: https://data.seoul.go.kr/
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

const API_KEY = process.env.SEOUL_API_KEY;
if (!API_KEY) {
  console.error('[events] Error: SEOUL_API_KEY env var is required.');
  console.error('  Get one at: https://data.seoul.go.kr/');
  process.exit(1);
}

const BASE_URL = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo`;
const PAGE_SIZE = 100;
const MAX_PAGES = 5;
const FETCH_TIMEOUT_MS = 15000;

function log(msg) {
  console.log(`[events] ${msg}`);
}

function todayKST() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, '');
}

function parseDate(raw) {
  if (!raw) return '';
  // Seoul API returns "YYYY-MM-DD" or "YYYY.MM.DD" or "YYYYMMDD"
  const cleaned = String(raw).replace(/\./g, '-').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
  return cleaned.slice(0, 10);
}

async function fetchPage(start, end) {
  const url = `${BASE_URL}/${start}/${end}/`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function normalizeEvent(raw) {
  const ticket = String(raw.TICKET || '').trim().toLowerCase();
  const isFree = ticket === '무료' || ticket === 'free' || ticket === '';
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

async function main() {
  const today = todayKST();
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
      break;
    }

    const result = data?.culturalEventInfo;
    if (!result || result.RESULT?.CODE !== 'INFO-000') {
      const code = result?.RESULT?.CODE;
      const msg = result?.RESULT?.MESSAGE;
      if (code === 'INFO-200') {
        log('No more results.');
      } else {
        log(`API error: ${code} — ${msg}`);
      }
      break;
    }

    if (page === 0) {
      totalCount = result.list_total_count || 0;
      log(`Total events in API: ${totalCount}`);
    }

    const rows = result.row || [];
    allEvents.push(...rows.map(normalizeEvent));
    log(`Page ${page + 1}: ${rows.length} events fetched (total so far: ${allEvents.length})`);

    if (allEvents.length >= totalCount) break;
  }

  // Keep only events that haven't ended yet (endDate >= today)
  const todayDash = `${today.slice(0, 4)}-${today.slice(4, 6)}-${today.slice(6, 8)}`;
  const upcoming = allEvents
    .filter(e => e.endDate >= todayDash || !e.endDate)
    .sort((a, b) => (a.startDate > b.startDate ? 1 : -1));

  log(`Upcoming events: ${upcoming.length} / ${allEvents.length}`);

  const output = {
    updatedAt: new Date().toISOString(),
    events: upcoming,
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2) + '\n', 'utf-8');
  log(`Saved ${upcoming.length} events to ${path.relative(ROOT, OUT_FILE)}`);
}

main().catch(err => {
  console.error('[events] Fatal:', err);
  process.exit(1);
});
