import Link from 'next/link';
import { compactDate, getOssRepoMeta, OSS_REPO_SNAPSHOT, repoFreshness } from '@/lib/oss-repo-meta';

const systems = [
  ['openforge','dasomel/openforge','Standards'],
  ['kube-ready-box','dasomel/kube-ready-box','Baseline'],
  ['clusterdeck','dasomel/clusterdeck','Workstation'],
  ['narwhal','dasomel/narwhal','Platform'],
  ['narwhal-portal','dasomel/narwhal-portal','Experience'],
  ['nfs-quota-agent','dasomel/nfs-quota-agent','Storage'],
  ['ldapium','dasomel/ldapium','Identity'],
  ['beluga','dasomel/beluga','Data'],
  ['beluga-manager','dasomel/beluga-manager','Data Control'],
  ['kubemetal','dasomel/kubemetal','AI / Edge'],
] as const;

export function OssSystemPulse({ locale }: { locale: 'ko' | 'en' }) {
  const en = locale === 'en';
  return <section className="mt-12"><div className="flex flex-wrap items-end justify-between gap-3"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>SYSTEM PULSE</div><p className="mt-2 text-sm" style={{ color:'var(--text-muted)' }}>{en?'Build-time GitHub snapshot across the OSS portfolio.':'Pages 빌드 시 갱신되는 GitHub snapshot 기준 OSS 활동입니다.'}</p></div><div className="font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{compactDate(OSS_REPO_SNAPSHOT.generatedAt)} · {OSS_REPO_SNAPSHOT.source}</div></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{systems.map(([slug,repo,role])=>{const meta=getOssRepoMeta(repo);const latest=meta?.latestRelease?.tag||meta?.latestTag?.name||'—';const freshness=repoFreshness(meta?.pushedAt);return <Link key={repo} href={en?`/oss/en/${slug}/`:`/oss/${slug}/`} className="rounded-2xl p-5 transition hover:-translate-y-0.5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="flex items-start justify-between gap-3"><div><div className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color:'var(--text-faint)' }}>{role}</div><div className="mt-1 text-lg font-semibold">{slug}</div></div><div className="text-right"><div className="font-mono text-[10px]" style={{ color:'var(--accent)' }}>{latest}</div><div className="mt-1 font-mono text-[9px]" style={{ color:freshness.label==='active'?'var(--accent)':'var(--text-faint)' }}>{freshness.label}{freshness.days!==null?` · ${freshness.days}d`:''}</div></div></div><div className="mt-5 grid grid-cols-3 gap-3 text-sm"><div><strong>{meta?.commitCount?.toLocaleString()??'—'}</strong><span className="block text-[10px]" style={{ color:'var(--text-faint)' }}>commits</span></div><div><strong>{meta?.releaseCount?.toLocaleString()??'—'}</strong><span className="block text-[10px]" style={{ color:'var(--text-faint)' }}>releases</span></div><div><strong>{meta?.contributorCount?.toLocaleString()??'—'}</strong><span className="block text-[10px]" style={{ color:'var(--text-faint)' }}>contributors</span></div></div></Link>})}</div></section>;
}
