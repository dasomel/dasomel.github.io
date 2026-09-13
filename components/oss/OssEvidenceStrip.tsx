import data from '../../src/data/project-repo-meta.json';

type RepoMeta = { commitCount?: number; releaseCount?: number; pushedAt?: string; firstCommitAt?: string; createdAt?: string };
const metadata = data as Record<string, RepoMeta>;
const repos = ['dasomel/openforge','dasomel/kube-ready-box','dasomel/narwhal','dasomel/nfs-quota-agent','dasomel/ldapium','dasomel/beluga','dasomel/kubemetal'];

function total(key: 'commitCount' | 'releaseCount') { return repos.reduce((sum, repo) => sum + (metadata[repo]?.[key] ?? 0), 0); }
function date(value?: string, locale: 'ko' | 'en' = 'ko') { return value ? new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', { year:'numeric', month:'short' }).format(new Date(value)) : '—'; }

export function OssEvidenceStrip({ locale }: { locale: 'ko' | 'en' }) {
  const en = locale === 'en';
  const started = repos.map(r => metadata[r]?.firstCommitAt || metadata[r]?.createdAt).filter(Boolean).sort()[0];
  const latest = repos.map(r => metadata[r]?.pushedAt).filter(Boolean).sort().at(-1);
  const metrics = [
    [String(repos.length), en ? 'tracked OSS systems' : '추적 중인 OSS 시스템'],
    [total('commitCount').toLocaleString(), en ? 'commits' : '누적 commits'],
    [total('releaseCount').toLocaleString(), en ? 'releases' : '누적 releases'],
    [date(started, locale), en ? 'development started' : '개발 시작'],
    [date(latest, locale), en ? 'latest activity' : '최근 활동'],
  ];
  return <section className="mt-10 border-y py-7" style={{ borderColor:'var(--border)', backgroundColor:'var(--surface-hi)' }}>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {metrics.map(([value,label]) => <div key={label} className="border-l pl-4" style={{ borderColor:'var(--border-strong)' }}><div className="text-2xl font-semibold tracking-[-0.04em]">{value || '—'}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color:'var(--text-faint)' }}>{label}</div></div>)}
    </div>
  </section>;
}
