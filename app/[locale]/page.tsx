import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getNotes, getTechDigests, getProjects, getSeminars, getPostBySlug } from '@/lib/content';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { routing } from '@/i18n/routing';
import { ImpactStats } from '@/components/ui/impact-stats';
import readingTime from 'reading-time';

export function generateStaticParams() { return routing.locales.map(locale => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; const lang = locale as 'ko' | 'en'; const url = `https://cne.io.kr/${lang}`;
  const copy = lang === 'en' ? { title: 'dasomel — OSS Workbench', description: 'An engineering workbench for building, testing, learning, and changing my mind in Cloud Native and open source.' } : { title: 'dasomel — OSS Workbench', description: 'Cloud Native와 OSS를 직접 만들고 검증하며 배우는 엔지니어링 작업 기록.' };
  return { title: copy.title, description: copy.description, alternates: { canonical: url, languages: { ko: 'https://cne.io.kr/ko', en: 'https://cne.io.kr/en' } }, openGraph: { type: 'website', url, title: copy.title, description: copy.description, images: [{ url: '/images/workbench-hero-v2.svg', alt: 'OSS engineering workbench' }] }, twitter: { card: 'summary_large_image', title: copy.title, description: copy.description, images: ['/images/workbench-hero-v2.svg'] } };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const lang = locale as 'ko' | 'en'; const t = await getTranslations({ locale, namespace: 'home' }); const base = lang === 'en' ? '/en' : '/ko';
  const notes = getNotes(lang); const digests = getTechDigests(lang); const projects = getProjects(lang); const seminars = getSeminars(lang);
  const featuredSlugs = ['narwhal', 'beluga', 'kubemetal', 'kube-ready-box', 'ldapium', 'egovframe-launcher'];
  const currentProjects = featuredSlugs.map(slug => projects.find(p => p.slug === slug)).filter((p): p is (typeof projects)[number] => Boolean(p));
  const latestNotes = notes.slice(0, 4).map(post => { const detail = getPostBySlug(post.slug, lang); const rt = detail ? readingTime(detail.content) : null; return { ...post, readTime: rt ? `${Math.ceil(rt.minutes)} min` : '' }; });
  const latestDigest = digests[0]; const yearsActive = new Date().getFullYear() - 2011;

  return <div>
    <section className="relative overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="absolute inset-x-0 top-0 h-[620px] hero-glow" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="workbench-eyebrow mb-6">{t('hero.eyebrow')}</div>
          <h1 className="mx-auto max-w-5xl text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.045em] leading-[0.97]" style={{ color: 'var(--text)' }}>
            {t('hero.headline_1')}<span style={{ color: 'var(--accent)' }}>{t('hero.headline_accent')}</span>{t('hero.headline_2')}
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base sm:text-lg leading-8" style={{ color: 'var(--text-muted)' }}>{t('hero.description')}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href={`${base}/projects`} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-sm" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}>{t('hero.cta_projects')} <ArrowUpRight className="w-4 h-4" /></Link>
            <Link href={`${base}/notes`} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-hi)', color: 'var(--text)' }}>{t('hero.cta_notes')} <ArrowUpRight className="w-4 h-4" /></Link>
          </div>
        </div>
        <div className="relative mt-16 sm:mt-20 mx-auto max-w-6xl">
          <Image src="/images/workbench-hero-v2.svg" alt="OSS engineering workbench visual" width={1600} height={720} unoptimized className="block w-full h-auto" priority />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-44 bg-gradient-to-t from-[var(--bg)] via-[color:var(--bg)/0.88] to-transparent" />
        </div>
      </div>
    </section>
    <ImpactStats stats={[{ value: `${yearsActive}yr`, label: t('stats.experience') }, { value: `${projects.length}`, label: t('stats.projects') }, { value: `${seminars.length}+`, label: t('stats.talks') }]} />
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-20 space-y-20">
      <section><div className="flex items-end justify-between gap-4 mb-7"><div><div className="workbench-eyebrow mb-2">{t('sections.now_kicker')}</div><h2 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text)' }}>{t('sections.now')}</h2><p className="mt-2 text-sm max-w-2xl" style={{ color: 'var(--text-muted)' }}>{t('sections.now_desc')}</p></div><Link href={`${base}/projects`} className="hidden sm:inline-flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--accent)' }}>{t('sections.view_projects')} <ArrowUpRight className="w-3 h-3" /></Link></div><div className="grid md:grid-cols-2 gap-4">{currentProjects.map(project => { const summary = project.problem ? `${project.problem}${project.solution ? ` → ${project.solution}` : ''}` : project.description; return <Link key={project.slug} href={`${base}/projects/${project.slug}`} className="workbench-card group"><div className="flex items-start justify-between gap-4"><div><div className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>{project.title}</div>{summary && <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{summary}</p>}</div><ExternalLink className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: 'var(--text-faint)' }} /></div><div className="flex flex-wrap gap-1.5 mt-5">{project.tags.slice(0, 4).map(tag => <span key={tag} className="workbench-chip">{tag}</span>)}</div></Link>})}</div></section>
      <section><div className="flex items-end justify-between gap-4 mb-7"><div><div className="workbench-eyebrow mb-2">{t('sections.notes_kicker')}</div><h2 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text)' }}>{t('sections.notes')}</h2><p className="mt-2 text-sm max-w-2xl" style={{ color: 'var(--text-muted)' }}>{t('sections.notes_desc')}</p></div><Link href={`${base}/notes`} className="hidden sm:inline-flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--accent)' }}>{t('sections.view_notes')} <ArrowUpRight className="w-3 h-3" /></Link></div><div className="space-y-2">{latestNotes.map(post => <Link key={post.slug} href={`${base}/posts/${post.slug}`} className="workbench-note group"><div className="min-w-0"><h3 className="text-sm sm:text-base font-medium mb-1 group-hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>{post.title}</h3><div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono" style={{ color: 'var(--text-faint)' }}><span>{post.pubDate.slice(0, 10)}</span>{post.readTime && <span>{post.readTime}</span>}{post.tags.slice(0, 2).map(tag => <span key={tag}>{tag}</span>)}</div></div><ArrowUpRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-faint)' }} /></Link>)}</div></section>
      {latestDigest && <section className="rounded-2xl p-5 sm:p-6" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><div className="flex items-start justify-between gap-4"><div><div className="workbench-eyebrow mb-2">{t('sections.digest_kicker')}</div><h2 className="text-xl sm:text-2xl font-semibold mb-2" style={{ color: 'var(--text)' }}>{t('sections.digest')}</h2><p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{latestDigest.description}</p><div className="mt-3 text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{latestDigest.pubDate.slice(0, 10)}</div></div><Link href={`${base}/tech-digest`} className="inline-flex items-center gap-1 text-xs font-mono flex-shrink-0" style={{ color: 'var(--accent)' }}>{t('sections.view_digest')} <ArrowUpRight className="w-3 h-3" /></Link></div></section>}
      <section className="grid lg:grid-cols-[1.4fr_1fr] gap-10 pt-2"><div><div className="workbench-eyebrow mb-3">{t('sections.philosophy_kicker')}</div><h2 className="text-2xl sm:text-3xl font-semibold leading-tight mb-4" style={{ color: 'var(--text)' }}>{t('sections.philosophy')}</h2><p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>{t('sections.philosophy_desc')}</p></div><div className="workbench-quote"><div className="text-xs font-mono mb-3" style={{ color: 'var(--accent)' }}>{t('sections.current_question')}</div><p className="text-base sm:text-lg font-medium leading-relaxed" style={{ color: 'var(--text)' }}>{t('sections.question')}</p></div></section>
    </main>
  </div>;
}
