---
title: "📰 데일리 테크 다이제스트 - 2026-10-01"
description: "2026-10-01 Cloud, Kubernetes, AI, DevOps 소식 43건 — 자동 큐레이션 다이제스트."
pubDate: 2026-10-01
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### Gemini 4 Argon is here: It’s great, and you can’t have it yet

구글이 수요일 오랫동안 기다려온 플래그십 모델 Gemini 4 Argon을 발표했다. 제목에 따르면 품질은 기대를 충족하는 수준이지만, 아직 외부에서 바로 쓸 수는 없는 상태로 소개된다. 발췌문은 "기다린 보람이 있었다"는 평가에서 끊겨 있어 구체적인 벤치마크 수치나 일반 공개 일정은 확인되지 않는다. 이 소식은 DevOps 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 **왜 중요한가**: 플래그십 모델 발표와 실제 가용성 사이에 격차가 있다면, 운영팀은 조기 도입 계획을 섣불리 확정하지 말고 접근 권한 공개 시점을 별도로 추적해야 한다.

🔗 [원문 보기](https://thenewstack.io/google-gemini-4-argon/) · _The New Stack_

---

## Kubernetes & Cloud Native

### [AI-powered EKS migration assessment with Amazon Bedrock AgentCore](https://aws.amazon.com/blogs/containers/ai-powered-eks-migration-assessment-with-amazon-bedrock-agentcore/)

_AWS Containers_

AWS Containers 블로그는 Amazon Bedrock AgentCore와 Strands Agents SDK를 이용해 AI 기반 EKS 마이그레이션 평가 에이전트를 구축하는 방법을 다룬다. 이 에이전트는 기존 워크로드를 Amazon EKS로 이전하기 전 평가 작업을 자동화하는 데 쓰인다. 이 소식은 쿠버네티스 카테고리로 분류된다. 출처는 AWS Containers의 공식 블로그다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 마이그레이션 평가를 에이전트로 자동화하면 EKS 전환 전 워크로드 호환성·리스크 점검에 드는 엔지니어 시간을 줄일 수 있다.

### [ArgoCon North America 2026: What to expect as the Argo community looks toward CD 4.0](https://www.cncf.io/blog/2026/09/30/argocon-north-america-2026-what-to-expect-as-the-argo-community-looks-toward-cd-4-0/)

_CNCF_

CNCF 블로그는 ArgoCon North America 2026에서 다룰 내용을 소개하며, Argo 프로젝트 전반의 작업이 가속화되고 있고 채택 증가, 신규 사용 사례, 메인테이너 참여 확대가 나타나고 있다고 전한다. 커뮤니티는 Argo CD 4를 향한 비전 수립 과정도 시작했다고 밝힌다. 이 소식은 쿠버네티스 카테고리로 분류된다. 출처는 CNCF의 공식 블로그다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 Argo CD 4.0을 향한 비전 수립이 시작된 만큼, GitOps 파이프라인을 운영하는 조직은 향후 메이저 버전 전환에 따른 호환성 변화를 미리 추적해둘 필요가 있다.

### [How athenahealth modernized healthcare workloads with Amazon EKS Hybrid Nodes](https://aws.amazon.com/blogs/containers/how-athenahealth-modernized-healthcare-workloads-with-amazon-eks-hybrid-nodes/)

_AWS Containers_

AWS Containers 블로그는 헬스케어 기업 athenahealth가 Amazon EKS Hybrid Nodes를 도입해 지연에 민감한 헬스케어 워크로드를 온프레미스에서 현대화한 사례를 소개한다. 이를 통해 응답 시간을 절반으로 줄이고 하드웨어·운영 비용을 50% 절감했다고 밝힌다. 데이터센터와 클라우드 전역에서 단일 쿠버네티스 운영 모델을 유지하면서도 HITRUST 인증과 데이터 레지던시 요건을 충족했다는 점이 핵심이다. 이 소식은 쿠버네티스 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 온프레미스와 클라우드를 EKS Hybrid Nodes로 단일 쿠버네티스 모델로 묶으면 HITRUST·데이터 레지던시 같은 규제 요건을 지키면서도 지연시간과 운영비를 동시에 줄일 수 있다.

### [From 40 seconds to under 10: rebuilding incident detection on OpenTelemetry, Apache Kafka, and Apache Flink on Kubernetes](https://www.cncf.io/blog/2026/09/30/from-40-seconds-to-under-10-rebuilding-incident-detection-on-opentelemetry-apache-kafka-and-apache-flink-on-kubernetes/)

_CNCF_

이 CNCF 블로그는 한 SaaS 기업이 장애 탐지 시간을 40초에서 10초 이하로 줄인 재구축 사례를 다룬다. 글은 "장애가 났을 때 모니터링이 먼저 알아챘는지, 고객이 먼저 알아챘는지"라는 질문에 오랫동안 "경우에 따라 다르다"로 답할 수밖에 없었던 상황에서 출발한다. 이를 해결하기 위해 OpenTelemetry, Apache Kafka, Apache Flink를 Kubernetes 위에서 조합해 인시던트 탐지 파이프라인을 다시 설계했다고 소개한다. 구체적인 아키텍처 변경 내역과 세부 수치는 발췌문에 담겨 있지 않다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 탐지 지연을 40초에서 10초 이하로 줄이는 작업은 Kafka·Flink 기반 스트리밍 파이프라인의 지연시간 튜닝이 인시던트 대응 시간(MTTD)에 직결된다는 점을 보여준다.

---

## AI & ML

### [Disrupting a coordinated model-distillation campaign](https://openai.com/index/disrupting-a-coordinated-model-distillation-campaign)

_OpenAI_

OpenAI가 자사 모델의 보호된 추론 과정을 추출하려 한 조직적인 모델 디스틸레이션(distillation) 시도를 탐지하고 차단했다고 밝혔다. 이는 외부 행위자가 OpenAI 모델의 출력을 활용해 자체 모델을 학습시키는 적대적 디스틸레이션(adversarial distillation) 공격으로 분류된다. OpenAI는 이번 대응과 함께 향후 유사한 공격을 막기 위한 방어 체계를 강화하고 있다고 설명한다. 공격 주체, 탐지 방식, 구체적인 규모나 조치 내역 등 세부 사항은 발췌문에 나와 있지 않다. 이 소식은 AI 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 추론 과정을 노린 조직적 디스틸레이션 공격이 실존한다는 발표는, 자체 LLM 출력을 외부에 노출하는 서비스라면 API 사용 패턴 모니터링과 약관 기반 탐지 체계를 점검해야 한다는 신호다.

### [Helping small businesses put AI to work](https://openai.com/index/helping-small-businesses-put-ai-to-work)

_OpenAI_

OpenAI가 미국 중소기업 지원 기관인 America's SBDC(Small Business Development Centers)와 협력해 중소기업 대상 실습형 AI 교육과 지역 지원을 확대한다고 발표했다. 이와 함께 소규모 조직들이 실제로 AI를 어떻게 활용하고 있는지를 다룬 새로운 리포트도 함께 공개했다. 구체적인 교육 프로그램 규모, 지역 범위, 리포트의 통계치 등은 발췌문에서 확인되지 않는다. 이 소식은 AI 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 대형 벤더가 중소기업 대상 실습 교육까지 직접 제공하기 시작했다는 점은, 소규모 운영팀 수준에서도 AI 도입 장벽이 기술보다 교육·지원 접근성 쪽으로 옮겨가고 있음을 시사한다.

### [Open TTS Leaderboard: Scalable Evaluation for Multilingual Text-to-Speech and Voice Cloning](https://huggingface.co/blog/open-tts-leaderboard)

_Hugging Face_

Hugging Face가 'Open TTS Leaderboard'라는 리더보드를 공개했다. 제목에 따르면 이 리더보드는 다국어 텍스트 음성 변환(TTS)과 보이스 클로닝 모델을 대규모로 평가하기 위한 스케일러블한 벤치마크를 목표로 한다. 구체적인 평가 모델 목록, 지표, 데이터셋 등 세부 내용은 발췌문이 비어 있어 확인할 수 없었다. 이 소식은 AI 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 다국어 TTS·보이스 클로닝 모델을 표준화된 리더보드로 비교할 수 있게 되면, 음성 기능을 도입하려는 팀이 자체 벤치마크 구축 없이 비용·품질 트레이드오프를 더 빠르게 판단할 수 있다.

### [How Diffusion Controller unifies and simplifies AI image generation](https://research.google/blog/how-diffusion-controller-unifies-and-simplifies-ai-image-generation/)

_Google Research_

Google Research가 'Diffusion Controller'라는 접근법을 소개하며, 이를 통해 AI 이미지 생성 과정을 통합하고 단순화할 수 있다고 설명한다. 해당 글은 'Algorithms & Theory' 카테고리로 분류되어 있다. 제목과 카테고리 외에 구체적인 기법 설명이나 벤치마크 수치는 확인되지 않는다. 이 소식은 AI 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 이미지 생성 파이프라인을 하나의 컨트롤러로 통합하는 방향이 실용화되면 추론 서빙 구조와 모델 관리 복잡도를 줄일 여지가 생긴다.

### [NVIDIA Kumo Tabular Sets a New Accuracy-Efficiency Frontier for Tabular Prediction](https://huggingface.co/blog/nvidia/kumo-tabular)

_Hugging Face_

Hugging Face 블로그에 NVIDIA의 'Kumo Tabular' 모델이 테이블형(tabular) 데이터 예측에서 정확도와 효율성의 새로운 프런티어를 제시한다는 글이 게시되었다. 발췌문이 제공되지 않아 구체적인 벤치마크 수치, 비교 대상 모델, 아키텍처 세부사항은 확인할 수 없다. 제목에 근거하면 기존 tabular 예측 기법 대비 정확도-효율 트레이드오프를 개선했다는 주장으로 보인다. 이 소식은 AI 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 테이블형 예측 모델의 정확도-효율 균형이 실제로 개선된다면 대규모 피처 기반 추론 인프라의 비용을 낮출 잠재력이 있지만, 구체적 수치가 확인되기 전까지는 신중하게 봐야 한다.

### [Getting the Source Right, Not Just the Fact: Source-Aware Verification for MCP Agents](https://huggingface.co/blog/MultiverseComputingCAI/getting-the-source-right-not-just-the-fact-source)

_Hugging Face_

Multiverse Computing이 Hugging Face 블로그에 게시한 글로, MCP(Model Context Protocol) 에이전트를 위한 'source-aware verification(출처 인식 검증)' 개념을 다룬다. 제목에서 드러나듯 단순히 사실(fact) 자체의 진위를 확인하는 것을 넘어 그 사실이 어느 출처에서 나왔는지까지 검증하는 접근을 제안하는 것으로 보인다. 발췌문이 제공되지 않아 구체적인 기법, 벤치마크 수치, 적용 사례는 확인할 수 없다. 이 소식은 AI 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 MCP 에이전트가 가져오는 정보의 출처까지 검증하는 체계가 도입되면 외부 툴 체인을 쓰는 에이전트 파이프라인의 신뢰성과 보안 감사 요건이 한 단계 올라간다.

### [Introducing GPT-6.1 Sol](https://openai.com/index/introducing-gpt-6-1-sol)

_OpenAI_

OpenAI가 GPT-6.1 Sol을 공개했다. 코딩, 컴퓨터 사용(computer use), 전문 업무 영역에서 상위 모델인 Astra에 근접한 성능을 낸다고 설명한다. 가장 눈에 띄는 차이는 가격으로, API 입력 및 출력 토큰 가격이 Astra 표준 요금의 5분의 1 수준이다. 이 소식은 AI 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 상위 모델에 근접한 성능을 5분의 1 가격에 제공한다면, 코딩·컴퓨터 사용 자동화 워크로드의 API 비용 구조를 재평가해 저비용 모델로 일부 트래픽을 옮기는 것이 운영 비용 절감에 유효할 수 있다.

---

## 클라우드 업데이트

### [Running multi-day AZ evacuation drills with ARC Zonal Shift](https://aws.amazon.com/blogs/architecture/running-multi-day-az-evacuation-drills-with-arc-zonal-shift/)

_AWS Architecture_

이 글은 ARC(Application Recovery Controller) Zonal Shift를 이용해 여러 날에 걸친 가용영역(AZ) 대피 훈련을 운영하는 방법을 다룬다. 핵심 메시지는 멀티-AZ 아키텍처가 실제 장애 상황을 버텨낼 수 있음을 직접 증명해야 한다는 것이다. 발췌문만으로는 훈련 기간, 전환 절차, 롤백 기준 등 구체적인 수치나 단계는 확인되지 않는다. 이 소식은 클라우드 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 실제 장애를 흉내 낸 다일간 AZ 대피 훈련으로 멀티-AZ 복원력을 미리 입증해두면, 실제 장애가 발생했을 때 Zonal Shift 전환 판단과 대응 속도를 높일 수 있다.

### [How MHK built a HIPAA-eligible agentic AI solution on Amazon Bedrock](https://aws.amazon.com/blogs/architecture/how-mhk-built-a-hipaa-eligible-agentic-ai-solution-on-amazon-bedrock/)

_AWS Architecture_

헬스케어 기업 MHK는 Amazon Bedrock, Amazon ECS, 이벤트 기반 패턴을 사용해 HIPAA 적격 에이전틱 워크플로 프레임워크인 SmartProminence AI Orchestrator를 구축했다. 이 솔루션은 수동 의료 심사(medical review) 작업량을 90% 줄였다고 밝혔다. 또한 신규 AI 기능의 배포 주기를 수개월에서 수주로 단축했다. 아키텍처의 세부 구성(IAM 경계, 데이터 저장 방식 등)은 발췌문에 나오지 않는다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 의료 심사처럼 규제 민감한 업무에 에이전틱 워크플로를 적용해 90% 수준의 인력 절감과 배포 주기 단축을 동시에 얻으려면 HIPAA 적격 서비스 조합과 이벤트 기반 아키텍처 설계가 핵심 전제가 된다.

### [What’s new in AI infrastructure and orchestration in September](https://cloud.google.com/blog/topics/ai-infrastructure/whats-new-in-ai-infrastructure-this-month/)

_Google Cloud_

구글 클라우드는 9월을 "확장성의 달"로 선언하고 GKE·스토리지·네트워킹 전반에 에이전틱 워크로드용 기능을 대거 내놓았다. GKE Agent Substrate는 표준 컨테이너 런타임보다 10배 높은 밀도로 수백만 개의 샌드박스를 지원하며, 초당 500회 이상의 서스펜드/리줌 활성화에서 500ms 미만의 복귀 지연을 보인다. GKE Pod Snapshots는 CPU·GPU 메모리를 포함한 실행 상태를 저장·복원해 AI 추론 시작 시간을 내부 테스트 기준 최대 89%까지 줄였다. 스토리지에서는 M4N VM 패밀리(타이타늄 오프로드 아키텍처, Hyperdisk Extreme 조합 시 최대 25,000MiB/s·100만 IOPS 이상)와 Z4D 베어메탈 인스턴스가 정식 출시(GA)됐다. 네트워킹에서는 멀티 클러스터 GKE 추론 게이트웨이가 LLM-d 라우터를 통해 1% 미만의 오버헤드만 추가하며 전역 트래픽을 분산한다. 게임 스타트업 시버스(SeaVerse)는 GKE Agent Sandbox로 멀티테넌트 워크로드를 운영해 인프라 비용을 60% 절감했다고 밝혔다.

> 💡 에이전트 샌드박스 밀도·추론 스냅샷·전역 추론 게이트웨이 수치(10배 밀도, 최대 89% 기동 시간 단축, 1% 미만 오버헤드)가 실제 환경에서도 유지된다면 대규모 에이전틱 워크로드를 운영하는 클러스터의 비용과 지연시간을 동시에 낮출 여지가 크다.

### [Cloud CISO Perspectives: How cybersecurity startups can win CISOs](https://cloud.google.com/blog/products/identity-security/cloud-ciso-perspectives-how-cybersecurity-startups-can-win-cisos/)

_Google Cloud_

구글 클라우드 Office of the CISO의 시니어 디렉터 Alicja Cade와 Nick Godfrey가 보안 스타트업이 CISO를 고객·파트너로 끌어들이는 방법을 정리했다. 핵심은 세 가지로, 먼저 영업 피치 없는 라운드테이블('unselling' 세션)과 벤처캐피털이 끼지 않은 오픈소스·학계 네트워크를 통해 CISO의 운영상 병목을 먼저 듣고 함께 설계하라는 것이다. 둘째로 AI 보안 제품은 '인지적', '자율적' 같은 버즈워드 대신 고유 데이터셋·파인튜닝·오케스트레이션 레이어로 차별점(모트)을 입증하고, 적대적 공격·프롬프트 인젝션 방어와 오탐 최소화를 기술 문서와 사례로 보여줘야 한다고 조언한다. 셋째로 데이터 주권·데이터 레지던시 같은 규제 요건을 내부 실무에서도 외부 주장과 일치시키라고 강조한다. 구글은 지난 4년간 Authologic, BforeAI, Build38, Cerby, Crowdsec, Risk Ledger, Mokn, Kriptos, LetsData 등 50개 이상의 보안 스타트업을 지원했다고 밝혔으며, Kriptos CEO Christian Torres와 LetsData 공동창업자 Ksenia Iliuk의 코멘트도 인용됐다.

> 💡 보안 스타트업 제품을 도입할 때 버즈워드가 아니라 모트·방어 체계·사례 문서를 요구하는 평가 기준을 세우면 조직의 보안 구매 리스크를 줄일 수 있다.

### [Empower your agents with the Google Cloud CLI remote MCP server](https://cloud.google.com/blog/products/ai-machine-learning/google-cloud-cli-remote-mcp-server-in-preview/)

_Google Cloud_

구글클라우드가 2026년 9월 30일 Google Cloud CLI 원격 MCP 서버를 프리뷰로 공개했다. 엔드포인트는 https://cloudcli.googleapis.com/mcp이며, run_gcloud_command와 run_bq_command 두 가지 툴로 인프라 관리, 관측성·장애 진단, BigQuery 예약 쿼리·슬롯 사용량·예약(reservation)·권한 관리 등 gcloud/bq CLI 작업 전체를 로컬 설치 없이 수행할 수 있다. 사용하려면 Cloud CLI Execution API(cloudcli.googleapis.com)를 활성화하고 에이전트나 사용자 ID에 roles/mcp.toolUser 역할을 부여해야 하며, 호스팅된 구글 클라우드 플랫폼에서는 키 없는 Agent Identity, 외부 런타임에서는 표준 OAuth 2.0으로 인증한다. 명령은 격리된 샌드박스에서 호출자의 IAM 권한과 조직 정책 제약 안에서만 실행되고, Model Armor가 프롬프트 인젝션 등 악성 입력을 스크리닝하며 Cloud Audit Logging으로 전체 접근을 기록한다. Gemini Enterprise 등 MCP 호환 에이전트 플랫폼이면 별도 설정 없이 바로 연결할 수 있고, 서버 자체는 무료이며 실제 생성되는 GCP 리소스와 데이터 전송 비용만 청구된다.

> 💡 로컬 gcloud/bq CLI 설치와 자격증명 관리를 없애면서도 IAM·조직 정책·감사 로깅을 그대로 유지할 수 있어, 에이전트 기반 운영 자동화를 도입할 때 보안 통제를 유지한 채 운영 부담을 줄일 수 있다.

### [Cloudflare Impact reaches $100 million in donations](https://blog.cloudflare.com/100-million-donations/)

_Cloudflare_

Cloudflare 블로그는 Impact 프로그램을 통한 기부 서비스 규모가 1억 달러에 도달했다고 발표했다. 이 마일스톤으로 저널리스트, 시민단체, 주·지방정부, 선거관리기구, 공립학교 등 수천 개 기관이 사이버 공격으로부터 보호받고 있다고 설명한다. 이 소식은 클라우드 카테고리로 분류된다. 출처는 Cloudflare의 공식 블로그다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 무료 보안 서비스를 통한 취약 기관 보호 확대는 선거관리기구나 공립학교처럼 자체 보안 예산이 부족한 조직의 공격 표면을 줄여주는 효과가 있다.

### [Cut your AI spend with AI Gateway's Auto Router](https://blog.cloudflare.com/auto-router/)

_Cloudflare_

Cloudflare가 AI Gateway에 Auto Router라는 신규 모델 라우팅 기능을 추가했다. 이 라우터는 엣지에 배포된 분류기(classifier)를 이용해 들어오는 요청의 복잡도를 평가한 뒤, 예상 출력 품질과 토큰 비용을 저울질해 가장 적합한 모델로 요청을 자동 전달한다. 이를 통해 조직은 성능을 유지하면서도 AI 지출을 크게 줄일 수 있다고 소개한다. 이 소식은 클라우드 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 요청 단위로 모델을 자동 선택하는 라우팅 계층이 생기면 토큰 비용 최적화는 Gateway 설정값 하나로 관리할 수 있게 되지만, 분류기 오판 시 품질 저하 리스크를 관측 지표로 반드시 모니터링해야 한다.

### [Detect and send production issues straight to your agent](https://blog.cloudflare.com/real-time-issue-detection/)

_Cloudflare_

Cloudflare Workers에 내장 오류 모니터링 기능이 추가되어, 프로덕션에서 발생한 장애를 자동으로 그룹화할 수 있게 됐다. 이 기능은 스택 트레이스, 로그, 트레이스, 애플리케이션 컨텍스트를 코딩 에이전트에게 바로 전달해 에이전트가 원인을 조사하고 풀 리퀘스트까지 열 수 있도록 지원한다. 장애 탐지부터 에이전트의 조사, 수정 PR 생성까지 이어지는 흐름을 Workers 플랫폼 안에서 제공하는 것이 핵심이다. 이 소식은 클라우드 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 장애 신호를 에이전트에 자동 전달해 PR 생성까지 이어지는 구조는 MTTR을 줄일 수 있지만, 에이전트가 만든 수정 PR에 대한 리뷰·승인 게이트는 반드시 유지해야 한다.

### [Reimagining the enterprise innovation engine in the agentic era](https://www.redhat.com/en/blog/reimagining-enterprise-innovation-engine-agentic-era)

_Red Hat_

Red Hat 블로그 글에서 저자는 4년 전 자신이 제시했던 '엔터프라이즈 혁신 엔진' 구축 플레이북을 다시 꺼내 에이전틱(agentic) 시대에 맞게 재조명한다. 당시 목표는 시장 변화에 뒤처지기 전에 신기술을 발굴(discovering)·정렬(aligning)·개발(developing)·상업화(commercializing)하는 반복 가능한 모델을 만드는 것이었다. 이번 글은 그 프레임워크를 에이전틱 AI 시대의 기업 혁신에 어떻게 적용할지를 다루는 것으로 보인다. 구체적인 기술 스택이나 수치는 발췌문에 나오지 않는다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 신기술 발굴부터 상업화까지를 반복 가능한 프로세스로 다루는 혁신 엔진 프레임워크는, 에이전틱 AI 도입처럼 빠르게 바뀌는 기술을 조직이 애드혹하게가 아니라 체계적으로 평가·도입하도록 만드는 데 참고가 될 수 있다.

### [Migrate virtual machines with Red Hat OpenStack Services on OpenShift](https://www.redhat.com/en/blog/migrate-virtual-machines-red-hat-openstack-services-openshift)

_Red Hat_

Red Hat 블로그 글은 'Red Hat OpenStack Services on OpenShift(OSSO)'를 이용해 가상 머신을 마이그레이션하는 방법을 다룬다. 발췌문에 따르면 OSSO는 Infrastructure-as-a-Service(IaaS)에 대규모 확장성을 제공해, 가상화 워크로드와 클라우드 네이티브 워크로드가 같은 플랫폼에서 공존할 수 있게 한다. IT 의사결정자들이 클라우드 네이티브 개발 기반을 갖추면서도 확장 가능한 프라이빗 클라우드를 필요로 하는 상황을 배경으로 설명한다. 구체적인 마이그레이션 도구명이나 단계별 절차, 버전 정보는 발췌문에 포함되어 있지 않다. 이 소식은 클라우드 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 가상화 워크로드와 클라우드 네이티브 워크로드를 같은 OpenShift 기반 플랫폼에서 운영할 수 있게 되면, 별도의 가상화 인프라를 유지하는 운영 부담과 이중 관리 비용을 줄일 수 있다.

### [Building an AI-powered multimodal compliance monitor: From training to tracking to chat](https://www.redhat.com/en/blog/building-ai-powered-multimodal-compliance-monitor-training-tracking-chat)

_Red Hat_

Red Hat 블로그 글은 여러 시설의 다중 영상 피드를 대상으로 작업장 안전·보안·자산 추적·운영 준수를 관리하는 AI 기반 멀티모달 컴플라이언스 모니터 구축을 다룬다. 발췌문은 수동 모니터링이 자원 집약적이고 사후 대응적이며, 안전 위험을 나타내는 중요 이벤트나 패턴을 놓치기 쉽다는 문제를 지적한다. 제목에 나온 '훈련(training)부터 추적(tracking), 채팅(chat)까지'라는 표현으로 보면 모델 학습, 실시간 추적, 대화형 질의 인터페이스를 포괄하는 end-to-end 파이프라인을 소개하는 것으로 보인다. 사용된 구체적 모델명, Red Hat 제품(예: OpenShift AI 등) 여부는 발췌문에 명시되어 있지 않다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 다중 영상 피드 모니터링을 수동 대응에서 멀티모달 AI 기반의 실시간 추적·대화형 질의로 전환하면, 안전·보안 이벤트 탐지가 사후 대응에서 선제 대응으로 바뀌어 운영 리스크를 줄일 수 있다.

### [Build adaptive AI interfaces with the AG-UI protocol, agent swarms, and Nova Act on AWS](https://aws.amazon.com/blogs/architecture/build-adaptive-ai-interfaces-with-the-ag-ui-protocol-agent-swarms-and-nova-act-on-aws/)

_AWS Architecture_

AWS Architecture 블로그는 에이전트의 가변적인 출력에 자동으로 적응하는 AI 인터페이스를 구축하는 방법을 소개한다. 동적 UI 생성을 위한 AG-UI 프로토콜, 설명 가능한 멀티 에이전트 협업을 위한 Strands Agents SDK의 swarm(스웜) 패턴, API가 없는 레거시 시스템을 연동하기 위한 Amazon Nova Act, 이 세 가지를 조합한 아키텍처를 다룬다. 즉 AG-UI로 에이전트 출력에 맞춰 화면을 동적으로 생성하고, Strands Agents SDK의 스웜 패턴으로 여러 에이전트의 협업 과정을 설명 가능하게 만들며, Nova Act로 API가 없는 레거시 시스템까지 통합 범위를 넓히는 구성이다. 이 소식은 클라우드 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 API가 없는 레거시 시스템까지 에이전트가 직접 조작하게 되면 접근 권한 통제와 액션 로깅 같은 보안·관찰성 설계가 더 중요해진다.

### [Enhancing Microsoft Azure Virtual Machine lifecycle](https://azure.microsoft.com/en-us/blog/enhancing-microsoft-azure-virtual-machine-lifecycle/)

_Azure_

Microsoft Azure가 가상머신(VM) 라이프사이클 정책을 개선했다고 발표했다. 이 정책은 VM 시리즈의 전환(transition) 과정을 관리하는 기준으로, Azure 고객에게 투명성, 예측 가능성, 가이드를 제공하는 것을 목적으로 한다. 발췌문에는 구체적인 VM 시리즈명이나 폐기(retirement) 일정 등 수치 정보는 포함돼 있지 않다. 이 소식은 클라우드 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 VM 라이프사이클 정책 변경은 운영 중인 VM 시리즈의 지원 종료·전환 일정에 영향을 줄 수 있으므로, 클러스터 운영팀은 사용 중인 VM 시리즈가 정책 변경 대상에 포함되는지 확인해야 한다.

---

## DevOps & 인프라

### [Running production experiments with AWS AppConfig experimentation](https://aws.amazon.com/blogs/devops/running-production-experiments-with-aws-appconfig-experimentation/)

_AWS DevOps_

이 글은 AWS AppConfig의 실험(experimentation) 기능을 다루며, 체크아웃 버튼 리디자인으로 매출을 끌어올리려는 사례와 캐시 TTL을 늘려 백엔드 부하를 줄이려는 사례를 예로 든다. 두 예시는 변경이 의도한 효과를 실제로 내는지 프로덕션 환경에서 검증해야 하는 상황을 보여준다. 발췌문만으로는 AppConfig가 이런 실험을 어떤 메커니즘(트래픽 분배 비율, 측정 지표 등)으로 지원하는지는 드러나지 않는다. 이 소식은 DevOps 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 체크아웃 UI나 캐시 TTL처럼 비즈니스와 인프라에 동시에 영향을 주는 변경은 프로덕션 실험으로 검증해야 배포 리스크와 비용 영향을 사전에 가늠할 수 있다.

### [Cohere’s faster query model barely dents retrieval quality in its tests](https://thenewstack.io/cohere-embed-pro-fast/)

_The New Stack_

코히어(Cohere)는 수요일 임베딩 모델 Embed 5를 출시했다. 발췌문에 따르면 팀들은 Embed 5 Pro로 데이터를 색인(index)하고, 더 빠른 버전으로 질의(query)하는 방식을 선택할 수 있다. 제목은 이 더 빠른 질의용 모델이 자체 테스트에서 검색 품질을 거의 손상시키지 않았다고 전한다. 다만 정확한 지연시간 단축 폭이나 품질 저하 수치는 발췌문에 나오지 않는다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 색인은 고품질 모델로, 질의는 더 빠른 모델로 나누는 구성이 실제로 통한다면 검색 파이프라인의 지연시간과 비용을 줄이면서 품질 저하는 최소화할 수 있다.

### [CloudBees just committed to an AI-first pivot. Here’s why it matters for enterprise DevOps teams](https://thenewstack.io/cloudbees-ceo-ai-transformation/)

_The New Stack_

클라우드비즈(CloudBees)의 신임 CEO 모 플래스니그(Mo Plassnig)는 올해 초 취임하면서 이사회로부터 과업(mandate)을 부여받았다. 제목은 그 결과 회사가 AI 우선(AI-first) 전환을 공식적으로 결정했다고 전하며, 이것이 엔터프라이즈 DevOps 팀들에 중요한 의미를 가진다고 강조한다. 다만 이사회가 구체적으로 어떤 목표를 제시했는지, 전환의 세부 내용이 무엇인지는 발췌문이 끊겨 확인할 수 없다. 이 소식은 DevOps 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 엔터프라이즈 DevOps 도구 벤더가 AI 우선으로 전환한다면, 그 플랫폼을 쓰는 운영팀은 파이프라인 자동화와 거버넌스 기능의 로드맵 변화를 미리 살펴봐야 한다.

### [Accelerating AS/400 business rule extraction with Kiro: Step-by-step guide](https://aws.amazon.com/blogs/devops/accelerating-as-400-business-rule-extraction-with-kiro-step-by-step-guide/)

_AWS DevOps_

AWS DevOps 블로그는 Kiro를 이용해 AS/400(레거시 미드레인지 플랫폼)에 묻혀 있는 비즈니스 규칙을 추출하는 단계별 가이드를 소개한다. 기존에는 이런 레거시 로직 분석과 문서화에 수개월의 수동 작업이 필요했지만, Kiro를 활용하면 그 과정을 가속할 수 있다고 설명한다. 이 소식은 DevOps 카테고리로 분류된다. 출처는 AWS DevOps의 공식 블로그다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 레거시 AS/400 로직을 자동으로 추출할 수 있다면 마이그레이션·현대화 프로젝트의 요구사항 분석 단계를 크게 단축해 운영 리스크와 비용을 줄일 수 있다.

### [A Peek Behind Our UI Refresh](https://www.honeycomb.io/blog/soft-launch-sharper-signals-ui-refresh)

_Honeycomb_

Honeycomb의 Sol이 최근 진행한 UI 리프레시의 배경을 설명하는 글이다. 이번 개편에서는 섀도우를 더 부드럽게, 모서리를 더 둥글게 바꾸고, 마그마(magma) 색감에서 착안한 새로운 히트맵 컬러 램프를 도입했다. 이 컬러 램프는 다크 모드와 접근성을 고려해 조정됐다. 전반적으로 정보 밀도가 높은 제품 화면을 더 차분하게 느껴지도록 다듬는 디테일 작업이 핵심이다. 이 소식은 DevOps 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 다크모드·접근성까지 고려한 히트맵 컬러 램프 개편은 관측성 대시보드를 장시간 들여다보는 운영자의 피로도와 이상 패턴 인지 속도에 직접 영향을 줄 수 있다.

### [What Is Agentic AppSec?](https://snyk.io/blog/what-is-agentic-appsec/)

_Snyk_

Snyk는 "Agentic AppSec"이라는 개념을 소개하며, AI 에이전트가 애플리케이션 보안 루프를 직접 수행하는 방식을 설명한다. 핵심 원칙은 에이전트가 "grounded(사실에 근거함)", "bounded(권한과 범위가 제한됨)", "independently verified(독립적으로 검증됨)" 세 가지 조건을 만족해야 한다는 것이다. 이를 통해 AI 에이전트가 취약점 탐지부터 수정까지의 애플리케이션 보안 작업 흐름을 자동으로 돌리면서도 신뢰할 수 있는 결과를 내도록 설계한다는 취지로 보인다. 구체적인 제품 기능, 적용 사례, 수치는 발췌문에 나와 있지 않다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 보안 에이전트를 도입할 때 "grounded·bounded·independently verified" 같은 설계 원칙이 명시되지 않으면, 자동 수정 권한을 가진 에이전트가 오탐이나 과도한 변경을 일으킬 위험을 통제하기 어렵다.

### [Evo ADS Govern Agent Behavior Goes GA: Bringing MCP Usage Under Control](https://snyk.io/blog/evo-ads-govern-agent-behavior-ga/)

_Snyk_

Snyk는 'Evo ADS Govern Agent Behavior' 기능을 정식 출시(GA)했다고 밝혔으며, 첫 기능은 MCP Governance다. 이 기능은 주요 AI 코딩 에이전트 전반에서 MCP(Model Context Protocol) 서버 사용을 탐지(Discover), 승인(Approve), 모니터링(Monitor), 로깅(Log), 차단(Block)할 수 있게 해준다. 조직이 개발자들이 어떤 MCP 서버를 어떤 에이전트에 연결해 쓰는지 가시성과 통제권을 확보하는 데 초점을 맞춘 발표로 보인다. 이 소식은 DevOps 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 조직 전체에서 어떤 MCP 서버가 어느 AI 코딩 에이전트에 연결돼 있는지 중앙에서 승인·차단·로깅할 수 있게 되면, 통제되지 않은 외부 MCP 서버를 통한 자격증명 유출이나 공급망 공격 같은 보안 위험을 줄이는 데 도움이 된다.

### [9인조 다람쥐 아이돌을 데뷔시켰습니다](https://toss.tech/article/chipmunk)

_토스_

토스 기술 블로그 글에서는 9인조 다람쥐 캐릭터로 구성된 '아이돌'을 선보였다고 소개한다. 제목과 발췌문에 따르면 목적은 가입 후 한 번도 열어보지 않던 적금 상품을 사용자가 매일 열어보게 만드는 것이다. 즉 저조한 리텐션 문제를 캐릭터 기반의 참여 유도 장치로 풀어낸 사례로 보인다. 이 소식은 DevOps 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 핵심 지표가 '한 번도 안 열어보던 적금'에서 '매일 열어보는 적금'으로 바뀌었다면, 캐릭터·게이미피케이션 같은 리텐션 장치가 백엔드 알고리즘 개선 없이도 제품 참여율(DAU/재방문)을 끌어올리는 비용 효율적 레버가 될 수 있다는 뜻이다.

### [How we built an async-aware Python profiler](https://www.datadoghq.com/blog/engineering/async-python-profiler/)

_Datadog_

Datadog는 Python 트레이싱 라이브러리 ddtrace에 들어가는 프로파일러를 asyncio 태스크 간의 부모-자식 관계를 보존하도록 개선했다. 기존에는 메모리 복사에 process_vm_readv를 사용했으나 태스크가 많을 때 오버헤드가 커서, SIGSEGV/SIGBUS 신호 핸들러로 보호한 memcpy 방식으로 교체했다. 이 변경만으로 동기 코드 기준 약 50% 오버헤드가 줄었고, C++ 예외 제거로 15%, 문자열 인터닝으로 25%가 추가로 줄어 전체적으로 60% 이상의 프로파일러 오버헤드 감소를 달성했다. 태스크가 많은 서비스에서는 적응형 샘플링이 초당 1회까지 떨어지던 문제도 해소돼 정상 샘플링 빈도를 유지할 수 있게 됐다. 개선된 프로파일러로 pylzstr 압축 라이브러리의 무한 루프 버그를 발견해 업스트림에 수정을 기여했고, NumPy 특정 함수에서 15~30%의 CPU 사용량 감소 기회도 찾아냈다. 글에서는 Python 3.15의 CPython Tachyon 프로파일러도 함께 언급된다.

> 💡 비동기 코드 경로의 CPU 핫스팟을 정확히 짚어낼 수 있게 되면, 운영 중인 고트래픽 asyncio 서비스의 observability 오버헤드를 60% 이상 줄이면서도 라이브러리 버그 같은 실제 성능 회귀를 더 빨리 찾아낼 수 있다.

### [OUSD is now the default stablecoin on Stripe](https://stripe.com/blog/ousd-now-live-on-stripe)

_Stripe_

Stripe가 Open USD(OUSD)라는 스테이블코인을 플랫폼 전역에서 사용 가능한 기본 스테이블코인으로 도입했다. OUSD는 글로벌 자금 이동을 위해 설계된 스테이블코인으로, 이제 Stripe 전반에서 지원된다. 기업은 OUSD를 통해 자금을 관리하고, 결제를 수행하고, 새로운 금융 서비스를 제공할 수 있다고 소개된다. 이 소식은 DevOps 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 결제 플랫폼 수준에서 스테이블코인이 기본값이 되면 운영팀은 정산 지연, 수수료 구조, 자금 관리 자동화 흐름을 다시 점검해야 한다.

### [Building a Slack-powered AI development agent with Kiro CLI and headless authentication](https://aws.amazon.com/blogs/devops/building-a-slack-powered-ai-development-agent-with-kiro-cli-and-headless-authentication/)

_AWS DevOps_

AWS DevOps 블로그는 Kiro CLI와 headless 인증을 활용해 Slack 안에서 바로 동작하는 AI 개발 에이전트를 구축하는 방법을 다룬다. 코드 리뷰 논의, 인시던트 대응 스레드, 스탠드업 등 대부분의 개발 커뮤니케이션이 Slack에서 이루어지지만, 서비스를 분석하거나 실패한 테스트를 디버깅할 때는 엔지니어가 Slack을 벗어나 터미널을 열고 저장소로 이동해 명령을 실행한 뒤 결과를 다시 Slack에 붙여넣어야 한다는 문제를 지적한다. 이 글은 이런 컨텍스트 전환을 줄이기 위해 Kiro CLI를 headless 인증 방식으로 Slack에 연동하는 구성을 소개한다. 이 소식은 DevOps 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 Slack 안에서 바로 실행되는 CLI 에이전트가 자리 잡으면 디버깅과 인시던트 대응의 컨텍스트 전환 비용은 줄지만, headless 인증 토큰과 권한 범위 관리를 더 엄격히 설계해야 한다.

### [Developer policy update: Transparency, state policy, and what’s ahead](https://github.blog/news-insights/policy-news-and-insights/developer-policy-update-transparency-state-policy-and-whats-ahead/)

_GitHub_

GitHub가 개발자 정책 업데이트를 발표하며 최신 투명성(transparency) 데이터를 공개하는 블로그 글을 게시했다. 이 글은 개발자와 오픈소스 생태계에 영향을 미치는 주(state) 단위 정책 동향과 향후 계획을 다룬다고 소개된다. 구체적인 수치나 법안명은 발췌문에 나타나지 않는다. 이 소식은 DevOps 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 플랫폼 투명성 데이터와 주 단위 규제 동향은 오픈소스 프로젝트의 배포·컴플라이언스 요건에 영향을 줄 수 있어 조직은 관련 정책 변화를 주기적으로 확인할 필요가 있다.

### [Evolving our calendar assistant Reclaim to be AI-native without starting over](https://dropbox.tech/machine-learning/evolving-calendar-assistant-reclaim-to-be-ai-native)

_Dropbox_

Dropbox는 캘린더 비서 Reclaim을 자연어 요청을 처리하는 AI 네이티브 구조로 전환했다. 핵심 목표는 기존 사용자들이 의존하던 스케줄링 경험을 그대로 유지하면서 AI 기능을 덧붙이는 것이었다. 즉 전면 재작성(starting over)이 아니라 기존 시스템 위에 AI 계층을 점진적으로 얹는 방식을 택했다. 이 소식은 DevOps 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 기존 서비스의 신뢰성을 유지하며 AI 기능을 점진적으로 통합하는 전략은 프로덕션 시스템에 AI를 도입할 때 재작성 리스크와 다운타임을 줄이는 접근으로 참고할 만하다.

### [Agents Need Context: Introducing Canvas Connectors, Fleet-wide AI Agent Visibility, and More](https://www.honeycomb.io/blog/agents-need-context-canvas-connectors-ai-agent-visibility)

_Honeycomb_

Honeycomb은 Canvas Connectors를 공개해 Canvas 에이전트가 코드, 인시던트 기록, 런북, 티켓을 읽고 참고해 첫 시도에 올바른 해결책을 제시할 수 있게 했다. 동시에 AI Ecosystem과 LLM 비용 추적(cost tracking) 기능을 얼리 액세스로 공개했다. Anomaly Detection은 GA(정식 출시) 단계로 전환됐다. 코딩 에이전트에서 바로 Honeycomb 온보딩을 진행할 수 있는 기능도 함께 추가됐다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 관측 플랫폼이 코드·인시던트·런북·티켓까지 연결해 에이전트 컨텍스트를 넓히는 흐름은, 운영팀이 장애 대응과 비용 관측을 AI 에이전트에 위임할 때 신뢰할 수 있는 컨텍스트 소스를 미리 정비해야 함을 시사한다.

### [Introducing AI Ecosystem: Zoom Out to See Your Whole AI Agent Fleet](https://www.honeycomb.io/blog/introducing-ai-ecosystem)

_Honeycomb_

Honeycomb은 AI Ecosystem을 얼리 액세스로 공개했다. 이는 개별 에이전트가 아니라 조직이 운용하는 AI 에이전트 플릿(fleet) 전체를 조망할 수 있는 분석 레이어다. Honeycomb의 컨텍스트가 풍부한 데이터 모델(context-rich data model)을 기반으로 구축됐다. 이 소식은 DevOps 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 여러 AI 에이전트를 동시에 운용하는 조직이 늘면서, 개별 에이전트 단위가 아닌 플릿 전체를 관측하는 레이어가 장애 원인 파악과 비용 통제에 필요해지고 있다.

### [GitLab and Claude Code: Fast, compliant AI](https://about.gitlab.com/blog/gitlab-and-claude-code-fast-compliant-ai/)

_GitLab_

GitLab이 Claude Code와의 통합을 다루는 글을 공개했다. 발췌문에 따르면 글은 정부 기관이 받고 있는 이중의 압박(twin pressures)에서 출발하며, 미국(U.S.) 정부 기관의 상황을 언급한다. 제목에서 보듯 속도(fast)와 컴플라이언스 준수(compliant)를 동시에 만족시키는 AI 도입을 주제로 한다. 발췌문이 문장 중간에서 끊겨 구체적인 압박의 내용이나 기술적 통합 방식은 확인할 수 없었다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 정부·규제 산업에서 AI 코딩 도구를 도입할 때는 속도뿐 아니라 컴플라이언스 요건을 함께 충족하는 플랫폼 선택이 운영 리스크를 줄이는 핵심이 된다.

### [Helping personal agents shop more intelligently and reliably with Link](https://stripe.com/blog/helping-personal-agents-shop-more-intelligently-and-reliably-with-link)

_Stripe_

Stripe는 AI 에이전트가 소비자를 대신해 구매를 수행하는 사례가 늘면서, 에이전트 빌더들의 요청에 따라 Link를 통한 체크아웃 지원을 강화했다고 밝혔다. 발췌문에 따르면 에이전트가 체크아웃 과정을 원활히 처리하고 소비자 신뢰를 얻도록 돕는 것이 목표다. 이를 위해 세 가지 주요 개선 사항을 도입했다고 언급하지만, 발췌문에는 그 세 가지의 구체적 내용이 나와 있지 않다. 이 소식은 DevOps 카테고리로 분류된다. 원문에 접근하지 못해 제목과 발췌문 범위 내에서만 작성함.

> 💡 결제 자동화를 AI 에이전트에 넘기는 흐름이 커질수록, 체크아웃 신뢰성과 소비자 신뢰 확보를 위한 결제 인프라 쪽의 에이전트 전용 API 지원이 운영·보안 설계의 변수로 떠오를 수 있다.

### [Terraform 1.16 completes Actions lifecycles and brings imports into child modules](https://www.hashicorp.com/blog/terraform-116-completes-actions-lifecycles-and-brings-imports-into-child-modules)

_HashiCorp_

HashiCorp가 2026년 9월 28일 Terraform 1.16을 발표했다(작성자 Jacob Plicque). 핵심은 리소스 파괴 시점에 Actions를 실행할 수 있는 destroy-time actions로, action_trigger lifecycle 블록에 before_destroy와 after_destroy 두 이벤트가 추가됐다. before_destroy는 삭제 전 최종 백업 같은 작업을, after_destroy는 외부 인벤토리 갱신 같은 정리 작업을 처리한다. 설정과 트리거 조건은 plan 시점에 완전히 알려져 있어야 하며, ephemeral 값은 destroy action 설정에 사용할 수 없고 실패 모드는 halt(기본값)·taint·continue 세 가지다. 또한 루트 모듈에만 둬야 했던 import 블록을 이제 자식 모듈(child module) 내부에 직접 선언할 수 있어, 동일 모듈을 쓰는 여러 루트 설정에서 내부 리소스 주소를 중복 기재할 필요가 없어졌다. 그 외에 terraform state show -json, terraform workspace list -json 머신 리더블 출력, terraform graph -format=mermaid, HCP Terraform 정책 평가 요약, Linux s390x 아키텍처 지원이 추가됐다.

> 💡 destroy-time actions로 리소스 삭제 전후에 백업·외부 정리 작업을 선언적으로 보장할 수 있게 되어, 인프라 폐기 과정에서 데이터 유실이나 외부 시스템 불일치 리스크를 줄일 수 있다.

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
