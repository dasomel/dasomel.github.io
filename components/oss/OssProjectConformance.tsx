import { evidencePresent, getOssRepoAudit } from '@/lib/oss-repo-audit';
import { getOssRepoMeta } from '@/lib/oss-repo-meta';

type Props = { slug:string; repo:string; docsCount:number; locale:'ko'|'en' };
type Tracker = { label:string; url:string };
type Item = { key:string; label:string; present:boolean; tracker?:Tracker; note?:string };

const releaseTrackers:Record<string,Tracker> = {
  narwhal:{ label:'Narwhal #161', url:'https://github.com/dasomel/narwhal/issues/161' },
  'kube-ready-box':{ label:'kube-ready-box #28', url:'https://github.com/dasomel/kube-ready-box/issues/28' },
  'nfs-quota-agent':{ label:'NFS Quota Agent #16', url:'https://github.com/dasomel/nfs-quota-agent/issues/16' },
  ldapium:{ label:'ldapium #36', url:'https://github.com/dasomel/ldapium/issues/36' },
  beluga:{ label:'Beluga #100', url:'https://github.com/dasomel/beluga/issues/100' },
  kubemetal:{ label:'KubeMetal #35', url:'https://github.com/dasomel/kubemetal/issues/35' },
};
const communityTrackers:Record<string,Tracker> = {
  narwhal:{ label:'Narwhal #169', url:'https://github.com/dasomel/narwhal/issues/169' },
  'nfs-quota-agent':{ label:'NFS Quota Agent #81', url:'https://github.com/dasomel/nfs-quota-agent/issues/81' },
};
const engineeringBaseline:Tracker={ label:'Narwhal #162', url:'https://github.com/dasomel/narwhal/issues/162' };
const communityBaseline:Tracker={ label:'Narwhal #169', url:'https://github.com/dasomel/narwhal/issues/169' };

function repoFromGithubUrl(value:string) {
  const match=value.match(/^https:\/\/github\.com\/([^/]+\/[^/#?]+)\/?$/);
  return match?.[1]??value;
}

export function OssProjectConformance({ slug, repo, docsCount, locale }:Props) {
  const en=locale==='en';
  const repository=repoFromGithubUrl(repo);
  const audit=getOssRepoAudit(repository);
  const evidence=audit?.evidence;
  const meta=getOssRepoMeta(repository);
  const released=(meta?.releaseCount??0)>0;
  const community=(meta?.contributorCount??0)>1;
  const items:Item[]=[
    { key:'license', label:'LICENSE', present:evidencePresent(evidence?.license), tracker:engineeringBaseline },
    { key:'contributing', label:'CONTRIBUTING', present:evidencePresent(evidence?.contributing), tracker:engineeringBaseline },
    { key:'code-of-conduct', label:'CODE_OF_CONDUCT', present:evidencePresent(evidence?.codeOfConduct), tracker:engineeringBaseline },
    { key:'security', label:'SECURITY.md', present:evidencePresent(evidence?.security), tracker:engineeringBaseline },
    { key:'sbom', label:'SBOM evidence', present:evidencePresent(evidence?.sbom), tracker:engineeringBaseline },
    { key:'provenance', label:'Provenance / attestation', present:evidencePresent(evidence?.provenance), tracker:engineeringBaseline },
    { key:'release', label:'GitHub Release', present:released, tracker:releaseTrackers[slug]??engineeringBaseline },
    { key:'docs', label:en?'Project detail docs':'프로젝트 상세 Docs', present:docsCount>0, tracker:engineeringBaseline, note:docsCount>0?`${docsCount} sections`:undefined },
    { key:'community', label:en?'Community contributor signal':'Community contributor 신호', present:community, tracker:communityTrackers[slug]??communityBaseline, note:community?`${meta?.contributorCount??0} contributors`:(en?'1 or fewer contributors reported':'contributor 1명 이하 집계') },
  ];
  const presentCount=items.filter((item)=>item.present).length;
  const missingCount=items.length-presentCount;

  return <section className="mb-10 rounded-2xl p-6 sm:p-7" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>PROJECT CONFORMANCE</div><h3 className="mt-2 text-2xl font-semibold">{en?'Repository evidence checklist':'저장소 evidence 체크리스트'}</h3></div><div className="font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{presentCount} present · {missingCount} missing</div></div>
    <p className="mt-3 max-w-3xl text-sm leading-6" style={{ color:'var(--text-muted)' }}>{en?'Present means an explicit repository or site artifact was observed. Missing means this audit did not observe that artifact; it does not prove the underlying practice does not exist. Tracked links point to the closest existing backlog owner and do not create issues automatically.':'Present는 저장소 또는 사이트에서 명시적 artifact가 관찰됐다는 뜻입니다. Missing은 audit에서 해당 artifact를 찾지 못했다는 뜻이며 실제 practice가 없다는 증거는 아닙니다. Tracked는 가장 가까운 기존 backlog owner를 가리키며 이슈를 자동 생성하지 않습니다.'}</p>
    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{items.map((item)=>{const tracker=!item.present?item.tracker:undefined;return <div key={item.key} className="rounded-xl p-4" style={{ border:'1px solid var(--border)', backgroundColor:'var(--bg-subtle)' }}><div className="flex items-start justify-between gap-3"><div className="font-semibold">{item.label}</div><span className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:`1px solid ${item.present?'var(--accent)':'var(--border)'}`, color:item.present?'var(--accent)':'var(--text-muted)' }}>{item.present?'Present':'Missing'}</span></div>{item.note&&<div className="mt-2 text-xs" style={{ color:'var(--text-faint)' }}>{item.note}</div>}<div className="mt-3 min-h-6">{tracker?<a href={tracker.url} target="_blank" rel="noreferrer" className="text-xs font-semibold" style={{ color:'var(--signal)' }}>Tracked · {tracker.label} ↗</a>:<span className="text-xs" style={{ color:'var(--text-faint)' }}>{en?'Evidence observed':'Evidence 확인됨'}</span>}</div></div>})}</div>
    <div className="mt-4 font-mono text-[9px]" style={{ color:'var(--text-faint)' }}>{audit?`audit · ${repository}@${audit.defaultBranch}`:(en?'repository audit not indexed':'repository audit 미인덱싱')}</div>
  </section>;
}
