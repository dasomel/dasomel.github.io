import type { Doc } from './types';

/**
 * Groups docs by their `project` field, preserving the order they arrive in.
 * Callers pass the already order-sorted output of getDocs(), so both the group
 * sequence and each group's contents follow the frontmatter `order` bands
 * (K-PaaS Lite 1-99, Narwhal 101-107, Narwhal Portal 201-204).
 */
export function groupDocsByProject(docs: Doc[]): [string, Doc[]][] {
  const groups = new Map<string, Doc[]>();
  for (const doc of docs) {
    const group = groups.get(doc.project);
    if (group) group.push(doc);
    else groups.set(doc.project, [doc]);
  }
  return [...groups];
}
