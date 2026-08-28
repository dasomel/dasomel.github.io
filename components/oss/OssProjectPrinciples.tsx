const PRINCIPLES = [
  ['Source-driven', '설명은 repository의 source, architecture, tests, release와 운영 기록을 근거로 유지합니다.'],
  ['Independently useful', '생태계에 속하더라도 가능한 한 독립 설치·검증·릴리스 가능한 경계를 유지합니다.'],
  ['Evidence over claims', '기능 개수보다 재현 가능한 검증, 장애 지식, upgrade gate와 운영 증거를 우선합니다.'],
];

export function OssProjectPrinciples() {
  return <section className="mb-10"><div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color:'var(--text-faint)' }}>ENGINEERING PRINCIPLES</div><div className="mt-4 grid gap-3 md:grid-cols-3">{PRINCIPLES.map(([title,body])=><div key={title} className="rounded-xl p-5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="font-semibold">{title}</div><p className="mt-2 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{body}</p></div>)}</div></section>;
}
