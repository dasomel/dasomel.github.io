#!/usr/bin/env node
/**
 * RSS feed collector (no AI, no external API cost).
 *
 * Fetches a curated set of Cloud / Kubernetes / AI / DevOps RSS feeds,
 * keeps articles published within the last 24 hours, categorizes them by
 * source, and writes the raw data to:
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

function articleDate(item) {
  const raw = item.isoDate || item.pubDate || item.published || item.date;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function collectArticles() {
  const parser = new Parser({ timeout: 20000 });
  const cutoff = Date.now() - WINDOW_MS;
  const articles = [];

  for (const feed of FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
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
    } catch (err) {
      log(`WARN: failed to fetch ${feed.name} (${feed.url}): ${err.message}`);
    }
  }

  // Newest first, then cap.
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  return articles.slice(0, MAX_ARTICLES);
}

async function main() {
  const date = kstDateString();
  log(`collecting feeds for ${date}`);

  const articles = await collectArticles();
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
