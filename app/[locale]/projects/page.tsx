import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getProjects } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">{t('title')}</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Card key={project.slug} className="p-5 hover:border-gray-200 hover:border-l-emerald-500 hover:shadow-sm group">
            <div className="flex items-start justify-between mb-2">
              <Link href={`${base}/projects/${project.slug}`} className="flex-1">
                <h2 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                  {project.type === 'fork' && <GitFork className="w-4 h-4 text-gray-400" />}
                  {project.title}
                </h2>
              </Link>
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                   className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
