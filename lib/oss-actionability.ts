export type TrackerSource = 'project'|'portfolio'|'strategy';
export type AttentionSignalKind = 'release'|'activity'|'contributors'|'docs';
export type ReadinessGapKind = 'license'|'contributing'|'security'|'sbom'|'provenance'|'release'|'docs'|'community';

export type OssTracker = {
  label:string;
  url:string;
  source:TrackerSource;
};

export type OssCanonicalOwner = {
  ref:string;
  url:string;
  labelKo:string;
  labelEn:string;
  rationaleKo:string;
  rationaleEn:string;
};

export const OSS_PORTFOLIO_SOURCES = [
  { label:'Taxonomy / execution waves', ref:'Narwhal #41', url:'https://github.com/dasomel/narwhal/issues/41' },
  { label:'Engineering conformance', ref:'Narwhal #162', url:'https://github.com/dasomel/narwhal/issues/162' },
  { label:'Community growth strategy', ref:'Narwhal #169', url:'https://github.com/dasomel/narwhal/issues/169' },
] as const;

const projectTrackers:Record<string,OssTracker> = {
  'narwhal:release': { label:'Narwhal #161', url:'https://github.com/dasomel/narwhal/issues/161', source:'portfolio' },
  'kube-ready-box:release': { label:'kube-ready-box #28', url:'https://github.com/dasomel/kube-ready-box/issues/28', source:'project' },
  'nfs-quota-agent:release': { label:'nfs-quota-agent #16', url:'https://github.com/dasomel/nfs-quota-agent/issues/16', source:'project' },
  'ldapium:release': { label:'ldapium #36', url:'https://github.com/dasomel/ldapium/issues/36', source:'project' },
  'beluga:release': { label:'Beluga #100', url:'https://github.com/dasomel/beluga/issues/100', source:'project' },
  'kubemetal:release': { label:'KubeMetal #35', url:'https://github.com/dasomel/kubemetal/issues/35', source:'project' },
  'narwhal:community': { label:'Narwhal #169', url:'https://github.com/dasomel/narwhal/issues/169', source:'strategy' },
  'nfs-quota-agent:community': { label:'NFS Quota Agent #81', url:'https://github.com/dasomel/nfs-quota-agent/issues/81', source:'strategy' },
};

export const OSS_ATTENTION_OWNERS:Record<AttentionSignalKind,OssCanonicalOwner> = {
  activity: {
    url:'https://github.com/dasomel/narwhal/issues/41', ref:'Narwhal #41',
    labelKo:'Taxonomy / execution waves', labelEn:'Taxonomy / execution waves',
    rationaleKo:'비활성 프로젝트의 우선순위·execution wave 재검토에 가장 가까운 portfolio owner입니다.',
    rationaleEn:'Closest portfolio owner for reconsidering priority and execution waves of inactive projects.',
  },
  release: {
    url:'https://github.com/dasomel/narwhal/issues/162', ref:'Narwhal #162',
    labelKo:'Engineering conformance', labelEn:'Engineering conformance',
    rationaleKo:'릴리스·SBOM·provenance·release evidence 공통 기준을 다루는 canonical checklist입니다.',
    rationaleEn:'Canonical checklist for release, SBOM, provenance and release-evidence gaps.',
  },
  docs: {
    url:'https://github.com/dasomel/narwhal/issues/162', ref:'Narwhal #162',
    labelKo:'Engineering conformance', labelEn:'Engineering conformance',
    rationaleKo:'Repository governance와 문서 baseline을 함께 검증하는 portfolio checklist입니다.',
    rationaleEn:'Portfolio checklist that also covers repository governance and documentation baseline.',
  },
  contributors: {
    url:'https://github.com/dasomel/narwhal/issues/169', ref:'Narwhal #169',
    labelKo:'Community growth strategy', labelEn:'Community growth strategy',
    rationaleKo:'외부 contributor·maintainer 확대와 community growth 방향을 다루는 전략 owner입니다.',
    rationaleEn:'Strategy owner for external contributor, maintainer and community growth.',
  },
};

const readinessOwners:Record<ReadinessGapKind,OssCanonicalOwner> = {
  license: { ...OSS_ATTENTION_OWNERS.release, rationaleKo:'LICENSE와 repository governance baseline을 다루는 engineering conformance owner입니다.', rationaleEn:'Engineering conformance owner for LICENSE and repository governance baseline.' },
  contributing: { ...OSS_ATTENTION_OWNERS.contributors, rationaleKo:'CONTRIBUTING과 외부 기여 경로를 다루는 community growth owner입니다.', rationaleEn:'Community growth owner for CONTRIBUTING and external contribution paths.' },
  security: { ...OSS_ATTENTION_OWNERS.release, rationaleKo:'SECURITY policy와 supply-chain baseline을 다루는 engineering conformance owner입니다.', rationaleEn:'Engineering conformance owner for SECURITY policy and supply-chain baseline.' },
  sbom: { ...OSS_ATTENTION_OWNERS.release, rationaleKo:'SBOM evidence baseline을 다루는 engineering conformance owner입니다.', rationaleEn:'Engineering conformance owner for SBOM evidence baseline.' },
  provenance: { ...OSS_ATTENTION_OWNERS.release, rationaleKo:'Provenance·attestation evidence baseline을 다루는 engineering conformance owner입니다.', rationaleEn:'Engineering conformance owner for provenance and attestation evidence baseline.' },
  release: OSS_ATTENTION_OWNERS.release,
  docs: OSS_ATTENTION_OWNERS.docs,
  community: OSS_ATTENTION_OWNERS.contributors,
};

export function getAttentionTracker(slug:string, kind:AttentionSignalKind) {
  const keyKind=kind==='contributors'?'community':kind;
  return projectTrackers[`${slug}:${keyKind}`];
}

export function getReadinessTracker(slug:string, kind:ReadinessGapKind):OssTracker {
  return projectTrackers[`${slug}:${kind}`] ?? {
    label:`${readinessOwners[kind].ref} · ${readinessOwners[kind].labelEn}`,
    url:readinessOwners[kind].url,
    source: kind==='contributing'||kind==='community' ? 'strategy' : 'portfolio',
  };
}

export function getReadinessOwner(kind:ReadinessGapKind) {
  return readinessOwners[kind];
}
