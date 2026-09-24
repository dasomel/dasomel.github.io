---
title: "📰 데일리 테크 다이제스트 - 2026-09-24"
description: "2026-09-24 Cloud, Kubernetes, AI, DevOps 소식 44건 — 자동 큐레이션 다이제스트."
pubDate: 2026-09-24
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### Secure AI agents with HashiCorp Boundary

엔터프라이즈 IT 운영 환경에서 AI 에이전트는 로그 분석, 장애 조사, 시스템 상태 점검, 후속 조치 권고 등을 수행하며 단순 보조자를 넘어 능동적인 작업 주체로 발전하고 있습니다. 이에 따라 AI 에이전트의 작업 범위가 넓어지면서 HashiCorp Boundary를 활용한 보안 및 접근 제어 방안이 주목받고 있습니다. 원문 링크 접근이 제한되어 제목과 발췌문 범위에서만 요약되었습니다.

> 💡 **왜 중요한가**: 자율형 운영 에이전트 도입 시 기존 인프라 접근 제어 솔루션을 연계하여 권한 오남용과 침해 사고 위험을 사전에 통제해야 합니다.

🔗 [원문 보기](https://www.hashicorp.com/blog/secure-ai-agents-with-hashicorp-boundary) · _HashiCorp_

---

## Kubernetes & Cloud Native

### [Building a single-pane NOC dashboard for Amazon EKS with Amazon CloudWatch](https://aws.amazon.com/blogs/containers/building-a-single-pane-noc-dashboard-for-amazon-eks-with-amazon-cloudwatch/)

_AWS Containers_

AWS가 Amazon EKS 클러스터를 위한 신뢰성 높은 Amazon CloudWatch 기반 단일 창(Single-pane) NOC 대시보드 구축 가이드를 발표했습니다. 이 솔루션은 EKS 관측성 애드온(v6.2.0 이상, v6.4.0-eksbuild.1 검증)의 OTel Container Insights PromQL 쿼리와 Application Signals 메트릭을 결합합니다. 대시보드는 35개 위젯의 통합 NOC와 인프라(9개), 애플리케이션 상태(11개), 인시던트 대응(12개)으로 나뉜 3개의 세부 드릴다운 화면으로 구성됩니다. 데이터 왜곡과 침묵 실패를 방지하기 위해 모든 PromQL에 클러스터 식별자(@resource.k8s.cluster.name)를 강제하고, 서비스 가용성과 지연시간을 단순 평균 대신 요청 수 가중 평균으로 계산합니다. 또한 메트릭 부재 시 오판을 막고자 or vector(0) 및 FILL(m,0)으로 정상 상태를 명시적 0으로 표기하며, absent_over_time(kube_node_info[15m]) 알람을 연동해 원격 측정 중단을 즉시 감지합니다.

> 💡 관측성 대시보드에서 정상 지표를 명시적 0으로 강제하고 텔레메트리 부재 알람을 결합하는 설계는 장애 대응 시 대시보드 오독으로 인한 인시던트 인지 지연을 방지합니다.

### [Which hat am I wearing right now?](https://www.cncf.io/blog/2026/09/23/which-hat-am-i-wearing-right-now/)

_CNCF_

CNCF 앰배서더 Mario Fahlandt가 오픈소스 생태계에서 기업의 이해관계와 중립성을 조율하는 방안을 다룬 기고문을 발표했습니다. 기고문은 2023년 구글 오픈소스 프로그램 오피스(OSPO) 설문조사를 인용하며 오픈소스 기여자의 82%가 기업의 급여를 받으며 활동하고 있어 이해 상충이 구조적으로 발생하기 쉽다고 지적합니다. 기여자는 프로젝트 메인테이너, 워킹 그룹 참여자, 기업 대표 등 서로 다른 역할을 오가며 활동하게 되며, 이에 따라 편향된 의사결정의 위험이 상존합니다. 저자는 토론이나 기술 의사결정 시 자신이 현재 어떤 역할(모자)로서 발언하는지 명시적으로 밝히는 소통 방식을 제안합니다. 궁극적으로 다중 역할을 수행할 때 기업의 단기적 이익보다 오픈소스 프로젝트와 커뮤니티의 장기적 안녕을 최우선에 두어야 한다고 강조합니다.

> 💡 오픈소스 기반 인프라 소프트웨어를 도입하거나 운영할 때 메인테이너의 소속 기업 편향과 중립성을 검토하여 거버넌스 종속 위험을 사전에 식별해야 합니다.

### [The operations gap between deploying an application and running it forever](https://aws.amazon.com/blogs/containers/the-operations-gap-between-deploying-an-application-and-running-it-forever/)

_AWS Containers_

AWS가 컨테이너화된 애플리케이션 포트폴리오의 배포와 지속적 운영을 전담 관리하는 'AWS Elastic Beanstalk Cluster Mode'를 발표했다. 새 클러스터 모드는 소스 코드(Java WAR, .NET Core, Python, PHP 등), Dockerfile, 또는 Amazon ECR의 사전 빌드된 컨테이너 이미지를 모두 입력으로 수용한다. 기존처럼 개별 앱마다 독립된 인프라 사일로를 띄우는 대신 클러스터 기반의 공유 인프라 모델을 적용하여 여러 컨테이너 애플리케이션을 효율적으로 통합 운영할 수 있다. 배포 중 헬스 체크가 실패하면 이전의 정상 버전으로 자동 롤백되며, OS 패치 및 런타임 보안 업데이트도 AWS가 무중단으로 자동 적용한다. Cluster Mode는 Elastic Beanstalk이 지원되는 모든 AWS 상용 리전에서 추가 서비스 비용 없이 기반 AWS 리소스 비용만으로 즉시 사용할 수 있다.

> 💡 컨테이너 플랫폼 엔지니어링 팀이 부재한 조직도 공유 클러스터 기반 완전 관리형 런타임을 통해 쿠버네티스 인프라 구축 부담 없이 레거시 및 컨테이너 앱 포트폴리오를 안정적으로 통합 운영할 수 있습니다.

### [Spotlight on SIG Apps](https://kubernetes.io/blog/2026/09/22/sig-apps-spotlight/)

_Kubernetes_

쿠버네티스 SIG Apps의 공동 의장인 Janet Kuo(구글)와 Maciej Szulik(레드햇)이 공식 인터뷰를 통해 워크로드 컨트롤러 생태계의 현재와 향후 로드맵을 공개했다. SIG Apps는 Deployment, StatefulSet, DaemonSet, Job, CronJob 등 핵심 워크로드 API를 총괄하며, 최근 배치 작업 최적화에 이어 서빙 워크로드(DaemonSet, StatefulSet)의 대규모 롤아웃 성능 개선에 집중하고 있다. 특히 노드 결함으로 DaemonSet 롤아웃이 멈춰 수동 개입이 발생하던 문제를 근본적으로 해결하기 위해 SIG Node, SIG Autoscaling과 협력하는 '노드 라이프사이클 워킹그룹(Node Lifecycle WG)'을 신설했다. 분산 AI 학습을 위한 JobSet과 분산 추론을 위한 LeaderWorkerSet(LWS) 서브프로젝트를 통해 단일 파드 장애 시 전체 파이프라인을 체크포인트부터 재시작하는 올오어나씽(all-or-nothing) 장애 복구 패턴도 고도화하고 있다. 또한 Job 실패 조건을 세분화해 상위 오케스트레이터가 정밀 대응할 수 있도록 지원하는 KEP-4443(PodFailurePolicyRule Name 필드 추가)을 쿠버네티스 1.38을 목표로 재추진 중이다.

> 💡 노드 장애로 인한 롤아웃 중단 문제 해결과 대규모 GPU 분산 학습을 위한 그룹 단위 실패 복구 메커니즘 도입으로 쿠버네티스 상의 AI 및 서빙 워크로드 운영 안정성이 크게 향상될 것입니다.

### [Implement per-pod image pull permissions with ECR repository policies on Amazon EKS](https://aws.amazon.com/blogs/containers/implement-per-pod-image-pull-permissions-with-ecr-repository-policies-on-amazon-eks/)

_AWS Containers_

Amazon EKS 멀티 테넌트 클러스터에서 파드별로 Amazon ECR 이미지 풀 권한을 격리하는 아키텍처가 공개되었다. 기존 EKS는 노드 IAM 역할을 사용해 kubelet이 이미지를 풀링하므로 같은 노드를 공유하는 서로 다른 팀의 파드가 모든 ECR 레포지토리에 접근할 수 있는 보안 취약점이 있었다. 이 솔루션은 EKS 1.35부터 지원되는 KEP 4412(쿠블렛 자격 증명 공급자용 서비스 계정 토큰 투영)와 ECR 레포지토리 거부(Deny) 정책을 결합한다. 워커 노드의 CredentialProviderConfig에 tokenAttributes를 구성하면, kubelet이 파드의 ServiceAccount 토큰을 ecr-credential-provider에 전달하여 지정된 IAM 역할을 획득한다. 각 팀의 ECR 레포지토리는 명시적 Deny 정책으로 승인된 IAM 역할 외의 접근을 차단하며, 어노테이션이 없는 VPC CNI나 CoreDNS 같은 시스템 파드는 기본 노드 IAM 역할로 폴백되어 정상 작동한다.

> 💡 노드 단위 공유 권한 대신 파드 서비스 계정 기반의 ECR 풀 권한 격리를 적용함으로써 멀티 테넌트 EKS 환경에서 테넌트 간 컨테이너 이미지 무단 유출 위험을 원천 차단할 수 있습니다.

### [Meet the Ecosystem: Partners and Customers at WeAreDevelopers with Docker](https://www.docker.com/blog/wearedevelopers-partner-customer-sessions-2026/)

_Docker_

Docker가 2026년 9월 23일부터 25일까지 미국 새너제이에서 열리는 'WeAreDevelopers World Congress North America'의 Docker Pavilion 고객 및 파트너 세션 라인업을 공개했다. 이번 행사는 AI 에이전트 워크로드의 격리(containment), 큐레이션, 통제 및 거버넌스를 위한 오픈 생태계 조성을 핵심 주제로 다룬다. 고객 세션에서는 Spectro Cloud의 Colton Shaw가 클라우드 연결이 없는 엣지 환경에서 로컬 추론 및 에이전트를 안정적으로 배포하는 Palette 클러스터 프로파일을 시연하며, J.P. Morgan Payments의 Alan Torrance는 API 키 없이 2개 컨테이너로 Payments OpenAPI 모의 서버를 구동하는 Docker Compose 사례를 발표한다. 또한 Docker, Spectro Cloud, J.P. Morgan 임원진이 참여해 단순 토큰 소비를 넘어 AI 거버넌스 소유권으로 전환하는 패널 토론을 진행한다. 파트너 세션에서는 Palo Alto Networks(Cortex XSIAM 감사 추적), Datadog(AI Guard 보안 인시던트 대응), Chainloop(PR 서명 및 세션 검증), Sonar(샌드박스 내 코드 품질 검증) 등의 에이전트 보안 기술이 소개된다.

> 💡 자율 AI 에이전트의 확산에 맞춰 컨테이너 샌드박스를 기반으로 권한·감사 추적·네트워크 격리를 표준화하는 플랫폼 엔지니어링 거버넌스 체계가 본격화되고 있습니다.

### [From attendee badge to speaker badge: My first KubeCon at KubeCon + CloudNativeCon India 2026](https://www.cncf.io/blog/2026/09/22/from-attendee-badge-to-speaker-badge-my-first-kubecon-at-kubecon-cloudnativecon-india-2026/)

_CNCF_

Nirmata의 소프트웨어 엔지니어이자 인도 최연소 골든 쿠베스트로넛(Golden Kubestronaut)인 Shreyas Mocherla가 KubeCon + CloudNativeCon India 2026에서 연사로 데뷔한 경험을 공유했다. 저자는 공동 발표자인 아버지 Janakiram MSV와 함께 'Run Your Own AI Cluster on a DGX Spark: Kubernetes, GPUs, and DRA' 세션을 진행했다. 해당 발표에서는 NVIDIA DGX Spark 하드웨어에 쿠버네티스 클러스터를 구축하고, 워크로드에 GPU 자원을 노출하며, 쿠버네티스의 동적 리소스 할당(DRA, Dynamic Resource Allocation)을 사용해 자원을 관리하는 방법을 다루었다. 또한 행사 중 CNCF의 모든 공인 인증 자격을 취득해야 주어지는 골든 쿠베스트로넛 핀을 수여받았다. 복도 트랙(Hallway Track)에서는 KodeKloud의 설립자 Mumshad Mannambeth, Kubestrong의 설립자 Yongkang He, Saiyam Pathak 등 클라우드 네이티브 커뮤니티 리더들과 교류하며 오픈소스 협력의 가치를 강조했다.

> 💡 쿠버네티스 동적 리소스 할당(DRA)을 엔비디아 하드웨어에 결합함으로써 사내 프라이빗 AI 클러스터 환경에서 GPU 파티셔닝과 워크로드 스케줄링의 유연성을 극대화할 수 있습니다.

### [Risky identities continue to plague cloud infrastructures](https://webflow.sysdig.com/blog/risky-identities-continue-to-plague-cloud-infrastructures)

_Sysdig_

Sysdig이 발표한 '2026 클라우드 네이티브 보안 및 사용 현황 보고서'에 따르면, 클라우드 IAM 설정 오류와 거버넌스 부실이 여전히 심각한 보안 위협으로 남아 있다. 조사 대상 기업 중 24%가 복수 클라우드 제공업체(CSP)에 걸쳐 계정을 운영하고 있으며, CSP 전반에서 사람 사용자 계정의 67%가 과도한 권한이나 장기 미사용, 다중 인증(MFA) 미적용으로 인해 위험 상태로 분류되었다. 특히 클라우드 환경 전체 식별자의 97.2%가 마이크로서비스, IaC 도구, AI 에이전트 등 기계(Machine) 식별자이며, 인간 계정은 3% 미만에 불과했다. 이 기계 식별자 중 약 40%는 관리자/편집 권한 보유, 사용자 관리 키 사용, 장기 비활성 등 위험 요소를 가지고 있는 것으로 확인되었다. Sysdig은 정적 정책 대신 동적 최소 권한 모니터링, 미사용 권한 자동 회수, 장기 키 제거 및 적시(Just-In-Time) 임시 권한 체계 도입을 권고했다.

> 💡 클라우드 인프라의 97% 이상을 차지하는 머신 및 AI 에이전트 식별자에 대해 정적 IAM 대신 JIT 기반 단기 자격증명과 미사용 권한 자동 제거를 적용해야 침해 사고 위험을 방지할 수 있다.

---

## AI & ML

### [How to Use NVIDIA Warp and MjWarp to Accelerate Robotics Simulation and Learning Workflows](https://huggingface.co/blog/nvidia/how-to-use-nvidia-warp-and-mjwarp)

_Hugging Face_

엔비디아 엔지니어링 팀이 CPU 기반 MuJoCo 로봇 시뮬레이션을 GPU 환경으로 확장하는 MuJoCo Warp(MJWarp)의 아키텍처와 마이그레이션 절차를 공개했습니다. MJWarp는 Python 기반 고성능 GPU 커널 프레임워크인 NVIDIA Warp 위에서 구동되며, 기존 MJCF 모델 구조를 그대로 유지한 채 단일 GPU에서 수천 개의 독립 환경을 일괄 처리합니다. 본 가이드는 SO-101 로봇 팔의 픽앤플레이스 작업을 최대 2,048개 병렬 환경(nworld=2048)으로 확장하는 과정을 다루며, nconmax와 njmax 등 접촉 및 제약 조건 버퍼 튜닝 방법을 설명합니다. 특히 CUDA Graph 캡처(wp.ScopedCapture)를 적용해 커널 디스패치 오버헤드를 줄이고, wp.synchronize()를 통한 정확한 집계 처리량 측정 방식을 제시합니다. 향후 Newton 엔진 및 Isaac Lab과의 통합을 통해 강화학습 훈련 파이프라인의 처리량을 극대화할 수 있도록 지원합니다.

> 💡 GPU 가속 기반의 대규모 병렬 물리 시뮬레이션은 단일 스텝 지연시간 대신 배치 처리량을 극대화함으로써 로봇 공학 및 강화학습 파이프라인의 훈련 시간과 컴퓨팅 비용을 대폭 절감합니다.

### [Google Beam expands with new regions, partners, and customers](https://blog.google/innovation-and-ai/technology/research/google-beam-expansion/)

_Google AI_

구글이 실감형 원격 커뮤니케이션 기술인 Google Beam을 미국, 캐나다, 영국, 프랑스, 독일, 일본 등 6개국으로 글로벌 확장한다고 발표했습니다. 이번 확장은 HP와의 하드웨어 협력으로 제작된 HP Dimension with Google Beam 장비를 중심으로 진행되며, 전 세계 18개 공인 파트너 네트워크가 배포와 지원을 담당합니다. 이 시스템은 Google Meet과 Zoom 플랫폼과 직접 연동되며, 베인앤드컴퍼니(Bain & Company), 넷플릭스, 캐피털 그룹 등이 채용 면접과 원격 협업에 도입했습니다. 구글 내부 8주간의 연구 결과에 따르면 Beam 도입 팀은 상호 유대감이 50% 향상되었고, 피드백 이해도가 33% 개선되었으며, 후속 미팅 필요성은 21% 감소했습니다. 또한 프리미엄 공유 오피스 기업 인더스트리어스(Industrious)와 제휴하여 10월부터 애틀랜타, 시카고, 뉴욕, 팔로알토 지점에서 시범 예약 서비스를 제공합니다.

> 💡 하드웨어 기반 실감형 화상 회의 장비의 다국가 엔터프라이즈 확장은 분산 근무 환경에서 비디오 스트리밍 트래픽 최적화와 회의실 전용 네트워크 대역폭 확보의 중요성을 부각시킵니다.

### [Two years of OpenAI Academy](https://openai.com/index/two-years-of-openai-academy)

_OpenAI_

OpenAI가 교육 프로그램인 OpenAI Academy 설립 2주년을 맞이하여 다양한 글로벌 커뮤니티로 AI 기술 교육을 지속적으로 확장하고 있습니다. 이 프로그램은 개발자와 일반 사용자들이 실무에 필요한 AI 활용 역량을 습득할 수 있도록 교육 기회를 제공하는 것을 목표로 합니다. 원문 링크 접근이 제한되어 제목과 발췌문 범위에서만 요약되었습니다.

> 💡 광범위한 AI 리터러시 교육의 확대는 엔터프라이즈 전반에서 자동화 도구 채택을 촉진하여 내부 IT 지원 및 인프라 운영 체계의 선제적 현대화를 요구합니다.

### [OpenAI extends cyber access to Ukraine for civilian defense](https://openai.com/index/openai-extends-cyber-access-to-ukraine-for-civilian-defense)

_OpenAI_

OpenAI가 우크라이나 정부의 민간 인프라 사이버 방어를 지원하기 위해 Daybreak 프로그램 접근 권한을 제공한다고 발표했습니다. 이번 협력은 우크라이나 디지털전환부와 함께 추진되었으며, 2026년 9월 23일 유엔 총회 기간 중 Dmytro Kushneruk 샌프란시스코 주재 우크라이나 총영사와 Sasha Baker OpenAI 국가안보정책 총괄이 공개했습니다. 우크라이나 침해대응팀(CERT-UA)은 2025년에만 약 6,000건의 사이버 침해 사고를 처리하며 전력망, 의료, 통신 등 핵심 민간 시설에 대한 지속적인 공격에 대응해 왔습니다. Daybreak 프로그램은 공인된 방어 인력에게 AI 도구를 제공하여 레거시 소프트웨어 코드 감사, 의심 활동 분석, 취약점 검증 및 보안 패치 테스트를 신속하게 수행하도록 지원합니다. 이를 통해 공격자의 정교화된 위협에 맞서 국가 핵심 서비스의 방어 대응 주기를 대폭 단축하는 것을 목표로 합니다.

> 💡 중요 인프라를 운영하는 환경에서 LLM 기반 보안 에이전트를 도입하면 레거시 코드 취약점 분석과 패치 배포 주기를 단축하여 제로데이 위협 대응력을 높일 수 있습니다.

### [Sam Altman’s remarks at the United Nations Security Council](https://openai.com/index/sam-altman-un-security-council-remarks)

_OpenAI_

OpenAI CEO Sam Altman이 2026년 9월 23일 뉴욕 유엔 안전보장이사회에서 열린 인공지능 안전 위험 관련 첫 공식 회의에 참석해 발언했습니다. 이번 회의에는 Anthropic의 Dario Amodei CEO, Hugging Face의 Clément Delangue 공동창업자, 인공지능 연구자 Yoshua Bengio 등이 함께 참석했습니다. Altman은 인류가 AI 기술 발전의 중대한 갈림길에 서 있으며, 시스템 통제력을 상실할 경우 회복하기 어려운 위협이 발생할 수 있다고 경고했습니다. 그는 AI의 미래에 대한 중대한 결정을 샌프란시스코의 연구소들에만 맡겨둘 수 없으며 정부와 민주적 절차를 통한 규제 감독이 필수적이라고 강조했습니다. 또한 고위험 AI 모델에 대한 국제 역량 평가 표준 구축, 신속한 보안 사고 보고 체계, 각국 정부와 중요 인프라 운영자 간의 보안 통신 채널 설립을 촉구했습니다.

> 💡 향후 AI 기반 시스템에 대한 정부 차원의 보안 규제 및 인프라 사고 보고 의무화가 현실화될 수 있으므로 AI 파이프라인의 감사 추적성과 통제 메커니즘을 미리 설계해야 합니다.

### [How UK AISI and EvalEval Are Making Benchmark Results Reproducible](https://huggingface.co/blog/evaleval-aisi)

_Hugging Face_

영국 AI 안보 연구소(UK AISI)와 EvalEval 연합이 벤치마크 평가 결과의 재현성과 투명성을 높이기 위해 'Evaluation Cards' 기반 오픈 인프라 협업을 발표했다. NeurIPS 2025 워크숍에서 시작된 이번 연구는 AISI의 평가 도구인 OptStop 및 계층적 베이지안 모델링 도구인 HiBayES를 기반으로 'Every Eval Ever(EEE)' 보고 표준을 발전시켰다. 이번 공개 데이터는 AISI의 연구 논문 'How Inference Compute Shapes Frontier LLM Evaluation'과 연계되어 추론 연산량 및 프로토콜에 따른 모델 성능 변화를 다룬다. 평가 대상은 Claude Opus 4, 4.5, 4.6과 GPT-5, 5.2, 5.4의 6개 프론티어 모델이며, HealthBench, FrontierMath, Humanity's Last Exam, SWE-Bench Pro, Terminal-Bench 2.0 및 2개 사이버 평가(Cyber CTFs, The Last Ones)의 트랜스크립트 수준 실행 결과와 환경 설정을 포함한다. 이를 통해 연구진은 불투명한 단일 점수 대신 상세 실행 조건과 오라클 피드백에 따른 토큰별 성능 추이를 직접 대조하고 검증할 수 있다.

> 💡 추론 시점 연산량과 평가 환경 설정에 따라 벤치마크 결과가 크게 달라지므로, 표준화된 EEE 스키마와 실행 트레이스 투명성을 확보해야 모델 도입 시 객관적인 성능 평가가 가능하다.

### [Transformers now runs llama.cpp quants](https://huggingface.co/blog/transformers-llama-cpp-quants)

_Hugging Face_

Hugging Face가 PyTorch transformers 라이브러리에서 GGUF 양자화 모델을 네이티브로 실행할 수 있는 기능을 지원한다고 발표했다. 개발자는 from_pretrained에 gguf_file 인자를 전달하는 것만으로 허브에 등록된 GGUF 체크포인트를 표준 transformers API로 즉시 로드할 수 있다. 이 구현은 kernels 라이브러리를 통해 llama.cpp의 기본 ggml 커널 및 Apple Silicon Metal 가속(ggml-org/ggml-attn)을 재사용하며, Qwen3.5 아키텍처(Unsloth Qwen3.5-4B 기준 BF16 8.42GB에서 Q4_K_M 2.74GB로 감축)를 우선 지원한다. 또한 transformers serve 명령을 통해 localhost:8000/v1에서 Jan이나 Pi 같은 클라이언트와 연동 가능한 OpenAI 호환 API 서버를 띄울 수 있으며, --reasoning 플래그로 추론 사고 토큰 출력을 제어할 수 있다. MacBook Pro M2 Max(32GB) 환경에서 llama-bench(빌드 5f55650a7)와 비교 측정한 결과 llama.cpp에 근접한 생성 속도를 기록했으며, GgufConfig(dequantize=True) 설정을 통해 양자화 해제 후 파인튜닝하는 워크플로도 지원한다.

> 💡 PyTorch 생태계에서 별도 런타임 없이 GGUF 양자화 모델을 직접 서빙하고 파인튜닝할 수 있게 됨으로써, 로컬 개발 머신과 온프레미스 에지 환경의 AI 파이프라인 구축 비용이 대폭 절감된다.

---

## 클라우드 업데이트

### [A guide to speeding up your video processing with AlphaEvolve](https://cloud.google.com/blog/topics/developers-practitioners/how-to-speed-up-your-video-processing-with-alphaevolve/)

_Google Cloud_

구글 클라우드와 파트너사 DoIt이 자율형 폐루프 진화 최적화 도구인 AlphaEvolve를 활용해 실시간 비디오 파이프라인의 Swift/Metal 프로덕션 코드를 가속한 사례를 공유했습니다. 30fps 환경에서는 프레임당 33.3ms, 60fps에서는 16.6ms라는 엄격한 지연시간 예산 내에 신경망 분할과 셰이더 합성을 완료해야 합니다. AlphaEvolve는 구글 클라우드에서 Gemini 앙상블 모델이 코드를 생성하는 클라우드 생성부와 로컬 macOS 하드웨어에서 네이티브 코드를 빌드하고 측정하는 로컬 평가부의 분할 루프 구조를 취합니다. 지연시간 단축에만 치중해 블러 연산을 통째로 건너뛰는 벤치마크 편법을 막기 위해, 평균 SSIM 0.98 미만 또는 최악 프레임 SSIM 0.95 미만일 때 실격 처리하는 품질 게이트를 적용했습니다. 이를 통해 모델은 프레임 간 마스크 캐싱이라는 시스템 수준의 최적화를 자율적으로 발견했으며, 하드웨어 불변 한계선과 소프트웨어 오버헤드를 분리해 최적화 한계를 체계적으로 도출했습니다.

> 💡 클라우드 LLM 코드 생성과 로컬 하드웨어 벤치마크를 결합한 분할 루프 최적화는 엄격한 품질 게이트를 전제로 저수준 시스템 소프트웨어의 튜닝 자동화에 실질적인 돌파구를 제공합니다.

### [GKE becomes more elastic: Scale to zero, save costs, and keep workloads responsive](https://cloud.google.com/blog/products/containers-kubernetes/gke-adds-native-scale-to-zero-capabilities/)

_Google Cloud_

구글 클라우드가 GKE 1.37 버전을 통해 이벤트 기반 및 간헐적 워크로드를 위한 네이티브 스케일 투 제로(Scale-to-zero) 기능을 발표했습니다. 기존에는 KEDA와 복잡한 CRD를 유지해야 했으나, 이제 컨트롤 플레인에 직접 통합되어 수만 줄에 달하던 설정 YAML과 별도 운영 부담을 제거했습니다. 이 기능은 minReplicas 0을 지원하는 쿠버네티스 KEP-2021과 AutoscalingMetric CRD(autoscaling.gke.io/v1beta1)를 기반으로 작동하여 외부 어댑터 없이 Cloud Monitoring 및 Managed Service for Prometheus 메트릭을 HPA로 직접 연동합니다. 또한 파드가 0에서 1로 확장될 때 발생하는 60~90초의 노드 프로비저닝 콜드스타트를 해소하기 위해 GKE 용량 버퍼를 도입했습니다. 용량 버퍼는 수백 개의 유휴 워크로드가 공유하는 소규모 액티브 버퍼와 저비용으로 이를 신속히 보충하는 스탠바이 버퍼의 이중 구조로 운영되어 즉각적인 기동성과 비용 절감을 동시에 달성합니다.

> 💡 HPA 네이티브의 0 스케일링과 공유 용량 버퍼의 결합은 유휴 인프라 비용을 제거하면서도 노드 프로비저닝 지연 문제를 해결해 클러스터 자원 효율성을 극대화합니다.

### [Scale your own way, using HPA with built-in support for PromQL metrics queries in GKE](https://cloud.google.com/blog/products/containers-kubernetes/native-support-for-prometheus-metrics-in-gke/)

_Google Cloud_

Google Cloud가 Google Kubernetes Engine(GKE)의 Horizontal Pod Autoscaler(HPA)에서 PromQL 메트릭 쿼리를 기본 지원하는 프리뷰 기능을 공개했습니다. 기존에는 Cloud Monitoring이나 프로메테우스 메트릭으로 파드를 오토스케일링하려면 Stackdriver Custom Metrics Adapter나 서드파티 Prometheus 어댑터 파드를 별도로 배포하고 IAM을 구성해야 했습니다. 이번 업데이트는 AutoscalingMetric 커스텀 리소스를 확장하여 Google Managed Service for Prometheus(GMP)에 저장된 메트릭을 어댑터 없이 직접 HPA 파이프라인으로 전달하며, 메트릭 읽기 지연 시간을 5초 수준으로 단축합니다. 컨트롤러는 GKE 컨트롤 플레인에 상주하며 활성화된 PromQL 요청이 있을 때만 워커 노드에 시스템 파드를 띄워 유휴 자원 낭비를 방지합니다. 향후 정식 출시(GA) 단계에서는 자체 호스팅 프로메테우스 서버 연동도 지원할 예정입니다.

> 💡 외부 커스텀 메트릭 어댑터 파드와 IAM 권한 매핑을 제거함으로써 클러스터 운영 복잡도를 낮추고 오토스케일링 루프의 지연과 장애 포인트를 줄일 수 있습니다.

### [Bringing enterprise Linux to the robotics frontier: ROS2 adds Red Hat Enterprise Linux as a tier-1 supported platform](https://www.redhat.com/en/blog/bringing-enterprise-linux-robotics-frontier-ros2-adds-red-hat-enterprise-linux-tier-1-supported-platform)

_Red Hat_

Red Hat의 Kelly Switt와 Jeffrey Osier-Mixon은 로봇 운영체제인 ROS2(Robot Operating System)가 Red Hat Enterprise Linux(RHEL)를 티어 1(Tier-1) 공식 지원 플랫폼으로 채택했다고 발표했습니다. 티어 1 지정은 정기적인 통합 테스트와 패키징, 신속한 버그 수정을 보장받는 최상위 지원 계층을 의미합니다. 이번 협력을 통해 RHEL의 엔터프라이즈급 라이프사이클 안정성과 보안 검증 체계가 글로벌 로보틱스 생태계에 직접 적용됩니다. 특히 산업 자동화 및 자율주행 엣지 환경에서 GPU, NPU 등 이기종 하드웨어 가속기와의 연동 표준화가 간소화되었습니다. 개발팀은 커널 레벨부터 엣지 디바이스까지 일관된 보안 모니터링과 규정 준수를 유지하며 미션 크리티컬한 피지컬 컴퓨팅 워크로드를 운영할 수 있습니다.

> 💡 RHEL이 ROS2의 공식 티어 1 플랫폼으로 편입됨에 따라 산업용 로봇과 자율주행 엣지 노드에서도 엔터프라이즈 리눅스의 패치 주기와 보안 표준을 그대로 적용할 수 있게 되었습니다.

### [Unify VMs and containers with Everpure Cloud on Azure Red Hat OpenShift](https://www.redhat.com/en/blog/unify-vms-and-containers-everpure-cloud-azure-red-hat-openshift)

_Red Hat_

Red Hat이 Microsoft Azure Red Hat OpenShift(ARO)와 Everpure Cloud(구 Portworx)의 통합 솔루션을 발표했습니다. 많은 기업이 기존 가상 머신(VM)과 현대적 컨테이너 워크로드를 별도 인프라에서 격리 운영하며 겪던 관리 단절을 해소하기 위한 조치입니다. 엔지니어는 Azure Portal 내에서 컨테이너, VM, 기본 스토리지를 단일 인터페이스로 프로비저닝하고 운영할 수 있습니다. Everpure의 지능형 데이터 엔진은 씬 프로비저닝과 데이터 중복 제거를 통해 클라우드 스토리지 비용을 최대 40% 절감하며, Azure 소비 약정(MACC)과 Azure 하이브리드 혜택을 지원합니다. 또한 Portworx 기반의 자동화된 재해 복구(DR), 불변 스냅샷, 네임스페이스 단위의 보안 정책을 제공하며 Microsoft와 Red Hat이 24/7 공동 기술 지원을 제공합니다.

> 💡 Azure Red Hat OpenShift 환경에서 레거시 VM과 쿠버네티스 컨테이너의 영구 스토리지를 일원화함으로써 최대 40%의 스토리지 비용 절감과 재해 복구 자동화를 동시에 확보할 수 있습니다.

### [The playbook behind Red Hat’s most successful OpenShift deployments](https://www.redhat.com/en/blog/playbook-behind-red-hats-most-successful-openshift-deployments)

_Red Hat_

Red Hat의 OpenShift 프로덕트 매니지먼트 시니어 매니저 Siamak Sadeghianfar가 OpenShift 도입 기업들을 위한 4단계 클라우드 네이티브 플레이북을 공개했습니다. 저자는 클러스터를 처음 구축하고 축하한 뒤 1년이 지나도 초기 마이그레이션된 5개 앱만 구동되고 운영팀은 수동 지원에 갇히는 기업들의 전형적인 안착 실패 패턴을 지적했습니다. 클러스터 배포라는 인프라 구축 마일스톤에 만족하지 않고 조직 전반의 실제 채택을 이끌어내기 위해서는 체계적인 단계별 접근이 필수적입니다. 플레이북은 단순 컨테이너화 단계에서 출발하여 개발자 셀프서비스 활성화, 운영 자동화, 최종 최적화 및 비즈니스 가치 창출에 이르는 4단계 로드맵을 제시합니다. 이를 통해 플랫폼 팀이 개발자 지원에 매몰되지 않고 엔터프라이즈 환경에서 플랫폼 엔지니어링을 지속 가능하게 확장할 수 있는 실무 지침을 제공합니다.

> 💡 쿠버네티스 클러스터 구축 자체를 목표로 삼지 않고 개발자 셀프서비스와 운영 자동화를 포함한 4단계 플레이북을 따라야 플랫폼 엔지니어링의 정체를 방지할 수 있습니다.

### [We just shipped support for the ugliest part of HTTP: Vary](https://blog.cloudflare.com/vary-support/)

_Cloudflare_

Cloudflare가 Free, Pro, Business, Enterprise 등 모든 요금제를 대상으로 Cache Rules에서 HTTP 'Vary' 응답 헤더 지원을 공식 출시했다. 동일한 URL이라도 클라이언트의 Accept 헤더에 따라 HTML 또는 JSON을 반환하거나, Accept-Language에 따라 다국어 페이지를 제공하는 원본 서버의 응답을 엣지 캐시가 정확하게 구분하여 서빙할 수 있게 되었다. 사용자는 대시보드, Rulesets API, Terraform을 통해 Vary 헤더에 대해 정규화(normalize), 원본 전달(passthrough), 캐시 바이패스(bypass)의 세 가지 처리 방식을 헤더별로 지정할 수 있다. 예를 들어 Accept는 html과 json으로, Accept-Language는 en, fr, de 등 지원 대상 언어로 정규화하여 무분별한 헤더 조합으로 인한 캐시 키 폭증(Cache Fragmentation)을 방지한다. 원본 응답과 무관하게 요청 헤더를 캐시 키에 무조건 추가하는 커스텀 캐시 키(Custom Cache Key)와 달리, Vary는 원본 서버가 명시한 응답에만 동적으로 캐시 분기를 적용한다.

> 💡 엣지 CDN 레벨에서 Vary 헤더 정규화를 적용하면 단일 엔드포인트 다국어 및 API 콘텐츠 협상 시 캐시 파편화를 방지하고 원본 서버 부하를 크게 낮출 수 있습니다.

### [Introducing Worker Previews: Isolated preview environments for every change your agent makes](https://blog.cloudflare.com/worker-previews/)

_Cloudflare_

Cloudflare가 Git 브랜치마다 독립된 URL, 설정, 상태, 관측성을 제공하는 'Worker Previews'를 발표했다. 개발자는 'npx wrangler preview' 명령으로 브랜치별 프리뷰 환경을 배포할 수 있으며, Wrangler 설정 파일의 'previews' 블록을 기반 구성으로 삼고 개별 변수나 바인딩을 유연하게 재정의할 수 있다. 특히 Durable Objects(DO)와 Containers에 대해 브랜치 단위로 독립된 네임스페이스(ctx.exports)와 컨테이너 애플리케이션을 자동 생성하여, 프로덕션 상태 오염이나 마이그레이션 실패 위험을 원천 차단한다. 또한 Workers Observability가 프리뷰 단위로 격리된 워터폴 추적을 지원하며, Browser Run 및 Playwright MCP와 결합해 AI 에이전트가 배포부터 UI 탐색, 로그 검증, 코드 패치까지 자율적으로 완결할 수 있다.

> 💡 스테이트풀 리소스까지 브랜치 단위로 격리하고 관측성 MCP와 결합함으로써, 복잡한 스테이징 인프라 유지비용 없이 AI 에이전트 기반 자율 배포 및 검증 루프를 안전하게 운영할 수 있다.

---

## DevOps & 인프라

### [Q.ANT gives away the software for its light-powered AI chips in a CUDA-style bet on developers](https://thenewstack.io/q-ant-open-sources-cuda/)

_The New Stack_

독일 슈투트가르트 소재 스타트업 Q.ANT가 자사 광학 기반 AI 칩을 위한 소프트웨어 개발 키트인 Q.ANT Native Computing Toolkit을 GitHub에 오픈소스로 무료 공개했습니다. 이 툴킷은 상용 라이선스를 지원하며 Python과 C 언어로 작성 가능하고, 전용 드라이버 없이 일반 PC에서 칩 동작을 모사하는 시뮬레이터를 제공합니다. Q.ANT의 프로세서는 연산 일부를 코사인 형태의 광파 함수로 처리해 파라미터 수와 소비 전력을 줄이도록 설계되었으며, 현재 뮌헨 인근 라이프니츠 슈퍼컴퓨팅 센터(LRZ) 등 일부 연구소에서 2세대 칩이 가동 중입니다. 일반 사용자는 향후 수개월 내 독일 클라우드 제공업체 IONOS나 온프레미스 서버를 통해 하드웨어에 접근할 수 있을 예정입니다. 2025년 7월 6,200만 유로 규모의 투자를 유치한 Q.ANT는 엔비디아의 CUDA 생태계 전략처럼 소프트웨어를 선공개해 광학 컴퓨팅 생태계를 선점하겠다는 구상입니다.

> 💡 포토닉 가속기는 전력 소모 한계에 직면한 AI 인프라에 대안을 제시하지만, 실제 프로덕션 도입 전 시뮬레이터를 통한 워크로드 호환성 검증이 선행되어야 합니다.

### [“Impressive level of openness”: Xiaomi goes way beyond the usual open-weight playbook with MiMo-V2.6](https://thenewstack.io/xiaomi-mimo-vs-6-open-source/)

_The New Stack_

샤오미가 최신 추론 모델 MiMo-V2.6을 공개하며 9월 15일부터 5일간 강화학습(RL) 프로덕션 훈련 과정을 대시보드로 실시간 생중계했습니다. 공개된 강화학습 비용은 MiMo-V2.6-Flash 모델이 85만 4,044달러, Pro 모델이 262만 670달러로 총 350만 달러에 달합니다. 딥시크(DeepSeek) 출신 뤄푸리(Fuli Luo)가 이끄는 샤오미 팀은 가중치를 조건 없는 MIT 라이선스로 배포했으며, 90억 파라미터 Qwen 기반 연구용 모델과 기술 보고서를 함께 제공했습니다. 또한 샤오미는 소프트웨어 엔지니어링, 취약점 재현 등 7,000개 이상의 검증 가능 보상(RLVR) 태스크 환경과 엔드투엔드 훈련 프레임워크를 수주 내 오픈소스로 공개하겠다고 밝혔습니다. 허깅페이스의 토마스 울프(Thomas Wolf) 등 연구진은 단순 가중치 공개를 넘어 고품질 RLVR 환경 자체를 공유하는 접근법에 주목하고 있습니다.

> 💡 검증 가능 보상(RLVR) 기반의 대규모 모델 훈련 환경과 상세 비용 데이터의 개방은 기업이 자체 에이전트 인프라 구축 비용을 추정하고 검증 파이프라인을 설계하는 데 중요한 기준점을 제공합니다.

### [A third option is emerging in the fight over AI and your data](https://thenewstack.io/vast-dataenclave-confidential-computing/)

_The New Stack_

VAST Data의 공동 창업자 제프 덴워스(Jeff Denworth)가 팟캐스트를 통해 기업 데이터 보안과 AI 모델 지적재산권(IP) 보호 문제를 해결하는 신제품 DataEnclave를 소개했습니다. 기업은 독점 데이터 유출이나 AI 학습 활용을 우려하고, AI 연구소는 고객 인프라에 모델 가중치가 직접 노출되는 것을 꺼리는 상호 불신 문제가 지속되어 왔습니다. DataEnclave는 엔비디아의 기밀 컴퓨팅(Confidential Computing) 기술을 활용해 격리된 보안 환경에서 독점 모델을 안전하게 구동할 수 있도록 지원합니다. VAST Data의 핵심 인프라인 AI OS 기반 위에서 작동하며, 2025년 말 에이전트 코딩 도구의 폭발적 보급과 토큰 소비 급증으로 인해 제기된 엔터프라이즈 보안 요구를 반영했습니다. 현재 초기 접근(Early Access) 단계를 거쳐 일반 가용성(GA) 출시를 준비하고 있습니다.

> 💡 기밀 컴퓨팅 기반 하드웨어 엔클레이브는 엔터프라이즈 멀티테넌트 환경에서 민감 데이터와 서드파티 고성능 AI 모델을 분리 결합하는 표준 아키텍처로 자리잡고 있습니다.

### [Rendering huge pull requests in the GitHub Copilot app](https://github.blog/engineering/user-experience/rendering-huge-pull-requests-in-the-github-copilot-app/)

_GitHub_

깃허브 엔지니어링 팀이 2,200개 파일, 100만 줄 이상의 코드 변경, 400개 이상의 인라인 리뷰 댓글을 포함하는 대규모 PR을 원활히 렌더링하기 위해 GitHub Copilot 앱의 diff 뷰어를 재설계했습니다. 일반적인 코드 가상화는 행 높이가 고정되어 있어 빠르지만, 마크다운 줄바꿈이나 접기 토글이 포함된 동적 댓글 블록이 섞이면 레이아웃 계산이 깨지는 문제가 있었습니다. 이를 해결하기 위해 결정론적 코드 높이와 동적 블록 높이를 분리하는 이중 지오메트리 구조를 도입하고, 댓글 블록은 지문과 너비 버킷을 기반으로 캐싱했습니다. 또한 각 요소마다 ResizeObserver를 등록하는 대신, 스크롤 유휴 시점에 뷰포트 인근 2,400픽셀 내 블록만 일괄 측정하는 스케줄러를 구축했습니다. 나아가 픽셀 좌표 대신 요소 식별자 기반의 스크롤 앵커링을 적용해 댓글 렌더링 후 화면이 튀는 현상을 방지했습니다.

> 💡 대규모 가상화 렌더링에서 고정 높이 코드와 가변 높이 위젯의 좌표계를 분리하고 뷰포트 기반 일괄 측정 스케줄러를 적용하는 기법은 복잡한 웹 UI의 스크롤 성능 최적화에 필수적인 교훈을 제공합니다.

### [Developers want more efficient software. Here’s what over 1000 GitHub users told us they need.](https://github.blog/news-insights/research/developers-want-more-efficient-software-heres-what-over-1000-github-users-told-us-they-need/)

_GitHub_

GitHub가 예일대 기후변화 커뮤니케이션 프로그램(YPCCC)과 공동으로 1,039명의 개발자를 대상으로 진행한 소프트웨어 에너지 효율 연구 결과를 발표했습니다. 조사에 따르면 응답자의 80%가 에너지 효율적인 코드를 작성할 수 있는 도구 도입을 원하고 있으며, 약 75%는 소프트웨어 및 파이프라인의 환경적 영향을 측정할 수 있는 수단이 필요하다고 응답했습니다. 또한 응답자의 71%는 막대한 전력과 용수를 소비하는 AI 시스템의 환경 영향과 탄소 배출에 우려를 표했습니다. 설문에 참여한 개발자의 75%는 기업이 인프라 탄소 발자국 감축을 위해 적극적으로 행동해야 한다고 답했습니다. 보고서를 작성한 Paull Young은 많은 엔지니어가 낭비되는 연산 자원(wasted compute)을 줄이고자 하지만 실질적인 측정 지표와 최적화 가이드라인이 부재하다고 지적했습니다.

> 💡 CI/CD 파이프라인과 클라우드 워크로드에서 낭비되는 연산 자원을 측정하는 그린 옵저버빌리티 도구를 도입하면 탄소 발자국 감축과 인프라 비용 절감을 동시에 달성할 수 있습니다.

### [Dropbox CTO Ali Dasdan on moving from AI adoption to transformation](https://dropbox.tech/culture/learnings-from-deploying-ai-at-company-scale)

_Dropbox_

Dropbox의 Ali Dasdan 최고기술책임자(CTO)와 Uma Namasivayam 엔지니어링 생산성 시니어 디렉터가 전사 단위의 AI 도입 및 전환 경험을 공유했습니다. Dropbox는 현재 작성되는 전체 코드의 약 70%를 AI로 생성하고 있으며, 이는 최근 Uber가 발표한 수치와 유사한 수준입니다. 회사는 코딩 에이전트의 실행과 검증을 엔지니어링 워크플로에 연결하는 사내 플랫폼 Nova를 구축해 활용하고 있습니다. 대규모 코드베이스를 보유한 동종 기업 벤치마크 결과, Dropbox의 풀 리퀘스트(PR) 처리량은 상위 5%를 기록했으며 배포 실패율은 업계 75 백분위 수준을 유지했습니다. 특히 피어 그룹 대비 토큰 소비량이 가장 낮은 수준에 머물렀는데, 이는 단순 호출 횟수 대신 토큰이 실제 엔지니어링 결과물로 이어지도록 파이프라인을 효율화한 성과라고 설명했습니다.

> 💡 사내 코딩 에이전트를 도입할 때는 단순 토큰 사용량보다 자동화된 검증 파이프라인을 구축하여 배포 실패율을 억제하면서 PR 처리량을 극대화하는 엔드투엔드 워크플로 최적화가 핵심입니다.

### [연 300시간을 아낀 AI 상담 서비스](https://toss.tech/article/AI_chatbot)

_토스_

토스뱅크 전세대출 팀의 김혜미 프로덕트 디자이너가 머신러닝 팀 및 대출 운영팀과 협업하여 AI 상담 서비스를 구축한 과정을 소개했습니다. 전세대출 특성상 화면에 안내가 되어 있어도 개인별 대출 가능 여부와 심사 서류에 대한 불안감으로 고객센터 단순 문의가 집중되어 심사 인력의 병목이 발생했습니다. 초기에는 빈 텍스트 입력창 배너를 배치했으나 이용률이 저조하자, 실제 문의 데이터를 분석하여 각 퍼널 단계별 다빈도 질문을 진입점에 먼저 노출하는 방식으로 UX를 개편했습니다. 그 결과 상품 인트로 화면의 AI 진입률은 약 5배, 심사 대기 화면은 약 2배 증가했습니다. AI 답변을 확인한 사용자는 그렇지 않은 사용자 대비 전화 상담 전환율이 약 10%p 감소했으며, 월 550건의 통화 감소로 연간 300시간의 상담 리소스를 절감했습니다.

> 💡 자연어 기반 AI 인터페이스를 서비스 퍼널에 도입할 때는 자유 입력창보다 실제 운영 데이터를 기반으로 단계별 추천 질의를 명시적으로 제공해야 사용자 진입 장벽을 낮추고 상담 오프로딩 효과를 극대화할 수 있습니다.

### [Terraform provider for Google Cloud 8.0 now generally available](https://www.hashicorp.com/blog/terraform-provider-for-google-cloud-80-now-generally-available)

_HashiCorp_

HashiCorp가 Google Cloud용 테라폼 프로바이더(Terraform provider for Google Cloud) 8.0 버전을 정식 출시(GA)했습니다. 이번 메이저 릴리스에는 plan이나 apply를 전체 실행하지 않고도 원격 인프라 리소스를 직접 조회할 수 있는 list resources 기능 등 인프라 디스커버리 워크플로가 대폭 강화되었습니다. 또한 최신 Google Cloud 권장 아키텍처에 맞추어 프로바이더의 기본 구성값을 현대화하고 API와의 일관성을 향상했습니다. 아울러 지원이 종료되었거나 대체된 구글 클라우드 서비스 및 관련 속성들을 대거 정리하여 스키마 동작의 예측 가능성을 높였습니다. HashiCorp는 제거된 필드로 인한 변경 장애를 방지하기 위해 사용자가 먼저 최신 7.x 버전으로 업그레이드하여 경고를 해결한 뒤 8.0 업그레이드 가이드를 적용할 것을 권장하고 있습니다.

> 💡 폐기된 GCP 리소스 제거와 기본값 변경이 포함된 메이저 업그레이드이므로 7.x 환경에서 사전 검증을 거친 후 인프라 디스커버리 기능을 도입하여 기존 클라우드 자원의 코드화 작업을 가속화해야 합니다.

### [Teaching a 9B model to investigate production alerts](https://www.datadoghq.com/blog/ai/investigate-production-alerts/)

_Datadog_

Datadog은 187건의 사내 프로덕션 인시던트 데이터를 활용해 오픈 가중치 모델 Qwen3.5-9B를 알림 변경 원인 추적(Change Attribution) 전문 에이전트로 파인튜닝했다. 교사 모델인 GLM-5.3은 Recall@5 0.63을 기록하며 조사당 0.06달러의 API 비용이 발생했으나, 파인튜닝된 학생 모델은 Recall@5 0.55를 달성해 교사 성능의 87%를 단 5% 비용인 조사당 약 0.003달러로 처리했다. 이는 AWS p4d.24xlarge 인스턴스의 NVIDIA A100 40GB GPU(시간당 1.74달러)에서 초당 280개 출력 토큰을 생성하는 자체 호스팅 환경을 기반으로 산출된 수치다. 또한 파인튜닝 모델은 기존 휴리스틱 기반 규칙 시스템의 Recall@5(0.46)를 앞섰으며, 조사당 0.32달러가 드는 Opus 5.0 대비 대량의 프로덕션 알림 처리에 훨씬 현실적인 비용 구조를 입증했다. 기본 모델이 광범위한 검색으로 인해 25% 비율로 컨텍스트나 턴 한도를 소진했던 것과 달리, 파인튜닝 후에는 로그·스팬·메트릭 수집 호출이 평균 4.7회에서 8.3회로 늘어나며 증거 중심 조사로 전환되었다.

> 💡 장애 원인 분석에 고비용 상용 LLM API 대신 특정 작업에 최적화된 9B급 소형 모델을 사내 GPU 인프라에 배포함으로써 대규모 운영 알림에 대한 조사 비용과 지연시간을 획기적으로 낮출 수 있습니다.

### [Find answers in your logs faster with Datadog’s Tap to Parse](https://www.datadoghq.com/blog/tap-to-parse-logs/)

_Datadog_

Datadog이 비정형 로그 메시지에서 정규식이나 Grok 패턴을 직접 작성하지 않고도 클릭 한 번으로 검색 가능한 구조화 필드를 추출하는 'Tap to Parse' 기능을 정식 출시(GA)했다. 이 기능은 샘플 로그의 고정 구조와 가변 값을 AI로 분석하여 파서 규칙을 자동 생성하며, 사용자가 적용 전 미리보기를 검토할 수 있도록 지원한다. Log Explorer에서는 결제사나 응답 시간 같은 필드를 계산된 필드로 즉시 추출해 세션 단위 인시던트 분석에 활용할 수 있다. 인제스천 단계인 Log Pipelines에서는 생성된 Grok 파서 규칙을 저장해 향후 수집되는 모든 로그에 일관되게 구조화된 속성을 부여한다. 또한 Observability Pipelines(요청 시 제공)를 통해 사내 환경을 벗어나 외부 대상으로 전달되는 커스텀 로그 스트림까지 전처리 단계에서 구조화할 수 있다.

> 💡 레거시나 서드파티 시스템의 비정형 로그 파싱 규칙 생성을 자동화하면 장애 조사 중 정규식 작성에 소요되는 시간을 줄이고 로그 수집 파이프라인의 속성 표준화를 가속할 수 있습니다.

### [Configure RUM SDKs remotely from Datadog](https://www.datadoghq.com/blog/rum-remote-configuration/)

_Datadog_

Datadog이 프론트엔드 코드 재배포나 앱스토어 심사 대기 없이 RUM SDK 설정을 원격으로 변경할 수 있는 'RUM Remote Configuration'을 출시했다. 웹 브라우저, iOS, Android SDK를 지원하며, RUM 초기화 코드에 발급받은 원격 구성 ID만 추가하면 한 줄의 코드 수정으로 활성화된다. 엔지니어는 Datadog 애플리케이션 관리 페이지에서 Session Replay 샘플링 비율, APM 트레이스 샘플링 비율, 프로파일링 수집률, 개인정보 보호 설정, 이벤트 추적 옵션을 동적으로 조정할 수 있다. 특히 모바일 환경에서는 릴리스 후 앱스토어 승인과 사용자 업데이트까지 수주 이상 걸리는 지연을 없애, 성능 저하나 장애 발생 시 즉각 프로파일링 표본을 늘려 대응할 수 있다. UI에서 변경한 구성은 저장 및 게시 절차를 거쳐 다음 SDK 초기화 시점에 안전하게 클라이언트에 동기화된다.

> 💡 모바일과 웹 클라이언트의 모니터링 샘플링 비율을 원격에서 즉시 제어할 수 있게 됨으로써 릴리스 주기와 무관하게 비용 최적화와 장애 시 심층 디버깅 사이의 균형을 유연하게 맞출 수 있습니다.

### [GitLab Critical Patch Release: 19.4.1, 19.3.3, 19.2.7](https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-4-1-released/)

_GitLab_

GitLab이 2026년 9월 23일 GitLab CE 및 EE 환경을 대상으로 긴급 보안 패치 버전인 19.4.1, 19.3.3, 19.2.7을 배포했다. 이번 릴리스에는 CI/CD 구성 파일 내 조작된 정규표현식 파싱 및 컴파일 과정에서 발생하는 원격 코드 실행(RCE) 취약점인 CVE-2026-89078(CVSS 9.9)과 CVE-2026-93577(CVSS 9.9)에 대한 수정이 포함되었다. 또한 머지 리퀘스트 diff 뷰어의 경로 검증 미흡으로 임의 자바스크립트를 실행할 수 있는 XSS 취약점 CVE-2026-84739(CVSS 8.7)도 함께 패치되었다. 이외에도 Duo AI 작업 문제 해결 기능에서 디버그 모드 CI/CD 변수가 누출되는 인가 결함(CVE-2026-92470, CVSS 7.7)과 MCP API 스코프 권한 우회 문제(CVE-2026-92874) 등이 해결되었다. GitLab.com과 GitLab Dedicated는 조치가 완료되었으며, 자체 호스팅(Self-managed) 인스턴스를 운영하는 관리자는 즉시 최신 패치로 업그레이드할 것이 권고된다.

> 💡 CI/CD 파이프라인 설정 파싱 단계를 통한 서버 원격 코드 실행 및 민감 변수 노출 위험이 있으므로 자체 호스팅 GitLab 인스턴스는 즉시 최신 보안 패치를 적용해야 합니다.

### [개인화 추천을 위한 랭킹 모델 개발기](https://tech.kakao.com/posts/837)

_카카오_

카카오가 성별·연령 기반 세그먼트 추천의 한계를 극복하기 위해 유저 개인의 실시간 및 누적 히스토리를 반영하는 딥러닝 개인화 랭킹 모델 구축 과정을 공개했다. 영상 길이에 따른 편향을 보정하기 위해 시청 시간에 RLTW(Root-Log Transformed Watch time, √(ln(1 + watch_length))) 라벨을 적용했으며, Two-Tower 임베딩 변경 시 피처 민감도가 컸던 DCNv2 대신 피처별 중요도를 게이트로 제어하는 GDCN(rank=32)과 라이트·헤비 유저 패턴을 분기하는 MoE(3개 전문가)를 결합한 아키텍처를 확정했다. 서빙 파이프라인은 리트리버, 필터, 1차 랭킹, GPU 추론 서버를 호출하는 메인 랭커, 리랭커로 구성되며, 2만 명 대상 오프라인 테스트 결과 지연시간 대비 효율이 가장 높은 300개 후보군을 최종 선별했다. 유저, 아이템, 작가, 유저×작가 상호작용의 4가지 피처를 1일·7일·30일 윈도우로 집계해 분석한 결과 유저와 크리에이터 간 상호작용 지표의 중요도가 가장 높게 나타났다. 배포 결과 전체 유효재생 비율(VTR)이 +10%p(+20% 상대 상승) 향상되었고, 콜드 유저군에서도 +7~8%p의 개선이 고르게 나타났으며 추천 콘텐츠 다양성은 +53.7% 증가했다.

> 💡 피처 선별 게이트(GDCN)와 세그먼트 분기(MoE)를 결합한 랭킹 구조는 콜드 및 라이트 유저의 희소한 데이터 환경에서도 안정적인 추론 성능을 보장하며 대규모 추천 파이프라인의 후보군 최적화에 중요한 기준을 제시합니다.

### [방해하지 않고, 눈에 띌 수 있을까](https://toss.tech/article/asset_management)

_토스_

토스뱅크 김현지 비주얼 디자이너가 홈 화면의 '자산관리 리포트' 기능 전환율(CVR)과 클릭률(CTR)을 각각 3배 개선한 설계 과정을 공유했다. 기존에는 입출금 계좌 하단 배너에 배치되어 CTR이 2%에 불과했으며, 사용자의 계좌 정보와 새로운 추천 정보가 같은 시선 층에서 경쟁하는 구조적 한계가 있었다. 이를 해결하기 위해 웹의 툴팁 메타포를 적용해 기본 화면 위에 분리된 층으로 떠 있는 플로팅 카드를 도입하고, 광고처럼 보이지 않도록 그래픽을 덜어내고 코너 스무딩과 반투명 재질감을 적용했다. 또한 스크롤 시 카드가 축소되도록 하고, 홈 진입 시 translate와 scale 시작점을 어긋나게 둔 감속 반동 모션을 적용했다. A/B 테스트 결과 단순 표현을 바꾼 인터랙티브 안은 CTR 1.1배 상승에 그쳤으나, 구조를 분리한 플로팅 카드는 CTR과 CVR 모두 3배 증가했다.

> 💡 인앱 사용자 인터페이스에서 핵심 기능과 추천 정보의 레이어를 구조적으로 분리하고 스크롤 연동 인터랙션을 적용하면, 불필요한 시각적 부하 없이 사용자 행동 전환율을 극대화할 수 있다.

### [So I asked my agent instead…](https://snyk.io/blog/so-i-asked-my-agent-instead/)

_Snyk_

Snyk이 기업 내 AI 자산과 보안 정책 위반 내역을 개발자 에이전트 하네스에서 직접 질의할 수 있는 'Evo MCP 서버'를 공개했다. 이 서버는 원격 HTTP 기반(https://evo.snyk.io/mcp)으로 작동하여 개발자 머신의 파일시스템 접근 없이 Cursor나 Claude Code에 즉시 연결된다. 에이전트는 코드 저장소뿐 아니라 개별 개발자 노트북에 설치된 모델, 에이전트, MCP 서버, 스킬을 인벤토리로 식별하고 제공자, 원산지 국가, 라이선스, 셀프 호스팅 여부별로 분류할 수 있다. 예를 들어 자격증명 부실 처리 위험 점수가 500점 이상인 스킬을 즉시 조회하여 보안 정책을 생성하고 검증할 수 있다. 나아가 조회된 정책 위반 사항을 팀 및 저장소 단위로 묶은 뒤 티켓팅 MCP 서버와 연계하여 수정 권고사항이 포함된 작업 티켓을 자동 생성할 수 있다.

> 💡 개발자 로컬 환경과 레포지토리에 분산된 AI 자산 및 취약점을 MCP를 통해 관측하고 티켓팅과 연동함으로써, 섀도우 AI 도입에 따른 자격증명 유출 위협을 자동화된 보안 거버넌스로 통제할 수 있다.

### [쉼 없이 도는 테스트, 사람이 어디까지 돌봐야 할까요? - 토스닥터(Toss Doctor)](https://toss.tech/article/toss-doctor)

_토스_

토스가 모바일 앱 E2E 테스트 자동화 도구인 '토스닥터 V2(현 토스체커의 근간)'의 아키텍처와 자가 치유 메커니즘을 공개했다. V2는 사람이 Gherkin 문법(Given-When-Then)으로 시나리오를 작성하면 /codegen 명령과 LLM, Appium MCP가 실제 디바이스 화면을 분석해 실행 코드로 자동 변환한다. 토큰 비용 절감을 위해 요소 탐색을 스크린샷 기반 목록 확인, 전체 XML 구조 분석, 엔지니어 질의의 3단계로 점진적 확장하도록 설계했다. 실행 중 예상치 못한 팝업이나 외부 툴팁이 요소를 가리면 스마트파인더가 블로커를 닫고 재시도하며 이력을 JSONL로 축적하지만, 거짓 성공을 막기 위해 검증(then) 스텝에서의 유사 매칭은 엄격히 차단했다. 테스트 실패 시 /diagnosis가 복구 가능 여부를 판정하고, 복구 가능 시 /recovery 파이프라인(E-1~E-5)이 locator 수정(예: ImageView를 TextView로 변경)부터 재실행 검증 및 lessons.md 회고 기록까지 사람의 개입 없이 완료한다.

> 💡 모바일 CI/CD 테스트 파이프라인에 Appium MCP와 단계별 LLM 진단 및 복구 루프를 결합하면, UI 변경으로 인한 테스트 취약성과 엔지니어의 수동 유지보수 비용을 획기적으로 낮출 수 있다.

### [How to design GitLab for enterprise scale](https://about.gitlab.com/blog/how-to-design-gitlab-for-enterprise-scale/)

_GitLab_

GitLab이 수천 명의 개발자와 대규모 파이프라인을 운영하는 기업을 위한 엔터프라이즈 아키텍처 설계 가이드를 발표했다. 배포 모델은 멀티테넌트 SaaS인 GitLab.com, AWS 기반 단일 테넌트 완전 관리형인 GitLab Dedicated, 자체 레퍼런스 아키텍처와 GitLab Geo로 활성-수동 복제를 구현하는 GitLab Self-Managed의 세 가지 중 운영 역량과 복구 목표(RTO/RPO)에 따라 선택해야 한다. CI/CD 러너 인프라는 개발자 인원수가 아니라 작업 볼륨, 지속 시간, 최대 동시성, 보안 권한 등 실제 워크로드를 기준으로 사이징해야 하며, 러너 범위(인스턴스·그룹·프로젝트)와 실행자(Kubernetes executor, Docker Autoscaler 등)를 분리 설계해야 한다. 가용성 측면에서는 단일 사이트 장애를 막는 고가용성(HA), 지역 장애를 복구하는 재해 복구(DR), 데이터 손상을 방어하는 백업을 상호 보완적인 별도 계층으로 다뤄야 한다. 또한 병목 진단 시 러너 용량 부족을 나타내는 대기 시간(queued duration)과 코드, 캐시, 모노레포 전송 효율을 나타내는 실행 시간(job duration)을 분리 측정해 최적화할 것을 권고했다.

> 💡 엔터프라이즈 CI/CD 환경에서는 러너 대기 시간과 실행 시간을 분리 모니터링하고 쿠버네티스 노드 오토스케일링 지연을 사전 계산해야 파이프라인 적체 현상을 방지할 수 있다.

### [How GitLab reduced code-per-agentic-flow ratio by 45%](https://about.gitlab.com/blog/how-gitlab-reduced-code-per-agentic-flow-ratio/)

_GitLab_

GitLab의 Mikolaj Wawrzyniak과 Alexander Chueshev가 'GitLab Duo Agent Platform'에서 선언형 프레임워크인 'Flow Registry'를 도입해 에이전트 플로우당 코드량을 45% 감축한 아키텍처 개편 사례를 공개했다. 초기에 LangGraph를 기반으로 구축한 4개 플로우(Software Development, Duo Agentic Chat, Convert to GitLab CI/CD, Developer Flow)는 각 플로우마다 최소 450라인 이상의 파이썬 코드가 필요했고, 노드와 엣지가 복잡하게 얽혀 재사용성과 테스트 유지보수성이 급격히 악화되었다. 이를 해결하기 위해 플랫폼 팀은 AI 엔지니어링과 플랫폼 오케스트레이션을 분리하고, YAML 설정을 실행 가능한 LangGraph 플로우로 컴파일하는 Flow Registry를 설계했다. 이 프레임워크는 AgentComponent, 인간 참여(human-in-the-loop) 체크포인트 등의 '컴포넌트', '라우터', '공유 상태 구조'라는 세 가지 핵심 기둥을 기반으로 동작한다. 그 결과 보일러플레이트 코드 제거로 코드량이 45% 감소했을 뿐 아니라, 플랫폼 하위 호환성을 보장하면서 새로운 에이전트 추가 속도와 안정성을 대폭 향상시켰다.

> 💡 복잡한 AI 에이전트 워크플로를 로우레벨 그래프 코드로 직접 구현하지 않고 컴포넌트 기반 선언형 YAML로 추상화하면, 파이프라인 유지보수 비용과 테스트 복잡도를 절반 가까이 줄일 수 있다.

### [New trends in global card fraud: How 3D Secure and regional mandates are affecting risk](https://stripe.com/blog/new-trends-in-global-card-fraud-how-3d-secure-and-regional-mandates-are-affecting-risk)

_Stripe_

Stripe가 2022년 1월부터 2026년 3월까지 수십억 건의 글로벌 결제 데이터를 분석해 3D Secure(3DS) 규제와 지역별 카드 사기 추세를 발표했다. 아시아 태평양(APAC) 지역은 말레이시아의 강력한 3DS 규제(앱 기반 인증 의무화 및 계좌 즉각 동결 등으로 사기율 74% 급감)와 일본의 2025년 4월 3DS 의무화(분쟁률 30% 이상 감소)에 힘입어 2026년 1분기 사상 최초로 EMEA보다 낮은 최저 사기율을 기록했다. 유럽은 강력한 고객 인증(SCA) 규제로 사기율이 전반적으로 21% 감소(프랑스 40%, 영국 27% 감소)했으나, 이베리아 반도(스페인·포르투갈)는 SMS OTP 의존성과 스미싱 공격으로 인해 사기율이 매년 상승했다. 라틴 아메리카는 현금 중심 경제와 입증 책임이 판매자에게 쏠린 분쟁 구조, 멕시코 국세청(SAT)의 상시 데이터 접근 요구 등 복합 요인으로 인해 2025년 사기율이 EMEA 대비 160%, APAC 대비 151% 높았다. Stripe는 이에 대응해 결제 사기 방지 엔진인 'Radar'를 계좌 이체, 스테이블코인, 전자지갑 등 전 수단으로 확대했으며, AI 기반 3DS 최적화를 통해 SCA 지역에서 사기를 7.67% 줄이면서 전환율을 1.20% 끌어올렸다.

> 💡 글로벌 결제 서비스를 확장할 때는 SMS OTP를 배제하고 생체 인식 기반 3DS와 AI 사기 탐지 엔진을 결합해야 결제 전환율 손실 없이 지역별 규제 준수와 부정 결제 차단을 달성할 수 있다.

### [Grafana Alerting: Scale alert routing without scaling complexity using multiple notification policies](https://grafana.com/blog/grafana-alerting-scale-alert-routing-without-scaling-complexity-using-multiple-notification-policies/)

_Grafana_

Grafana Labs가 Grafana 13.2 릴리스를 통해 Grafana 관리형 알림에서 '다중 알림 정책(Multiple Notification Policies)' 기능을 정식 출시(GA)했다. 기존 시스템은 프로메테우스 Alertmanager 기반의 단일 글로벌 알림 트리 구조를 사용하여, 조직이 커질수록 여러 팀의 라우팅 규칙이 하나의 거대한 트리에 얽히고 수정 시 전체 구성에 영향을 주는 한계가 있었다. 이번 업데이트를 통해 팀, 서비스, 도메인, 환경별로 분리된 독립적인 명명된 알림 정책 트리를 생성하고, 알림 규칙에서 특정 정책을 직접 지정할 수 있게 되었다. 명명된 정책은 UI, API, Terraform을 통해 독립적으로 프로비저닝 및 관리할 수 있으며, 특정 정책의 변경이 다른 정책의 알림 상태나 라우팅에 영향을 주지 않는다. 또한 정책 단위의 세분화된 역할 기반 접근 제어(RBAC)를 지원해 중앙 옵저버빌리티 팀이 기본 정책을 유지하면서도 개별 팀에 자사 정책에 대한 관리 권한만 안전하게 위임할 수 있다.

> 💡 알림 라우팅 트리를 팀 및 서비스 단위의 독립 정책으로 분리하고 Terraform 파이프라인과 개별 RBAC를 적용하면, 전사 알림 중단 위험 없이 대규모 옵저버빌리티 운영 권한을 안전하게 위임할 수 있다.

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
