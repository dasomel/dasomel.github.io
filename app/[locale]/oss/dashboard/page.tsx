'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowDownToLine, ArrowRight, GitBranch, LayoutGrid, List, Search } from 'lucide-react';
import raw from '@/src/data/openforge-portfolio.json';
import ProjectDetailsDialog from './ProjectDetailsDialog';

type Project = { id:string; name:string; repository:string; category:string; archetype:string; development_status:string; adoption_percent:number|null; impact_score:number; domains:string[]; maintenance:{blast_radius:string; maintenance_owner:string; strategic_role:string; exit_path_status:string; review_cadence:string} };
type Relation = {source:string; target:string; type:string; impact:string};
const data = raw as unknown as {updated_at:string; portfolio:{standard_maturity_percent:number; standard_metrics:number; adoption_percent:number; adoption_target_percent:number};projects:Project[];relationships:Relation[];maintenance:{summary:{owned_projects:number;high_blast_radius_projects:number;exit_path_review_required:number;review_cadence_default:string}}};
const colors = ['#b98de9','#7bb8f5','#f6be60','#e78fb2','#8bd9bc','#ee7f8c'];
const categoryColors:Record<string,string> = {'Internal Developer Platform':'#b98de9','Hybrid AI':'#7bb8f5','OS & VM Infrastructure':'#f6be60','Storage':'#e78fb2','Identity':'#8bd9bc'};
const dark = 'rounded-xl bg-[#18243d] border border-[#3c4d6d] text-white shadow-sm';
const title = 'text-lg font-semibold leading-snug tracking-tight';
const subdued = 'text-sm leading-relaxed text-[#c0cde3]';
const points:Record<string,[number,number]> = {narwhal:[102,85],'narwhal-portal':[265,54],kubemetal:[446,85],beluga:[98,208],openforge:[262,172],'beluga-manager':[450,208],'kube-ready-box':[207,294],'dasomel-github-io':[350,294]};
const shortName=(s:string)=>s.replace('dasomel-github-io','dasomel.github.io');

// Display labels are localized; source project identifiers and dashboard data stay unchanged.
const dashboardCopy = {
  "ko": {
    "sidebarSubtitle": "OSS 포트폴리오 관리 대시보드",
    "nav": [
      [
        "포트폴리오 개요",
        "#overview"
      ],
      [
        "프로젝트",
        "#projects"
      ],
      [
        "의존 관계",
        "#dependencies"
      ],
      [
        "마일스톤",
        "#governance"
      ],
      [
        "거버넌스",
        "#governance"
      ],
      [
        "유지보수",
        "#governance"
      ],
      [
        "보고서",
        "#reports"
      ]
    ],
    "quickFilters": "빠른 필터",
    "allProjects": "전체 프로젝트",
    "active": "활성",
    "maintenance": "유지보수",
    "highImpact": "고영향도",
    "motto": [
      "함께 만드는",
      "오픈소스",
      "생태계"
    ],
    "searchLabel": "프로젝트와 분류 검색",
    "searchPlaceholder": "프로젝트명이나 분류 검색...",
    "contributor": "기여자",
    "dashboardTitle": "포트폴리오 컨트롤 플레인",
    "dashboardDescription": "OpenForge 생태계의 프로젝트, 의존 관계, 도입 현황, 거버넌스를 한눈에 확인합니다.",
    "lastUpdated": "최종 갱신",
    "exportReport": "보고서 내보내기",
    "kpis": "포트폴리오 주요 지표",
    "totalProjects": "전체 프로젝트",
    "activeCount": "활성",
    "maintenanceCount": "유지보수",
    "standardsMaturity": "표준 성숙도",
    "engineeringMetrics": "엔지니어링 지표",
    "portfolioAdoption": "포트폴리오 도입률",
    "target": "목표",
    "maintenanceCoverage": "유지보수 책임 범위",
    "ownedProjects": "담당 프로젝트",
    "graphTitle": "프로젝트 의존 관계",
    "graphDescription": "생태계 전반의 관계와 영향 범위를 확인합니다.",
    "standards": "표준",
    "consumes": "사용",
    "controlSurface": "제어 인터페이스",
    "sharedContract": "공유 계약",
    "graphAria": "프로젝트 의존 관계도입니다. 프로젝트 노드를 선택하면 상세 정보를 표시합니다.",
    "selectProject": "프로젝트 선택",
    "hideRelations": "전체 관계 닫기",
    "viewRelations": "전체 관계 보기 →",
    "selected": "선택한 프로젝트",
    "impact": "영향도",
    "repository": "저장소 ↗",
    "projectsTitle": "프로젝트 목록",
    "projectsDescription": "프로젝트를 클릭하면 상세 정보와 연결 관계를 볼 수 있습니다.",
    "toggleView": "프로젝트 표시 방식 전환",
    "showing": "전체",
    "of": "개 중",
    "projectsCount": "개 프로젝트 표시",
    "category": "분류",
    "clearFilters": "필터 초기화",
    "tableHeaders": [
      "프로젝트",
      "역할",
      "도입률",
      "상태",
      "영향도"
    ],
    "noMatching": "검색 조건에 맞는 프로젝트가 없습니다.",
    "categoryTitle": "분류별 프로젝트",
    "categoryDescription": "프로젝트 분류별 수량입니다. 분류를 선택하면 목록을 필터링합니다.",
    "statusTitle": "프로젝트 상태 분포",
    "statusDescription": "전체 포트폴리오의 현재 개발 상태입니다.",
    "projects": "프로젝트",
    "archived": "보관",
    "planned": "계획",
    "governanceTitle": "거버넌스 및 유지보수",
    "governanceDescription": "담당자 지정, 영향 범위, 검토 상태입니다.",
    "governanceOwned": "담당 프로젝트",
    "coverage": "담당 범위 100%",
    "highBlastRadius": "영향 범위 높은 프로젝트",
    "criticalProjects": "핵심 프로젝트",
    "exitReviews": "운영 종료 경로 검토",
    "reviewsRequired": "검토 필요",
    "reviewCadence": "검토 주기",
    "quarterly": "분기별",
    "allProjectsReview": "전체 프로젝트 대상",
    "snapshot": "레지스트리 기준",
    "notLive": "운영 실시간 원격 측정 데이터가 아닙니다.",
    "backToWorkbench": "← OSS 워크벤치",
    "csvHeaders": [
      "프로젝트",
      "분류",
      "상태",
      "도입률",
      "영향도",
      "저장소"
    ]
  },
  "en": {
    "sidebarSubtitle": "OSS Portfolio Control Plane",
    "nav": [
      [
        "Portfolio Overview",
        "#overview"
      ],
      [
        "Projects",
        "#projects"
      ],
      [
        "Dependencies",
        "#dependencies"
      ],
      [
        "Milestones",
        "#governance"
      ],
      [
        "Governance",
        "#governance"
      ],
      [
        "Maintenance",
        "#governance"
      ],
      [
        "Reports",
        "#reports"
      ]
    ],
    "quickFilters": "Quick Filters",
    "allProjects": "All Projects",
    "active": "Active",
    "maintenance": "Maintenance",
    "highImpact": "High Impact",
    "motto": [
      "Build",
      "Open Source",
      "Together"
    ],
    "searchLabel": "Search projects and categories",
    "searchPlaceholder": "Search projects and categories...",
    "contributor": "Contributor",
    "dashboardTitle": "Portfolio Control Plane",
    "dashboardDescription": "Unified view of projects, dependencies, adoption and governance across the OpenForge ecosystem.",
    "lastUpdated": "Last updated",
    "exportReport": "Export Report",
    "kpis": "Portfolio KPIs",
    "totalProjects": "Total Projects",
    "activeCount": "active",
    "maintenanceCount": "maintenance",
    "standardsMaturity": "Standards Maturity",
    "engineeringMetrics": "engineering metrics",
    "portfolioAdoption": "Portfolio Adoption",
    "target": "Target",
    "maintenanceCoverage": "Maintenance Coverage",
    "ownedProjects": "Owned projects",
    "graphTitle": "Project Dependency Graph",
    "graphDescription": "Explore relationships and impact across the ecosystem.",
    "standards": "Standards",
    "consumes": "Consumes",
    "controlSurface": "Control Surface",
    "sharedContract": "Shared Contract",
    "graphAria": "Project dependency graph. Select a project node for details.",
    "selectProject": "Select",
    "hideRelations": "Hide all relationships",
    "viewRelations": "View Full Graph →",
    "selected": "Selected",
    "impact": "impact",
    "repository": "Repository ↗",
    "projectsTitle": "Projects Overview",
    "projectsDescription": "Select a project to explore its details and relationships.",
    "toggleView": "Toggle project view",
    "showing": "Showing",
    "of": "of",
    "projectsCount": "projects",
    "category": "Category",
    "clearFilters": "Clear filters",
    "tableHeaders": [
      "Project",
      "Role",
      "Adoption",
      "Status",
      "Impact"
    ],
    "noMatching": "No matching projects",
    "categoryTitle": "Selected Projects by Category",
    "categoryDescription": "Project counts from dashboard.json; select categories only.",
    "statusTitle": "Project Status Distribution",
    "statusDescription": "Current development status across portfolio.",
    "projects": "Projects",
    "archived": "Archived",
    "planned": "Planned",
    "governanceTitle": "Governance & Maintenance",
    "governanceDescription": "Ownership, blast radius and review status.",
    "governanceOwned": "Owned Projects",
    "coverage": "100% coverage",
    "highBlastRadius": "High Blast Radius",
    "criticalProjects": "Critical projects",
    "exitReviews": "Exit-path Reviews",
    "reviewsRequired": "Reviews required",
    "reviewCadence": "Review Cadence",
    "quarterly": "Quarterly",
    "allProjectsReview": "Across all projects",
    "snapshot": "Registry snapshot",
    "notLive": "Metrics are not live operational telemetry",
    "backToWorkbench": "← OSS Workbench",
    "csvHeaders": [
      "Project",
      "Category",
      "Status",
      "Adoption",
      "Impact",
      "Repository"
    ]
  }
} as const;
const categoryNamesKo: Record<string,string> = {
  "Standards & Blueprints": "표준 및 설계 템플릿",
  "Internal Developer Platform": "내부 개발자 플랫폼",
  "Hybrid AI / MLOps": "하이브리드 AI / MLOps",
  "Data Platform IaC": "데이터 플랫폼 IaC",
  "Data Platform Management": "데이터 플랫폼 관리",
  "OS & VM Infrastructure": "운영체제 및 가상머신 인프라",
  "Storage & Kubernetes Controllers": "스토리지 및 Kubernetes 컨트롤러",
  "Identity & Directory Service": "인증 및 디렉터리 서비스",
  "Kubernetes Operations": "Kubernetes 운영",
  "Developer Tooling": "개발 도구",
  "Physical AI / Edge AI": "피지컬 AI / 엣지 AI",
  "Certification & Labs": "자격증 및 실습 환경",
  "Community & Documentation": "커뮤니티 및 문서화",
  "Automation": "자동화"
};
const roleNamesKo: Record<string,string> = {
  "Engineering Control Plane": "엔지니어링 제어 플레인",
  "Platform": "플랫폼",
  "Platform Portal": "플랫폼 포털",
  "Desktop Operator": "데스크톱 운영 도구",
  "Data Platform": "데이터 플랫폼",
  "Data Control Plane": "데이터 제어 플레인",
  "Runtime Foundation": "런타임 기반",
  "Storage Controller": "스토리지 컨트롤러",
  "Identity Service": "인증 서비스",
  "Developer Tool": "개발 도구",
  "Edge AI Infrastructure": "엣지 AI 인프라",
  "Lab Simulator": "실습 시뮬레이터",
  "Portfolio Site": "포트폴리오 사이트"
};
const relationNamesKo: Record<string,string> = {
  "standardizes": "표준화",
  "reference-implementation": "참조 구현",
  "provides": "제공",
  "control-surface": "제어 인터페이스",
  "consumes": "사용",
  "shared-contract": "공유 계약"
};
const statusNamesKo: Record<string,string> = {
  "active": "활성",
  "maintenance": "유지보수",
  "archived": "보관",
  "planned": "계획"
};
const impactNamesKo: Record<string,string> = {
  "low": "낮음",
  "medium": "보통",
  "high": "높음",
  "critical": "매우 높음"
};

export default function PortfolioDashboard(){
 const params=useParams();const locale=params.locale==='en'?'en':'ko';const t=dashboardCopy[locale];const categoryLabel=(name:string)=>locale==='ko'?(categoryNamesKo[name]??name):name;const roleLabel=(name:string)=>locale==='ko'?(roleNamesKo[name]??name):name;const relationLabel=(name:string)=>locale==='ko'?(relationNamesKo[name]??name):name;const statusLabel=(name:string)=>locale==='ko'?(statusNamesKo[name]??name):name;const impactLabel=(name:string)=>locale==='ko'?(impactNamesKo[name]??name):name;const [filter,setFilter]=useState('all');const [query,setQuery]=useState('');const [category,setCategory]=useState<string|null>(null);const [selected,setSelected]=useState<string|null>(null);const [detailId,setDetailId]=useState<string|null>(null);const [view,setView]=useState<'list'|'grid'>('list');const [showAll,setShowAll]=useState(false);
 const projects=data.projects;const active=projects.filter(p=>p.development_status==='active').length;const maintenance=projects.length-active;
 const filtered=useMemo(()=>projects.filter(p=>(filter==='all'||(filter==='active'&&p.development_status==='active')||(filter==='maintenance'&&p.development_status!=='active')||(filter==='high'&&p.maintenance.blast_radius==='high'))&&(!category||p.category===category)&&[p.name,p.category,p.repository,p.archetype,locale==='ko'?categoryNamesKo[p.category]:'',locale==='ko'?roleNamesKo[p.archetype]:''].join(' ').toLowerCase().includes(query.trim().toLowerCase())),[filter,query,category,locale]);
 const categories=Array.from(new Set(projects.map(p=>p.category)));const counts=categories.map(c=>({name:c,count:projects.filter(p=>p.category===c).length,color:categoryColors[c]||colors[categories.indexOf(c)%colors.length]})).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name));
 const selectedProject=projects.find(p=>p.id===selected);const detailProject=projects.find(p=>p.id===detailId)??null;const openDetails=(id:string)=>{setSelected(id);setDetailId(id);};const graphNodes=projects.filter(p=>points[p.id]);const graphRelations=data.relationships.filter(r=>points[r.source]&&points[r.target]);
 const csv=[t.csvHeaders.join(','),...filtered.map(p=>[p.name,categoryLabel(p.category),statusLabel(p.development_status),p.adoption_percent??'',impactLabel(p.maintenance.blast_radius),p.repository].map(v=>'"'+String(v).replaceAll('"','""')+'"').join(','))].join('\n');
 const exportReport=()=>{const blob=new Blob(['\uFEFF',csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`openforge-portfolio-${locale}.csv`;a.click();URL.revokeObjectURL(url);};
 return <main className="bg-[#f0f1fa] text-[#1b2438] font-sans">
 <div className="mx-auto max-w-[1680px] flex shadow-xl">
 <aside className="hidden lg:flex w-[248px] shrink-0 flex-col bg-[#0c172b] text-[#eaf0ff] px-4 py-6">
  <Link href={`/${locale}/oss/`} className="text-xl font-bold tracking-tight">⬡ OpenForge<span className="block text-xs sm:text-sm font-medium text-[#a5b5d2]">{t.sidebarSubtitle}</span></Link>
  <nav aria-label="Portfolio sections" className="mt-9 space-y-1 text-sm">{t.nav.map(([label,href],i)=><a key={label} href={href} className={`block rounded-lg px-3 py-3 transition hover:bg-[#293a60] ${i===0?'bg-[#394772] ring-1 ring-[#6576b7]':''}`}> <span className="mr-3 text-[#a9b9db]">{['⌂','⬡','♧','◷','⬢','⚒','▣'][i]}</span>{label}</a>)}</nav>
  <div className="mt-6 border-t border-[#293852] pt-4 text-sm">{t.quickFilters}</div>
  <div className="mt-3 space-y-2">{[['all',t.allProjects,projects.length,'#a990fb'],['active',t.active,active,'#8bd9bc'],['maintenance',t.maintenance,maintenance,'#f6be60'],['high',t.highImpact,data.maintenance.summary.high_blast_radius_projects,'#ee7f8c']].map(([id,label,count,color])=><button key={String(id)} onClick={()=>setFilter(String(id))} aria-pressed={filter===id} className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left ${filter===id?'bg-[#394772]':'bg-[#1b2a44] hover:bg-[#293a60]'}`}><span className="h-2 w-2 rounded-full" style={{background:String(color)}}/>{label}<span className="ml-auto rounded-full bg-[#455376] px-2 py-0.5">{count}</span></button>)}</div>
  <div className="mt-auto pt-8 text-lg font-semibold leading-tight">{t.motto[0]}<br/>{t.motto[1]}<br/>{t.motto[2]} <ArrowRight size={17} className="mt-3"/></div>
 </aside>
 <div className="min-w-0 flex-1">
  <header className="flex items-center justify-between gap-4 bg-[#e7e9f8] px-5 py-3 sm:px-7" id="overview"><label className="flex w-full max-w-[430px] items-center gap-3 text-[#68789b]"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label={t.searchLabel} placeholder={t.searchPlaceholder} className="w-full rounded-xl border border-[#bec9e1] bg-[#fff] px-4 py-3 text-sm text-[#18243d] outline-none placeholder:text-[#526482] focus-visible:ring-2 focus-visible:ring-[#5268c8]"/></label><span className="hidden sm:block text-sm text-[#68789b]">☼　♧</span><div className="flex items-center gap-2 whitespace-nowrap"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#293d70] text-sm font-bold text-white">SM</span><span className="hidden xl:block text-xs sm:text-sm">OpenForge<br/><span className="text-[#7b86a3]">{t.contributor}</span></span></div></header>
  <div className="space-y-5 p-4 sm:p-6 lg:p-8">
   <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.dashboardTitle}</h1><p className="mt-1 text-sm text-[#405173]">{t.dashboardDescription}</p></div><div className="flex items-center gap-2" id="reports"><span className="rounded-xl border border-[#d9deee] px-3 py-2 text-xs sm:text-sm">{t.lastUpdated}<br/><strong>{data.updated_at}</strong></span><button onClick={exportReport} className="flex items-center gap-2 rounded-xl bg-[#dfe2f6] px-4 py-3 text-sm font-semibold hover:bg-[#cdd3f4]"><ArrowDownToLine size={14}/>{t.exportReport}</button></div></div>
   <section aria-label={t.kpis} className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">{[{label:t.totalProjects,value:projects.length,sub:`${active} ${t.activeCount} · ${maintenance} ${t.maintenanceCount}`,color:'#b98de9',pct:100},{label:t.standardsMaturity,value:data.portfolio.standard_maturity_percent+'%',sub:`${data.portfolio.standard_metrics} ${t.engineeringMetrics}`,color:'#777af5',pct:data.portfolio.standard_maturity_percent},{label:t.portfolioAdoption,value:data.portfolio.adoption_percent+'%',sub:`${t.target} ${data.portfolio.adoption_target_percent}%`,color:'#f2b343',pct:data.portfolio.adoption_percent},{label:t.maintenanceCoverage,value:`${data.maintenance.summary.owned_projects}/${projects.length}`,sub:t.ownedProjects,color:'#29aa92',pct:data.maintenance.summary.owned_projects/projects.length*100}].map((m,i)=><div key={m.label} className={`rounded-xl border border-[#e0e3f0] p-4 ${['bg-[#fff8fb]','bg-[#f7f7ff]','bg-[#fffaf2]','bg-[#f1fcf9]'][i]}`}><div className="flex justify-between gap-3 text-sm font-semibold"><span>{m.label}</span><span className="rounded-full bg-white/70 px-2 py-1" style={{color:m.color}}>⬡</span></div><div className="mt-1 text-3xl font-bold tracking-tight">{m.value}</div><div className="mt-1 text-xs sm:text-sm text-[#465a7a]">{m.sub}</div><div className="mt-4 h-2 rounded-full bg-[#e4e8f0]"><div className="h-full rounded-full" style={{width:m.pct+'%',background:m.color}}/></div></div>)}</section>
   <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
    <section id="dependencies" className={dark+' p-5 sm:p-6'}><h2 className={title}>{t.graphTitle}</h2><p className={subdued}>{t.graphDescription}</p><div className="mt-3 flex flex-wrap gap-4 text-sm text-[#d1dff4]">{[['#b98de9',t.standards],['#7bb8f5',t.consumes],['#f6be60',t.controlSurface],['#e78fb2',t.sharedContract]].map(([c,l])=><span key={l}><span style={{color:c}}>● </span>{l}</span>)}</div><div className="relative mt-3 overflow-x-auto"><svg viewBox="0 0 540 350" role="img" aria-label={t.graphAria} className="mx-auto w-full min-w-[540px] max-w-[900px]">{graphRelations.map((r,i)=>{const a=points[r.source],b=points[r.target];const color=r.type==='standardizes'?'#b98de9':r.type==='consumes'?'#7bb8f5':r.type==='shared-contract'?'#e78fb2':'#f6be60';return <path key={i} d={`M ${a[0]} ${a[1]} L ${a[0]} ${(a[1]+b[1])/2} L ${b[0]} ${(a[1]+b[1])/2} L ${b[0]} ${b[1]}`} fill="none" stroke={color} strokeWidth="1" opacity={selected&&r.source!==selected&&r.target!==selected?.25:.7}/>})}{graphNodes.map((p,i)=>{const [x,y]=points[p.id];return <g key={p.id} role="button" tabIndex={0} onClick={()=>openDetails(p.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetails(p.id);}}} aria-label={t.selectProject+' '+p.name} className="cursor-pointer"><rect x={x-63} y={y-24} width="126" height="48" rx="10" fill={selected===p.id?'#6462b4':['#356b9b','#855477','#8d744c','#66527f','#514a9c','#885773','#3b857d','#446b96'][i%8]} stroke={selected===p.id?'#fff':'#879cce'}/><text x={x} y={y-3} textAnchor="middle" fontSize="12" fill="white" fontWeight="600">{p.name.length>18?p.name.slice(0,17)+'…':p.name}</text><text x={x} y={y+11} textAnchor="middle" fontSize="10" fill="#e4e8fa">{roleLabel(p.archetype).slice(0,24)}</text></g>})}</svg></div><button onClick={()=>setShowAll(!showAll)} className="rounded-lg border border-[#455673] px-3 py-2 text-xs sm:text-sm hover:bg-[#283956]">{showAll?t.hideRelations:t.viewRelations}</button>{showAll&&<div className="mt-3 max-h-44 overflow-auto text-xs sm:text-sm text-[#b6c7e0]">{data.relationships.map((r,i)=><div key={i} className="border-b border-[#2b3a55] py-1">{shortName(r.source)} → {shortName(r.target)} · {relationLabel(r.type)}</div>)}</div>}{selectedProject&&<p className="mt-3 text-sm text-[#b7c6e3]">{t.selected}: <strong>{selectedProject.name}</strong> · {t.impact}: {impactLabel(selectedProject.maintenance.blast_radius)} · <a className="underline" href={'https://github.com/'+selectedProject.repository} target="_blank" rel="noreferrer">{t.repository}</a></p>}</section>
    <section id="projects" className={dark+' p-5 sm:p-6'}><div className="flex items-center justify-between gap-2"><div><h2 className={title}>{t.projectsTitle}</h2><p className={subdued}>{t.projectsDescription}</p></div><button onClick={()=>setView(view==='list'?'grid':'list')} aria-label={t.toggleView} className="rounded-lg bg-[#2c3b58] p-2">{view==='list'?<LayoutGrid size={15}/>:<List size={15}/>}</button></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#d2def0]"><span>{t.showing} <strong className="text-white">{filtered.length}</strong> {t.of} {projects.length} {t.projectsCount}{category&&<span className="ml-2 rounded-md bg-[#38476c] px-2 py-1 text-white">{t.category}: {categoryLabel(category)}</span>}</span>{(filter!=='all'||query.trim()||category)&&<button onClick={()=>{setFilter('all');setQuery('');setCategory(null);}} className="rounded-lg border border-[#8b9bb9] px-3 py-2 font-medium text-white hover:bg-[#3a4d72] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{t.clearFilters}</button>}</div><div className="mt-3 max-h-[560px] overflow-auto rounded-lg border border-[#354662]">{view==='list'?<table className="w-full min-w-[660px] text-left text-sm leading-relaxed"><thead className="sticky top-0 bg-[#23304b] text-[#c3cde2]"><tr>{t.tableHeaders.map(h=><th key={h} className="px-3 py-3 font-semibold">{h}</th>)}</tr></thead><tbody>{filtered.map((p,i)=><tr key={p.id} tabIndex={0} aria-label={t.selectProject+' '+p.name} onClick={()=>openDetails(p.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetails(p.id);}}} className={`cursor-pointer border-b border-[#273652] hover:bg-[#293957] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${selected===p.id?'bg-[#354669]':''}`}><td className="px-3 py-3"><button onClick={e=>{e.stopPropagation();openDetails(p.id);}} className="flex items-center gap-2 text-left font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-white"><span className="h-3 w-3 rounded-full" style={{background:colors[i%colors.length]}}/>{p.name}</button></td><td className="px-3 py-3 text-[#d7e1f2]">{roleLabel(p.archetype)}</td><td className="px-3 py-3">{p.adoption_percent===null?'N/A':p.adoption_percent+'%'}<div className="mt-1 h-1 w-14 rounded-full bg-[#35445f]"><div className="h-full rounded-full bg-[#b48ae8]" style={{width:(p.adoption_percent??15)+'%'}}/></div></td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 ${p.development_status==='active'?'bg-[#24584f] text-[#a3e5cb]':'bg-[#625032] text-[#f4d393]'}`}>{statusLabel(p.development_status)}</span></td><td className="px-3 py-3"><span className="rounded-full bg-[#503a4c] px-2 py-1">{impactLabel(p.maintenance.blast_radius)}</span></td></tr>)}</tbody></table>:<div className="grid gap-3 sm:grid-cols-2">{filtered.map(p=><button key={p.id} onClick={()=>openDetails(p.id)} className="rounded-lg border border-[#405271] bg-[#273653] p-4 text-left text-sm leading-relaxed hover:bg-[#344567] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><strong>{p.name}</strong><div className="mt-2 text-[#a9b9d1]">{roleLabel(p.archetype)}</div><div className="mt-2">{p.adoption_percent??'N/A'}%</div></button>)}</div>}{filtered.length===0&&<p className="py-8 text-center text-sm">{t.noMatching}</p>}</div></section>
   </div>
   <div className="grid gap-4 xl:grid-cols-2">
    <section className={dark+' p-5 sm:p-6 xl:col-span-2'}><h2 className={title}>{t.categoryTitle}</h2><p className={subdued}>{t.categoryDescription}</p><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{counts.map(c=><button key={c.name} type="button" onClick={()=>setCategory(category===c.name?null:c.name)} aria-pressed={category===c.name} className={`rounded-lg border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${category===c.name?'border-[#b4a0ff] bg-[#334568]':'border-[#354862] bg-[#24334f] hover:border-[#8294b6] hover:bg-[#2c3c59]'}`}><div className="flex items-start justify-between gap-3"><span className="min-w-0 break-words text-sm font-medium leading-5 text-[#edf3ff]">{categoryLabel(c.name)}</span><strong className="shrink-0 text-base text-white">{c.count}</strong></div><div className="mt-3 h-2 rounded-full bg-[#142139]"><div className="h-full rounded-full" style={{width:(c.count/Math.max(...counts.map(x=>x.count))*100)+'%',background:c.color}}/></div></button>)}</div></section>
    <section className={dark+' p-5 sm:p-6'}><h2 className={title}>{t.statusTitle}</h2><p className={subdued}>{t.statusDescription}</p><div className="mt-7 flex flex-wrap items-center justify-center gap-7"><div className="relative h-36 w-36 shrink-0 rounded-full" style={{background:`conic-gradient(#8bd9bc 0 ${active/projects.length*100}%,#f6be60 ${active/projects.length*100}% 100%)`}}><div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-[#18243d]"><strong className="text-xl">{projects.length}</strong><span className="text-xs sm:text-sm">{t.projects}</span></div></div><div className="space-y-3 text-sm"><div><span className="text-[#8bd9bc]">● </span>{t.active}　{active}</div><div><span className="text-[#f6be60]">● </span>{t.maintenance}　{maintenance}</div><div><span className="text-[#b4bed0]">● </span>{t.archived}　0</div><div><span className="text-[#e78fb2]">● </span>{t.planned}　0</div></div></div></section>
    <section id="governance" className={dark+' p-5 sm:p-6'}><h2 className={title}>{t.governanceTitle}</h2><p className={subdued}>{t.governanceDescription}</p><div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">{[[t.governanceOwned,data.maintenance.summary.owned_projects+'/'+projects.length,t.coverage,'#7377f1'],[t.highBlastRadius,data.maintenance.summary.high_blast_radius_projects,t.criticalProjects,'#e27e9f'],[t.exitReviews,data.maintenance.summary.exit_path_review_required,t.reviewsRequired,'#64b5ee'],[t.reviewCadence,t.quarterly,t.allProjectsReview,'#ae8be6']].map(([label,value,sub,color])=><div key={String(label)} className="rounded-lg border border-[#3c4e70] bg-[#293853] p-4"><div className="text-xs sm:text-sm text-[#d0dcf0]">{label}</div><div className="mt-2 text-xl font-bold" style={{color:String(color)}}>{value}</div><div className="text-xs text-[#c4d1e8]">{sub}</div></div>)}</div></section>
   </div>
   <footer className="flex flex-wrap justify-between gap-3 pt-3 text-xs sm:text-sm text-[#425577]"><span>{t.snapshot} {data.updated_at} · {t.notLive}</span><Link href={`/${locale}/oss/`} className="underline">{t.backToWorkbench}</Link></footer>
  </div>
 </div></div><ProjectDetailsDialog locale={locale} project={detailProject} projects={projects} relationships={data.relationships} onClose={()=>setDetailId(null)} onSelectProject={openDetails} categoryLabel={categoryLabel} roleLabel={roleLabel} statusLabel={statusLabel} impactLabel={impactLabel} relationLabel={relationLabel}/></main>;
}
