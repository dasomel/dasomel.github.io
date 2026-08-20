#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const dir = path.join(process.cwd(), 'src/content/posts');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
const ko = files.filter((f) => !f.endsWith('-en.md') && !f.startsWith('daily-digest-'));
const missing = ko.filter((f) => !fs.existsSync(path.join(dir, f.replace(/\.md$/, '-en.md'))));

for (const file of ko) {
  const parsed = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
  if (parsed.data.draft === true) continue;
}

console.log(`KO notes: ${ko.length}`);
console.log(`Missing EN notes: ${missing.length}`);
for (const file of missing) console.log(`- ${file}`);
process.exit(missing.length ? 1 : 0);
