'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Github, ArrowUpRight, Search } from 'lucide-react';
import { TagFilter } from '@/components/ui/tag-filter';
import type { Project } from '@/lib/types';

interface Props {
  projects: Project[];
  base: string;
  translations: {
    problem: string;
    solution: string;
    search: string;
    noResults: string;
  };
}

const visualSlugs = new Set([
  'narwhal',
  'beluga',
  'kubemetal',
  'kube-ready-box',
  'ldapium',
  'nfs-quota-agent',
  'egovframe-launcher',
]);

function safeImage(slug: string) {
  return `/images/projects/${visualSlugs.has(slug) ? slug : 'default'}.svg`;
}

function onImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (!image.src.endsWith('/images/projects/default.svg')) {
    image.src = '/images/projects/default.svg';
  }
}

export function ProjectList({ projects, base, translations }: Props) {
  const [selected, setSelected] = useState('all');
  const [query, setQuery] = useState('');

  const allTags = [...new Set(projects.flatMap(p => p.tags))];

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter(project => {
      const matchesTag = selected === 'all'
        ? true
        : selected === 'fork'
          ? project.type === 'fork'
          : project.tags.includes(selected);
      const haystack = [project.title, project.description, project.problem, project.solution, ...project.tags]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return matchesTag && (!normalized || haystack.includes(normalized));
    });
  }, [projects, query, selected]);

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={translations.search} aria-label={translations.search} className="w-full rounded-xl border bg-transparent pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2" style={{ borderColor: 'var(--border)', color: 'var(--text)', ['--tw-ring-color' as string]: 'var(--accent-glow)' }} />
        </label>
      </div>

      <TagFilter tags={[...allTags, 'Fork']} selected={selected} onChange={(tag) => setSelected(tag.toLowerCase())} />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border p-10 text-center" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>{translations.noResults}</div>
      ) : (
        <>
          {featured.length > 0 && (
            <div className="space-y-5 mb-9">
              {featured.map(project => (
                <article key={project.slug} className="overflow-hidden rounded-2xl" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
                  <Link href={`${base}/projects/${project.slug}`} className="block overflow-hidden" aria-label={`${project.title} project`}>
                    <img src={safeImage(project.slug)} onError={onImageError} alt="" className="block w-full h-auto transition-transform duration-500 hover:scale-[1.01]" loading="lazy" />
                  </Link>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Link href={`${base}/projects/${project.slug}`}><h3 className="text-lg font-bold hover:text-emerald-400 transition-colors" style={{ color: 'var(--text)' }}>{project.title}</h3></Link>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: project.type === 'fork' ? 'var(--bg-subtle)' : 'var(--surface)', border: '1px solid var(--border)', color: project.type === 'fork' ? 'var(--accent)' : 'var(--text-muted)' }}>{project.type === 'fork' ? 'Fork' : 'Project'}</span>
                        {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-1 hover:opacity-60 transition-opacity" style={{ color: 'var(--text-faint)' }} aria-label={`${project.title} GitHub`}><Github className="w-4 h-4" /></a>}
                      </div>
                    </div>
                    {project.problem && project.solution && <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm"><div className="rounded-xl p-4" style={{ backgroundColor: 'var(--surface)' }}><div className="font-semibold mb-1" style={{ color: 'var(--text-faint)' }}>{translations.problem}</div><p style={{ color: 'var(--text-muted)' }} className="leading-relaxed">{project.problem}</p></div><div className="rounded-xl p-4" style={{ backgroundColor: 'var(--accent-dim)' }}><div className="font-semibold mb-1" style={{ color: 'var(--accent)' }}>{translations.solution}</div><p style={{ color: 'var(--text-muted)' }} className="leading-relaxed">{project.solution}</p></div></div>}
                    <div className="flex flex-wrap gap-1.5">{project.tags.map(tag => <span key={tag} className="px-1.5 py-0.5 text-xs font-mono rounded" style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>{tag}</span>)}</div>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            {rest.map(project => (
              <Link key={project.slug} href={`${base}/projects/${project.slug}`} className="group overflow-hidden rounded-2xl" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
                <img src={safeImage(project.slug)} onError={onImageError} alt="" className="block w-full h-auto" loading="lazy" />
                <div className="p-4 flex items-start justify-between gap-3"><div className="min-w-0"><div className="text-sm font-semibold group-hover:text-emerald-400 transition-colors mb-1" style={{ color: 'var(--text)' }}>{project.title}</div><p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{project.description}</p></div><ArrowUpRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-faint)' }} aria-hidden="true" /></div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
