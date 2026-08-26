import Link from 'next/link';
import data from '../../src/data/project-repo-meta.json';

type RepoMeta={firstCommitAt?:string;createdAt?:string;commitCount?:number;releaseCount?:number;pushedAt?:string;activity?:{week:number;total:number}[]};
const metadata=data as Record<string,RepoMeta>;
const rows=[
  ['openforge','dasomel/openforge','STANDARDS'],
  ['kube-ready-box','dasomel/kube-ready-box','BASELINE'],
  ['narwhal','dasomel/narwhal','PLATFORM'],
  ['ldapium','dasomel/ldapium','IDENTITY'],
  ['nfs-quota-agent','dasomel/nfs-quota-agent','STORAGE'],
  ['beluga','dasomel/beluga','DATA'],
  ['kubemetal','dasomel/kubemetal','AI / EDGE'],
] as const;

function ym(v?:string){if(!v)return'—';const d=new Date(v);return`${d.getUTCFullYear()}.${String(d.getUTCMonth()+1).padStart(2,'0')}`}

export function SystemActivityIndex({base,lang,titles}:{base:string;lang:'ko'|'en';titles:Record<string,string>}){
  return <div className="overflow-x-auto">
    <div className="min-w-[860px]">
      <div className="grid grid-cols-[1.3fr_.8fr_.7fr_.65fr_.65fr_1fr] gap-4 border-b pb-3 font-mono text-[9px] uppercase tracking-[0.1em]" style={{borderColor:'var(--border)',color:'var(--text-faint)'}}>
        <div>{lang==='ko'?'시스템':'System'}</div><div>{lang==='ko'?'역할':'Role'}</div><div>Started</div><div>Commits</div><div>Releases</div><div>Activity</div>
      </div>
      {rows.map(([slug,repo,role])=>{const m=metadata[repo];const pts=(m?.activity??[]).slice(-8);const max=Math.max(...pts.map(x=>x.total),1);return <Link key={slug} href={`${base}/projects/${slug}`} className="group grid grid-cols-[1.3fr_.8fr_.7fr_.65fr_.65fr_1fr] gap-4 border-b py-5" style={{borderColor:'var(--border)'}}>
        <div className="text-xl font-semibold group-hover:text-[var(--accent)]" style={{color:'var(--text)'}}>{titles[slug]||slug}</div>
        <div className="font-mono text-[10px]" style={{color:'var(--accent)'}}>{role}</div>
        <div className="font-mono text-xs" style={{color:'var(--text-muted)'}}>{ym(m?.firstCommitAt||m?.createdAt)}</div>
        <div className="font-mono text-xs" style={{color:'var(--text)'}}>{m?.commitCount?.toLocaleString()??'—'}</div>
        <div className="font-mono text-xs" style={{color:'var(--text)'}}>{m?.releaseCount?.toLocaleString()??'—'}</div>
        <div className="flex h-7 items-end gap-1">{pts.length?pts.map((p,i)=><span key={`${p.week}-${i}`} className="w-3 rounded-t-sm" style={{height:`${Math.max(5,Math.round((p.total/max)*100))}%`,backgroundColor:i>=pts.length-2?'var(--accent)':'var(--border-strong)',opacity:i>=pts.length-2?.95:.55}}/>):<span className="font-mono text-[10px]" style={{color:'var(--text-faint)'}}>—</span>}</div>
      </Link>})}
    </div>
  </div>
}
