import discoveredCandidates from '@/src/data/oss-adoption-discovery.json';

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
  discovery?: 'manual' | 'github-code-search';
};

// Add entries only when there is an explicit, reviewable source that demonstrates
// external use or downstream adoption. Stars/forks/clone counts are not evidence.
export const OSS_ADOPTION_EVIDENCE: readonly OssAdoptionEvidence[] = [];

// Manual intake doubles as review history. A manual record overrides an automated
// candidate with the same source URL, allowing rejected/reported/verified decisions
// to persist even if the discovery collector sees the same reference again.
export const OSS_ADOPTION_MANUAL_CANDIDATES: readonly OssAdoptionCandidate[] = [];

const generated=(discoveredCandidates as OssAdoptionCandidate[]).map((item)=>({
  ...item,
  discovery:item.discovery??'github-code-search' as const,
}));
const manualByUrl=new Map(OSS_ADOPTION_MANUAL_CANDIDATES.map((item)=>[item.sourceUrl,item]));
export const OSS_ADOPTION_CANDIDATES: readonly OssAdoptionCandidate[] = [
  ...generated.filter((item)=>!manualByUrl.has(item.sourceUrl)),
  ...OSS_ADOPTION_MANUAL_CANDIDATES,
];

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
    automated: OSS_ADOPTION_CANDIDATES.filter((item) => item.discovery === 'github-code-search').length,
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
