#!/usr/bin/env node
/**
 * RSS feed collector (no AI, no external API cost).
 *
 * Fetches a broad, curated set of Cloud / Kubernetes / AI / DevOps RSS feeds,
 * keeps articles published within the last 24 hours, categorizes them by
 * source, caps each source to PER_SOURCE_CAP so no single outlet dominates,
 * and writes the raw data to:
 *
 *   src/content/posts/.digest-data/YYYY-MM-DD.json
 *
 * This is the step that runs in GitHub Actions. The companion script
 * `generate-daily-digest.mjs` turns this JSON into markdown posts.
 *
 * If no articles are found in the last 24h, it exits 0 without writing a file.
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

const WINDOW_MS = 24 * 60 * 60 * 1000;
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

async function collectArticles() {
  const parser = new Parser({
    timeout: FETCH_TIMEOUT_MS,
    headers: { 'User-Agent': USER_AGENT },
  });
  const cutoff = Date.now() - WINDOW_MS;
  const articles = [];
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
      if (!date || date.getTime() < cutoff) continue;
      const link = (item.link || '').trim();
      const title = cleanText(item.title);
      if (!link || !title) continue;
      articles.push({
        source: feed.name,
        category: feed.category, // stable category key from source
        title,
        link,
        date: date.toISOString(),
        excerpt: excerptFrom(item.contentSnippet || item.content || item.summary),
      });
      count++;
    }
    log(`${feed.name}: ${count} recent article(s)`);
  }

  // Newest first, then cap each source to PER_SOURCE_CAP (keeping its most
  // recent items) so a high-volume outlet can't flood the day, then apply the
  // global cap. This is what keeps the digest varied across many publishers.
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  const perSourceCount = new Map();
  const capped = [];
  for (const a of articles) {
    const n = perSourceCount.get(a.source) || 0;
    if (n >= PER_SOURCE_CAP) continue;
    perSourceCount.set(a.source, n + 1);
    capped.push(a);
  }
  return { articles: capped.slice(0, MAX_ARTICLES), ok, failed: failures.length, failures };
}

async function main() {
  const date = kstDateString();
  log(`collecting feeds for ${date}`);

  const { articles, ok, failed, failures } = await collectArticles();
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
    log('no articles found in the last 24h — skipping today (no file written)');
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
