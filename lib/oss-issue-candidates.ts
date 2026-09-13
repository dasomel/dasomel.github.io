import snapshot from '@/src/data/oss-open-issues.json';
import type { AttentionSignalKind, ReadinessGapKind } from '@/lib/oss-actionability';

export type OssOpenIssue = {
  repo:string;
  number:number;
  title:string;
  url:string;
  updatedAt?:string;
  labels?:string[];
};

const OPEN_ISSUES=snapshot as Record<string,OssOpenIssue[]>;

const attentionKeywords:Record<AttentionSignalKind,string[]> = {
  activity:[],
  release:['release','distribution','packaging','supply-chain','supply chain','provenance'],
  docs:['documentation','docs','readme'],
  contributors:['community','contributor','governance','good first issue','help wanted','sandbox'],
};

const readinessKeywords:Record<ReadinessGapKind,string[]> = {
  license:['license','licensing'],
  contributing:['contributing','contributor','community'],
  security:['security','vulnerability','hardening'],
  sbom:['sbom','spdx','cyclonedx','supply-chain','supply chain'],
  provenance:['provenance','attestation','slsa','cosign','supply-chain','supply chain'],
  release:['release','distribution','packaging','supply-chain','supply chain','provenance'],
  docs:['documentation','docs','readme'],
  community:['community','contributor','governance','good first issue','help wanted','sandbox'],
};

function haystack(issue:OssOpenIssue) {
  return `${issue.title} ${(issue.labels??[]).join(' ')}`.toLowerCase();
}

function match(repo:string,keywords:string[]) {
  if (keywords.length===0) return undefined;
  return (OPEN_ISSUES[repo]??[]).find((issue)=>{
    const text=haystack(issue);
    return keywords.some((keyword)=>text.includes(keyword));
  });
}

export function findAttentionIssueCandidate(repo:string,kind:AttentionSignalKind) {
  return match(repo,attentionKeywords[kind]);
}

export function findReadinessIssueCandidate(repo:string,kind:ReadinessGapKind) {
  return match(repo,readinessKeywords[kind]);
}
