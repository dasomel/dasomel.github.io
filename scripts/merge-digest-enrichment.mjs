#!/usr/bin/env node
/** Merge YYYY-MM-DD-ai.json into the canonical digest JSON and regenerate posts. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DATA_DIR = 'src/content/posts/.digest-data';
const files = fs.readdirSync(DATA_DIR).filter((name) => /^\d{4}-\d{2}-\d{2}-ai\.json$/.test(name));

for (const name of files) {
  const date = name.slice(0, 10);
  const sidecarPath = path.join(DATA_DIR, name);
  const dataPath = path.join(DATA_DIR, `${date}.json`);
  if (!fs.existsSync(dataPath)) continue;

  const base = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const sidecar = JSON.parse(fs.readFileSync(sidecarPath, 'utf-8'));
  const enrichment = sidecar.articles ?? {};
  let changed = false;
  let covered = 0;

  base.articles = (base.articles ?? []).map((article) => {
    const extra = enrichment[article.link];
    if (!extra) return article;
    const merged = { ...article, ...extra };
    if (merged.summaryKo || merged.summaryEn) covered += 1;
    if (JSON.stringify(merged) !== JSON.stringify(article)) changed = true;
    return merged;
  });

  if (changed) {
    fs.writeFileSync(dataPath, `${JSON.stringify(base, null, 2)}\n`, 'utf-8');
    execFileSync('node', ['scripts/generate-daily-digest.mjs', '--enrich', '--date', date], { stdio: 'inherit' });
    console.log(`✓ ${date}: merged AI enrichment for ${covered}/${base.articles.length} articles`);
  } else {
    console.log(`• ${date}: no new AI enrichment to merge`);
  }
}
