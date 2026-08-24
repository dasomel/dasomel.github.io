import Link from 'next/link';
import { getProjects, getDocs } from '@/lib/content';
import { OSS_PORTFOLIO_GROUPS } from '@/lib/oss';

const groups = OSS_PORTFOLIO_GROUPS;

export default function OssHubKo() {
  const projects = getProjects('ko');
  const docs = getDocs('ko');
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const docsByProject = new Map<string, number>();

  for (const doc of docs) {
    const root = doc.slug.split('/')[0];
    docsByProject.set(root, (docsByProject.get(root) ?? 0) + 1);
  }

  const allSlugs = groups.flatMap((group) => group.projects);
  const portfolio = allSlugs.map((slug) => bySlug.get(slug)).filter(Boolean);

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-7 lg:py-20" style={{ color: 'var(--text)' }}>
      <section className="max-w-5xl">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>
          <span className="h-px w-8" style={{ backgroundColor: 'var(--accent)' }} /> OSS Portfolio
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">오픈소스 프로젝트</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8" style={{ color: 'var(--text-muted)' }}>
          단순 프로젝트 목록이 아니라, 실제 Kubernetes 플랫폼·스토리지·데이터 플랫폼·로컬 AI 환경을 만들면서 반복해서 생긴 문제를 각 프로젝트가 어떻게 해결하는지 하나의 포트폴리오로 정리합니다.
        </p>
      </section>

      <section className="mt-8 rounded-3xl p-7 sm:p-9" style={{ border: '1px solid var(--accent)', background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-dim) 80%, transparent), var(--surface))' }}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>Start here</div>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">이 OSS들은 왜 만들어졌을까요?</h2>
            <p className="mt-3 text-sm leading-7 sm:text-base" style={{ color: 'var(--text-muted)' }}>
              시장 신호에서 시작해 Kubernetes 플랫폼의 문제, OSS 활용성, OpenForge를 통한 insight 표준화, Narwhal과 주변 프로젝트의 연결까지 한 번에 설명합니다.
            </p>
          </div>
          <Link href="/oss/story/" className="inline-flex shrink-0 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-fg)' }}>
            OSS Story 보기 →
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl p-5" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
          <div className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>Projects</div>
          <div className="mt-2 text-3xl font-semibold">{portfolio.length}</div>
          <div className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>curated OSS portfolio</div>
        </div>
        <div className="rounded-2xl p-5" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
          <div className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>Domains</div>
          <div className="mt-2 text-3xl font-semibold">4</div>
          <div className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>foundation → platform → data → AI</div>
        </div>
        <div className="rounded-2xl p-5" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
          <div className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>Documentation</div>
          <div className="mt-2 text-3xl font-semibold">{portfolio.reduce((sum, p) => sum + (docsByProject.get(p!.slug) ?? 0), 0)}</div>
          <div className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>project documentation pages</div>
        </div>
        <div className="rounded-2xl p-5" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
          <div className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>Approach</div>
          <div className="mt-2 text-xl font-semibold">Problem → Design → Evidence</div>
          <div className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>실행 결과와 운영 경험을 문서화</div>
        </div>
      </section>

      <section className="mt-14 rounded-3xl p-7 sm:p-10" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>Portfolio Architecture</div>
        <h2 className="mt-3 text-2xl font-semibold">프로젝트는 서로 독립적이지만, 사용 사례와 기술 경계로 연결됩니다.</h2>
        <pre className="mt-8 overflow-x-auto rounded-2xl p-6 text-xs leading-6" style={{ backgroundColor: 'var(--surface-hi)', color: 'var(--text-muted)' }}>{`OpenForge
    │ engineering standards / supply-chain / reusable templates
    │
    ├── kube-ready-box ──→ local Kubernetes node baseline
    │                         │
    │                         ├── Narwhal ──→ Narwhal Portal
    │                         │       │
    │                         │       ├── nfs-quota-agent
    │                         │       └── ldapium
    │                         │
    │                         └── Beluga ──→ Beluga Manager
    │
    └── KubeMetal ──→ Apple Silicon / host-native MLX MLOps`}</pre>
        <p className="mt-5 max-w-4xl text-sm leading-7" style={{ color: 'var(--text-muted)' }}>
          이 관계도는 런타임 의존성을 의미하지 않습니다. 각 프로젝트는 독립 OSS로 유지되며, 공통의 engineering practice와 실제 사용 시나리오를 통해 연결됩니다.
        </p>
      </section>

      <div className="mt-14 space-y-12">
        {groups.map((group) => (
          <section key={group.label}>
            <div className="max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>{group.label}</div>
              <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{group.description}</p>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {group.projects.map((slug) => {
                const project = bySlug.get(slug);
                if (!project) return null;
                const pageCount = docsByProject.get(slug) ?? 0;
                return (
                  <Link key={slug} href={`/oss/${slug}/`} className="group rounded-2xl p-7 transition duration-200" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--text-faint)' }}>Open Source Project</div>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight">{project.title}</h3>
                        <p className="mt-3 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
                      </div>
                      <div className="shrink-0 rounded-full px-3 py-1.5 text-[11px]" style={{ border: '1px solid var(--border)', color: 'var(--text-faint)' }}>{pageCount} docs</div>
                    </div>
                    {project.problem && (
                      <div className="mt-6 rounded-xl p-4" style={{ backgroundColor: 'var(--surface-hi)' }}>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>Problem</div>
                        <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{project.problem}</p>
                      </div>
                    )}
                    {project.solution && (
                      <div className="mt-3 rounded-xl p-4" style={{ backgroundColor: 'var(--surface-hi)' }}>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>Approach</div>
                        <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{project.solution}</p>
                      </div>
                    )}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tags.slice(0, 6).map((tag) => <span key={tag} className="rounded-md px-2.5 py-1.5 text-[11px]" style={{ backgroundColor: 'var(--surface-hi)', color: 'var(--text-faint)' }}>{tag}</span>)}
                    </div>
                    <div className="mt-7 text-sm font-medium" style={{ color: 'var(--accent)' }}>프로젝트 문서 보기 →</div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-16 border-t pt-10" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-2xl font-semibold">문서화 기준</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7" style={{ color: 'var(--text-muted)' }}>
          각 프로젝트 페이지는 개요만 나열하지 않고 문제 정의, 설계 원칙, 아키텍처, 주요 기술, 운영 모델, 검증 방식, 현재 상태, 프로젝트 간 관계를 함께 설명합니다. 세부 문서는 Overview · Architecture · Getting Started · Operations · Troubleshooting · ADR 등 주제로 분리합니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/oss/story/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border: '1px solid var(--accent)', backgroundColor: 'var(--surface)', color: 'var(--accent)' }}>OSS Story →</Link>
          <Link href="/oss/openforge/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}>OpenForge 문서 기준 →</Link>
          <Link href="/projects/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}>전체 Projects →</Link>
        </div>
      </section>
    </div>
  );
}
