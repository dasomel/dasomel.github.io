export type OssPortfolioProject = {
  slug: string;
  repo: string;
  name: string;
  role: string;
  pulseRole: string;
  stage: string;
  verification: string;
  independence: string;
};

export const OSS_PORTFOLIO_PROJECTS: readonly OssPortfolioProject[] = [
  { slug:'narwhal', repo:'dasomel/narwhal', name:'Narwhal', role:'Flagship Platform', pulseRole:'Platform', stage:'Active platform', verification:'Regression + live checks', independence:'Platform root' },
  { slug:'narwhal-portal', repo:'dasomel/narwhal-portal', name:'Narwhal Portal', role:'Platform Experience Layer', pulseRole:'Experience', stage:'Active UI layer', verification:'Build + in-cluster workflow', independence:'Narwhal-coupled' },
  { slug:'nfs-quota-agent', repo:'dasomel/nfs-quota-agent', name:'NFS Quota Agent', role:'Reusable Component', pulseRole:'Storage', stage:'Reusable component', verification:'Filesystem + operational checks', independence:'Independent' },
  { slug:'ldapium', repo:'dasomel/ldapium', name:'ldapium', role:'Identity Infrastructure', pulseRole:'Identity', stage:'Prototype', verification:'Helm test + supply-chain evidence', independence:'Independent' },
  { slug:'kube-ready-box', repo:'dasomel/kube-ready-box', name:'Kube-Ready-Box', role:'Node Foundation', pulseRole:'Baseline', stage:'Reusable foundation', verification:'OS readiness validation', independence:'Independent' },
  { slug:'clusterdeck', repo:'dasomel/clusterdeck', name:'ClusterDeck', role:'Workstation Access Layer', pulseRole:'Workstation', stage:'MVP / early', verification:'SSH + kubeconfig + API', independence:'Independent' },
  { slug:'beluga', repo:'dasomel/beluga', name:'Beluga', role:'Data Platform Reference', pulseRole:'Data', stage:'Reference platform', verification:'2 E2E data paths', independence:'Reference environment' },
  { slug:'beluga-manager', repo:'dasomel/beluga-manager', name:'Beluga Manager', role:'Data Control Plane', pulseRole:'Data Control', stage:'Early / read-first', verification:'Domain/API boundary', independence:'Beluga-oriented' },
  { slug:'kubemetal', repo:'dasomel/kubemetal', name:'KubeMetal', role:'Emerging / Cloud-native AI', pulseRole:'AI / Edge', stage:'Emerging', verification:'Measured local baseline', independence:'Independent lab system' },
  { slug:'openforge', repo:'dasomel/openforge', name:'OpenForge', role:'Engineering Foundation', pulseRole:'Standards', stage:'Standards system', verification:'Standards → reference loop', independence:'Cross-project' },
] as const;

export const OSS_PORTFOLIO_REPOS = OSS_PORTFOLIO_PROJECTS.map((project)=>project.repo);

export function getOssPortfolioProject(slug:string) {
  return OSS_PORTFOLIO_PROJECTS.find((project)=>project.slug===slug);
}
