'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Github, ArrowUpRight, Search, X } from 'lucide-react';
import { TagFilter } from '@/components/ui/tag-filter';
import { ProjectVisual } from '@/components/projects/ProjectVisual';
import type { Project } from '@/lib/types';
import styles from './ProjectsShowcase.module.css';

interface Props {
  projects: Project[];
  base: string;
  translations: {
    problem: string;
    solution: string;
    search: string;
    noResults: string;
    results: string;
    clearFilters: string;
    core: string;
    tools: string;
    forks: string;
  };
}

const visualSlugs = new Set(['narwhal', 'beluga', 'narwhal-portal', 'kubemetal', 'kube-ready-box', 'ldapium', 'nfs-quota-agent', 'egovframe-launcher', 'k-paas']);
const coreOrder = ['narwhal', 'narwhal-portal', 'beluga', 'kubemetal', 'kube-ready-box', 'ldapium', 'nfs-quota-agent', 'egovframe-launcher', 'k-paas'];
const coreRank = new Map(coreOrder.map((slug, index) => [slug, index]));
const safeImage = (slug: string) => `/images/projects/${visualSlugs.has(slug) ? slug : 'default'}.svg`;
const statusBySlug: Record<string, NonNullable<Project['status']>> = {
  narwhal: 'active',
  'narwhal-portal': 'active',
  beluga: 'active',
  kubemetal: 'active',
  'kube-ready-box': 'maintained',
  ldapium: 'experimental',
  'nfs-quota-agent': 'maintained',
  'egovframe-launcher': 'active',
  'k-paas': 'maintained',
};
const statusLabel: Record<NonNullable<Project['status']>, string> = {
  active: 'ACTIVE',
  maintained: 'MAINTAINED',
  experimental: 'EXPERIMENTAL',
  archived: 'ARCHIVED',
};

function sortCore(projects: Project[]) {
  return [...projects].sort((a, b) => {
    const ar = coreRank.get(a.slug) ?? 999;
    const br = coreRank.get(b.slug) ?? 999;
    return ar - br || (a.order ?? 99) - (b.order ?? 99);
  });
}

function StatusBadge({ status }: { status?: Project['status'] }) {
  if (!status) return null;
  return <span className="text-[10px] px-2 py-0.5 rounded-full font-mono tracking-wide" style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>{statusLabel[status]}</span>;
}

export function ProjectList({ projects, base, translations }: Props) {
  const [selected, setSelected] = useState('all');
  const [query, setQuery] = useState('');
  const allTags = [...new Set(projects.flatMap(p => p.tags))];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter(project => {
      const matchesTag = selected === 'all' ? true : selected === 'Fork' ? project.type === 'fork' : project.tags.includes(selected);
      const haystack = [project.title, project.description, project.problem, project.solution, ...project.tags].filter(Boolean).join(' ').toLowerCase();
      return matchesTag && (!normalized || haystack.includes(normalized));
    });
  }, [projects, query, selected]);

  const hasFilters = Boolean(query.trim()) || selected !== 'all';
  const resetFilters = () => {
    setQuery('');
    setSelected('all');
  };

  const resolveStatus = (project: Project) => project.status ?? statusBySlug[project.slug];
  const core = sortCore(filtered.filter(project => project.type !== 'fork' && coreRank.has(project.slug)));
  const tools = filtered.filter(project => project.type !== 'fork' && !coreRank.has(project.slug)).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  const forks = filtered.filter(project => project.type === 'fork').sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  const featured = core.filter(p => p.featured);
  const compactCore = core.filter(p => !p.featured);

  const renderFeatured = (items: Project[]) => (
    <div className={styles.featured}>
      {items.map((project, index) => {
        const status = resolveStatus(project);
        return (
          <article key={project.slug} className={styles.featureCard}>
            <Link href={`${base}/projects/${project.slug}`} className="block" aria-label={`${project.title} project`}>
              <div className={styles.featureVisual}>
                <ProjectVisual src={safeImage(project.slug)} alt="" className="block w-full h-auto" loading="lazy" />
              </div>
            </Link>
            <div className={styles.featureBody}>
              <div className={styles.index}>CORE / {String(index + 1).padStart(2, '0')}</div>
              <div className="flex items-start justify-between gap-3">
                <Link href={`${base}/projects/${project.slug}`} className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>{project.title}</h3>
                </Link>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={status} />
                  {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-1 hover:opacity-60" style={{ color: 'var(--text-faint)' }} aria-label={`${project.title} GitHub`}><Github className="w-4 h-4" /></a>}
                </div>
              </div>
              {project.description && <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{project.description}</p>}
              {(project.problem && project.solution) && (
                <div className="grid sm:grid-cols-2 gap-2 mt-5 text-xs">
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--bg-subtle)' }}><div className="font-semibold mb-1" style={{ color: 'var(--text-faint)' }}>{translations.problem}</div><p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>{project.problem}</p></div>
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--accent-dim)' }}><div className="font-semibold mb-1" style={{ color: 'var(--accent)' }}>{translations.solution}</div><p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>{project.solution}</p></div>
                </div>
              )}
              <div className={styles.meta}>{project.tags.slice(0, 5).map(tag => <span key={tag}>{tag}</span>)}</div>
            </div>
          </article>
        );
      })}
    </div>
  );

  const renderCompact = (items: Project[]) => (
    <div className={styles.featureGrid}>
      {items.map(project => {
        const status = resolveStatus(project);
        return (
          <Link key={project.slug} href={`${base}/projects/${project.slug}`} className={styles.compactCard + ' group'}>
            <div className={styles.compactVisual}><ProjectVisual src={safeImage(project.slug)} alt="" className="block w-full h-auto" loading="lazy" /></div>
            <div className={styles.compactBody}>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0"><div className={styles.kicker}>{status ?? 'PROJECT'}</div><div className="mt-1 text-sm font-semibold group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>{project.title}</div></div>
                <ArrowUpRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-faint)' }} aria-hidden="true" />
              </div>
              <p className="mt-2 text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className={styles.showcase}>
      <div className="rounded-2xl border p-3 sm:p-4 mb-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={translations.search} aria-label={translations.search} className="w-full rounded-xl border bg-transparent pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2" style={{ borderColor: 'var(--border)', color: 'var(--text)', ['--tw-ring-color' as string]: 'var(--accent-glow)' }} />
          </label>
          {hasFilters && (
            <button type="button" onClick={resetFilters} className="inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-mono transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              {translations.clearFilters}
            </button>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{translations.results.replace('{count}', String(filtered.length))}</div>
          {hasFilters && (
            <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-faint)' }}>
              <span style={{ color: 'var(--text-muted)' }}>FILTER</span>
              {query.trim() && <span className="rounded-full border px-2 py-0.5" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>{query.trim()}</span>}
              {selected !== 'all' && <span className="rounded-full border px-2 py-0.5" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>{selected}</span>}
            </div>
          )}
        </div>
      </div>

      <TagFilter tags={[...allTags, 'Fork']} selected={selected} onChange={setSelected} />
      {filtered.length === 0 ? <div className="rounded-2xl border p-10 text-center" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>{translations.noResults}</div> : (
        <div className="space-y-14 mt-8">
          {featured.length > 0 && <section><div className="flex items-baseline justify-between gap-4 mb-5"><div><div className="workbench-eyebrow mb-2">CORE OSS / SHOWCASE</div><h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--text)' }}>{translations.core}</h2></div><span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{core.length} projects</span></div>{renderFeatured(featured)}{compactCore.length > 0 && <div className="mt-4">{renderCompact(compactCore)}</div>}</section>}
          {tools.length > 0 && <section><div className="flex items-baseline justify-between gap-4 mb-5"><div><div className="workbench-eyebrow mb-2">TOOLS · EXPERIMENTS</div><h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--text)' }}>{translations.tools}</h2></div><span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{tools.length}</span></div>{renderCompact(tools)}</section>}
          {forks.length > 0 && <section><div className="flex items-baseline justify-between gap-4 mb-5"><div><div className="workbench-eyebrow mb-2">FORKS · ADAPTATIONS</div><h2 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--text)' }}>{translations.forks}</h2></div><span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>{forks.length}</span></div>{renderCompact(forks)}</section>}
        </div>
      )}
    </div>
  );
}
