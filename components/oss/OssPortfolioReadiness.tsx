import Link from 'next/link';
import { getOssRepoMeta } from '@/lib/oss-repo-meta';
import { evidencePresent, getOssRepoAudit, type OssRepoAuditEvidence } from '@/lib/oss-repo-audit';

type Props = { locale:'ko'|'en'; docs:Array<{ name:string; docs:number }> };
type ReadinessState = 'observed'|'partial'|'not-indexed';
type GapKind = 'license'|'contributing'|'security'|'sbom'|'provenance'|'release'|'docs'|'community';
type Row = { slug:string; repo:string; name:string };
type Tracker = { label:string; url:string };
type Gap = { slug:string; name:string; kind:GapKind; label:string; detail:string; tracker?:Tracker };

const rows:Row[] = [
  { slug:'narwhal', repo:'dasomel/narwhal', name:'Narwhal' },
  { slug:'narwhal-portal', repo:'dasomel/narwhal-portal', name:'Narwhal Portal' },
  { slug:'nfs-quota-agent', repo:'dasomel/nfs-quota-agent', name:'NFS Quota Agent' },
  { slug:'ldapium', repo:'dasomel/ldapium', name:'ldapium' },
  { slug:'kube-ready-box', repo:'dasomel/kube-ready-box', name:'Kube-Ready-Box' },
  { slug:'clusterdeck', repo:'dasomel/clusterdeck', name:'ClusterDeck' },
  { slug:'beluga', repo:'dasomel/beluga', name:'Beluga' },
  { slug:'beluga-manager', repo:'dasomel/beluga-manager', name:'Beluga Manager' },
  { slug:'kubemetal', repo:'dasomel/kubemetal', name:'KubeMetal' },
  { slug:'openforge', repo:'dasomel/openforge', name:'OpenForge' },
];

const trackers:Partial<Record<`${string}:${GapKind}`,Tracker>> = {
  'narwhal:release': { label:'Narwhal #161', url:'https://github.com/dasomel/narwhal/issues/161' },
  'kube-ready-box:release': { label:'kube-ready-box #28', url:'https://github.com/dasomel/kube-ready-box/issues/28' },
  'nfs-quota-agent:release': { label:'nfs-quota-agent #16', url:'https://github.com/dasomel/nfs-quota-agent/issues/16' },
  'ldapium:release': { label:'ldapium #36', url:'https://github.com/dasomel/ldapium/issues/36' },
  'beluga:release': { label:'Beluga #100', url:'https://github.com/dasomel/beluga/issues/100' },
  'kubemetal:release': { label:'KubeMetal #35', url:'https://github.com/dasomel/kubemetal/issues/35' },
  'narwhal:community': { label:'Narwhal #169', url:'https://github.com/dasomel/narwhal/issues/169' },
  'nfs-quota-agent:community': { label:'NFS Quota Agent #81', url:'https://github.com/dasomel/nfs-quota-agent/issues/81' },
};

const canonicalOwner:Record<GapKind,Tracker> = {
  license: { label:'Narwhal #162 · engineering conformance', url:'https://github.com/dasomel/narwhal/issues/162' },
  contributing: { label:'Narwhal #169 · community growth', url:'https://github.com/dasomel/narwhal/issues/169' },
  security: { label:'Narwhal #162 · engineering conformance', url:'https://github.com/dasomel/narwhal/issues/162' },
  sbom: { label:'Narwhal #162 · engineering conformance', url:'https://github.com/dasomel/narwhal/issues/162' },
  provenance: { label:'Narwhal #162 · engineering conformance', url:'https://github.com/dasomel/narwhal/issues/162' },
  release: { label:'Narwhal #162 · engineering conformance', url:'https://github.com/dasomel/narwhal/issues/162' },
  docs: { label:'Narwhal #162 · documentation evidence', url:'https://github.com/dasomel/narwhal/issues/162' },
  community: { label:'Narwhal #169 · community growth', url:'https://github.com/dasomel/narwhal/issues/169' },
};

function trackerFor(slug:string, kind:GapKind) {
  return trackers[`${slug}:${kind}`] ?? canonicalOwner[kind];
}

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

  for (const row of rows) {
    const meta=getOssRepoMeta(row.repo);
    const audit=getOssRepoAudit(row.repo);
    const evidence=audit?.evidence;
    const docsCount=docsBySlug.get(row.slug)??0;
    if (!evidencePresent(evidence?.license)) gaps.push({ slug:row.slug,name:row.name,kind:'license',label:en?'LICENSE evidence missing':'LICENSE 근거 없음',detail:en?'No root/.github LICENSE evidence was observed by the repository audit.':'repository audit에서 root/.github LICENSE 근거를 확인하지 못했습니다.',tracker:trackerFor(row.slug,'license') });
    if (!evidencePresent(evidence?.contributing)) gaps.push({ slug:row.slug,name:row.name,kind:'contributing',label:en?'CONTRIBUTING evidence missing':'CONTRIBUTING 근거 없음',detail:en?'No root/.github CONTRIBUTING evidence was observed.':'root/.github CONTRIBUTING 근거를 확인하지 못했습니다.',tracker:trackerFor(row.slug,'contributing') });
    if (!evidencePresent(evidence?.security)) gaps.push({ slug:row.slug,name:row.name,kind:'security',label:en?'SECURITY policy evidence missing':'SECURITY 정책 근거 없음',detail:en?'No root/.github SECURITY evidence was observed.':'root/.github SECURITY 근거를 확인하지 못했습니다.',tracker:trackerFor(row.slug,'security') });
    if (!evidencePresent(evidence?.sbom)) gaps.push({ slug:row.slug,name:row.name,kind:'sbom',label:en?'SBOM evidence missing':'SBOM 근거 없음',detail:en?'No SBOM/SPDX/CycloneDX evidence path was observed in the repository tree.':'repository tree에서 SBOM/SPDX/CycloneDX 근거 경로를 확인하지 못했습니다.',tracker:trackerFor(row.slug,'sbom') });
    if (!evidencePresent(evidence?.provenance)) gaps.push({ slug:row.slug,name:row.name,kind:'provenance',label:en?'Provenance evidence missing':'Provenance 근거 없음',detail:en?'No provenance/attestation/SLSA/cosign evidence path was observed.':'provenance/attestation/SLSA/cosign 근거 경로를 확인하지 못했습니다.',tracker:trackerFor(row.slug,'provenance') });
    if ((meta?.releaseCount??0)===0) gaps.push({ slug:row.slug,name:row.name,kind:'release',label:en?'No GitHub release':'GitHub Release 없음',detail:en?'The build-time GitHub snapshot reports zero releases.':'build-time GitHub snapshot 기준 release가 0개입니다.',tracker:trackerFor(row.slug,'release') });
    if (docsCount===0) gaps.push({ slug:row.slug,name:row.name,kind:'docs',label:en?'No indexed project docs':'프로젝트 문서 미인덱싱',detail:en?'No project detail documentation section is indexed on the OSS site.':'OSS 사이트에 프로젝트 상세 문서 section이 인덱싱되지 않았습니다.',tracker:trackerFor(row.slug,'docs') });
    if ((meta?.contributorCount??0)<=1) gaps.push({ slug:row.slug,name:row.name,kind:'community',label:en?'Single-contributor signal':'단일 contributor 신호',detail:en?'GitHub reports one or fewer contributors; this is an operating signal, not proof of no outside participation.':'GitHub contributor 집계가 1명 이하입니다. 외부 참여가 없다는 증거가 아니라 운영 신호입니다.',tracker:trackerFor(row.slug,'community') });
  }

  const gapPriority:Record<GapKind,number>={ security:0, sbom:1, provenance:2, contributing:3, license:4, release:5, docs:6, community:7 };
  gaps.sort((a,b)=>gapPriority[a.kind]-gapPriority[b.kind]||a.name.localeCompare(b.name));
  const visibleGaps=gaps.slice(0,10);
  const groupCounts=(Object.keys(gapPriority) as GapKind[]).map((kind)=>({kind,count:gaps.filter((gap)=>gap.kind===kind).length})).filter((item)=>item.count>0);

  return <section className="mt-16">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>PORTFOLIO READINESS</div>
        <h2 className="mt-3 text-3xl font-semibold">{en?'Compare public-OSS readiness without inventing a composite score.':'합성 점수를 만들지 않고 공개 OSS readiness 신호를 비교합니다.'}</h2>
      </div>
      <a href="https://github.com/dasomel/narwhal/issues/162" target="_blank" rel="noreferrer" className="rounded-full px-3 py-1.5 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-muted)' }}>engineering baseline · Narwhal #162 ↗</a>
    </div>
    <p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>{en?'Governance and security now come from a build-time repository tree audit: LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, SBOM and provenance/attestation paths are observed directly. Release and community come from the GitHub snapshot, and docs from the site index. File presence is evidence availability, not proof that a policy or control is effective.':'Governance·Security는 이제 빌드 시 repository tree audit에서 LICENSE·CONTRIBUTING·CODE_OF_CONDUCT·SECURITY·SBOM·provenance/attestation 경로를 직접 확인합니다. Release·Community는 GitHub snapshot, Docs는 사이트 index를 사용합니다. 파일 존재는 근거의 존재를 뜻할 뿐 정책이나 통제가 효과적이라는 보장은 아닙니다.'}</p>

    <div className="mt-6 overflow-x-auto rounded-2xl" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}>
      <table className="w-full min-w-[1160px] border-collapse text-left text-sm">
        <thead><tr style={{ borderBottom:'1px solid var(--border)', backgroundColor:'var(--bg-subtle)' }}>{['Project','Governance','Release','Docs','Security','Community','Adoption evidence'].map((h)=><th key={h} className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row)=>{
          const meta=getOssRepoMeta(row.repo);
          const audit=getOssRepoAudit(row.repo);
          const evidence=audit?.evidence;
          const release=(meta?.releaseCount??0)>0;
          const docsCount=docsBySlug.get(row.slug)??0;
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
          return <tr key={row.slug} style={{ borderBottom:'1px solid var(--border)' }}>
            <td className="px-5 py-4"><Link href={`${prefix}/${row.slug}/`} className="font-semibold hover:underline">{row.name} →</Link><div className="mt-1 font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{audit?`repo tree · ${audit.defaultBranch}`:(en?'audit not indexed':'audit 미인덱싱')}</div></td>
            <td className="px-5 py-4"><Badge state={governanceState(evidence)} en={en} detail={governanceDetail}/></td>
            <td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:`1px solid ${release?'var(--accent)':'var(--border)'}`, color:release?'var(--accent)':'var(--text-muted)' }}>{release?(en?'Observed':'확인됨'):(en?'No GitHub release':'GitHub Release 없음')}</span>{evidence&&<div className="mt-2 font-mono text-[9px]" style={{ color:'var(--text-faint)' }}>CHANGELOG {evidencePresent(evidence.changelog)?'✓':'—'}</div>}</td>
            <td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:`1px solid ${docsCount>0?'var(--accent)':'var(--border)'}`, color:docsCount>0?'var(--accent)':'var(--text-muted)' }}>{docsCount>0?`${docsCount} docs`:(en?'Not indexed':'미인덱싱')}</span></td>
            <td className="px-5 py-4"><Badge state={securityState(evidence)} en={en} detail={securityDetail}/></td>
            <td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:`1px solid ${community?'var(--accent)':'var(--border)'}`, color:community?'var(--accent)':'var(--text-muted)' }}>{community?'2+ contributors':(en?'Single-contributor signal':'단일 contributor 신호')}</span></td>
            <td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:'1px solid var(--border)', color:'var(--text-muted)' }}>{en?'Not indexed':'미인덱싱'}</span></td>
          </tr>;
        })}</tbody>
      </table>
    </div>

    <div className="mt-10 flex flex-wrap items-end justify-between gap-4"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--signal)' }}>READINESS GAP / NEXT ACTION</div><h3 className="mt-3 text-2xl font-semibold">{en?'Turn missing evidence into a reviewable action queue.':'누락된 evidence를 검토 가능한 action queue로 바꿉니다.'}</h3></div><div className="font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{visibleGaps.length}/{gaps.length} {en?'gaps shown':'gap 표시'}</div></div>
    <p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>{en?'Each item is generated from explicit audit or snapshot absence. Tracker links prefer project-specific issues when already known and otherwise point to the nearest canonical portfolio owner. No issue is created automatically.':'각 항목은 audit 또는 snapshot에서 명시적으로 확인되지 않은 근거로부터 생성됩니다. 이미 알려진 project-specific issue가 있으면 우선 연결하고, 없으면 가장 가까운 portfolio canonical owner를 안내합니다. 이슈는 자동 생성하지 않습니다.'}</p>
    <div className="mt-5 flex flex-wrap gap-2">{groupCounts.map((item)=><span key={item.kind} className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-muted)' }}>{item.kind} · {item.count}</span>)}</div>
    {visibleGaps.length>0&&<div className="mt-5 grid gap-3 md:grid-cols-2">{visibleGaps.map((gap)=><div key={`${gap.slug}-${gap.kind}`} className="rounded-2xl p-5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="flex items-start justify-between gap-4"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--signal)' }}>{gap.label}</div><div className="mt-2 text-lg font-semibold">{gap.name}</div></div><span className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-faint)' }}>{gap.kind}</span></div><p className="mt-3 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{gap.detail}</p><div className="mt-4 flex flex-wrap gap-2"><Link href={`${prefix}/${gap.slug}/`} className="text-xs font-semibold" style={{ color:'var(--accent)' }}>{en?'Project context →':'프로젝트 맥락 →'}</Link>{gap.tracker&&<a href={gap.tracker.url} target="_blank" rel="noreferrer" className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px solid var(--accent)', color:'var(--accent)' }}>{gap.tracker.label} ↗</a>}</div></div>)}</div>}

    <p className="mt-3 text-xs leading-5" style={{ color:'var(--text-faint)' }}>{en?'Audit matching is intentionally conservative: governance policy files are counted only at the repository root or under .github; SBOM and provenance evidence can live elsewhere in the tree. Adoption remains conservative too: stars, forks, or contributor counts are not deployment/adoption proof.':'Audit 매칭은 보수적으로 적용합니다. governance 정책 파일은 저장소 root 또는 .github 아래만 인정하고, SBOM·provenance evidence는 tree 내 다른 위치도 탐색합니다. Adoption 역시 star·fork·contributor 수를 실제 deployment/adoption 증거로 간주하지 않습니다.'}</p>
  </section>;
}
