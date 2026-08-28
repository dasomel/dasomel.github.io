import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const projectsDir = path.join(ROOT, 'src', 'content', 'projects');
const outputFile = path.join(ROOT, 'src', 'data', 'project-repo-audit.json');
const token = process.env.GITHUB_TOKEN;
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'dasomel-blog-project-audit-refresh',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function githubJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${response.status} for ${url}: ${text.slice(0, 300)}`);
  }
  return response.json();
}

function repoFromMarkdown(source) {
  const match = source.match(/^github:\s*["']https:\/\/github\.com\/([^/]+\/[^/"']+)["']\s*$/m);
  return match?.[1]?.replace(/\.git$/, '') ?? null;
}

function matchesGovernancePath(value, name) {
  const normalized = value.toLowerCase();
  const base = normalized.split('/').at(-1) ?? normalized;
  const allowedLocation = !normalized.includes('/') || normalized.startsWith('.github/');
  if (!allowedLocation) return false;
  if (name === 'license') return /^license(?:\.|$)/.test(base);
  if (name === 'contributing') return /^contributing(?:\.|$)/.test(base);
  if (name === 'codeOfConduct') return /^code_of_conduct(?:\.|$)/.test(base);
  if (name === 'security') return /^security(?:\.|$)/.test(base);
  if (name === 'notice') return /^notice(?:\.|$)/.test(base);
  if (name === 'changelog') return /^(changelog|changes)(?:\.|$)/.test(base);
  return false;
}

function auditTree(tree) {
  const paths = (tree?.tree ?? [])
    .filter((item) => item.type === 'blob' && typeof item.path === 'string')
    .map((item) => item.path);
  const collect = (predicate) => paths.filter(predicate).slice(0, 12);

  return {
    license: collect((value) => matchesGovernancePath(value, 'license')),
    contributing: collect((value) => matchesGovernancePath(value, 'contributing')),
    codeOfConduct: collect((value) => matchesGovernancePath(value, 'codeOfConduct')),
    security: collect((value) => matchesGovernancePath(value, 'security')),
    notice: collect((value) => matchesGovernancePath(value, 'notice')),
    changelog: collect((value) => matchesGovernancePath(value, 'changelog')),
    sbom: collect((value) => /(^|[/_.-])sbom([/_.-]|$)|spdx|cyclonedx|\.cdx\./i.test(value)),
    provenance: collect((value) => /provenance|attestation|attest|slsa|cosign/i.test(value)),
  };
}

const files = (await fs.readdir(projectsDir))
  .filter((file) => file.endsWith('.md'))
  .filter((file) => !file.endsWith('-en.md'));

const repos = new Set();
for (const file of files) {
  const source = await fs.readFile(path.join(projectsDir, file), 'utf8');
  const repo = repoFromMarkdown(source);
  if (repo) repos.add(repo);
}

const audit = {};
for (const repo of [...repos].sort()) {
  console.log(`Auditing ${repo}...`);
  const project = await githubJson(`https://api.github.com/repos/${repo}`);
  const branch = encodeURIComponent(project.default_branch || 'main');
  const tree = await githubJson(`https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`);
  audit[repo] = {
    repo,
    defaultBranch: project.default_branch || 'main',
    truncated: Boolean(tree.truncated),
    evidence: auditTree(tree),
  };
}

await fs.mkdir(path.dirname(outputFile), { recursive: true });
await fs.writeFile(outputFile, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');
console.log(`Audited ${Object.keys(audit).length} project repositories.`);
