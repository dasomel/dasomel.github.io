const POSITIONING: Record<string, { role: string; statement: string; evidence: string[] }> = {
  narwhal: { role: 'Flagship Platform', statement: '복잡한 Kubernetes 플랫폼의 설치보다 integration seam을 재현·검증·운영 가능한 engineering system으로 만드는 프로젝트입니다.', evidence: ['Platform integration', 'Verification-driven', 'GitOps & operations'] },
  'nfs-quota-agent': { role: 'Reusable Component', statement: 'Narwhal에 종속되지 않고 Kubernetes shared storage 환경에서 독립 설치·검증·재사용할 수 있는 filesystem quota component를 지향합니다.', evidence: ['Shared NFS quota', 'Filesystem enforcement', 'Independent lifecycle'] },
  kubemetal: { role: 'Emerging / Cloud-native AI', statement: 'Apple Silicon의 native ML compute와 Kubernetes control plane을 연결해 local AI infrastructure의 실용적인 경계를 검증합니다.', evidence: ['Apple Silicon', 'Kubernetes control plane', 'Native ML compute'] },
  openforge: { role: 'Engineering Foundation', statement: '각 OSS가 같은 저장소 모양만 갖추는 것이 아니라 documentation, CI/CD, security, release, governance 원칙을 반복 적용하도록 만드는 공통 engineering blueprint입니다.', evidence: ['OSS standards', 'Supply chain', 'Governance & docs'] },
};

export function OssProjectPositioning({ slug }: { slug: string }) {
  const item = POSITIONING[slug];
  if (!item) return null;
  return <section className="mb-10 overflow-hidden rounded-2xl" style={{ border:'1px solid var(--border)', backgroundColor:'var(--bg-subtle)' }}><div className="grid gap-0 lg:grid-cols-[0.85fr_2fr]"><div className="p-6 sm:p-7 lg:border-r" style={{ borderColor:'var(--border)' }}><div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color:'var(--accent)' }}>ECOSYSTEM ROLE</div><div className="mt-3 text-2xl font-semibold tracking-tight">{item.role}</div></div><div className="p-6 sm:p-7"><p className="text-[15px] leading-7" style={{ color:'var(--text-muted)' }}>{item.statement}</p><div className="mt-5 flex flex-wrap gap-2">{item.evidence.map((label)=><span key={label} className="rounded-full px-3 py-1.5 text-[11px] font-medium" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)', color:'var(--text-faint)' }}>{label}</span>)}</div></div></div></section>;
}
