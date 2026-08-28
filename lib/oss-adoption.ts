export type OssAdoptionEvidenceKind =
  | 'external-adopter'
  | 'external-contributor'
  | 'user-report'
  | 'public-deployment'
  | 'downstream-integration';

export type OssAdoptionEvidenceStatus = 'reported' | 'verified';

export type OssAdoptionEvidence = {
  project: string;
  kind: OssAdoptionEvidenceKind;
  status: OssAdoptionEvidenceStatus;
  label: string;
  sourceUrl: string;
  recordedAt: string;
  note?: string;
};

// Intentionally starts empty. Add entries only when there is an explicit,
// reviewable source that demonstrates external use or downstream adoption.
// Stars, forks, clone counts, and contributor totals are not adoption evidence.
export const OSS_ADOPTION_EVIDENCE: readonly OssAdoptionEvidence[] = [];

export function getOssAdoptionEvidence(project: string) {
  return OSS_ADOPTION_EVIDENCE.filter((item) => item.project === project);
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
