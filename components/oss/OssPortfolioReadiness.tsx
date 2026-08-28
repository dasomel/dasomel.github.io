import Link from 'next/link';
import { getOssRepoMeta } from '@/lib/oss-repo-meta';

type Props = { locale:'ko'|'en'; docs:Array<{ name:string; docs:number }> };
type ReadinessState = 'observed'|'partial'|'not-indexed';

type Row = {
  slug:string;
  repo:string;
  name:string;
  governance:ReadinessState;
  security:ReadinessState;
  audit:string;
};

const rows:Row[] = [
  { slug:'narwhal', repo:'dasomel/narwhal', name:'Narwhal', governance:'partial', security:'observed', audit:'Narwhal #162' },
  { slug:'narwhal-portal', repo:'dasomel/narwhal-portal', name:'Narwhal Portal', governance:'not-indexed', security:'not-indexed', audit:'—' },
  { slug:'nfs-quota-agent', repo:'dasomel/nfs-quota-agent', name:'NFS Quota Agent', governance:'partial', security:'partial', audit:'Narwhal #162' },
  { slug:'ldapium', repo:'dasomel/ldapium', name:'ldapium', governance:'observed', security:'observed', audit:'Narwhal #162' },
  { slug:'kube-ready-box', repo:'dasomel/kube-ready-box', name:'Kube-Ready-Box', governance:'partial', security:'partial', audit:'Narwhal #162' },
  { slug:'clusterdeck', repo:'dasomel/clusterdeck', name:'ClusterDeck', governance:'not-indexed', security:'not-indexed', audit:'—' },
  { slug:'beluga', repo:'dasomel/beluga', name:'Beluga', governance:'partial', security:'partial', audit:'Narwhal #162' },
  { slug:'beluga-manager', repo:'dasomel/beluga-manager', name:'Beluga Manager', governance:'not-indexed', security:'not-indexed', audit:'—' },
  { slug:'kubemetal', repo:'dasomel/kubemetal', name:'KubeMetal', governance:'partial', security:'partial', audit:'Narwhal #162' },
  { slug:'openforge', repo:'dasomel/openforge', name:'OpenForge', governance:'not-indexed', security:'not-indexed', audit:'—' },
];

function label(state:ReadinessState, en:boolean) {
  if (state==='observed') return en?'Observed':'확인됨';
  if (state==='partial') return en?'Partial':'부분 확인';
  return en?'Not indexed':'미인덱싱';
}

function Badge({ state, en }:{ state:ReadinessState; en:boolean }) {
  const strong=state==='observed';
  return <span className="inline-flex rounded-full px-2.5 py-1 text-[11px]" style={{ border:`1px solid ${strong?'var(--accent)':'var(--border)'}`, color:strong?'var(--accent)':'var(--text-muted)' }}>{label(state,en)}</span>;
}

export function OssPortfolioReadiness({ locale, docs }:Props) {
  const en=locale==='en';
  const prefix=en?'/oss/en':'/oss';
  const docsBySlug=new Map(docs.map((item)=>[item.name,item.docs]));

  return <section className="mt-16">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>PORTFOLIO READINESS</div>
        <h2 className="mt-3 text-3xl font-semibold">{en?'Compare public-OSS readiness without inventing a composite score.':'합성 점수를 만들지 않고 공개 OSS readiness 신호를 비교합니다.'}</h2>
      </div>
      <a href="https://github.com/dasomel/narwhal/issues/162" target="_blank" rel="noreferrer" className="rounded-full px-3 py-1.5 font-mono text-[10px]" style={{ border:'1px solid var(--border)', color:'var(--text-muted)' }}>audit baseline · Narwhal #162 ↗</a>
    </div>
    <p className="mt-3 max-w-4xl text-sm leading-7" style={{ color:'var(--text-muted)' }}>{en?'Release and community columns are derived from the build-time GitHub snapshot, docs from the site index, and governance/security only from evidence already recorded in the portfolio engineering audit. “Not indexed” means this view does not currently have enough explicit evidence; it is not a negative judgment.':'Release·Community는 빌드 시점 GitHub snapshot, Docs는 사이트 index, Governance·Security는 portfolio engineering audit에 이미 기록된 근거만 사용합니다. “미인덱싱”은 이 화면에 명시적 근거가 충분하지 않다는 뜻이며 부정적 평가가 아닙니다.'}</p>

    <div className="mt-6 overflow-x-auto rounded-2xl" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}>
      <table className="w-full min-w-[1060px] border-collapse text-left text-sm">
        <thead><tr style={{ borderBottom:'1px solid var(--border)', backgroundColor:'var(--bg-subtle)' }}>{['Project','Governance','Release','Docs','Security','Community','Adoption evidence'].map((h)=><th key={h} className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color:'var(--text-faint)' }}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row)=>{
          const meta=getOssRepoMeta(row.repo);
          const release=(meta?.releaseCount??0)>0;
          const docsCount=docsBySlug.get(row.slug)??0;
          const community=(meta?.contributorCount??0)>1;
          return <tr key={row.slug} style={{ borderBottom:'1px solid var(--border)' }}>
            <td className="px-5 py-4"><Link href={`${prefix}/${row.slug}/`} className="font-semibold hover:underline">{row.name} →</Link><div className="mt-1 font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{row.audit}</div></td>
            <td className="px-5 py-4"><Badge state={row.governance} en={en}/></td>
            <td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:`1px solid ${release?'var(--accent)':'var(--border)'}`, color:release?'var(--accent)':'var(--text-muted)' }}>{release?(en?'Observed':'확인됨'):(en?'No GitHub release':'GitHub Release 없음')}</span></td>
            <td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:`1px solid ${docsCount>0?'var(--accent)':'var(--border)'}`, color:docsCount>0?'var(--accent)':'var(--text-muted)' }}>{docsCount>0?`${docsCount} docs`:(en?'Not indexed':'미인덱싱')}</span></td>
            <td className="px-5 py-4"><Badge state={row.security} en={en}/></td>
            <td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:`1px solid ${community?'var(--accent)':'var(--border)'}`, color:community?'var(--accent)':'var(--text-muted)' }}>{community?(en?'2+ contributors':'2+ contributors'):(en?'Single-contributor signal':'단일 contributor 신호')}</span></td>
            <td className="px-5 py-4"><span className="rounded-full px-2.5 py-1 text-[11px]" style={{ border:'1px solid var(--border)', color:'var(--text-muted)' }}>{en?'Not indexed':'미인덱싱'}</span></td>
          </tr>;
        })}</tbody>
      </table>
    </div>
    <p className="mt-3 text-xs leading-5" style={{ color:'var(--text-faint)' }}>{en?'Adoption is intentionally conservative: stars, forks, or contributor counts are not treated as deployment/adoption proof. This column stays “Not indexed” until an explicit external use case, user report, or equivalent evidence is recorded.':'Adoption은 의도적으로 보수적으로 다룹니다. star·fork·contributor 수를 실제 deployment/adoption 증거로 간주하지 않으며, 외부 사용 사례·사용자 보고 등 명시적 근거가 기록되기 전까지 “미인덱싱”으로 유지합니다.'}</p>
  </section>;
}
