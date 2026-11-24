type Localized = { ko: string; en: string };

export type OssPortfolioGroup = {
  label: string;
  headline: Localized;
  description: Localized;
  question: Localized;
  focus: readonly { title: Localized; body: Localized }[];
  projects: readonly string[];
};

// Group copy restates facts from each project's frontmatter in src/content/projects; keep them in sync.
export const OSS_PORTFOLIO_GROUPS: readonly OssPortfolioGroup[] = [
  {
    label: 'Engineering Foundation',
    headline: {
      ko: '프로젝트가 늘어도 같은 방식으로 만들고 검증하게 하는 기반',
      en: 'The base that keeps every project built and verified the same way',
    },
    description: {
      ko: '개별 OSS 위에 얹는 기능이 아니라 그 아래에 깔리는 공통 기준입니다. OpenForge가 문서·CI·보안·릴리스·Agent 지침의 표준과 실행 가능한 audit을 제공하고, Kube-Ready-Box는 Kubernetes 노드용 OS baseline을, ClusterDeck은 자주 재생성되는 환경으로 들어가는 접속 경로를 고정합니다.',
      en: 'These are not features layered on top of individual projects but the shared ground beneath them. OpenForge provides standards and executable audits for documentation, CI, security, releases and agent instructions; Kube-Ready-Box fixes the OS baseline for Kubernetes nodes; ClusterDeck fixes the access path into environments that are recreated often.',
    },
    question: {
      ko: '저장소와 로컬 환경이 계속 늘어날 때, 매번 다시 준비하던 일을 어떻게 한 번만 정의할 것인가?',
      en: 'As repositories and local environments multiply, how do we define the recurring setup work only once?',
    },
    focus: [
      {
        title: { ko: '표준과 거버넌스', en: 'Standards and governance' },
        body: {
          ko: 'Standards·Templates에 executable audit과 lifecycle/maintenance registry를 결합해 구현 상태와 설명, 검증 근거가 어긋나지 않게 합니다.',
          en: 'Standards and templates are combined with executable audits and lifecycle/maintenance registries so implementation, claims and evidence do not drift apart.',
        },
      },
      {
        title: { ko: '노드 baseline', en: 'Node baseline' },
        body: {
          ko: 'Packer로 빌드한 Ubuntu 24.04/26.04 LTS Vagrant base box를 ARM64/AMD64, ext4/XFS 조합으로 배포해 OS 준비를 반복하지 않습니다.',
          en: 'Packer-built Ubuntu 24.04/26.04 LTS Vagrant base boxes ship for ARM64/AMD64 and ext4/XFS, so OS preparation is not repeated per cluster.',
        },
      },
      {
        title: { ko: '접속 경로', en: 'Access path' },
        body: {
          ko: 'IP 대신 Profile 이름을 유지하고 host discovery부터 SSH alias·ProxyJump, kubeconfig 정규화, 연결 확인까지 자동화합니다.',
          en: 'A stable Profile name replaces IP addresses, automating host discovery, SSH alias and ProxyJump, kubeconfig normalization and connectivity checks.',
        },
      },
    ],
    projects: ['openforge', 'kube-ready-box', 'clusterdeck'],
  },
  {
    label: 'Cloud Native Platform',
    headline: {
      ko: 'Kubernetes 위에서 플랫폼을 통합하고 운영하는 계층',
      en: 'The layer that integrates and operates a platform on Kubernetes',
    },
    description: {
      ko: '수십 개 Cloud Native 컴포넌트를 하나의 재현 가능한 IDP로 묶는 Narwhal이 중심이고, 그 운영 화면인 Narwhal Portal과 독립적으로 설치할 수 있는 스토리지·디렉터리 컴포넌트가 함께 있습니다. Narwhal은 DNS·TLS·identity·networking 같은 integration seam에서 반복되는 장애를 regression check와 live verification으로 남깁니다.',
      en: 'Narwhal sits at the center, integrating dozens of cloud-native components into one reproducible IDP, alongside its operational surface Narwhal Portal and independently installable storage and directory components. Narwhal turns recurring failures at integration seams such as DNS, TLS, identity and networking into regression checks and live verification.',
    },
    question: {
      ko: '컴포넌트를 각각 설치하는 것과 하나의 플랫폼으로 운영하는 것 사이의 간극을 어떻게 메울 것인가?',
      en: 'How do we close the gap between installing components one by one and operating them as one platform?',
    },
    focus: [
      {
        title: { ko: '플랫폼 통합', en: 'Platform integration' },
        body: {
          ko: '35개 GitOps-managed application을 하나의 IDP로 통합하고, 440건의 incident 기록을 393개 regression check로 연결합니다.',
          en: '35 GitOps-managed applications are integrated into one IDP, and 440 documented incidents are connected to 393 regression checks.',
        },
      },
      {
        title: { ko: '운영 경험', en: 'Operator experience' },
        body: {
          ko: '클러스터·애플리케이션·카탈로그·보안·비용·거버넌스 정보를 컴포넌트별 UI가 아닌 하나의 포털 화면에서 다룹니다.',
          en: 'Cluster, application, catalog, security, cost and governance information is handled in one portal instead of per-component dashboards.',
        },
      },
      {
        title: { ko: '재사용 컴포넌트', en: 'Reusable components' },
        body: {
          ko: 'NFS PersistentVolume에 파일시스템 Project Quota를 강제하는 에이전트와, 업스트림 소스에서 직접 빌드한 OpenLDAP 2.6.15 스택을 제공합니다.',
          en: 'An agent enforcing filesystem Project Quotas on NFS PersistentVolumes, and an OpenLDAP 2.6.15 stack built directly from upstream source.',
        },
      },
    ],
    projects: ['narwhal', 'narwhal-portal', 'nfs-quota-agent', 'ldapium'],
  },
  {
    label: 'Data Platform',
    headline: {
      ko: 'CDC에서 BI까지 데이터 경로를 끝까지 연결해 보는 reference',
      en: 'A reference that connects the data path end to end, from CDC to BI',
    },
    description: {
      ko: 'Kafka, Debezium, Flink, Iceberg, Trino, Superset, Airflow는 각각은 쉽게 설치되지만 경계를 이어 붙이는 순간 어려워집니다. Beluga는 Vagrant와 k3s 위에 Helm·Argo CD GitOps로 전체 플랫폼을 재현하고, 통합 control plane(manager/)을 같은 저장소에서 관리합니다.',
      en: 'Kafka, Debezium, Flink, Iceberg, Trino, Superset and Airflow are each easy to deploy, but hard once their boundaries have to connect. Beluga reproduces the whole platform on Vagrant and k3s with Helm and Argo CD GitOps, and keeps its unified control plane (manager/) in the same repository.',
    },
    question: {
      ko: '로컬 환경에서 데이터 플랫폼의 컴포넌트 경계를 일관되게 연결하고, 실제로 동작한다는 것을 어떻게 보일 것인가?',
      en: 'On a local machine, how do we connect data-platform component boundaries consistently and show that they actually work?',
    },
    focus: [
      {
        title: { ko: '수집 · 스트리밍', en: 'Ingestion and streaming' },
        body: {
          ko: 'Kafka와 Debezium CDC로 변경 데이터를 받아 Flink로 처리하는 구간입니다.',
          en: 'Change data arrives through Kafka and Debezium CDC and is processed with Flink.',
        },
      },
      {
        title: { ko: '저장 · 조회', en: 'Storage and query' },
        body: {
          ko: 'Iceberg lakehouse에 적재한 데이터를 Trino로 조회하고 Superset으로 시각화합니다.',
          en: 'Data lands in an Iceberg lakehouse, is queried with Trino and visualized in Superset.',
        },
      },
      {
        title: { ko: '오케스트레이션 · 검증', en: 'Orchestration and verification' },
        body: {
          ko: 'Airflow로 흐름을 조율하고, synthetic clickstream과 PostgreSQL CDC 두 가지 end-to-end 시나리오로 동작을 검증합니다.',
          en: 'Airflow orchestrates the flow, validated through two end-to-end scenarios: synthetic clickstream and PostgreSQL CDC.',
        },
      },
    ],
    projects: ['beluga'],
  },
  {
    label: 'Edge / Local AI',
    headline: {
      ko: '로컬 하드웨어와 edge에서 AI 인프라의 경계를 검증하는 실험',
      en: 'Experiments that test AI infrastructure boundaries on local hardware and at the edge',
    },
    description: {
      ko: 'KubeMetal은 Apple Silicon에서 Kubernetes control plane과 macOS native MLX compute를 분리하는 하이브리드 MLOps를, Siqoq는 simulation에서 edge hardware까지 같은 semantic event·action contract를 유지하는 Physical AI 인프라를 실험합니다. 두 프로젝트 모두 실행 위치가 달라져도 유지되어야 하는 경계를 먼저 정의합니다.',
      en: 'KubeMetal explores hybrid MLOps on Apple Silicon by separating the Kubernetes control plane from native macOS MLX compute; Siqoq explores Physical AI infrastructure that keeps the same semantic event and action contracts from simulation to edge hardware. Both start by defining the boundary that must hold when the execution location changes.',
    },
    question: {
      ko: '모든 것을 Kubernetes 안에서 실행할 수 없는 하드웨어에서, 어디까지를 control plane에 두고 어디부터 native로 실행할 것인가?',
      en: 'On hardware where not everything can run inside Kubernetes, what stays in the control plane and what runs natively?',
    },
    focus: [
      {
        title: { ko: 'Control / compute 분리', en: 'Control / compute separation' },
        body: {
          ko: 'K3s/Colima는 MLOps control plane으로 쓰고, GPU-bound MLX fine-tuning과 serving은 macOS host process로 실행합니다.',
          en: 'K3s/Colima acts as the MLOps control plane while GPU-bound MLX fine-tuning and serving run as macOS host processes.',
        },
      },
      {
        title: { ko: 'Contract 중심 경계', en: 'Contract-centered boundary' },
        body: {
          ko: 'Sensor·inference·transport·policy·action 구현을 adapter로 분리하고 semantic event/action contract를 안정적인 중심으로 둡니다.',
          en: 'Sensor, inference, transport, policy and action implementations sit behind adapters, with semantic event and action contracts as the stable center.',
        },
      },
      {
        title: { ko: 'Simulation-to-edge', en: 'Simulation-to-edge' },
        body: {
          ko: '시뮬레이터, 노트북, 실제 센서와 actuator가 서로 다른 API를 쓰더라도 perception-to-action 흐름을 재사용하고 검증할 수 있게 합니다.',
          en: 'The perception-to-action flow stays reusable and verifiable even when simulators, laptops, sensors and actuators expose different APIs.',
        },
      },
    ],
    projects: ['kubemetal', 'siqoq'],
  },
];

export const OSS_PORTFOLIO_ORDER = OSS_PORTFOLIO_GROUPS.flatMap((group) => group.projects);
