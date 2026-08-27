const rows = [
  ['Source','GitHub repository metadata','GitHub 저장소 메타데이터'],
  ['Commits','Default-branch commit history','기본 브랜치 commit 이력'],
  ['Releases','Published GitHub releases','공개 GitHub Release'],
  ['Activity','Repository push / weekly activity','저장소 push / 주간 activity'],
  ['Docs','Published project documentation pages','사이트에 공개된 프로젝트 문서'],
] as const;

export function OssEvidenceMethod({ locale }: { locale: 'ko' | 'en' }) {
  const en=locale==='en';
  return <section className="mt-14 rounded-3xl p-7 sm:p-9" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--signal)' }}>EVIDENCE METHOD</div><h2 className="mt-3 text-2xl font-semibold">{en?'What the numbers mean.':'숫자가 무엇을 의미하는지 공개합니다.'}</h2><p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>{en?'Metrics are evidence signals, not quality scores. They show continuity, release cadence, and observable project evolution.':'이 지표는 품질 점수가 아니라 개발 지속성·릴리스 흐름·프로젝트 변화가 실제로 관찰되는지를 보여주는 evidence signal입니다.'}</p><div className="mt-6 divide-y" style={{ borderColor:'var(--border)' }}>{rows.map(([key,enText,koText])=><div key={key} className="grid gap-2 py-4 sm:grid-cols-[120px_1fr]"><div className="font-mono text-[10px] font-semibold" style={{ color:'var(--text-faint)' }}>{key}</div><div className="text-sm" style={{ color:'var(--text-muted)' }}>{en?enText:koText}</div></div>)}</div></section>;
}
