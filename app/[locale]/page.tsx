import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { routing } from '@/i18n/routing';
import { getNotes, getProjects } from '@/lib/content';
import { EngineeringLabMap } from '@/components/visual/EngineeringLabMap';
import { PortfolioPulse } from '@/components/visual/PortfolioPulse';

export function generateStaticParams(){return routing.locales.map(locale=>({locale}))}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const{locale}=await params;const lang=locale as 'ko'|'en';const description=lang==='en'?'A living engineering observatory for Cloud Native, platform engineering and open source systems.':'Cloud Native, Platform Engineering, OSS 시스템의 변화와 검증 근거를 함께 보여주는 Open Engineering Observatory.';return{title:'dasomel — Open Engineering Lab',description,alternates:{canonical:`https://cne.io.kr/${lang}`,languages:{ko:'https://cne.io.kr/ko',en:'https://cne.io.kr/en'}}}}

const featured=[{slug:'narwhal',label:'PLATFORM ENGINEERING',fallback:'Kubernetes Internal Developer Platform · GitOps · SSO · Service Mesh · Observability'},{slug:'beluga',label:'DATA PLATFORM',fallback:'CDC → Kafka → Flink → Iceberg → Trino → Superset on Kubernetes'},{slug:'kubemetal',label:'AI / EDGE',fallback:'Apple Silicon local MLOps · K3s control plane + macOS GPU workloads'}]as const;

export default async function HomePage({params}:{params:Promise<{locale:string}>}){
  const{locale}=await params;const lang=locale as 'ko'|'en';const base=lang==='en'?'/en':'/ko';const projects=getProjects(lang),notes=getNotes(lang).slice(0,4);
  const selected=featured.map(item=>{const p=projects.find(x=>x.slug===item.slug);return{...item,title:p?.title??item.slug,description:p?.description||p?.problem||item.fallback}});
  const copy=lang==='en'?{
    kicker:'OPEN ENGINEERING LAB',
    title:<>I build systems.<br/>Then I keep watching them.</>,
    lead:'Architecture is only the starting point. The lab follows how systems evolve through commits, releases, regressions, incidents and the knowledge produced by operating them.',
    map:'Live system observatory',work:'Systems under observation',knowledge:'Knowledge with provenance',story:'How the judgement evolved'
  }:{
    kicker:'OPEN ENGINEERING LAB',
    title:<>시스템을 만들고,<br/>계속 관찰하며 발전시킵니다.</>,
    lead:'아키텍처는 시작점일 뿐입니다. Commit, Release, Regression, Incident와 운영 과정에서 나온 지식까지 연결해 시스템이 어떻게 발전하는지 보여줍니다.',
    map:'Live System Observatory',work:'관찰 중인 시스템',knowledge:'출처가 있는 지식',story:'판단 기준이 어떻게 변해왔는가'
  };
  return <main>
    <section className="border-b" style={{borderColor:'var(--border)'}}>
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 sm:px-8 sm:py-18 lg:grid-cols-[.88fr_1.12fr] lg:px-16 lg:py-24">
        <div className="self-center">
          <div className="font-mono text-xs font-semibold tracking-[0.14em]" style={{color:'var(--accent)'}}>{copy.kicker}</div>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl lg:text-[4.35rem] lg:leading-[1.02]" style={{color:'var(--text)'}}>{copy.title}</h1>
          <p className="mt-7 max-w-2xl text-base leading-8 sm:text-lg" style={{color:'var(--text-muted)'}}>{copy.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href={`${base}/projects`} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold" style={{borderColor:'var(--accent)',color:'var(--accent)',background:'var(--accent-dim)'}}>Explore Work <ArrowUpRight className="h-4 w-4"/></Link><Link href={`${base}/knowledge`} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{borderColor:'var(--border)',color:'var(--text-muted)'}}>Browse Knowledge</Link></div>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between"><div className="font-mono text-[10px] font-semibold tracking-[0.13em]" style={{color:'var(--signal)'}}>{copy.map.toUpperCase()}</div><ArrowDownRight className="h-4 w-4" style={{color:'var(--text-faint)'}}/></div>
          <div className="rounded-[28px] border p-3 sm:p-4" style={{borderColor:'var(--border)',background:'linear-gradient(145deg,var(--surface),var(--surface-hi))'}}><EngineeringLabMap base={base}/></div>
        </div>
      </div>
    </section>

    <PortfolioPulse lang={lang}/>

    <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-18 lg:px-16">
      <div className="grid gap-10 lg:grid-cols-[.62fr_1.38fr]">
        <div><div className="font-mono text-[10px] font-semibold tracking-[0.13em]" style={{color:'var(--accent)'}}>SYSTEM RECORDS</div><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl" style={{color:'var(--text)'}}>{copy.work}</h2><p className="mt-4 text-sm leading-6" style={{color:'var(--text-muted)'}}>{lang==='en'?'Open a system to inspect problem, architecture, engineering decisions, development pulse, proof and lessons.':'각 시스템에서 문제, 아키텍처, 주요 결정, Development Pulse, 검증 근거와 교훈을 함께 볼 수 있습니다.'}</p><Link href={`${base}/projects`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold" style={{color:'var(--accent)'}}>All systems <ArrowUpRight className="h-4 w-4"/></Link></div>
        <div className="divide-y" style={{borderColor:'var(--border)'}}>{selected.map((p,i)=><Link key={p.slug} href={`${base}/projects/${p.slug}`} className="group grid gap-3 py-7 first:pt-0 lg:grid-cols-[150px_1fr_1.2fr_auto] lg:items-start" style={{borderColor:'var(--border)'}}><div className="font-mono text-[10px] tracking-[0.1em]" style={{color:i===2?'var(--signal)':'var(--accent)'}}>{p.label}</div><div className="text-2xl font-semibold tracking-[-0.03em] group-hover:text-[var(--accent)]" style={{color:'var(--text)'}}>{p.title}</div><p className="text-sm leading-6" style={{color:'var(--text-muted)'}}>{p.description}</p><ArrowUpRight className="hidden h-4 w-4 lg:block" style={{color:'var(--text-faint)'}}/></Link>)}</div>
      </div>
    </section>

    <section className="border-y" style={{borderColor:'var(--border)',backgroundColor:'var(--surface-hi)'}}><div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-16"><div className="grid gap-10 lg:grid-cols-[.62fr_1.38fr]"><div><div className="font-mono text-[10px] font-semibold tracking-[0.13em]" style={{color:'var(--signal)'}}>KNOWLEDGE PROVENANCE</div><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]" style={{color:'var(--text)'}}>{copy.knowledge}</h2><p className="mt-4 text-sm leading-6" style={{color:'var(--text-muted)'}}>{lang==='en'?'A note matters more when the system, decision or failure that produced it remains visible.':'노트 자체보다 어떤 시스템·결정·실패에서 나온 지식인지가 보이도록 연결합니다.'}</p><Link href={`${base}/knowledge`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold" style={{color:'var(--accent)'}}>Open Knowledge <ArrowUpRight className="h-4 w-4"/></Link></div><div className="divide-y" style={{borderColor:'var(--border)'}}>{notes.map(n=><Link key={n.slug} href={`${base}/posts/${n.slug}`} className="group grid gap-2 py-5 first:pt-0 md:grid-cols-[160px_1fr]" style={{borderColor:'var(--border)'}}><div className="font-mono text-[9px] uppercase tracking-[0.08em]" style={{color:'var(--text-faint)'}}>{n.projects?.length?n.projects.join(' · '):'WORKBENCH / UNLINKED'}</div><div><div className="text-lg font-semibold group-hover:text-[var(--accent)]" style={{color:'var(--text)'}}>{n.title}</div>{n.description&&<p className="mt-2 line-clamp-2 text-sm leading-6" style={{color:'var(--text-muted)'}}>{n.description}</p>}</div></Link>)}</div></div></div></section>

    <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-16"><div className="font-mono text-[10px] font-semibold tracking-[0.13em]" style={{color:'var(--signal)'}}>STORY</div><Link href={`${base}/oss/story`} className="group mt-3 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end"><div><h2 className="text-3xl font-semibold tracking-[-0.04em] group-hover:text-[var(--accent)] sm:text-4xl" style={{color:'var(--text)'}}>{copy.story}</h2><p className="mt-3 max-w-3xl text-sm leading-6" style={{color:'var(--text-muted)'}}>{lang==='en'?'Framework → DevOps → Cloud Native → Platform → OSS → AI-assisted engineering. The tools changed; the operating principles became clearer.':'Framework → DevOps → Cloud Native → Platform → OSS → AI-assisted engineering. 기술은 바뀌었지만, 운영 원칙은 더 명확해졌습니다.'}</p></div><ArrowUpRight className="h-6 w-6" style={{color:'var(--accent)'}}/></Link></section>
  </main>;
}
