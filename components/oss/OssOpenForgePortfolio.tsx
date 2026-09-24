import portfolioData from '@/src/data/openforge-portfolio.json';
import {
  capabilityRows,
  evidenceLine,
  getVerifiedProjects,
  milestoneLine,
  revisionLink,
  statusLabel,
  type ProjectStatus,
} from '@/lib/oss-openforge-status';

type Locale = 'ko' | 'en';

type Maintenance = {
  maintenance_owner: string;
  maintenance_status: string;
  strategic_role: string;
  blast_radius: string;
  exit_path_status: string;
  review_cadence: string;
};

type Project = {
  id: string;
  name: string;
  category: string;
  development_status: string;
  adoption_percent: number | null;
  role: string;
  impact_score: number;
  repository?: string;
  maintenance?: Maintenance | null;
  status?: ProjectStatus;
};

type Milestone = {
  id: string;
  name: string;
  status: string;
  current?: number;
  target?: number;
  unit?: string;
};

type Dashboard = {
  updated_at: string;
  portfolio: {
    adoption_percent: number;
    standard_maturity_percent: number;
    adr_count: number;
  };
  projects: Project[];
  milestones: Milestone[];
  relationships: unknown[];
  maintenance?: {
    summary: {
      owned_projects: number;
      unowned_projects: number;
      high_blast_radius_projects: number;
      exit_path_review_required: number;
      review_cadence_default: string | null;
    };
  };
};

const portfolio = portfolioData as unknown as Dashboard;

const copy = {
  ko: {
    eyebrow: 'OPENFORGE PORTFOLIO CONTROL PLANE',
    title: '개발 현황과 프로젝트 영향도를 하나의 데이터로 관리합니다.',
    description: '각 OSS가 검증된 상태를 OpenForge에 PR로 제안하고, merge된 registry가 이 화면의 공식 source-of-truth가 됩니다.',
    projects: 'Projects',
    adoption: 'Portfolio Adoption',
    maturity: 'Standard Maturity',
    adrs: 'ADRs',
    maintenance: 'Maintenance Intelligence',
    owned: 'Maintenance Owned',
    highBlast: 'High Blast Radius',
    exitReview: 'Exit Path Review',
    unowned: 'Unowned',
    cadence: 'Review cadence',
    milestones: '현재 Milestone',
    impact: '영향도 상위 프로젝트',
    status: 'Development',
    updated: 'Registry updated',
    source: 'OpenForge registry',
    verifiedStatus: '검증된 상태',
    verifiedStatusDescription: 'OpenForge에 PR로 병합되어 검증까지 완료된 프로젝트만 표시합니다.',
    verifiedMilestone: '마일스톤',
    progress: '진행률',
    evidenceHeader: 'Evidence (CI · Security · Runtime)',
  },
  en: {
    eyebrow: 'OPENFORGE PORTFOLIO CONTROL PLANE',
    title: 'One data model for development state and cross-project impact.',
    description: 'Each OSS proposes verified state through an OpenForge PR. The merged registry is the official source of truth rendered here.',
    projects: 'Projects',
    adoption: 'Portfolio Adoption',
    maturity: 'Standard Maturity',
    adrs: 'ADRs',
    maintenance: 'Maintenance Intelligence',
    owned: 'Maintenance Owned',
    highBlast: 'High Blast Radius',
    exitReview: 'Exit Path Review',
    unowned: 'Unowned',
    cadence: 'Review cadence',
    milestones: 'Current milestones',
    impact: 'Highest-impact projects',
    status: 'Development',
    updated: 'Registry updated',
    source: 'OpenForge registry',
    verifiedStatus: 'Verified status',
    verifiedStatusDescription: 'Only projects with OpenForge-verified, PR-merged state are shown here.',
    verifiedMilestone: 'Milestone',
    progress: 'Progress',
    evidenceHeader: 'Evidence (CI · Security · Runtime)',
  },
} as const;

export function OssOpenForgePortfolio({ locale = 'ko' }: { locale?: Locale }) {
  const t = copy[locale];
  const projects = portfolio.projects.slice();
  const milestones = portfolio.milestones;
  const maintenance = portfolio.maintenance?.summary;
  const topImpact = projects.sort((a, b) => b.impact_score - a.impact_score).slice(0, 6);
  const maxImpact = Math.max(...topImpact.map((project) => project.impact_score), 1);
  const verifiedProjects = getVerifiedProjects(projects);

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

      {maintenance && (
        <div className="mt-7 rounded-2xl p-4 sm:p-5" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-subtle)' }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>{t.maintenance}</div>
            {maintenance.review_cadence_default && <div className="text-[10px] font-mono" style={{ color: 'var(--text-faint)' }}>{t.cadence}: {maintenance.review_cadence_default}</div>}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [t.owned, String(maintenance.owned_projects)],
              [t.highBlast, String(maintenance.high_blast_radius_projects)],
              [t.exitReview, String(maintenance.exit_path_review_required)],
              [t.unowned, String(maintenance.unowned_projects)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl p-3" style={{ border: '1px solid var(--border)' }}>
                <div className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-faint)' }}>{label}</div>
                <div className="mt-1.5 text-xl font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                <div className="mt-1 text-[10px]" style={{ color: 'var(--text-faint)' }}>
                  {t.status}: {statusLabel(project.development_status)} · {project.role}
                  {project.maintenance && ` · ${project.maintenance.strategic_role} · blast ${project.maintenance.blast_radius} · exit ${statusLabel(project.maintenance.exit_path_status)}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {verifiedProjects.length > 0 && (
        <div className="mt-8">
          <div className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>{t.verifiedStatus}</div>
          <p className="mt-2 text-xs leading-6" style={{ color: 'var(--text-muted)' }}>{t.verifiedStatusDescription}</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {verifiedProjects.map((project) => {
              const status = project.status;
              const revision = revisionLink(project);
              const milestone = milestoneLine(status, { milestone: t.verifiedMilestone, progress: t.progress });
              const capabilities = capabilityRows(status);

              return (
                <div key={project.id} className="rounded-xl p-4" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-semibold">{project.name}</div>
                    {revision && (
                      revision.href ? (
                        <a href={revision.href} target="_blank" rel="noreferrer" className="font-mono text-[10px]" style={{ color: 'var(--accent)' }}>{revision.short}</a>
                      ) : (
                        <span className="font-mono text-[10px]" style={{ color: 'var(--text-faint)' }}>{revision.short}</span>
                      )
                    )}
                  </div>
                  {milestone && (
                    <div className="mt-2 text-[11px]" style={{ color: 'var(--text-faint)' }}>{milestone}</div>
                  )}
                  <div className="mt-2 text-[11px]" style={{ color: 'var(--text-faint)' }}>
                    {t.evidenceHeader}: {evidenceLine(status)}
                  </div>
                  {capabilities.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {capabilities.map((row) => (
                        <div key={row.id} className="font-mono text-[10px]" style={{ color: 'var(--text-faint)' }}>
                          {row.id}: {row.line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 border-t pt-4 text-[10px] font-mono" style={{ borderColor: 'var(--border)', color: 'var(--text-faint)' }}>
        {t.updated}: {portfolio.updated_at} · openforge-dashboard/v1 · {portfolio.relationships.length} relationships
      </div>
    </section>
  );
}
