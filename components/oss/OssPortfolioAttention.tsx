import Link from 'next/link';
import { getOssRepoMeta, OSS_REPO_SNAPSHOT, repoFreshness } from '@/lib/oss-repo-meta';

const projects = [
  ['openforge','dasomel/openforge','OpenForge'],
  ['kube-ready-box','dasomel/kube-ready-box','Kube-Ready-Box'],
  ['clusterdeck','dasomel/clusterdeck','ClusterDeck'],
  ['narwhal','dasomel/narwhal','Narwhal'],
  ['narwhal-portal','dasomel/narwhal-portal','Narwhal Portal'],
  ['nfs-quota-agent','dasomel/nfs-quota-agent','NFS Quota Agent'],
  ['ldapium','dasomel/ldapium','ldapium'],
  ['beluga','dasomel/beluga','Beluga'],
  ['beluga-manager','dasomel/beluga-manager','Beluga Manager'],
  ['kubemetal','dasomel/kubemetal','KubeMetal'],
] as const;

type SignalKind = 'release'|'activity'|'contributors'|'docs';
type Props = { locale:'ko'|'en'; docs:Array<{ name:string; docs:number }> };
type Signal = { slug:string; name:string; kind:SignalKind; label:string; detail:string };
type Tracker = { url:string; label:string; source:'project'|'portfolio'|'strategy' };
type OwnerCandidate = { url:string; ref:string; labelKo:string; labelEn:string; rationaleKo:string; rationaleEn:string };

const tracking:Record<string,Tracker> = {
  'narwhal:release': { url:'https://github.com/dasomel/narwhal/issues/161', label:'Narwhal #161', source:'portfolio' },
  'kube-ready-box:release': { url:'https://github.com/dasomel/kube-ready-box/issues/28', label:'kube-ready-box #28', source:'project' },
  'nfs-quota-agent:release': { url:'https://github.com/dasomel/nfs-quota-agent/issues/16', label:'nfs-quota-agent #16', source:'project' },
  'ldapium:release': { url:'https://github.com/dasomel/ldapium/issues/36', label:'ldapium #36', source:'project' },
  'beluga:release': { url:'https://github.com/dasomel/beluga/issues/100', label:'Beluga #100', source:'project' },
  'kubemetal:release': { url:'https://github.com/dasomel/kubemetal/issues/35', label:'KubeMetal #35', source:'project' },
  'narwhal:contributors': { url:'https://github.com/dasomel/narwhal/issues/169', label:'Narwhal #169', source:'strategy' },
  'nfs-quota-agent:contributors': { url:'https://github.com/dasomel/nfs-quota-agent/issues/81', label:'NFS Quota Agent #81', source:'strategy' },
};

const portfolioSources = [
  { label:'Taxonomy / execution waves', ref:'Narwhal #41', url:'https://github.com/dasomel/narwhal/issues/41' },
  { label:'Engineering conformance', ref:'Narwhal #162', url:'https://github.com/dasomel/narwhal/issues/162' },
  { label:'Community growth strategy', ref:'Narwhal #169', url:'https://github.com/dasomel/narwhal/issues/169' },
] as const;

const ownerCandidates:Record<SignalKind,OwnerCandidate> = {
  activity: {
    url:'https://github.com/dasomel/narwhal/issues/41', ref:'Narwhal #41',
    labelKo:'Taxonomy / execution waves', labelEn:'Taxonomy / execution waves',
    rationaleKo:'비활성 프로젝트의 우선순위·execution wave 재검토에 가장 가까운 portfolio owner입니다.',
    rationaleEn:'Closest portfolio owner for reconsidering priority and execution waves of inactive projects.',
  },
  release: {
    url:'https://github.com/dasomel/narwhal/issues/162', ref:'Narwhal #162',
    labelKo:'Engineering conformance', labelEn:'Engineering conformance',
    rationaleKo:'릴리스·SBOM·provenance·release evidence 공통 기준을 다루는 canonical checklist입니다.',
    rationaleEn:'Canonical checklist for release, SBOM, provenance and release-evidence gaps.',
  },
  docs: {
    url:'https://github.com/dasomel/narwhal/issues/162', ref:'Narwhal #162',
    labelKo:'Engineering conformance', labelEn:'Engineering conformance',
    rationaleKo:'Repository governance와 문서 baseline을 함께 검증하는 portfolio checklist입니다.',
    rationaleEn:'Portfolio checklist that also covers repository governance and documentation baseline.',
  },
  contributors: {
    url:'https://github.com/dasomel/narwhal/issues/169', ref:'Narwhal #169',
    labelKo:'Community growth strategy', labelEn:'Community growth strategy',
    rationaleKo:'외부 contributor·maintainer 확대와 community growth 방향을 다루는 전략 owner입니다.',
    rationaleEn:'Strategy owner for external contributor, maintainer and community growth.',
  },
};

function trackerFor(slug:string, kind:SignalKind) {
  return tracking[`${slug}:${kind}`];
}

export function OssPortfolioAttention({ locale, docs }: Props) {
  const en=locale==='en';
  const docsBySlug=new Map(docs.map((item)=>[item.name,item.docs]));
  const signals:Signal[]=[];

  for (const [slug,repo,name] of projects) {
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
  const trackedAll=signals.filter((item)=>trackerFor(item.slug,item.kind));
  const untrackedAll=signals.filter((item)=>!trackerFor(item.slug,item.kind));
  const trackedVisible=visible.filter((item)=>trackerFor(item.slug,item.kind)).length;
  const projectTracked=trackedAll.filter((item)=>trackerFor(item.slug,item.kind)?.source==='project').length;
  const portfolioTracked=trackedAll.filter((item)=>trackerFor(item.slug,item.kind)?.source==='portfolio').length;
  const strategyTracked=trackedAll.filter((item)=>trackerFor(item.slug,item.kind)?.source==='strategy').length;
  const coverageGaps=(Object.keys(ownerCandidates) as SignalKind[]).map((kind)=>({
    kind,
    items:untrackedAll.filter((item)=>item.kind===kind),
    owner:ownerCandidates[kind],
  })).filter((group)=>group.items.length>0);
  const prefix=en?'/oss/en':'/oss';

  return <section className="mt-12">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--signal)' }}>ATTENTION / NEXT ACTION</div><h2 className="mt-3 text-3xl font-semibold">{en?'Turn observable gaps into the next maintenance queue.':'관찰 가능한 gap을 다음 유지보수 후보로 바꿉니다.'}</h2></div><div className="font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{visible.length}/{signals.length} {en?'signals shown':'signals 표시'} · {trackedVisible} {en?'tracked':'tracked'} · {OSS_REPO_SNAPSHOT.generatedAt.slice(0,10)}</div></div>
    <p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>{en?'These are factual maintenance signals derived from repository and documentation snapshots, not severity scores. When an existing project or strategy issue clearly covers the signal, the card links to that tracker; otherwise it remains Untracked rather than creating duplicate backlog automatically.':'저장소·문서 snapshot에서 바로 확인되는 사실 기반 유지보수 신호입니다. 기존 project/strategy issue가 해당 신호를 명확히 다루는 경우 tracker를 연결하고, 그렇지 않으면 중복 이슈를 자동 생성하지 않고 Untracked로 남깁니다.'}</p>

    <div className="mt-6 grid gap-3 md:grid-cols-4">
      {[
        [en?'Backlog coverage':'Backlog Coverage', `${trackedAll.length}/${signals.length}`, en?'attention signals mapped to an explicit tracker':'attention signal 중 명시적 tracker에 연결된 수'],
        [en?'Project trackers':'Project trackers', `${projectTracked}`, en?'repository-local implementation or engineering issues':'각 저장소의 구현/engineering issue'],
        [en?'Portfolio trackers':'Portfolio trackers', `${portfolioTracked}`, en?'cross-project engineering contract ownership':'cross-project engineering contract owner'],
        [en?'Strategy trackers':'Strategy trackers', `${strategyTracked}`, en?'community or long-term growth strategy issues':'community·장기 성장 전략 issue'],
      ].map(([label,value,detail])=><div key={label} className="rounded-2xl p-4" style={{ border:'1px solid var(--border)', backgroundColor:'var(--bg-subtle)' }}><div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>{label}</div><div className="mt-2 text-2xl font-semibold">{value}</div><div className="mt-2 text-xs leading-5" style={{ color:'var(--text-muted)' }}>{detail}</div></div>)}
    </div>

    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs" style={{ color:'var(--text-muted)' }}><span className="font-semibold">{en?'Portfolio sources of truth:':'Portfolio source of truth:'}</span>{portfolioSources.map((source)=><a key={source.ref} href={source.url} target="_blank" rel="noreferrer" className="rounded-full px-2.5 py-1" style={{ border:'1px solid var(--border)' }}>{source.ref} · {source.label} ↗</a>)}</div>

    {coverageGaps.length>0 && <div className="mt-6 rounded-2xl p-5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--bg-subtle)' }}>
      <div className="flex flex-wrap items-end justify-between gap-3"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--signal)' }}>COVERAGE GAP</div><h3 className="mt-2 text-xl font-semibold">{en?'Group untracked signals before creating new backlog.':'Untracked 신호를 새 이슈 생성 전에 영역별로 묶습니다.'}</h3></div><div className="font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{untrackedAll.length} {en?'untracked signals':'untracked signals'} · {coverageGaps.length} {en?'gap groups':'gap groups'}</div></div>
      <p className="mt-2 max-w-4xl text-xs leading-6" style={{ color:'var(--text-muted)' }}>{en?'The owner below is only the nearest canonical portfolio source, not an automatically assigned issue. Review the repository context first, reuse an existing issue when possible, and create a new issue only when the capability is genuinely new.':'아래 owner는 자동 배정된 이슈가 아니라 가장 가까운 canonical portfolio source 후보입니다. 먼저 저장소 맥락과 기존 issue를 확인하고, 재사용할 수 없으며 실제로 새로운 capability일 때만 새 issue를 만듭니다.'}</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">{coverageGaps.map(({kind,items,owner})=><div key={kind} className="rounded-xl p-4" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--signal)' }}>{kind}</span><span className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-faint)' }}>{items.length} {en?'untracked':'untracked'}</span></div><div className="mt-3 flex flex-wrap gap-1.5">{items.slice(0,6).map((item)=><Link key={`${item.slug}-${item.kind}`} href={`${prefix}/${item.slug}/`} className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:'1px solid var(--border)', color:'var(--text-muted)' }}>{item.name}</Link>)}</div><div className="mt-4 border-t pt-3" style={{ borderColor:'var(--border)' }}><div className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>{en?'Nearest canonical owner':'가장 가까운 canonical owner'}</div><a href={owner.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm font-semibold" style={{ color:'var(--accent)' }}>{owner.ref} · {en?owner.labelEn:owner.labelKo} ↗</a><p className="mt-2 text-xs leading-5" style={{ color:'var(--text-muted)' }}>{en?owner.rationaleEn:owner.rationaleKo}</p></div></div>)}</div>
    </div>}

    {visible.length===0 ? <div className="mt-6 rounded-2xl p-6 text-sm" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)', color:'var(--text-muted)' }}>{en?'No attention signals matched the current rules.':'현재 규칙에 해당하는 attention signal이 없습니다.'}</div> : <div className="mt-6 grid gap-3 md:grid-cols-2">{visible.map((item)=>{const tracker=trackerFor(item.slug,item.kind);return <div key={`${item.slug}-${item.kind}`} className="rounded-2xl p-5 transition hover:-translate-y-0.5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="flex items-start justify-between gap-4"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--signal)' }}>{item.label}</div><div className="mt-2 text-lg font-semibold">{item.name}</div></div><span className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-faint)' }}>{item.kind}</span></div><p className="mt-3 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{item.detail}</p><div className="mt-4 flex flex-wrap items-center gap-2"><Link href={`${prefix}/${item.slug}/`} className="text-xs font-semibold" style={{ color:'var(--accent)' }}>{en?'Project context →':'프로젝트 맥락 →'}</Link>{tracker?<a href={tracker.url} target="_blank" rel="noreferrer" className="rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold" style={{ border:'1px solid var(--accent)', color:'var(--accent)' }}>Tracked · {tracker.label} · {tracker.source} ↗</a>:<span className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-faint)' }}>{en?'Untracked':'Untracked'}</span>}</div></div>})}</div>}
  </section>;
}
