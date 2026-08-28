import Link from 'next/link';

type Row = { slug:string; name:string; role:string; stage:string; verification:string; independence:string };

const rows: Row[] = [
  { slug:'narwhal', name:'Narwhal', role:'Flagship Platform', stage:'Active platform', verification:'Regression + live checks', independence:'Platform root' },
  { slug:'narwhal-portal', name:'Narwhal Portal', role:'Platform Experience Layer', stage:'Active UI layer', verification:'Build + in-cluster workflow', independence:'Narwhal-coupled' },
  { slug:'nfs-quota-agent', name:'NFS Quota Agent', role:'Reusable Component', stage:'Reusable component', verification:'Filesystem + operational checks', independence:'Independent' },
  { slug:'ldapium', name:'ldapium', role:'Identity Infrastructure', stage:'Prototype', verification:'Helm test + supply-chain evidence', independence:'Independent' },
  { slug:'kube-ready-box', name:'Kube-Ready-Box', role:'Node Foundation', stage:'Reusable foundation', verification:'OS readiness validation', independence:'Independent' },
  { slug:'clusterdeck', name:'ClusterDeck', role:'Workstation Access Layer', stage:'MVP / early', verification:'SSH + kubeconfig + API', independence:'Independent' },
  { slug:'beluga', name:'Beluga', role:'Data Platform Reference', stage:'Reference platform', verification:'2 E2E data paths', independence:'Reference environment' },
  { slug:'beluga-manager', name:'Beluga Manager', role:'Data Control Plane', stage:'Early / read-first', verification:'Domain/API boundary', independence:'Beluga-oriented' },
  { slug:'kubemetal', name:'KubeMetal', role:'Emerging / Cloud-native AI', stage:'Emerging', verification:'Measured local baseline', independence:'Independent lab system' },
  { slug:'openforge', name:'OpenForge', role:'Engineering Foundation', stage:'Standards system', verification:'Standards → reference loop', independence:'Cross-project' },
];

export function OssPortfolioMatrix() {
  return <section className="mt-16">
    <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>PORTFOLIO MATRIX</div>
    <h2 className="mt-3 text-3xl font-semibold">역할·성숙도·검증 경계를 한 화면에서 봅니다.</h2>
    <p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>숫자 점수 대신 현재 문서와 저장소에서 확인 가능한 상태를 사용합니다. 특히 독립성은 “같은 생태계에 보인다”와 “런타임으로 결합된다”를 구분하기 위한 항목입니다.</p>
    <div className="mt-6 overflow-x-auto rounded-2xl" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}>
      <table className="w-full min-w-[900px] border-collapse text-left text-sm">
        <thead><tr style={{ borderBottom:'1px solid var(--border)', backgroundColor:'var(--bg-subtle)' }}>{['Project','Role','Stage','Verification','Independence'].map((h)=><th key={h} className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row)=><tr key={row.slug} style={{ borderBottom:'1px solid var(--border)' }}><td className="px-5 py-4"><Link href={`/oss/${row.slug}/`} className="font-semibold hover:underline">{row.name} →</Link></td><td className="px-5 py-4" style={{ color:'var(--text-muted)' }}>{row.role}</td><td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ backgroundColor:'var(--surface-hi)', color:'var(--text-muted)', border:'1px solid var(--border)' }}>{row.stage}</span></td><td className="px-5 py-4" style={{ color:'var(--text-muted)' }}>{row.verification}</td><td className="px-5 py-4" style={{ color:'var(--text-muted)' }}>{row.independence}</td></tr>)}</tbody>
      </table>
    </div>
  </section>;
}
