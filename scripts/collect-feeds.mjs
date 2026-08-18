#!/usr/bin/env node
/**
 * RSS feed collector (no AI, no external API cost).
 *
 * Fetches a broad, curated set of Cloud / Kubernetes / AI / DevOps RSS feeds,
 * keeps articles published within the last 72 hours, drops anything an earlier
 * digest already carried, categorizes them by source, caps each source to
 * PER_SOURCE_CAP so no single outlet dominates, and writes the raw data to:
 *
 *   src/content/posts/.digest-data/YYYY-MM-DD.json
 *
 * This is the step that runs in GitHub Actions. The companion script
 * `generate-daily-digest.mjs` turns this JSON into markdown posts.
 *
 * If no articles are found in the last 72h, it exits 0 without writing a file.
 * Re-running on the same day overwrites the same JSON file (idempotent).
 *
 * Shared constants/helpers (FEEDS, categories, date) are imported from
 * `lib/digest-feeds.mjs` so both scripts stay in sync.
 */

import fs from 'node:fs';
import path from 'node:path';
import Parser from 'rss-parser';
import {
  FEEDS,
  DATA_DIR,
  kstDateString,
  categoryForSource,
  cleanText,
  excerptFrom,
  log,
} from './lib/digest-feeds.mjs';

// 24h starved the weekend: Sunday and Monday digests ran 1-4 articles for eight
// straight weeks because sources simply don't post then. 72h + the dedup pass
// below fixes that without repeating content — it lets through the items that
// PER_SOURCE_CAP threw away on the preceding busy weekdays.
const WINDOW_MS = 72 * 60 * 60 * 1000;
// Only used when the normal window comes back empty after dedup — see the
// rescue pass in collectArticles(). Never widens a day that already has items.
const RESCUE_WINDOW_DAYS = 7;
const RESCUE_WINDOW_MS = RESCUE_WINDOW_DAYS * 24 * 60 * 60 * 1000;
const DEDUP_LOOKBACK_DAYS = 14; // how far back to read prior digests when deduping
const MAX_ARTICLES = 60; // generous cap; markdown step trims for display
const PER_SOURCE_CAP = 3; // keep at most N most-recent items per source so one busy outlet can't dominate the day
const FETCH_TIMEOUT_MS = 20000;
const RETRIES = 2; // total attempts per feed = RETRIES + 1
const FAIL_RATIO_ABORT = 0.5; // if > this fraction of feeds fail, treat the whole run as failed
// Some feeds (e.g. OpenAI) reject the default rss-parser UA with 403; send a real one.
const USER_AGENT =
  'Mozilla/5.0 (compatible; dasomel-digest-bot/1.0; +https://github.com/dasomel/dasomel.github.io)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function articleDate(item) {
  const raw = item.isoDate || item.pubDate || item.published || item.date;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Normalizes article URLs for exact dedup comparison across digests.
 * Lowercases, strips trailing slashes, removes utm_* & ref query params, and strips hash fragments.
 * Returns original raw string if URL parsing fails.
 */
function normalizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  try {
    const u = new URL(rawUrl.trim());
    u.hash = '';
    for (const key of [...u.searchParams.keys()]) {
      if (key.startsWith('utm_') || key === 'ref') {
        u.searchParams.delete(key);
      }
    }
    let res = u.toString().toLowerCase();
    if (res.endsWith('/')) {
      res = res.slice(0, -1);
    }
    return res;
  } catch {
    return rawUrl;
  }
}

/**
 * Collects the normalized links of every article carried by the prior
 * DEDUP_LOOKBACK_DAYS digests, so today's run can skip what was already
 * published.
 *
 * Today's own file must be excluded, or re-running the collector on the same
 * day would dedup against its own previous output and yield nothing.
 *
 * A prior file that is missing or unparsable is skipped, not fatal: a broken
 * old digest must not be able to stop today's collection.
 */
function loadPublishedLinks(todayStr) {
  const publishedLinks = new Set();
  let loadedFilesCount = 0;

  if (!fs.existsSync(DATA_DIR)) {
    return { publishedLinks, loadedFilesCount };
  }

  let entries = [];
  try {
    entries = fs.readdirSync(DATA_DIR);
  } catch (err) {
    log(`WARN: failed to read ${DATA_DIR}: ${err.message}`);
    return { publishedLinks, loadedFilesCount };
  }

  const todayTime = new Date(`${todayStr}T00:00:00Z`).getTime();
  const lookbackMs = DEDUP_LOOKBACK_DAYS * 24 * 60 * 60 * 1000;

  for (const file of entries) {
    if (!/^\d{4}-\d{2}-\d{2}\.json$/.test(file)) continue;

    const fileDateStr = file.replace('.json', '');
    // The age check below already excludes today (ageMs === 0), but say it
    // outright: if today's file ever leaks in, a same-day re-run dedups
    // against its own previous output and silently collects nothing.
    if (fileDateStr === todayStr) continue;

    const fileTime = new Date(`${fileDateStr}T00:00:00Z`).getTime();
    if (Number.isNaN(fileTime)) continue;

    const ageMs = todayTime - fileTime;
    if (ageMs <= 0 || ageMs > lookbackMs) continue;

    const filePath = path.join(DATA_DIR, file);
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
      log(`WARN: failed to read prior digest ${file}: ${err.message}`);
      continue;
    }

    let json;
    try {
      json = JSON.parse(content);
    } catch (err) {
      log(`WARN: failed to parse prior digest JSON ${file}: ${err.message}`);
      continue;
    }

    loadedFilesCount++;
    if (Array.isArray(json.articles)) {
      for (const item of json.articles) {
        if (item && item.link) {
          publishedLinks.add(normalizeUrl(item.link));
        }
      }
    }
  }

  return { publishedLinks, loadedFilesCount };
}

async function collectArticles(todayStr) {
  const parser = new Parser({
    timeout: FETCH_TIMEOUT_MS,
    headers: { 'User-Agent': USER_AGENT },
  });
  const cutoff = Date.now() - WINDOW_MS;
  // Loaded before any network work: it doesn't depend on the feeds, and a
  // warning about an unreadable prior digest should surface before we spend
  // a minute fetching rather than after.
  const { publishedLinks, loadedFilesCount } = loadPublishedLinks(todayStr);
  // Every dated item each feed offers, unfiltered. Windowing happens after the
  // fetch loop so a second, wider pass costs no extra network round trips.
  const pool = [];
  const failures = [];
  let ok = 0;

  for (const feed of FEEDS) {
    // Retry transient errors (5xx / timeouts) with linear backoff.
    let parsed = null;
    let lastErr = null;
    for (let attempt = 0; attempt <= RETRIES; attempt++) {
      try {
        parsed = await parser.parseURL(feed.url);
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
        if (attempt < RETRIES) await sleep(1000 * (attempt + 1));
      }
    }
    if (!parsed) {
      failures.push({ name: feed.name, url: feed.url, error: lastErr ? lastErr.message : 'unknown' });
      log(`WARN: failed to fetch ${feed.name} (${feed.url}) after ${RETRIES + 1} attempt(s): ${lastErr ? lastErr.message : 'unknown'}`);
      continue;
    }
    ok++;
    let count = 0;
    for (const item of parsed.items || []) {
      const date = articleDate(item);
      if (!date) continue;
      const link = (item.link || '').trim();
      const title = cleanText(item.title);
      if (!link || !title) continue;
      if (date.getTime() >= cutoff) count++;
      pool.push({
        source: feed.name,
        category: feed.category, // stable category key from source
        title,
        link,
        date: date.toISOString(),
        excerpt: excerptFrom(item.contentSnippet || item.content || item.summary),
      });
    }
    log(`${feed.name}: ${count} recent article(s)`);
  }

  // Window -> dedup -> newest first -> per-source cap -> global cap.
  //
  // The cap runs *after* dedup on purpose: an item a busy source lost to the
  // cap yesterday is still unpublished, so it can be picked up today. That is
  // the mechanism that fills weekends, when almost nothing new is posted.
  const select = (since) => {
    let skipped = 0;
    const fresh = [];
    for (const a of pool) {
      if (new Date(a.date).getTime() < since) continue;
      if (publishedLinks.has(normalizeUrl(a.link))) {
        skipped++;
        continue;
      }
      fresh.push(a);
    }
    fresh.sort((a, b) => new Date(b.date) - new Date(a.date));
    const perSource = new Map();
    const capped = [];
    for (const a of fresh) {
      const n = perSource.get(a.source) || 0;
      if (n >= PER_SOURCE_CAP) continue;
      perSource.set(a.source, n + 1);
      capped.push(a);
    }
    return { articles: capped.slice(0, MAX_ARTICLES), skipped };
  };

  let { articles, skipped } = select(cutoff);
  log(`dedup: skipped ${skipped} already-published article(s) from ${loadedFilesCount} prior digest(s)`);

  // Dedup can empty the day entirely: on 2026-08-17 all 19 items inside the 72h
  // window had already been published, so no file was written and the blog simply
  // had no post that day. A gap is worse than a thin digest, and the items a busy
  // weekday dropped to PER_SOURCE_CAP are still unpublished — reach further back
  // for those rather than give up. Dedup still guarantees nothing repeats.
  if (articles.length === 0) {
    const rescue = select(Date.now() - RESCUE_WINDOW_MS);
    if (rescue.articles.length) {
      log(
        `window empty after dedup — widening to ${RESCUE_WINDOW_DAYS}d and found ` +
          `${rescue.articles.length} unpublished article(s) the cap had dropped earlier`
      );
      articles = rescue.articles;
    }
  }

  return { articles, ok, failed: failures.length, failures };
}

async function main() {
  const date = kstDateString();
  log(`collecting feeds for ${date}`);

  const { articles, ok, failed, failures } = await collectArticles(date);
  log(`feed health: ${ok}/${FEEDS.length} ok, ${failed} failed`);

  // Distinguish an infrastructure failure from a genuinely quiet news day.
  // If every feed failed, or more than half failed, exit non-zero so the CI
  // run is marked failed (and visible) instead of silently writing no file —
  // which previously looked identical to "no news today".
  if (ok === 0 || failed / FEEDS.length > FAIL_RATIO_ABORT) {
    console.error(
      `[digest] ERROR: ${failed}/${FEEDS.length} feeds failed — aborting. ` +
        `This is likely a network/feed outage, not a quiet news day.`,
    );
    for (const f of failures) console.error(`  - ${f.name} (${f.url}): ${f.error}`);
    process.exit(1);
  }

  if (articles.length === 0) {
    log(
      `no unpublished articles found in the last 72h, nor in the ${RESCUE_WINDOW_DAYS}d ` +
        `rescue window — skipping today (no file written)`
    );
    process.exit(0);
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const outPath = path.join(DATA_DIR, `${date}.json`);
  /**
   * Output JSON schema — src/content/posts/.digest-data/YYYY-MM-DD.json
   *
   * {
   *   date: "YYYY-MM-DD",            // KST date
   *   generatedAt: ISO-8601 string,
   *   count: number,
   *   articles: [
   *     {
   *       // --- written by this collector ---
   *       source:   string,          // feed name, e.g. "Kubernetes"
   *       category: "k8s"|"ai"|"cloud"|"devops",
   *       title:    string,          // original article title
   *       link:     string,          // original URL
   *       date:     ISO-8601 string, // article publish date
   *       excerpt:  string,          // 1-2 sentence RSS excerpt (may be "")
   *
   *       // --- optional, added later by the Phase 2 Cowork/Claude step ---
   *       // All optional. `generate-daily-digest.mjs --enrich` uses these when
   *       // present and falls back to `excerpt` per-field when absent.
   *       summaryKo?: string,        // 2-3 sentence Korean summary
   *       summaryEn?: string,        // 2-3 sentence English summary
   *       insightKo?: string,        // 1 sentence "why it matters" (Korean)
   *       insightEn?: string,        // 1 sentence "why it matters" (English)
   *     },
   *     ...
   *   ]
   * }
   */
  const payload = {
    date,
    generatedAt: new Date().toISOString(),
    count: articles.length,
    articles,
  };
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf-8');

  log(`wrote ${path.relative(process.cwd(), outPath)} (${articles.length} article(s))`);
  // Quick category breakdown for the log.
  const byCat = {};
  for (const a of articles) byCat[categoryForSource(a.source)] = (byCat[categoryForSource(a.source)] || 0) + 1;
  log('by category:', JSON.stringify(byCat));
}

main()
  .then(() => {
    // rss-parser may leave keep-alive sockets open, which keeps the Node event
    // loop alive and hangs the process (and the CI step) after work is done.
    // Exit explicitly now that all output is written synchronously.
    process.exit(0);
  })
  .catch((err) => {
    console.error('[digest] FATAL:', err);
    process.exit(1);
  });
