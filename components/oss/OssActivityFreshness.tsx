import data from '../../src/data/project-repo-meta.json';

const metadata = data as Record<string, { pushedAt?: string }>;
const repos = ['dasomel/openforge','dasomel/kube-ready-box','dasomel/narwhal','dasomel/nfs-quota-agent','dasomel/ldapium','dasomel/beluga','dasomel/kubemetal'];

export function OssActivityFreshness({ locale }: { locale: 'ko' | 'en' }) {
  const en = locale === 'en';
  const latest = repos.map((repo) => metadata[repo]?.pushedAt).filter(Boolean).sort().at(-1);
  if (!latest) return null;
  const days = Math.max(0, Math.floor((Date.now() - new Date(latest).getTime()) / 86400000));
  const status = days <= 7 ? (en ? 'ACTIVE' : '활발') : days <= 30 ? (en ? 'RECENT' : '최근') : (en ? 'QUIET' : '관찰');
  return <div className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px]" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><span className="h-2 w-2 rounded-full" style={{ backgroundColor: days <= 30 ? 'var(--signal)' : 'var(--text-faint)' }} /><span>{status}</span><span style={{ color:'var(--text-faint)' }}>· {days === 0 ? (en ? 'today' : '오늘') : `${days}d`}</span></div>;
}
