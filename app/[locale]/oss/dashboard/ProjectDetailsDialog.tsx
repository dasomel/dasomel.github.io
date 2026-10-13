'use client';

import { useEffect, useRef } from 'react';
import { ArrowDownRight, ArrowUpRight, ExternalLink, GitBranch, X } from 'lucide-react';

type Project = {
  id: string;
  name: string;
  repository: string;
  category: string;
  archetype: string;
  development_status: string;
  adoption_percent: number | null;
  impact_score: number;
  domains: string[];
  maintenance: {
    blast_radius: string;
    maintenance_owner: string;
    strategic_role: string;
    exit_path_status: string;
    review_cadence: string;
  };
};

type Relation = {
  source: string;
  target: string;
  type: string;
  impact: string;
};

type Props = {
  locale: 'ko' | 'en';
  project: Project | null;
  projects: Project[];
  relationships: Relation[];
  onClose: () => void;
  onSelectProject: (id: string) => void;
  categoryLabel: (category: string) => string;
  roleLabel: (role: string) => string;
  statusLabel: (status: string) => string;
  impactLabel: (impact: string) => string;
  relationLabel: (relation: string) => string;
};

const copy = {
  ko: {
    eyebrow: '프로젝트 상세 정보',
    close: '상세 정보 닫기',
    category: '분류',
    role: '프로젝트 역할',
    status: '개발 상태',
    adoption: '도입률',
    impact: '영향 범위',
    impactScore: '영향도 점수',
    owner: '유지보수 담당자',
    strategicRole: '전략적 역할',
    review: '운영 종료 경로 검토',
    reviewCadence: '검토 주기',
    quarterly: '분기별',
    reviewRequired: '검토 필요',
    enabler: '기반 제공',
    differentiator: '차별화',
    experiment: '실험',
    utility: '유틸리티',
    domains: '기술 영역',
    relationships: '관련 프로젝트',
    relationshipsHint: '연결된 프로젝트를 선택하면 해당 상세 정보로 이동합니다.',
    outbound: '연결 대상',
    inbound: '연결 출처',
    noRelations: '등록된 프로젝트 관계가 없습니다.',
    none: '정보 없음',
    openRepo: 'GitHub 저장소 열기',
    snapshot: 'OpenForge 포트폴리오 스냅샷 기준 데이터',
  },
  en: {
    eyebrow: 'Project Details',
    close: 'Close project details',
    category: 'Category',
    role: 'Project Role',
    status: 'Development Status',
    adoption: 'Adoption',
    impact: 'Blast Radius',
    impactScore: 'Impact Score',
    owner: 'Maintenance Owner',
    strategicRole: 'Strategic Role',
    review: 'Exit-path Review',
    reviewCadence: 'Review Cadence',
    quarterly: 'Quarterly',
    reviewRequired: 'Review required',
    enabler: 'Enabler',
    differentiator: 'Differentiator',
    experiment: 'Experiment',
    utility: 'Utility',
    domains: 'Technical Domains',
    relationships: 'Related Projects',
    relationshipsHint: 'Select a connected project to view its details.',
    outbound: 'Connects to',
    inbound: 'Connected from',
    noRelations: 'No project relationships are registered.',
    none: 'Not available',
    openRepo: 'Open GitHub Repository',
    snapshot: 'OpenForge portfolio snapshot data',
  },
} as const;

export default function ProjectDetailsDialog({
  locale,
  project,
  projects,
  relationships,
  onClose,
  onSelectProject,
  categoryLabel,
  roleLabel,
  statusLabel,
  impactLabel,
  relationLabel,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = Boolean(project);
  const t = copy[locale];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const connected = project
    ? relationships
        .filter((relation) => relation.source === project.id || relation.target === project.id)
        .map((relation) => {
          const outbound = relation.source === project.id;
          const otherId = outbound ? relation.target : relation.source;
          return { relation, outbound, other: projects.find((candidate) => candidate.id === otherId) };
        })
    : [];

  const strategicRoles: Record<string, string> = {
    enabler: t.enabler,
    differentiator: t.differentiator,
    experiment: t.experiment,
    utility: t.utility,
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="portfolio-project-detail-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="fixed inset-y-0 right-0 left-auto m-0 h-[100dvh] max-h-[100dvh] w-full max-w-[680px] overflow-y-auto border-l border-[#435477] bg-[#142038] p-0 text-white shadow-2xl backdrop:bg-[#050c19]/70"
    >
      {project && (
        <div className="min-h-full">
          <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#354664] bg-[#142038] px-5 py-5 sm:px-7">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#b7c6e4]">{t.eyebrow}</p>
              <h2 id="portfolio-project-detail-title" className="mt-2 break-words text-2xl font-bold tracking-tight sm:text-3xl">{project.name}</h2>
              <p className="mt-1 break-words text-sm text-[#d2deef]">{roleLabel(project.archetype)}</p>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label={t.close}
              className="shrink-0 rounded-lg border border-[#617392] bg-[#2c3d5b] p-2 text-white hover:bg-[#435577] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          <div className="space-y-6 px-5 py-6 sm:px-7">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                [t.category, categoryLabel(project.category)],
                [t.status, statusLabel(project.development_status)],
                [t.adoption, project.adoption_percent === null ? t.none : project.adoption_percent + '%'],
                [t.impact, impactLabel(project.maintenance.blast_radius)],
                [t.impactScore, String(project.impact_score)],
                [t.owner, project.maintenance.maintenance_owner],
                [t.strategicRole, strategicRoles[project.maintenance.strategic_role] ?? project.maintenance.strategic_role],
                [t.reviewCadence, project.maintenance.review_cadence === 'quarterly' ? t.quarterly : project.maintenance.review_cadence],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-[#3b4e70] bg-[#21314d] p-4">
                  <dt className="text-xs font-medium text-[#bdcce4]">{label}</dt>
                  <dd className="mt-2 break-words text-base font-semibold text-white">{value}</dd>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-[#3b4e70] bg-[#21314d] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold">{t.review}</span>
                <span className="rounded-full bg-[#55442c] px-3 py-1 text-sm text-[#ffe0a3]">
                  {project.maintenance.exit_path_status === 'review-required' ? t.reviewRequired : project.maintenance.exit_path_status}
                </span>
              </div>
            </div>

            <section aria-label={t.domains}>
              <h3 className="text-lg font-semibold">{t.domains}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.domains.length > 0
                  ? project.domains.map((domain) => (
                      <span key={domain} className="rounded-full border border-[#496184] bg-[#293b59] px-3 py-1.5 text-sm text-[#e2ebfa]">{domain}</span>
                    ))
                  : <p className="text-sm text-[#bdcce4]">{t.none}</p>}
              </div>
            </section>

            <section aria-label={t.relationships}>
              <div className="flex items-center gap-2">
                <GitBranch size={19} aria-hidden="true" className="text-[#9cbbfa]" />
                <h3 className="text-lg font-semibold">{t.relationships} <span className="text-sm font-normal text-[#c2cfe5]">({connected.length})</span></h3>
              </div>
              <p className="mt-1 text-sm text-[#bfcee5]">{t.relationshipsHint}</p>
              <div className="mt-3 space-y-2">
                {connected.length === 0 && <p className="rounded-xl border border-[#3b4e70] p-4 text-sm text-[#c5d2e8]">{t.noRelations}</p>}
                {connected.map(({ relation, outbound, other }, index) => (
                  <button
                    key={relation.source + '-' + relation.target + '-' + relation.type + '-' + index}
                    type="button"
                    disabled={!other}
                    onClick={() => other && onSelectProject(other.id)}
                    className="flex w-full items-start gap-3 rounded-xl border border-[#455879] bg-[#223450] p-3 text-left transition hover:border-[#9aade6] hover:bg-[#314666] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-default disabled:opacity-60"
                  >
                    {outbound
                      ? <ArrowUpRight size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[#b4a0ff]" />
                      : <ArrowDownRight size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[#7fd8c3]" />}
                    <span className="min-w-0 flex-1">
                      <span className="block break-words text-sm font-semibold text-white">{other?.name ?? (outbound ? relation.target : relation.source)}</span>
                      <span className="mt-1 block text-xs text-[#ccd8ea]">{outbound ? t.outbound : t.inbound} · {relationLabel(relation.type)} · {impactLabel(relation.impact)}</span>
                    </span>
                    <span aria-hidden="true" className="text-[#afc0df]">→</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <footer className="sticky bottom-0 z-10 border-t border-[#3b4e70] bg-[#142038] px-5 py-4 sm:px-7">
            <a
              href={'https://github.com/' + project.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#d9e2ff] px-4 py-3 text-sm font-semibold text-[#142038] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ExternalLink size={17} aria-hidden="true" />
              {t.openRepo}
            </a>
            <p className="mt-2 text-center text-xs text-[#aebfdb]">{t.snapshot}</p>
          </footer>
        </div>
      )}
    </dialog>
  );
}
