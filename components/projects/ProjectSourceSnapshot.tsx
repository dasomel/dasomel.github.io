import data from '@/data/project-repo-meta.json';
import { Activity, GitBranch, GitCommit, Star } from 'lucide-react';

type RepoMeta = {
  htmlUrl: string;
  stars: number;
  forks: number;
  openIssues: number;
  language?: string;
  license?: string;
  pushedAt?: string;
  latestRelease?: { tag: string; url: string };
  latestTag?: { name: string };
};

const metadata = data as Record<string, RepoMeta>;

function repoKey(github: string) {
  const match = github.match(/^https:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?\/?$/);
  return match?.[1] ?? null;
}

export function ProjectSourceSnapshot({ github, lang }: { github: string; lang: 'ko' | 'en' }) {
  const key = repoKey(github);
  const source = key ? metadata[key] : undefined;
  if (!source) return null;

  const date = source.pushedAt
    ? new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(source.pushedAt))
    : '—';

  const copy = lang === 'ko'
    ? { kicker: 'SOURCE SNAPSHOT', pushed: '최근 push', release: '최신 release', language: '언어', license: '라이선스', stars: 'Stars', forks: 'Forks', issues: 'Open issues' }
    : { kicker: 'SOURCE SNAPSHOT', pushed: 'Last push', release: 'Latest release', language: 'Language', license: 'License', stars: 'Stars', forks: 'Forks', issues: 'Open issues' };

  return (
    <section className="rounded-2xl p-5 sm:p-6 mb-10" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }} aria-label={copy.kicker}>
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider mb-4" style={{ color: 'var(--text-faint)' }}>
        <GitCommit className="w-3.5 h-3.5" aria-hidden="true" />{copy.kicker}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><div className="text-xs mb-1" style={{ color: 'var(--text-faint)' }}>{copy.pushed}</div><div style={{ color: 'var(--text)' }}>{date}</div></div>
        <div><div className="text-xs mb-1" style={{ color: 'var(--text-faint)' }}>{copy.release}</div><div style={{ color: 'var(--text)' }}>{source.latestRelease?.tag || '—'}</div></div>
        <div><div className="text-xs mb-1" style={{ color: 'var(--text-faint)' }}>{copy.language}</div><div style={{ color: 'var(--text)' }}>{source.language || '—'}</div></div>
        <div><div className="text-xs mb-1" style={{ color: 'var(--text-faint)' }}>{copy.license}</div><div style={{ color: 'var(--text)' }}>{source.license || '—'}</div></div>
      </div>
      <div className="flex flex-wrap gap-4 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><Star className="w-3.5 h-3.5" aria-hidden="true" />{copy.stars}: {source.stars}</span>
        <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><GitBranch className="w-3.5 h-3.5" aria-hidden="true" />{copy.forks}: {source.forks}</span>
        <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}><Activity className="w-3.5 h-3.5" aria-hidden="true" />{copy.issues}: {source.openIssues}</span>
        {source.latestRelease?.url && <a href={source.latestRelease.url} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: 'var(--accent)' }}>{copy.release}</a>}
      </div>
    </section>
  );
}
