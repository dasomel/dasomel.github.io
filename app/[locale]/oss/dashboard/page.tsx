'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowUpRight, GitBranch, Search } from 'lucide-react';
import raw from '@/src/data/openforge-portfolio.json';

type Project = { id: string; name: string; category: string; development_status: string; impact_score: number; repository?: string; maintenance?: { maintenance_owner?: string; blast_radius?: string; exit_path_status?: string; strategic_role?: string } };
type Relationship = { source?: string; target?: string; from?: string; to?: string; type?: string; relationship_type?: string; scope?: string };
const data = raw as unknown as { updated_at: string; portfolio: { adoption_percent: number; standard_maturity_percent: number; adr_count: number; standard_metrics: number }; projects: Project[]; relationships: Relationship[]; maintenance?: { summary: { owned_projects: number; high_blast_radius_projects: number; exit_path_review_required: number; unowned_projects: number } } };
const panel = 'rounded-2xl border p-5 sm:p-6';
const panelStyle = { borderColor: 'var(--border)', background: 'var(--surface)' };
const muted = { color: 'var(--text-muted)' };
export default function PortfolioDashboard() {
  const params = useParams();
  const locale = params.locale === 'en' ? 'en' : 'ko';
  const en = locale === 'en';
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const categories = useMemo(() => [...new Set(data.projects.map(p => p.category))].sort(), []);
  const filtered = useMemo(() => data.projects.filter(p => (category === 'all' || p.category === category) && (status === 'all' || p.development_status === status) && (p.name + ' ' + p.id).toLowerCase().includes(query.toLowerCase())), [category, status, query]);
  const statuses = [...new Set(data.projects.map(p => p.development_status))].sort();
  const selectedProject = data.projects.find(p => p.id === selected);
  const relations = data.relationships.filter(r => !selected || [r.source, r.target, r.from, r.to].includes(selected));
  const summary = data.maintenance?.summary;
  const metrics = [
    [en ? 'Projects' : '프로젝트', data.projects.length],
    [en ? 'Portfolio adoption' : '포트폴리오 도입률', data.portfolio.adoption_percent + '%'],
    [en ? 'Standard maturity' : '표준 성숙도', data.portfolio.standard_maturity_percent + '%'],
    ['ADRs', data.portfolio.adr_count],
  ];
  return <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-16">
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm" style={muted}><Link href={`/${locale}/oss/`} className="hover:underline">← OSS Workbench</Link><a href="https://github.com/dasomel/openforge/blob/main/portfolio/dashboard.json" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">Source of truth <ArrowUpRight size={14}/></a></div>
    <div className="mt-9 font-mono text-xs tracking-[0.16em]" style={{color:'var(--accent)'}}>OPENFORGE / PORTFOLIO CONTROL PLANE</div>
    <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{en ? 'Portfolio dashboard' : 'OSS 포트폴리오 대시보드'}</h1>
    <p className="mt-4 max-w-3xl text-sm leading-7" style={muted}>{en ? 'Explore portfolio metrics, project relationships, impact and maintenance governance from the OpenForge registry.' : 'OpenForge 레지스트리를 기반으로 포트폴리오 지표, 프로젝트 관계, 영향도와 유지보수 거버넌스를 탐색합니다.'}</p>
    <p className="mt-2 font-mono text-xs" style={muted}>Registry snapshot: {data.updated_at} · openforge-dashboard/v1 · {data.relationships.length} relationships</p>
    <section aria-label="Portfolio KPIs" className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">{metrics.map(([label,value]) => <div key={label} className={panel} style={panelStyle}><div className="text-xs" style={muted}>{label}</div><div className="mt-3 text-3xl font-semibold tabular-nums">{value}</div></div>)}</section>
    <section className="mt-5 grid gap-5 lg:grid-cols-2">
      <div className={panel} style={panelStyle}><h2 className="text-lg font-semibold">{en ? 'Projects by category' : '카테고리별 프로젝트'}</h2><p className="mt-1 text-xs" style={muted}>{en ? 'Select a category to filter the inventory.' : '카테고리를 선택하면 목록이 필터링됩니다.'}</p><div className="mt-5 space-y-3">{categories.map(c => { const count = data.projects.filter(p => p.category === c).length; return <button key={c} onClick={() => setCategory(category === c ? 'all' : c)} aria-pressed={category === c} className="block w-full text-left"><div className="flex justify-between gap-3 text-xs"><span>{c}</span><span className="tabular-nums">{count}</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full" style={{background:'var(--bg-subtle)'}}><div className="h-full rounded-full" style={{width:`${count / data.projects.length * 100}%`,background:category===c?'var(--accent)':'var(--text-muted)'}}/></div></button>; })}</div></div>
      <div className={panel} style={panelStyle}><h2 className="text-lg font-semibold">{en ? 'Governance & maintenance' : '거버넌스 및 유지보수'}</h2><div className="mt-5 grid grid-cols-2 gap-3">{[[en?'Owned':'관리 책임 지정',summary?.owned_projects],[en?'High blast radius':'높은 영향 범위',summary?.high_blast_radius_projects],[en?'Exit reviews required':'종료 경로 검토 필요',summary?.exit_path_review_required],[en?'Unowned':'미지정',summary?.unowned_projects]].map(([label,value]) => <div key={label} className="rounded-xl border p-4" style={{borderColor:'var(--border)'}}><div className="text-xs" style={muted}>{label}</div><div className="mt-2 text-2xl font-semibold">{value ?? '—'}</div></div>)}</div><p className="mt-4 text-xs" style={muted}>{en ? 'Governance indicators reflect the registry snapshot, not live operational state.' : '거버넌스 지표는 실시간 운영 상태가 아닌 레지스트리 스냅샷입니다.'}</p></div>
    </section>
    <section className={panel + ' mt-5'} style={panelStyle}><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">{en ? 'Project inventory' : '프로젝트 목록'} <span className="text-sm font-normal" style={muted}>({filtered.length}/{data.projects.length})</span></h2><button className="text-xs underline" onClick={()=>{setCategory('all');setStatus('all');setQuery('');setSelected(null);}}>{en?'Reset filters':'필터 초기화'}</button></div><div className="mt-5 grid gap-3 sm:grid-cols-[1fr_220px]"><label className="flex items-center gap-2 rounded-lg border px-3" style={{borderColor:'var(--border)'}}><Search size={16}/><input aria-label={en?'Search projects':'프로젝트 검색'} className="w-full bg-transparent py-3 text-sm outline-none" value={query} onChange={e=>setQuery(e.target.value)} placeholder={en?'Search projects':'프로젝트 검색'}/></label><select aria-label={en?'Development status':'개발 상태'} value={status} onChange={e=>setStatus(e.target.value)} className="rounded-lg border bg-transparent p-3 text-sm" style={{borderColor:'var(--border)'}}><option value="all">{en?'All statuses':'전체 상태'}</option>{statuses.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
    <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead><tr style={muted}>{[en?'Project':'프로젝트',en?'Category':'카테고리',en?'Status':'상태',en?'Impact':'영향도',en?'Blast radius':'영향 범위'].map(h=><th key={h} className="border-b p-3 font-medium" style={{borderColor:'var(--border)'}}>{h}</th>)}</tr></thead><tbody>{filtered.map(p=><tr key={p.id} onClick={()=>setSelected(selected===p.id?null:p.id)} className="cursor-pointer hover:opacity-70" aria-selected={selected===p.id}><td className="border-b p-3 font-medium" style={{borderColor:'var(--border)'}}>{p.name}</td><td className="border-b p-3" style={{borderColor:'var(--border)'}}>{p.category}</td><td className="border-b p-3" style={{borderColor:'var(--border)'}}>{p.development_status}</td><td className="border-b p-3 tabular-nums" style={{borderColor:'var(--border)'}}>{p.impact_score}</td><td className="border-b p-3" style={{borderColor:'var(--border)'}}>{p.maintenance?.blast_radius ?? '—'}</td></tr>)}</tbody></table>{filtered.length===0&&<p className="py-6 text-center text-sm" style={muted}>{en?'No matching projects':'일치하는 프로젝트가 없습니다.'}</p>}</div>
    {selectedProject&&<div className="mt-5 rounded-xl border p-5" style={{borderColor:'var(--border)',background:'var(--bg-subtle)'}}><div className="flex flex-wrap justify-between gap-3"><h3 className="font-semibold">{selectedProject.name}</h3><button className="text-xs underline" onClick={()=>setSelected(null)}>{en?'Clear selection':'선택 해제'}</button></div><p className="mt-2 text-sm" style={muted}>{selectedProject.maintenance?.strategic_role} · {selectedProject.maintenance?.maintenance_owner} · {selectedProject.maintenance?.exit_path_status}</p>{selectedProject.repository&&<a className="mt-3 inline-flex items-center gap-1 text-sm underline" href={`https://github.com/${selectedProject.repository}`} target="_blank" rel="noreferrer">GitHub repository <ArrowUpRight size={14}/></a>}</div>}</section>
    <section className={panel + ' mt-5'} style={panelStyle}><h2 className="flex items-center gap-2 text-lg font-semibold"><GitBranch size={19}/>{en?'Relationship explorer':'프로젝트 관계 탐색'}</h2><p className="mt-2 text-xs" style={muted}>{en?'Select a project above to inspect its recorded relationships. Relationship types do not necessarily imply runtime dependencies.':'위 목록에서 프로젝트를 선택하면 연결 관계를 확인할 수 있습니다. 모든 관계가 런타임 의존성을 뜻하지는 않습니다.'}</p><div className="mt-5 grid gap-2 md:grid-cols-2">{relations.map((r,i)=><div key={i} className="rounded-xl border p-3 text-sm" style={{borderColor:'var(--border)'}}><div className="flex flex-wrap items-center gap-2"><span className="font-semibold">{r.source??r.from??'?'}</span><span style={{color:'var(--accent)'}}>→</span><span className="font-semibold">{r.target??r.to??'?'}</span></div><div className="mt-1 text-xs" style={muted}>{r.type??r.relationship_type??'relationship'}{r.scope?` · ${r.scope}`:''}</div></div>)}</div>{relations.length===0&&<p className="mt-4 text-sm" style={muted}>{en?'No relationships recorded.':'등록된 관계가 없습니다.'}</p>}</section>
    <footer className="mt-8 text-xs" style={muted}>OpenForge registry · <a className="underline" href="https://github.com/dasomel/openforge/issues/128">Figma reference #128</a></footer>
  </main>;
}
