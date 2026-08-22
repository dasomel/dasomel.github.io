import { getTranslations } from 'next-intl/server';
import { getProjects } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { ProjectList } from '@/components/projects/ProjectList';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'work' });
  return { title: t('title') };
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const t = await getTranslations({ locale, namespace: 'work' });
  const projects = getProjects(lang);
  const base = lang === 'en' ? '/en' : '/ko';
  const owned = projects.filter((project) => project.type !== 'fork').length;
  const forks = projects.filter((project) => project.type === 'fork').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-18 slide-enter-content">
      <header className="mb-10 sm:mb-12 border-b pb-8 sm:pb-10" style={{ borderColor: 'var(--border)' }}>
        <div className="workbench-eyebrow mb-3">OSS ENGINEERING PORTFOLIO</div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 lg:gap-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.04em]" style={{ color: 'var(--text)' }}>{t('title')}</h1>
            <p className="text-base sm:text-lg mt-3 max-w-2xl leading-8" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border shrink-0" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--border)' }} aria-label={`${owned} ${t('owned')}, ${forks} ${t('forks_stat')}`}>
            <div className="px-5 py-3.5 sm:py-4 text-center min-w-[8rem]" style={{ backgroundColor: 'var(--surface)' }}><div className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>{owned}</div><div className="text-[10px] mt-1 font-mono tracking-[.12em]" style={{ color: 'var(--text-faint)' }}>{t('owned')}</div></div>
            <div className="px-5 py-3.5 sm:py-4 text-center min-w-[8rem]" style={{ backgroundColor: 'var(--surface)' }}><div className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>{forks}</div><div className="text-[10px] mt-1 font-mono tracking-[.12em]" style={{ color: 'var(--text-faint)' }}>{t('forks_stat')}</div></div>
          </div>
        </div>
      </header>
      <ProjectList
        projects={projects}
        base={base}
        translations={{
          problem: t('problem'),
          solution: t('solution'),
          search: t('search'),
          noResults: t('no_results'),
          results: t('results'),
          clearFilters: t('clear_filters'),
          all: t('all'),
          filter: t('filter'),
          core: t('core'),
          tools: t('tools'),
          forks: t('forks'),
        }}
      />
    </div>
  );
}
