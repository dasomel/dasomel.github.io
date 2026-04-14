'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Github, ArrowUpRight } from 'lucide-react';
import { TagFilter } from '@/components/ui/tag-filter';
import type { Project } from '@/lib/types';

interface Props {
  projects: Project[];
  base: string;
  translations: {
    problem: string;
    solution: string;
  };
}

export function ProjectList({ projects, base, translations }: Props) {
  const [selected, setSelected] = useState('all');

  const allTags = [...new Set(projects.flatMap(p => p.tags))];

  const filtered = selected === 'all'
    ? projects
    : selected === 'fork'
      ? projects.filter(p => p.type === 'fork')
      : projects.filter(p => p.tags.includes(selected));

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <>
      <TagFilter
        tags={[...allTags, 'Fork']}
        selected={selected}
        onChange={(tag) => setSelected(tag.toLowerCase())}
      />

      {featured.length > 0 && (
        <div className="space-y-4 mb-8">
          {featured.map(project => (
            <div key={project.slug} className="rounded-xl p-5"
              style={{ border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <Link href={`${base}/projects/${project.slug}`}>
                  <h3 className="text-base font-bold hover:text-emerald-400 transition-colors"
                    style={{ color: 'var(--text)' }}>
                    {project.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: project.type === 'fork' ? 'var(--bg-subtle)' : 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: project.type === 'fork' ? 'var(--accent)' : 'var(--text-muted)',
                    }}>
                    {project.type === 'fork' ? 'Fork' : 'Project'}
                  </span>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      className="p-1 hover:opacity-60 transition-opacity" style={{ color: 'var(--text-faint)' }}>
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {project.problem && project.solution && (
                <div className="flex gap-4 mb-3 text-xs">
                  <div className="flex-1">
                    <div className="font-semibold mb-1" style={{ color: 'var(--accent)' }}>{translations.problem}</div>
                    <p style={{ color: 'var(--text-muted)' }} className="leading-relaxed">{project.problem}</p>
                  </div>
                  <div className="w-px" style={{ backgroundColor: 'var(--border)' }} />
                  <div className="flex-1">
                    <div className="font-semibold mb-1" style={{ color: 'var(--accent)' }}>{translations.solution}</div>
                    <p style={{ color: 'var(--text-muted)' }} className="leading-relaxed">{project.solution}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {project.tags.map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 text-xs font-mono rounded"
                    style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {rest.map(project => (
          <div key={project.slug} className="flex items-center justify-between p-4 rounded-xl"
            style={{ border: '1px solid var(--border)' }}>
            <div>
              <Link href={`${base}/projects/${project.slug}`}
                className="text-sm font-semibold hover:text-emerald-400 transition-colors"
                style={{ color: 'var(--text)' }}>
                {project.title}
              </Link>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {project.description}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="p-1 hover:opacity-60" style={{ color: 'var(--text-faint)' }}>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
