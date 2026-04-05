import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getPosts, getProjects } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Github, Code2, FileText, Users, Star, GitFork } from 'lucide-react';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'home' });
  const recentPosts = getPosts(lang).slice(0, 3);
  const projects = getProjects(lang).slice(0, 4);
  const base = lang === 'en' ? '/en' : '/ko';

  const techStack = ['Kubernetes', 'K-PaaS', 'Terraform', 'Go', 'Docker', 'Prometheus'];

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100">
        {/* dot grid background */}
        <div className="absolute inset-0 [background-image:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
        {/* emerald glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-100 rounded-full opacity-30 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          {/* terminal badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm text-xs font-mono text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Cloud &amp; DevOps Engineer
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
            {t('hero.tagline')}
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              {t('hero.role')}
            </span>
          </h1>

          <p className="text-lg text-gray-500 max-w-xl mb-10 leading-relaxed">
            {t('hero.description')}
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 mb-12">
            <Link href={`${base}/projects`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-emerald-200">
              {t('hero.cta_projects')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`${base}/seminars`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition-colors">
              {t('hero.cta_seminars')}
            </Link>
          </div>

          {/* Tech stack chips */}
          <div className="flex flex-wrap gap-2">
            {techStack.map(tech => (
              <span key={tech}
                className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-mono text-gray-500 shadow-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-20">

        {/* ── Projects ─────────────────────────────────── */}
        <section>
          <SectionHeader
            label={t('sections.projects')}
            href={`${base}/projects`}
            linkLabel={t('sections.view_all')}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {projects.map((project) => (
              <div key={project.slug} className="group relative p-5 bg-white border border-gray-100 rounded-2xl card-lift">
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <Link href={`${base}/projects/${project.slug}`} className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors leading-snug">
                      {project.title}
                    </h3>
                  </Link>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                       className="relative z-10 flex-shrink-0 p-1.5 text-gray-300 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <Link href={`${base}/projects/${project.slug}`} className="block">
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{project.description}</p>
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-md text-xs font-mono text-gray-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── Overview ─────────────────────────────────── */}
        <section>
          <SectionHeader label={t('sections.overview')} />
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { icon: Code2, title: t('overview.oss_title'), desc: t('overview.oss_desc'), color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
              { icon: FileText, title: t('overview.kpaas_title'), desc: t('overview.kpaas_desc'), color: 'text-blue-600 bg-blue-50 border-blue-100' },
              { icon: Users, title: t('overview.community_title'), desc: t('overview.community_desc'), color: 'text-purple-600 bg-purple-50 border-purple-100' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recent Posts ─────────────────────────────── */}
        {recentPosts.length > 0 && (
          <section>
            <SectionHeader
              label={t('sections.recent')}
              href={`${base}/posts`}
              linkLabel={t('sections.view_all')}
            />
            <div className="space-y-2">
              {recentPosts.map((post) => (
                <Link key={post.slug} href={`${base}/posts/${post.slug}`}
                  className="group flex items-start justify-between gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-emerald-100 hover:bg-emerald-50/30 transition-all card-lift">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors mb-1 truncate">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="text-gray-500 text-sm line-clamp-1">{post.description}</p>
                    )}
                    {post.tags.length > 0 && (
                      <div className="flex gap-1.5 mt-2">
                        {post.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-md text-xs font-mono text-gray-500">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <time className="flex-shrink-0 font-mono text-xs text-gray-400 mt-0.5">{post.pubDate.slice(0, 10)}</time>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ label, href, linkLabel }: { label: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-mono text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
      {href && linkLabel && (
        <Link href={href} className="flex items-center gap-1 font-mono text-xs text-gray-400 hover:text-emerald-600 transition-colors whitespace-nowrap">
          {linkLabel}
          <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}
