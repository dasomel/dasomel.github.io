import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getDocBySlug, getDocs } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import { routing } from '@/i18n/routing';
import Sidebar from '@/components/layout/Sidebar';
import TOC from '@/components/layout/TOC';

export function generateStaticParams() { const params:{locale:string;slug:string[]}[]=[]; routing.locales.forEach(locale=>getDocs(locale as 'ko'|'en').forEach(doc=>params.push({locale,slug:doc.slug.split('/')}))); return params; }

export default async function DocPage({ params }: { params: Promise<{ locale: string; slug: string[] }> }) {
  const { locale, slug: segments } = await params; const slug=segments.join('/'); const lang=locale as 'ko'|'en'; const result=getDocBySlug(slug,lang); if(!result)notFound(); const docs=getDocs(lang); const base=lang==='en'?'/en':'/ko';
  return <main>
    <div className="mx-auto max-w-[1440px] px-5 pt-7 sm:px-8 lg:px-16"><Link href={`${base}/docs`} className="inline-flex items-center gap-2 text-sm" style={{color:'var(--text-muted)'}}><ArrowLeft className="h-4 w-4"/>{lang==='en'?'All documentation':'전체 문서'}</Link></div>
    <header className="mx-auto max-w-[1440px] px-5 pb-9 pt-8 sm:px-8 lg:px-16"><div className="font-mono text-[10px] font-semibold tracking-[0.13em]" style={{color:'var(--accent)'}}>OPERATING DOCUMENT / {result.meta.project?.toUpperCase()||'WORKBENCH'}</div><h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl" style={{color:'var(--text)'}}>{result.meta.title}</h1>{result.meta.description&&<p className="mt-5 max-w-3xl text-base leading-7 sm:text-lg" style={{color:'var(--text-muted)'}}>{result.meta.description}</p>}</header>
    <section className="border-y" style={{borderColor:'var(--border)',backgroundColor:'var(--surface-hi)'}}><div className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8 lg:px-16"><div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[9px] uppercase tracking-[0.09em]" style={{color:'var(--text-faint)'}}><span style={{color:'var(--accent)'}}>01 / Context</span><span>02 / Procedure</span><span>03 / Operations</span><span>04 / Verification</span></div></div></section>
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-16"><div className="flex flex-col lg:flex-row lg:gap-10"><Sidebar docs={docs} locale={lang}/><div className="min-w-0 flex-1"><article className="prose cne-doc-prose max-w-none prose-headings:scroll-mt-24"><MDXContent source={result.content}/></article><div className="mt-12 border-t pt-6" style={{borderColor:'var(--border)'}}><div className="font-mono text-[9px] font-semibold tracking-[0.12em]" style={{color:'var(--signal)'}}>DOCUMENT TRACE</div><p className="mt-2 text-sm leading-6" style={{color:'var(--text-muted)'}}>{lang==='en'?'Return to the project record to see architecture, development pulse, proof and related field notes in one context.':'프로젝트 상세로 돌아가면 아키텍처, 개발 흐름, 검증 근거와 관련 Field Note를 하나의 맥락에서 볼 수 있습니다.'}</p></div></div><TOC/></div></div>
  </main>
}
