import Link from 'next/link';
import { getOssRepoMeta, OSS_REPO_SNAPSHOT, repoFreshness } from '@/lib/oss-repo-meta';
import { getOssPortfolioProject, OSS_PORTFOLIO_PROJECTS } from '@/lib/oss-portfolio';
import { getAttentionTracker, OSS_ATTENTION_OWNERS, OSS_PORTFOLIO_SOURCES, type AttentionSignalKind } from '@/lib/oss-actionability';
import { getOssIssueMetaByUrl, issueStateLabel } from '@/lib/oss-issue-meta';
import { findAttentionIssueCandidate } from '@/lib/oss-issue-candidates';

type Props = { locale:'ko'|'en'; docs:Array<{ name:string; docs:number }> };
type Signal = { slug:string; name:string; kind:AttentionSignalKind; label:string; detail:string };

export function OssPortfolioAttention({ locale, docs }: Props) {
  const en=locale==='en';
  const docsBySlug=new Map(docs.map((item)=>[item.name,item.docs]));
  const signals:Signal[]=[];

  for (const project of OSS_PORTFOLIO_PROJECTS) {
    const { slug,repo,name }=project;
    const meta=getOssRepoMeta(repo);
    const freshness=repoFreshness(meta?.pushedAt);
    if ((meta?.releaseCount??0)===0) signals.push({ slug,name,kind:'release',label:en?'No GitHub release':'GitHub Release 없음',detail:en?'Repository snapshot reports zero releases.':'현재 snapshot 기준 GitHub Release가 0개입니다.' });
    if (freshness.label==='stale') signals.push({ slug,name,kind:'activity',label:en?'No push in 30d+':'30일 이상 push 없음',detail:en?`Last push is ${freshness.days??'—'} days before the snapshot.`:`마지막 push가 snapshot보다 ${freshness.days??'—'}일 이전입니다.` });
    if ((meta?.contributorCount??0)<=1) signals.push({ slug,name,kind:'contributors',label:en?'Single-contributor signal':'단일 contributor 신호',detail:en?'GitHub reports one or fewer contributors; this is not proof that no outside participation exists.':'GitHub 집계 contributor가 1명 이하입니다. 외부 참여가 전혀 없다는 뜻으로 해석하지 않습니다.' });
    if ((docsBySlug.get(slug)??0)===0) signals.push({ slug,name,kind:'docs',label:en?'No indexed detail docs':'상세 문서 미인덱싱',detail:en?'No project detail documentation section is indexed on the OSS site.':'OSS 사이트에 해당 프로젝트 상세 문서 section이 인덱싱되지 않았습니다.' });
  }

  const priority={ activity:0, release:1, docs:2, contributors:3 } as const;
  signals.sort((a,b)=>priority[a.kind]-priority[b.kind]||a.name.localeCompare(b.name));
  const visible=signals.slice(0,8);
  const trackedAll=signals.filter((item)=>getAttentionTracker(item.slug,item.kind));
  const untrackedAll=signals.filter((item)=>!getAttentionTracker(item.slug,item.kind));
  const trackedVisible=visible.filter((item)=>getAttentionTracker(item.slug,item.kind)).length;
  const projectTracked=trackedAll.filter((item)=>getAttentionTracker(item.slug,item.kind)?.source==='project').length;
  const portfolioTracked=trackedAll.filter((item)=>getAttentionTracker(item.slug,item.kind)?.source==='portfolio').length;
  const strategyTracked=trackedAll.filter((item)=>getAttentionTracker(item.slug,item.kind)?.source==='strategy').length;
  const candidateMapped=untrackedAll.filter((item)=>{const project=getOssPortfolioProject(item.slug);return project?Boolean(findAttentionIssueCandidate(project.repo,item.kind)):false;}).length;
  const coverageGaps=(Object.keys(OSS_ATTENTION_OWNERS) as AttentionSignalKind[]).map((kind)=>({
    kind,
    items:untrackedAll.filter((item)=>item.kind===kind),
    owner:OSS_ATTENTION_OWNERS[kind],
  })).filter((group)=>group.items.length>0);
  const prefix=en?'/oss/en':'/oss';

  return <section className="mt-12">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--signal)' }}>ATTENTION / NEXT ACTION</div><h2 className="mt-3 text-3xl font-semibold">{en?'Turn observable gaps into the next maintenance queue.':'관찰 가능한 gap을 다음 유지보수 후보로 바꿉니다.'}</h2></div><div className="font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{visible.length}/{signals.length} {en?'signals shown':'signals 표시'} · {trackedVisible} {en?'tracked':'tracked'} · {OSS_REPO_SNAPSHOT.generatedAt.slice(0,10)}</div></div>
    <p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>{en?'These are factual maintenance signals derived from repository and documentation snapshots, not severity scores. Existing trackers show live issue state; untracked signals may show a keyword-matched open issue only as a Candidate, never as an automatic tracker assignment.':'저장소·문서 snapshot에서 확인되는 사실 기반 유지보수 신호입니다. 기존 tracker는 실제 issue 상태를 표시하고, Untracked 신호에는 keyword가 일치하는 open issue를 Candidate로만 제안하며 자동 tracker로 승격하지 않습니다.'}</p>

    <div className="mt-6 grid gap-3 md:grid-cols-5">
      {[
        [en?'Backlog coverage':'Backlog Coverage', `${trackedAll.length}/${signals.length}`, en?'attention signals mapped to an explicit tracker':'attention signal 중 명시적 tracker에 연결된 수'],
        [en?'Candidate matches':'Candidate matches', `${candidateMapped}`, en?'untracked signals with a deterministic open-issue candidate':'open issue 후보가 탐지된 untracked signal'],
        [en?'Project trackers':'Project trackers', `${projectTracked}`, en?'repository-local implementation or engineering issues':'각 저장소의 구현/engineering issue'],
        [en?'Portfolio trackers':'Portfolio trackers', `${portfolioTracked}`, en?'cross-project engineering contract ownership':'cross-project engineering contract owner'],
        [en?'Strategy trackers':'Strategy trackers', `${strategyTracked}`, en?'community or long-term growth strategy issues':'community·장기 성장 전략 issue'],
      ].map(([label,value,detail])=><div key={label} className="rounded-2xl p-4" style={{ border:'1px solid var(--border)', backgroundColor:'var(--bg-subtle)' }}><div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>{label}</div><div className="mt-2 text-2xl font-semibold">{value}</div><div className="mt-2 text-xs leading-5" style={{ color:'var(--text-muted)' }}>{detail}</div></div>)}
    </div>

    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs" style={{ color:'var(--text-muted)' }}><span className="font-semibold">{en?'Portfolio sources of truth:':'Portfolio source of truth:'}</span>{OSS_PORTFOLIO_SOURCES.map((source)=>{const state=issueStateLabel(getOssIssueMetaByUrl(source.url));return <a key={source.ref} href={source.url} target="_blank" rel="noreferrer" className="rounded-full px-2.5 py-1" style={{ border:'1px solid var(--border)' }}>{source.ref} · {source.label} · {state} ↗</a>;})}</div>

    {coverageGaps.length>0 && <div className="mt-6 rounded-2xl p-5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--bg-subtle)' }}>
      <div className="flex flex-wrap items-end justify-between gap-3"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--signal)' }}>COVERAGE GAP</div><h3 className="mt-2 text-xl font-semibold">{en?'Group untracked signals before creating new backlog.':'Untracked 신호를 새 이슈 생성 전에 영역별로 묶습니다.'}</h3></div><div className="font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{untrackedAll.length} {en?'untracked signals':'untracked signals'} · {coverageGaps.length} {en?'gap groups':'gap groups'}</div></div>
      <p className="mt-2 max-w-4xl text-xs leading-6" style={{ color:'var(--text-muted)' }}>{en?'The owner below is only the nearest canonical portfolio source, not an automatically assigned issue. Candidate matching is equally conservative: it is a review hint based on title/label keywords, not proof that the issue owns the gap.':'아래 owner는 자동 배정된 이슈가 아니라 가장 가까운 canonical portfolio source 후보입니다. Candidate matching 역시 title/label keyword 기반 검토 힌트일 뿐 해당 issue가 gap을 소유한다는 증거가 아닙니다.'}</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">{coverageGaps.map(({kind,items,owner})=>{const state=issueStateLabel(getOssIssueMetaByUrl(owner.url));return <div key={kind} className="rounded-xl p-4" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--signal)' }}>{kind}</span><span className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-faint)' }}>{items.length} {en?'untracked':'untracked'}</span></div><div className="mt-3 flex flex-wrap gap-1.5">{items.slice(0,6).map((item)=><Link key={`${item.slug}-${item.kind}`} href={`${prefix}/${item.slug}/`} className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:'1px solid var(--border)', color:'var(--text-muted)' }}>{item.name}</Link>)}</div><div className="mt-4 border-t pt-3" style={{ borderColor:'var(--border)' }}><div className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>{en?'Nearest canonical owner':'가장 가까운 canonical owner'}</div><a href={owner.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm font-semibold" style={{ color:'var(--accent)' }}>{owner.ref} · {en?owner.labelEn:owner.labelKo} · {state} ↗</a><p className="mt-2 text-xs leading-5" style={{ color:'var(--text-muted)' }}>{en?owner.rationaleEn:owner.rationaleKo}</p></div></div>;})}</div>
    </div>}

    {visible.length===0 ? <div className="mt-6 rounded-2xl p-6 text-sm" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)', color:'var(--text-muted)' }}>{en?'No attention signals matched the current rules.':'현재 규칙에 해당하는 attention signal이 없습니다.'}</div> : <div className="mt-6 grid gap-3 md:grid-cols-2">{visible.map((item)=>{const tracker=getAttentionTracker(item.slug,item.kind);const trackerState=tracker?issueStateLabel(getOssIssueMetaByUrl(tracker.url)):undefined;const project=getOssPortfolioProject(item.slug);const candidate=!tracker&&project?findAttentionIssueCandidate(project.repo,item.kind):undefined;return <div key={`${item.slug}-${item.kind}`} className="rounded-2xl p-5 transition hover:-translate-y-0.5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="flex items-start justify-between gap-4"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--signal)' }}>{item.label}</div><div className="mt-2 text-lg font-semibold">{item.name}</div></div><span className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-faint)' }}>{item.kind}</span></div><p className="mt-3 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{item.detail}</p><div className="mt-4 flex flex-wrap items-center gap-2"><Link href={`${prefix}/${item.slug}/`} className="text-xs font-semibold" style={{ color:'var(--accent)' }}>{en?'Project context →':'프로젝트 맥락 →'}</Link>{tracker?<a href={tracker.url} target="_blank" rel="noreferrer" className="rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold" style={{ border:'1px solid var(--accent)', color:'var(--accent)' }}>Tracked · {tracker.label} · {tracker.source} · {trackerState} ↗</a>:candidate?<a href={candidate.url} target="_blank" rel="noreferrer" className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px dashed var(--signal)', color:'var(--signal)' }}>Candidate · {candidate.repo}#{candidate.number} ↗</a>:<span className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-faint)' }}>{en?'Untracked':'Untracked'}</span>}</div></div>})}</div>}
  </section>;
}
