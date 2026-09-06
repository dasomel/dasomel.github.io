const SOURCE_REVISION = '418c466ca8b8ae5709bcd4e0d5eb74aaf83f57ac';
const SOURCE_URL = `https://github.com/dasomel/openforge/commit/${SOURCE_REVISION}`;

const ADOPTION = [
  { name: 'ldapium', value: 89.7 },
  { name: 'kube-ready-box', value: 87.1 },
  { name: 'Narwhal Portal', value: 83.8 },
  { name: 'ClusterDeck', value: 82.4 },
  { name: 'KubeMetal', value: 82.4 },
  { name: 'Narwhal', value: 81.8 },
  { name: 'nfs-quota-agent', value: 81.8 },
] as const;

const IMPACT = [
  { name: 'Narwhal', level: 'HIGH', tone: 'var(--signal)' },
  { name: 'Narwhal Portal', level: 'HIGH', tone: 'var(--signal)' },
  { name: 'KubeMetal', level: 'HIGH', tone: 'var(--signal)' },
  { name: 'Beluga', level: 'MEDIUM', tone: 'var(--warning, #d79b37)' },
  { name: 'kube-ready-box', level: 'MEDIUM', tone: 'var(--warning, #d79b37)' },
] as const;

type Props = { locale: 'ko' | 'en' };

export function OssPortfolioControlPlane({ locale }: Props) {
  const en = locale === 'en';
  const kpis = en ? [
    ['Projects', '14', 'registered in OpenForge'],
    ['Metrics', '35', 'engineering metrics'],
    ['Maturity', '96.9%', 'standard maturity'],
    ['Adoption', '61.6%', 'portfolio adoption'],
    ['M2 target', '≥70%', 'next adoption milestone'],
  ] : [
    ['Projects', '14', 'OpenForge 등록 프로젝트'],
    ['Metrics', '35', 'Engineering Metrics'],
    ['Maturity', '96.9%', 'Standard Maturity'],
    ['Adoption', '61.6%', 'Portfolio Adoption'],
    ['M2 Target', '≥70%', '다음 Adoption 목표'],
  ];

  const projects = en ? [
    ['Narwhal', 'Reference implementation', 'Active', '81.8%'],
    ['Narwhal Portal', 'Control surface', 'Active', '83.8%'],
    ['KubeMetal', 'Adopter', 'Active', '82.4%'],
    ['Beluga', 'Adopter', 'Active', '—'],
    ['kube-ready-box', 'Enforcement provider', 'Active', '87.1%'],
  ] : [
    ['Narwhal', 'Reference implementation', 'Active', '81.8%'],
    ['Narwhal Portal', 'Control surface', 'Active', '83.8%'],
    ['KubeMetal', 'Adopter', 'Active', '82.4%'],
    ['Beluga', 'Adopter', 'Active', '—'],
    ['kube-ready-box', 'Enforcement provider', 'Active', '87.1%'],
  ];

  return <section className="mt-14 rounded-3xl p-6 sm:p-8" style={{ border:'1px solid var(--border-hi)', background:'linear-gradient(180deg, var(--surface), var(--bg-subtle))' }}>
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div className="max-w-4xl">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>OPENFORGE / PORTFOLIO CONTROL PLANE</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">{en ? 'One official state for development, adoption and impact.' : '개발·적용·영향도를 하나의 공식 상태로 관리합니다.'}</h2>
        <p className="mt-3 text-sm leading-7" style={{ color:'var(--text-muted)' }}>{en ? 'Each OSS owns its implementation and verification. After a verified milestone, it proposes an OpenForge status PR; merging that PR becomes the official portfolio state used by dashboards and impact review.' : '각 OSS는 구현과 검증을 직접 소유합니다. 검증된 Milestone 이후 OpenForge에 Status PR을 제안하고, 그 PR의 Merge가 Dashboard와 영향도 분석에 사용하는 공식 Portfolio State가 됩니다.'}</p>
      </div>
      <a href={SOURCE_URL} target="_blank" rel="noreferrer" className="rounded-full px-4 py-2 font-mono text-[10px] font-semibold" style={{ border:'1px solid var(--border)', color:'var(--text-faint)' }}>source · {SOURCE_REVISION.slice(0,7)}</a>
    </div>

    <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {kpis.map(([label,value,detail]) => <div key={label} className="rounded-2xl p-5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}>
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>{label}</div>
        <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
        <div className="mt-2 text-xs leading-5" style={{ color:'var(--text-muted)' }}>{detail}</div>
      </div>)}
    </div>

    <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl p-5 sm:p-6" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}>
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--accent)' }}>{en ? 'DEPENDENCY & IMPACT' : 'DEPENDENCY & IMPACT'}</div>
        <h3 className="mt-2 text-xl font-semibold">ADR-0013 · Agent Execution Security</h3>
        <p className="mt-2 text-xs leading-5" style={{ color:'var(--text-muted)' }}>{en ? 'Impact is review priority, not a product quality score. High-impact projects should review compatibility first when the shared contract changes.' : 'Impact는 제품 품질 점수가 아니라 변경 검토 우선순위입니다. 공통 Contract가 변경되면 High-impact 프로젝트부터 호환성을 검토합니다.'}</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {IMPACT.map((item) => <div key={item.name} className="rounded-xl p-3" style={{ border:`1px solid ${item.tone}`, backgroundColor:'var(--bg-subtle)' }}>
            <div className="text-sm font-semibold">{item.name}</div>
            <div className="mt-2 font-mono text-[10px] font-semibold" style={{ color:item.tone }}>{item.level}</div>
          </div>)}
        </div>
        <div className="mt-5 rounded-xl p-4" style={{ backgroundColor:'var(--bg-subtle)', border:'1px solid var(--border)' }}>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>{en ? 'OFFICIAL STATUS LOOP' : 'OFFICIAL STATUS LOOP'}</div>
          <div className="mt-3 grid gap-2 text-xs leading-5 sm:grid-cols-5" style={{ color:'var(--text-muted)' }}>
            {(en ? ['OSS implementation', 'Verification', 'Status payload', 'OpenForge PR + CI', 'Merge → dashboard'] : ['OSS 구현', '검증', 'Status payload', 'OpenForge PR + CI', 'Merge → 현황판']).map((step,index) => <div key={step} className="flex items-center gap-2"><span className="font-mono" style={{ color:'var(--accent)' }}>{index + 1}</span><span>{step}</span></div>)}
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-5 sm:p-6" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}>
        <div className="flex items-end justify-between gap-3"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--accent)' }}>OPENFORGE ADOPTION</div><h3 className="mt-2 text-xl font-semibold">{en ? 'Measured repositories' : '측정된 Repository'}</h3></div><div className="font-mono text-xs" style={{ color:'var(--text-faint)' }}>M2 · 70%</div></div>
        <div className="mt-5 space-y-3">
          {ADOPTION.map((item) => <div key={item.name} className="grid grid-cols-[120px_1fr_48px] items-center gap-3 text-xs">
            <span className="truncate" style={{ color:'var(--text-muted)' }}>{item.name}</span>
            <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor:'var(--surface-hi)' }}><div className="h-full rounded-full" style={{ width:`${item.value}%`, backgroundColor:'var(--accent)' }} /></div>
            <span className="text-right font-mono">{item.value}%</span>
          </div>)}
        </div>
      </div>
    </div>

    <div className="mt-5 overflow-hidden rounded-2xl" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}>
      <div className="grid grid-cols-[1.2fr_1.3fr_0.7fr_0.6fr] gap-3 border-b px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ borderColor:'var(--border)', color:'var(--text-faint)' }}><span>Project</span><span>Role</span><span>State</span><span className="text-right">Adoption</span></div>
      {projects.map(([name,role,state,adoption]) => <div key={name} className="grid grid-cols-[1.2fr_1.3fr_0.7fr_0.6fr] gap-3 border-b px-5 py-3 text-xs last:border-b-0" style={{ borderColor:'var(--border)' }}><span className="font-semibold">{name}</span><span style={{ color:'var(--text-muted)' }}>{role}</span><span style={{ color:'var(--signal)' }}>{state}</span><span className="text-right font-mono">{adoption}</span></div>)}
    </div>

    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs" style={{ color:'var(--text-muted)' }}>
      <span>{en ? 'A code merge alone is not portfolio completion; verified status must be published and merged into OpenForge.' : '코드 Merge만으로 Portfolio 완료가 되지 않습니다. 검증된 상태를 OpenForge에 게시하고 Merge해야 합니다.'}</span>
      <div className="flex gap-3"><a href="https://github.com/dasomel/openforge/blob/main/PORTFOLIO.md" target="_blank" rel="noreferrer" className="font-semibold" style={{ color:'var(--accent)' }}>Portfolio →</a><a href="https://github.com/dasomel/openforge/blob/main/docs/portfolio-impact.md" target="_blank" rel="noreferrer" className="font-semibold" style={{ color:'var(--accent)' }}>Impact Graph →</a></div>
    </div>
  </section>;
}
