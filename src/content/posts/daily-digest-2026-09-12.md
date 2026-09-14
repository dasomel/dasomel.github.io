---
title: "📰 데일리 테크 다이제스트 - 2026-09-12"
description: "2026-09-12 Cloud, Kubernetes, AI, DevOps 소식 49건 — 자동 큐레이션 다이제스트."
pubDate: 2026-09-12
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### OpenAI’s researchers burned $7,000 a day on AI agents — now it’s opening the floodgates

OpenAI가 Codex의 백엔드 기술을 기반으로 한 Agents API를 public beta로 공개하면서 개발자가 장시간 실행되는 AI 에이전트를 더 직접적으로 운영할 수 있게 됐다. 연구 단계에서는 에이전트 연산 비용이 하루 수천 달러 수준까지 올라갈 수 있었던 만큼, 실제 도입에서는 자율성뿐 아니라 실행 시간·토큰·도구 호출 비용을 함께 관찰하고 제어해야 한다.

🔗 [원문 보기](https://thenewstack.io/openai-agents-api-compute/) · _The New Stack_

---

## Kubernetes & Cloud Native

### [Building a reliable cloud native foundation for distributed AI training](https://www.cncf.io/blog/2026/09/11/building-a-reliable-cloud-native-foundation-for-distributed-ai-training/)

_CNCF_

분산 AI 학습에서는 GPU를 준비하고 Kubernetes 클러스터를 띄우는 것만으로 충분하지 않다. 네트워크, 스토리지, 스케줄링, 장애 복구와 운영 자동화를 포함한 신뢰할 수 있는 Cloud Native 기반이 함께 갖춰져야 AI-ready 플랫폼이 된다.

### [Machine speed, hold the AI: Hand-rolled marimo CVE-2026-39987 exploit](https://webflow.sysdig.com/blog/machine-speed-hold-the-ai-hand-rolled-marimo-cve-2026-39987-exploit)

_Sysdig_

Sysdig TRT가 AI 도구 없이 직접 Python 도구를 만들어 marimo의 CVE-2026-39987 취약점을 악용하고 클라우드 bastion host를 침해하는 과정을 분석했다. 자동화된 공격 도구뿐 아니라 전통적인 수작업 공격 경로도 여전히 빠르게 실행될 수 있음을 보여준다.

### [Kubernetes v1.37: Scheduler Preemption for In-Place Pod Resize (Alpha)](https://kubernetes.io/blog/2026/09/10/kubernetes-v1-37-scheduler-preemption-for-in-place-pod-resize-alpha/)

_Kubernetes_

Kubernetes v1.37은 In-Place Pod Resize와 연계된 스케줄러 선점 기능을 Alpha로 소개했다. 실행 중 Pod의 리소스 요구량이 바뀔 때도 클러스터가 새로운 자원 요구를 더 유연하게 반영할 수 있도록 스케줄링 경로를 확장한다.

### [Kubernetes disaster recovery: Guidance from three reproducible failure scenarios](https://www.cncf.io/blog/2026/09/10/kubernetes-disaster-recovery-guidance-from-three-reproducible-failure-scenarios/)

_CNCF_

백업을 보유하는 것과 실제로 복구 가능한 것은 다르다는 점을 세 가지 재현 가능한 장애 시나리오로 설명한다. Kubernetes DR에서는 백업 성공 여부뿐 아니라 복구 절차를 반복 검증하고 복구 시간과 의존성을 증명하는 것이 핵심이다.

### [Kubernetes v1.37: Introducing Node Lifecycle Conditions](https://kubernetes.io/blog/2026/09/09/kubernetes-v1-37-node-lifecycle-conditions/)

_Kubernetes_

Kubernetes는 Node 상태를 Readiness, taint, Pod 상태, label, annotation 등 여러 신호로 표현해 왔다. v1.37의 Node Lifecycle Conditions는 노드의 생명주기와 상태를 더 명확하게 표현해 운영자가 장애와 전환 상태를 일관되게 판단하도록 돕는 방향이다.

### [Whose GPUs are these, anyway? Secure, self-service metrics for multi-tenant Kubernetes](https://www.cncf.io/blog/2026/09/09/whose-gpus-are-these-anyway-secure-self-service-metrics-for-multi-tenant-kubernetes/)

_CNCF_

멀티테넌트 Kubernetes에서 GPU 비용과 사용량을 팀별로 안전하게 제공하는 self-service 메트릭 구조를 다룬다. GPU처럼 비용이 큰 자원은 단순 총사용량보다 테넌트 격리, 권한, 귀속 가능한 지표를 함께 설계해야 실제 비용 최적화로 이어진다.

### [6 Benefits of Sandbox Environments (and How Docker Sandboxes Delivers Them)](https://www.docker.com/blog/benefits-of-sandbox-environments/)

_Docker_

Docker가 sandbox 환경의 주요 장점으로 격리, 정책 제어, 비밀정보 처리, 재현 가능한 실행 환경 등을 설명한다. 특히 AI 에이전트처럼 임의 코드를 실행할 수 있는 워크로드에서는 실행 경계를 명확히 제한하는 것이 중요하다.

---

## AI & ML

### [Rapidly scaling online storage to serve over 1 billion ChatGPT users](https://openai.com/index/scaling-storage-one-billion-users-part-one)

_OpenAI_

OpenAI가 Habitat를 Python 라이브러리에서 전 세계에 분산된 온라인 스토리지 플랫폼으로 확장해 10억 명 이상의 ChatGPT 사용자와 초당 2,200만 요청을 지원하는 과정을 소개한다. 대규모 AI 서비스에서 데이터 저장 계층의 확장성과 운영 안정성이 모델 성능만큼 중요하다는 사례다.

### [ToolGrad: Efficient tool-use dataset generation with textual "gradients"](https://research.google/blog/toolgrad-efficient-tool-use-dataset-generation-with-textual-gradients/)

_Google Research_

Google Research의 ToolGrad는 도구 사용 학습 데이터를 효율적으로 생성하기 위해 텍스트 형태의 피드백, 즉 textual gradient를 활용하는 접근을 다룬다. 에이전트가 도구 호출을 더 정확하게 학습하도록 데이터 생성 과정 자체를 개선하는 연구다.

### [How a researcher uses Codex and ChatGPT to search for new antimicrobial molecules](https://openai.com/index/using-codex-chatgpt-to-search-for-new-antimicrobials)

_OpenAI_

César de la Fuente 연구팀이 Codex와 ChatGPT를 이용해 현재와 과거 생물의 유전체에서 항균 후보 물질을 탐색하는 사례를 소개한다. AI가 소프트웨어 작성뿐 아니라 대규모 생물학 데이터 탐색과 연구 워크플로 자동화에도 활용되는 흐름이다.

### [3 ways to prep for your next big race with Search](https://blog.google/products-and-platforms/products/search/running-race-training-tips/)

_Google AI_

Google Search가 대회 등록 알림, 개인화된 훈련 계획, 경기 준비 정보 등을 활용해 러너의 레이스 준비를 지원하는 기능을 소개한다. 검색이 단순 정보 조회에서 개인화된 계획 지원으로 확장되는 사례다.

### [Now everyone can put data to work](https://openai.com/index/put-data-to-work)

_OpenAI_

ChatGPT Work의 Data agent를 통해 조직 데이터를 연결하고 자연어로 분석해 인사이트와 대시보드를 만드는 흐름을 소개한다. 데이터 분석 기능이 전문 분석가의 도구에만 머무르지 않고 일반 업무 인터페이스로 이동하는 방향이다.

### [Get ready for the game with new football features in Search](https://blog.google/products-and-platforms/products/search/football-features-google-search/)

_Google AI_

Google Search에 실시간 경기 피드, 상세 통계, 개인화된 판타지 추천 등 미식축구 관련 기능이 추가됐다. 검색 결과가 정적인 정보 제공을 넘어 실시간 상황과 개인화된 의사결정을 지원하는 형태로 확장되고 있다.

### [Recreating a 70-year love story frame by frame](https://blog.google/innovation-and-ai/technology/ai/love-rendered-film/)

_Google AI_

Google DeepMind와 영화 제작자들이 AI를 활용해 한 부부의 기록되지 않은 70년 전 기억을 영상으로 재구성한 단편 영화 사례를 소개한다. 생성형 AI가 개인의 기억과 창작을 재현하는 과정에서 사실성, 표현, 윤리적 경계가 함께 중요해진다.

---

## 클라우드 업데이트

### [From zero-shot forecast to purchase order with Amazon Bedrock AgentCore](https://aws.amazon.com/blogs/architecture/from-zero-shot-forecast-to-purchase-order-with-amazon-bedrock-agentcore/)

_AWS Architecture_

Amazon Chronos2의 zero-shot 예측과 Bedrock AgentCore의 멀티 에이전트 오케스트레이션을 결합해 수요 예측 결과를 검증된 구매 주문으로 연결하는 아키텍처를 소개한다. 제품별 모델 재학습 없이 비즈니스 규칙, 감사 가능성, 비용 효율을 함께 고려한다.

### [Introducing automatic remediation policies with Cloudflare CASB](https://blog.cloudflare.com/casb-policies/)

_Cloudflare_

Cloudflare CASB가 SaaS 위험을 자동으로 조치할 수 있는 정책 엔진을 추가했다. 보안팀이 위험한 파일 공유 취소나 webhook 호출 같은 대응 로직을 이벤트 기반으로 자동화할 수 있다.

### [3 Highlights from Thomas Kurian’s Keynote at the Goldman Sachs Communicopia & Technology Conference](https://cloud.google.com/blog/topics/inside-google-cloud/highlights-from-the-goldman-sachs-communicopia-and-technology-conference/)

_Google Cloud_

Google Cloud CEO Thomas Kurian이 Goldman Sachs 기술 컨퍼런스에서 Google Cloud의 사업 현황과 전략을 설명한 주요 내용을 정리했다. AI와 클라우드 플랫폼이 기업 업무와 데이터 활용에 어떻게 결합되는지가 핵심 주제다.

### [Friday Five — September 11, 2026](https://www.redhat.com/en/blog/friday-five-september-11-2026-red-hat)

_Red Hat_

Red Hat의 주간 주요 소식을 정리한 글로, 2026 Gartner 컨테이너 관리 Magic Quadrant에서 Red Hat이 Leader로 평가된 내용 등을 다룬다. OpenShift를 포함한 컨테이너 플랫폼 경쟁력과 관련된 업데이트를 한 번에 볼 수 있다.

### [Closing the AIOps loop with Splunk Observability Cloud and Red Hat Ansible Automation Platform](https://www.redhat.com/en/blog/closing-aiops-loop-splunk-observability-cloud-and-red-hat-ansible-automation-platform)

_Red Hat_

Splunk Observability Cloud의 탐지 결과를 Red Hat Ansible Automation Platform의 자동 조치로 연결해 AIOps의 탐지-대응 루프를 닫는 방식을 설명한다. 장애를 발견하는 것에서 끝나지 않고 검증된 remediation을 자동 실행하는 것이 핵심이다.

### [blog | 5 reasons why your Lightwell strategy needs more than just patches](https://www.redhat.com/en/blog/5-reasons-why-your-lightwell-strategy-needs-more-just-patches)

_Red Hat_

Lightwell 관련 취약점 대응에서 패치 제공만으로는 충분하지 않으며, 실제 운영 환경에 안전하게 적용할 역량과 검증된 절차가 필요하다고 설명한다. 보안 대응은 패치 획득보다 배포·검증 능력까지 포함해야 한다는 관점이다.

### [Microsoft named a Leader in the 2026 Gartner® Magic Quadrant™ for Container Management](https://azure.microsoft.com/en-us/blog/microsoft-named-a-leader-in-the-2026-gartner-magic-quadrant-for-container-management/)

_Azure_

Microsoft가 2026 Gartner 컨테이너 관리 Magic Quadrant에서 Leader로 선정됐다고 발표했다. AKS, Azure Arc, Azure Container Apps를 중심으로 AI와 하이브리드 워크로드를 대규모로 운영하는 플랫폼 전략을 강조한다.

### [Introducing the Google Cloud Developer Plugin for AI Coding Agents](https://cloud.google.com/blog/topics/developers-practitioners/introducing-the-google-cloud-developer-plugin-for-ai-coding-agents/)

_Google Cloud_

Google Cloud가 AI 코딩 에이전트용 Developer Plugin을 소개했다. 문서와 원격 MCP 서버를 보완하는 agent skill 형태로 특정 작업의 컨텍스트 사용량을 줄이고 Google Cloud 작업을 더 쉽게 자동화할 수 있도록 한다.

### [The Economics of Agent Optimization: How AI agent governance controls cost and proves ROI](https://azure.microsoft.com/en-us/blog/the-economics-of-agent-optimization-how-ai-agent-governance-controls-cost-and-proves-roi/)

_Azure_

AI 에이전트 비용을 관리 가능한 투자 항목으로 다루기 위해 거버넌스와 비용 최적화, ROI 측정을 연결하는 방법을 설명한다. 에이전트 운영에서는 모델 성능뿐 아니라 실행 단가와 업무 성과를 함께 추적해야 한다는 관점이다.

### [Building resilient real-time streaming workers with Amazon DynamoDB leases](https://aws.amazon.com/blogs/architecture/building-resilient-real-time-streaming-workers-with-amazon-dynamodb-leases/)

_AWS Architecture_

수백 개의 지속적인 WebSocket 연결을 유지하는 실시간 스트리밍 워커가 장애 시 데이터를 잃지 않도록 DynamoDB lease를 사용하는 패턴을 설명한다. 워커 소유권과 장애 전환을 분산 상태로 관리해 복원력을 높이는 방식이다.

### [What’s new with Google Cloud](https://cloud.google.com/blog/topics/inside-google-cloud/whats-new-google-cloud/)

_Google Cloud_

Google Cloud의 최신 제품·서비스 업데이트를 한 곳에서 정리하는 공식 업데이트 모음이다. 신규 기능이나 서비스 변경을 빠르게 추적할 때 참고할 수 있다.

### [The future of infrastructure resiliency starts with modernization](https://azure.microsoft.com/en-us/blog/the-future-of-infrastructure-resiliency-starts-with-modernization/)

_Azure_

인프라 현대화는 새로운 기술을 도입하는 것만으로 끝나지 않으며, 장애와 중단 상황에서도 핵심 서비스를 지속할 수 있다는 신뢰가 전제돼야 한다고 설명한다. 현대화 계획에 복원력과 재해복구 검증을 함께 포함해야 한다는 내용이다.

### [1.1.1.1 now supports post-quantum DNSSEC, all 2,420 bytes of it](https://blog.cloudflare.com/post-quantum-dnssec-1111/)

_Cloudflare_

Cloudflare 1.1.1.1이 post-quantum DNSSEC 검증을 지원하기 시작했다. 양자 컴퓨팅 시대를 대비한 DNS 신뢰 체계를 실제 퍼블릭 리졸버 환경에 적용하는 과정과 큰 키·서명 크기에 따른 운영 문제를 다룬다.

### [Testing application resilience with Amazon SQS and AWS Fault Injection Service](https://aws.amazon.com/blogs/architecture/testing-application-resilience-with-amazon-sqs-and-aws-fault-injection-service/)

_AWS Architecture_

AWS Fault Injection Service와 Systems Manager Automation을 이용해 SQS 기반 애플리케이션에 점진적 장애 실험을 수행하는 방법을 설명한다. 실제 장애 전에 재시도, circuit breaker, dead-letter queue가 의도대로 동작하는지 검증하는 것이 목적이다.

### [How we rebuilt Cloudflare Workers’ module registry for Node.js compatibility](https://blog.cloudflare.com/workers-module-registry-nodejs/)

_Cloudflare_

Cloudflare Workers가 Node.js 호환성을 기본 제공하기 위해 module registry를 재설계한 과정을 소개한다. 애플리케이션 크기 한도를 늘리고 URL 기반 모듈 레지스트리를 추가해 Node.js 생태계와의 호환 범위를 넓혔다.

---

## DevOps & 인프라

### [Marketing ops as code: Automating events from planning to follow-up on GitHub](https://github.blog/ai-and-ml/github-copilot/marketing-ops-as-code-automating-events-from-planning-to-follow-up-on-github/)

_GitHub_

반복 가능한 업무 절차를 GitHub와 Copilot을 이용해 코드와 자동화로 표현한 사례다. APAC 마케팅 이벤트의 기획부터 후속 작업까지 작업 흐름을 저장소 중심으로 자동화하면서 운영 업무에도 software engineering 방식이 적용될 수 있음을 보여준다.

### [OpenAI’s safety system is already cutting off API responses mid-task](https://thenewstack.io/openai-slowing-ai-development/)

_The New Stack_

OpenAI의 안전 시스템이 작업 도중 API 응답을 중단하는 사례를 다룬다. 모델 안전장치가 강화될수록 긴 작업을 수행하는 에이전트는 중간 중단과 복구를 전제로 설계해야 하며, 안전 정책과 개발자 경험 사이의 균형도 중요해진다.

### [Cohere’s new translation model is open weights — but not for commercial use](https://thenewstack.io/cohere-translation-commercial-licensing/)

_The New Stack_

Cohere가 North Small Translate 1.0을 open-weight 형태로 공개했지만 CC BY-NC 4.0 라이선스를 적용해 상업적 사용에는 제약이 있다. 모델의 공개 여부와 실제 사업 활용 가능성은 별개이므로 배포 전 라이선스 조건을 반드시 확인해야 한다.

### [AI를 전제로 다시 설계하다, Tech-Verse 2026 참관기](https://techblog.lycorp.co.jp/ko/tech-verse-2026-ai-driven-development-review)

_LINE_

LINE 개발자들이 Tech-Verse 2026에서 확인한 AI 중심 개발 방식과 조직 변화에 대한 참관기다. AI를 보조 도구로 추가하는 수준이 아니라 개발 프로세스 자체를 AI 사용을 전제로 다시 설계하는 흐름을 다룬다.

### [Analyze your experiments in ChatGPT with the Datadog Experiments plugin](https://www.datadoghq.com/blog/chatgpt-datadog-experiments/)

_Datadog_

Datadog Experiments의 실험 결과를 ChatGPT에서 직접 조회하고 질문하며 후속 작업까지 연결할 수 있는 플러그인을 소개한다. 관측·실험 데이터를 자연어 인터페이스와 연결해 분석 접근성을 높이는 방식이다.

### [Understanding NetFlow duplication: Why it happens, and how to deduplicate](https://www.datadoghq.com/blog/understanding-netflow-duplication/)

_Datadog_

NetFlow 데이터가 중복 수집되는 원인과 이를 방지·제거하는 방법을 설명한다. 네트워크 경로와 수집기 구성을 이해하고 중복 데이터를 정리해야 트래픽 분석과 비용 계산의 정확도를 유지할 수 있다.

### [How to calculate DevOps platform total cost of ownership](https://about.gitlab.com/blog/how-to-calculate-devops-platform-total-cost-of-ownership/)

_GitLab_

DevOps 플랫폼의 총소유비용은 구독료와 라이선스만으로 계산할 수 없으며, 통합·운영·유지보수·도구 전환과 엔지니어 시간까지 포함해야 한다고 설명한다. 플랫폼 선택에서 숨은 운영 비용을 함께 비교해야 한다는 내용이다.

### [GitHub Copilot app for Beginners: Using the diff, terminal, and browser](https://github.blog/ai-and-ml/github-copilot/github-copilot-app-for-beginners-using-the-diff-terminal-and-browser/)

_GitHub_

GitHub Copilot 앱에서 에이전트가 생성한 코드 diff를 확인하고 터미널 명령을 실행하며 웹 앱을 같은 화면에서 미리 보는 방법을 소개한다. 여러 도구를 오가던 검증 과정을 하나의 작업 공간으로 줄이는 데 초점을 둔다.

### [Custom labels in Grafana Cloud Synthetic Monitoring: New updates for consistency and ease-of-use](https://grafana.com/blog/synthetic-monitoring-labels-update/)

_Grafana_

Grafana Cloud Synthetic Monitoring의 custom label 동작을 개선해 텔레메트리 분류와 정책 적용을 더 일관되게 만들었다. 라벨을 기반으로 알림, 비용 귀속, 접근 제어 등을 관리하는 운영 흐름을 단순화한다.

### [Is prevention essentially a solved problem?](https://snyk.io/blog/is-prevention-solved/)

_Snyk_

에이전트가 생성하는 코드에서 취약점을 사전에 차단하는 기술 자체는 상당 부분 해결됐지만, 개발 속도를 떨어뜨리지 않으면서 어떤 통제를 적용할지가 여전히 과제라는 관점을 다룬다. 보안 통제의 정확도와 개발 경험 사이 균형이 중요하다.

### [GitHub availability report: August 2026](https://github.blog/news-insights/company-news/github-availability-report-august-2026/)

_GitHub_

GitHub가 2026년 8월 서비스 가용성 보고서를 공개했다. 해당 월에는 여러 서비스에서 성능 저하를 일으킨 다섯 건의 장애가 있었으며, 대규모 개발 플랫폼의 운영 안정성 개선 내용을 정리한다.

### [How we built Datadog Experiments](https://www.datadoghq.com/blog/how-we-built-datadog-experiments/)

_Datadog_

Datadog Experiments가 CUPED 기반 통계 처리, 검증 가능한 warehouse 결과, 거의 실시간인 RUM 지표를 결합해 실험 결과에서 의사결정까지 걸리는 시간을 줄인 설계를 소개한다.

### [Prepare for the Cyber Resilience Act's 24-hour reporting deadline](https://about.gitlab.com/blog/cyber-resilience-act-reporting-deadline/)

_GitLab_

EU 시장에 소프트웨어를 공급하는 많은 기업은 2026년 9월 11일부터 제품 취약점이 실제 악용되고 있음을 알게 된 뒤 24시간 안에 초기 보고를 해야 한다. CRA 대응을 위해 취약점 탐지와 증적 수집, 보고 절차를 운영 프로세스에 미리 포함해야 한다.

### [How to monitor Cypress tests with Grafana Cloud](https://grafana.com/blog/how-to-monitor-cypress-tests-with-grafana-cloud/)

_Grafana_

Grafana Cloud를 이용해 Cypress 테스트의 실패 빈도와 실행시간 추세를 관찰하는 방법을 설명한다. 개별 CI 실행만 보는 대신 장기 추세를 수집하면 느려지는 spec이나 반복적으로 실패하는 테스트를 더 쉽게 찾을 수 있다.

### [AI Norms & Values, Part 3 of 3: Things We Hold True](https://www.honeycomb.io/blog/ai-norms-values-part-3-things-we-hold-true)

_Honeycomb_

Honeycomb이 AI를 업무 도구로 사용할 때의 원칙과 책임, 작업 소유권, 품질 기준을 정리한다. 실제 사용 방식뿐 아니라 에너지 사용, 지식재산권, 편향 같은 외부 영향까지 조직의 AI 운영 원칙에 포함해야 한다는 내용이다.

### [App Router의 장점은 우리에게도 장점일까요?](https://toss.tech/article/52999)

_토스_

App Router가 토스뱅크에도 적합한 선택인지 직접 측정한 결과와 도입 판단 기준을 공유한다. 프레임워크의 일반적인 장점보다 실제 서비스의 성능과 개발 경험을 근거로 기술 선택을 평가하는 사례다.

---

## ⚡ 빠른 소식

- [GitLab Critical Patch Release: 19.3.2, 19.2.6, 19.1.8](https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-3-2-released/) — _GitLab_
- [Rebuilding AUTOMATIC1111 with Gradio Workflow](https://huggingface.co/blog/gradio-workflow-1111) — _Hugging Face_
- [IBM releases SOTA Granite Time Series PatchTST-FM-r2 model with commercial-friendly license](https://huggingface.co/blog/ibm-research/ibm-releases-sota-granite-time-series) — _Hugging Face_

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI가 한국어로 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
