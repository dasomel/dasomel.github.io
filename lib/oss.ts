export const OSS_PORTFOLIO_GROUPS = [
  {
    label: 'Engineering Foundation',
    description: 'OSS 프로젝트를 반복 가능하게 만들고, 로컬 Kubernetes 노드·접속 경로·공급망 기준을 표준화하는 기반 프로젝트',
    projects: ['openforge', 'kube-ready-box', 'clusterdeck'],
  },
  {
    label: 'Cloud Native Platform',
    description: 'Kubernetes 기반 플랫폼, 관리 포털, 스토리지 enforcement, directory infrastructure를 구성하는 프로젝트',
    projects: ['narwhal', 'narwhal-portal', 'nfs-quota-agent', 'ldapium'],
  },
  {
    label: 'Data Platform',
    description: 'CDC부터 lakehouse, query, orchestration까지 데이터 lifecycle을 통합하고 운영하는 프로젝트',
    projects: ['beluga', 'beluga-manager'],
  },
  {
    label: 'Edge / Local AI',
    description: 'Apple Silicon의 native compute와 Kubernetes control plane을 결합하는 로컬 MLOps 프로젝트',
    projects: ['kubemetal'],
  },
] as const;

export const OSS_PORTFOLIO_ORDER = OSS_PORTFOLIO_GROUPS.flatMap((group) => group.projects);
