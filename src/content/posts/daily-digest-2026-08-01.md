---
title: "📰 데일리 테크 다이제스트 - 2026-08-01"
description: "2026-08-01 Cloud, Kubernetes, AI, DevOps 소식 22건 — 자동 큐레이션 다이제스트."
pubDate: 2026-08-01
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### Forget humans “in” the loop. Harness engineering puts humans “on” the loop.

The New Stack이 하네스 엔지니어링(harness engineering)을 다뤘다. AI가 소프트웨어 전달 루프에서 사람을 빠르게 잊게 만들고 있다는 것이 출발점이다. 제목이 밝히듯 사람이 루프 "안에" 있는 모델을 잊고, 하네스 엔지니어링은 사람을 루프 "위에" 두는 방식이라는 것이 논지다.

> 💡 **왜 중요한가**: 모든 행동에 승인을 요구하는 방식이 규모에서 무너진다면, 사람을 감독자 위치로 옮기고 감사 추적으로 사후 검증하는 구조가 대안이 된다.

🔗 [원문 보기](https://thenewstack.io/ai-agents-harness-engineering/) · _The New Stack_

---

## Kubernetes & Cloud Native

### [Docker OIDC connections for GitHub Actions available for Docker Orgs](https://www.docker.com/blog/docker-oidc-connections-for-github-actions-available-for-docker-orgs/)

_Docker_

Docker가 GitHub Actions용 OIDC 연결을 Docker 조직에서 쓸 수 있게 했다. 핵심은 CI/CD 파이프라인에서 저장된 자격 증명을 없애는 것으로, 수명이 긴 PAT·OAT를 몇 분 만에 만료되고 재사용할 수 없는 실행별 단기 토큰으로 대체한다. 설정은 세 단계다. Docker Home에서 룰셋과 함께 연결을 만들고, 워크플로 YAML에 `DOCKERHUB_OIDC_CONNECTIONID` 환경 변수와 `id-token: write` 권한을 추가하고, 확인 후 기존 자격 증명을 제거한다. 룰셋은 OIDC 주체 클레임으로 저장소·브랜치별 접근을 고정하며(예: `repo:my-org/my-repo:ref:refs/heads/main`) 연결당 최대 5개까지 둘 수 있다. 대상은 Docker Team, Docker Business, Docker Hardened Images 구독과 Docker Sponsored Open Source Program 조직이다. 워크플로에서는 docker/login-action@v4.5.0 이상에서 연결 ID와 조직명을 채워 넣으며, 이전 방식의 PAT·OAT는 이전 기간 동안 계속 동작한다. 적용 범위는 GitHub Actions에 한정되며 로컬 개발과 다른 CI는 여전히 PAT·OAT를 쓴다.

> 💡 레지스트리 자격 증명은 CI 시크릿 중 유출 파급이 가장 큰 축에 속하므로, GitHub Actions를 쓰고 있다면 우선순위 높은 전환 대상이다.

### [Kubernetes v1.37 Sneak Peek](https://kubernetes.io/blog/2026/07/31/kubernetes-v1-37-sneak-peek/)

_Kubernetes_

쿠버네티스가 2026년 7월 31일 v1.37 미리보기를 공개했다. 릴리스가 가까워지면서 프로젝트가 성숙함에 따라 기능이 폐기·제거되거나 더 나은 것으로 대체된다는 맥락에서 나온 글이다. 폐기 항목으로는 `kubectl run`의 `--filename`·`-f` 플래그(kubernetes/kubernetes#138671)와 kube-proxy의 ipvs 모드(KEP-5495)가 있다. ipvs 모드는 v1.40에서 기본 비활성화되고 v1.43에서 제거될 예정이다. 제거 항목으로는 정적 파드가 더 이상 Secret이나 ConfigMap을 참조할 수 없게 되며 `PreventStaticPodAPIReferences` 기능 게이트가 제거된다(kubernetes/kubernetes#140226). 진행 중인 변경으로는 cgroup v1 지원의 단계적 폐지가 있으며, v1.35부터 `failCgroupV1: false` 재정의를 적용하지 않으면 kubelet이 cgroup v1에서 실패한다. 관련 KEP는 ipvs 모드 근거를 담은 KEP-3866과 kube-proxy의 ipvs 모드 폐기를 다루는 KEP-5495다.

> 💡 kube-proxy의 ipvs 모드가 v1.43 제거 일정에 오른 만큼, 아직 ipvs를 쓰는 클러스터라면 지금이 iptables나 eBPF 기반 대안으로의 전환을 계획할 시점이다.

### [Scaling Kubernetes pods with KEDA based on Amazon SQS queue depth](https://www.cncf.io/blog/2026/07/31/scaling-kubernetes-pods-with-keda-based-on-amazon-sqs-queue-depth/)

_CNCF_

CNCF 블로그가 Amazon SQS 큐 깊이를 기준으로 KEDA로 쿠버네티스 파드를 확장하는 방법을 소개했다. 이벤트 기반 쿠버네티스 아키텍처에서는 CPU와 메모리 사용률이 실제 시스템 압박을 반영하지 못하는 경우가 많다는 문제 인식에서 출발한다. 구성은 Helm으로 전용 네임스페이스에 KEDA를 설치한 Amazon EKS 클러스터이며, IRSA나 Pod Identity를 통한 AWS 인증과 기존 SQS 큐, 워커 디플로이먼트가 필요하다. KEDA 구성요소는 AWS 파드 아이덴티티를 위한 TriggerAuthentication, 디플로이먼트를 큐 지표에 연결하는 ScaledObject, HPA 갱신을 관리하는 KEDA 오퍼레이터다. 사용하는 SQS 지표는 `ApproximateNumberOfMessages`와 `ApproximateNumberOfMessagesNotVisible`의 합으로 남은 작업량을 판단한다. 설정값은 파드당 메시지 수를 뜻하는 queueLength 10, 0으로 축소하는 임계값 activationQueueLength 1, pollingInterval 10초, cooldownPeriod 120초, minReplicaCount 0, maxReplicaCount 30이다. 복제본 수는 남은 메시지를 queueLength로 나눈 값의 올림이며, 메시지 25건에 queueLength 10이면 파드 3개가 된다.

> 💡 보이지 않는 메시지까지 합산해 남은 작업량을 계산한 점이 핵심으로, 가시 메시지만 세면 처리 중인 작업이 빠져 축소가 너무 이르게 일어난다.

### [Introducing the Runtime Remediation Skill for headless cloud security](https://webflow.sysdig.com/blog/introducing-the-runtime-remediation-skill-for-headless-cloud-security)

_Sysdig_

Sysdig가 헤드리스 클라우드 보안을 위한 Runtime Remediation Skill을 공개했다. 이 스킬은 런타임 경보를 안전하고 감사 가능한 대응으로 바꾸며, 실제 폭발 반경을 파악하고 순서가 정해진 조치를 제안하며 위협 재발을 감시하는 일을 분석가의 터미널 안에서 수행한다. 안전 통제로는 모든 파괴적 조치에 분석가의 명시적 확인을 요구하고, 그 조치가 정확히 무엇을 하는지, 무엇을 망가뜨리는지, 되돌릴 수 있는지를 보여주며, 일괄 승인 옵션은 두지 않는다. 조치 범위는 바이너리·시스템콜 수집 같은 포렌식 수집, 네트워크 격리, 프로세스 종료, 자격 증명 탈취에 대응하는 IAM 세션 폐기이며 올바른 순서로 배열된다. 통합은 OAuth로 등록된 Sysdig MCP 서버를 통해 이뤄져 AI 에이전트가 런타임 탐지와 워크로드 맥락에 구조적으로 접근하게 한다. 감사 추적으로는 UTC 타임스탬프, 결정 내역, 감시 확인 결과(해소·여전히 활성·판정 불가)를 담은 사고 티켓 로깅을 자동 생성한다. Claude Code와 Agent Skills 호환 환경에서 퍼블릭 베타로 제공되며 앞서 나온 Runtime Investigation Skill을 보완한다.

> 💡 일괄 승인 옵션을 두지 않고 조치마다 되돌림 가능 여부를 보여주는 설계가 핵심이며, 자동 대응 도구를 도입할 때 요구할 최소 기준으로 삼을 만하다.

---

## AI & ML

### [Advancing responsible AI across Europe](https://openai.com/index/advancing-responsible-ai-across-europe)

_OpenAI_

OpenAI가 유럽 전반의 책임 있는 AI 추진 현황을 공개했다. 자사의 안전성, 보안, 투명성, 출처 표시 관행이 유럽의 책임 있는 AI 거버넌스를 어떻게 뒷받침하는지 설명하며 이 작업을 계속하겠다고 밝혔다.

> 💡 유럽 규제 환경에서 출처 표시가 거버넌스 요건으로 다뤄지는 만큼, EU를 대상으로 하는 서비스라면 생성물 표식 정책을 벤더 기능에 맞춰 점검해둘 필요가 있다.

### [Building abundant intelligence](https://openai.com/index/building-abundant-intelligence)

_OpenAI_

OpenAI가 풍부한 지능(abundant intelligence) 구축에 대한 접근을 밝혔다. 고급 AI를 더 유능하고 더 저렴하며 더 널리 유용하게 만들기 위한 풀스택 접근이라고 설명한다.

> 💡 벤더가 비용 하락을 전략 축으로 명시하는 흐름은, 장기 계약을 검토할 때 현재 단가를 기준으로 고정하는 선택의 위험을 키운다.

### [Univé builds an AI-ready workforce](https://openai.com/index/unive)

_OpenAI_

OpenAI가 Univé 사례를 공개했다. Univé가 ChatGPT Enterprise로 AI에 준비된 인력을 어떻게 길렀는지 다루며, 리더십과 책임 있는 거버넌스, 직원 주도 혁신을 결합했다고 설명한다.

> 💡 도입 성패를 도구가 아니라 거버넌스와 직원 주도 확산의 조합으로 설명하는 사례가 반복되므로, 사내 확산 계획에서 교육과 정책을 같은 비중으로 다루는 편이 낫다.

---

## 클라우드 업데이트

### [What’s new in AI infrastructure and orchestration this month](https://cloud.google.com/blog/topics/ai-infrastructure/whats-new-in-ai-infrastructure-this-month/)

_Google Cloud_

구글 클라우드가 이번 달 AI 인프라와 오케스트레이션의 새 소식을 정리했다. 구글에서 AI는 처음부터 끝까지 아우르는 일이며 Gemini와 Nano Banana 같은 선도 모델을 직접 만든다는 전제로 시작한다. Google Cloud Managed Lustre가 정식 출시돼 TiB당 125~1000MB/s의 네 가지 성능 등급을 제공하고 8PB까지 확장되며 DDN의 EXAScaler 기반이다. C4N VM이 정식 출시돼 Titanium 하드웨어를 통해 400Gbps 대역폭, 초당 9,500만 패킷, 25GiB/s 블록 스토리지 처리량을 낸다. GKE Dataplane V2가 정식 출시돼 네트워크 정책을 적용한 상태로 최대 1만 5천 노드 클러스터를 지원한다. llm-d의 협조적 시간 분할은 독립적인 강화학습 작업을 공유 하드웨어에 교차 배치해 가속기 가동률을 약 40%에서 70%로 올린다. k8s-aibom이 오픈소스로 공개돼 AI 런타임을 탐지하고 ML 자재명세서를 생성하는 쿠버네티스 컨트롤러로 AI 공급망 보안을 자동화한다. Moonshot AI의 2.8조 파라미터 모델 Kimi K3에 대한 Day 0 배포 가이드가 Model Garden, 커스텀 오케스트레이션, llm-d 레시피를 쓰는 GKE 경로로 제공된다.

> 💡 ML 자재명세서를 자동 생성하는 컨트롤러가 오픈소스로 나왔다는 점이 실무적으로 유용해서, AI 워크로드의 공급망 가시성을 수작업 목록 없이 확보할 수 있다.

### [What’s new with Google Cloud](https://cloud.google.com/blog/topics/inside-google-cloud/whats-new-google-cloud/)

_Google Cloud_

구글 클라우드의 "What's new with Google Cloud" 페이지가 다이제스트에 포함됐다. 구글 클라우드의 최신 소식과 발표, 자료, 행사, 학습 기회를 한곳에 모으는 상시 갱신 허브다. 계속 갱신되는 페이지라 수집 시점의 개별 항목은 이후 내용과 다르다.

> 💡 상시 허브 페이지가 날짜별 다이제스트에 반복 등장하는 패턴이 확인되므로, 수집 규칙에서 이런 URL을 어떻게 다룰지 정해두는 편이 낫다.

### [Cloud CISO Perspectives: Why AI Threat Defense is the new boardroom baseline](https://cloud.google.com/blog/products/identity-security/cloud-ciso-perspectives-why-ai-threat-defense-is-the-new-boardroom-baseline/)

_Google Cloud_

구글 클라우드의 2026년 7월 두 번째 Cloud CISO Perspectives로, Google Cloud CISO Chris Betz와 Office of the CISO 시니어 디렉터 Alicja Cade가 썼다. 핵심 주장은 AI Threat Defense가 보안 거버넌스의 이사회 수준 기준선이 되어야 한다는 것이다. 수동적이고 반응적인 접근 대신 기계 속도로 위협 탐지와 대응을 자동화해 사업 민첩성을 뒷받침한다는 논리다. 언급된 제품은 AI Threat Defense(AITD), CodeMender, Agent Platform, Cloud KMS, AlloyDB, Google Cloud Run이다. 수치로는 모건스탠리가 통합 AI Threat Defense 프레임워크로 위협 평균 탐지 시간을 45분 창에서 90초 이하로 99.9% 단축했다는 사례가 제시된다. 다섯 가지 전략적 초점은 사업 지원, 수정 주기 최적화, 시스템 통합, 깊은 사업 맥락을 활용한 상황별 우선순위 결정, AI 안전성과 정책 거버넌스다. 게시일은 2026년 8월 1일이다.

> 💡 45분에서 90초로 줄었다는 수치는 앞선 Cloud CISO 글에서도 같은 값이 인용된 만큼 벤더의 대표 사례로 보이며, 자사 환경에서 재현되는지는 별도 검증이 필요하다.

### [An API for MoQ: provision your own isolated relays](https://blog.cloudflare.com/moq-relays/)

_Cloudflare_

Cloudflare가 Media over QUIC(MoQ)용 프로비저닝 API를 공개해 격리된 릴레이를 직접 만들 수 있게 했다. MoQ는 발행자가 이름을 가진 데이터 스트림을 보내고 구독자가 그 이름으로 스트림을 요청하는 발행·구독 시스템이며, CDN 서버를 통해 중계된다. 프로토콜은 HTTP/3 아래 QUIC 전송 위에서 동작해 특화된 인프라 없이 영상, 메시징을 비롯한 데이터를 저지연으로 전달한다. 지난해 Cloudflare는 모든 서버를 MoQ 릴레이로 만든 바 있고, 이번 프로비저닝 API는 개발자가 격리된 릴레이를 만들고 클라이언트가 발행할 수 있는지 구독할 수 있는지 둘 다인지를 통제하는 별도 자격 증명을 발급하게 하는 컨트롤 플레인이다. 프로비저닝된 릴레이는 전용 서버를 띄우는 것이 아니라 Cloudflare의 기존 글로벌 네트워크에 격리된 스코프를 만드는 방식이며 수 초 안에 사용할 수 있다. 토큰은 특정 작업으로 범위가 한정되고 클라이언트별로 할당 가능하며 다른 사용자에게 영향을 주지 않고 독립적으로 만료·폐기할 수 있다. 현재 IETF draft-14와 draft-16 MoQ Transport 명세를 지원하며 베타 기간에는 규모와 무관하게 무료다.

> 💡 발행 권한과 구독 권한을 토큰 수준에서 분리할 수 있다는 점이 실시간 스트리밍 설계에서 중요해서, 다자 참여 환경의 접근 통제를 애플리케이션 밖으로 밀어낼 수 있다.

### [Red Hat Ansible All-Stars: Driving the future of network and infrastructure automation](https://www.redhat.com/en/blog/red-hat-ansible-all-stars-driving-future-network-and-infrastructure-automation)

_Red Hat_

Red Hat이 네트워크·인프라 자동화를 이끄는 Ansible All-Stars 프로그램을 소개했다. 하이브리드 클라우드와 분산 네트워크로 인프라가 커지면서 운영 팀이 지속 불가능한 계산에 직면한다는 문제 인식에서 출발한다. 이 프로그램은 엔터프라이즈 인프라 자동화에서 구조적·문화적 현대화를 이끈 뛰어난 IT 전문가를 매년 표창한다. 2026년 수상자는 Blue Cross Blue Shield of Kansas의 Drew McKee와 TD Bank Group의 Jade Wu다. McKee는 Red Hat Ansible Automation Platform으로 400대가 넘는 서버에 걸쳐 패치 워크플로, 인증서 관리, 티켓 관리를 구현했다. Wu는 같은 플랫폼으로 1,300개 지점의 IP 마이그레이션을 수년에서 4개월로 압축하고 수동 현장 준비 작업을 없앴다. 핵심 기술인 Ansible Automation Platform은 소프트웨어 배포 없이 벤더를 넘나드는 네트워크 장비를 에이전트 없이 지원한다. 두 수상자 모두 자가 치유 인프라와 AIOps를 포함한 AI 기반 역량을 탐색하고 있다.

> 💡 1,300개 지점 IP 마이그레이션을 수년에서 4개월로 줄인 사례처럼, 자동화 효과가 가장 크게 나타나는 지점은 반복 횟수가 많고 수동 준비가 개입하는 작업이다.

### [Announcing Red Hat OpenShift Platform Plus for Red Hat OpenShift Service on AWS on AWS Marketplace](https://www.redhat.com/en/blog/red-hat-openshift-platform-plus-rosa-aws-marketplace)

_Red Hat_

Red Hat이 AWS Marketplace에서 ROSA용 Red Hat OpenShift Platform Plus를 제공한다고 발표했다. ROSA를 쓰는 조직이 엔터프라이즈급 역량으로 플랫폼을 확장할 방법을 점점 더 찾고 있다는 배경에서 나왔다. 번들은 Advanced Cluster Management, Advanced Cluster Security, Quay 레지스트리, OpenShift Data Foundation을 포함한다. 가격은 사용량 기반 종량제이며 연간 약정 시 33% 할인이 적용되고 AWS Cost Explorer와 연동된다. 청구는 AWS Marketplace 단일 청구서로 이뤄지고 AWS 약정 지출 배분을 지원한다. 사전 요건은 활성 ROSA 구독과 AWS Marketplace를 통해 구매한 ACM 허브다. 지원은 프리미엄 등급 Red Hat 지원이 포함돼 표준 업무시간 접근과 중대 사안에 대한 24/7 커버리지를 제공한다.

> 💡 AWS 약정 지출로 배분된다는 점이 조달 관점에서 실질적인 이점이라, 이미 AWS 약정을 채워야 하는 조직에는 구매 경로 선택이 곧 비용 문제가 된다.

### [Same goals, different clocks: What Red Hat’s 2025 Risk Report reveals about global compliance gaps](https://www.redhat.com/en/blog/red-hat-2025-risk-report)

_Red Hat_

Red Hat이 제품 보안팀이 2026년 4월 발간한 2025년 연례 Risk Report의 내용을 정리했다. 2025년에 3,781건의 보안 권고가 발행돼 연도별로 거의 선형에 가까운 증가 추세를 보였다. 공급망 공격은 2024년 대비 54% 늘었다. 사고의 88%는 귀속이 불명확했으며 대다수 공급망 공격이 확정적인 흔적을 남기지 않았다. CISA의 알려진 악용 취약점 목록에 오른 리눅스 커널 취약점 6건 중 5건은 이전 연도에 처음 공개된 것이었고, CVE-2021-22555는 확인까지 4년이 걸렸다. 치명적(Critical) 취약점의 평균 수정 시간은 12일, 중요(Important)는 24일이었다. 규정 준수 격차로는 EU CRA의 24시간 보고 요건이 전통적인 72시간 프레임워크와 충돌하고 NIS2, DORA 등 국가별 기준과도 차이가 난다는 점을 지적한다. 오픈소스 영향으로는 기업의 66%가 여전히 CRA에 익숙하지 않고 2027년 12월까지 완전한 준수를 예상하는 곳은 41%에 그쳤다. 비용 부담으로는 조직이 업스트림에 기여하는 대신 사설 소프트웨어 버전을 유지하는 데 릴리스 주기당 평균 25만 8천 달러를 쓴다고 밝혔다.

> 💡 악용된 커널 취약점 6건 중 5건이 이전 연도 공개분이라는 사실은, 최신 CVE 대응보다 미적용 패치 정리가 실제 위험을 더 줄인다는 뜻이다.

---

## DevOps & 인프라

### [Nscale just bought Anyscale. Here’s why it matters for multi-cloud neutrality.](https://thenewstack.io/nscale-anyscale-acquisition-neocloud-lockin/)

_The New Stack_

The New Stack이 Nscale의 Anyscale 인수를 다뤘다. 클라우드 플랫폼 기업 Nscale이 이번 주 AI 워크로드 확장 전문 기업 Anyscale을 인수하는 확정 계약을 발표했다. 제목이 밝히듯 이 인수가 멀티클라우드 중립성에 어떤 의미인지가 기사의 초점이며, 네오클라우드 종속 문제를 함께 다룬다.

> 💡 워크로드 확장 계층이 특정 클라우드 사업자에 편입되면 중립성 전제가 흔들리므로, 해당 스택에 의존 중이라면 이식 경로를 확인해둘 필요가 있다.

### [Modeling Device Capabilities for Analytics](https://netflixtechblog.com/modeling-device-capabilities-for-analytics-e7607acebde8?source=rss----2615bd06b42e---4)

_Netflix_

Netflix 기술 블로그가 분석을 위해 디바이스 능력(device capability)을 모델링하는 방법을 다뤘다.

> 💡 다양한 디바이스에 서비스를 제공하는 조직이라면 능력 모델을 어떻게 정규화하느냐가 분석 품질을 좌우하므로, 디바이스 속성 스키마 설계는 데이터 팀의 초기 결정 사항이다.

### [Don’t stop early: Case-folding source code at memory speed](https://github.blog/engineering/architecture-optimization/dont-stop-early-case-folding-source-code-at-memory-speed/)

_GitHub_

GitHub이 소스 코드의 대소문자 정규화(case folding)를 메모리 속도로 처리하는 최적화를 공개했다. 배경은 GitHub의 코드 검색 Blackbird가 480TB가 넘는 소스 코드를 색인하며 ngram 추출 전에 모든 바이트를 정규화해야 한다는 것이다. 기법은 분기 없는 ASCII 루프와 바이트 공간 산술을 쓰는 유니코드 폴딩으로, 조기 종료 없이 버퍼 전체를 처리해 벡터화를 가능하게 한다. 처리량은 단일 코어에서 ASCII 경로 기준 45GiB/s를 넘는다. 분기 제거의 근거는 데이터에 의존하는 루프 종료가 그것만으로도 루프를 스칼라 상태로 묶어두기 때문이며, 조기 종료를 없애면 LLVM이 NEON 명령으로 벡터화한다. 핵심 최적화는 조건부 저장을 분기 없는 마스크를 통한 무조건 쓰기로 바꿔, 바이트당 비용을 치르는 대신 16바이트 벡터 연산 한 번으로 처리하는 것이다. 유니코드는 1,776바이트 페이지 비트맵과 런렝스 테이블 구조로 다뤄 UTF-8 디코드·인코드 주기를 리틀엔디언 바이트 덧셈으로 완전히 우회한다. 비교 대상인 simd_normalizer는 ASCII에서 약 1.2GiB/s 수준이다. 구현은 러스트 크레이트 "casefold"로 오픈소스 공개됐다.

> 💡 데이터 의존적 조기 종료 하나가 루프 전체의 벡터화를 막는다는 관찰이 일반적으로 유용해서, 텍스트 처리 핫패스를 최적화할 때 먼저 확인할 지점이 된다.

### [Gemini Robotics 2 brings us one step closer to physical AGI](https://thenewstack.io/gemini-robotics-2/)

_The New Stack_

The New Stack이 Gemini Robotics 2를 다뤘다. 이번 주 구글 딥마인드가 더 적응력 있는 물리 시스템을 구동하기 위한 세 가지 새 모델로 구성된 지능 계층 Gemini Robotics 2를 공개했다. 제목이 밝히듯 이것이 물리적 AGI에 한 걸음 더 다가섰다는 것이 기사의 관점이다.

> 💡 로보틱스용 모델이 별도 계층으로 분리돼 발표되는 흐름은, 물리 시스템 제어가 범용 모델의 부가 기능이 아니라 독립된 스택으로 자리 잡고 있음을 보여준다.

### [Reflections on AI Week, and the future of solving problems with observability and AI](https://grafana.com/blog/ai-week-recap/)

_Grafana_

Grafana가 AI Week를 마무리하며 관측성과 AI로 문제를 푸는 미래에 대한 소회를 밝혔다. 정식 출시된 기능으로는 Assistant를 위한 에이전트 친화적 홈인 Workspace, AI 에이전트에 구조화된 Grafana 접근을 제공하는 gcx와 Cloud MCP 서버, 경보와 사고를 자동으로 조사하는 Assistant Investigations, 예약 작업 자동화인 Automations, 에이전트 행동을 모니터링하고 평가하는 Agent Observability, Grafana 위에서 커스텀 AI 에이전트를 만드는 오픈소스 AI SDK가 있다. 미리보기 기능으로는 Assistant Watchers, Assistant Search, 모바일·데스크톱용 Assistant, Microsoft Teams의 Assistant, OpenAI 모델을 쓰는 Assistant, 웹사이트 테스트 자동화를 위한 Agentic Testing이 공개됐다.

> 💡 관측성 벤더가 에이전트를 관측 대상으로도 삼는 Agent Observability를 함께 내놓은 점이, 에이전트 운영에서 계측 공백이 실제 과제로 인식되고 있음을 보여준다.

### [Grafana에서 자연어로 장애 원인을 분석하기: LLM 에이전트 기반 SRELens 개발기](https://techblog.lycorp.co.jp/ko/analyzing-incident-root-causes-in-grafana-using-natural-language-with-llm-agent)

_LINE_

LY Corporation의 Home SRE 팀이 Grafana에서 자연어로 장애 원인을 분석하는 LLM 에이전트 기반 SRELens 개발기를 공개했다. 관측성 데이터는 많아졌지만 분석은 여전히 어렵다는 문제 인식에서 출발한다. SRELens는 Grafana 애플리케이션 플러그인으로 동작하는 자연어 기반 관측성 데이터 분석 도구로, LLM 에이전트 오케스트레이션을 통해 메트릭·로그·트레이스·프로파일을 조회해 장애 원인을 분석한다. 구조는 채팅 UI를 제공하는 프런트엔드(TypeScript/React), LLM 에이전트 오케스트레이션과 프롬프트 합성, 요청 제한을 담당하는 백엔드(Go), 관측성 백엔드(Mimir, Loki, Tempo, Pyroscope)에 접근하는 MCP 게이트웨이, 대화 이력과 사용량 할당을 저장하는 Redis로 구성된다. 에이전트 설계는 도구 호출이 가능한 GPT 모델을 쓰고 기본 정책·데이터소스 프래그먼트·사용자 컨텍스트의 3계층 시스템 프롬프트를 적용하며, 도구 호출을 최대 10라운드로 제한하고 중복 호출 차단과 결과 크기 제한을 둔다. 프롬프트 인젝션은 백엔드 중앙 통제로 막고, 데이터소스 프래그먼트에 라벨 매핑과 쿼리 관례 같은 SRE 운영 지식을 담았다. 세 가지 시나리오 검증에서 오류 급증의 원인을 특정 API 요청 패턴으로 좁혔고, 데이터소스별 로그 필드를 올바로 선택해 poison-pill 재시도 폭주를 찾아냈으며, 로그 데이터가 없을 때는 추측하지 않고 없다고 보고했다.

> 💡 "프롬프트 정교화보다 통제 장치가 더 중요하다"는 운영 교훈이 핵심이며, 데이터가 없을 때 모른다고 답하게 만든 설계가 관측성 에이전트의 신뢰를 좌우한다.

### [How to govern agentic AI, MCPs, and AI code assistants](https://about.gitlab.com/blog/govern-agentic-ai-mcps-code-assistants/)

_GitLab_

GitLab이 에이전틱 AI와 MCP, AI 코드 어시스턴트를 통제하는 방법을 정리했다. AI 코드 완성은 설계상 사람의 검토가 절차에 포함돼 있었다는 점에서 출발한다. 개발자가 입력하면 제안이 뜨고 사람이 수락 여부를 판단하는 구조였는데, 에이전틱 AI에서는 그 지점이 사라지고 대신 사후 감사 추적이 필요해진다. 제시되는 통제 수단은 다섯이다. 팀별 분산 설정 대신 승인된 에이전트와 플로우를 공유 카탈로그로 게시하는 중앙 AI Catalog, 모든 에이전트 행동을 요청한 사람 사용자와 연결해 활동이 결코 에이전트 단독으로 귀속되지 않게 하는 복합 아이덴티티, 개별 도구를 자율 실행·검토 대기·차단 중 하나로 설정하는 도구 승인 가드레일, 워크플로 중간에 에이전트 행동을 탈취하려는 시도를 탐지하는 프롬프트 가드레일이다. GitLab 기능으로는 머지 리퀘스트 승인 정책, 스캐너 강제, 감사 이벤트 스트리밍, 자체 호스팅 배포 옵션이 언급된다. 핵심 주장은 에이전틱 AI 거버넌스가 부가 기능이 아니라 아이덴티티·권한·감사 가능성을 중심으로 구축된 다른 접근이라는 것이다. 지표는 도입률, 수락·품질, 위험, 수정, ROI를 함께 추적해 문제를 일찍 잡는다.

> 💡 코드 완성에서는 사람 검토가 구조상 강제됐지만 에이전트에서는 사라진다는 지적이 핵심이라, 도구를 바꾸면서 검토 지점이 함께 사라졌는지 확인해야 한다.

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
