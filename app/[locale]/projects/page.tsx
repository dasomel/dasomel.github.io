import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getProjects } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { Github, GitFork } from 'lucide-react';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'projects' });
  const projects = getProjects(lang);
  const base = lang === 'en' ? '/en' : '/ko';

  const own = projects.filter(p => p.type !== 'fork');
  const forks = projects.filter(p => p.type === 'fork');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {t('title')}
        </h1>
      </div>

      <div className="space-y-12 slide-enter-content">
        {/* Own projects */}
        {own.length > 0 && (
          <section>
            <h2 className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>
              {lang === 'en' ? 'Projects' : '프로젝트'}
            </h2>
            <div style={{ borderTop: '1px solid var(--border)' }}>
              {own.map(project => (
                <div key={project.slug} className="flex items-start justify-between gap-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <Link href={`${base}/projects/${project.slug}`}
                      className="text-sm font-medium hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--text)' }}>
                      {project.title}
                    </Link>
                    {project.description && (
                      <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
                    )}
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-xs font-mono px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-faint)', border: '1px solid var(--border)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                       className="flex-shrink-0 p-1.5 rounded-md transition-opacity hover:opacity-70"
                       style={{ color: 'var(--text-muted)' }}>
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Fork projects */}
        {forks.length > 0 && (
          <section>
            <h2 className="text-xs font-mono uppercase tracking-widest mb-4 flex items-center gap-1.5" style={{ color: 'var(--text-faint)' }}>
              <GitFork className="w-3 h-3" />
              {lang === 'en' ? 'Forks' : '포크'}
            </h2>
            <div style={{ borderTop: '1px solid var(--border)' }}>
              {forks.map(project => (
                <div key={project.slug} className="flex items-start justify-between gap-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <Link href={`${base}/projects/${project.slug}`}
                      className="text-sm font-medium hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--text)' }}>
                      {project.title}
                    </Link>
                    {project.description && (
                      <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
                    )}
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-xs font-mono px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-faint)', border: '1px solid var(--border)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                       className="flex-shrink-0 p-1.5 rounded-md transition-opacity hover:opacity-70"
                       style={{ color: 'var(--text-muted)' }}>
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
