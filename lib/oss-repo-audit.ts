import auditData from '@/src/data/project-repo-audit.json';

export type OssRepoAuditEvidence = {
  license: string[];
  contributing: string[];
  codeOfConduct: string[];
  security: string[];
  notice: string[];
  changelog: string[];
  sbom: string[];
  provenance: string[];
};

export type OssRepoAudit = {
  repo: string;
  defaultBranch: string;
  truncated: boolean;
  evidence: OssRepoAuditEvidence;
};

const audits = auditData as Record<string, OssRepoAudit>;

export function getOssRepoAudit(repo: string) {
  return audits[repo];
}

export function evidencePresent(paths?: string[]) {
  return Boolean(paths && paths.length > 0);
}
