import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getPosts, getProjects } from '@/lib/content';
import { ArrowUpRight, Github } from 'lucide-react';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'home' });
  const recentPosts = getPosts(lang).slice(0, 4);
  const projects = getProjects(lang).slice(0, 4);
  const base = lang === 'en' ? '/en' : '/ko';
  const isEn = lang === 'en';

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
            Cloud &amp; DevOps Engineer
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.08]"
            style={{ letterSpacing: '-0.03em', color: 'var(--text)' }}>
            {isEn ? (
              <>Building<br />
                <span style={{ color: 'var(--accent)' }}>Cloud-Native</span><br />
                Infrastructure
              </>
            ) : (
              <>클라우드 네이티브<br />
                <span style={{ color: 'var(--accent)' }}>인프라를 코드로</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg mb-10 max-w-lg leading-relaxed"
            style={{ color: 'var(--text-muted)' }}>
            {isEn
              ? 'K-PaaS contributor · Kubernetes · Terraform · Open source community leader'
              : 'K-PaaS 컨트리뷰터 · Kubernetes · Terraform · 오픈소스 커뮤니티 리더'}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-12">
            <Link href={`${base}/projects`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
              {t('hero.cta_projects')}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link href={`${base}/posts`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-hi)', color: 'var(--text)' }}>
              {isEn ? 'Read blog' : '블로그 읽기'}
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

      {/* ── Content ────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-20 slide-enter-content">

        {/* Projects */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
              {t('sections.projects')}
            </h2>
            <Link href={`${base}/projects`}
              className="inline-flex items-center gap-1 text-xs font-mono transition-colors hover:opacity-80"
              style={{ color: 'var(--accent)' }}>
              {t('sections.view_all')} <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {projects.map((project) => (
              <div key={project.slug} className="card-outline card-glow group">
                <div className="relative p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Link href={`${base}/projects/${project.slug}`} className="flex-1">
                      <h3 className="font-semibold text-sm leading-snug transition-colors group-hover:text-emerald-400"
                        style={{ color: 'var(--text)' }}>
                        {project.title}
                      </h3>
                    </Link>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                         className="flex-shrink-0 p-1 rounded-md transition-opacity hover:opacity-60"
                         style={{ color: 'var(--text-faint)' }}>
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <Link href={`${base}/projects/${project.slug}`}>
                    <p className="text-xs leading-relaxed mb-3 line-clamp-2"
                      style={{ color: 'var(--text-muted)' }}>
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map(tag => (
                        <span key={tag}
                          className="px-1.5 py-0.5 text-xs font-mono rounded"
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

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
                {t('sections.recent')}
              </h2>
              <Link href={`${base}/posts`}
                className="inline-flex items-center gap-1 text-xs font-mono transition-colors hover:opacity-80"
                style={{ color: 'var(--accent)' }}>
                {t('sections.view_all')} <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid gap-2">
              {recentPosts.map((post) => (
                <Link key={post.slug} href={`${base}/posts/${post.slug}`}
                  className="card-outline card-glow group block">
                  <div className="relative flex items-start justify-between gap-4 p-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate transition-colors group-hover:text-emerald-400 mb-1"
                        style={{ color: 'var(--text)' }}>
                        {post.title}
                      </h3>
                      {post.tags.length > 0 && (
                        <div className="flex gap-1.5">
                          {post.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{tag}</span>
                          ))}
                        </div>
                      )}
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

        {/* OSS */}
        <section>
          <h2 className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: 'var(--text-faint)' }}>
            {isEn ? 'Open Source' : '오픈소스 기여'}
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { name: 'K-PaaS', desc: isEn ? 'Korean gov PaaS platform' : '공공 클라우드 플랫폼', url: 'https://github.com/K-PaaS' },
              { name: 'Harbor', desc: isEn ? 'Fork · ARM support' : '포크 · ARM 아키텍처 지원', url: 'https://github.com/goharbor/harbor' },
              { name: 'Terraboard', desc: isEn ? 'Fork · Latest Terraform' : '포크 · 최신 Terraform 적용', url: 'https://github.com/camptocamp/terraboard' },
            ].map(item => (
              <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer"
                 className="card-outline card-glow group block p-4">
                <div className="relative">
                  <p className="text-sm font-semibold mb-1 transition-colors group-hover:text-emerald-400"
                    style={{ color: 'var(--text)' }}>
                    {item.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
