import Link from 'next/link';
import { compactDate, getOssRepoMeta, OSS_REPO_SNAPSHOT, repoFreshness } from '@/lib/oss-repo-meta';

type Row = { slug:string; repo:string; name:string; role:string; stage:string; verification:string; independence:string };

const rows: Row[] = [
  { slug:'narwhal', repo:'dasomel/narwhal', name:'Narwhal', role:'Flagship Platform', stage:'Active platform', verification:'Regression + live checks', independence:'Platform root' },
  { slug:'narwhal-portal', repo:'dasomel/narwhal-portal', name:'Narwhal Portal', role:'Platform Experience Layer', stage:'Active UI layer', verification:'Build + in-cluster workflow', independence:'Narwhal-coupled' },
  { slug:'nfs-quota-agent', repo:'dasomel/nfs-quota-agent', name:'NFS Quota Agent', role:'Reusable Component', stage:'Reusable component', verification:'Filesystem + operational checks', independence:'Independent' },
  { slug:'ldapium', repo:'dasomel/ldapium', name:'ldapium', role:'Identity Infrastructure', stage:'Prototype', verification:'Helm test + supply-chain evidence', independence:'Independent' },
  { slug:'kube-ready-box', repo:'dasomel/kube-ready-box', name:'Kube-Ready-Box', role:'Node Foundation', stage:'Reusable foundation', verification:'OS readiness validation', independence:'Independent' },
  { slug:'clusterdeck', repo:'dasomel/clusterdeck', name:'ClusterDeck', role:'Workstation Access Layer', stage:'MVP / early', verification:'SSH + kubeconfig + API', independence:'Independent' },
  { slug:'beluga', repo:'dasomel/beluga', name:'Beluga', role:'Data Platform Reference', stage:'Reference platform', verification:'2 E2E data paths', independence:'Reference environment' },
  { slug:'beluga-manager', repo:'dasomel/beluga-manager', name:'Beluga Manager', role:'Data Control Plane', stage:'Early / read-first', verification:'Domain/API boundary', independence:'Beluga-oriented' },
  { slug:'kubemetal', repo:'dasomel/kubemetal', name:'KubeMetal', role:'Emerging / Cloud-native AI', stage:'Emerging', verification:'Measured local baseline', independence:'Independent lab system' },
  { slug:'openforge', repo:'dasomel/openforge', name:'OpenForge', role:'Engineering Foundation', stage:'Standards system', verification:'Standards → reference loop', independence:'Cross-project' },
];

export function OssPortfolioMatrix({ locale='ko' }: { locale?:'ko'|'en' }) {
  const en=locale==='en';
  const prefix=en?'/oss/en':'/oss';
  return <section className="mt-16">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>PORTFOLIO MATRIX</div><h2 className="mt-3 text-3xl font-semibold">{en?'See role, maturity, verification and live repository pulse at a glance.':'역할·성숙도·검증과 실제 저장소 활동을 한 화면에서 봅니다.'}</h2></div><div className="font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{en?'snapshot':'snapshot'} · {compactDate(OSS_REPO_SNAPSHOT.generatedAt)}</div></div>
    <p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>{en?'Static role and verification boundaries stay documentation-driven, while commits, releases, contributors and repository freshness come from the build-time GitHub metadata snapshot.':'역할·검증 경계는 문서 기반으로 유지하고, commit·release·contributor·최근 push는 Pages 빌드 시 갱신되는 GitHub metadata snapshot을 사용합니다.'}</p>
    <div className="mt-6 overflow-x-auto rounded-2xl" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}>
      <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
        <thead><tr style={{ borderBottom:'1px solid var(--border)', backgroundColor:'var(--bg-subtle)' }}>{['Project','Role / Stage','Verification','Repository pulse','Freshness','Independence'].map((h)=><th key={h} className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row)=>{const meta=getOssRepoMeta(row.repo);const freshness=repoFreshness(meta?.pushedAt);const latest=meta?.latestRelease?.tag||meta?.latestTag?.name||'—';return <tr key={row.slug} style={{ borderBottom:'1px solid var(--border)' }}><td className="px-5 py-4"><Link href={`${prefix}/${row.slug}/`} className="font-semibold hover:underline">{row.name} →</Link><div className="mt-1 font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{row.repo}</div></td><td className="px-5 py-4"><div style={{ color:'var(--text-muted)' }}>{row.role}</div><span className="mt-2 inline-block rounded-full px-2.5 py-1 text-[11px]" style={{ backgroundColor:'var(--surface-hi)', color:'var(--text-muted)', border:'1px solid var(--border)' }}>{row.stage}</span></td><td className="px-5 py-4" style={{ color:'var(--text-muted)' }}>{row.verification}</td><td className="px-5 py-4"><div className="font-mono text-[11px]">{meta?.commitCount?.toLocaleString()??'—'} commits · {meta?.releaseCount?.toLocaleString()??'—'} releases</div><div className="mt-1 text-[11px]" style={{ color:'var(--text-faint)' }}>{meta?.contributorCount?.toLocaleString()??'—'} contributors · latest {latest}</div></td><td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:'1px solid var(--border)', color:freshness.label==='active'?'var(--accent)':'var(--text-muted)' }}>{freshness.label}{freshness.days!==null?` · ${freshness.days}d`:''}</span><div className="mt-2 font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{compactDate(meta?.pushedAt)}</div></td><td className="px-5 py-4" style={{ color:'var(--text-muted)' }}>{row.independence}</td></tr>})}</tbody>
      </table>
    </div>
  </section>;
}
