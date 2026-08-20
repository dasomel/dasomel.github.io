import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getPosts, getProjects, getSeminars, getPostBySlug } from '@/lib/content';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { routing } from '@/i18n/routing';
import { ImpactStats } from '@/components/ui/impact-stats';
import readingTime from 'reading-time';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'home' });
  const base = lang === 'en' ? '/en' : '/ko';
  const posts = getPosts(lang);
  const projects = getProjects(lang);
  const seminars = getSeminars(lang);
  const currentProjects = projects.filter((project) => project.featured).slice(0, 4);
  const latestPosts = posts.slice(0, 5).map((post) => {
    const detail = getPostBySlug(post.slug, lang);
    const rt = detail ? readingTime(detail.content) : null;
    return { ...post, readTime: rt ? `${Math.ceil(rt.minutes)} min` : '' };
  });
  const yearsActive = new Date().getFullYear() - 2011;

  return (
    <div>
      <section className="relative overflow-hidden border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 hero-glow" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-10 lg:gap-14 items-center">
            <div className="max-w-3xl">
              <div className="workbench-eyebrow mb-6">{t('hero.eyebrow')}</div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.08] mb-6" style={{ color: 'var(--text)' }}>
                {t('hero.headline_1')}
                <span style={{ color: 'var(--accent)' }}>{t('hero.headline_accent')}</span>
                {t('hero.headline_2')}
              </h1>
              <p className="text-base sm:text-lg max-w-2xl leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>{t('hero.description')}</p>
              <div className="flex flex-wrap gap-3">
                <Link href={`${base}/projects`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                  {t('hero.cta_projects')} <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link href={`${base}/posts`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-hi)', color: 'var(--text)' }}>
                  {t('hero.cta_notes')} <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
              <img src="/images/workbench-hero.svg" alt="OSS engineering workbench visual" className="block w-full h-auto" loading="eager" />
            </div>
          </div>
        </div>
      </section>

      <ImpactStats stats={[
        { value: `${yearsActive}yr`, label: t('stats.experience') },
        { value: `${projects.length}`, label: t('stats.projects') },
        { value: `${seminars.length}+`, label: t('stats.talks') },
      ]} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-20 space-y-20">
        <section>
          <div className="flex items-end justify-between gap-4 mb-7">
            <div><div className="workbench-eyebrow mb-2">{t('sections.now_kicker')}</div><h2 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text)' }}>{t('sections.now')}</h2><p className="mt-2 text-sm max-w-2xl" style={{ color: 'var(--text-muted)' }}>{t('sections.now_desc')}</p></div>
            <Link href={`${base}/projects`} className="hidden sm:inline-flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--accent)' }}>{t('sections.view_projects')} <ArrowUpRight className="w-3 h-3" /></Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {currentProjects.map((project) => (
              <Link key={project.slug} href={`${base}/projects/${project.slug}`} className="workbench-card group">
                <div className="flex items-start justify-between gap-4"><div><div className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>{project.title}</div>{project.problem && <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{project.problem} → {project.solution}</p>}</div><ExternalLink className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: 'var(--text-faint)' }} /></div>
                <div className="flex flex-wrap gap-1.5 mt-5">{project.tags.slice(0, 4).map((tag) => <span key={tag} className="workbench-chip">{tag}</span>)}</div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4 mb-7">
            <div><div className="workbench-eyebrow mb-2">{t('sections.notes_kicker')}</div><h2 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text)' }}>{t('sections.notes')}</h2><p className="mt-2 text-sm max-w-2xl" style={{ color: 'var(--text-muted)' }}>{t('sections.notes_desc')}</p></div>
            <Link href={`${base}/posts`} className="hidden sm:inline-flex items-center gap-1 text-xs font-mono" style={{ color: 'var(--accent)' }}>{t('sections.view_notes')} <ArrowUpRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-2">{latestPosts.map((post) => <Link key={post.slug} href={`${base}/posts/${post.slug}`} className="workbench-note group"><div className="min-w-0"><h3 className="text-sm sm:text-base font-medium mb-1 group-hover:text-emerald-600" style={{ color: 'var(--text)' }}>{post.title}</h3><div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono" style={{ color: 'var(--text-faint)' }}><span>{post.pubDate.slice(0, 10)}</span>{post.readTime && <span>{post.readTime}</span>}{post.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div></div><ArrowUpRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-faint)' }} /></Link>)}</div>
        </section>

        <section className="grid lg:grid-cols-[1.4fr_1fr] gap-10 pt-2">
          <div><div className="workbench-eyebrow mb-3">{t('sections.philosophy_kicker')}</div><h2 className="text-2xl sm:text-3xl font-semibold leading-tight mb-4" style={{ color: 'var(--text)' }}>{t('sections.philosophy')}</h2><p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>{t('sections.philosophy_desc')}</p></div>
          <div className="workbench-quote"><div className="text-xs font-mono mb-3" style={{ color: 'var(--accent)' }}>{t('sections.current_question')}</div><p className="text-base sm:text-lg font-medium leading-relaxed" style={{ color: 'var(--text)' }}>{t('sections.question')}</p></div>
        </section>
      </main>
    </div>
  );
}
