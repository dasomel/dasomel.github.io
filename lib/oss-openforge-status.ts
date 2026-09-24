// Pure data-shaping helpers for OpenForge-verified project status, extracted so they can be
// unit tested without rendering React. Keep this module free of JSX and component-only fields.

const NONE = '—';

export type VerificationRecord = {
  unit?: string;
  integration?: string;
  runtime?: string;
  security?: string;
};

export type Capability = {
  status?: string;
  standard?: string;
  verification?: VerificationRecord;
};

export type Evidence = {
  ci?: string | null;
  security?: string | null;
  runtime?: string | null;
  commit?: string | null;
  issue?: number | null;
  pull_request?: number | null;
};

export type ProjectStatus = {
  revision?: string;
  updated_at?: string;
  milestone?: string;
  progress_percent?: number;
  // Upstream generator does not strictly enforce non-null capability entries at runtime
  // (see portfolio/status.schema.json vs. generate-portfolio.py's validate_status_payload,
  // which never validates `capabilities`), so we accept null/non-object entries defensively.
  capabilities?: Record<string, Capability | null>;
  evidence?: Evidence;
};

export type OpenForgeProject = {
  id: string;
  repository?: string;
  status?: ProjectStatus;
};

/** Turns a hyphenated status token (e.g. `not-applicable`) into readable text (`not applicable`). */
export function statusLabel(value: string): string {
  return value.replaceAll('-', ' ');
}

/** Projects that carry a verified `status` block (drives whether the section renders at all). */
export function getVerifiedProjects<T extends { status?: ProjectStatus }>(
  projects: readonly T[]
): (T & { status: ProjectStatus })[] {
  return projects.filter((project): project is T & { status: ProjectStatus } => Boolean(project.status));
}

/** Short revision (7 chars) plus a commit link, computed once; href is omitted without a repository. */
export function revisionLink(project: OpenForgeProject): { short: string; href?: string } | undefined {
  const revision = project.status?.revision;
  if (!revision) return undefined;
  const short = revision.slice(0, 7);
  return {
    short,
    href: project.repository ? `https://github.com/${project.repository}/commit/${short}` : undefined,
  };
}

export function evidenceLine(status: ProjectStatus): string {
  const evidence = status.evidence;
  return [evidence?.ci, evidence?.security, evidence?.runtime]
    .map((value) => statusLabel(value ?? NONE))
    .join(' · ');
}

/** One row per capability with recorded verification; null/non-object entries are skipped. */
export function capabilityRows(status: ProjectStatus): { id: string; line: string }[] {
  const entries = status.capabilities ? Object.entries(status.capabilities) : [];
  return entries
    .filter((entry): entry is [string, Capability] => typeof entry[1] === 'object' && entry[1] !== null)
    .map(([id, capability]) => {
      const verification = capability.verification;
      const line = [verification?.unit, verification?.integration, verification?.runtime, verification?.security]
        .map((value) => statusLabel(value ?? NONE))
        .join(' · ');
      return { id, line };
    });
}

/** Milestone and/or progress line; either can be present independently, or both, or neither. */
export function milestoneLine(status: ProjectStatus, labels: { milestone: string; progress: string }): string | undefined {
  const hasMilestone = Boolean(status.milestone);
  const hasProgress = typeof status.progress_percent === 'number';
  if (!hasMilestone && !hasProgress) return undefined;
  const parts: string[] = [];
  if (hasMilestone) parts.push(`${labels.milestone}: ${status.milestone}`);
  if (hasProgress) parts.push(`${labels.progress} ${status.progress_percent}%`);
  return parts.join(' · ');
}
