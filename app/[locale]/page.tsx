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
    <section className="home-hero relative overflow-hidden">
      <div className="home-hero-grid" />
      <div className="home-hero-glow" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center">
          <div className="text-left">
            <div className="workbench-eyebrow mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ backgroundColor: 'var(--surface-hi)', borderColor: 'var(--border)' }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
              {t('hero.eyebrow')}
            </div>
            <h1 className="max-w-3xl text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-semibold tracking-[-0.055em] leading-[0.93]" style={{ color: 'var(--text)' }}>
              {t('hero.headline_1')}<span className="hero-accent-block" style={{ color: 'var(--accent)' }}>{t('hero.headline_accent')}</span>{t('hero.headline_2')}
            </h1>
            <p className="mt-7 max-w-xl text-base sm:text-lg leading-8" style={{ color: 'var(--text-muted)' }}>{t('hero.description')}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={`${base}/projects`} className="hero-primary-cta inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-fg)' }}>{t('hero.cta_projects')} <ArrowUpRight className="w-4 h-4" /></Link>
              <Link href={`${base}/notes`} className="hero-secondary-cta inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>{t('hero.cta_notes')} <ArrowUpRight className="w-4 h-4" /></Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-mono" style={{ color: 'var(--text-faint)' }}>
              <span>OSS</span><span>Cloud Native</span><span>Platform Engineering</span><span>AI-assisted</span>
            </div>
          </div>
          <div className="hero-visual relative">
            <div className="hero-frame" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="hero-frame-topline">
                <span /><span /><span />
                <div className="ml-auto font-mono text-[0.58rem] tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>WORKBENCH / 01</div>
              </div>
              <Image src="/images/workbench-hero-v2.svg" alt="OSS engineering workbench visual" width={1600} height={760} unoptimized className="block w-full h-auto rounded-xl" priority />
            </div>
            <div className="hero-visual-label" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
              <span className="font-mono text-[0.62rem] tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>BUILD / TEST / LEARN</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <ImpactStats stats={[{ value: `${yearsActive}yr`, label: t('stats.experience') }, { value: `${projects.length}`, label: t('stats.projects') }, { value: `${seminars.length}+`, label: t('stats.talks') }]} />

    <main className="home-main max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <section className="home-section">
        <div className="home-section-heading"><div><div className="workbench-eyebrow mb-2">{t('sections.now_kicker')}</div><h2 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text)' }}>{t('sections.now')}</h2><p className="mt-2 text-sm max-w-2xl" style={{ color: 'var(--text-muted)' }}>{t('sections.now_desc')}</p></div><Link href={`${base}/projects`} className="section-link hidden sm:inline-flex" style={{ color: 'var(--accent)' }}>{t('sections.view_projects')} <ArrowUpRight className="w-3 h-3" /></Link></div>
        <div className="project-bento">
          {currentProjects.map((project, index) => { const summary = project.problem ? `${project.problem}${project.solution ? ` → ${project.solution}` : ''}` : project.description; const featured = index === 0; return <Link key={project.slug} href={`${base}/projects/${project.slug}`} className={`project-tile ${featured ? 'project-tile-featured' : ''} group`}><div className="project-tile-index">0{index + 1}</div><div className="flex items-start justify-between gap-4"><div><div className="text-lg sm:text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>{project.title}</div>{summary && <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--text-muted)' }}>{summary}</p>}</div><ExternalLink className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: 'var(--text-faint)' }} /></div><div className="flex flex-wrap gap-1.5 mt-6">{project.tags.slice(0, 4).map(tag => <span key={tag} className="workbench-chip">{tag}</span>)}</div></Link> })}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading"><div><div className="workbench-eyebrow mb-2">{t('sections.notes_kicker')}</div><h2 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text)' }}>{t('sections.notes')}</h2><p className="mt-2 text-sm max-w-2xl" style={{ color: 'var(--text-muted)' }}>{t('sections.notes_desc')}</p></div><Link href={`${base}/notes`} className="section-link hidden sm:inline-flex" style={{ color: 'var(--accent)' }}>{t('sections.view_notes')} <ArrowUpRight className="w-3 h-3" /></Link></div>
        <div className="notes-timeline">{latestNotes.map(post => <Link key={post.slug} href={`${base}/posts/${post.slug}`} className="note-row group"><div className="note-marker"><span /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1 text-xs font-mono" style={{ color: 'var(--text-faint)' }}><span>{post.pubDate.slice(0, 10)}</span>{post.readTime && <span>{post.readTime}</span>}{post.tags.slice(0, 2).map(tag => <span key={tag}>{tag}</span>)}</div><h3 className="text-sm sm:text-base font-medium group-hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>{post.title}</h3></div><ArrowUpRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-faint)' }} /></Link>)}</div>
      </section>

      {latestDigest && <section className="digest-feature home-section"><div className="digest-feature-mark">DAILY<br/>SIGNAL</div><div className="relative z-10 max-w-4xl"><div className="workbench-eyebrow mb-2">{t('sections.digest_kicker')}</div><h2 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ color: 'var(--text)' }}>{t('sections.digest')}</h2><p className="text-sm sm:text-base leading-relaxed max-w-3xl" style={{ color: 'var(--text-muted)' }}>{latestDigest.description}</p><div className="mt-5 flex items-center gap-4 text-xs font-mono" style={{ color: 'var(--text-faint)' }}><span>{latestDigest.pubDate.slice(0, 10)}</span><Link href={`${base}/tech-digest`} className="section-link" style={{ color: 'var(--accent)' }}>{t('sections.view_digest')} <ArrowUpRight className="w-3 h-3" /></Link></div></div></section>}

      <section className="home-section philosophy-grid"><div><div className="workbench-eyebrow mb-3">{t('sections.philosophy_kicker')}</div><h2 className="text-2xl sm:text-3xl font-semibold leading-tight mb-4" style={{ color: 'var(--text)' }}>{t('sections.philosophy')}</h2><p className="text-sm sm:text-base leading-relaxed max-w-2xl" style={{ color: 'var(--text-muted)' }}>{t('sections.philosophy_desc')}</p></div><div className="workbench-quote"><div className="text-xs font-mono mb-3" style={{ color: 'var(--accent)' }}>{t('sections.current_question')}</div><p className="text-base sm:text-lg font-medium leading-relaxed" style={{ color: 'var(--text)' }}>{t('sections.question')}</p></div></section>
    </main>
  </div>;
}
