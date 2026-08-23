import type { Doc } from './types';
import { OSS_PORTFOLIO_ORDER } from './oss';

/**
 * Groups documentation by project and uses the same project order as the OSS
 * portfolio. Documents within each project keep the order produced by
 * getDocs(). Projects that are not part of the portfolio are appended
 * alphabetically so the docs index remains complete.
 */
export function groupDocsByProject(docs: Doc[]): [string, Doc[]][] {
  const groups = new Map<string, Doc[]>();
  for (const doc of docs) {
    const group = groups.get(doc.project);
    if (group) group.push(doc);
    else groups.set(doc.project, [doc]);
  }

  const projectOrder = new Map(OSS_PORTFOLIO_ORDER.map((slug, index) => [slug, index] as const));

  return [...groups].sort(([a], [b]) => {
    const aSlug = docs.find((doc) => doc.project === a)?.slug.split('/')[0];
    const bSlug = docs.find((doc) => doc.project === b)?.slug.split('/')[0];
    const aOrder = aSlug ? projectOrder.get(aSlug) : undefined;
    const bOrder = bSlug ? projectOrder.get(bSlug) : undefined;
    if (aOrder !== undefined && bOrder !== undefined) return aOrder - bOrder;
    if (aOrder !== undefined) return -1;
    if (bOrder !== undefined) return 1;
    return a.localeCompare(b);
  });
}
