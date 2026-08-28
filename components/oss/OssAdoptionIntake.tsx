import Link from 'next/link';
import { OSS_PORTFOLIO_PROJECTS } from '@/lib/oss-portfolio';
import { adoptionIntakeState, getOssAdoptionCandidates } from '@/lib/oss-adoption';

export function OssAdoptionIntake({ locale }:{ locale:'ko'|'en' }) {
  const en=locale==='en';
  const prefix=en?'/oss/en':'/oss';
  const state=adoptionIntakeState();
  const candidates=getOssAdoptionCandidates();
  const projectName=new Map(OSS_PORTFOLIO_PROJECTS.map((project)=>[project.slug,project.name]));
  const visible=candidates.filter((item)=>item.status!=='rejected').slice(0,8);

  return <section className="mt-12">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--signal)' }}>ADOPTION INTAKE</div>
        <h2 className="mt-3 text-3xl font-semibold">{en?'Review possible external-use signals before they become evidence.':'외부 사용 가능 신호를 evidence로 승격하기 전에 검토합니다.'}</h2>
      </div>
      <div className="font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{state.total} {en?'intake records':'intake records'} · {state.automated} automated</div>
    </div>
    <p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>{en?'Build-time GitHub code search can add exact repository-URL mentions as candidates, but intake remains separated from readiness evidence. Automated candidates never change adoption readiness until a source is reviewed and promoted.':'Pages 빌드 시 GitHub code search가 정확한 repository URL 언급을 candidate로 추가할 수 있지만 intake는 readiness evidence와 분리됩니다. 자동 후보는 source 검토와 승격 전까지 Adoption readiness를 변경하지 않습니다.'}</p>

    <div className="mt-6 grid gap-3 sm:grid-cols-4">
      {[
        ['Candidate',state.candidate,en?'source discovered, review pending':'source 발견, 검토 대기'],
        ['Reported',state.reported,en?'explicit report, stronger validation pending':'명시적 보고, 추가 검증 대기'],
        ['Verified',state.verified,en?'reviewed external-use evidence':'검토 완료 외부 사용 근거'],
        ['Rejected',state.rejected,en?'reviewed but not acceptable as adoption evidence':'검토했으나 adoption evidence로 부적합'],
      ].map(([title,value,detail])=><div key={title} className="rounded-2xl p-4" style={{ border:'1px solid var(--border)', backgroundColor:'var(--bg-subtle)' }}><div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>{title}</div><div className="mt-2 text-2xl font-semibold">{value}</div><p className="mt-2 text-xs leading-5" style={{ color:'var(--text-muted)' }}>{detail}</p></div>)}
    </div>

    {visible.length===0 ? <div className="mt-5 rounded-2xl p-6 text-sm" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)', color:'var(--text-muted)' }}>{en?'No adoption candidates are currently indexed. This remains a valid state when no exact external repository reference is found.':'현재 인덱싱된 adoption candidate가 없습니다. 외부 저장소의 정확한 참조가 발견되지 않았다면 정상 상태입니다.'}</div> : <div className="mt-5 grid gap-3 md:grid-cols-2">{visible.map((item)=><div key={`${item.project}-${item.sourceUrl}`} className="rounded-2xl p-5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="flex items-start justify-between gap-3"><div><div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color:'var(--signal)' }}>{item.status} · {item.kind}</div><div className="mt-2 text-lg font-semibold">{item.label}</div></div><span className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-faint)' }}>{projectName.get(item.project)??item.project}</span></div>{item.note&&<p className="mt-3 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{item.note}</p>}<div className="mt-3 font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{item.discovery??'manual'} · {item.discoveredAt.slice(0,10)}</div><div className="mt-4 flex flex-wrap gap-2"><Link href={`${prefix}/${item.project}/`} className="text-xs font-semibold" style={{ color:'var(--accent)' }}>{en?'Project context →':'프로젝트 맥락 →'}</Link><a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold" style={{ color:'var(--accent)' }}>{en?'Review source ↗':'Source 검토 ↗'}</a></div></div>)}</div>}

    <p className="mt-3 text-xs leading-5" style={{ color:'var(--text-faint)' }}>{en?'Promotion rule: candidate → reported only when a source explicitly describes actual use; reported → verified only after the source and project relationship are reviewed. A manual review record overrides the same automated source URL, so rejected decisions persist across future discovery runs.':'승격 규칙: source가 실제 사용을 명시해야 candidate → reported, source와 프로젝트 관계를 검토한 뒤에만 reported → verified로 올립니다. 동일 source URL에 대한 수동 검토 기록이 자동 후보보다 우선하므로 rejected 판단도 이후 discovery에서 유지됩니다.'}</p>
  </section>;
}
