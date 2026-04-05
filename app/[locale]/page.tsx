import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getPosts, getProjects } from '@/lib/content';
import { ArrowUpRight } from 'lucide-react';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'home' });
  const recentPosts = getPosts(lang).slice(0, 5);
  const projects = getProjects(lang).slice(0, 6);
  const base = lang === 'en' ? '/en' : '/ko';
  const isEn = lang === 'en';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 slide-enter-content">

      {/* ── Bio ─────────────────────────────────────── */}
      <section className="mb-16">
        <h1 className="text-2xl font-semibold mb-4 tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          dasomel
        </h1>
        <div className="space-y-2 text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          <p>
            {isEn
              ? 'Cloud & DevOps Engineer. Open source contributor focused on K-PaaS, Kubernetes, and cloud-native infrastructure.'
              : 'Cloud & DevOps 엔지니어. K-PaaS, Kubernetes, 클라우드 네이티브 인프라에 집중하는 오픈소스 컨트리뷰터.'}
          </p>
          <p>
            {isEn
              ? <>Adjunct Professor at <span style={{ color: 'var(--text)' }}>TUK</span>. OPA &amp; OPDC leader. Currently working on <span style={{ color: 'var(--accent)' }}>K-PaaS</span> contributions.</>
              : <><span style={{ color: 'var(--text)' }}>한국공학대학교</span> 겸임교수. OPA &amp; OPDC 리더. 현재 <span style={{ color: 'var(--accent)' }}>K-PaaS</span> 오픈소스 기여 중.</>
            }
          </p>
        </div>

        {/* Tech stack — antfu style chips */}
        <div className="flex flex-wrap gap-1.5 mt-5">
          {['Kubernetes', 'K-PaaS', 'Terraform', 'Go', 'Docker', 'Prometheus', 'ArgoCD'].map(tech => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs font-mono rounded"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────── */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
            {t('sections.projects')}
          </h2>
          <Link href={`${base}/projects`} className="text-xs font-mono flex items-center gap-0.5 hover:opacity-80 transition-opacity" style={{ color: 'var(--accent)' }}>
            {t('sections.view_all')} <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-0" style={{ borderTop: '1px solid var(--border)' }}>
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`${base}/projects/${project.slug}`}
              className="group flex items-start justify-between gap-4 py-3.5 transition-colors"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div className="flex-1 min-w-0">
                <span
                  className="text-sm font-medium group-hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--text)' }}
                >
                  {project.title}
                </span>
                {project.description && (
                  <span className="text-sm ml-2 hidden sm:inline" style={{ color: 'var(--text-faint)' }}>
                    — {project.description.length > 60 ? project.description.slice(0, 60) + '…' : project.description}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {project.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent Posts ─────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-faint)' }}>
              {t('sections.recent')}
            </h2>
            <Link href={`${base}/posts`} className="text-xs font-mono flex items-center gap-0.5 hover:opacity-80 transition-opacity" style={{ color: 'var(--accent)' }}>
              {t('sections.view_all')} <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-0" style={{ borderTop: '1px solid var(--border)' }}>
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`${base}/posts/${post.slug}`}
                className="group flex items-baseline justify-between gap-4 py-3 transition-colors"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <span
                  className="text-sm group-hover:opacity-70 transition-opacity flex-1 min-w-0 truncate"
                  style={{ color: 'var(--text)' }}
                >
                  {post.title}
                </span>
                <time className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--text-faint)' }}>
                  {post.pubDate.slice(0, 10)}
                </time>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── OSS contributions ────────────────────────── */}
      <section>
        <h2 className="text-xs font-mono uppercase tracking-widest mb-5" style={{ color: 'var(--text-faint)' }}>
          {isEn ? 'Open Source' : '오픈소스'}
        </h2>
        <div className="space-y-0" style={{ borderTop: '1px solid var(--border)' }}>
          {[
            { name: 'K-PaaS', desc: isEn ? 'Korean government PaaS platform' : '공공 클라우드 플랫폼', url: 'https://github.com/K-PaaS' },
            { name: 'Harbor (fork)', desc: isEn ? 'ARM architecture support' : 'ARM 아키텍처 지원', url: 'https://github.com/goharbor/harbor' },
            { name: 'Terraboard (fork)', desc: isEn ? 'Latest Terraform version support' : '최신 Terraform 버전 적용', url: 'https://github.com/camptocamp/terraboard' },
          ].map(item => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline justify-between gap-4 py-3 transition-opacity hover:opacity-70"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item.name}</span>
              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{item.desc}</span>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
