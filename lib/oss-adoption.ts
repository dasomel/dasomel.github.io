export type OssAdoptionEvidenceKind =
  | 'external-adopter'
  | 'external-contributor'
  | 'user-report'
  | 'public-deployment'
  | 'downstream-integration';

export type OssAdoptionEvidenceStatus = 'reported' | 'verified';
export type OssAdoptionCandidateStatus = 'candidate' | 'reported' | 'verified' | 'rejected';

export type OssAdoptionEvidence = {
  project: string;
  kind: OssAdoptionEvidenceKind;
  status: OssAdoptionEvidenceStatus;
  label: string;
  sourceUrl: string;
  recordedAt: string;
  note?: string;
};

export type OssAdoptionCandidate = {
  project: string;
  kind: OssAdoptionEvidenceKind;
  status: OssAdoptionCandidateStatus;
  label: string;
  sourceUrl: string;
  discoveredAt: string;
  note?: string;
};

// Intentionally starts empty. Add entries only when there is an explicit,
// reviewable source that demonstrates external use or downstream adoption.
// Stars, forks, clone counts, and contributor totals are not adoption evidence.
export const OSS_ADOPTION_EVIDENCE: readonly OssAdoptionEvidence[] = [];

// Intake is deliberately separate from evidence. A candidate may be a useful
// lead but MUST NOT affect readiness until it is promoted to reported/verified
// evidence after source review. Rejected items remain useful as audit history.
export const OSS_ADOPTION_CANDIDATES: readonly OssAdoptionCandidate[] = [];

export function getOssAdoptionEvidence(project: string) {
  return OSS_ADOPTION_EVIDENCE.filter((item) => item.project === project);
}

export function getOssAdoptionCandidates(project?: string) {
  return project
    ? OSS_ADOPTION_CANDIDATES.filter((item) => item.project === project)
    : [...OSS_ADOPTION_CANDIDATES];
}

export function adoptionIntakeState() {
  return {
    total: OSS_ADOPTION_CANDIDATES.length,
    candidate: OSS_ADOPTION_CANDIDATES.filter((item) => item.status === 'candidate').length,
    reported: OSS_ADOPTION_CANDIDATES.filter((item) => item.status === 'reported').length,
    verified: OSS_ADOPTION_CANDIDATES.filter((item) => item.status === 'verified').length,
    rejected: OSS_ADOPTION_CANDIDATES.filter((item) => item.status === 'rejected').length,
  } as const;
}

export function adoptionEvidenceState(project: string) {
  const evidence = getOssAdoptionEvidence(project);
  const verified = evidence.filter((item) => item.status === 'verified');
  const reported = evidence.filter((item) => item.status === 'reported');
  return {
    evidence,
    verified,
    reported,
    state: verified.length > 0 ? 'observed' : reported.length > 0 ? 'partial' : 'not-indexed',
  } as const;
}
