import Link from 'next/link';
import { ArrowUpRight, GitBranch, LayoutDashboard } from 'lucide-react';
import portfolio from '@/src/data/openforge-portfolio.json';

type Locale = 'ko' | 'en';

const copy = {
  ko: {
    eyebrow: 'OPENFORGE / PORTFOLIO OVERVIEW',
    heading: '프로젝트를 하나씩 보기 전에, 전체 연결 관계부터.',
    description: 'OpenForge 포트폴리오 대시보드에서 프로젝트 현황, 의존 관계, 도입률과 유지보수 범위를 한눈에 살펴보세요. 프로젝트를 선택하면 상세 정보와 연결된 저장소도 확인할 수 있습니다.',
    projects: '등록 프로젝트',
    relations: '프로젝트 관계',
    adoption: '도입률',
    action: '포트폴리오 대시보드 열기',
    snapshot: '레지스트리 스냅샷',
    disclaimer: '실시간 운영 지표가 아닌 공개된 포트폴리오 데이터 기준',
  },
  en: {
    eyebrow: 'OPENFORGE / PORTFOLIO OVERVIEW',
    heading: 'See the whole portfolio before exploring each project.',
    description: 'Explore project status, dependencies, adoption and maintenance coverage in the OpenForge portfolio dashboard. Select any project to inspect its details and connected repositories.',
    projects: 'Projects',
    relations: 'Relationships',
    adoption: 'Adoption',
    action: 'Explore portfolio dashboard',
    snapshot: 'Registry snapshot',
    disclaimer: 'Based on published portfolio data, not live operational telemetry',
  },
} as const;

export function OssDashboardEntry({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const href = `/${locale}/oss/dashboard/`;
  const stats = [
    { label: t.projects, value: String(portfolio.projects.length) },
    { label: t.relations, value: String(portfolio.relationships.length) },
    { label: t.adoption, value: `${portfolio.portfolio.adoption_percent}%` },
  ];

  return (
    <section aria-label={t.action} className="rounded-3xl border p-6 sm:p-8" style={{ borderColor: 'var(--border-hi)', background: 'linear-gradient(125deg, var(--accent-dim), var(--surface) 60%)' }}>
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.11em]" style={{ color: 'var(--accent)' }}>
            <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t.eyebrow}
          </div>
          <h2 className="mt-4 max-w-2xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl" style={{ color: 'var(--text)' }}>{t.heading}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 sm:text-base" style={{ color: 'var(--text-muted)' }}>{t.description}</p>
          <Link href={href} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-fg)', outlineColor: 'var(--accent)' }}>
            {t.action} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold" style={{ color: 'var(--text-muted)' }}><GitBranch className="h-4 w-4" aria-hidden="true" />{t.snapshot} · {portfolio.updated_at}</div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {stats.map(({ label, value }) => (
              <div key={label} className="min-w-0 border-l pl-3" style={{ borderColor: 'var(--border-hi)' }}>
                <div className="text-xl font-semibold tracking-tight sm:text-2xl" style={{ color: 'var(--text)' }}>{value}</div>
                <div className="mt-1 text-xs leading-5" style={{ color: 'var(--text-muted)' }}>{label}</div>
              </div>
            ))}
          </div>
          <p className="mt-5 border-t pt-3 text-xs leading-5" style={{ borderColor: 'var(--border)', color: 'var(--text-faint)' }}>{t.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
