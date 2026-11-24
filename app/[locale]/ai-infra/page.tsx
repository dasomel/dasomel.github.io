import Link from 'next/link';
import { ArrowUpRight, Rss } from 'lucide-react';
import { getAIInfraWeekly } from '@/lib/content';
import { routing } from '@/i18n/routing';

export function generateStaticParams() { return routing.locales.map(locale => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: 'AI Infrastructure Weekly', description: locale === 'en' ? 'AI infrastructure research and operational implications.' : 'AI 인프라 연구와 운영 시사점.' };
}

export default async function AIInfraPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const base = lang === 'en' ? '/en' : '/ko';
  const issues = getAIInfraWeekly(lang);
  return <main>
    <section className="border-b" style={{borderColor:'var(--border)'}}><div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-16 lg:py-20">
      <div className="flex items-center justify-between gap-4"><div className="font-mono text-xs font-semibold tracking-[0.14em]" style={{color:'var(--accent)'}}>RESEARCH / AI SYSTEMS</div><Link href={lang==='en'?'/ai-infra-en.xml':'/ai-infra.xml'} className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs" style={{borderColor:'var(--border)',color:'var(--text-muted)'}}><Rss className="h-3.5 w-3.5"/> RSS</Link></div>
      <h1 className="mt-5 text-4xl font-semibold tracking-[-0.055em] sm:text-6xl" style={{color:'var(--text)'}}>AI Infrastructure Weekly</h1>
      <p className="mt-6 max-w-4xl text-base leading-8 sm:text-lg" style={{color:'var(--text-muted)'}}>{lang==='en'?'Research-driven analysis of Kubernetes, GPU infrastructure, distributed inference and MLOps. AI-assisted research, distinct from original field notes.':'Kubernetes, GPU 인프라, 분산 추론 및 MLOps의 연구 동향과 운영 시사점을 정리합니다. 직접 경험을 기록한 필드 노트와 구분되는 AI 보조 리서치입니다.'}</p>
    </div></section>
    <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-16">
      <h2 className="text-2xl font-semibold" style={{color:'var(--text)'}}>{lang==='en'?'Research archive':'리서치 아카이브'}</h2>
      <div className="mt-8 divide-y" style={{borderColor:'var(--border)'}}>{issues.length===0?<p style={{color:'var(--text-muted)'}}>{lang==='en'?'No issues published yet.':'아직 발행된 리포트가 없습니다.'}</p>:issues.map(issue=><Link key={issue.slug} href={`${base}/posts/${issue.slug}`} className="group grid gap-3 py-6 md:grid-cols-[120px_1fr_auto] md:items-start"><div className="font-mono text-xs" style={{color:'var(--text-faint)'}}>{issue.pubDate.slice(0,10)}</div><div><h3 className="text-xl font-semibold group-hover:text-[var(--accent)]" style={{color:'var(--text)'}}>{issue.title}</h3><p className="mt-2 text-sm leading-6" style={{color:'var(--text-muted)'}}>{issue.description}</p><div className="mt-2 font-mono text-[10px]" style={{color:'var(--accent)'}}>{issue.tags.join(' · ')}</div></div><ArrowUpRight className="h-4 w-4" style={{color:'var(--text-faint)'}}/></Link>)}</div>
    </section>
  </main>;
}
