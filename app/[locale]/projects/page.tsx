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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 slide-enter-content">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
        {t('title')}
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        {t('subtitle')}
      </p>
      <ProjectList
        projects={projects}
        base={base}
        translations={{
          problem: t('problem'),
          solution: t('solution'),
        }}
      />
    </div>
  );
}
