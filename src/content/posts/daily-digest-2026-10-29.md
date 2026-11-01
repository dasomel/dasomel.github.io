---
title: "📰 데일리 테크 다이제스트 - 2026-10-29"
description: "2026-10-29 Cloud, Kubernetes, AI, DevOps 소식 26건 — 자동 큐레이션 다이제스트."
pubDate: 2026-10-29
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### Volcano v1.16 Released: NamespaceQueue, fairshare, and a broader HyperNode ecosystem

CNCF의 클라우드 네이티브 배치 스케줄러인 Volcano가 65명의 기여자 참여와 Kubernetes 1.36 지원을 포함한 v1.16.0 버전을 출시했습니다. 이번 릴리스에서는 테넌트가 관리자가 승인한 리소스 풀 내에서 자체 네임스페이스 로컬 큐 계층과 쿼터를 구성할 수 있는 NamespaceQueue CRD가 도입되었습니다. 또한 Slurm의 사용량 감쇄 알고리즘에서 영감을 받은 fairshare 플러그인을 추가하여 큐를 공유하는 여러 네임스페이스 간의 누적 리소스 소비 이력을 스케줄링 결정에 반영하도록 개선했습니다. 대규모 대기열 환경의 효율을 높이기 위해 UnschedulableJobCache가 추가되어 노드 레이블 갱신, 리소스 반환, 동적 리소스 할당(DRA) 변경 같은 이벤트 힌트가 발생하기 전까지 불필요한 반복 검사를 생략합니다. 아울러 토폴로지 탐색과 슈퍼노드 계층 관리를 독립 실행할 수 있는 HyperNode 컨트롤러 분리와 함께, 추론 워크로드를 여러 슈퍼노드에 분산 배치하는 PodGroup 토폴로지 안티 어피니티 규칙도 지원됩니다.

> 💡 **왜 중요한가**: 네임스페이스 단위의 자체 큐 제어와 이벤트 기반 스케줄링 캐시를 통해, 대규모 AI 워크로드를 운영하는 멀티 테넌트 쿠버네티스 클러스터의 스케줄러 오버헤드와 자원 독점 문제를 동시에 완화할 수 있습니다.

🔗 [원문 보기](https://www.cncf.io/blog/2026/10/28/volcano-v1-16-released-namespacequeue-fairshare-and-a-broader-hypernode-ecosystem/) · _CNCF_

---

## Kubernetes & Cloud Native

### [Win the Agentic Era, Together: Introducing the Docker Navigator Partner Program](https://www.docker.com/blog/docker-navigator-partner-program/)

_Docker_

Docker는 고객의 AI 에이전트가 실험 단계에서 프로덕션으로 옮겨 가며 신뢰, 보안, 거버넌스가 핵심 질문이 되었다며 Docker Navigator Partner Program을 출시했다. 프로그램은 Crew, Explorer, Navigator 세 단계로 나뉘며 Crew는 계약과 온보딩을 마친 시작 단계, Explorer는 인증을 받고 AI 거버넌스 솔루션을 판매하는 단계, Navigator는 공동 영업과 참조 아키텍처 공동 작성까지 하는 최상위 단계다. 최상위 파트너에게는 전담 파트너 성공 매니저, 분기별 비즈니스 리뷰, 베타 우선 접근과 분기별 로드맵 브리핑, 공동 마케팅 자금(MDF), 파트너 자문 위원회 자리가 제공된다. 기존 파트너는 현재 지위에 맞는 단계로 들어가며 단계는 2027년 4월 30일까지 보호된다. AI Governance Growth Incentive는 2027년 1월 31일까지 승인된 AI 거버넌스 딜 등록에 기존 단계 할인에 10포인트를 더하고 대상 딜은 4월 30일까지 성사되어야 하며, 등록과 인증은 새 포털 partner.docker.com에서 한다. Docker는 9월 Oktane에서 발표된 Blueprint Alliance의 창립 멤버이며 Okta, AWS, CrowdStrike, Databricks, Google Cloud 등과 함께 에이전트 보안 공통 아키텍처에 합의했다.

> 💡 Docker는 에이전트가 실행되는 환경의 격리, 런타임 거버넌스, 공급망 보안을 자신의 몫으로 제시하므로 에이전트 도입 시 실행 환경 통제를 별도 요건으로 검토해야 한다.

### [Hardening Tetragon’s gRPC API with Tetragon](https://cilium.io/blog/2026/10/28/tetragon-grpc)

_Cilium_

Cilium 팀은 v1.7 이전 Tetragon이 인증 없는 gRPC 관리 API를 localhost:54321에 노출하며 hostNetwork: true로 실행되는 같은 노드의 파드가 접근할 수 있다는 CVE-2026-65960을 설명했다. 이 취약점은 심각도 high로 평가되었고 2026년 7월 27일 GitHub 보안 권고 GHSA-6qqg-3qf7-p3v5로 공개되었으며 v1.7.0 이전 모든 버전이 해당된다. hostNetwork 파드는 노드의 네트워크 네임스페이스와 루프백을 공유하므로 127.0.0.1:54321에 연결할 수 있지만, 자체 네트워크 네임스페이스의 파드는 별도 루프백이라 그 포트에 아무것도 없다. 글은 공격자가 이 API로 트레이싱 정책을 읽거나 수정할 수 있다는 위험을 설명하며, 영향 여부는 tetragon-config 컨피그맵의 server-address 값으로 확인하라고 안내한다. localhost:54321이면 TCP 노출, UDS 주소면 유닉스 소켓, 빈 값이면 API 비활성이다. Tetragon v1.7은 API를 기본적으로 유닉스 도메인 소켓으로 노출해 해결하며, 업그레이드가 어렵거나 TCP를 유지해야 하면 security_socket_connect를 훅하는 TracingPolicy로 워크로드의 연결을 막을 수 있다. 저자는 Kind 클러스터에서 grpcurl 파드로 정책 적용 전에는 연결되고 적용 후에는 차단됨을 시연했다.

> 💡 hostNetwork 파드는 노드 루프백의 관리 포트에 닿을 수 있으므로 업그레이드 전까지 server-address 설정을 점검하고 해당 연결을 막는 정책을 적용해야 한다.

---

## AI & ML

### [NVIDIA Nemotron 3.5 Transcribe and Granary v2: Intelligent Multilingual Transcription You Can Prompt and Adapt](https://huggingface.co/blog/nvidia/nemotron-transcribe-granary)

_Hugging Face_

엔비디아(NVIDIA)가 허깅페이스와 ModelScope를 통해 프롬프트 입력이 가능한 오픈 가중치 음성 모델 Nemotron 3.5 Transcribe와 데이터 파이프라인 Granary v2를 출시했다. 이 모델은 단일 체크포인트 안에서 40개 언어 전사, 31개 언어의 영어 번역, 13개 언어에 대한 최대 8명 화자 분리(Diarization), 영어 기반 오디오 질의응답을 모두 지원한다. 아키텍처는 음성 인코더와 하이브리드 Mamba-트랜스포머 MoE 언어 모델을 결합하여, 전체 300억 개 매개변수 중 토큰당 약 40억 개의 활성 매개변수만 사용하여 고속 추론을 달성했다. 또한 Sortformer 화자 단서를 언어 모델에 직접 전달하여 생성 과정에서 각 발화 턴에 화자 태그를 붙일 수 있도록 설계되었다. 성능 측면에서는 허깅페이스 Open ASR 리더보드 영어 부문에서 오픈 웨이트 모델 중 1위(API 모델 제외, 평균 WER 5.33%), David AI 21개 언어 화자 분리 1위(DER 18.26%)를 차지하며 여러 벤치마크를 석권했다. NeMo Speech 미세 조정 도구를 활용한 의료 사례 연구에서는 최적 프롬프트 대비 단어 오류율(WER)을 45.8% 추가로 낮췄으며, Jetson 장치부터 Blackwell 데이터센터 GPU까지 양자화 배포가 가능하다. 다만 이 모델은 실시간 스트리밍이 아니라 녹음된 오디오를 위한 것이며 최대 1시간 길이의 녹음을 처리한다.

> 💡 Mamba-트랜스포머 기반 MoE 구조와 화자 분리 단서를 결합한 단일 음성 모델을 활용하면 별도의 파이프라인 없이도 낮은 연산 비용으로 다국어 회의 전사와 오디오 기반 분석을 엣지부터 클라우드까지 일관되게 배포할 수 있다.

### [OpenAI and ServiceNow expand partnership across enterprise workflows](https://openai.com/index/openai-servicenow-partnership-expansion)

_OpenAI_

OpenAI와 ServiceNow는 10월 28일 1월 파트너십을 확대해 OpenAI 모델과 에이전트를 ServiceNow 제품에 더 넣고 ServiceNow 워크플로를 ChatGPT와 Codex에 연결한다고 발표했다. 새 ServiceNow 연동은 ChatGPT 안에서 IT 담당자가 유사 인시던트를 찾고 변경 위험을 평가하며 ServiceNow 레코드를 갱신하게 하며, 고객이 자기 인스턴스에 연결해 노출할 기능을 고르고 Action Fabric이 기존 업무 규칙과 권한을 적용한다. ServiceNow는 ChatGPT 안에서 온콜 엔지니어가 연결된 모니터링 알림, 최근 변경, 영향받는 서비스를 보고 담당 팀을 지정하는 인터랙티브 경험도 미리 선보였다. 계획된 신규 기능은 AI Workflow Factory의 Codex 연동과 Build Agent·Autonomous Engineer에 OpenAI 모델 적용, ServiceNow의 자산·ID·비즈니스 컨텍스트와 OpenAI 사이버 역량을 결합한 보안 솔루션, Super Intelligence Control Tower의 음성 기반 AI 사용 사례 평가 경험이다. ServiceNow는 엔지니어링 조직을 넘어 전 직원에게 ChatGPT Work와 Codex를 제공할 계획이며, OpenAI도 자체 운영에 ServiceNow 워크플로를 쓴다. ServiceNow MCP 플러그인은 OpenAI 마켓플레이스에서 바로 이용할 수 있고 기능 강화는 2026년 말, 음성은 2027년 1분기, 보안 기능은 2027년 1월 early access와 2분기 GA, AI Workflow Factory의 Codex는 2027년으로 예정되어 있다.

> 💡 ChatGPT에서 ServiceNow 레코드를 직접 갱신할 수 있게 되므로 Action Fabric의 권한 적용 범위와 고객이 노출할 기능의 선택이 변경 관리와 감사의 핵심 통제 지점이 된다.

### [The future of the firm](https://openai.com/index/the-future-of-the-firm)

_OpenAI_

OpenAI의 Hemanth Asirvatham과 Elliott Mokski는 Next Economy 시리즈의 두 번째 에세이에서 AI가 조직도 안으로 들어오는 세 가지 시나리오를 제시했으며, 이는 저자들의 견해이지 OpenAI와 동료들의 입장이 아니라고 밝혔다. 첫째 아래(Beneath) 시나리오에서는 모두가 자리를 유지한 채 각자 밑에 AI 노동력이 쌓여 모든 사람이 관리자가 되고, 사람에게 가장 낮은 직급이 사라진다. 둘째 옆(Beside) 시나리오에서는 AI가 사람 관리자 밑의 동료로 조직도에 합류해 과업에서 시작해 점차 더 넓은 기능을 맡으며, 저자들은 범위가 큰 AI일수록 기업이 도입하기 쉽다고 본다. 셋째 사이(Between) 시나리오는 사람, AI, 사람으로 이어지는 자동화 샌드위치로, AI가 업무를 조율·모니터링하고 일부 사람이 AI에게 보고하며 그 초기 형태는 임원에게 조언하는 AI 컨설팅이다. 저자들은 이 AI 컨설팅 구조가 임원과 조직 사이의 거리를 줄여 권한을 위쪽으로 집중시키는 경향이 있다고 본다. 에세이는 관료적 절차(red tape), 노동자의 자율성, 기업 규모, 임금 격차라는 네 가지 질문을 다루며, 만드는 비용이 낮아질수록 덜 겨누고 더 쏘는(aim less, fire more) 방식이 늘고 노동자의 자율성은 순증가할 것으로 전망한다. 기업 규모는 AI가 조정 계층이 되어 커질 수도, 공급망을 외부 계약으로 돌려 작아질 수도 있으며, 임금 격차는 사람이 판단을 제공하는지 따르는지에 달렸다고 본다.

> 💡 에이전트가 조직도의 어느 위치에 놓이느냐에 따라 접근 권한과 감독 책임이 달라지므로, AI가 읽고 행동할 수 있는 시스템의 범위를 조직 설계 단계에서 정의해야 한다.

### [Legora is building the agentic operating system for legal work](https://openai.com/index/legora)

_OpenAI_

2023년 스톡홀름에서 설립된 Legora는 OpenAI 모델과 코딩 에이전트를 바탕으로 CEO Max Junestrand가 법률 업무를 위한 에이전틱 운영체제라 부르는 플랫폼을 만들고 있다. OpenAI는 에이전틱 법률 업무부터 대규모 문서 검토까지 Legora 플랫폼의 핵심 워크플로를 구동하는 주요 모델 공급자이며, Legora는 자사 팀에서도 ChatGPT Work, Codex 등을 확대해 쓴다. CTO Jacob Lauritzen에 따르면 코딩 에이전트 덕분에 20개 해법을 동시에 탐색해 며칠 안에 최선을 고를 수 있고, 로그 수백만 줄을 검색해 버그 리포트에서 수정까지 약 5분 만에 가기도 한다. 법무팀은 과거에 체결한 NDA를 분석해 플레이북을 만들고 들어오는 NDA의 1차 검토를 자동화했으며, 이 검토가 팀 역량에서 차지하는 비중이 약 20%에서 1% 미만으로 줄었다. Legora의 Tabular Review 워크플로는 수천 건의 계약을 여러 질문에 걸쳐 몇 분 만에 분석해 실사에서 더 넓은 범위를 검토할 수 있게 한다. OpenAI 글에 따르면 Fortune 100 고객 한 곳은 계약 처리 시간을 90% 줄이고 외부 소송·실사 비용 2,000만 달러 이상을 절감했으며 변호사 1인당 주 9.5시간을 돌려받았다. Legora는 ChatGPT용 플러그인도 제공하며, 다음 단계로 수백만 페이지 규모의 실사를 밤새 돌리는 장기 실행 에이전트와 변호사와 AI의 실시간 협업을 꼽는다.

> 💡 코딩 에이전트가 수백만 줄의 로그를 병렬로 검색해 버그 리포트에서 수정까지의 시간을 줄이는 방식은 장애 대응과 관측성 도구에 에이전트를 붙이는 운영 패턴을 보여준다.

---

## 클라우드 업데이트

### [How Revinate accelerated API adoption with Amazon API Gateway](https://aws.amazon.com/blogs/architecture/how-revinate-accelerated-api-adoption-with-amazon-api-gateway/)

_AWS Architecture_

전 세계 12,500개 이상의 호텔과 12억 5천만 개 이상의 고객 프로필을 관리하며 240억 달러의 직접 매출을 창출한 레비네이트(Revinate)가 API 인프라 현대화 사례를 공개했습니다. 기존 자체 관리형 인프라에서는 새로운 파트너를 연동할 때마다 수동 프로비저닝과 보안 설정에 따른 운영 부담이 커져 고객 데이터 플랫폼(CDP) 확장에 제약이 있었습니다. 이에 따라 레비네이트는 완전 관리형 Amazon API Gateway와 신규 출시된 Amazon API Gateway Portal을 도입하여 개발자 포털과 셀프서비스 온보딩 체계를 구축했습니다. 백엔드는 Amazon EKS 환경과 연동하고, AWS Lambda 권한 부여자를 통해 기존 외부 ID 공급자(IdP) 기반의 연합 인증을 구현했습니다. 또한 모든 REST API, 스테이지, 사용량 계획(Usage Plans)을 테라폼(Terraform) 코드로 선언하여 환경 일관성을 보장하고, 종량제 과금 모델을 통해 테넌트별 비용 추적과 호출 제한을 안정화했습니다.

> 💡 완전 관리형 API 게이트웨이와 코드형 인프라(IaC)를 결합하면 자체 게이트웨이 운영 비용을 제거하면서 대규모 B2B 파트너에 대한 사용량 추적과 세밀한 트래픽 제어를 확보할 수 있습니다.

### [Automating agentic AI Well-Architected reviews with the AWS Agentic AI Lens](https://aws.amazon.com/blogs/architecture/automating-agentic-ai-well-architected-reviews-with-the-aws-agentic-ai-lens/)

_AWS Architecture_

소기업부터 대형 금융기관까지 7,000개 이상의 조직을 지원하는 전자 통신 아카이빙 기업 스마시(Smarsh)가 에이전틱 AI 워크로드에 대한 아키텍처 검토 자동화 사례를 발표했습니다. 스마시는 컴플라이언스 알림을 처리하기 위해 Amazon Bedrock AgentCore의 런타임, 게이트웨이, 레지스트리, 아이덴티티 기능을 기반으로 멀티 에이전트 시스템을 구축했습니다. 하지만 AWS 웰-아키텍티드 프레임워크의 Agentic AI Lens는 6대 원칙, 41개 질문, 150개 모범 사례로 구성된 규범적 문서로만 제공되어 콘솔 툴에서 직접 실행할 수 없었습니다. 이를 해결하기 위해 스마시는 점진적 공개(progressive disclosure) 방식을 적용한 맞춤형 Claude 스킬을 제작하여 lens_data.json, 지침, 실행 스크립트로 구성된 평가 자동화 번들을 개발했습니다. 이 에이전트 스킬은 워크로드의 GitHub 저장소 소스 코드와 인프라 정의를 직접 검사하여 수일이 걸리던 150개 점검 항목에 대한 증거 기반 검토 보고서를 수 시간 만에 완성했습니다.

> 💡 규제 준수가 필수적인 AI 에이전트 환경에서 웰-아키텍티드 평가 기준을 실행 가능한 스킬로 코드화하면 검토 시간 단축과 아키텍처 정합성 검증의 일관성을 동시에 달성할 수 있습니다.

### [Introducing the AlloyDB Omni web UI for easier cluster observability](https://cloud.google.com/blog/products/databases/alloydb-omni-delivers-a-web-ui-for-cluster-observability/)

_Google Cloud_

구글 클라우드가 온프레미스, 엣지, 멀티 클라우드 환경에서 동작하는 PostgreSQL 호환 데이터베이스인 AlloyDB Omni를 위한 전용 웹 UI를 일반 공급(GA)으로 출시했다. 이번 릴리스는 Red Hat Enterprise Linux 및 컨테이너 배포 환경을 지원하며, CLI에만 의존하던 기존 클러스터 관리의 가시성 한계를 해소한다. 운영 안정성을 위해 진단 세션 중 쓰기 명령이나 구성 변경이 불가능하도록 엄격한 읽기 전용(read-only) 모드로 동작한다. 시스템 모니터링은 표준 프로메테우스(Prometheus) 텔레메트리와 통합되어 CPU, 메모리, 디스크 I/O, 활성 연결 추세를 실시간으로 표시한다. 쿼리 성능 분석 기능은 총 지연 시간과 호출 빈도 기준으로 SQL을 정렬하여 리소스 소모가 큰 병목 쿼리와 미인덱스 쿼리를 빠르게 식별한다. 또한 인메모리 컬럼형 엔진(Columnar Engine)의 메모리 사용량과 캐시 적용률을 시각화하고, 런타임 매개변수 감사를 통해 구성 드리프트와 pgBackRest 등 생태계 도구 상태를 점검할 수 있다.

> 💡 다종 하이브리드 인프라에 분산된 자체 관리형 데이터베이스에 대해 프로메테우스 연동 읽기 전용 UI를 제공하면 보안 위험 없이 인메모리 엔진 상태와 느린 쿼리를 신속하게 진단할 수 있다.

### [Near-zero downtime upgrades: Announcing Cloud SQL for MySQL blue-green deployments](https://cloud.google.com/blog/products/databases/cloud-sql-blue-green-deployments/)

_Google Cloud_

구글 클라우드가 주말 유지보수 중단 시간을 최소화하기 위해 Cloud SQL for MySQL을 시작으로 완전 관리형 블루-그린(blue-green) 배포 기능의 프리뷰를 발표했다. 기존에는 MySQL 8.0에서 8.4로의 메이저 버전 업그레이드 시 장시간의 서비스 중단과 복잡한 수동 롤백 위험이 수반되었다. 새로운 방식은 라이브 트래픽을 처리하는 블루(Blue) 인스턴스를 유지하면서, 대상 버전으로 업그레이드된 임시 복제본인 그린(Green) 인스턴스를 백그라운드 복제로 실시간 동기화한다. 엔지니어는 실제 프로덕션 데이터 사본을 기반으로 그린 환경에서 애플리케이션 호환성과 쿼리 성능을 사전 검증한 뒤 전환을 진행할 수 있다. 전환(Switchover) 단계에서는 블루 인스턴스를 잠시 읽기 전용으로 전환해 최종 동기화를 마친 후 그린을 승격시키며, Cloud SQL Enterprise Plus 환경에서는 1초 미만(sub-second)의 다운타임으로 완료된다. 전환 시 기존 데이터베이스의 IP 주소, 인스턴스 이름, 백업 기록이 자동으로 이전되므로 클라이언트 애플리케이션 구성이나 연결 문자열을 변경할 필요가 없다.

> 💡 데이터베이스 메이저 버전 업그레이드 시 IP 주소와 인스턴스 식별자를 자동 승계하는 관리형 블루-그린 방식을 도입하면 클라이언트 수정 없이 1초 미만의 중단 시간으로 안전한 주간 배포가 가능해진다.

### [Behind the scenes, two months later: How we ship Google Agent Skills like products](https://cloud.google.com/blog/topics/developers-practitioners/behind-the-scenes-two-months-later-how-we-ship-google-agent-skills-like-products/)

_Google Cloud_

구글 클라우드가 170개 이상의 에이전트 스킬을 호스팅하고 21,000개 이상의 깃허브 스타를 기록한 Google Agent Skills 저장소의 엔터프라이즈 운영 노하우를 공유했다. 스킬은 단순한 문서가 아니라 AI 에이전트의 추론 루프와 도구 선택, 실행 경로를 제어하므로 모든 변경을 소프트웨어 제품 릴리스처럼 관리해야 한다. 이를 위해 풀 리퀘스트 파이프라인에 디렉터리 구조 적합성, 스킬 린터, 시맨틱 버저닝, 평가 스위트 검증, 링크 유효성, AI 리뷰 에이전트 등 6단계 자동화 관문을 구축했다. YAML 메타데이터의 시맨틱 버전은 문자열 형식을 강제하고 지침 변경 시 버전 판올림을 필수로 요구하여 npx skills update 같은 도구로 재현 가능한 동작을 보장한다. 평가 스위트는 원자적(atomic) 검증 기준과 최신 커밋 기반의 필수 평가 보고서를 강제하며, 주간 깃허브 액션에서 lychee 도구로 외부 링크 파손을 추적한다. 또한 AI 리뷰 에이전트를 배치하여 결정론적 셸 스크립트로 작성해야 할 작업을 LLM 지침으로 작성하는 결정론적 함정(deterministic trap)을 사전에 차단한다.

> 💡 에이전트 지침을 문서가 아닌 소프트웨어 아티팩트로 간주하고 엄격한 시맨틱 버저닝과 자동화된 평가 관문을 적용해야 대규모 에이전트 환경에서 비결정론적 오류와 도구 호출 오작동을 통제할 수 있다.

### [Building for tomorrow on Red Hat OpenShift](https://www.redhat.com/en/blog/building-tomorrow-red-hat-openshift)

_Red Hat_

레드햇(Red Hat)은 포춘 글로벌 500대 기업 중 상위 50개 사의 58%, 미국 포춘 500대 기업 상위 25개 사의 76%가 레드햇 오픈시프트(Red Hat OpenShift)를 하이브리드 클라우드 플랫폼으로 채택하고 있다고 발표했다. 항공우주 및 방산 분야의 89%, 통신의 80%, 금융의 62%, 테크 기업의 60%가 오픈시프트를 운영 기반으로 활용하고 있다. 2천만 고객을 보유한 에미레이트 NBD 은행은 OpenShift Virtualization을 도입해 하루 최대 140대의 가상머신을 마이그레이션했으며, 현재 약 9,000대의 VM을 컨테이너 및 AI 워크로드와 단일 플랫폼에서 병행 운용하고 있다. 글로벌 에너지 기업 아람코는 OpenShift와 앤서블 오토메이션 플랫폼을 결합하여 생성형 AI 모델 온보딩 시간을 1시간 이내로 단축하고 VM 배포 기간을 수주에서 수 시간으로 줄였다. 이를 통해 아람코 현장 엔지니어의 데이터 분석 작업 속도가 최대 10배 빨라져 매일 평균 2시간의 업무 시간을 절감했다. 글로벌 비행 훈련 기업 CAE는 애저 레드햇 오픈시프트와 AWS 기반 ROSA를 활용해 7개 리전 12개 클러스터 환경에서 2,000명의 개발자에게 표준화된 멀티클라우드 환경을 제공하고 있다.

> 💡 레거시 가상화 환경을 쿠버네티스 네이티브 가상화로 통합하고 멀티클라우드 관리 도구를 일원화하면 인프라 운영 복잡도와 AI 워크로드 전환 비용을 동시에 절감할 수 있다.

### [How Atos uses Red Hat AI to build smaller, specialized models for sovereign AI](https://www.redhat.com/en/blog/how-atos-uses-red-hat-ai-build-smaller-specialized-models-sovereign-ai)

_Red Hat_

IT 서비스 기업 아토스(Atos)는 레드햇 AI(Red Hat AI)를 활용하여 독일어 소셜 미디어 게시물을 유해 콘텐츠 지표 등 14개 범주로 분류하고 구조화된 JSON으로 추출하는 소버린 AI 시스템을 구축했다. 대형 프론티어 모델 호출 비용과 데이터 주권 규제를 해결하기 위해 아토스는 RAG 대신 합성 데이터 생성 기법으로 맞춤형 학습 데이터를 제작해 소형 오픈 모델을 미세조정했다. 미세조정된 Phi-4 Mini 모델은 기본 모델 대비 종합 평가 점수가 최대 26.4% 향상되었으며, 별도의 스키마 강제 프레임워크 없이도 99%의 JSON 유효성을 달성했다. 또한 미세조정된 Qwen 2.5 7B 모델은 이번 특화 평가 과제에서 GPT-4.1의 성능을 뛰어넘었으며, Phi-4 Mini 역시 GPT-4.1에 근접한 정확도를 기록했다. 특히 Phi-4 Mini는 구조화 데이터 추출 전용 모델로 크기가 두 배 이상 큰 NuExtract 2.0 8B 모델보다 종합 점수에서 최대 22.6% 높은 성과를 보였다. 하루 수백만 건의 대규모 트래픽 환경에서 모델 경량화와 인하우스 미세조정은 인프라 추론 비용을 대폭 낮추면서도 완전한 모델 제어권을 보장함을 입증했다.

> 💡 특정 업무 영역에 맞춘 합성 데이터와 소형 오픈 모델 미세조정은 고비용 상용 API 의존도를 낮추고 데이터 주권과 추론 비용 효율성을 동시에 확보할 수 있는 대안이다.

---

## DevOps & 인프라

### [Google just handed its rivals the keys to Android](https://thenewstack.io/android-agents-build-debug/)

_The New Stack_

구글이 안드로이드 데브 서밋에서 서드파티 코딩 에이전트에게 안드로이드 개발 툴체인을 전면 개방한다고 발표했습니다. 안드로이드 스튜디오 Rabbit 2 릴리스에 정식 탑재된 Bring Your Own Agent 기능은 오픈 Agent Client Protocol을 지원하여 Claude Code, OpenAI Codex, Antigravity 등 40개 이상의 에이전트 연동을 제공합니다. 연결된 에이전트는 IDE의 프로젝트 구조, 빌드 구성, Logcat, 에뮬레이터 컨텍스트를 그대로 상속받으며, 변경 사항 적용 전 Change Review를 통해 잠재적 결함을 사전에 점검받습니다. 터미널 환경에서는 android preview 명령을 통해 IDE 실행 없이 젯팩 컴포즈(Jetpack Compose) 프리뷰를 렌더링할 수 있어 UI 작업을 최대 77% 단축하고 토큰 사용량을 3분의 1로 절감했습니다. 또한 원격 물리 기기 테스트를 지원하는 android device remote와 크래시 및 ANR 데이터를 연동하는 android signals 명령, 그리고 에이전트 성능을 측정하는 Android Bench 2.0이 함께 공개되었습니다.

> 💡 모바일 IDE와 CLI 환경이 표준 에이전트 프로토콜을 통해 프로파일러와 원격 디바이스를 직접 제공함에 따라, 빌드 및 디버깅 자동화 파이프라인의 에이전트 자율성이 크게 향상될 것입니다.

### [GitHub debuts Copilot Fusion, a new model selection & orchestration system that beats Claude Code for half the API cost](https://thenewstack.io/github-copilot-fusion/)

_The New Stack_

깃허브가 샌프란시스코에서 열린 GitHub Universe 행사에서 모델 선택과 오케스트레이션을 자동화하는 신규 시스템인 GitHub Copilot Fusion을 정식 출시했습니다. 이 시스템은 지난 9월 리서치 프리뷰로 공개된 Project HydraFusion의 런타임 오케스트레이션과 Copilot Auto Model Selection을 결합하여 개발자가 매번 모델을 직접 고르는 부담을 없앴습니다. 개발자는 Standard, High, Max의 세 가지 노력 수준(effort level)만 지정하며, 시스템이 작업 특성에 따라 단일 모델 호출, 캐스케이딩 평가, 상호 비평(critique) 워크플로를 동적으로 전환합니다. Artificial Analysis Coding Agent Index 벤치마크에서 Fusion Max는 60점을 기록하여 Claude Code(Opus 5.5 Max) 대비 2점 이내의 성능을 달성하면서도 API 비용과 토큰 사용량을 절반으로 줄이고 소요 시간을 40% 단축했습니다. 엔터프라이즈 관리자는 팀별로 허용할 모델 풀을 제어하거나 독립적인 정책을 설정할 수 있어 조직 전반의 토큰 효율성과 지출을 손쉽게 관리할 수 있습니다.

> 💡 멀티 모델 오케스트레이션과 동적 라우팅이 플랫폼 레벨에서 기본 제공됨으로써, 개발팀은 고성능 모델 남용으로 인한 API 비용 낭비를 방지하고 작업 복잡도에 최적화된 토큰 효율을 확보할 수 있습니다.

### [GitHub saw 7.4B commits in September, adding 4M CPU cores and 160 PB of storage to keep up](https://thenewstack.io/github-7-4b-commits-september/)

_The New Stack_

깃허브가 GitHub Universe에서 AI 에이전트 확산으로 인해 지난 9월 한 달간 처리한 커밋 수가 74억 건에 달했다고 발표했습니다. 이는 2024년 월간 6,500만 건 수준에서 지난 4월 14억 건, 8월 29억 건으로 급증한 데 이어 불과 몇 달 만에 기록적인 폭증세를 보인 수치입니다. 급증하는 에이전틱 트래픽을 처리하기 위해 깃허브는 올해 애저(Azure) 기반으로 400만 개의 CPU 코어, 160PB의 초고속 스토리지, 초당 50Tb의 네트워크 대역폭을 증설했습니다. 온프레미스 데이터센터의 용량 한계에 대응하여 깃허브는 연산과 스토리지를 완전히 분리하는 차세대 깃 아키텍처로의 전환을 본격화하고 있습니다. 마이크로소프트의 코어 AI 총괄 부사장 제이 파리크(Jay Parikh)는 내부 벤치마크에서 쓰기 처리량이 최대 35배 향상되었으며, 단순한 용량 증설을 넘어 근본적인 아키텍처 개편이 필수적이라고 강조했습니다.

> 💡 AI 에이전트가 주도하는 기하급수적인 커밋 폭증은 전통적인 소스 제어 인프라의 한계를 드러내며, 연산과 스토리지를 분리한 고처리량 클라우드 아키텍처로의 전환을 강제하고 있습니다.

### [GitHub Universe 2026: Evolving every layer of the stack](https://github.blog/news-insights/company-news/github-universe-2026-evolving-every-layer-of-the-stack/)

_GitHub_

GitHub Universe 2026에서 Jay Parikh는 아이디어에서 완성된 소프트웨어까지 잇는 에이전틱 소프트웨어 딜리버리 시스템 비전을 밝혔다. 핵심 제품인 GitHub Copilot app은 이슈부터 머지까지 하나의 에이전트 중심 화면에서 다루며 명세 작성과 텔레메트리 분석도 지원한다. Copilot Fusion은 작업 요구에 따라 여러 모델을 조합하고, Artificial Analysis Coding Agent Index에서 Fusion Max가 Opus 5.5 Max와 2점 이내 점수를 절반 비용과 작업당 40% 짧은 시간으로 냈다. Copilot projects는 여러 저장소에 걸친 병렬 세션을 관리하고 Session continuity는 GitHub 앱, VS Code, CLI, 웹에서 같은 클라우드 에이전트 세션을 이어 가게 하며, Copilot automations는 결과로부터 개선안을 제안하고 Copilot code review Max는 고위험 이슈 대상 ReviewBench에서 가장 높은 F1을 기록했다. GitHub Enterprise 고객은 별도 구독 없이 모든 Copilot 기능을 쓰고 사용한 AI 크레딧만 지불하며, GitHub Sales를 통해 제공되고 셀프서브는 곧 나온다. 올해 CPU 코어 400만 개, 스토리지 160PB, 네트워크 50Tb/s를 추가했고 Azure 멀티 리전 이전은 내년 초 완료할 예정이다.

> 💡 좌석당 구독이 아니라 사용한 AI 크레딧으로 과금되므로 에이전트 사용량과 모델 선택에 따른 비용을 조직 단위로 추적하는 체계가 필요하다.

### [Evaluate AI models for observability: o11y-bench joins Fireworks' Specialized Intelligence Index and reaches v1.1](https://grafana.com/blog/evaluate-ai-models-for-observability-o11y-bench-joins-fireworks-specialized-intelligence-index-and-reaches-v1-1/)

_Grafana_

그라파나 랩스(Grafana Labs)가 AI 모델의 옵저버빌리티 및 SRE 역량을 평가하는 오픈 벤치마크인 o11y-bench의 1.1 릴리스와 함께 Fireworks의 Specialized Intelligence Index 합류 소식을 발표했습니다. o11y-bench는 에이전트가 Grafana MCP 서버를 통해 실제 환경과 유사한 텔레메트리를 다루며 프로메테우스(Prometheus), 로키(Loki), 템포(Tempo), 대시보드 수정 등 6개 영역의 64개 과제를 수행하도록 평가합니다. 신뢰성을 보장하기 위해 각 과제를 3회 반복 실행하여 단발성 성공을 가려내고, 3회 평균 점수인 Pass^3과 최소 1회 성공률인 Pass@3을 함께 측정합니다. 새로 공개된 1.1 버전은 모델이 제시한 수치를 기준값과 대조하고 인용한 트레이스를 템포에서 재검증하는 결과 중심 평가와 저장 상태 diff 기반의 결정론적 채점을 도입했습니다. 또한 LiteLLM 기반 기본 에이전트에 Fireworks 추론 공급자 연동을 추가하여 서버리스 및 자체 배포 모델에 대한 재현 가능한 벤치마크 환경을 구축했습니다.

> 💡 단순 텍스트 생성이 아닌 MCP 기반의 실제 텔레메트리 쿼리 및 대시보드 상태 검증을 채점 기준으로 삼음으로써, 장애 대응 에이전트 도입 시 모델의 환각과 일관성 결여를 객관적으로 검증할 수 있습니다.

### [Octoverse: Commits, pushes, reach new highs in 2026 as developers build with agents](https://github.blog/news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents/)

_GitHub_

깃허브가 발표한 2026 옥토버스(Octoverse) 보고서에 따르면 지난 12개월 동안 개발자들이 깃허브에 코드를 푸시한 횟수가 2024년과 2025년의 합계를 넘어선 179억 회를 기록했습니다. 전체 커밋 수는 2년 전의 세 배가 넘는 343억 건에 달했으며, 머지된 풀 리퀘스트 역시 세 배 이상 증가한 13억 건으로 하루 평균 350만 건을 기록했습니다. 특히 에이전트 설정 파일이 포함된 신규 저장소는 일반 저장소 대비 평균 8배 많은 커밋을 기록했으며, 9월 기준 전체 풀 리퀘스트의 40% 이상이 AI 에이전트에 의해 시작되었습니다. 복수 모델 활용도 보편화되어 9월 기준 GitHub Copilot 사용자의 61%가 작업 성격에 따라 둘 이상의 모델을 교차 사용한 것으로 나타났습니다. 전 세계 깃허브 개발자 수는 2억 2,500만 명을 돌파했으며, 미국(3,830만 명)과 인도(3,200만 명)가 각각 1,000만 명 이상의 신규 개발자를 추가하며 성장을 주도했습니다.

> 💡 개발자의 역할이 직접 코드를 작성하던 방식에서 에이전트를 지휘하고 산출물을 검토하는 방향으로 전환되면서, 버전 관리 및 CI/CD 워크플로의 처리량이 전례 없는 속도로 가속화되고 있습니다.

### [Meta Andromeda: Powering the Next Generation of Ads Retrieval Through Model-System Co-Design](https://engineering.fb.com/2026/10/28/ml-applications/meta-andromeda-next-gen-ads-retrieval-gpu-co-design/)

_Meta Engineering_

Meta 엔지니어링 팀은 모델, 시스템, GPU 하드웨어를 함께 설계해 광고 검색(retrieval) 엔진을 고도화한 차세대 Meta Andromeda를 공개했습니다. 2024년 NVIDIA GH200 Grace Hopper 슈퍼칩에서 출발한 이 시스템은 프로덕션에서 초당 10억 개 이상의 광고를 점수화하며 2024년 시스템 대비 100배 향상된 처리량을 냈습니다. 차세대 Andromeda는 여러 사용자 타워를 전문가로 쓰는 검색용 Mixture-of-Experts(MoE) 구조와 어텐션 기반 게이팅 네트워크를 도입해 2024년 모델 대비 추론 FLOPs를 약 300분의 1로 줄이면서 랭킹 단계에 근접한 성능을 유지했습니다. 임베딩 수집, 모델 실행, 점수 산출을 하나의 GPU 커널로 융합해 단일 GH200에서 초당 100억 개 이상의 광고를 처리하며, 인덱스 매칭과 top-K 선택도 같은 GPU에 함께 두어 호스트 간 네트워크 트래픽을 약 100배 줄였습니다. 이 시스템은 2025년 이후 Facebook에서 전환을 2.4% 늘렸습니다.

> 💡 GPU 메모리 대역폭과 호스트-가속기 간 네트워크 병목을 해소하기 위해 모델 추론과 시스템 I/O를 단일 GPU 커널로 결합하는 통합 설계는 대규모 분산 추천 파이프라인의 인프라 집적도를 극대화합니다.

### [PHP2Shell Won't Be the Last. Here's Where the Next One Will Show Up First.](https://snyk.io/blog/php2shell-where-next-one-will-show-up-first/)

_Snyk_

스니크(Snyk)는 2026년 10월 21일 14:00 UTC에 공개된 치명적 취약점 PHP2Shell에 대한 대응 경험을 바탕으로 엔진 레벨 취약점의 위험성과 방어 체계를 분석했다. 이번 취약점(CVE-2026-109618, CVE-2026-109619, CVSS v4.0 9.2)은 PHP 엔진의 요청 수명주기에서 발생하여 아파치 mod_php 환경 등에서 단 한 번의 비인증 요청만으로 원격 코드 실행(RCE)이 가능했다. 공식 패치 4일 전인 10월 17일 아마존 허니팟 네트워크에서 이미 익스플로잇 시도가 감지되었으며, 패치 전 PoC 코드가 유출되어 공격 시도가 급증했다. 바이러스토탈(VirusTotal) 데이터에 따르면 PHP를 실행하는 약 510만 개 IP 중 버전을 공개하는 곳은 약 110만 개에 불과해 내부 의존성 정보만으로는 실제 인터넷 노출 위험을 파악하기 어렵다. 스니크는 공개 30분 이내에 영향 범위와 패치 버전을 공지하고, 24시간 이내에 Snyk API & Web 플랫폼에 PHP2Shell 전용 프로파일 점검을 추가했다. 외부 자산 식별, 공격 가능성 검증, 패치 후 배포판 단위 재테스트로 이어지는 외부 관점 점검 체계가 신속한 사고 대응의 핵심으로 입증되었다.

> 💡 런타임 엔진 결함은 애플리케이션 계층 검사를 우회하므로, 외부 자산 디스커버리와 동적 취약점 프로빙을 결합한 다계층 인벤토리 체계를 상시 운영해야 한다.

### [Match monitoring depth to workload needs with Infrastructure Basic](https://www.datadoghq.com/blog/infrastructure-monitoring-basic/)

_Datadog_

데이터독(Datadog)은 백오피스 서버, 스테이징 환경, 온프레미스 개발 가상머신 등 비핵심 워크로드를 위한 경량 모니터링 플랜인 인프라스트럭처 베이직(Infrastructure Basic) 티어를 출시했다. 이 티어는 심층 애플리케이션 계측이 불필요하지만 호스트 가용성과 자원 상태 확인이 필수적인 시스템을 대상으로 설계되었다. CPU, 메모리, 디스크 사용량 및 입출력, 네트워크 트래픽, 업타임, 시스템 부하 등 핵심 시스템 메트릭과 특정 명명된 프로세스 상태를 수집한다. 수집된 전체 해상도 데이터는 15개월 동안 보관되어 장기적인 자원 추이 분석과 간헐적 장애 원인 규명을 지원한다. 기본 제공 대시보드와 경보 설정을 통해 서비스나우(ServiceNow) 티켓 발송 및 페이저듀티(PagerDuty) 인시던트 연동 등 기존 알림 시스템과 즉시 연결된다. 동일 조직 내에서 프로 또는 엔터프라이즈 티어와 함께 사용할 수 있어 별도 모니터링 도구 없이 단일 에이전트의 베이직 모드로 전체 인프라 가시성을 통합할 수 있다.

> 💡 서브 워크로드에 대한 경량 모니터링 티어를 도입하면 도구 파편화 없이 관측성 비용을 최적화하면서 전사 인프라 모니터링 사각지대를 제거할 수 있다.

### [What happens when vulnerabilities are discovered faster than you can fix them?](https://about.gitlab.com/blog/security-at-machine-speed/)

_GitLab_

GitLab의 Bill Staples는 프런티어 AI가 복잡한 결함을 찾아내고 공격자도 같은 모델로 더 빨리 악용하는데 수정 속도는 따라가지 못한다고 말한다. Verizon 2026 DBIR은 알려진 악용 취약점을 완전히 수정하는 데 걸리는 중앙값을 2025년 32일에서 43일로 늘어난 것으로 측정했다. 같은 보고서에서 침해의 31%가 취약점 악용으로 시작해 19년 역사상 처음으로 가장 흔한 최초 접근 경로가 되었다. GitLab은 Anthropic의 Claude Mythos 5.1을 플랫폼에 들여왔고, 새 Business Logic Security Analyzer는 저장소 전체와 머지 리퀘스트를 읽어 엔드포인트가 지켜야 할 규칙을 추론하고 누락된 인가 검사와 소유권 결함을 찾는다. GitLab Orbit은 결과를 도입한 커밋, 배포한 파이프라인, 담당 팀과 연결하고, Duo Agent Platform은 오탐을 거르고 도달 가능성으로 우선순위를 매겨 수정을 작성한 뒤 파이프라인에서 회귀 테스트와 보안 스캔을 다시 돌린다. 각 에이전트는 요청 사용자와 공유하는 권한만 가진 복합 신원, 작업이 끝나면 파기되는 샌드박스, 모든 행동의 기록을 갖는다.

> 💡 자동 생성된 수정도 실제 빌드와 보안 정책 게이트를 통과하게 하고 에이전트 권한을 요청 사용자 범위로 제한해야 수정 속도를 높이면서 배포 신뢰성을 지킬 수 있다.

### [Snyk UNFILTERED: Inside Our First-Ever Customer Summit](https://snyk.io/blog/snyk-unfiltered-customer-summit/)

_Snyk_

스니크(Snyk)는 샌프란시스코에서 열린 AI 보안 서밋 및 신규 솔루션 출시를 앞두고 고객사 보안 리더들이 비공개로 참여한 첫 번째 고객 서밋인 Snyk UNFILTERED를 개최했다. 이번 행사는 발표 자료나 제품 시연 없이 진행되었으며, 엔터프라이즈 CISO와 보안 책임자들이 자율 에이전트 거버넌스와 AI 보안 도입 과정의 현실적인 난제를 솔직하게 논의했다. 첫 번째 화두는 엔지니어가 AI 프롬프트로 생성한 에이전트 스킬의 보안 책임 소재였으며, 사람이 직접 코드를 작성하지 않아도 적용되는 명확한 가드레일 수립이 강조되었다. 둘째로 기업 내 AI 논의가 토큰 비용 중심의 실험 단계를 넘어 실질적인 투자 대비 효과와 조직 예산 상한선 설정 단계로 성숙했음이 확인되었다. 셋째로 취약점 탐지 자체보다 검토, 테스트, 머지 단계에서 지연되는 수정 작업의 병목을 해결하는 것이 핵심 당면 과제로 지목되었다. 참석자들은 인간의 코드 리뷰 처리 용량이 한계에 달했다고 동의하며, 행사에 이어 오픈 프리뷰로 공개된 Evo Agentic AppSec의 Evo Remediation Agent와 같은 기계 네이티브 거버넌스 도입에 주목했다.

> 💡 AI 생성 코드와 자율 에이전트가 개발 워크플로 전반에 확산되는 환경에서는 사후 탐지보다 우회 불가능한 기계 네이티브 가드레일과 자동 패치 파이프라인의 구축이 우선되어야 한다.

### [팀이 신뢰할 수 있는 AI 분석 환경 만들기: 추천팀의 컨텍스트 설계](https://tech.kakao.com/posts/844)

_카카오_

카카오톡 숏폼 추천 모델을 개발하는 루퍼트(rupert)는 추천팀이 추천 지표 분석에 AI 에이전트를 쓰면서 팀 단위로 마주한 문제와 해결 방식을 공유했다. 개발자 A와 B가 같은 지표를 각자의 에이전트로 분석했는데 같은 '재생수'가 다르게 나왔고, A는 영상 플레이어 수집 로그를 B는 앱 수집 로그를 썼기 때문이었다. 기존 구조의 한계는 로그 선택 기준 같은 데이터의 암묵지, 사용하는 LLM에 따라 달라지는 분석의 방법, 사람 머릿속에만 있던 분석의 배경 세 가지였다. 그래서 컨텍스트를 Data Catalog(What), Analyst Persona(How), Task Context(Why)로 나눴으며, Data Catalog는 테이블 하나에 문서 하나로 집계 규칙과 주의 컬럼을 담고, Analyst Persona는 분석 유형 분류부터 리포트 작성까지 6단계 절차를 정의하고, Task Context는 Jira 이슈와 댓글을 연결 도구로 읽어 온다. AI Data Workspace 저장소에서는 CLAUDE.md가 읽을 순서와 금지 사항만 적는 진입점 역할을 하고, 스키마나 값의 분포 같은 사실은 LLM이 채우되 유효재생 기준 같은 정책 정의는 사람이 쓴다. 4장의 영상 임베딩 피처 A/B 실험 사례는 수치나 식별 정보를 빼고 가상으로 재구성한 것으로, 에이전트가 함정 점검 5항목을 확인하고 사전 기간 데이터로 사용자 편차를 보정해 중간 결론을 Jira 댓글로 남기는 과정을 보여 준다.

> 💡 데이터 카탈로그, 분석 절차, 과제 맥락을 분리해 팀이 함께 관리하는 문서로 두면 에이전트가 사람마다 다른 기준으로 분석해 수치가 어긋나는 문제를 줄일 수 있다.

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
