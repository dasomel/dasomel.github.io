import { getTranslations } from 'next-intl/server';
import { getProjects } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { ProjectList } from '@/components/projects/ProjectList';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
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

  return (
    <main>
      <section className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16 lg:py-16">
          <div className="font-mono text-xs font-medium tracking-[0.12em]" style={{ color: 'var(--accent)' }}>OSS ENGINEERING PORTFOLIO</div>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl" style={{ color: 'var(--text)' }}>
            {lang === 'en' ? 'Projects are decision records, not screenshots.' : '프로젝트는 결과가 아니라 의사결정 기록입니다.'}
          </h1>
          <p className="mt-5 max-w-5xl text-base leading-7 sm:text-lg" style={{ color: 'var(--text-muted)' }}>
            {lang === 'en'
              ? 'Each project is organized so it can be read as Problem → Response → Evidence → Notes.'
              : '각 프로젝트를 Problem → Response → Evidence → Notes 구조로 읽을 수 있도록 정리합니다.'}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-12 lg:px-16">
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
      </section>
    </main>
  );
}
