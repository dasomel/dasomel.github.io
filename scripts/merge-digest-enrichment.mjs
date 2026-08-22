#!/usr/bin/env node
/** Merge YYYY-MM-DD-ai*.json sidecars into canonical digest JSON and regenerate posts. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DATA_DIR = 'src/content/posts/.digest-data';
const files = fs.readdirSync(DATA_DIR).filter((name) => /^\d{4}-\d{2}-\d{2}-ai(?:-[^.]*)?\.json$/.test(name));
const dates = [...new Set(files.map((name) => name.slice(0, 10)))].sort();

for (const date of dates) {
  const sidecars = files.filter((name) => name.startsWith(`${date}-ai`) && name.endsWith('.json'));
  const dataPath = path.join(DATA_DIR, `${date}.json`);
  if (!fs.existsSync(dataPath)) continue;

  const base = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const enrichment = {};
  for (const name of sidecars) {
    const payload = JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), 'utf-8'));
    Object.assign(enrichment, payload.articles ?? {});
  }

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
