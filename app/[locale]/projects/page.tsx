import { getTranslations } from 'next-intl/server';
import { getProjects } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { ProjectList } from '@/components/projects/ProjectList';
import { EngineeringLabMap } from '@/components/visual/EngineeringLabMap';
import { SystemActivityIndex } from '@/components/projects/SystemActivityIndex';

export function generateStaticParams(){return routing.locales.map(locale=>({locale}))}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const{locale}=await params;const t=await getTranslations({locale,namespace:'work'});return{title:t('title')}}

export default async function WorkPage({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params; const lang=locale as 'ko'|'en'; const t=await getTranslations({locale,namespace:'work'}); const projects=getProjects(lang); const base=lang==='en'?'/en':'/ko';
  const titles=Object.fromEntries(projects.map(project=>[project.slug,project.title]));
  return <main>
    <section className="border-b" style={{borderColor:'var(--border)'}}><div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-16 lg:py-20"><div className="font-mono text-xs font-semibold tracking-[0.14em]" style={{color:'var(--accent)'}}>WORK / SYSTEM OBSERVATORY</div><h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-[-0.055em] sm:text-6xl" style={{color:'var(--text)'}}>{lang==='en'?<>Browse the architecture.<br/>Judge the evolution.</>:<>아키텍처를 보고,<br/>발전 과정을 함께 봅니다.</>}</h1><p className="mt-6 max-w-4xl text-base leading-8 sm:text-lg" style={{color:'var(--text-muted)'}}>{lang==='en'?'Repositories are grouped by engineering role and read as evolving systems. Start from the architecture, then inspect development pulse, releases, decisions, verification and lessons.':'저장소를 단순 목록으로 보지 않고 engineering role과 시간의 흐름으로 봅니다. 아키텍처에서 시작해 Development Pulse, Release, 의사결정, 검증과 교훈까지 이어집니다.'}</p></div></section>

    <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:px-16">
      <div><div className="font-mono text-[10px] font-semibold tracking-[0.13em]" style={{color:'var(--signal)'}}>SYSTEM OF SYSTEMS</div><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]" style={{color:'var(--text)'}}>{lang==='en'?'Understand the stack first.':'먼저 전체 스택을 이해합니다.'}</h2><p className="mt-4 text-sm leading-6" style={{color:'var(--text-muted)'}}>{lang==='en'?'Standards shape the baseline, the baseline supports the platform, focused capabilities close gaps, and workloads exercise the whole system.':'Standards가 baseline을 만들고, baseline이 platform을 받치며, capability OSS가 빈틈을 채우고, workload가 전체 시스템을 검증합니다.'}</p></div>
      <div className="rounded-[28px] border p-3 sm:p-4" style={{borderColor:'var(--border)',background:'linear-gradient(145deg,var(--surface),var(--surface-hi))'}}><EngineeringLabMap base={base}/></div>
    </section>

    <section className="border-y" style={{borderColor:'var(--border)',backgroundColor:'var(--surface-hi)'}}><div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-16"><div className="mb-7"><div className="font-mono text-[10px] font-semibold tracking-[0.13em]" style={{color:'var(--accent)'}}>DEVELOPMENT PULSE INDEX</div><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]" style={{color:'var(--text)'}}>{lang==='en'?'Systems over time':'시간축으로 보는 시스템'}</h2><p className="mt-3 max-w-3xl text-sm leading-6" style={{color:'var(--text-muted)'}}>{lang==='en'?'Started date, commits, releases and recent activity make ongoing engineering visible without turning the page into a popularity dashboard.':'시작 시점, commit, release와 최근 activity를 함께 보여주되 Star/Fork 중심의 인기 지표 화면으로 만들지는 않습니다.'}</p></div><SystemActivityIndex base={base} lang={lang} titles={titles}/></div></section>

    <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-16"><div className="grid gap-8 lg:grid-cols-[.58fr_1.42fr]"><div><div className="font-mono text-[10px] font-semibold tracking-[0.13em]" style={{color:'var(--signal)'}}>HOW TO READ A SYSTEM</div><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]" style={{color:'var(--text)'}}>Problem → Architecture → Decisions → Pulse → Proof → Lessons</h2></div><p className="text-base leading-8" style={{color:'var(--text-muted)'}}>{lang==='en'?'The same reading order is used across project detail pages so different OSS can be compared by engineering judgement, not by repository size.':'프로젝트 상세는 동일한 읽기 순서를 사용해 저장소 규모가 아니라 engineering judgement와 검증 근거를 비교할 수 있게 합니다.'}</p></div></section>

    <section className="border-t" style={{borderColor:'var(--border)'}}><div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-16"><div className="mb-8"><div className="font-mono text-[10px] font-semibold tracking-[0.13em]" style={{color:'var(--accent)'}}>FULL PROJECT INDEX</div><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]" style={{color:'var(--text)'}}>{lang==='en'?'Search every repository':'전체 저장소 검색'}</h2></div><ProjectList projects={projects} base={base} translations={{problem:t('problem'),solution:t('solution'),search:t('search'),noResults:t('no_results'),results:t('results'),clearFilters:t('clear_filters'),all:t('all'),filter:t('filter'),core:t('core'),tools:t('tools'),forks:t('forks')}}/></div></section>
  </main>
}
