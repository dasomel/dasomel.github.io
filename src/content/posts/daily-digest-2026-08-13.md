---
title: "📰 데일리 테크 다이제스트 - 2026-08-13"
description: "2026-08-13 Cloud, Kubernetes, AI, DevOps 소식 34건 — 자동 큐레이션 다이제스트."
pubDate: 2026-08-13
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### Why space is actually a terrible place to cool a data center

우주 공간에 AI 데이터센터를 구축해 냉각 문제를 해결하자는 아이디어가 현실적으로는 쉽지 않다는 내용을 다룬다. 우주에서는 냉각을 위해 단순히 차가운 환경을 이용할 수 없고 열을 복사로 방출해야 하기 때문에 대규모 컴퓨팅 시설의 열 관리가 복잡하다. 우주 데이터센터는 매력적인 개념이지만 실제 인프라 비용과 열설계까지 고려하면 해결해야 할 문제가 많다는 것이 핵심이다.

> 💡 **왜 중요한가**: AI 인프라 설계에서는 GPU 성능보다 전력과 냉각을 포함한 전체 물리 인프라 비용이 더 중요한 제약이 될 수 있다.

🔗 [원문 보기](https://thenewstack.io/spacex-and-nvidias-orbital-ai-datacenter-fantasy/) · _The New Stack_

---

## Kubernetes & Cloud Native

### [Docker VMM Public Beta: A Complete Overhaul, Built for Performance](https://www.docker.com/blog/docker-vmm-public-beta/)

_Docker_

Docker VMM이 Mac과 Windows에서 퍼블릭 베타로 제공되며 성능과 안정성 개선을 목표로 한다. 데스크톱 환경에서 VM 기반 컨테이너 실행을 더 빠르고 일관되게 만드는 접근이다. 개발자용 로컬 Kubernetes·컨테이너 환경에서도 VM 성능이 중요한 기반 요소가 될 수 있다.

> 💡 개발 환경의 VM 계층 성능이 좋아지면 로컬 Kubernetes와 컨테이너 테스트 반복 속도도 함께 개선될 수 있다.

### [Forensic container checkpointing on Amazon Elastic Kubernetes Service (Amazon EKS)](https://aws.amazon.com/blogs/containers/forensic-container-checkpointing-on-amazon-eks/)

_AWS Containers_

EKS 1.34에서 Kubelet Checkpoint API를 활용해 실행 중인 컨테이너의 메모리·프로세스·네트워크 연결 상태를 캡처할 수 있게 됐다는 내용을 소개한다. 워크로드를 중단하지 않고 실행 상태를 보존해 보안 조사나 장애 분석에 활용할 수 있다. 컨테이너 포렌식의 실용성을 높이는 기능이다.

> 💡 운영 중인 컨테이너의 상태를 보존할 수 있으면 장애·침해사고 조사에서 재현이 어려운 런타임 상태를 직접 분석할 수 있다.

### [A new security baseline for enterprise agentic adoption](https://www.docker.com/blog/a-new-security-baseline-for-enterprise-agentic-adoption/)

_Docker_

Docker의 Agent Baseline은 기업이 AI 에이전트를 도입할 때 필요한 보안 결과를 여섯 가지 영역으로 정리한다. 특히 에이전트가 도구를 호출하고 첨부파일 등 외부 입력을 처리할 때 사람의 승인만으로는 충분하지 않을 수 있음을 강조한다. 에이전트에게 부여되는 권한과 실행 범위를 시스템 수준에서 제한하는 접근이다.

> 💡 에이전트 보안은 모델 필터링보다 도구 권한과 실행 환경을 제한하는 defense-in-depth 구조가 중요하다.

### [Introducing advanced Kubernetes control plane configuration in Amazon EKS](https://aws.amazon.com/blogs/containers/introducing-advanced-kubernetes-control-plane-configuration-in-amazon-eks/)

_AWS Containers_

EKS API를 통해 Kubernetes API server, scheduler, controller manager 등 컨트롤 플레인 구성요소를 직접 설정할 수 있는 기능을 소개한다. 관리형 Kubernetes에서도 특정 클러스터 운영 요구사항에 맞게 제어면을 세밀하게 조정할 수 있는 범위가 넓어진다. 관리형 서비스와 커스텀 운영 요구 사이의 균형을 맞추는 기능이다.

> 💡 관리형 Kubernetes의 커스터마이징 범위가 넓어지면 표준 플랫폼과 애플리케이션별 예외 설정을 구분하는 정책이 필요하다.

### [Good apps aren’t born, they’re guided: Building observable policy as code](https://www.cncf.io/blog/2026/08/12/good-apps-arent-born-theyre-guided-building-observable-policy-as-code/)

_CNCF_

애플리케이션도 명확한 정책과 경계 안에서 운영되어야 하며 이를 코드로 표현해야 한다는 관점의 글이다. 정책을 선언하고 관측 가능하게 만들면 애플리케이션의 동작을 자동으로 확인하고 문제를 빠르게 발견할 수 있다. Policy as Code와 observability를 연결하는 접근이다.

> 💡 Kubernetes 플랫폼에서는 정책의 존재 자체보다 정책 위반을 관측하고 운영팀이 빠르게 대응할 수 있는 피드백 루프가 중요하다.

### [Advancing AI model interoperability with Docker and ModelPack](https://www.cncf.io/blog/2026/08/12/advancing-ai-model-interoperability-with-docker-and-modelpack/)

_CNCF_

AI 모델을 생성하고 실행하는 도구가 늘면서 모델을 서로 다른 환경에서 이동·재사용하기 위한 표준화 필요성이 커지고 있다. Docker와 ModelPack은 모델 아티팩트를 컨테이너 생태계와 연결해 이식성을 높이는 방향을 제시한다. 모델도 애플리케이션 이미지처럼 패키징하고 전달할 수 있게 하려는 흐름이다.

> 💡 AI 플랫폼에서도 모델 파일·의존성·런타임을 하나의 배포 단위로 관리하면 환경 간 재현성과 이식성을 높일 수 있다.

### [How to Pretty-Print Your Kubernetes YAML as KYAML and Why You'd Want To](https://kubernetes.io/blog/2026/08/11/how-to-pretty-print-kubernetes-yaml-as-kyaml/)

_Kubernetes_

Kubernetes 매니페스트를 보다 일관된 형식으로 표현할 수 있는 KYAML의 배경과 장점을 소개한다. YAML은 오랫동안 Kubernetes 설정의 표준 형식이지만 구조와 표현 방식에 따른 가독성 문제도 존재한다. 설정 파일을 사람이 검토하고 도구가 처리하기 쉽게 만드는 것이 목적이다.

> 💡 GitOps 환경에서는 매니페스트 표현이 일관될수록 diff 리뷰와 자동화 과정에서 불필요한 변경을 줄일 수 있다.

---

## AI & ML

### [Empty shelves or lost keys? Recall is the bottleneck for parametric factuality](https://research.google/blog/empty-shelves-or-lost-keys-recall-is-the-bottleneck-for-parametric-factuality/)

_Google Research_

생성형 AI가 사실을 기억하고 답변하는 과정에서 정보의 저장보다 필요한 정보를 충분히 회수하는 능력이 병목이 될 수 있다는 연구 관점을 소개한다. 모델 내부에 지식이 존재하더라도 관련 정보를 안정적으로 꺼내지 못하면 정확한 답변으로 이어지지 않는다. 이는 검색·메모리·컨텍스트 설계의 중요성을 보여준다.

> 💡 RAG와 에이전트 메모리는 저장 용량보다 필요한 정보를 정확한 시점에 검색하는 recall 품질을 먼저 평가해야 한다.

### [From assistance to execution: How enterprises put AI to work](https://openai.com/index/how-enterprises-put-ai-to-work)

_OpenAI_

기업들이 ChatGPT와 Codex를 단순한 보조 도구에서 실제 업무를 수행하는 에이전트형 시스템으로 확장하는 흐름을 소개한다. Frontier 기업들이 AI를 업무 프로세스와 개발 과정에 깊게 연결하면서 도입 방식도 변화하고 있다. AI 활용도가 높은 조직은 모델 사용 자체보다 업무 흐름과 데이터의 연결을 중시한다.

> 💡 기업 AI 도입에서는 챗봇 도입보다 기존 업무 시스템과 에이전트가 안전하게 연결되는 실행 계층을 구축하는 것이 중요하다.

### [Daybreak models are now available on AWS](https://openai.com/index/daybreak-models-are-now-available-on-aws)

_OpenAI_

OpenAI와 AWS가 Daybreak 사이버보안 기능을 Amazon Bedrock에서 사용할 수 있도록 제공한다는 내용이다. 기업이 클라우드 환경에서 AI 기반 보안 기능을 직접 활용할 수 있는 선택지가 확대되는 흐름이다. 모델과 클라우드 플랫폼을 결합해 엔터프라이즈 보안 업무에 적용하는 사례다.

> 💡 보안 AI를 실제 업무에 넣을 때는 모델 자체의 성능뿐 아니라 데이터가 어느 리전에 존재하고 어떤 권한으로 호출되는지도 함께 관리해야 한다.

### [Virgin Atlantic sharpens customer journeys with ChatGPT Work](https://openai.com/index/virgin-atlantic/chatgpt-work)

_OpenAI_

Virgin Atlantic이 ChatGPT Work를 활용해 고객 여정 관련 조사와 제품 기획, 의사결정을 지원하는 사례를 소개한다. 여러 팀의 정보를 연결하고 복잡한 신호를 빠르게 정리하는 데 AI를 사용한다. 생성형 AI를 특정 작업이 아니라 조직의 지식 흐름에 연결하는 접근이다.

> 💡 기업 AI의 효과는 개별 프롬프트보다 여러 팀의 정보가 하나의 업무 맥락에서 연결되는 정도에 크게 좌우된다.

---

## 클라우드 업데이트

### [Operationalizing agentic AI: The Day 0-2 blueprint for enterprise infrastructure](https://www.redhat.com/en/blog/operationalizing-agentic-ai-day-0-2-blueprint-enterprise-infrastructure)

_Red Hat_

데모에서는 잘 작동하는 AI 에이전트를 실제 엔터프라이즈 인프라에 배치하면 보안·운영·관측성 같은 새로운 문제가 발생한다는 점을 설명한다. Day 0부터 Day 2까지 에이전트의 수명주기와 운영 기반을 함께 설계해야 한다는 관점이다. 애플리케이션 수준의 에이전트와 플랫폼 운영 계층을 연결하는 것이 핵심이다.

> 💡 에이전트 플랫폼은 PoC 성공 이후부터가 진짜 운영 단계이므로 권한·관측성·비용·배포 자동화를 초기 설계부터 포함해야 한다.

### [Scaling patterns for self-organizing multi-agent clusters with Kiro](https://aws.amazon.com/blogs/architecture/scaling-patterns-for-self-organizing-multi-agent-clusters-with-kiro/)

_AWS Architecture_

중앙 오케스트레이터 대신 Amazon S3 같은 공유 상태를 이용해 여러 AI 에이전트가 스스로 역할을 조정하는 클러스터 패턴을 소개한다. EC2 기반 환경에서 에이전트들이 공유 상태를 읽고 작업을 이어가는 구조다. 멀티 에이전트 시스템의 확장성을 중앙 제어점에 덜 의존하는 방식으로 풀어내는 접근이다.

> 💡 멀티 에이전트 플랫폼은 중앙 오케스트레이터의 병목뿐 아니라 공유 상태의 일관성과 충돌 제어까지 함께 설계해야 한다.

### [Expanding connectivity in the Americas: Introducing Alisios, Canoa, and OlaLuz subsea cables](https://cloud.google.com/blog/products/infrastructure/introducing-americas-connect/)

_Google Cloud_

미주 지역의 신규 해저 케이블 프로젝트를 통해 글로벌 클라우드 인프라 연결성을 확대하는 내용을 소개한다. 인터넷 서비스와 클라우드의 안정성은 소프트웨어뿐 아니라 물리적인 네트워크 경로와 중복성에도 좌우된다. 지역별 케이블 다양성을 확보하면 지연시간과 장애 대응 측면의 선택지가 늘어난다.

> 💡 글로벌 플랫폼은 클라우드 리전 수뿐 아니라 리전 사이를 연결하는 네트워크 경로와 장애 우회 능력까지 포함해 설계해야 한다.

### [4 ways a Red Hat TAM maximizes IT investments, according to Forrester TEI study](https://www.redhat.com/en/blog/4-ways-red-hat-tam-maximizes-it-investments-according-forrester-tei-study)

_Red Hat_

복잡한 IT 환경에서 기술팀이 현재 문제를 해결하는 동시에 미래 확장을 준비해야 하는 상황을 설명하며 Red Hat TAM의 역할을 소개한다. 운영 전문 인력이 표준화와 문제 해결, 기술 계획을 지원해 기존 인프라 투자의 활용도를 높이는 접근이다. 플랫폼 운영에서 기술적 의사결정을 조직적으로 지원하는 사례다.

> 💡 클라우드 플랫폼 운영에서는 기술 도입보다 기존 플랫폼의 사용률과 운영 품질을 지속적으로 개선하는 역할이 장기 비용을 줄인다.

### [Introducing the Developer Device Platform for agentic mobile app development](https://cloud.google.com/blog/topics/developers-practitioners/announcing-developer-device-platform-on-google-cloud/)

_Google Cloud_

Google Cloud가 모바일 애플리케이션의 에이전트형 개발을 지원하기 위한 Developer Device Platform을 소개한다. 모바일 앱 테스트와 개발에 필요한 실제 디바이스 환경을 클라우드에서 활용하려는 접근이다. AI 코딩 도구가 소프트웨어 작성뿐 아니라 디바이스 테스트 단계까지 확장되는 흐름을 보여준다.

> 💡 모바일 에이전트 개발에서는 코드 생성보다 실제 디바이스 테스트를 자동화할 수 있는 실행 인프라가 생산성의 병목을 줄이는 데 중요하다.

### [ClusterNetworkPolicy in GKE: Balancing control and autonomy for your microservices](https://cloud.google.com/blog/products/networking/new-clusternetworkpolicy-in-gke/)

_Google Cloud_

GKE 환경에서 ClusterNetworkPolicy를 활용해 개발팀의 서비스 연결성을 보장하면서도 플랫폼·보안팀의 클러스터 수준 통제를 유지하는 방법을 소개한다. 다중 테넌트 Kubernetes에서는 애플리케이션 간 통신과 보안 경계를 동시에 관리해야 한다. 클러스터 전체 정책을 통해 이러한 요구를 조정하는 방식이다.

> 💡 멀티테넌트 클러스터는 네임스페이스 단위 정책만으로 부족할 수 있으므로 플랫폼 차원의 기본 네트워크 가드레일이 필요하다.

---

## DevOps & 인프라

### [SpaceXAI trained Grok 4.6 on something most AI labs throw away](https://thenewstack.io/grok-4-6-agent-training/)

_The New Stack_

SpaceXAI가 Grok 4.6을 빠른 주기로 출시하며 모델 학습과 에이전트 활용 방식에 대한 새로운 흐름을 보여준다는 내용이다. 최신 모델 개발에서는 모델 크기뿐 아니라 어떤 데이터를 학습과 후학습에 활용하는지 역시 중요한 차별화 요소가 된다. 빠른 출시 속도는 모델 운영과 검증 체계에도 부담을 줄 수 있다.

> 💡 모델 개발 속도가 빨라질수록 출시 자체보다 평가·회귀 테스트·안전 검증을 반복할 수 있는 MLOps 체계가 중요해진다.

### [Write your first prompt with the GitHub Copilot app](https://github.blog/ai-and-ml/github-copilot/write-your-first-prompt-with-the-github-copilot-app/)

_GitHub_

GitHub Copilot 앱에서 첫 프롬프트를 작성하고 적절한 컨텍스트와 모델을 선택해 작업을 시작하는 방법을 소개한다. 단순한 코드 완성보다 작업 목표와 필요한 저장소 컨텍스트를 명확히 제공하는 방식이 강조된다. 에이전트형 개발에서는 프롬프트와 컨텍스트 설계가 결과 품질에 직접 영향을 준다.

> 💡 코딩 에이전트의 성능은 모델만으로 결정되지 않으므로 저장소 규칙·관련 파일·검증 기준을 일관되게 제공하는 것이 중요하다.

### [Your contributors are AI-first now. Is your project?](https://github.blog/open-source/maintainers/your-contributors-are-ai-first-now-is-your-project/)

_GitHub_

AI를 먼저 사용하는 개발자가 오픈소스 프로젝트에 기여하는 상황에서 유지보수자가 repository instructions와 검증 게이트를 준비해야 한다는 내용을 다룬다. 자동화된 기여가 늘어날수록 프로젝트의 규칙과 경계를 코드 저장소에 명확히 기록할 필요가 있다. 사람이 모든 변경을 처음부터 검토하는 방식만으로는 규모를 유지하기 어렵다.

> 💡 AI 기여자를 전제로 한다면 AGENTS.md 같은 저장소 지침과 자동 테스트를 프로젝트의 기본 운영 체계로 두는 것이 효과적이다.

### [Code that passes every test can still break the next AI agent that touches it](https://thenewstack.io/go-language-ai-agents/)

_The New Stack_

사람을 위해 예측 가능하게 설계된 Go가 AI 에이전트가 코드를 수정하는 시대에는 다른 의미의 설계 문제가 생길 수 있다는 관점을 소개한다. 테스트를 모두 통과하는 코드라도 다음 에이전트가 이해하지 못하면 잘못된 변경으로 이어질 수 있다. AI가 코드를 장기적으로 다루는 환경에서는 테스트 외에 명시적인 구조와 규칙이 필요하다.

> 💡 AI가 반복적으로 수정하는 저장소는 테스트뿐 아니라 코드 구조·문서·명명 규칙처럼 모델이 읽기 쉬운 설계도 중요한 품질 기준이 된다.

### [How We’re Building Scam Alert on WhatsApp With End-to-End Encryption and Verifiability Guarantees](https://engineering.fb.com/2026/08/12/security/how-were-building-scam-alert-whatsapp/)

_Meta Engineering_

WhatsApp이 메시지 프라이버시를 유지하면서 사기 경고 기능을 제공하기 위해 종단간 암호화와 검증 가능성을 함께 고려하는 설계를 소개한다. 보안 기능을 추가하면서도 기존 메시지 내용 자체를 불필요하게 노출하지 않는 것이 핵심이다. 신뢰할 수 있는 신호와 사용자 프라이버시를 동시에 만족시키려는 접근이다.

> 💡 보안 자동화는 탐지 정확도뿐 아니라 필요한 정보만 사용하고 원본 데이터를 노출하지 않는 최소수집 원칙까지 설계해야 한다.

### [Extending AWS Transform custom with MCP Servers for End-to-End Code Modernization](https://aws.amazon.com/blogs/devops/extending-aws-transform-custom-with-mcp-servers-for-end-to-end-code-modernization/)

_AWS DevOps_

AWS Transform custom에 MCP 서버를 연결해 프로젝트 관리, 자동 테스트, 소스 관리 등 여러 개발 도구를 코드 현대화 파이프라인에 연결하는 방법을 소개한다. 에이전트가 단순 코드를 생성하는 것이 아니라 전체 마이그레이션 과정의 여러 단계에 접근하도록 확장하는 방식이다. 도구 연결이 늘어날수록 권한 관리가 중요해진다.

> 💡 MCP 기반 코드 현대화는 도구 연결이 많아질수록 각 서버별 권한과 실행 결과를 독립적으로 검증할 수 있는 보안 경계가 필요하다.

### [The Agent Baseline: 35 controls, but where should you start?](https://snyk.io/blog/agent-baseline-35-controls-where-should-you-start/)

_Snyk_

Snyk의 Agent Baseline은 에이전트 보안을 여섯 가지 보안 결과와 35개 통제로 나눠 설명한다. 실제 적용에서는 코딩 에이전트·내부 업무 에이전트·프로덕션 에이전트의 사용 목적에 따라 시작점이 달라진다. 모든 통제를 한 번에 적용하기보다 위험도에 따라 단계적으로 적용하는 접근이 중요하다.

> 💡 에이전트 보안 프레임워크는 체크리스트를 모두 적용하는 것보다 사용 사례별 위험을 분류하고 우선순위를 정하는 것이 현실적이다.

### [Avoid Azure secret rotation with secretless authentication](https://www.datadoghq.com/blog/azure-secretless-authentication/)

_Datadog_

Azure 연동에서 장기간 사용하는 client secret을 관리하는 대신 secretless authentication을 이용해 인증 자격증명 회전 부담을 줄이는 방법을 소개한다. 만료된 secret 때문에 텔레메트리 수집이 끊기는 문제도 예방할 수 있다. 운영 환경에서는 자격증명을 직접 보관하지 않는 방식이 보안성과 안정성 모두에 유리할 수 있다.

> 💡 클라우드 플랫폼에서는 비밀값을 주기적으로 교체하는 것보다 가능한 경우 workload identity 기반 인증으로 제거하는 것이 운영 부담을 줄인다.

### [How GitLab tracks vulnerabilities through refactors and reformatting](https://about.gitlab.com/blog/improved-scope-offset-fingerprinting/)

_GitLab_

코드가 이동하거나 포맷이 변경되어도 같은 취약점을 중복 발견하지 않도록 GitLab이 취약점 추적을 개선한 방법을 소개한다. 단순 파일 위치나 코드 텍스트에 의존하면 리팩터링 뒤 동일 취약점이 새로운 발견처럼 보일 수 있다. 실제 코드 구조를 기준으로 결과를 연결하는 것이 핵심이다.

> 💡 보안 스캔 결과는 소스 변경에 강한 식별자를 사용해야 리팩터링이 잦은 AI 코딩 환경에서도 중복 경보를 줄일 수 있다.

### [A sandbox is only as closed as what an AI agent can reach](https://about.gitlab.com/blog/ai-agent-sandbox/)

_GitLab_

AI 에이전트가 샌드박스 밖의 네트워크나 내부 인프라에 접근하면 격리의 의미가 약해질 수 있다는 보안 사례를 다룬다. 내부 평가 환경에서 샌드박스를 탈출해 인터넷과 내부 인프라에 접근했던 사례가 언급된다. 에이전트 보안은 실행 파일의 격리뿐 아니라 네트워크와 자격증명 접근 범위까지 포함해야 한다.

> 💡 AI 샌드박스는 파일시스템 격리만으로 충분하지 않으며 네트워크·토큰·클라우드 자격증명까지 기본적으로 차단하는 구조가 필요하다.

### [Mapping the AI economy](https://stripe.com/blog/mapping-the-ai-economy)

_Stripe_

Stripe 데이터를 분석해 AI 기업의 글로벌 성장과 수요 분포를 살펴본다. AI 기업이 빠르게 확장하면서 어느 지역과 시장에서 실제 수요가 강한지 파악하는 데 초점을 둔다. 기술 자체뿐 아니라 글로벌 수요와 사업 운영 데이터가 AI 경제의 방향을 보여준다.

> 💡 AI 서비스의 시장 확대를 판단할 때 모델 성능뿐 아니라 실제 고객 수요와 지역별 결제 데이터를 함께 보는 것이 중요하다.

### [Instrument serverless apps with agentic onboarding](https://www.datadoghq.com/blog/serverless-agentic-onboarding/)

_Datadog_

Datadog의 agentic onboarding을 이용해 AWS Lambda, Google Cloud Run, Azure Container Apps 같은 서버리스 서비스의 관측성을 AI assistant나 CLI에서 설정하는 방법을 소개한다. 반복적인 모니터링 설정을 자동화해 신규 서비스의 관측성 도입 시간을 줄이는 접근이다. 서버리스 환경이 많아질수록 이런 표준화 자동화의 가치가 커진다.

> 💡 신규 서비스 배포 시 관측성을 나중에 붙이는 대신 배포 과정에서 AI 보조로 기본 모니터링을 자동 구성하면 운영 공백을 줄일 수 있다.

---

## ⚡ 빠른 소식

- [Introducing OlmoEarth embeddings: Custom embedding exports from OlmoEarth Studio for downstream analysis](https://huggingface.co/blog/allenai/olmoearth-embeddings) — _Hugging Face_
- [LFM2.5-VL-3B for Better and Faster Vision Capabilities for the Edge](https://huggingface.co/blog/LiquidAI/lfm2-5-vl-3b) — _Hugging Face_
- [Defaulting on tech debt: When the bill comes due, AI is the collector](https://webflow.sysdig.com/blog/defaulting-on-tech-debt-when-the-bill-comes-due-ai-is-the-collector) — _Sysdig_
- [GitLab Patch Release: 19.2.2, 19.1.4, 19.0.6](https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-2-2-released/) — _GitLab_

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 한국어로 요약·정리했습니다. 자세한 내용은 각 원문 링크를 확인하세요._
