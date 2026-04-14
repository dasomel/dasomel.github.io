import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getPosts, getProjects, getSeminars, getPostBySlug } from '@/lib/content';
import { ArrowUpRight } from 'lucide-react';
import { routing } from '@/i18n/routing';
import { ImpactStats } from '@/components/ui/impact-stats';
import { FeaturedCard } from '@/components/ui/featured-card';
import readingTime from 'reading-time';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'home' });
  const isEn = lang === 'en';
  const base = lang === 'en' ? '/en' : '/ko';

  const allPosts = getPosts(lang).slice(0, 4);
  const seminars = getSeminars(lang);
  const projects = getProjects(lang);

  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
  const featuredSeminars = seminars.filter(s => s.featured).slice(0, 3);

  const postsWithReadTime = allPosts.map(post => {
    const detail = getPostBySlug(post.slug, lang);
    const rt = detail ? readingTime(detail.content) : null;
    return { ...post, readTime: rt ? `${Math.ceil(rt.minutes)} min` : '' };
  });

  const featuredPost = postsWithReadTime.find(p => p.featured);
  const regularPosts = postsWithReadTime.filter(p => !p.featured).slice(0, 3);

  const yearsActive = new Date().getFullYear() - 2011;

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Diagonal grid */}
        <div className="absolute inset-0 grid-bg" />
        {/* Radial emerald glow */}
        <div className="absolute inset-0 hero-glow" />
        {/* Vignette */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, var(--bg) 90%)' }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-28 sm:py-36">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full text-xs font-mono"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t('hero.tagline')}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.08]"
            style={{ letterSpacing: '-0.03em', color: 'var(--text)' }}>
            {t('hero.headline_1')}
            <span style={{ color: 'var(--accent)' }}>{t('hero.headline_accent')}</span>
            {t('hero.headline_2', { years: yearsActive }).split('\n').map((line, i) => (
              i === 0 ? line : <span key={i}><br />{line}</span>
            ))}
          </h1>

          <p className="text-base sm:text-lg mb-10 max-w-lg leading-relaxed"
            style={{ color: 'var(--text-muted)' }}>
            {t('hero.description')}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-12">
            <Link href={`${base}/projects`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
              {t('hero.cta_work')}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link href={`${base}/seminars`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-hi)', color: 'var(--text)' }}>
              {t('hero.cta_speaking')}
            </Link>
          </div>

          {/* Tech chips */}
          <div className="flex flex-wrap gap-2">
            {['Kubernetes', 'K-PaaS', 'Terraform', 'ArgoCD', 'Go', 'Prometheus'].map(tech => (
              <span key={tech}
                className="px-2.5 py-1 rounded-lg text-xs font-mono"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact Bar ─────────────────────────────────── */}
      <ImpactStats stats={[
        { value: `${seminars.length}+`, label: t('stats.talks') },
        { value: `${yearsActive}yr`, label: t('stats.experience') },
        { value: `${projects.length}+`, label: t('stats.projects') },
      ]} />

      {/* ── Content ────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-20 slide-enter-content">

        {/* Featured Work */}
        {featuredProjects.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
                {t('sections.featured_work')}
              </h2>
              <Link href={`${base}/projects`}
                className="inline-flex items-center gap-1 text-xs font-mono transition-colors hover:opacity-80"
                style={{ color: 'var(--accent)' }}>
                {t('sections.view_all')} <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {featuredProjects.map((project) => (
                <div key={project.slug} className="card-outline card-glow group">
                  <div className="relative p-5">
                    <Link href={`${base}/projects/${project.slug}`}>
                      <h3 className="font-semibold text-sm mb-2 transition-colors group-hover:text-emerald-400"
                        style={{ color: 'var(--text)' }}>
                        {project.title}
                      </h3>
                      {project.problem && (
                        <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
                          {project.problem} → {project.solution}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 text-xs font-mono rounded"
                            style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Speaking Highlights */}
        {featuredSeminars.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
                {t('sections.speaking')}
              </h2>
              <Link href={`${base}/seminars`}
                className="inline-flex items-center gap-1 text-xs font-mono transition-colors hover:opacity-80"
                style={{ color: 'var(--accent)' }}>
                {t('sections.view_all')} <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid gap-2">
              {featuredSeminars.map((seminar) => (
                <div key={seminar.slug} className="card-outline card-glow group block p-4">
                  <div className="relative flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[8px] font-mono flex-shrink-0"
                      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>
                      {seminar.event.substring(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <Link href={`${base}/seminars/${seminar.slug}`}>
                        <h3 className="text-sm font-medium transition-colors group-hover:text-emerald-400"
                          style={{ color: 'var(--text)' }}>
                          {seminar.title}
                        </h3>
                      </Link>
                      <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
                        {seminar.event} · {seminar.date.slice(0, 4)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Latest Posts */}
        {allPosts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
                {t('sections.latest_posts')}
              </h2>
              <Link href={`${base}/posts`}
                className="inline-flex items-center gap-1 text-xs font-mono transition-colors hover:opacity-80"
                style={{ color: 'var(--accent)' }}>
                {t('sections.view_all')} <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {featuredPost && (
              <FeaturedCard badge={isEn ? 'Featured' : '추천'}>
                <Link href={`${base}/posts/${featuredPost.slug}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{featuredPost.readTime}</span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1 transition-colors hover:text-emerald-400"
                    style={{ color: 'var(--text)' }}>
                    {featuredPost.title}
                  </h3>
                  {featuredPost.description && (
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{featuredPost.description}</p>
                  )}
                </Link>
              </FeaturedCard>
            )}

            <div className="grid gap-2">
              {regularPosts.map((post) => (
                <Link key={post.slug} href={`${base}/posts/${post.slug}`}
                  className="card-outline card-glow group block">
                  <div className="relative flex items-start justify-between gap-4 p-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate transition-colors group-hover:text-emerald-400 mb-1"
                        style={{ color: 'var(--text)' }}>
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {post.tags.length > 0 && (
                          <div className="flex gap-1.5">
                            {post.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{tag}</span>
                            ))}
                          </div>
                        )}
                        {post.readTime && (
                          <span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{post.readTime}</span>
                        )}
                      </div>
                    </div>
                    <time className="text-xs font-mono flex-shrink-0"
                      style={{ color: 'var(--text-faint)' }}>
                      {post.pubDate.slice(0, 10)}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
