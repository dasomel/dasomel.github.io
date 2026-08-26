import data from '../../src/data/project-repo-meta.json';

type ActivityPoint = { week: number; total: number };
type RepoMeta = {
  firstCommitAt?: string;
  createdAt?: string;
  pushedAt?: string;
  commitCount?: number;
  releaseCount?: number;
  activity?: ActivityPoint[];
  latestRelease?: { tag: string };
  latestTag?: { name: string };
};

const metadata = data as Record<string, RepoMeta>;
const focusRepos = ['dasomel/narwhal','dasomel/beluga','dasomel/kubemetal','dasomel/nfs-quota-agent','dasomel/kube-ready-box'];

function sum(key: 'commitCount' | 'releaseCount') {
  return focusRepos.reduce((total, repo) => total + (metadata[repo]?.[key] ?? 0), 0);
}

function earliest() {
  return focusRepos
    .map(repo => metadata[repo]?.firstCommitAt || metadata[repo]?.createdAt)
    .filter(Boolean)
    .sort()[0];
}

function latestPush() {
  return focusRepos.map(repo => metadata[repo]?.pushedAt).filter(Boolean).sort().at(-1);
}

function month(value?: string, lang: 'ko' | 'en' = 'ko') {
  if (!value) return '—';
  return new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'short' }).format(new Date(value));
}

export function PortfolioPulse({ lang }: { lang: 'ko' | 'en' }) {
  const commits=sum('commitCount');
  const releases=sum('releaseCount');
  const narwhal=metadata['dasomel/narwhal'];
  const activity=(narwhal?.activity ?? []).slice(-20);
  const max=Math.max(...activity.map(p=>p.total),1);
  const copy=lang==='ko'
    ? { kicker:'PORTFOLIO DEVELOPMENT PULSE', started:'포트폴리오 시작', commits:'주요 OSS commits', releases:'Releases', latest:'Narwhal latest', pushed:'최근 활동', activity:'Narwhal · 최근 20주' }
    : { kicker:'PORTFOLIO DEVELOPMENT PULSE', started:'Portfolio started', commits:'Core OSS commits', releases:'Releases', latest:'Narwhal latest', pushed:'Latest activity', activity:'Narwhal · last 20 weeks' };
  const latest=narwhal?.latestRelease?.tag || narwhal?.latestTag?.name || '—';
  const metrics=[
    [month(earliest(),lang),copy.started],
    [commits?commits.toLocaleString():'—',copy.commits],
    [releases?releases.toLocaleString():'—',copy.releases],
    [latest,copy.latest],
    [month(latestPush(),lang),copy.pushed],
  ];
  return <section className="border-y" style={{borderColor:'var(--border)',backgroundColor:'var(--surface-hi)'}}>
    <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-16">
      <div className="font-mono text-[10px] font-semibold tracking-[0.14em]" style={{color:'var(--signal)'}}>{copy.kicker}</div>
      <div className="mt-6 grid gap-y-7 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map(([value,label])=><div key={label} className="border-l pl-4" style={{borderColor:'var(--border-strong)'}}><div className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl" style={{color:'var(--text)'}}>{value}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em]" style={{color:'var(--text-faint)'}}>{label}</div></div>)}
      </div>
      {activity.length>0&&<div className="mt-8 grid gap-4 border-t pt-6 lg:grid-cols-[220px_1fr]" style={{borderColor:'var(--border)'}}><div className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{color:'var(--text-faint)'}}>{copy.activity}</div><div className="flex h-12 items-end gap-1">{activity.map((point,index)=><span key={`${point.week}-${index}`} className="min-w-0 flex-1 rounded-t-sm" title={`${point.total} commits`} style={{height:`${Math.max(8,Math.round((point.total/max)*100))}%`,backgroundColor:index>=activity.length-4?'var(--accent)':'var(--border-strong)',opacity:index>=activity.length-4?.95:.55}}/>)}</div></div>}
    </div>
  </section>;
}
