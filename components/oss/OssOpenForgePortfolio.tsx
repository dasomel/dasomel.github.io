import portfolio from '@/src/data/openforge-portfolio.json';

type Locale = 'ko' | 'en';

type Project = {
  id: string;
  name: string;
  category: string;
  development_status: string;
  adoption_percent: number | null;
  role: string;
  impact_score: number;
};

type Milestone = {
  id: string;
  name: string;
  status: string;
  current?: number;
  target?: number;
  unit?: string;
};

const copy = {
  ko: {
    eyebrow: 'OPENFORGE PORTFOLIO CONTROL PLANE',
    title: '개발 현황과 프로젝트 영향도를 하나의 데이터로 관리합니다.',
    description: '각 OSS가 검증된 상태를 OpenForge에 PR로 제안하고, merge된 registry가 이 화면의 공식 source-of-truth가 됩니다.',
    projects: 'Projects',
    adoption: 'Portfolio Adoption',
    maturity: 'Standard Maturity',
    adrs: 'ADRs',
    milestones: '현재 Milestone',
    impact: '영향도 상위 프로젝트',
    status: 'Development',
    updated: 'Registry updated',
    source: 'OpenForge registry',
  },
  en: {
    eyebrow: 'OPENFORGE PORTFOLIO CONTROL PLANE',
    title: 'One data model for development state and cross-project impact.',
    description: 'Each OSS proposes verified state through an OpenForge PR. The merged registry is the official source of truth rendered here.',
    projects: 'Projects',
    adoption: 'Portfolio Adoption',
    maturity: 'Standard Maturity',
    adrs: 'ADRs',
    milestones: 'Current milestones',
    impact: 'Highest-impact projects',
    status: 'Development',
    updated: 'Registry updated',
    source: 'OpenForge registry',
  },
} as const;

function statusLabel(value: string) {
  return value.replaceAll('-', ' ');
}

export function OssOpenForgePortfolio({ locale = 'ko' }: { locale?: Locale }) {
  const t = copy[locale];
  const projects = (portfolio.projects as Project[]).slice();
  const milestones = portfolio.milestones as Milestone[];
  const topImpact = projects.sort((a, b) => b.impact_score - a.impact_score).slice(0, 6);
  const maxImpact = Math.max(...topImpact.map((project) => project.impact_score), 1);

  return (
    <section className="mt-14 rounded-3xl p-6 sm:p-8" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-3xl">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--accent)' }}>{t.eyebrow}</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">{t.title}</h2>
          <p className="mt-3 text-sm leading-7" style={{ color: 'var(--text-muted)' }}>{t.description}</p>
        </div>
        <a href="https://github.com/dasomel/openforge/blob/main/PORTFOLIO.md" target="_blank" rel="noreferrer" className="rounded-full px-4 py-2 text-xs font-semibold" style={{ border: '1px solid var(--border-hi)', color: 'var(--accent)' }}>{t.source} →</a>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [t.projects, String(portfolio.projects.length)],
          [t.adoption, `${portfolio.portfolio.adoption_percent}%`],
          [t.maturity, `${portfolio.portfolio.standard_maturity_percent}%`],
          [t.adrs, String(portfolio.portfolio.adr_count)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl p-4" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-subtle)' }}>
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-faint)' }}>{label}</div>
            <div className="mt-2 text-2xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>{t.milestones}</div>
          <div className="mt-3 space-y-3">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="rounded-xl p-4" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-semibold">{milestone.name}</div>
                  <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase" style={{ backgroundColor: 'var(--surface-hi)', color: 'var(--text-faint)' }}>{statusLabel(milestone.status)}</span>
                </div>
                {typeof milestone.current === 'number' && typeof milestone.target === 'number' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px]" style={{ color: 'var(--text-faint)' }}><span>{milestone.current}{milestone.unit}</span><span>{milestone.target}{milestone.unit}</span></div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--surface-hi)' }}><div className="h-full rounded-full" style={{ width: `${Math.min(100, (milestone.current / milestone.target) * 100)}%`, backgroundColor: 'var(--accent)' }} /></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>{t.impact}</div>
          <div className="mt-3 space-y-3">
            {topImpact.map((project) => (
              <div key={project.id}>
                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="font-semibold">{project.name}</span>
                  <span style={{ color: 'var(--text-faint)' }}>{project.impact_score}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--surface-hi)' }}><div className="h-full rounded-full" style={{ width: `${(project.impact_score / maxImpact) * 100}%`, backgroundColor: 'var(--signal)' }} /></div>
                <div className="mt-1 text-[10px]" style={{ color: 'var(--text-faint)' }}>{t.status}: {statusLabel(project.development_status)} · {project.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-4 text-[10px] font-mono" style={{ borderColor: 'var(--border)', color: 'var(--text-faint)' }}>
        {t.updated}: {portfolio.updated_at} · openforge-dashboard/v1 · {portfolio.relationships.length} relationships
      </div>
    </section>
  );
}
