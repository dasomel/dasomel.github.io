// D3: beluga-manager was consolidated into beluga `manager/` (beluga ADR-0005, 2026-10-15).
// Static export has no server redirects, so the old routes stay as stub pages
// that forward to the moved docs (see components/LegacyRedirect.tsx).
export const LEGACY_MANAGER_DOCS = ['overview', 'architecture', 'development', 'operations'] as const;

export const legacyManagerDocParams = () => LEGACY_MANAGER_DOCS.map((doc) => ({ slug: [doc] }));

export function movedManagerDocPath(slug: string[]): string {
  const [doc] = slug;
  return (LEGACY_MANAGER_DOCS as readonly string[]).includes(doc) && slug.length === 1 ? `beluga/manager-${doc}` : 'beluga';
}
