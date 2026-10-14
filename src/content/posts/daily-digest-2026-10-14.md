---
title: "📰 데일리 테크 다이제스트 - 2026-10-14"
description: "2026-10-14 Cloud, Kubernetes, AI, DevOps 소식 36건 — 자동 큐레이션 다이제스트."
pubDate: 2026-10-14
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### Scope workloads and share resilience policies with AWS Resilience Hub

차세대 AWS Resilience Hub에 2026년 9월 18일 세 가지 기능이 추가되었다. 첫째는 서비스 입력 소스에서 Amazon EKS 레이블 셀렉터를 쓰는 기능으로, 네임스페이스 안에서 In, NotIn, Exists, NotExists 연산자로 Kubernetes 리소스를 골라내며 여러 셀렉터는 AND로 결합된다. 예시에서는 production 네임스페이스에서 app In checkout을 지정해 checkout의 Deployment와 ReplicaSet만 포함하고 inventory 서비스는 제외했지만, 클러스터·노드 그룹·VPC 같은 공유 인프라는 여전히 목록에 나타난다. 둘째는 생성형 AI 기반 Dependency Insights로, Route 53 Resolver의 DNS 활동을 최대 35일치 분석하고 에이전트 없이 동작하며 교차 리전, 최근 7일 내 신규, 서드파티, 편중된 사용 패턴을 짚어준다. 예제 checkout 서비스는 의존성 29개에서 5건의 인사이트가 나왔고 us-west-2의 DynamoDB와 PagerDuty가 교차 리전으로 잡혔으며, 인사이트는 24시간에 한 번만 재생성할 수 있다. 셋째는 AWS Organizations를 통한 복원력 정책 공유로, 중앙 팀이 정책을 한 번 정의하면 멤버 계정에 공유되고 예시 정책 tier-1-critical은 가용성 99.9%, 다중 AZ RTO 5분/RPO 1분, 다중 리전 RTO 15분/RPO 5분, 60분 간격 백업을 담았다. 정책 연결 이벤트는 채택을 보여줄 뿐 준수를 증명하지 않으며, IP 직접 연결은 DNS 기반 탐지에 잡히지 않고 공유를 끄면 멤버 서비스에서 정책이 제거된다는 한계도 명시되어 있다.

> 💡 **왜 중요한가**: EKS 레이블로 서비스 경계를 코드처럼 고정하고 공유 정책으로 RTO/RPO 기준을 조직 단위로 통일하면, 복원력 문서가 실제 운영 환경과 어긋나는 드리프트를 줄일 수 있다.

🔗 [원문 보기](https://aws.amazon.com/blogs/architecture/scope-workloads-and-share-resilience-policies-with-aws-resilience-hub/) · _AWS Architecture_

---

## Kubernetes & Cloud Native

### [Why Cybersecurity Awareness Month still comes back to the basics](https://webflow.sysdig.com/blog/why-cybersecurity-awareness-month-still-comes-back-to-the-basics)

_Sysdig_

Sysdig의 Crystal Morin은 사이버 보안 인식의 달에도 결국 기본기가 핵심이며, 기본은 시즌 이슈가 아니라 연중 과제라고 주장한다. Verizon 2026 DBIR(확인된 침해 22,000건 이상)에서는 취약점 악용이 31%로 최상위 초기 침투 경로가 됐고 전년 대비 55% 늘었으며, 제3자·공급망 관련 침해는 48%로 60% 증가했다. Google Cloud Threat Horizons 보고서는 2025년 하반기 클라우드·SaaS 침입의 83%에서 탈취된 ID가 확인됐다고 하고, Sysdig 2026 보고서는 CSP 관리형 ID의 97.2%가 머신 ID라고 밝힌다. Sysdig는 AI 도구의 50%가 눈에 띄지 않게 운영되는 섀도 AI가 늘고 있다고 보며, AI 인시던트를 겪은 조직의 68%에 AI 거버넌스 정책이 없었다고 인용한다. 권고안은 모든 권한 계정의 MFA 강제, 단기 자격 증명과 최소 권한, CVSS만이 아닌 악용 가능성 기준 패치, 지속적인 설정 점검과 쿠버네티스 RBAC 최소화, 모든 워크로드의 런타임 센서와 드리프트 탐지, 로그 중앙화와 충분한 보관, 서명된 아티팩트를 포함한 공급망 관리다. 결론은 이 통제들이 이미 검증된 것이므로 연례 점검표가 아니라 매일의 규율로 운영해야 한다는 것이다.

> 💡 머신 ID가 대부분이고 부여된 권한의 극히 일부만 쓰이는 환경에서는, 클러스터 RBAC와 CI/CD 자격 증명 정리가 가장 비용 대비 효과가 큰 보안 작업이다.

### [Docker Hub security advisory: personal access tokens transferred during account-to-organization conversions](https://www.docker.com/blog/docker-hub-security-advisory-cve-2026-105445/)

_Docker_

Docker는 Docker Hub의 계정을 조직으로 전환하는 기능에서 개인 액세스 토큰(PAT)이 새 소유자에게 재할당되는 결함, CVE-2026-105445를 공개했다. 2024년 8월 26일부터 전환 시 토큰 시크릿을 교체·폐기하지 않고 소유자만 바꿨고 새 소유자의 확인이나 알림도 없어서, 공격자가 토큰 시크릿을 쥔 채 대상 사용자로 레지스트리에 인증할 수 있었다. 토큰 범위 내에서 대상의 리포지토리와 접근 가능한 조직의 이미지를 pull·push·삭제할 수 있었지만, 웹 UI 접근이나 비밀번호·이메일·2FA 변경, 계정 탈취는 불가능했다. 9월 30일에 신고를 받아 4시간이 채 안 돼 수정을 배포했고, 10월 2일 영향 사용자에게 이메일을 보냈으며 10월 8일 전송된 PAT를 강제 비활성화했다. Docker는 전송된 토큰으로 이뤄진 약 304,000건의 push를 검토해 악용 증거를 찾지 못했다고 밝혔다. 조치로 전환 시 PAT 이전을 없앴고, 조직 소유자 지정에 동의와 알림을 요구하며, 토큰 소유권 변경 이력을 남기기로 했다. 권고는 PAT 점검, 모르는 토큰 폐기, 조직 자동화에 조직 액세스 토큰 사용이다.

> 💡 사람 계정에 묶인 PAT는 소유권 이전 같은 관리 작업의 부작용으로 유출 경로가 될 수 있으므로, CI와 자동화에는 조직 토큰을 쓰고 레지스트리 인증 로그를 주기적으로 대조해야 한다.

### [From zero to agent builder: Running kagent on your laptop](https://www.cncf.io/blog/2026/10/12/from-zero-to-agent-builder-running-kagent-on-your-laptop/)

_CNCF_

CNCF 블로그에서 Antonio Berben(Solo.io)과 Felipe Vicens(Telefónica)는 Kubernetes 커스텀 리소스로 AI 에이전트를 실행하는 CNCF Sandbox 프로젝트 kagent로, 다른 에이전트를 만드는 builder 에이전트를 노트북에 구축한다. 환경은 kind 클러스터 kagent-builder에 kagent v0.10.2를 Helm으로 설치하고, Ollama의 qwen3-coder:30b-a3b-q4_K_M 모델(약 18GB)을 쓴다. 더 작은 qwen2.5 7b와 14b 모델은 도구 호출이 불안정했다고 한다. agent-builder는 세 가지 도구만 허용하고 k8s_apply_manifest에는 requireApproval을 걸어, 사용자가 UI에서 승인해야 Agent 매니페스트가 적용된다. 같은 흐름을 A2A의 JSON-RPC message/send로 스크립트화할 수 있으며, input-required 상태가 승인 대기를 뜻한다. 가드레일은 프롬프트, 도구 허용 목록, 사람의 승인, RBAC의 4겹으로 구성되고, 도구 서버는 읽기 전용 역할에 agents.kagent.dev 쓰기 규칙 하나만 더해졌으며 Secret은 읽지 못한다. 기본 인증이 unsecure 모드이고 번들 PostgreSQL이 기본 비밀번호를 쓰므로 공유 클러스터에는 맞지 않으며, 저자는 거버넌스 계층으로 agentgateway를 제안하고 후속 글을 예고한다.

> 💡 에이전트가 YAML 리소스라서 만드는 일은 쉬워졌지만, 누가 요청하고 누가 승인하며 비용을 누가 내는지 같은 거버넌스를 먼저 설계하지 않으면 클러스터에 통제되지 않는 에이전트가 늘어난다.

---

## AI & ML

### [Run fast, private agents on-device with LFM2.5-24B-A2B](https://huggingface.co/blog/LiquidAI/lfm25-24b-a2b)

_Hugging Face_

Liquid AI가 2026년 10월 13일 공개한 LFM2.5-24B-A2B는 총 240억, 토큰당 활성 20억 파라미터의 오픈 웨이트 추론 모델로, 로컬 하드웨어에서 빠르고 프라이빗한 에이전트를 돌리는 것이 목표다. 구조는 40개 레이어, MoE 블록당 64개 전문가와 top-4 라우팅, gated short convolution과 GQA의 하이브리드이며 컨텍스트가 32K에서 131K 토큰으로, 어휘가 65K에서 128K로 늘었다. 사전학습은 약 17T에서 약 33T 토큰으로 확대했고, 후훈련은 SFT부터 에이전트 환경 강화학습까지 5단계이며 OpenClaw, Hermes Agent, Pi, OpenCode 같은 하네스에서 학습했다. Qwen3.6-35B-A3B, Gemma-4-26B-A4B-it, Nemotron-3.5-Lightning과 비교한 16개 벤치마크에서 AutomationBench 27.69, BFCLv4 65.01, ToolSandbox 80.71, IFEval 96.75 등으로 도구 사용과 지시 이행에서 앞섰다. 반면 GPQA Diamond 74.42, SWE-Bench Verified 51.00처럼 지식·코딩 벤치마크는 더 큰 모델이 앞서며, 지식 집약 작업에는 검색을 붙일 것을 권한다. 속도는 Apple M5 Max에서 초당 184토큰, Ryzen AI Max+ 395에서 114토큰이고 NVIDIA B300 한 장에서 고동시성 시 초당 2만 1천 토큰 이상을 낸다. llama.cpp, MLX, vLLM, SGLang, ONNX를 첫날부터 지원한다.

> 💡 2B 활성 파라미터 MoE가 노트북급 하드웨어에서 도구 호출 에이전트를 돌릴 수 있게 되면, 데이터를 외부로 보내지 않는 로컬 자동화 워크로드를 운영 환경에 검토할 만해진다.

### [Gemini 4 Argon: Built to solve your hardest problems](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/)

_Google AI_

Google이 2026년 10월 13일 Gemini 4 제품군의 첫 모델인 Gemini 4 Argon을 발표했으며, 코딩, 금융, 법률, 사이버보안, 과학의 깊은 다단계 작업을 겨냥한다. API는 AI Studio와 Gemini 플랫폼에서 제공되고 입출력 통합 100만 토큰 한도를 가지며, 도입 가격은 입력 100만 토큰당 2달러, 출력 10달러에 캐시 입력은 95% 할인이다. 2026년 11월 30일 이후 공개 버전 가격은 입력 4달러, 출력 20달러로 오른다. 벤치마크에서는 금융·코딩·법률·세금 업무를 측정하는 Vals Index 1위, ERQA 87%, Gray Swan 간접 프롬프트 주입에서 15회 적응형 공격 성공률 0.7%를 기록했다. 엔지니어링 사례로 Google 내부 Antigravity의 에이전트 코드 제출이 35% 이상 늘고 롤백이 거의 3분의 1 줄었으며, Chromium에서 약 600만 줄 레거시 폴더에서 핵심 웹페이지 처리를 분리하는 작업이 몇 달에서 몇 주로 단축되었다. Gemma 4 E2B 처리량은 약 37,900에서 108,000 토큰/초 이상으로 올랐고, 과학 분야에서는 AlphaQubit 디코더 최적화와 희귀질환 유전체 분석 등이 소개되었다. 안전 측면에서는 Frontier Safety Framework를 적용했고 외부 바이오 레드팀이 연 하위 과제의 1% 미만만 풀어냈으며 모델 카드를 공개했다.

> 💡 도입가가 11월 30일 이후 두 배가 되므로, 에이전트형 워크로드에 쓸 계획이라면 요금 인상 전후의 토큰 비용과 프롬프트 주입 방어 수준을 함께 따져 도입 시점을 정해야 한다.

### [Higgsfield takes AI video from 1 minute to over 10](https://openai.com/index/higgsfield-longer-videos-voice)

_OpenAI_

OpenAI가 올린 Higgsfield 고객 사례의 제목은 AI 영상 길이가 1분에서 10분 이상으로 늘었다는 내용이며, 원문 페이지는 직접 열리지 않아(403) 이를 인용한 보도와 검색 요약으로 확인했다. 보도에 따르면 Higgsfield는 GPT-6 Astra를 포함한 OpenAI 모델로 영상 길이를 약 1분에서 10분 넘게 늘렸다고 주장한다. 검색으로 확인된 OpenAI 페이지 발췌에 따르면 공동 창업자 겸 CEO Alex Mashrabov는 GPT-6 Astra 도입 전에는 약 1분이 한계였다고 말하며, 에이전트가 3D 모델링 작업을 위해 외부 도구를 호출할 수 있어 긴 영상의 일관성 문제를 줄인다고 설명한다. Higgsfield는 더 정밀한 시각 표현을 위해 GPT-Image-2.5를, 음성으로 영화를 만드는 방향의 한 걸음으로 GPT-Live를 언급했지만, 보도들은 음성 영화 제작이 완성된 제품이 아니라 앞으로의 방향이라고 전한다. 확인한 자료에는 벤치마크, 가격, 출시 일정이 나오지 않으며 장편 기능이 일반에 제공되는지도 확인되지 않는다.

> 💡 긴 영상 생성의 병목이 모델 길이 한계에서 도구 호출을 낀 에이전트 워크플로 오케스트레이션으로 옮겨 가고 있어, 이런 워크플로를 운영하려면 장시간 실행 작업의 상태 관리와 비용 관측이 중요해진다.

---

## 클라우드 업데이트

### [Under the hood, off the hot path: How D1 scales to millions of databases](https://blog.cloudflare.com/d1-control-plane/)

_Cloudflare_

Cloudflare가 D1 컨트롤 플레인이 수백만 개 데이터베이스를 어떻게 관리하는지 설명했으며, 2026년 10월 8일 기준 살아 있는 DB 수는 1년간 15배, 2년간 65배 늘었고 일일 활성 DB는 1년간 18배 늘었다. 핵심 원칙은 쿼리 같은 핫 패스에 중앙 단일 리전 구성요소를 두지 않는 것이고, 작업을 엣지에서 도는 데이터 플레인, 단일 리전 의존이 허용되는 컨트롤 플레인, 최종 일관성으로 충분한 비동기 플레인으로 나눈다. 각 D1 데이터베이스는 SQLite Durable Object 하나가 담당하고, 라우팅 메타데이터는 Workers KV에, 중앙 메타데이터는 Hyperdrive를 거친 Postgres에 둔다. 각 DO는 30초마다 컨트롤 플레인에 하트비트를 보내 DB 상태와 계정 한도를 동기화하고, 고아 DO를 정리하며 KV 항목을 바로잡는 자가 치유를 수행한다. 저장 용량 한도는 Free 5GB, Workers Paid 1TB이며, 변경 로그를 1초마다 집계해 계정 합계를 갱신하고 ClickHouse가 과금의 기준 데이터가 된다. 일일 행 읽기·쓰기 한도를 넘긴 계정은 Limiter가 ClickHouse에서 찾아 Quicksilver에 만료 키를 쓰고, DO가 엣지에서 이를 확인해 쿼리를 거부한다. 기사는 이를 Postgres는 트랜잭션 메타데이터, ClickHouse는 분석, Workers KV는 전역 복제 라우팅 데이터라는 역할 분담으로 정리한다.

> 💡 핫 패스는 엣지 캐시와 자가 치유 하트비트로 풀고 한도 집행 같은 무거운 일은 비동기 경로로 빼는 설계는, 멀티테넌트 플랫폼에서 컨트롤 플레인 장애가 데이터 플레인으로 번지지 않게 하는 실용적인 참고 모델이다.

### [Cross-cloud conversational analytics made simple with open standards](https://cloud.google.com/blog/products/data-analytics/cross-cloud-conversational-analytics-with-borderless-lakehouse/)

_Google Cloud_

Google Cloud 블로그는 Apache Iceberg REST 카탈로그 규격 기반의 borderless Lakehouse로 Databricks, Snowflake, AWS Glue의 데이터를 복사 없이 BigQuery에서 제자리 조회하는 방법을 소개한다. 기존에는 원격 데이터를 중앙 웨어하우스로 옮기는 추출 파이프라인을 만들어야 했고, 이는 동기화 지연, 반복 저장 비용, 변동하는 네트워크 egress 비용과 스키마 변경에 따른 파이프라인 파손을 낳는다고 지적한다. Lakehouse 런타임 카탈로그는 스키마와 스냅샷 포인터를 사용자가 정한 주기로 동기화하고, 쿼리 시에는 원격 플랫폼이 발급한 임시 자격 증명으로 S3 같은 객체 스토리지의 Parquet 파일을 직접 읽으며, 모든 연산은 BigQuery 또는 Managed Service for Apache Spark에서 처리된다. 예제는 gcloud alpha biglake iceberg catalogs create로 Unity Catalog, Snowflake, Glue 카탈로그를 등록하고, 네이티브 fact_sales 테이블을 세 클라우드의 차원 테이블과 한 쿼리로 조인한 뒤 뷰로 저장해 자연어 대화형 분석에 연결한다. 운영 시 새로 고침 간격은 최소 300초이고 동기화가 길어지면 다음 실행을 건너뛰며, 교차 클라우드 데이터 블록은 카탈로그 리전에 캐시되므로 데이터 거주 정책을 확인해야 한다. 조직이 constraints/gcp.restrictNonCmekServices 제약을 강제하면 BigQuery가 캐시를 우회해 매번 원격 스토리지를 읽으며, objectStorageStats의 cacheBytesRead와 objectStorageBytesRead로 확인할 수 있다.

> 💡 ETL 복제 대신 Iceberg 카탈로그 연합으로 가면 파이프라인 유지 비용은 줄지만, 쿼리마다 발생하는 교차 클라우드 egress와 캐시·CMEK 정책 상호작용을 비용과 규정 준수 관점에서 미리 측정해야 한다.

### [Gemini 4 Argon available on Google Cloud, built to help solve your business’ hardest problems](https://cloud.google.com/blog/products/ai-machine-learning/gemini-4-argon-available-on-google-cloud/)

_Google Cloud_

Google Cloud가 새 프런티어 모델 Gemini 4 Argon을 모든 사용자에게 제공한다고 발표했다. API 모델 ID는 gemini-4-argon이며 Gemini for business, Google AI Studio, Google Antigravity에서도 쓸 수 있다. 가격은 2026년 11월 30일까지 입력 100만 토큰당 2달러, 출력 10달러의 도입가이고 이후 4달러와 20달러로 오르며, 캐시된 입력 토큰은 95% 할인된다. ServiceNow는 NowAI-Bench 초기 접근 평가에서 Gemini 3.8 Flash 대비 작업 성공률이 약 20% 높았다고 밝혔고, Argon은 Vals Index와 Harvey의 Legal Agent Benchmark에서 선두라고 한다. Google 내부에서는 Antigravity를 쓰는 팀의 에이전트 코드 제출이 35% 넘게 늘고 롤백이 거의 3분의 1 줄었으며, Chrome 팀은 4,000만 줄 규모 Chromium 코드베이스에서 수백 개 파일에 걸친 아키텍처 리팩터링을 수 주 만에 끝냈다. 보안 면에서는 CWE-Bench v1에서 68%로 공동 1위이고 Gray Swan 간접 프롬프트 인젝션 벤치마크에서 15회 적응형 공격 시 공격 성공률이 0.7%이며, 공격적 작업은 차단하되 Fairwind Program으로 검증된 방어자에게는 사이버 가드레일 없는 버전을 제공한다.

> 💡 도입가가 11월 30일 이후 두 배가 되므로 에이전트 워크로드의 토큰 비용 모델을 현재 가격으로 확정하지 말고 캐시 적중률을 포함해 다시 산정해야 한다.

### [Rewinding the exponential: How we keep hardware usage down](https://blog.cloudflare.com/rewinding-the-exponential/)

_Cloudflare_

Cloudflare 데이터 팀은 전 세계 네트워크의 데이터를 중앙 데이터센터로 옮기는 파이프라인에서, 트래픽은 지수적으로 늘고 하드웨어는 선형으로만 늘어나는 문제를 5년간의 개선으로 약 2.5년치 하드웨어 증설분만큼 상쇄했다고 설명한다. 2026년 5월 기준 초당 약 20억 건의 이벤트가 흐르며, 2022년에는 제품별 스키마로 분리해 백본 대역폭을 35~40% 줄였고 2024년에는 LZ4에서 zstd로 바꿔 압축 처리량을 거의 40% 낮췄다. 2026년 로드 밸런싱은 모든 비지역 이벤트를 두 리전에 이중 기록하던 방식을 공유 수집 풀과 Buftee 이후 단계의 늦은 복제로 바꿔 순 36 GB/s를 줄였다. 2026년 여름 Logfwdr에 더한 이중 샘플링은 그룹 크기의 제곱근만큼 표본을 뽑아, 데이터가 100배인 키가 저장하는 행을 약 10배가 아니라 약 4배로 억제했고 상위 세 데이터셋에서 약 25 GB/s를 절감했다. 가을에 도입한 파이프라인 내 집계는 HTTP 롤업 데이터셋을 9 GB/s 이상에서 2 GB/s 미만으로 약 80% 줄였다. Ready-Analytics 수신기는 CPU와 메모리 사용이 약 50% 줄어 약 750 CPU와 3.5 TiB 메모리를 되찾았다. 봄부터 가을까지 백본에서 약 70 GB/s를 제거해 처리량은 예상 성장 곡선보다 약 8개월 뒤에 있으며, 2031년 예상 데이터량은 절반으로 줄었다고 한다.

> 💡 대역폭 비용은 압축, 복제 시점 조정, 샘플링, 사전 집계 순으로 데이터 경로 앞단에서 줄일수록 하류의 CPU와 메모리까지 함께 줄어든다.

### [Stopping business email compromise with AI-driven email security: How VIPRE protects modern enterprises on AWS](https://aws.amazon.com/blogs/architecture/stopping-business-email-compromise-with-ai-driven-email-security-how-vipre-protects-modern-enterprises-on-aws/)

_AWS Architecture_

VIPRE Security Group은 AWS 위에 클라우드 네이티브 이메일 보안 솔루션 VIPRE Integrated Email Security를 구축해 비즈니스 이메일 침해(BEC)를 막는다. 글은 스팸 메일의 49%가 BEC 사기라는 VIPRE 데이터를 인용하며, MX 레코드 리디렉션 방식의 보안 이메일 게이트웨이는 내부 트래픽, 횡이동, 스레드 하이재킹을 놓칠 수 있다고 지적한다. 이 솔루션은 보안 API로 Microsoft 365에 연결되어 MX 레코드 변경이 필요 없다. 메일은 S3에 저장되고 SQS에 작업이 등록되며 ECS/Fargate의 무상태 서비스가 처리하고, 정적, 행동, 의미, 맥락 분석을 수행하며 의미 분석에는 NVIDIA GPU 위 ECS에서 도는 커스텀 BERT 모델을 쓴다. 이벤트는 MSK로 발행되어 RDS에 저장되고 변경 데이터 캡처로 OpenSearch에 전달되며 테넌트 ID로 격리된다. 24시간 샘플에서 EU와 북미 프로덕션 517,726건을 스캔해 BEC 시도 5,508건을 탐지했고, 이는 약 1%에 해당한다. P95 지연은 동적 샌드박스 없이 1.4~15초, 전체 샌드박스 분석 시 39~78초이며 하루 50만 건 이상을 처리한다.

> 💡 API 연동 방식의 메일 보안은 MX 변경 없이 도입할 수 있지만, 샌드박스 분석 시 지연이 수십 초로 늘어나므로 사후 회수 흐름을 함께 설계해야 한다.

### [Bulk Executor for Amazon DynamoDB, Part 2: Lessons we learned the hard way](https://aws.amazon.com/blogs/architecture/bulk-executor-for-amazon-dynamodb-part-2-lessons-we-learned-the-hard-way/)

_AWS Architecture_

이 글은 DynamoDB 테이블의 많은 항목에 명령을 실행하는 오픈소스 도구 Bulk Executor를 만들며 겪은 설계 선택과 시행착오를 정리한 2부다. 팀은 SQS와 Lambda, Fargate, EMR, Ray를 검토한 끝에 서버리스 병렬성과 내장 DynamoDB 커넥터를 이유로 AWS Glue를 골랐고, Spark DataFrame 덕분에 find 명령을 거의 공짜로 만들었지만 커넥터가 문자열 집합과 문자열 리스트를 구분하지 못하는 한계가 있었다. Ctrl+C가 로컬 스크립트만 멈추고 Glue 잡은 타임아웃까지 계속 도는 문제는 인터럽트 핸들러가 Glue에 중지를 요청하도록 고쳤고, CloudWatch Live Tail은 초당 500개 이벤트를 넘으면 샘플링해서 큰 출력은 S3에 쓰고 터미널에는 처음 10건과 링크만 보여준다. 변경 명령에는 PITR을 필수로 하고 revert-export로 되돌릴 수 있으며, 커넥터가 삭제를 못 하므로 delete는 batch_writer로 직접 호출하고 이때 생긴 스로틀링은 워커 전체의 분산 레이트 리미터와 XMaxReadRate, XMaxWriteRate 옵션으로 해결했다. 새 scancount 명령은 100개 세그먼트를 병렬로 스캔하며 Select COUNT를 써서 커넥터 기반 count보다 일관되게 빨랐다. Glue 5 이전은 AI가 만든 스트레스 테스트로 한 번의 세션에 끝냈고 Glue 6으로 올린 것은 DPU 시간 비용이 약 30% 낮은 이점을 얻기 위해서이며, 일관성 점검에는 마크다운 규칙 파일 기반의 AI 린터를 쓴다. 프로젝트는 awslabs/amazon-dynamodb-tools의 tools/bulk_executor에 공개되어 있다.

> 💡 대량 작업 도구는 기능보다 중단 처리, 비용 사전 추정, 레이트 제한, 롤백 수단 같은 안전장치가 있어야 운영 중인 테이블에 쓸 수 있다.

### [One Agent Development Kit, five languages](https://cloud.google.com/blog/topics/developers-practitioners/one-agent-development-kit-five-languages/)

_Google Cloud_

Google Cloud 블로그의 Karl Weinmeister는 Agent Development Kit(ADK)가 Python, Go, TypeScript, Java, Kotlin의 다섯 언어를 지원하며 각각 자기 런타임에 맞게 만들어졌다고 설명한다. 모든 언어가 MCP 클라이언트를 포함하고 Agent2Agent(A2A)도 지원해, 서로 다른 언어나 프레임워크의 에이전트가 HTTP로 상호 운용할 수 있다. 시작은 uvx google-agents-cli setup과 agents-cli scaffold create로 하며, Cloud Run, Gemini Enterprise Agent Runtime, GKE용 배포 설정과 A2A 엔드포인트가 담긴 프로젝트가 만들어진다. Go 버전은 약 2 MiB의 distroless 정적 베이스 이미지에 담기고 고루틴은 2 KB 스택으로 시작해 한 인스턴스가 수천 개의 스트리밍 요청을 처리할 수 있으며, Python 다음으로 ADK 2.0 Graph Workflow 런타임을 제공한다. TypeScript는 Zod 스키마를 쓰고 WebMCP와 Chrome의 온디바이스 Prompt API로 브라우저 탭에서 실행할 수 있다. Java는 Spring AI와 LangChain4j 브리지를 제공하고, Kotlin은 KSP로 빌드 시점에 도구 스키마를 생성해 Android R8 축소를 견디며 LiteRT-LM과 ML Kit 위에서 네트워크 없이 기기 안에서 에이전트 루프를 돌릴 수 있다.

> 💡 MCP와 A2A가 공통 계층이므로 에이전트 런타임을 조직 전체에서 하나로 통일할 필요 없이, Cloud Run의 고동시성 서비스는 Go로 두는 식으로 컴포넌트별로 선택해도 된다.

### [What’s old is new: Lightwell discovers novel zero-day vulnerability in core Java framework](https://www.redhat.com/en/blog/whats-old-new-lightwell-discovers-novel-zero-day-vulnerability-core-java-framework)

_Red Hat_

Red Hat 블로그는 오래 운영 환경에서 문제없이 돌았으니 안전하다는 통념과 달리, 수십 년 된 기반 코드에도 새로운 취약점이 남아 있다고 주장한다. Red Hat의 Lightwell 팀은 Eclipse Implementation of Jakarta XML Binding(JAXB)에서 CVE-2026-92877로 식별된 새로운 취약점을 찾았다. 글에 따르면 고급 AI 보안 도구는 이런 깊은 계층을 건너뛰지 않고, 일반 정적 분석 도구가 놓치는 구조적 파싱 로직의 제로데이를 찾아낸다. 방치하면 파싱 버그가 다른 취약점과 연쇄되어 권한 상승이나 임의 코드 실행으로 이어질 수 있고, 변형된 페이로드가 예외나 자원 고갈을 일으켜 서비스를 멈출 수 있으며, JAXB가 수천 개 엔터프라이즈 패키지 깊숙이 들어 있어 하위 벤더가 노출 사실을 늦게 안다고 설명한다. Lightwell은 수정을 eclipse-ee4j 커뮤니티에 업스트림으로 기여했고, 이 패치가 업스트림에 받아들여진 것을 이정표로 꼽는다. 업스트림이 더 이상 유지하지 않는 구버전에 대해서는 보안 패치를 백포트해 강제 업그레이드 없이 워크로드를 보호한다고 밝힌다.

> 💡 컨테이너 이미지 스캔으로 알려진 CVE만 걸러서는 JAXB 같은 깊은 의존성의 신규 취약점에 대응할 수 없으므로, SBOM으로 전이 의존성을 추적하고 구버전 백포트를 제공하는 공급자를 선택 기준에 넣어야 한다.

### [How AI is defining the ‘new’ architect](https://www.redhat.com/en/blog/how-ai-defining-new-architect)

_Red Hat_

Red Hat의 Idan Henik은 AI와 자율 에이전트가 코드와 인프라 생성을 자동화하면서 아키텍트의 가치가 기술 청사진 보유에서 AI 생성 시스템의 비즈니스·운영 결과를 통제하는 쪽으로 옮겨간다고 주장한다. 이 새 역할을 'Cognitive Architect'라 부르며, 판단력, 기업 맥락, 플랫폼 사고, 거버넌스를 결합한 모습으로 그린다. 일곱 가지 이유 중에는 프롬프트 기반 바이브 코딩이 레거시 의존성, 컴플라이언스, 비용 한도를 모른 채 위험을 만든다는 점과, 프로덕션 AI에서 GPU 부족, 토큰 경제성, 추론 지연, 멀티 테넌트 격리가 중요해진다는 점이 있다. 거버넌스는 인식, 이해, 수용, 책임의 4단계 A-framework로 제시하고, Policy as Code와 OpenShift AI, human-in-the-loop 의사결정 틀을 수단으로 든다. 자동화로 주니어의 디버깅 경험이 사라지면 조직의 인지 퇴화가 올 수 있다며 주니어와 시니어 아키텍트 간 적대적 코드 리뷰 방식의 'Code-as-a-Textbook'을 대안으로 낸다. 글은 Red Hat Consulting의 서비스를 소개하는 성격이며 고객 사례나 외부 통계는 담고 있지 않다.

> 💡 AI가 만든 인프라가 빨라질수록 Policy as Code 같은 자동 가드레일을 파이프라인에 먼저 심는 것이 플랫폼 팀의 핵심 과제가 된다.

### [Filter, reshape, and redact logs before export with Transformers](https://blog.cloudflare.com/transformers-on-logpush/)

_Cloudflare_

Cloudflare Logpush에 Transformers가 추가되어, 로그를 외부로 내보내기 전에 SQL로 필터링·마스킹·재구성할 수 있다. 각 Transformer는 하나의 Logpush 데이터셋을 대상으로 한 SQL 쿼리이며, WHERE 절로 레코드를 걸러내고 SELECT 결과가 내보내는 레코드가 되고, 필드 추가·이름 변경·삭제·중첩과 값 마스킹이 가능하다. 입력과 출력은 모두 NDJSON이고, 호환되는 NDJSON Logpush 작업에 붙이며 수정할 때마다 새 버전이 생기고 대시보드의 Transformer Studio나 API로 관리한다. 구현은 Go로 작성된 전송 서비스 Bufstream 안에서 Apache DataFusion(Rust)이 Apache Arrow 데이터에 SQL을 실행하는 방식이고, Workers의 WebAssembly 방식은 네트워크 호출 때문에 타임아웃과 재시도가 늘어 배제했다. 합성 벤치마크에서 http_requests 5,000행 배치를 고루틴 하나로 약 3ms에 처리해 초당 약 160만 행이며, Bufstream은 초당 1억 1천만 건 이상의 Logpush 레코드를 전달한다. 변환이 실패하면 오프셋을 올리지 않고 변환되지 않은 배치도 보내지 않은 채 재시도하는 fail-closed 방식이며, 오래 실패하는 작업은 자동으로 비활성화된다. Free, Pro, Business, Enterprise 플랜에서 쓸 수 있다.

> 💡 로그를 SIEM이나 스토리지로 보내기 전에 소스 쪽에서 개인정보를 마스킹하고 헬스체크 노이즈를 제거하면 수집 비용과 컴플라이언스 부담을 함께 줄일 수 있다.

### [Developer-first innovation: Reducing technical debt with Red Hat Enterprise Linux](https://www.redhat.com/en/blog/developer-first-innovation-reducing-technical-debt-red-hat-enterprise-linux)

_Red Hat_

Red Hat의 Louis Imershein이 쓴 이 글은 개발자는 도구 선택의 자유를, 경영진은 보안과 안정성을 원한다는 긴장에서 출발해 소수의 엔터프라이즈 OS로 표준화하는 것을 권한다. 팀마다 OS 배포판이 다르면 개발자가 스프린트 시간을 인프라 관리에 쓰게 되고, 기본 OS 계층을 직접 유지하면 시니어 엔지니어가 무급 OS 관리자가 되는 DIY 유지보수 세금이 생긴다는 논지다. RHEL은 호환성을 깨지 않는 백포트 보안 수정을 제공하고, Red Hat Developer Subscription for Teams는 개발, CI/CD 테스트, 스테이징 인스턴스에 비용을 받지 않으며 프로덕션 워크로드와 일부 내부 도구에만 과금한다고 한다. image mode for RHEL은 bootc 기반으로 OS 전체를 Git에 둔 하나의 Containerfile로 정의하는 OS as Code 방식이고, 읽기 전용 불변 이미지와 실패 시 이전 이미지로 롤백하는 원자적 업데이트로 구성 드리프트와 MTTR을 줄인다고 설명한다. 공급망 쪽에서는 Red Hat Hardened Images, Red Hat Trusted Libraries를 소개하고, 보안 게이트에서는 CIS Level 2 사전 인증 프로파일, SELinux, FIPS 140-2/3을 내세운다. 로컬 환경으로는 Red Hat build of Podman Desktop과 Red Hat Desktop의 에이전트 샌드박스 도구 kaiden, 그리고 RHEL에 포함된 Red Hat Lightspeed를 언급한다.

> 💡 OS를 컨테이너 이미지로 정의해 CI에서 빌드한 이미지를 그대로 운영에 올리는 방식은 노드 패치와 롤백을 일반 배포 파이프라인으로 끌어들이지만, 그 이점은 벤더 락인과 구독 구조를 감수할 만한지 따져 봐야 한다.

---

## DevOps & 인프라

### [Honeycomb Is Hiring a New VP of Engineering](https://www.honeycomb.io/blog/honeycomb-hiring-vp-engineering)

_Honeycomb_

Honeycomb이 Charity Majors의 블로그 글로 신임 VP of Engineering 채용을 공고했으며, 블로그에 채용 공고를 올리는 것은 처음이라고 밝혔다. 9년 넘게 엔지니어링을 이끈 Emily Nakashima가 운영 역할로 옮기며, 신임 VP는 SVP Product인 Graham Siener와 함께 R&D를 이끈다. 회사는 원격 우선에 약 300명 규모이고 그중 엔지니어링이 85명이며, 이 자리는 CEO에게 보고하는 경영진 구성원이다. 주요 책임은 제품·기술·시장 방향에 대한 전략 수립, 경영진 정렬, 변화에 대한 조직 내 설명, 기존 매니저와 IC를 이끄는 일, 그리고 최근 12개월 안에 AI로 직접 소프트웨어를 만들어 배포한 기술적 신뢰성이다. 필수 조건으로 제품과의 파트너십, 제품-시장 적합성 이전 제품에 대한 위험 감수, AI 중심의 실무 경험을 꼽았다. 선호 조건은 수백 명 이상 조직을 이끈 경험, 전체 엔지니어링 총괄, 경영진 경험이며, 일부만 충족해도 지원을 권장하고 지원은 Greenhouse 채용 페이지로 받는다.

> 💡 관측성 벤더가 에이전트 기반 로드맵과 AI 실무 경험을 엔지니어링 리더의 핵심 요건으로 내건 것은, 관측성 도구 선택 시 AI 워크로드 대응 방향을 함께 살펴봐야 한다는 신호다.

### [GitHub’s model for secret detection: Finding more secrets with less noise](https://github.blog/ai-and-ml/githubs-model-for-secret-detection-finding-more-secrets-with-less-noise/)

_GitHub_

GitHub가 일반(generic) 시크릿 탐지를 위해 문맥 인식 분류기를 도입했고, 이전 LLM 파이프라인 대비 소유자 가중 수락률이 11.5% 오르고 푸시 후 스캔 중앙값 실행 시간이 86% 줄었다고 밝혔다. 서빙 비용은 원격 LLM 호출보다 98% 넘게 낮고, 오프라인 평가에서 정밀도 13%, 재현율 19% 향상을 보였다. 구조는 두 단계로, 먼저 높은 재현율의 정규식으로 후보를 만들고 그다음 미세조정한 ModernBERT 모델이 후보 값, 파일 경로, 시크릿 유형, 주변 텍스트를 보고 실제 시크릿일 가능성을 점수화한다. 프로덕션 DB URL 옆 비밀번호와 테스트 픽스처의 같은 값, 또는 API 자격 증명과 체크섬·빌드 ID·에셋 해시처럼 문법은 같고 문맥만 다른 경우를 구분하는 것이 핵심 문제였다. 학습 데이터는 GitHub 저장소의 제품 피드백과 사람 검증, 정규식 후보에 대한 사람 주석과 약한 레이블, 그리고 문서·테스트 픽스처·공개 키·체크섬 등을 겨냥한 합성 예제로 구성했다. 모델은 8비트 양자화한 ONNX로 내보내 서빙하며, 스캔 시간이 줄어 일반 시크릿 탐지를 푸시 보호로 확장하는 것이 현실적이 되었다. 향후에는 프로덕션 피드백으로 학습 데이터를 개선하는 선순환과, 탐지와 추출을 한 번에 하는 새로운 아키텍처를 탐색한다.

> 💡 저렴한 정규식 후보 생성 뒤에 작은 미세조정 분류기를 두는 방식은 호출당 LLM 비용 없이 시크릿 스캔 노이즈를 줄일 수 있음을 보여주며, 파이프라인과 온콜 엔지니어의 알림 분류 부담에 직접 영향을 준다.

### [Anthropic’s red team ran AI on 15 cheap TV boxes. Then the math got unsettling.](https://thenewstack.io/self-replicating-ai-worms/)

_The New Stack_

Anthropic Frontier Red Team은 약 825달러로 저가 안드로이드 TV 박스 15대를 묶어 초당 0.39토큰으로 AI 모델을 돌리는 클러스터를 만들었다. 챗봇으로는 너무 느리지만 기다리는 사람이 없는 소프트웨어에는 충분하다는 설명이다. 이 실험은 William Zhou와 Daniel Freeman의 연구의 출발점으로, 소규모 오픈 웨이트 모델이 데이터센터 없이 저가 인터넷 연결 기기로 스스로 복제하는 시점이 몇 달 앞일 수 있다고 시사한다. 다만 공용 인터넷에서 스스로 퍼지는 AI 웜을 만든 것은 아니고, 실험은 복제를 쉽게 하는 지름길이 있는 통제된 환경에서 진행됐다. 연구진은 복제를 대상 찾기, 접근 권한 획득, 추론 실행, 다음 기기로 이동의 네 단계로 나누며 낯선 하드웨어에서 추론을 띄우는 것이 가장 큰 장벽이라고 본다. Qwen3.5-9B는 Jetson Nano, Mac, RTX 4090을 포함한 9개 하드웨어 유형 중 8개에서 Llama3.1-8B 추론 서버를 띄웠고, 8노드 구글 클라우드 안드로이드 에뮬레이터 환경에서 GLM-5.2는 5번 중 4번 8개 노드 전체에 도달했다. 이전 시도의 메모를 읽을 수 있게 하자 Qwen3.5-9B의 성공률이 1세대 45%에서 이후 세대 61~84%로 올랐고, 연구진은 이를 라마르크식 유전이라 부른다.

> 💡 추론 서버를 낯선 기기에 스스로 설치하는 능력이 병목이라면, 방어 쪽에서는 IoT·엣지 기기의 아웃바운드 트래픽과 대용량 모델 전송을 보는 네트워크 관측성이 첫 방어선이 된다.

### [Meta’s Generative Ads Model (GEM): Scaling the Central Model and Compute Engine for Frontier Ads AI](https://engineering.fb.com/2026/10/13/ml-applications/generative-ads-model-gem-scaling-frontier-ads-ai/)

_Meta Engineering_

Meta가 광고 추천용 파운데이션 모델 GEM의 2026년 세대를 공개했으며, Facebook, Instagram, Reels 등 도메인별로 나뉘어 있던 모델을 모든 광고 플랫폼의 데이터와 신호로 학습하는 단일 중앙 모델로 옮겼다. 보고된 성과는 전환 18.9% 개선과 클릭률 12% 개선이며, 지난 1년간 타깃 사용자 전환 증가는 Facebook 5.8%, Instagram 4.1%, 오프사이트 1.6%다. 모델 복잡도는 이전 GEM 대비 2.5배로 커졌고 아키텍처 Kunlun은 이전 Interformer보다 같은 연산 규모에서 2배 성능을 낸다고 한다. Block Attention과 GDPA는 GPU 커널에 맞춘 설계이며 GDPA는 순전파를 최대 2배 빠르게 하고, CompSkip은 품질 손실을 거의 없이 FLOPS를 43% 줄인다. 하위 모델로의 지식 전달은 LoopFM이 기존 지식 증류 대비 두 배의 전달 효과를 내고, Solaris는 추측 디코딩에서 착안해 사용자-광고 임베딩을 비동기로 미리 계산한다. 총 학습 FLOPs는 4배로 늘었고 수천 개 GPU에서 종단 간 학습 효율은 두 배로 올라 모델 FLOPS 활용률 20~25%에 이르렀으며 MXFP8 저정밀 학습과 5D 병렬화를 썼다. 앞으로는 텍스트·이미지·영상을 아우르는 학습, LLM 규모의 긴 컨텍스트, 후훈련에서의 추론 능력 추가를 계획한다.

> 💡 Meta의 학습 효율 2배는 커널, 정밀도, 병렬화, 네트워크, 메모리를 함께 최적화한 결과라는 점에서, 대규모 GPU 클러스터 비용 절감은 단일 레이어 튜닝이 아니라 스택 전체 공동 최적화에서 나온다는 사례다.

### [Gemini 4 Argon debuts with a unified 1M input/output token limit](https://thenewstack.io/gemini-4-argon-live/)

_The New Stack_

Google은 화요일 플래그십 모델 Gemini 4 Argon을 Google AI Studio를 통한 Gemini API 유료 티어 개발자에게 공개했고, 모델은 9월 30일에 발표됐으며 처음에는 Fairwind 프로그램의 선별된 사이버 방어자 등 신뢰된 테스터에게만 열려 있었다. 11월 30일까지 도입 가격은 입력 100만 토큰당 2달러, 출력 100만 토큰당 10달러이고 그 이후에는 4달러와 20달러로 올라 Claude Opus 5.5와 같아지며, 도입 기간 캐시 입력 토큰은 95% 할인된다. 같은 기간 가격은 Claude Fable 5.1과 GPT-6 Astra의 목록가(10달러, 50달러)의 5분의 1이다. 입력과 출력을 합쳐 100만 토큰이라는 단일 예산이 핵심 변경점으로, 9월 30일 발표에서는 출력 상한 100만 토큰이라고 했던 것과 달라졌다. 그래서 80만 토큰의 코드를 넣으면 응답에는 20만 토큰만 남고, Claude Opus 5.5는 100만 컨텍스트에 별도 출력 상한 12만 8천 토큰을 둔다. 호출은 Interactions API에서 gemini-4-argon으로 하며 Antigravity는 Ultra 구독자와 일부 Gemini Enterprise 플랜에만 열려 있다. Google은 ERQA 87%, Artificial Analysis Intelligence Index 53을 제시했으나 Bloomberg는 일부 직원이 프런트엔드 코딩에서 어려움을 겪는다고 보도했고 Google은 이를 부인했다.

> 💡 입력과 출력이 하나의 100만 토큰 예산을 나눠 쓰므로 긴 컨텍스트 에이전트는 프롬프트 크기에 따라 응답 여유가 줄어들고, 11월 30일 이후의 가격 인상까지 반영해 비용 모델을 다시 세워야 한다.

### [The agent did the work. The audit log couldn’t say who asked.](https://thenewstack.io/ai-agent-credentials-identity-provider/)

_The New Stack_

Shawn Petty 팀이 고객 및 잠재 고객 환경에서 검토한 MCP 관련 접근 정책의 20% 이상이 깨졌거나 누락되어 있었다고 The New Stack에 실린 글이 전한다. 대부분의 경우 MCP 서버는 서비스 계정이 아니라 누군가의 개인 토큰으로 실행되고 있었다. 개인 토큰을 쓰면 에이전트가 한 모든 일에 엔지니어 개인의 이름이 감사 추적에 남고, 공유 서비스 계정을 쓰면 그 계정 이름이 남아서 어느 쪽이든 누가 에이전트에게 일을 시켰고 누가 접근을 승인했는지는 알 수 없다. 글은 IdP에서 요청, 승인, 부여를 거친 접근은 프로비저닝된 것이라 IdP가 기록하지만, 에이전트가 실행 중에 얻는 접근은 창발적이라 IdP에 기록이 없다고 구분한다. 예로 에이전트를 띄운 서비스에서 물려받은 역할이나 개발자가 빌려준 개인 토큰이 있다. 이 글은 CloudBolt의 Shawn Petty(최고고객책임자)와 Mike Bombard가 10월 27일 오후 12시(미 동부)에 The New Stack의 Viktor Farcic과 진행하는 라이브 데모 웨비나의 안내문이며, 에이전트 활동을 기존 IdP에 연결하고 에이전트가 건드릴 수 있는 범위를 제한하며 결과 감사 추적을 읽는 방법을 보여 준다.

> 💡 에이전트용 MCP 서버를 개인 토큰이나 공유 서비스 계정에 올리는 순간 감사 로그에서 요청자가 사라지므로, 에이전트에도 IdP를 거치는 요청-승인-부여 경로와 별도 ID를 줘야 한다.

### [디자이너의 아이디어가 금융상품이 되기까지](https://toss.tech/article/rpg-savings)

_토스_

토스뱅크 Product Designer 장서영이 기존 '키워봐요 적금'을 개편한 '키워봐요 31일적금'이 디자이너의 아이디어에서 금융상품이 되기까지의 과정을 공유한다. 출발점은 토스뱅크 디자인 챕터의 OOTB(Out of the Box) 시간이었고, 기존 상품은 자동이체만 걸어두면 캐릭터가 자라 앱을 열 이유가 없다는 문제가 있었다. 우주선 수리 같은 게임 세계관은 저금과 연결고리가 없어 접고, 매일 다른 스토리와 다양한 엔딩이라는 재방문 장치를 '키우기' 컨셉에 붙였다. 보상 구조는 PO와 같은 비용 안에서 검토해 매일 5,000원 저금 시 연 10%로 확정했고, 사용자 테스트에서는 예적금 경험이 적은 사용자가 캐릭터 육성 방식에 비교적 긍정적이었다. 팀 설득을 위해 DA와 데이터를 분석해, 예적금을 가진 사용자일수록 앱에 자주 들어오고 통장만 쓰는 사용자가 많다는 점을 근거로 이 상품을 예적금 입문 상품으로 자리매김했다. 결과적으로 가입자의 절반은 한 달 중 3주 이상 저금하고 5명 중 1명은 31일을 하루도 빠짐없이 저금하며, 끝까지 키운 사용자가 다시 새 캐릭터를 키우러 돌아오는 경우가 많다.

> 💡 경험 개선 아이디어는 사용자 가치만으로 출시되지 않고 비용 구조와 데이터로 팀의 목표에 연결할 때 제품이 되며, 이는 내부 플랫폼이나 개발자 도구 제안에도 그대로 적용된다.

### [서비스 개발에 집중할 수 있는 AI 플랫폼 만들기](https://toss.tech/article/ai-platform-foundation)

_토스_

토스 AI Platform 팀이 서비스 팀마다 반복되던 모델 연동, 권한 확인, 사용량 집계, 장애 원인 파악을 플랫폼이 대신 맡도록 만든 구조를 소개한다. 구성 요소는 모델 사용 신청과 가격·성능 비교를 맡는 GenAI Portal, 인증·권한·사용량 한도·가드레일·공급자 어댑터를 처리하는 LLM 게이트웨이 GenAI Gateway, 사내 도구 실행 권한을 호출마다 확인하는 MCP Gateway, 사내 GPU 모델 서빙 플랫폼 Toss Dynamo, 트레이싱용 Langfuse 등이다. 권한·비용·사용량은 프로젝트 단위로 묶고, 외부 모델 호출 전에 프롬프트 공격과 개인정보를 검사하며 로그에서는 개인정보 영역을 마스킹한다. 예산은 누적 비용으로, 요청 수용은 분당 토큰 수(TPM) 등 한도로 따로 제어하고, 미리 확보한 처리 용량(PTU)을 먼저 쓰다가 부족하면 같은 모델의 종량제(PAYG) 경로로 넘어간다. 데이터는 L1~L4 4단계, 운영 수준은 High·Standard·Flex 3단계 SLA 등급으로 나누며, 등급만으로 사용을 허가하지 않고 목적·실행 환경·모델을 함께 검토한다. 금융 서비스라 혁신금융서비스 허용 범위에 맞는지도 담당 조직이 확인한다. 글에는 성능이나 비용 절감 수치가 없고, 모델 응답 품질과 비용을 함께 개선하는 평가 기준은 다음 글에서 다루겠다고 예고한다.

> 💡 LLM 게이트웨이에서 예산(누적 비용)과 처리 용량(TPM)을 분리하고 PTU 우선 후 PAYG로 넘기는 구조는 사내 AI 플랫폼의 비용·가용성 통제 설계에 그대로 참고할 만하다.

### [How Datadog defines service criticality at scale](https://www.datadoghq.com/blog/how-datadog-defines-service-criticality-at-scale/)

_Datadog_

Datadog은 서비스가 중단되거나 느리거나 잘못된 결과를 낼 때 고객이 받는 영향만을 기준으로 내부 서비스의 중요도를 분류하는 시스템을 소개한다. 각 서비스는 high, low, unknown 중 하나의 등급과 근거의 양을 나타내는 종합 신뢰도 점수를 받으며, medium은 신호가 늘면 추가할 계획이다. 신호는 SEV-1/SEV-2 포스트모템에서 LLM이 추출한 인시던트, APM·RUM 에러 트레이스, 프로덕션 트래픽, 서비스에 태그된 모니터이며, 트래픽은 등급을 낮추는 데만 쓰이고 온콜을 호출하는 모니터는 등급을 올린다. 인시던트 파이프라인은 수천 건 중 수백 건의 포스트모템을 하루 안에 약 32달러로 처리했고, 추출된 서비스명은 Software Catalog와 대조하고 두 번째 모델이 재검토했다. 독립된 두 신호가 일치하면 더 강한 근거로 보고, 반대 신호는 등급을 바꾸지 않고 신뢰도만 낮추며, 서비스 소유자는 사유를 달아 등급을 덮어쓸 수 있다. 활용 사례는 비핵심 서비스를 데이터센터에 단계적으로 더 빨리 배포하는 것과 낮은 등급 서비스의 의존성 업데이트 자동 병합이다. 한계로는 장애가 없던 안정 서비스는 인시던트 신호에 안 잡히는 점, 트래픽이 적어도 핵심 사용자 여정에 있을 수 있는 점, 의존성 매핑이 아직 개발 중인 점을 든다.

> 💡 서비스 중요도를 사람이 매기지 않고 인시던트·트레이스·모니터에서 파생해 신뢰도와 함께 API로 노출하면, 배포 속도와 자동 병합 범위를 서비스별로 안전하게 차등할 수 있다.

### [Make every AI credit count: See, cap, and reduce agent spend](https://about.gitlab.com/blog/make-every-ai-credit-count/)

_GitLab_

GitLab의 Allie Holland는 에이전트에 일을 맡길 때마다 비용이 늘어나므로 지출을 보고, 상한을 두고, 낭비를 줄여야 한다고 주장한다. 첫째 수단은 작업에 맞는 모델 선택으로, GitLab 19.4에서 Duo Agent Platform에 GitLab 관리형 오픈 웨이트 모델 GLM 5.3, Kimi K3, MiniMax M3가 정식 제공되고, GitLab 내부 벤치마크 기준 작업 완료율은 비교 모델과 같으면서 비용이 각각 Claude Opus 5의 약 5분의 1, Claude Fable 5.1의 3분의 1, GPT-5.5의 8분의 1이라고 한다. 둘째는 코드, 작업 항목, MR, 파이프라인, 배포, 보안 발견을 잇는 지식 그래프 GitLab Orbit으로, GitLab 테스트에서 같은 작업의 재시도가 최대 45배 줄고 올바른 컨텍스트를 얻는 토큰이 4.5배 적었다고 한다. 셋째는 측정과 한도로, Impact Analytics가 팀·작업·모델별 지출을, GitLab Credits 대시보드가 사용자·세션 단위 사용량을 보여 주고, 구독·그룹·사용자 단위 상한과 50%, 80%, 100% 알림, 상한 도달 시 자동 중지를 설정할 수 있다. 예시는 사용자당 월 1,000 크레딧 상한에 실험하는 엔지니어에게 500 크레딧을 추가하는 개별 예외다. 오픈 웨이트 모델과 크레딧 제어는 정식 출시, Orbit은 GitLab.com 무료 베타로 다음 달 GA 예정, Impact Analytics는 얼리 액세스다.

> 💡 에이전트 비용은 모델 단가보다 재시도와 컨텍스트 탐색 낭비에서 커지므로, 상한과 알림을 먼저 걸고 루틴한 워크로드부터 저가 모델로 고정해 사용자·팀별 지출을 비교해야 한다.

### [GitLab's agent orchestration eliminates the wait between development stages](https://about.gitlab.com/blog/gitlab-agent-orchestration/)

_GitLab_

GitLab은 GitLab Transcend에서 Duo Agent Platform의 에이전트 오케스트레이션 기능을 발표했으며, 글쓴이는 Elisabeth Burrows다. AI가 코드 작성 속도는 높였지만 병목이 리뷰 승인, 파이프라인 알림, 스캔 분류, 단계별 프롬프트 같은 검증·리뷰·배포 단계로 옮겨갔다는 문제의식이다. 첫째 구성 요소인 목표 기반 플로우는 목표와 완료 기준을 적으면 리뷰, 테스트, 보안 스캔, 승인을 거쳐 실행되고, 별도 모델이 매 단계마다 목표 대비 결과를 점검하며 언제든 중단하거나 방향을 바꿀 수 있다. 시작은 Duo CLI의 `/goal`, 헤드리스 모드의 `duo run --goal`, Agentic Chat에서 한다. 둘째 GitLab for Slack은 @GitLab 멘션으로 실패한 파이프라인 수정 같은 플로우를 시작하고 진행 상황을 스레드로 받는다. 셋째 Custom Flows는 다단계 에이전트 순서를 한 번 정의해 멘션, 할당, 파이프라인에서 시작하며, 실패한 테스트를 분석해 수정 커밋 후 알리는 자가 치유 파이프라인이 예시다. 모든 플로우는 GitLab의 기존 ID, 정책, 증적 체계 아래 돌며, 목표 기반 플로우는 Premium·Ultimate에서 GitLab 19.3 이상, Duo CLI 9.17.0 이상이 필요하다.

> 💡 에이전트가 CI/CD 파이프라인 안에서 자가 치유까지 수행하게 되면, 자동 수정 커밋의 권한 범위와 사람 승인 지점을 파이프라인 정책으로 미리 설계해 두는 것이 중요하다.

### [The “alien” economics of AI monetization](https://stripe.com/blog/economics-of-ai-monetization)

_Stripe_

Stripe의 James Brown은 300명 이상이 참석한 두 번째 Monetize 컨퍼런스의 논의를 정리하며, Metronome CEO Scott Woody가 선도 AI 기업의 운영 방식을 SaaS와 비교해 '외계인' 같다고 표현했다고 전한다. 이들은 가격 실험이 빠르고 ARR보다 시장 점유율을 우선하며 여러 판매 전략을 동시에 쓴다. Forbes AI 50 기업의 3분의 2가 어떤 형태로든 사용량 기반 요금을 쓰지만, 사용량 과금이 구독을 대체하기보다 구독이 변동 사용량을 크레딧으로 묶는 하이브리드 모델이 자리 잡고 있다. Fin(Intercom)은 해결된 지원 대화당 과금에서 시작해 과금 가능한 결과 유형을 늘렸고, Replit은 에이전트 체크포인트당 25센트 과금이 실제 비용과 벌어지자 사용량 기반으로 옮겼다가 예측 불가능한 지출 문제로 속도 제한이 있는 무료 모드와 단순 구독을 도입했다. 예측 가능성도 제품 기능이어서 Snowflake의 예측 도구와 계산기, Stripe가 말하는 알림과 지출 한도가 있는 사용량 제어판이 사실상 표준이 되고 있다. 또 Kyle Poyar가 AI 엔진 6개에서 받은 응답 7,600건을 분석한 결과, 가격이 명확히 공개되지 않으면 LLM이 Reddit 같은 출처를 끌어와 월 사용자당 100~2,400달러로 24배 편차가 났다.

> 💡 AI 서비스를 운영하는 팀은 크레딧 풀과 사용량 알림·한도를 과금 구조의 일부로 설계해야 하고, 가격 정보도 크롤러와 에이전트가 읽을 수 있게 공개해야 한다.

### [OCP Summit 2026: Powering AI with Open Innovations in Scale-Up, Scale-Out, and Scale-Across Networks](https://engineering.fb.com/2026/10/12/open-source/ocp-summit-2026-powering-ai-with-open-innovations-in-scale-up-scale-out-and-scale-across-networks/)

_Meta Engineering_

Meta는 2026 OCP 글로벌 서밋에서 AI용 개방형 네트워킹 인프라를 scale-out, scale-across, scale-up으로 나눠 공개했다. 첫 액체 냉각 네트워크 랙 IcePack과 128x800G, 102.4Tbps 스위치 블레이드 IceCube가 나왔고, Broadcom Tomahawk6C 또는 NVIDIA Spectrum-6 ASIC 위에서 Meta의 오픈소스 NOS인 FBOSS와 OCP SAI로 동작하며 51.2T 플랫폼 대비 2배 대역폭이다. scale-out용 Flattened Planar Fabric은 GPU마다 100G 링크 8개를 서로 다른 스위치 8대에 연결해 3계층 Clos를 2계층으로 줄이고, NIC가 패킷을 8개 플레인에 분산하며 NVIDIA Spectrum-X Multiplane과 함께 개발했다. scale-across에서는 Backend Aggregation(BAG) 슈퍼스파인이 여러 건물·캠퍼스·리전의 패브릭을 하나의 클러스터로 묶고, 리전 간 용량은 초당 수십 페타비트에 이른다. scale-up에서는 MTIA 300용 이더넷 스위치 Tahan(Tomahawk 5 기반, 가속기당 6.4Tbps)이 이미 출하 중이며, 미리 공개한 216x400G 차세대 블레이드 8개가 랙당 72개 가속기를 연결하며, 이 블레이드의 향후 세대는 OCP ESUN을 스케일업 데이터 플레인으로 채택할 계획이다. Meta가 OCP 안에서 출범시킨 ESUN은 AMD, Arista, ARM, Broadcom, Cisco, HPE, Marvell, Microsoft, NVIDIA와 함께 개방형 사양을 발전시키고, Meta, Microsoft, Alibaba가 이끄는 OSPA는 SAI 아래 스위치 플랫폼 계층 표준 v1.0을 OCP에 제출했다. 또한 FBOSS 자체 온보딩 문서와 오픈소스 RDMA 전송 MetaRoCE도 공개한다.

> 💡 스위치 OS(FBOSS)·플랫폼(OSPA)·전송(MetaRoCE)까지 개방형으로 표준화되면 AI 클러스터 네트워크도 벤더 종속 없이 소프트웨어처럼 운영하고 관측할 여지가 커진다.

### [GitHub Copilot app for Beginners: How to teach Copilot about your codebase](https://github.blog/ai-and-ml/github-copilot/github-copilot-app-for-beginners-how-to-teach-copilot-about-your-codebase/)

_GitHub_

GitHub 블로그의 'GitHub Copilot app for Beginners' 시리즈 글로, Christopher Harrison가 저장소에 프로젝트 지식을 담아 Copilot이 자동으로 읽게 만드는 네 가지 방법을 설명한다. 첫째, 커스텀 지침은 저장소 전체 규칙을 `.github/copilot-instructions.md`에, 경로별 규칙을 `.github/instructions`에 두고 `applyTo` 필드로 적용 대상을 지정한다. 둘째, 에이전트 스킬은 지침과 스크립트를 담은 폴더로 `.github/skills` 아래에 두며, 예로 `quality-checks/SKILL.md`에 테스트·린트 스크립트와 실패 대응법을 적을 수 있다. 셋째, 커스텀 에이전트는 `.github/agents`의 프로필로 목적·지침·도구·컨텍스트를 정의하며, 접근성 리뷰처럼 여러 파일에 걸친 반복 작업에 맞다. 넷째, MCP 서버는 Copilot을 저장소 밖의 도구와 데이터에 연결하며, Playwright MCP 서버를 쓰면 Copilot이 브라우저에서 앱을 직접 열어 UI 동작을 확인한다. 글은 먼저 하나의 컨벤션을 `.github/copilot-instructions.md`에 추가해 보라고 권하고, 커뮤니티 자료 모음인 Awesome Copilot을 참고 자원으로 소개한다. 별도의 제한사항이나 벤치마크 수치는 다루지 않는다.

> 💡 지침·스킬·에이전트 정의를 저장소에 버전 관리되는 파일로 두면 팀의 AI 코딩 컨벤션을 코드 리뷰와 PR 흐름으로 관리할 수 있고, MCP 서버를 붙일 때는 접근 권한 범위를 별도로 점검해야 한다.

### [Shipping Media Over QUIC at Meta Scale for Instagram Live Ingest](https://engineering.fb.com/2026/10/12/video-engineering/shipping-media-over-quic-at-meta-scale-for-instagram-live-ingest/)

_Meta Engineering_

Meta는 Instagram Live의 iOS·Android 라이브 영상 인제스트에 IETF 표준 전송 프로토콜인 Media over QUIC(MoQ)를 적용했다고 밝혔다. 기존에는 약 10년 가까이 RTMP를 대체해 온 Meta 자체 QUIC 기반 프로토콜 RUSH를 썼고, MoQ는 그 후속에 해당한다. 클라이언트는 오픈소스 MoQ 라이브러리 moxygen과 Meta의 QUIC 스택 mvfst를 쓰며, 설정 값 하나로 방송마다 MoQ와 RUSH를 고를 수 있다. 엣지에서 MoQ 프레임을 RUSH 형식으로 변환하는 임시 계층을 둬 백엔드는 바꾸지 않았고, 서버 측 스트림 URL 생성으로 실험군을 앱 버전과 무관하게 분배한다. 운영상 난관은 계속 바뀌는 MoQ 드래프트, 일부 기업·통신망에서 막히거나 제한되는 UDP/443, 암호화로 보이지 않는 프레임을 위한 엣지 전용 MoQ 트레이싱이었다. 수개월의 실험 끝에 MoQ는 롤아웃에 쓴 품질·안정성 지표에서 RUSH와 동등했으며, 지연이나 끊김 개선 수치는 제시되지 않았다. 이후 과제로는 재생까지의 종단 간 전달, QMUX 기반 TCP 폴백, 실시간 AI용 양방향 전송이 거론된다.

> 💡 표준 프로토콜로의 이전은 실험군을 서버에서 조절하고 설정 한 줄로 되돌릴 수 있게 설계했기 때문에 가능했으며, UDP 차단 환경의 폴백과 암호화 트래픽 관측 수단은 QUIC 도입 시 반드시 먼저 준비할 항목이다.

### [CPU 뼛속까지 써먹고, Milvus 사이징 기준을 만들기까지](https://toss.tech/article/milvus-optimization-and-sizing)

_토스_

토스증권 Data Infra 팀은 온프레미스에 벡터 검색 Milvus를 올리기 전에 필요한 서버 규모를 정하려고, 서버 3대(Intel Xeon Silver 4516Y+ 2소켓, 서버당 논리 96코어·512GB)에서 VectorDBBench LAION-100M(1억 건, 768차원)으로 측정했다. 목표는 top-10, recall@10 0.95 이상, 300 QPS 이상이었고, 인덱스 비교에서 이를 만족한 것은 HNSW_SQ8(ef48, recall 0.954, QPS 316)뿐이었으며 메모리도 plain HNSW의 약 335GB 대비 약 114GB였다. 동시성을 10에서 300으로 올려도 QPS는 약 31%만 늘었고 IPC가 약 0.37로 낮아 메모리 대기를 의심했는데, PMU 측정에서 remote DRAM 비율이 세 노드 모두 약 49%였다. kubelet의 CPU Manager static, Memory Manager Static, Topology Manager single-numa-node로 QueryNode의 CPU와 메모리를 같은 NUMA 노드에 배치하자 remote DRAM이 0.8%로 줄고 IPC는 0.55가 됐다. 같은 recall에서 QPS는 405에서 572로 41% 올랐고 검색 p99는 3.94초에서 2.04초로 약 48% 줄었다. 서버 대수는 목표 QPS 기준과 메모리 기준 중 큰 값으로 정하는 사이징 방식을 만들었고, 차원이 두 배가 되면 처리량이 약 1/3로 준다는 측정도 반영했다. 저자들은 LAION 768차원 데이터가 실제 서비스 조건과 다르므로 도입 전에 서비스 데이터로 다시 측정해야 한다고 밝힌다.

> 💡 CPU 사용률은 메모리 대기까지 포함하므로 처리량이 안 오를 때는 IPC와 remote DRAM 비율을 보고, 메모리 집약적 워크로드는 NUMA 정렬만으로 같은 하드웨어에서 큰 이득을 얻을 수 있다.

### [GitLab Critical Patch Release: 19.4.2, 19.3.4, 19.2.8](https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-4-2-released/)

_GitLab_

GitLab이 2026년 10월 12일 CE/EE 긴급 패치 릴리스 19.4.2, 19.3.5, 19.2.8을 공개했으며, 자체 관리형 설치는 가능한 한 빨리 해당 브랜치의 패치로 업그레이드할 것을 강하게 권고한다. 이번 릴리스는 총 24개 CVE를 고치며 심각도는 Critical 1건, High 5건, Medium 14건, Low 4건이다. Critical은 CVE-2026-97229(CVSS 10.0)로, CI/CD 정규식 컴파일러의 정수 오버플로로 인증 없이 서버에서 코드가 실행될 수 있고 19.2부터 영향을 받는다. High에는 구문 강조 XSS(CVE-2026-92883), 하위 파이프라인 생성의 권한 오류(CVE-2026-16301), GitLab Duo Agent Platform의 LLM 프롬프트 인젝션(CVE-2026-96893)이 포함된다. 단일 노드 인스턴스는 마이그레이션 때문에 다운타임이 있고 다중 노드는 무중단 절차로 업그레이드할 수 있다. GitLab.com은 이미 패치됐고 GitLab Dedicated는 조치가 필요 없으며, 19.3.4는 Ona 연동 시 머지 리퀘스트 페이지가 깨지는 버그가 있어 19.3.5가 이를 고친다. 취약점 상세는 릴리스 90일 뒤 공개된다.

> 💡 인증 없는 원격 코드 실행이 CI/CD 경로에서 나온 만큼 자체 호스팅 GitLab은 정기 업그레이드가 아니라 즉시 패치 대상이며, 단일 노드는 다운타임 창을 미리 잡아야 한다.

### [if(kakao)26, 온라인 라이브로 함께해요!](https://tech.kakao.com/posts/839)

_카카오_

카카오 DevRel Zoo가 올린 이 글은 10월 13일과 14일 카카오 AI 캠퍼스에서 열리는 if(kakao)26을 온라인 라이브로 볼 수 있다고 안내한다. 키노트를 포함한 모든 발표 세션이 라이브 스트리밍되며 누구나 온라인으로 시청할 수 있다. 첫째 날은 키노트와 AI 시대의 개발자, 신뢰와 안전, AI 방향성, 상생과 성장, Model & Agent 트랙으로 구성되고, 글이 게시된 시점에는 이들 라이브가 종료된 것으로 표시되어 있다. 둘째 날은 오프닝 스피치, 거버넌스, 안정성과 인프라, AI-DLC, Model & Agent 순으로 진행된다. 올해 행사는 첫째 날 모든 연결에 지능을, 둘째 날 기술이 신뢰가 되는 순간을 중심으로 카카오팀의 기술과 경험을 공유한다. 관심 있는 발표 시간대는 if(kakao)26 공식 홈페이지에서 미리 확인하라고 안내하며, 실시간으로 보지 못해도 행사 종료 후 세션 녹화 영상이 제공될 예정이다.

> 💡 Day 2의 거버넌스, 안정성과 인프라, AI-DLC 트랙은 클라우드·DevOps 팀이 AI 도입 시 마주칠 운영 주제와 맞닿아 있으니, 녹화본이 공개되면 이 세션들을 우선 확인해 볼 만하다.

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
