import fs from 'node:fs/promises';
import path from 'node:path';

// This collector is intentionally checked in and push-triggered so schema changes
// can bootstrap generated pulse data immediately after landing on main.
const ROOT = process.cwd();
const projectsDir = path.join(ROOT, 'src', 'content', 'projects');
const outputFile = path.join(ROOT, 'src', 'data', 'project-repo-meta.json');
const token = process.env.GITHUB_TOKEN;
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'dasomel-blog-project-metadata-refresh',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function githubResponse(url, allowNotFound = false) {
  const response = await fetch(url, { headers });
  if (response.status === 404 && allowNotFound) return null;
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${response.status} for ${url}: ${text.slice(0, 300)}`);
  }
  return response;
}

async function githubJson(url, allowNotFound = false) {
  const response = await githubResponse(url, allowNotFound);
  return response ? response.json() : null;
}

function lastPageFromLink(link) {
  if (!link) return null;
  const match = link.match(/<([^>]+)>; rel="last"/);
  if (!match) return null;
  const url = new URL(match[1]);
  const page = Number(url.searchParams.get('page'));
  return Number.isFinite(page) && page > 0 ? { page, url: match[1] } : null;
}

async function paginatedCountAndOldest(repo, resource) {
  const firstResponse = await githubResponse(`https://api.github.com/repos/${repo}/${resource}?per_page=1`);
  const firstItems = await firstResponse.json();
  if (!Array.isArray(firstItems) || firstItems.length === 0) return { count: 0, oldest: null };

  const last = lastPageFromLink(firstResponse.headers.get('link'));
  if (!last) return { count: firstItems.length, oldest: firstItems[0] };

  const oldestItems = await githubJson(last.url);
  return { count: last.page, oldest: Array.isArray(oldestItems) ? oldestItems[0] ?? null : null };
}

async function paginatedCount(repo, resource) {
  const response = await githubResponse(`https://api.github.com/repos/${repo}/${resource}?per_page=1`);
  const items = await response.json();
  if (!Array.isArray(items) || items.length === 0) return 0;
  return lastPageFromLink(response.headers.get('link'))?.page ?? items.length;
}

async function commitActivity(repo) {
  const url = `https://api.github.com/repos/${repo}/stats/commit_activity`;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(url, { headers });
    if (response.status === 202) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      continue;
    }
    if (!response.ok) return [];
    const weeks = await response.json();
    return Array.isArray(weeks)
      ? weeks.map(week => ({ week: week.week, total: week.total })).slice(-52)
      : [];
  }
  return [];
}

function repoFromMarkdown(source) {
  const match = source.match(/^github:\s*["']https:\/\/github\.com\/([^/]+\/[^/"']+)["']\s*$/m);
  return match?.[1]?.replace(/\.git$/, '') ?? null;
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

const metadata = {};
for (const repo of [...repos].sort()) {
  console.log(`Refreshing ${repo}...`);
  const project = await githubJson(`https://api.github.com/repos/${repo}`);
  const release = await githubJson(`https://api.github.com/repos/${repo}/releases/latest`, true);
  const tags = await githubJson(`https://api.github.com/repos/${repo}/tags?per_page=1`);
  const latestTag = tags?.[0];
  const commits = await paginatedCountAndOldest(repo, 'commits');
  const releaseCount = await paginatedCount(repo, 'releases');
  const contributorCount = await paginatedCount(repo, 'contributors');
  const activity = await commitActivity(repo);
  const oldestCommit = commits.oldest;

  metadata[repo] = {
    repo,
    htmlUrl: project.html_url,
    description: project.description ?? undefined,
    stars: project.stargazers_count,
    forks: project.forks_count,
    openIssues: project.open_issues_count,
    language: project.language ?? undefined,
    license: project.license?.spdx_id || project.license?.name || undefined,
    createdAt: project.created_at ?? undefined,
    pushedAt: project.pushed_at ?? undefined,
    firstCommitAt: oldestCommit?.commit?.author?.date || oldestCommit?.commit?.committer?.date || undefined,
    commitCount: commits.count,
    releaseCount,
    contributorCount,
    activity,
    ...(release ? {
      latestRelease: {
        tag: release.tag_name,
        name: release.name || undefined,
        publishedAt: release.published_at || undefined,
        url: release.html_url,
      },
    } : {}),
    ...(latestTag ? {
      latestTag: {
        name: latestTag.name,
        commitSha: latestTag.commit?.sha,
        url: latestTag.commit?.url,
      },
    } : {}),
  };
}

await fs.mkdir(path.dirname(outputFile), { recursive: true });
await fs.writeFile(outputFile, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
console.log(`Refreshed ${Object.keys(metadata).length} project repositories.`);

// A re-run of the same Pages workflow can leave multiple `github-pages` artifacts
// attached to one run, which actions/deploy-pages rejects. When this collector is
// executing inside a re-run, start one fresh workflow_dispatch run instead. GitHub
// explicitly permits workflow_dispatch events initiated with GITHUB_TOKEN, and the
// fresh run starts at attempt 1 so this branch cannot recurse.
const runAttempt = Number(process.env.GITHUB_RUN_ATTEMPT || '1');
const repository = process.env.GITHUB_REPOSITORY;
if (token && repository && process.env.GITHUB_WORKFLOW === 'Deploy to GitHub Pages' && runAttempt > 1) {
  const response = await fetch(`https://api.github.com/repos/${repository}/actions/workflows/deploy.yml/dispatches`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ref: 'main' }),
  });
  if (!response.ok) {
    const text = await response.text();
    console.warn(`Could not start a fresh Pages run after rerun: ${response.status} ${text.slice(0, 200)}`);
  } else {
    console.log('Started a fresh Pages workflow run to avoid duplicate rerun artifacts.');
  }
}
