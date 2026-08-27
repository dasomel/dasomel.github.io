import Link from 'next/link';
import data from '../../src/data/project-repo-meta.json';

const metadata = data as Record<string, { commitCount?: number; releaseCount?: number; pushedAt?: string; latestRelease?: { tag?: string }; latestTag?: { name?: string } }>;
const systems = [
  ['openforge','dasomel/openforge','Standards'],['kube-ready-box','dasomel/kube-ready-box','Baseline'],['narwhal','dasomel/narwhal','Platform'],['nfs-quota-agent','dasomel/nfs-quota-agent','Storage'],['ldapium','dasomel/ldapium','Identity'],['beluga','dasomel/beluga','Data'],['kubemetal','dasomel/kubemetal','AI / Edge'],
] as const;

export function OssSystemPulse({ locale }: { locale: 'ko' | 'en' }) {
  const en = locale === 'en';
  return <section className="mt-12"><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>SYSTEM PULSE</div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{systems.map(([slug,repo,role])=>{const meta=metadata[repo]??{};const latest=meta.latestRelease?.tag||meta.latestTag?.name||'—';return <Link key={repo} href={en?`/oss/en/${slug}/`:`/oss/${slug}/`} className="rounded-2xl p-5 transition" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="flex items-center justify-between gap-3"><div><div className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color:'var(--text-faint)' }}>{role}</div><div className="mt-1 text-lg font-semibold">{slug}</div></div><div className="font-mono text-[10px]" style={{ color:'var(--accent)' }}>{latest}</div></div><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div><strong>{meta.commitCount?.toLocaleString()??'—'}</strong><span className="ml-1" style={{ color:'var(--text-faint)' }}>commits</span></div><div><strong>{meta.releaseCount?.toLocaleString()??'—'}</strong><span className="ml-1" style={{ color:'var(--text-faint)' }}>releases</span></div></div></Link>})}</div></section>;
}
