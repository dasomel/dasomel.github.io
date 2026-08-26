import data from '../../src/data/project-repo-meta.json';
import { Activity, CalendarRange, GitBranch, GitCommit, Package, Star, Users } from 'lucide-react';

type ActivityPoint = { week: number; total: number };
type RepoMeta = {
  htmlUrl: string;
  stars: number;
  forks: number;
  openIssues: number;
  language?: string;
  license?: string;
  createdAt?: string;
  pushedAt?: string;
  firstCommitAt?: string;
  commitCount?: number;
  releaseCount?: number;
  contributorCount?: number;
  activity?: ActivityPoint[];
  latestRelease?: { tag: string; url: string; publishedAt?: string };
  latestTag?: { name: string };
};

const metadata = data as Record<string, RepoMeta>;

function repoKey(github: string) {
  const match = github.match(/^https:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?\/?$/);
  return match?.[1] ?? null;
}

function formatDate(value: string | undefined, lang: 'ko' | 'en') {
  if (!value) return '—';
  return new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value));
}

function activeDuration(start: string | undefined, end: string | undefined, lang: 'ko' | 'en') {
  if (!start || !end) return '—';
  const months = Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
  if (months < 1) return lang === 'ko' ? '1개월 미만' : '< 1 month';
  if (months < 12) return lang === 'ko' ? `${months}개월` : `${months} months`;
  const years = Math.floor(months / 12);
  const remain = months % 12;
  return lang === 'ko' ? `${years}년${remain ? ` ${remain}개월` : ''}` : `${years}y${remain ? ` ${remain}m` : ''}`;
}

function ActivityBars({ points, label }: { points: ActivityPoint[]; label: string }) {
  const recent = points.slice(-20);
  if (recent.length === 0) return null;
  const max = Math.max(...recent.map(point => point.total), 1);
  return (
    <div className="mt-5 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-faint)' }}>{label}</div>
        <div className="font-mono text-[9px]" style={{ color: 'var(--text-faint)' }}>20 WEEKS</div>
      </div>
      <div className="flex h-12 items-end gap-1" aria-label={label}>
        {recent.map((point, index) => (
          <span
            key={`${point.week}-${index}`}
            title={`${point.total} commits`}
            className="min-w-0 flex-1 rounded-t-sm"
            style={{ height: `${Math.max(8, Math.round((point.total / max) * 100))}%`, backgroundColor: point.total > 0 ? 'var(--accent)' : 'var(--border-strong)', opacity: point.total > 0 ? 0.9 : 0.45 }}
          />
        ))}
      </div>
    </div>
  );
}

export function ProjectSourceSnapshot({ github, lang }: { github: string; lang: 'ko' | 'en' }) {
  const key = repoKey(github);
  const source = key ? metadata[key] : undefined;
  if (!source) return null;

  const copy = lang === 'ko'
    ? { kicker: 'DEVELOPMENT PULSE', started: '첫 commit', commits: '누적 commits', releases: 'Releases', latest: '최신 release', pushed: '최근 push', active: '개발 기간', contributors: 'Contributors', activity: '최근 개발 활동', language: '언어', license: '라이선스', stars: 'Stars', forks: 'Forks', issues: 'Open issues' }
    : { kicker: 'DEVELOPMENT PULSE', started: 'First commit', commits: 'Commits', releases: 'Releases', latest: 'Latest release', pushed: 'Last push', active: 'Active for', contributors: 'Contributors', activity: 'Recent development activity', language: 'Language', license: 'License', stars: 'Stars', forks: 'Forks', issues: 'Open issues' };

  const primary = [
    { label: copy.started, value: formatDate(source.firstCommitAt || source.createdAt, lang), icon: CalendarRange },
    { label: copy.commits, value: source.commitCount?.toLocaleString() ?? '—', icon: GitCommit },
    { label: copy.releases, value: source.releaseCount?.toLocaleString() ?? '—', icon: Package },
    { label: copy.latest, value: source.latestRelease?.tag || source.latestTag?.name || '—', icon: Package },
    { label: copy.pushed, value: formatDate(source.pushedAt, lang), icon: Activity },
    { label: copy.active, value: activeDuration(source.firstCommitAt || source.createdAt, source.pushedAt, lang), icon: Activity },
  ];

  return (
    <section className="mb-10 rounded-2xl border p-5 sm:p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }} aria-label={copy.kicker}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--accent)' }}><Activity className="h-3.5 w-3.5" aria-hidden="true" />{copy.kicker}</div>
          <div className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>{key}</div>
        </div>
        {source.contributorCount !== undefined && <div className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><Users className="h-3.5 w-3.5" />{copy.contributors}: {source.contributorCount}</div>}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 md:grid-cols-3 lg:grid-cols-6">
        {primary.map(item => <div key={item.label} className="min-w-0"><div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--text-faint)' }}><item.icon className="h-3 w-3" />{item.label}</div><div className="mt-1.5 truncate text-lg font-semibold tracking-[-0.025em]" style={{ color: 'var(--text)' }} title={item.value}>{item.value}</div></div>)}
      </div>

      <ActivityBars points={source.activity ?? []} label={copy.activity} />

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{copy.language}: {source.language || '—'}</span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{copy.license}: {source.license || '—'}</span>
        <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><Star className="h-3.5 w-3.5" />{copy.stars}: {source.stars}</span>
        <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><GitBranch className="h-3.5 w-3.5" />{copy.forks}: {source.forks}</span>
        <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><Activity className="h-3.5 w-3.5" />{copy.issues}: {source.openIssues}</span>
        {source.latestRelease?.url && <a href={source.latestRelease.url} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: 'var(--accent)' }}>{copy.latest}</a>}
      </div>
    </section>
  );
}
