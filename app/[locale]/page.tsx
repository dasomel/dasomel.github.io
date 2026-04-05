import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getPosts, getProjects } from '@/lib/content';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Code2, FileText, Users } from 'lucide-react';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'home' });
  const recentPosts = getPosts(lang).slice(0, 3);
  const projects = getProjects(lang).slice(0, 2);
  const base = lang === 'en' ? '/en' : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero */}
      <section className="mb-20 pt-4 relative" style={{ backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
        <div className="inline-block mb-8">
          <div className="bg-gray-100 rounded-t-lg px-3 py-2 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          </div>
          <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg px-4 py-2.5">
            <p className="font-mono text-xs text-gray-500">$ whoami<span className="cursor-blink inline-block ml-0.5 text-emerald-500">▋</span></p>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
          {t('hero.tagline')}<br />
          <span className="text-emerald-600">{t('hero.role')}</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-10">{t('hero.description')}</p>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href={`${base}/projects`}>{t('hero.cta_projects')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`${base}/seminars`}>{t('hero.cta_seminars')}</Link>
          </Button>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-mono text-xs text-gray-400 whitespace-nowrap">{t('sections.projects')}</h2>
          <div className="flex-1 border-t border-dashed border-gray-200" />
          <Link href={`${base}/projects`} className="font-mono text-xs text-gray-400 hover:text-emerald-600 transition-colors whitespace-nowrap">
            {t('sections.view_all')}
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Card key={project.slug} className="p-5 hover:border-gray-200 hover:border-l-emerald-500 hover:shadow-sm group">
              <div className="flex items-start justify-between mb-2">
                <Link href={`${base}/projects/${project.slug}`} className="flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{project.title}</h3>
                </Link>
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                     className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
              <p className="text-sm text-gray-500">{project.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Overview */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-mono text-xs text-gray-400 whitespace-nowrap">{t('sections.overview')}</h2>
        <div className="flex-1 border-t border-dashed border-gray-200" />
      </div>
      <section className="grid md:grid-cols-3 gap-4 mb-20">
        {[
          { icon: Code2, title: t('overview.oss_title'), desc: t('overview.oss_desc') },
          { icon: FileText, title: t('overview.kpaas_title'), desc: t('overview.kpaas_desc') },
          { icon: Users, title: t('overview.community_title'), desc: t('overview.community_desc') },
        ].map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="p-6">
            <div className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm">{desc}</p>
          </Card>
        ))}
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-mono text-xs text-gray-400 whitespace-nowrap">{t('sections.recent')}</h2>
            <div className="flex-1 border-t border-dashed border-gray-200" />
            <Link href={`${base}/posts`} className="font-mono text-xs text-gray-400 hover:text-emerald-600 transition-colors whitespace-nowrap">
              {t('sections.view_all')}
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <Link key={post.slug} href={`${base}/posts/${post.slug}`}
                className="block p-5 bg-white border border-gray-100 rounded-xl hover:border-l-emerald-500 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{post.title}</h3>
                    {post.description && <p className="text-gray-500 text-sm mt-1 line-clamp-1">{post.description}</p>}
                  </div>
                  <time className="font-mono text-xs text-gray-400 whitespace-nowrap">{post.pubDate.slice(0, 10)}</time>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
