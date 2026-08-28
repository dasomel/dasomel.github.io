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

type Props = { locale:'ko'|'en'; docs:Array<{ name:string; docs:number }> };
type Signal = { slug:string; name:string; kind:'release'|'activity'|'contributors'|'docs'; label:string; detail:string };

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
  const prefix=en?'/oss/en':'/oss';

  return <section className="mt-12">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--signal)' }}>ATTENTION / NEXT ACTION</div><h2 className="mt-3 text-3xl font-semibold">{en?'Turn observable gaps into the next maintenance queue.':'관찰 가능한 gap을 다음 유지보수 후보로 바꿉니다.'}</h2></div><div className="font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{visible.length}/{signals.length} {en?'signals shown':'signals 표시'} · {OSS_REPO_SNAPSHOT.generatedAt.slice(0,10)}</div></div>
    <p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>{en?'These are factual maintenance signals derived from repository and documentation snapshots, not severity scores. A signal is an invitation to review context, not an automatic requirement to change the project.':'저장소·문서 snapshot에서 바로 확인되는 사실 기반 유지보수 신호입니다. 심각도 점수가 아니며, 표시됐다고 반드시 수정해야 한다는 뜻도 아닙니다.'}</p>
    {visible.length===0 ? <div className="mt-6 rounded-2xl p-6 text-sm" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)', color:'var(--text-muted)' }}>{en?'No attention signals matched the current rules.':'현재 규칙에 해당하는 attention signal이 없습니다.'}</div> : <div className="mt-6 grid gap-3 md:grid-cols-2">{visible.map((item)=><Link key={`${item.slug}-${item.kind}`} href={`${prefix}/${item.slug}/`} className="rounded-2xl p-5 transition hover:-translate-y-0.5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="flex items-start justify-between gap-4"><div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color:'var(--signal)' }}>{item.label}</div><div className="mt-2 text-lg font-semibold">{item.name}</div></div><span className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-faint)' }}>{item.kind}</span></div><p className="mt-3 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{item.detail}</p><div className="mt-4 text-xs font-semibold" style={{ color:'var(--accent)' }}>{en?'Review project context →':'프로젝트 맥락 확인 →'}</div></Link>)}</div>}
  </section>;
}
