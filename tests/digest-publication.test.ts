import { afterEach, expect, test } from 'bun:test';
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const date = '2026-10-15';
const tempDirs: string[] = [];
const summary = (name: string) => `${name} introduces a change. It describes the design. It explains the implementation. It discusses operational limits. It identifies the deployment impact.`;
const articles = [1, 2].map((id) => ({
  title: `Article ${id}`, link: `https://example.com/${id}`, source: 'Docker',
  category: 'k8s', date, excerpt: 'Original excerpt.',
  summaryKo: `${id}번 기사입니다. 설계를 설명합니다. 구현을 소개합니다. 운영 한계를 다룹니다. 배포 영향을 정리합니다.`,
  summaryEn: summary(`Article ${id}`), insightKo: '운영 영향을 검토하세요.',
  insightEn: 'Review the operational impact.',
}));

function run(cwd: string, command: string, args: string[], env = {}) {
  const result = spawnSync(command, args, {
    cwd, encoding: 'utf8', env: { ...process.env, ...env },
  });
  return { status: result.status, output: result.stdout + result.stderr };
}

function fixture() {
  const cwd = mkdtempSync(path.join(os.tmpdir(), 'digest-publication-'));
  tempDirs.push(cwd);
  mkdirSync(path.join(cwd, 'src/content/posts/.digest-data'), { recursive: true });
  cpSync(path.join(root, 'scripts'), path.join(cwd, 'scripts'), { recursive: true });
  return cwd;
}

function writeData(cwd: string, items = articles) {
  writeFileSync(path.join(cwd, `src/content/posts/.digest-data/${date}.json`), JSON.stringify({ date, count: items.length, articles: items }));
}

function render(cwd: string) {
  const result = run(cwd, 'bun', [path.join(cwd, 'scripts/generate-daily-digest.mjs'), '--enrich', '--date', date]);
  expect(result.status, result.output).toBe(0);
}

function check(cwd: string) {
  return run(cwd, 'bun', [path.join(root, 'scripts/check-enrichment.mjs'), '--strict', '--date', date]);
}

afterEach(() => {
  for (const cwd of tempDirs.splice(0)) rmSync(cwd, { recursive: true, force: true });
});

test('health uses strict mode for both today and explicit dates', () => {
  const workflow = readFileSync('.github/workflows/digest-health.yml', 'utf8');
  const commands = workflow.split('\n').filter((line) => line.includes('bun scripts/check-enrichment.mjs'));
  expect(commands.length).toBe(2);
  expect(commands.every((line) => line.includes('--strict'))).toBe(true);
});

test('missing collection, empty collection and raw excerpts cannot pass publication', () => {
  const cwd = fixture();
  expect(check(cwd).status).toBe(1);
  writeData(cwd, []);
  expect(check(cwd).status).toBe(1);
  writeData(cwd, articles.map((a) => ({ ...a, summaryKo: '', summaryEn: '' })));
  expect(check(cwd).status).toBe(1);
});

test('both generated languages are required', () => {
  const cwd = fixture();
  writeData(cwd);
  render(cwd);
  expect(check(cwd).status).toBe(0);
  for (const suffix of ['', '-en']) {
    const file = path.join(cwd, `src/content/posts/daily-digest-${date}${suffix}.md`);
    const saved = readFileSync(file);
    rmSync(file);
    expect(check(cwd).status).toBe(1);
    writeFileSync(file, saved);
  }
});

test('stale later summaries are rejected in either language', () => {
  const cwd = fixture();
  writeData(cwd);
  render(cwd);
  for (const field of ['summaryKo', 'summaryEn']) {
    writeData(cwd, articles.map((a, i) => i === 1 ? { ...a, [field]: summary('Updated second article') } : a));
    expect(check(cwd).status).toBe(1);
  }
});

test('partial and short enrichment are rejected', () => {
  const cwd = fixture();
  for (const patch of [{ insightEn: '' }, { summaryEn: 'Too short.' }]) {
    writeData(cwd, articles.map((a, i) => i === 1 ? { ...a, ...patch } : a));
    render(cwd);
    expect(check(cwd).status).toBe(1);
  }
});

function publisherFixture() {
  const cwd = fixture();
  cpSync(path.join(root, 'scripts'), path.join(cwd, 'scripts'), { recursive: true });
  const git = (...args: string[]) => {
    const result = run(cwd, 'git', args);
    expect(result.status, result.output).toBe(0);
    return result.output.trim();
  };
  git('init', '--initial-branch=main');
  git('config', 'user.name', 'Digest Test');
  git('config', 'user.email', 'digest@example.com');
  git('config', 'core.hooksPath', '/dev/null');
  git('add', 'scripts');
  git('-c', 'commit.gpgsign=false', 'commit', '-m', 'test: base');
  const remote = fixture();
  expect(run(remote, 'git', ['init', '--bare']).status).toBe(0);
  git('remote', 'add', 'origin', remote);
  git('push', 'origin', 'main');
  git('checkout', '-b', `daily-digest/${date}`);
  writeData(cwd);
  render(cwd);
  git('add', 'src');
  git('-c', 'commit.gpgsign=false', 'commit', '-m', 'test: enriched digest');
  git('push', '-u', 'origin', `daily-digest/${date}`);
  const bin = path.join(fixture(), 'bin');
  mkdirSync(bin);
  const log = path.join(bin, 'dispatch.log');
  writeFileSync(path.join(bin, 'gh'), '#!/bin/sh\nprintf "%s\\n" "$*" >> "$GH_TEST_LOG"\nexit "${GH_TEST_EXIT:-0}"\n', { mode: 0o755 });
  const publish = (extra = {}, args: string[] = []) => run(cwd, 'bun', ['scripts/publish-enrichment.mjs', '--date', date, ...args], {
    PATH: `${bin}:${process.env.PATH}`, GH_TEST_LOG: log, ...extra,
  });
  return { cwd, log, publish, git };
}

test('an unchanged enriched branch still requests merge; failed dispatch can retry', () => {
  const { publish, log, git } = publisherFixture();
  const before = git('rev-parse', 'HEAD');
  const failed = publish({ GH_TEST_EXIT: '1' });
  expect(failed.status, failed.output).toBe(1);
  expect(failed.output).toContain('자동 머지 요청에 실패');
  const retried = publish();
  expect(retried.status, retried.output).toBe(0);
  expect(readFileSync(log, 'utf8').trim().split('\n')).toEqual([
    'workflow run digest-fallback.yml --ref main',
    'workflow run digest-fallback.yml --ref main',
  ]);
  expect(git('rev-parse', 'HEAD')).toBe(before);
});

test('incomplete enrichment is neither committed nor dispatched', () => {
  const { cwd, publish, log, git } = publisherFixture();
  const before = git('rev-parse', 'HEAD');
  writeData(cwd, articles.map((a) => ({ ...a, insightEn: '' })));
  const result = publish();
  expect(result.status, result.output).toBe(1);
  expect(git('rev-parse', 'HEAD')).toBe(before);
  expect(git('diff', '--cached', '--name-only')).toBe('');
  expect(existsSync(log)).toBe(false);
});

test('dry run does not dispatch', () => {
  const { publish, log } = publisherFixture();
  const result = publish({}, ['--dry-run']);
  expect(result.status, result.output).toBe(0);
  expect(existsSync(log)).toBe(false);
});

test('merge gate retries ready PRs, pins the checked commit and preserves both guards', () => {
  const workflow = readFileSync('.github/workflows/digest-fallback.yml', 'utf8');
  const step = workflow.split('      - name: Gate and merge fully enriched digests')[1].split('      - name:')[0];
  const script = step.split('        run: |\n')[1].split('\n').map((line) => line.slice(10)).join('\n');
  for (const scenario of ['ready', 'draft', 'unenriched', 'published']) {
    const cwd = fixture();
    const bin = path.join(cwd, 'bin');
    mkdirSync(bin);
    const log = path.join(cwd, 'commands.log');
    const input = path.join(cwd, 'prs.txt');
    writeFileSync(input, `389\tdaily-digest/${date}\t${scenario === 'draft'}\n`);
    writeFileSync(path.join(bin, 'git'), '#!/bin/sh\nif [ "$1" = rev-parse ]; then echo verified-sha; fi\n', { mode: 0o755 });
    writeFileSync(path.join(bin, 'bun'), '#!/bin/sh\nexit "${CHECK_EXIT:-0}"\n', { mode: 0o755 });
    writeFileSync(path.join(bin, 'gh'), '#!/bin/sh\nprintf "%s\\n" "$*" >> "$GH_TEST_LOG"\n', { mode: 0o755 });
    if (scenario === 'published') writeFileSync(path.join(cwd, `src/content/posts/daily-digest-${date}.md`), 'Already published');
    const result = run(cwd, 'bash', ['-e', '-o', 'pipefail', '-c', script.replace('/tmp/digest-prs.txt', input)], {
      PATH: `${bin}:${process.env.PATH}`, GH_TEST_LOG: log, REPO: 'example/blog',
      GITHUB_OUTPUT: path.join(cwd, 'output'), CHECK_EXIT: scenario === 'unenriched' ? '1' : '0',
    });
    expect(result.status, result.output).toBe(0);
    const commands = existsSync(log) ? readFileSync(log, 'utf8') : '';
    if (scenario === 'unenriched' || scenario === 'published') {
      expect(commands).toBe('');
      expect(result.output).toContain('merged=0 blocked=1');
    } else {
      expect(commands.includes('pr ready')).toBe(scenario === 'draft');
      expect(commands).toContain('pr merge 389 --repo example/blog --match-head-commit verified-sha');
      expect(result.output).toContain('merged=1 blocked=0');
    }
  }
});
