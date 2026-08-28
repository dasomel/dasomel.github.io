import snapshot from '@/src/data/oss-issue-meta.json';

export type OssIssueMeta = {
  repo:string;
  number:number;
  title:string;
  state:'open'|'closed';
  stateReason?:string;
  url:string;
  updatedAt?:string;
  closedAt?:string;
  labels?:string[];
};

const ISSUE_META=snapshot as Record<string,OssIssueMeta>;

export function getOssIssueMeta(repo:string,number:number) {
  return ISSUE_META[`${repo}#${number}`];
}

export function getOssIssueMetaByUrl(url:string) {
  const match=url.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)\/issues\/(\d+)/);
  if (!match) return undefined;
  return getOssIssueMeta(match[1],Number(match[2]));
}

export function issueStateLabel(meta?:OssIssueMeta) {
  if (!meta) return 'unknown';
  if (meta.state==='open') return 'open';
  if (meta.stateReason==='completed') return 'completed';
  if (meta.stateReason==='not_planned') return 'closed · not planned';
  return 'closed';
}
