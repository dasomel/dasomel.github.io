import repoData from '@/src/data/project-repo-meta.json';
import snapshotState from '@/src/data/project-repo-meta-state.json';

export type OssRepoMeta = {
  repo: string;
  htmlUrl?: string;
  stars?: number;
  forks?: number;
  openIssues?: number;
  language?: string;
  license?: string;
  createdAt?: string;
  pushedAt?: string;
  commitCount?: number;
  releaseCount?: number;
  contributorCount?: number;
  latestRelease?: { tag?: string; publishedAt?: string; url?: string };
  latestTag?: { name?: string };
};

const metadata = repoData as Record<string, OssRepoMeta>;

export const OSS_REPO_SNAPSHOT = snapshotState as {
  generatedAt: string;
  source: string;
  repoCount: number;
};

export function getOssRepoMeta(repo: string) {
  return metadata[repo];
}

export function repoFreshness(pushedAt?: string) {
  if (!pushedAt) return { label: 'unknown', days: null as number | null };
  const snapshot = new Date(OSS_REPO_SNAPSHOT.generatedAt).getTime();
  const pushed = new Date(pushedAt).getTime();
  if (!Number.isFinite(snapshot) || !Number.isFinite(pushed)) return { label: 'unknown', days: null as number | null };
  const days = Math.max(0, Math.floor((snapshot - pushed) / 86_400_000));
  return { label: days <= 7 ? 'active' : days <= 30 ? 'recent' : 'stale', days };
}

export function compactDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toISOString().slice(0, 10);
}
