#!/usr/bin/env node
/**
 * Enrich one daily digest JSON with OpenAI structured output.
 *
 * Input:  src/content/posts/.digest-data/YYYY-MM-DD.json
 * Output: same JSON with summaryKo/summaryEn/insightKo/insightEn added.
 *
 * The model is given only the collected title/excerpt/link. It must not invent
 * facts that are not supported by that source material. The resulting fields
 * are validated before the file is written.
 */

import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const dateArg = argv.indexOf('--date');
const DATE = dateArg !== -1 && argv[dateArg + 1]
  ? argv[dateArg + 1]
  : new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

if (!/^\d{4}-\d{2}-\d{2}$/.test(DATE)) {
  console.error(`--date must be YYYY-MM-DD (got ${DATE})`);
  process.exit(1);
}

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error('OPENAI_API_KEY is required');
  process.exit(1);
}

const MODEL = process.env.OPENAI_MODEL || 'gpt-5.6-luna';
const DATA = path.join('src/content/posts/.digest-data', `${DATE}.json`);
const FIELDS = ['summaryKo', 'summaryEn', 'insightKo', 'insightEn'];
const BATCH_SIZE = 8;

if (!fs.existsSync(DATA)) {
  console.log(`No digest data for ${DATE}: ${DATA}`);
  process.exit(0);
}

const payload = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const articles = Array.isArray(payload.articles) ? payload.articles : [];
if (!articles.length) {
  console.log(`${DATE}: no articles`);
  process.exit(0);
}

const articleSchema = {
  type: 'object',
  properties: {
    link: { type: 'string' },
    summaryKo: { type: 'string' },
    summaryEn: { type: 'string' },
    insightKo: { type: 'string' },
    insightEn: { type: 'string' },
  },
  required: ['link', 'summaryKo', 'summaryEn', 'insightKo', 'insightEn'],
  additionalProperties: false,
};

const responseSchema = {
  type: 'object',
  properties: {
    articles: { type: 'array', items: articleSchema },
  },
  required: ['articles'],
  additionalProperties: false,
};

function getOutputText(response) {
  if (typeof response.output_text === 'string') return response.output_text;
  const texts = [];
  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === 'string') texts.push(content.text);
    }
  }
  const text = texts.join('');
  if (!text) throw new Error('OpenAI response did not contain output text');
  return text;
}

function validateResult(items, expected) {
  if (!Array.isArray(items) || items.length !== expected.length) {
    throw new Error(`batch size mismatch: expected ${expected.length}, got ${items?.length ?? 0}`);
  }
  const expectedLinks = new Set(expected.map((a) => a.link));
  const seen = new Set();

  for (const item of items) {
    if (!expectedLinks.has(item.link)) throw new Error(`unexpected link in model output: ${item.link}`);
    if (seen.has(item.link)) throw new Error(`duplicate link in model output: ${item.link}`);
    seen.add(item.link);
    for (const field of FIELDS) {
      if (typeof item[field] !== 'string' || !item[field].trim()) {
        throw new Error(`${field} missing for ${item.link}`);
      }
    }
    if (!/[가-힣]/.test(item.summaryKo) || !/[가-힣]/.test(item.insightKo)) {
      throw new Error(`Korean output contains no Hangul: ${item.link}`);
    }
    if (/[가-힣一-龯ぁ-ゖァ-ヺ]/.test(item.summaryEn) || /[가-힣一-龯ぁ-ゖァ-ヺ]/.test(item.insightEn)) {
      throw new Error(`English output contains CJK text: ${item.link}`);
    }
    if (item.summaryEn.trim() === (expected.find((a) => a.link === item.link)?.excerpt || '').trim()) {
      throw new Error(`summaryEn is verbatim excerpt: ${item.link}`);
    }
  }
}

async function enrichBatch(batch, batchNo, totalBatches) {
  const source = batch.map((a, i) => ({
    index: i + 1,
    link: a.link,
    source: a.source,
    category: a.category,
    title: a.title,
    excerpt: a.excerpt || '',
  }));

  const input = [
    `You are the technical editor for a Cloud/Kubernetes/AI/DevOps engineering blog.`,
    `Enrich the ${source.length} supplied articles for the ${DATE} daily digest.`,
    `Use only the supplied title, source, category, excerpt, and link as evidence.`,
    `Do not invent facts, metrics, product capabilities, names, dates, or claims that are not supported by that material.`,
    `When the excerpt is incomplete, explicitly stay at the topic level instead of guessing.`,
    `Return exactly one object per input article and preserve each link byte-for-byte.`,
    `summaryKo: natural Korean, 3-5 factual sentences.`,
    `summaryEn: natural English, 3-5 factual sentences.`,
    `insightKo: one concise Korean sentence from a Cloud/DevOps engineer perspective.`,
    `insightEn: one concise English sentence conveying the same practical implication.`,
    `Avoid marketing language, filler, and direct translationese.`,
    '',
    JSON.stringify(source, null, 2),
  ].join('\n');

  console.log(`OpenAI batch ${batchNo}/${totalBatches}: ${batch.length} articles (${MODEL})`);

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      input,
      text: {
        format: {
          type: 'json_schema',
          name: 'digest_enrichment_batch',
          strict: true,
          schema: responseSchema,
        },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI API ${res.status}: ${body.slice(0, 1200)}`);
  }

  const json = await res.json();
  const parsed = JSON.parse(getOutputText(json));
  validateResult(parsed.articles, batch);
  return parsed.articles;
}

const resultByLink = new Map();
for (let i = 0; i < articles.length; i += BATCH_SIZE) {
  const batch = articles.slice(i, i + BATCH_SIZE);
  const result = await enrichBatch(batch, Math.floor(i / BATCH_SIZE) + 1, Math.ceil(articles.length / BATCH_SIZE));
  for (const item of result) resultByLink.set(item.link, item);
}

if (resultByLink.size !== articles.length) {
  throw new Error(`final enrichment count mismatch: ${resultByLink.size}/${articles.length}`);
}

for (const article of articles) {
  const item = resultByLink.get(article.link);
  for (const field of FIELDS) article[field] = item[field].trim();
}

const enrichedCount = articles.filter((a) => FIELDS.every((f) => typeof a[f] === 'string' && a[f].trim())).length;
if (enrichedCount !== articles.length) throw new Error(`not fully enriched: ${enrichedCount}/${articles.length}`);

fs.writeFileSync(DATA, JSON.stringify(payload, null, 2) + '\n', 'utf8');
console.log(`✓ ${DATE}: ${enrichedCount}/${articles.length} articles enriched with ${MODEL}`);
