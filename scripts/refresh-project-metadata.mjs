import fs from 'node:fs/promises';
import path from 'node:path';

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

async function githubJson(url, allowNotFound = false) {
  const response = await fetch(url, { headers });
  if (response.status === 404 && allowNotFound) return null;
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
  const project = await githubJson(`https://api.github.com/repos/${repo}`);
  const release = await githubJson(`https://api.github.com/repos/${repo}/releases/latest`, true);
  const tags = await githubJson(`https://api.github.com/repos/${repo}/tags?per_page=1`);
  const latestTag = tags?.[0];

  metadata[repo] = {
    repo,
    htmlUrl: project.html_url,
    description: project.description ?? undefined,
    stars: project.stargazers_count,
    forks: project.forks_count,
    openIssues: project.open_issues_count,
    language: project.language ?? undefined,
    license: project.license?.spdx_id || project.license?.name || undefined,
    pushedAt: project.pushed_at ?? undefined,
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
