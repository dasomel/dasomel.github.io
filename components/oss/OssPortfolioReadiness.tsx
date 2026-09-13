import Link from 'next/link';
import { getOssRepoMeta } from '@/lib/oss-repo-meta';
import { evidencePresent, getOssRepoAudit, type OssRepoAuditEvidence } from '@/lib/oss-repo-audit';
import { OSS_PORTFOLIO_PROJECTS } from '@/lib/oss-portfolio';
import { getReadinessTracker, type OssTracker, type ReadinessGapKind } from '@/lib/oss-actionability';
import { adoptionEvidenceState, OSS_ADOPTION_EVIDENCE } from '@/lib/oss-adoption';
import { getOssIssueMetaByUrl, issueStateLabel } from '@/lib/oss-issue-meta';
import { findReadinessIssueCandidate } from '@/lib/oss-issue-candidates';

type Props = { locale:'ko'|'en'; docs:Array<{ name:string; docs:number }> };
type ReadinessState = 'observed'|'partial'|'not-indexed';
type Gap = { slug:string; repo:string; name:string; kind:ReadinessGapKind; label:string; detail:string; tracker?:OssTracker };

function label(state:ReadinessState, en:boolean) {
  if (state==='observed') return en?'Observed':'확인됨';
  if (state==='partial') return en?'Partial':'부분 확인';
  return en?'Not indexed':'미인덱싱';
}

function governanceState(evidence?:OssRepoAuditEvidence):ReadinessState {
  if (!evidence) return 'not-indexed';
  const license=evidencePresent(evidence.license);
  const contributing=evidencePresent(evidence.contributing);
  if (license && contributing) return 'observed';
  if (license || contributing || evidencePresent(evidence.codeOfConduct) || evidencePresent(evidence.notice)) return 'partial';
  return 'not-indexed';
}

function securityState(evidence?:OssRepoAuditEvidence):ReadinessState {
  if (!evidence) return 'not-indexed';
  const security=evidencePresent(evidence.security);
  const supplyChain=evidencePresent(evidence.sbom) || evidencePresent(evidence.provenance);
  if (security && supplyChain) return 'observed';
  if (security || supplyChain) return 'partial';
  return 'not-indexed';
}

function evidenceLine(items:Array<[string,boolean]>) {
  return items.map(([name,present])=>`${name} ${present?'✓':'—'}`).join(' · ');
}

function Badge({ state, en, detail }:{ state:ReadinessState; en:boolean; detail?:string }) {
  const strong=state==='observed';
  return <div><span className="inline-flex rounded-full px-2.5 py-1 text-[11px]" style={{ border:`1px solid ${strong?'var(--accent)':'var(--border)'}`, color:strong?'var(--accent)':'var(--text-muted)' }}>{label(state,en)}</span>{detail&&<div className="mt-2 max-w-[220px] font-mono text-[9px] leading-4" style={{ color:'var(--text-faint)' }}>{detail}</div>}</div>;
}

export function OssPortfolioReadiness({ locale, docs }:Props) {
  const en=locale==='en';
  const prefix=en?'/oss/en':'/oss';
  const docsBySlug=new Map(docs.map((item)=>[item.name,item.docs]));
  const gaps:Gap[]=[];

  for (const project of OSS_PORTFOLIO_PROJECTS) {
    const { slug,repo,name }=project;
    const meta=getOssRepoMeta(repo);
    const audit=getOssRepoAudit(repo);
    const evidence=audit?.evidence;
    const docsCount=docsBySlug.get(slug)??0;
    if (!evidencePresent(evidence?.license)) gaps.push({ slug,repo,name,kind:'license',label:en?'LICENSE evidence missing':'LICENSE 근거 없음',detail:en?'No root/.github LICENSE evidence was observed by the repository audit.':'repository audit에서 root/.github LICENSE 근거를 확인하지 못했습니다.',tracker:getReadinessTracker(slug,'license') });
    if (!evidencePresent(evidence?.contributing)) gaps.push({ slug,repo,name,kind:'contributing',label:en?'CONTRIBUTING evidence missing':'CONTRIBUTING 근거 없음',detail:en?'No root/.github CONTRIBUTING evidence was observed.':'root/.github CONTRIBUTING 근거를 확인하지 못했습니다.',tracker:getReadinessTracker(slug,'contributing') });
    if (!evidencePresent(evidence?.security)) gaps.push({ slug,repo,name,kind:'security',label:en?'SECURITY policy evidence missing':'SECURITY 정책 근거 없음',detail:en?'No root/.github SECURITY evidence was observed.':'root/.github SECURITY 근거를 확인하지 못했습니다.',tracker:getReadinessTracker(slug,'security') });
    if (!evidencePresent(evidence?.sbom)) gaps.push({ slug,repo,name,kind:'sbom',label:en?'SBOM evidence missing':'SBOM 근거 없음',detail:en?'No SBOM/SPDX/CycloneDX evidence path was observed in the repository tree.':'repository tree에서 SBOM/SPDX/CycloneDX 근거 경로를 확인하지 못했습니다.',tracker:getReadinessTracker(slug,'sbom') });
    if (!evidencePresent(evidence?.provenance)) gaps.push({ slug,repo,name,kind:'provenance',label:en?'Provenance evidence missing':'Provenance 근거 없음',detail:en?'No provenance/attestation/SLSA/cosign evidence path was observed.':'provenance/attestation/SLSA/cosign 근거 경로를 확인하지 못했습니다.',tracker:getReadinessTracker(slug,'provenance') });
    if ((meta?.releaseCount??0)===0) gaps.push({ slug,repo,name,kind:'release',label:en?'No GitHub release':'GitHub Release 없음',detail:en?'The build-time GitHub snapshot reports zero releases.':'build-time GitHub snapshot 기준 release가 0개입니다.',tracker:getReadinessTracker(slug,'release') });
    if (docsCount===0) gaps.push({ slug,repo,name,kind:'docs',label:en?'No indexed project docs':'프로젝트 문서 미인덱싱',detail:en?'No project detail documentation section is indexed on the OSS site.':'OSS 사이트에 프로젝트 상세 문서 section이 인덱싱되지 않았습니다.',tracker:getReadinessTracker(slug,'docs') });
    if ((meta?.contributorCount??0)<=1) gaps.push({ slug,repo,name,kind:'community',label:en?'Single-contributor signal':'단일 contributor 신호',detail:en?'GitHub reports one or fewer contributors; this is an operating signal, not proof of no outside participation.':'GitHub contributor 집계가 1명 이하입니다. 외부 참여가 없다는 증거가 아니라 운영 신호입니다.',tracker:getReadinessTracker(slug,'community') });
  }

  const gapPriority:Record<ReadinessGapKind,number>={ security:0, sbom:1, provenance:2, contributing:3, license:4, release:5, docs:6, community:7 };
  gaps.sort((a,b)=>gapPriority[a.kind]-gapPriority[b.kind]||a.name.localeCompare(b.name));
  const visibleGaps=gaps.slice(0,10);
  const groupCounts=(Object.keys(gapPriority) as ReadinessGapKind[]).map((kind)=>({kind,count:gaps.filter((gap)=>gap.kind===kind).length})).filter((item)=>item.count>0);
  const adoptionProjects=OSS_PORTFOLIO_PROJECTS.filter((project)=>adoptionEvidenceState(project.slug).state!=='not-indexed').length;
  const verifiedAdoption=OSS_ADOPTION_EVIDENCE.filter((item)=>item.status==='verified').length;
  const reportedAdoption=OSS_ADOPTION_EVIDENCE.filter((item)=>item.status==='reported').length;
  const candidateTrackers=gaps.filter((gap)=>{const candidate=findReadinessIssueCandidate(gap.repo,gap.kind);return candidate&&candidate.url!==gap.tracker?.url;}).length;
  const baselineUrl='https://github.com/dasomel/narwhal/issues/162';
  const baselineState=issueStateLabel(getOssIssueMetaByUrl(baselineUrl));

  return <section className="mt-16">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>PORTFOLIO READINESS</div>
        <h2 className="mt-3 text-3xl font-semibold">{en?'Compare public-OSS readiness without inventing a composite score.':'합성 점수를 만들지 않고 공개 OSS readiness 신호를 비교합니다.'}</h2>
      </div>
      <a href={baselineUrl} target="_blank" rel="noreferrer" className="rounded-full px-3 py-1.5 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-muted)' }}>engineering baseline · Narwhal #162 · {baselineState} ↗</a>
    </div>
    <p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>{en?'Governance and security come from the repository tree audit, release and community from the GitHub snapshot, docs from the site index, and adoption only from an explicit evidence registry. Tracker state and candidate issue matches are review aids and never override current repository evidence.':'Governance·Security는 repository tree audit, Release·Community는 GitHub snapshot, Docs는 사이트 index, Adoption은 명시적 evidence registry만 사용합니다. Tracker 상태와 candidate issue match는 검토 보조 신호일 뿐 현재 repository evidence를 덮어쓰지 않습니다.'}</p>

    <div className="mt-6 overflow-x-auto rounded-2xl" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}>
      <table className="w-full min-w-[1160px] border-collapse text-left text-sm">
        <thead><tr style={{ borderBottom:'1px solid var(--border)', backgroundColor:'var(--bg-subtle)' }}>{['Project','Governance','Release','Docs','Security','Community','Adoption evidence'].map((h)=><th key={h} className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>{h}</th>)}</tr></thead>
        <tbody>{OSS_PORTFOLIO_PROJECTS.map((project)=>{
          const { slug,repo,name }=project;
          const meta=getOssRepoMeta(repo);
          const audit=getOssRepoAudit(repo);
          const evidence=audit?.evidence;
          const adoption=adoptionEvidenceState(slug);
          const release=(meta?.releaseCount??0)>0;
          const docsCount=docsBySlug.get(slug)??0;
          const community=(meta?.contributorCount??0)>1;
          const governanceDetail=evidence?evidenceLine([
            ['LICENSE',evidencePresent(evidence.license)],
            ['CONTRIBUTING',evidencePresent(evidence.contributing)],
            ['CODE_OF_CONDUCT',evidencePresent(evidence.codeOfConduct)],
            ['NOTICE',evidencePresent(evidence.notice)],
          ]):undefined;
          const securityDetail=evidence?evidenceLine([
            ['SECURITY',evidencePresent(evidence.security)],
            ['SBOM',evidencePresent(evidence.sbom)],
            ['PROVENANCE',evidencePresent(evidence.provenance)],
          ]):undefined;
          const adoptionDetail=adoption.evidence.length>0?`${adoption.verified.length} verified · ${adoption.reported.length} reported`:undefined;
          return <tr key={slug} style={{ borderBottom:'1px solid var(--border)' }}>
            <td className="px-5 py-4"><Link href={`${prefix}/${slug}/`} className="font-semibold hover:underline">{name} →</Link><div className="mt-1 font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{audit?`repo tree · ${audit.defaultBranch}`:(en?'audit not indexed':'audit 미인덱싱')}</div></td>
            <td className="px-5 py-4"><Badge state={governanceState(evidence)} en={en} detail={governanceDetail}/></td>
            <td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:`1px solid ${release?'var(--accent)':'var(--border)'}`, color:release?'var(--accent)':'var(--text-muted)' }}>{release?(en?'Observed':'확인됨'):(en?'No GitHub release':'GitHub Release 없음')}</span>{evidence&&<div className="mt-2 font-mono text-[9px]" style={{ color:'var(--text-faint)' }}>CHANGELOG {evidencePresent(evidence.changelog)?'✓':'—'}</div>}</td>
            <td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:`1px solid ${docsCount>0?'var(--accent)':'var(--border)'}`, color:docsCount>0?'var(--accent)':'var(--text-muted)' }}>{docsCount>0?`${docsCount} docs`:(en?'Not indexed':'미인덱싱')}</span></td>
            <td className="px-5 py-4"><Badge state={securityState(evidence)} en={en} detail={securityDetail}/></td>
            <td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:`1px solid ${community?'var(--accent)':'var(--border)'}`, color:community?'var(--accent)':'var(--text-muted)' }}>{community?'2+ contributors':(en?'Single-contributor signal':'단일 contributor 신호')}</span></td>
            <td className="px-5 py-4"><Badge state={adoption.state} en={en} detail={adoptionDetail}/></td>
          </tr>;
        })}</tbody>
      </table>
    </div>

    <div className="mt-6 grid gap-3 sm:grid-cols-4">
      {[
        [en?'Projects with adoption evidence':'Adoption evidence 보유 프로젝트', `${adoptionProjects}/${OSS_PORTFOLIO_PROJECTS.length}`, en?'projects with at least one reported or verified external-use record':'reported 또는 verified 외부 사용 근거가 1개 이상 있는 프로젝트'],
        [en?'Verified evidence':'Verified evidence', `${verifiedAdoption}`, en?'explicit sources reviewed as external use or downstream integration':'외부 사용·downstream integration으로 검토된 명시적 source'],
        [en?'Reported evidence':'Reported evidence', `${reportedAdoption}`, en?'explicit reports awaiting stronger verification':'명시적 보고는 있으나 추가 검증이 필요한 source'],
        [en?'Candidate trackers':'Candidate trackers', `${candidateTrackers}`, en?'gap-local open issues suggested by deterministic title/label matching':'gap과 같은 저장소에서 keyword로 탐지된 open issue 후보'],
      ].map(([title,value,detail])=><div key={title} className="rounded-2xl p-4" style={{ border:'1px solid var(--border)', backgroundColor:'var(--bg-subtle)' }}><div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>{title}</div><div className="mt-2 text-2xl font-semibold">{value}</div><p className="mt-2 text-xs leading-5" style={{ color:'var(--text-muted)' }}>{detail}</p></div>)}
    </div>
    <p className="mt-3 max-w-4xl text-xs leading-5" style={{ color:'var(--text-faint)' }}>{en?'Accepted adoption evidence kinds are external adopter, external contributor with downstream use, user report, public deployment, and downstream integration. Every record requires a source URL. Stars, forks, clone counts, and aggregate contributor totals are intentionally excluded.':'Adoption evidence는 external adopter, downstream 사용이 확인된 external contributor, user report, public deployment, downstream integration만 허용하며 모든 항목에 source URL이 필요합니다. star·fork·clone 수·단순 contributor 집계는 의도적으로 제외합니다.'}</p>

    <div className="mt-10 flex flex-wrap items-end justify-between gap-4"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--signal)' }}>READINESS GAP / NEXT ACTION</div><h3 className="mt-3 text-2xl font-semibold">{en?'Turn missing evidence into a reviewable action queue.':'누락된 evidence를 검토 가능한 action queue로 바꿉니다.'}</h3></div><div className="font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{visibleGaps.length}/{gaps.length} {en?'gaps shown':'gap 표시'}</div></div>
    <p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>{en?'Each item is generated from explicit audit or snapshot absence. Canonical tracker links remain authoritative; a matching open issue from the same repository is shown only as a Candidate for review.':'각 항목은 audit 또는 snapshot에서 명시적으로 확인되지 않은 근거로부터 생성됩니다. Canonical tracker가 기준이며, 같은 저장소의 keyword-matched open issue는 검토용 Candidate로만 표시합니다.'}</p>
    <div className="mt-5 flex flex-wrap gap-2">{groupCounts.map((item)=><span key={item.kind} className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-muted)' }}>{item.kind} · {item.count}</span>)}</div>
    {visibleGaps.length>0&&<div className="mt-5 grid gap-3 md:grid-cols-2">{visibleGaps.map((gap)=>{const trackerState=gap.tracker?issueStateLabel(getOssIssueMetaByUrl(gap.tracker.url)):undefined;const candidate=findReadinessIssueCandidate(gap.repo,gap.kind);const showCandidate=candidate&&candidate.url!==gap.tracker?.url;return <div key={`${gap.slug}-${gap.kind}`} className="rounded-2xl p-5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="flex items-start justify-between gap-4"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--signal)' }}>{gap.label}</div><div className="mt-2 text-lg font-semibold">{gap.name}</div></div><span className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-faint)' }}>{gap.kind}</span></div><p className="mt-3 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{gap.detail}</p><div className="mt-4 flex flex-wrap gap-2"><Link href={`${prefix}/${gap.slug}/`} className="text-xs font-semibold" style={{ color:'var(--accent)' }}>{en?'Project context →':'프로젝트 맥락 →'}</Link>{gap.tracker&&<a href={gap.tracker.url} target="_blank" rel="noreferrer" className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px solid var(--accent)', color:'var(--accent)' }}>{gap.tracker.label} · {gap.tracker.source} · {trackerState} ↗</a>}{showCandidate&&<a href={candidate.url} target="_blank" rel="noreferrer" className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px dashed var(--signal)', color:'var(--signal)' }}>Candidate · {candidate.repo}#{candidate.number} ↗</a>}</div></div>;})}</div>}

    <p className="mt-3 text-xs leading-5" style={{ color:'var(--text-faint)' }}>{en?'Audit matching, issue-candidate matching, and adoption discovery are intentionally conservative. Candidate signals never become trackers or adoption evidence automatically.':'Repository audit, issue candidate matching, adoption discovery 모두 보수적으로 동작하며 Candidate 신호는 tracker나 adoption evidence로 자동 승격되지 않습니다.'}</p>
  </section>;
}
