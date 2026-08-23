import type { Doc } from './types';
import { getProjects } from './content';

/**
 * Groups documentation by project and orders project groups using the same
 * portfolio order as the OSS hub. Documents inside each project retain the
 * frontmatter order supplied by getDocs().
 *
 * This keeps /docs and /oss aligned while allowing project documentation to
 * evolve independently from the portfolio presentation.
 */
export function groupDocsByProject(docs: Doc[]): [string, Doc[]][] {
  const groups = new Map<string, Doc[]>();
  for (const doc of docs) {
    const group = groups.get(doc.project);
    if (group) group.push(doc);
    else groups.set(doc.project, [doc]);
  }

  const lang = docs[0]?.lang ?? 'ko';
  const projectOrder = new Map(
    getProjects(lang).map((project, index) => [project.title, index] as const),
  );

  return [...groups].sort(([a], [b]) => {
    const aOrder = projectOrder.get(a);
    const bOrder = projectOrder.get(b);
    if (aOrder !== undefined && bOrder !== undefined) return aOrder - bOrder;
    if (aOrder !== undefined) return -1;
    if (bOrder !== undefined) return 1;
    return a.localeCompare(b);
  });
}
