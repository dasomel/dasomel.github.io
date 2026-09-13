---
title: "📰 데일리 테크 다이제스트 - 2026-09-01"
description: "2026-09-01 Cloud, Kubernetes, AI, DevOps 소식 21건 — 자동 큐레이션 다이제스트."
pubDate: 2026-09-01
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### BigQuery Graph is now GA: the knowledge foundation for the agentic era

Google Cloud가 BigQuery Graph의 정식 출시(GA)를 발표했다. 핵심 기능인 Borderless Graph Lakehouse는 BigQuery 테이블과 Databricks Unity Catalog, AWS Glue, Snowflake 같은 외부 카탈로그의 Iceberg 테이블을 데이터 이동 없이 묶어 여러 클라우드에 걸친 가상 지식 그래프를 구성한다. 쿼리 언어 GQL은 프리뷰 대비 실행 속도가 2배, 무방향 탐색 속도는 100배 빨라졌고 CALL 문과 확장된 서브쿼리를 지원한다. 에이전틱 워크플로 측은 자연어로 GQL·SQL을 자동 생성하는 대화형 분석과 Gemini Enterprise MCP 서버 연결, Antigravity·VS Code·Claude Code·Codex에서 쓰는 Data Agent Kit 확장 기능, 에이전트의 모든 행동을 추적 가능한 그래프로 저장하는 BigQuery Agent Analytics의 context graph로 구성된다. Thales Cybersecurity의 Pete Rubio는 다중 홉 위협 탐지를 초 단위로 해냈다고 밝혔고, Yahoo의 Mikul Bhatt는 광고 캠페인·오디언스·노출·결과 간 연결 컨텍스트를 얻었다고, Workerbee의 Heiko Roth는 수천 건의 인력 의사결정 기초로 이를 쓴다고 말했다.

> 💡 **왜 중요한가**: 외부 카탈로그의 Iceberg 테이블까지 데이터 이동 없이 그래프에 묶을 수 있다는 점은, 멀티클라우드 환경에서 사기 탐지나 공급망 의존성 같은 다중 홉 질의를 위해 별도 ETL 파이프라인을 구축할 필요가 줄어든다는 뜻이다.

🔗 [원문 보기](https://cloud.google.com/blog/products/data-analytics/bigquery-graph-connecting-data-and-ai-at-scale/) · _Google Cloud_

---

## Kubernetes & Cloud Native

### [Kubernetes v1.37: Storage Version Migration Enabled by Default](https://kubernetes.io/blog/2026/08/31/kubernetes-v1-37-storage-version-migration-ga/)

_Kubernetes_

Kubernetes 1.37에서 Storage Version Migration(SVM)이 GA에 도달해 storagemigration.k8s.io/v1 API가 안정화되고 컨트롤 플레인 컨트롤러가 모든 1.37 클러스터에서 기본으로 활성화된다. SVM은 이전 API 버전을 제거하기 전에 그 버전으로 저장된 리소스를 현재 저장 버전으로 다시 써서 .status.storedVersions에서 안전하게 빠질 수 있게 하고, 저장 시 암호화 설정이나 키 교체 시에도 기존 리소스가 새 키로 다시 암호화되도록 재작성한다. 이전에는 kubectl get/replace 스크립트를 직접 짜거나 out-of-tree 도구인 kube-storage-version-migrator를 써야 했지만, 이제는 Kubernetes API 서버를 통해 이 재작성이 자동으로 트리거된다. 이 기능은 CRD 생명주기 관리와 클러스터 보안 운영 양쪽에 걸쳐 중요한 운영상 개선으로 평가된다. SVM 컨트롤러는 리소스를 하나씩 점검해 이미 최신 저장 버전이면 건드리지 않고 지나간다.

> 💡 암호화 키 교체나 API 버전 폐기 시 기존 리소스를 수동으로 재작성하지 않아도 되므로, 클러스터 운영자는 키 회전 정책을 SVM이 자동 처리한다는 전제로 설계해 마이그레이션 스크립트 유지보수 부담을 없앨 수 있다.

### [Secure by default is your only way forward](https://www.docker.com/blog/secure-by-default-is-your-only-way-forward/)

_Docker_

Docker가 AI 에이전트 시대에는 보안이 선택이 아니라 기본값이어야 한다며 여러 제품을 한꺼번에 묶어 발표했다. 공개 베이스 이미지는 애플리케이션이 쓰지도 않는 패키지를 수백 개씩 담고 있고 스캐너가 주당 약 400건의 거짓 경고를 내는 문제를 지적하며, Docker Hardened Images(DHI)는 Alpine·Debian과 호환되고 Dockerfile의 FROM 한 줄만 바꾸면 적용되며 공격 표면을 최대 95% 줄이고 업스트림 수정 후 7일 안에 CVE를 고치며 서명된 SBOM과 빌드 출처, 최대 5년의 확장 지원을 제공한다고 밝혔다. Docker Sandboxes는 microVM 기반으로 에이전트를 일회용으로 실행해 OS 수준 호스트 격리와 자격증명 프록시 처리로 'YOLO mode with guardrails'를 구현하고, MCP Catalog and Toolkit은 하드닝된 MCP 서버를, MCP Enterprise Gateway는 모든 도구 호출의 인증·인가·로깅을 제공한다. 이 발표는 9월 23~25일 산호세 WeAreDevelopers World Congress에서 Docker CISO Mark Lechner가 할 'One boundary for the agentic era' 발표를 앞두고 나왔다. Docker는 이 제품들을 기초층·격리층·제어층으로 이어지는 하나의 보안 경계로 묶어 제시한다.

> 💡 AI 에이전트가 발견한 모든 것을 신뢰 가능한 것으로 취급하는 비결정적 특성 때문에 기존의 이미지 스캐닝·권한 모델만으로는 부족해지므로, 베이스 이미지 하드닝과 에이전트 실행 격리(sandboxing)를 같은 플랫폼에서 한 묶음으로 적용하는 쪽이 사고 범위를 실질적으로 줄인다.

### [OpenTelemetry has graduated… now what?](https://www.cncf.io/blog/2026/08/31/opentelemetry-has-graduated-now-what-2/)

_CNCF_

CNCF 블로그가 2026년 5월 Kubernetes·Prometheus와 같은 반열로 졸업한 OpenTelemetry의 현황과 다음 계획을 다뤘다. 프로젝트는 12,000건 넘는 기여, 2,800개 넘는 기업, 수백 명의 유지보수자를 거느리며 CNCF에서 Kubernetes 다음으로 빠른 개발 속도를 보이고, GitHub와 Farfetch를 포함한 다양한 조직이 프로덕션에 도입했다고 전한다. 졸업 요건으로는 문서화된 거버넌스 모델, 활발한 커뮤니티와 신속한 리뷰 프로세스, 독립적 보안 감사 완료, 안정적이고 하위 호환되는 API, 포괄적 문서화를 들었다. 다음 단계로는 생성형 AI semantic convention을 통한 에이전트 워크플로 관찰성과 브라우저·모바일 관찰성 확장을 꼽았고, 원격측정 스키마를 정의·거버넌스하는 Weaver, 설치 가능한 모듈로 구성하는 OpenTelemetry Packaging, 제로 코드 계측을 지원하는 OpenTelemetry Injector 같은 확장성 도구를 소개했다. 졸업 지위는 프로젝트가 이미 안정적이라는 보증이지만, 다음 단계는 에이전트 시대의 새로운 관찰성 요구를 어떻게 흡수하느냐에 달려 있다.

> 💡 졸업 프로젝트라는 지위 자체는 안정성 보증이지만 다음 초점이 에이전트 워크플로용 semantic convention으로 옮겨가고 있으므로, 에이전트 파이프라인을 운영하는 팀은 지금부터 OpenTelemetry의 생성형 AI 계측 규약을 관측성 설계에 반영해두는 쪽이 나중에 재계측하는 비용을 줄인다.

### [Defending the battlefield: Stateful detections for an agentic threat landscape](https://webflow.sysdig.com/blog/defending-the-battlefield-stateful-detections-for-an-agentic-threat-landscape)

_Sysdig_

Sysdig가 Falco를 확장한 'stateful detection'을 소개했다. 기존 탐지 엔진은 컨테이너에서 터미널 셸이 열렸다는 개별 이벤트만 진공 상태로 평가해 개발자의 정상적인 디버깅인지 악의적 활동인지 구분할 맥락이 부족했지만, stateful detection은 셸 오픈 다음에 바이너리 다운로드, 그다음 실행으로 이어지는 흐름처럼 여러 행동을 연관지어 판단한다. Falco에는 상태적 평가를 정의하는 Observations 컴포넌트와 동일 프로세스 ID 같은 이벤트 간 관계를 정의하는 obs_link_fields, 규칙에서 이를 활용하는 obs.occurs·obs.link가 추가됐다. 이 방식은 합법적인 단일 행동과 악의적인 다단계 공격을 구분해 오탐을 줄이고 상관관계 정보가 포함된 경보로 조사 속도를 높이며, Sysdig가 조사한 조직의 70%가 이미 stateful detection을 쓰고 있다고 전한다. Sysdig는 에이전트가 점점 더 빠르게 행동하는 환경일수록 이런 연관 탐지의 가치가 더 커진다고 강조한다.

> 💡 단일 이벤트를 진공 상태로 평가하는 탐지는 정상적인 디버깅 행위를 오탐으로 처리하거나 다단계 공격의 각 단계를 개별적으로만 보고 넘어가기 쉬우므로, 런타임 보안 규칙을 프로세스 ID 같은 연관 키로 이벤트를 엮는 상태 기반 방식으로 옮기는 것이 조사 속도와 오탐률을 동시에 개선한다.

---

## AI & ML

### [TimesFM-3: A zero-shot foundation model for multivariate forecasting](https://research.google/blog/timesfm-3-a-zero-shot-foundation-model-for-multivariate-forecasting/)

_Google Research_

Google Research가 제로샷 다변량 예측 파운데이션 모델 TimesFM-3의 기술적 세부를 공개했다. 3억 3천만 파라미터 디코더 온리 트랜스포머로, 시계열을 32개 시점 단위 패치로 나눈 뒤 한 시계열 내부를 인과적으로 훑는 causal temporal attention과 같은 시점에서 여러 시계열을 가로로 훑는 full variate attention을 교차시켜 계열 간 상관관계를 학습한다. 1조 개가 넘는 실제·합성 데이터 포인트로 사전학습됐고, Contiguous Patch Masking을 활용한 비자기회귀 디코딩으로 전체 예측 구간을 한 번의 순전파로 채운다. 다중 타깃 동시 예측과 과거 공변량, 미래까지 알려진 동적 공변량을 기본으로 지원하며 타깃별로 9개의 분위수 예측을 산출해 불확실성을 정량화한다. GIFT-Eval, FEV-Bench, TIME 리더보드에서 Chronos-2와 Toto 2.0을 포함한 경쟁 모델을 점·확률 예측 지표 양쪽에서 앞섰고, 단변량 모드로만 써도 경쟁 모델과 동등하거나 더 나은 성능을 냈다고 밝혔다.

> 💡 다중 공변량과 여러 타깃을 한 모델로 동시에 예측할 수 있다는 것은, 지금까지 시계열별로 따로 운영하던 예측 파이프라인을 하나의 모델 서빙 엔드포인트로 합칠 여지가 생겼다는 뜻이다.

### [Polimill builds Japan's next-generation public AI infrastructure](https://openai.com/index/polimill)

_OpenAI_

OpenAI가 일본의 공공 행정 AI 플랫폼 QommonsAI를 만든 Polimill의 사례를 소개했다. Polimill은 시민 정치 참여 플랫폼 Surfvote에서 출발해 지자체 업무 효율화가 먼저라는 구조적 문제를 발견하고 2024년 10월 QommonsAI를 출시했으며, 현재 일본 전역 약 1,050개 지자체와 약 55만 명의 공무원이 의회 답변·공공서비스·사회복지·법률 검색 등에 이를 쓴다. QommonsAI는 지자체마다 다른 의회 의사록과 행정 문서를 AI로 표준화하고 메타데이터를 붙여 지역과 시기를 가로지르는 고정밀 검색 기반을 만들었고, GPT 모델의 폭넓은 역량과 ChatGPT라는 이름의 친숙함이 공무원의 초기 채택 장벽을 낮췄다고 CAIO Masahiro Wakabayashi는 말한다. Codex를 요구사항 정의부터 기존 GitHub 코드와의 일관성 검사, 구현, 테스트까지 개발 전 과정에 도입해 개발 속도가 기존의 3~5배로 올랐고, 경험이 적은 직원도 AI와 누적된 행정 정보로 베테랑에 근접하는 정책 제안을 작성할 수 있게 됐지만 베테랑의 제안이 여전히 가장 높은 평가를 받아 그 차이가 문서화되지 않은 암묵지에서 온다고 분석했다. Wakabayashi는 이 지식이 문서화되지 않는 한 담당자가 바뀔 때마다 다시 사라질 위험이 있다고 본다.

> 💡 지자체마다 다른 문서 형식과 명명 규칙을 AI로 표준화해 검색 기반을 만든 것이 실제 도입 확산의 전제조건이었으므로, 공공 부문 AI 도입에서는 모델 성능보다 파편화된 데이터를 통합하는 작업이 먼저 해결돼야 할 병목이다.

### [A milestone in expanding access to AI](https://openai.com/index/expanding-access-to-ai-with-chatgpt-ads)

_OpenAI_

OpenAI가 출시 200일도 안 돼 ChatGPT Ads가 연환산 매출 10억 달러를 넘겼다고 밝히며, 수만 명의 광고주가 쓰고 있고 오늘부터 인도·유럽·중동·북아프리카에서 Ads Manager를 통한 직접 구매가 가능해진다고 전했다. ChatGPT는 주간 활성 사용자가 10억 명을 넘으며, 광고는 현재 진행 중인 대화의 맥락을 사용하고 국가와 사용자 설정에 따라 더 넓은 ChatGPT 사용 맥락도 활용할 수 있다. 광고는 항상 답변과 분리해 명확히 표시되고 답변 내용에 영향을 주지 않으며 광고주는 사용자의 비공개 대화에 접근할 수 없다는 원칙을 지킨다고 강조했다. 5월 Ads Manager 도입 이후 중소기업 비중이 늘었고 50개가 넘는 기술·측정 파트너와 협력하며, CPC·성과 최적화 기반 입찰이 캠페인의 대부분을 차지하고 한 이커머스 광고주는 28일간 ROAS 3배를, 한 기술 파트너는 광고 유입 트래픽의 80% 이상이 신규 고객이었다고 보고했다. OpenAI는 신뢰와 관련성, 전체 경험을 나타내는 지표가 전 세계 확장 과정에서도 계속 견고하게 유지되고 있다고 밝혔다.

> 💡 광고가 현재 대화 맥락과 더 넓은 사용 맥락을 함께 쓰도록 설계됐다는 점은 전환율을 높이는 동시에 사용자 신뢰를 지키는 경계가 '답변에 영향 없음'이라는 원칙 하나에 달려 있다는 뜻이므로, 이 원칙이 깨지는 순간 광고 수익 모델 전체의 신뢰가 흔들릴 수 있다.

---

## 클라우드 업데이트

### [Cloud CISO Perspectives: Tips on securing the water sector in the AI era](https://cloud.google.com/blog/products/identity-security/cloud-ciso-perspectives-tips-on-securing-water-sector-ai-era/)

_Google Cloud_

Google Cloud의 Cloud CISO Perspectives에서 Mandiant의 Chris Sistrunk와 Google Cloud의 Stephanie Kiel이 지정학적 갈등 속에서 위협 행위자들이 미국 수자원 시설의 인터넷에 연결된 PLC를 표적으로 삼는 상황을 다뤘다. 권고로는 인터넷에 노출된 제어 시스템 자산 인벤토리 작성, 기본 자격증명을 강력한 암호로 교체하는 기본 보안 위생, 3개 복사본·2종 저장소·1개 원격 보관을 지키는 3-2-1 백업, 네트워크 분할과 다중 인증, 기존 FEMA NIMS·ICS4ICS 체계에 통합된 비상 계획, 시스템 통합자와 유지보수 계약자의 원격 접근 감시 여섯 가지를 들었다. Mandiant의 'OT Theory of 99'는 손상된 시스템의 99%, 악성코드의 99%, 포렌식 작업의 99%, 탐지 기회의 99%, 침입 체류 시간의 99%가 모두 OT 전용 장비가 아니라 일반 컴퓨터 워크스테이션·서버에서 발생한다고 지적하며, 수동 오버라이드와 수질 검사가 안전망 역할을 하지만 기본 보안 위생이 필수라고 강조한다. 글은 기술 리더의 79%가 보안·거버넌스·운영을 AI 인프라 확장의 최대 과제로 꼽는다는 수치와, 미국 국가사이버국장실과 텍사스주가 파일럿 프로그램을 시작했다는 내용도 담았다. 글은 AI 도입이 늘어날수록 방어자 역시 AI를 활용한 탐지 강화에 나서야 한다고 덧붙인다.

> 💡 수자원 시설처럼 물리적 안전망(수동 오버라이드, 수질 검사)이 있는 OT 환경에서도 실제 침해는 OT 전용 장비가 아니라 일반 IT 워크스테이션·서버에서 99% 일어나므로, 방어 예산을 OT 고유 보안에만 쏟기보다 기본적인 IT 위생부터 갖추는 것이 더 큰 위험을 줄인다.

### [From weeks to minutes: The new agentic era of data pipelines](https://cloud.google.com/blog/products/data-analytics/build-data-pipelines-in-less-time-with-data-agent-kit/)

_Google Cloud_

Google Cloud가 IDE나 CLI에 직접 통합되는 오픈소스 데이터 엔지니어링 도구인 Data Agent Kit을 소개하며, 복잡한 Python Airflow 보일러플레이트를 작성하던 일을 자연어 프롬프트로 YAML을 생성하는 일로 바꿔 파이프라인 구축을 수주에서 수분으로 줄인다고 밝혔다. 세 핵심 기능은 파이프라인 관리를 모아둔 Data Engineering Tab, 자연어로 Apache Airflow DAG를 작성·배포·문제 해결하는 Agentic Skill, YAML DSL로 고수준 로직을 정의하는 Orchestration Pipelines Framework이다. BigQuery 쿼리 실행, 서버리스 Managed Service for Apache Spark, dbt 모델 실행, Gemini Enterprise Agent Platform 모델 관리, 조건부 파이프라인 트리거와 드리프트 감지 기반 자동 재훈련을 지원하며 VS Code와 Claude Code 등 IDE에서 실시간 모니터링과 AI 기반 진단까지 가능하다. 예시로 든 MLOps 파이프라인은 훈련·추론·평가 세 파이프라인을 2분 안에 구성할 수 있었고, 도구는 완전 무료 오픈소스로 제공된다. Google Cloud는 분석가부터 ML 엔지니어까지 모든 데이터 역할이 같은 도구를 공유하도록 설계했다고 밝혔다.

> 💡 파이프라인 작성을 자연어 프롬프트로 바꿔도 실제로 줄어드는 건 보일러플레이트 작성 시간이지, Airflow DAG나 YAML DSL이 표현하는 오케스트레이션 로직 자체를 이해할 필요는 여전히 남으므로, 데이터 엔지니어는 이 도구를 코드 작성 대체가 아니라 리뷰·검증 역할 전환으로 받아들여야 한다.

### [Introducing Adaptive Intelligence: Undermining the economics of every bot attack](https://blog.cloudflare.com/introducing-adaptive-intelligence/)

_Cloudflare_

Cloudflare가 자동화된 공격 비용을 지속 불가능할 만큼 끌어올린다는 철학으로 동작하는 새 봇 탐지 엔진 Adaptive Intelligence를 발표했다. 기존의 고정 규칙 기반 탐지는 수개월 주기로만 갱신돼 공격자가 패턴을 학습하고 명확한 yes/no 피드백으로 우회법을 다듬기 쉬웠지만, 이 엔진은 실시간 트래픽으로 지속적으로 재훈련되는 머신러닝 모델을 써서 비결정론적으로 판단해 공격자의 학습을 방해한다. 동작은 JA4 TLS 지문·요청 구조·세션 행동·네트워크 평판 같은 신호를 관찰(Observe)하고, 실시간 트래픽으로 훈련(Train)하고, 새 모델 가중치를 자동 배포(Deploy)하고, 섀도 모드에서 실사용자 영향 없이 검증(Validate)하는 4단계 루프로 이뤄진다. Cloudflare는 하루 1조 개가 넘는 요청을 분석해 이 모델을 계속 갱신하며, 예측된 기간이 지나면 자동 폐기되는 일회용 규칙도 새 회피 도구가 나온 주 안에 이를 인식해 대응한다고 밝혔다. 이런 설계는 공격자가 한 번 우회법을 찾아도 그 효과가 오래가지 못하게 만드는 것을 목표로 한다.

> 💡 고정 규칙 기반 탐지는 공격자에게 명확한 합격/불합격 신호를 줘 패턴 학습을 돕지만, 지속 재훈련되는 비결정론적 모델은 그 신호 자체를 없애므로 대규모 트래픽을 다루는 조직은 봇 탐지를 정적 룰셋이 아니라 계속 재학습하는 서비스로 바꿔야 우회 속도를 따라잡을 수 있다.

---

## DevOps & 인프라

### [SpaceX is in an “enviable position”: why Anthropic is sticking with Cursor as OpenAI cuts access](https://thenewstack.io/anthropic-spacex-cursor-compute-openai/)

_The New Stack_

OpenAI가 Cursor에 대한 모델 제공을 11월에 끊겠다고 발표한 직후, Anthropic 공동창업자이자 '최고 컴퓨트 책임자' Tom Brown이 X에 Cursor가 Sonnet 3.5 때부터 신뢰받는 파트너였고 Claude 모델 지원을 위한 컴퓨트를 계속 늘리겠다고 8월 29일 밝혔다. 기사는 이를 Anthropic의 과거 행보와 대조하는데, 2025년 5월 OpenAI가 Windsurf를 30억 달러에 인수한다는 소문이 돌자 Anthropic은 거래가 성사되기도 전에 Claude 3.5·3.7 Sonnet 접근을 끊었고 결국 그 거래는 무산돼 Google이 24억 달러로 Windsurf 창업자들을 DeepMind로 영입했으며, xAI도 올해 1월 Cursor를 통한 Claude 접근이 끊긴 전례가 있다. 차이점은 Anthropic이 SpaceX로부터 막대한 컴퓨트를 사고 있다는 점으로, 5월 6일 멤피스 인근 SpaceX Colossus 1 데이터센터의 전체 출력(300메가와트 이상, Nvidia GPU 22만 개 이상)을 확보했다고 발표했고, SpaceX의 IPO 서류에 따르면 2029년 5월까지 Colossus와 Colossus II를 합쳐 약 32만 5천 개 GPU에 대해 월 12억 5천만 달러를 지불하기로 했다. Replit 창업자 Amjad Masad와 The Pragmatic Engineer의 Gergely Orosz는 Windsurf 때는 소문만으로 가차없이 끊었던 Anthropic이 이번엔 실제 경쟁사 인수 뒤에도 파트너 관계를 유지하는 이중 기준을 지적했다. 기사는 아직 Anthropic이 이 이중 기준에 공개적으로 답하지 않았다고 전한다.

> 💡 AI 랩이 경쟁사 연관 고객의 모델 접근을 끊을지 말지는 원칙이 아니라 그 고객이 자사에 얼마나 많은 컴퓨트를 공급하는지에 달려 있을 수 있으므로, 플랫폼 종속성 리스크를 평가할 때 공급사의 경쟁 정책뿐 아니라 그 공급사의 컴퓨트 조달 관계까지 함께 봐야 한다.

### [MCP was supposed to solve the agent tooling problem. It missed a step.](https://thenewstack.io/ard-agent-discovery-specification/)

_The New Stack_

AWS가 8월 31일 Weekly Roundup에서 'DNS, but for agents'라고 설명한 오픈 스펙 ARD(Agentic Resource Discovery)를 다룬 기사다. MCP는 AI 애플리케이션이 외부 도구·데이터에 연결하는 흔한 방법이 됐지만 클라이언트가 어느 서버를 쓸지 이미 안다고 가정하기 때문에, 조직의 자원이 여러 클라우드와 SaaS, 내부 시스템에 흩어지면 문제가 커진다. ARD는 'agentic resource'라는 용어로 MCP 서버부터 다른 외부 기능까지 에이전트가 연결할 수 있는 모든 것을 지칭하며, 미리 모든 연결을 설정하는 대신 여러 레지스트리를 가로질러 검색하게 한다. 스펙은 Google의 Junjie Bu, Microsoft의 R.V. Guha, Hugging Face의 Shaun Smith가 작성해 Apache 2.0으로 공개했고 Cisco, Databricks, GitHub, GoDaddy, Nvidia, Salesforce, ServiceNow, Snowflake 엔지니어들이 참여했으며, AWS 자체 기술은 아니고 피드백을 제공하는 역할이다. 8월 26일자 v0.91 제안은 JSON-LD와 REST 인터페이스를 쓰며 필수 POST /search 엔드포인트로 과제 기준 검색을 지원하고, Route 53을 다루는 AWS 엔지니어 Jeffrey Damick과 Bhargav Talluri가 DNS 비유를 주도했지만 도메인명이 한 위치를 가리키는 DNS와 달리 ARD 검색은 여러 후보를 반환할 수 있어 비유가 완전히 들어맞지는 않는다고 짚는다.

> 💡 MCP가 도구 연결 자체는 표준화했지만 '어느 서버를 쓸지 찾는' 단계를 빼먹었다는 공백을 ARD가 벤더 중립적 레지스트리 연합으로 메우려 하므로, 수백 개 MCP 서버를 내부에 보유한 조직은 이 검색 계층을 직접 쌓는 대신 표준에 올라탈 시점을 고민해야 한다.

### [Google’s new forecasting model beats everyone. You can’t use it at work (yet).](https://thenewstack.io/google-timesfm-3-multivariate-forecasting/)

_The New Stack_

Google이 월요일 3억 3천만 파라미터 시계열 예측 모델 TimesFM-3를 공개했다. 1조 개가 넘는 실제·합성 데이터 포인트로 사전학습됐고 Hugging Face에서 비상업 라이선스로 제공되며, 구글 연구원 Ayush Jain과 Rajat Sen은 실제 예측 문제는 대부분 여러 시계열과 외부 특징이 함께 영향을 주는 다변량 문제라고 설명한다. 아키텍처는 디코더 온리 트랜스포머로 시계열을 32개 데이터 포인트 단위 패치로 나누고, 시간축을 인과적으로 보는 attention과 같은 시점의 여러 시계열을 가로로 보는 attention을 교차시키며, 이전 버전이 패치를 하나씩 순차 생성하던 방식 대신 전체 예측 구간에 마스킹된 자리표시자 토큰을 붙여 한 번의 순전파로 채운다. Salesforce의 Gift-Eval, Amazon/AutoGluon의 FEV-Bench, Time 벤치마크에서 Chronos-2·Moirai 2.0·Datadog의 Toto 2.0을 앞섰고, 2025년 9월 출시 당시 최고였던 TimesFM-2.5는 이제 벤치마크 최하위로 밀렸다. TimesFM-2.5와 Toto 2.0, Chronos-2는 여전히 Apache 2.0이지만 TimesFM-3의 사전학습 가중치는 비상업·비프로덕션 용도로만 허용되는 별도 라이선스를 쓰며, 소스 코드만 Apache 라이선스를 유지하고, Google은 곧 자사 데이터 웨어하우스의 AI.FORECAST 명령에서 TimesFM-2.5를 이 모델로 교체할 예정이다.

> 💡 최신 SOTA 모델의 소스 코드는 공개하면서 사전학습 가중치만 비상업 라이선스로 가두는 구조가 확산되면, 클라우드 엔지니어는 벤치마크 1위 모델을 그대로 프로덕션에 못 쓰고 제공자의 관리형 서비스로 우회해야 하는 선택을 더 자주 만나게 된다.

### [Testing cookie behavior across hundreds of web surfaces with our in-house auditor](https://dropbox.tech/security/how-our-inhouse-auditor-tests-cookie-behavior-across-hundreds-of-web-surfaces)

_Dropbox_

Dropbox가 쿠키 배너가 계속 의도대로 작동하는지 검증하는 자체 개발 감사 도구를 소개했다. Playwright 브라우저 자동화로 격리된 새 세션을 열어 미국 방문자, EU 방문자, Global Privacy Control 신호를 보내는 방문자라는 세 시나리오를 재현하고, 각 시나리오에서 먼저 쿠키 로드 상태를 기록한 다음 필수가 아닌 쿠키를 거부하고 페이지를 새로고침해 선택이 계속 유지되는지 확인한다. 이 감사는 Dropbox가 운영하는 200개가 넘는 웹 표면을 22개 언어로 주간 보고서를 내며 커버하고, 트래픽 기록 수십억 건을 분석해 감사 대상 페이지 목록을 자동으로 유지하는 'URL 감지기'라는 동반 도구도 함께 개발했다. 이런 자동화 없이는 페이지 수백 개를 언어별로 사람이 직접 점검해야 해 감사 주기가 훨씬 느려졌을 것이다. 감사 결과는 주간 보고서로 정리돼 담당팀이 회귀를 빠르게 추적할 수 있게 한다.

> 💡 코드 변경이 배포될 때마다 쿠키 배너의 실제 동작이 조용히 깨질 수 있으므로, 수백 개 웹 표면을 운영하는 조직이라면 수동 점검이 아니라 브라우저 자동화로 세 가지 방문자 시나리오를 주기적으로 재현하는 회귀 테스트가 규제 준수의 실질적 안전망이 된다.

### [Fin's CTO on Building Great Engineering Organizations in the AI Era](https://www.honeycomb.io/blog/fin-cto-building-great-engineering-organizations-ai-era)

_Honeycomb_

Honeycomb 블로그가 Fin(옛 Intercom) CTO Darragh Curran의 인터뷰를 전했다. Curran은 R&D 생산성을 2배로 올리겠다고 공개 목표를 세웠지만 실제로는 거의 3배에 가까운 성과를 냈다고 밝혔다. 핵심은 AI 기반 PR 검토로, 에이전트가 코드 diff만 보는 게 아니라 실행 경로를 추적해 변경의 실제 영향을 파악하며 상당 부분이 인간 검토자 없이 배포되지만 언제든 인간이 검토를 요청할 수 있는 안전장치를 남겨둔다. 그는 조직의 핵심을 '일을 하고, 배우고, 다음을 한다'는 단순한 루프로 정의했고, 품질이 기준 이하로 떨어지면 사용자 신뢰를 잃는다는 전제 아래 속도·비용·오류를 지속적으로 모니터링하는 관찰성을 신뢰 메커니즘으로 삼았다고 말했다. Curran은 이런 전환기에 리더가 오히려 더 직접적으로 개입해야 한다고 말했다.

> 💡 AI 리뷰가 코드 diff뿐 아니라 실행 경로까지 추적해야 인간 검토자를 빼고도 배포할 수 있다는 신뢰를 얻을 수 있으므로, 단순 diff 기반 리뷰만 갖춘 조직은 생산성 3배 같은 수치를 목표로 잡기 전에 리뷰 에이전트의 관찰 범위 자체를 먼저 넓혀야 한다.

### [Optimize EKS operations with agents: Reduce MTTR with AWS DevOps Agent and a Kubernetes Operator](https://aws.amazon.com/blogs/devops/optimize-eks-operations-with-agents-reduce-mttr-with-aws-devops-agent-and-a-kubernetes-operator/)

_AWS DevOps_

AWS가 EKS에서 OOMKilled나 IP 소진 같은 장애 조사를 자동화해 MTTR을 줄이는 AWS DevOps Agent와 쿠버네티스 Operator를 소개했다. 기존 도구는 부족했는데, K8sGPT는 현재 리소스 상태만 분석하고 Amazon Bedrock Agents는 도구 연동을 수동으로 설정해야 해 엔드투엔드 자동 조사가 안 됐다. Operator는 kubelet 상태 변화로 장애를 밀리초 단위로 감지해 파드가 재스케줄되기 전에 증거를 S3·CloudWatch에 보존하고, SSM으로 kubectl 범위를 벗어난 dmesg·IPAMD 같은 노드 레벨 정보까지 수집하며, OOMKilled면 dmesg와 메모리를, CrashLoopBackOff면 이전 로그를 확인하는 식으로 장애 유형별 운영 지식을 코드화한다. 실제 사용 사례에서는 processed_records 리스트에 제거 로직이 없어 분당 약 20메가바이트씩 누적되다가 약 10분 만에 200메가바이트 제한을 초과해 OOMKilled가 발생한 메모리 누수를 찾아냈고, 배포는 N. Virginia·Oregon·Frankfurt·Ireland·Sydney·Tokyo 6개 리전에서 EC2 관리형 노드 그룹(Fargate 미지원)과 AmazonSSMManagedInstanceCore 정책, EKS Pod Identity Agent 애드온이 필요하다.

> 💡 kubectl이 보는 범위를 넘어서는 노드 레벨 증거(dmesg, IPAMD)를 파드가 재스케줄되기 전 밀리초 단위로 보존해야 사후 조사가 가능하므로, EKS 운영팀은 장애 발생 시점이 아니라 파드 상태 변화 감지 시점부터 증거 수집 파이프라인을 설계해야 한다.

### [How Bits Database Optimization proves a query rewrite is faster](https://www.datadoghq.com/blog/how-bits-database-optimization-proves-a-query-rewrite-is-faster/)

_Datadog_

Datadog의 Database Monitoring 기능인 Bits Database Optimization이 어떻게 쿼리 재작성이 실제로 더 빠른지 증명하는지를 다뤘다. 이 기능은 프로덕션 데이터 없이도 위험을 없애기 위해 Datadog Agent가 수집한 테이블 정의와 인덱스 정보로 Datadog 인프라 안에 일회용 데이터베이스 인스턴스를 만들어 프로덕션 스키마를 재현하고, 카디널리티와 컬럼별 분포를 맞춘 합성 데이터로 채운다. 이 환경에서 원본 쿼리와 재작성된 쿼리를 각각 50회 반복 실행해 서버가 보고한 실행 시간, 논리적 읽기(캐시·스토리지에서 접근한 블록 수), 더티 블록(기록이 필요한 수정된 블록 수) 세 가지를 측정하고, 평균·중앙값·p95·최댓값 네 통계 중 세 개 이상에서 세 항목 모두 20%를 넘는 개선이 나와야 재작성을 추천한다. 정확도 검증 결과 쿼리 플래너의 비용 추정치는 중앙값 기준 1.00~1.05배, p95 기준 1.00~1.24배로 실제와 가까웠고, 실제 블록 접근량 기준 읽기 충실도는 쿼리 유형에 따라 중앙값 1.04~2.34배 차이를 보였으며, 현재는 PostgreSQL만 지원하고 MySQL·SQL Server·Oracle은 추후 지원 예정이다. Datadog는 이 접근이 프로덕션 자격증명 없이도 재작성 제안의 신뢰도를 수치로 보여준다는 점을 강조한다.

> 💡 쿼리 재작성 제안을 프로덕션에 직접 적용하기 전에 카디널리티와 분포를 맞춘 합성 데이터로 재현한 일회용 인스턴스에서 먼저 검증하면, 운영 권한이 없는 도구도 특권 자격증명 없이 벤치마크 신뢰도를 확보할 수 있다.

### [Respond to security threats faster with Tines and Observability Pipelines](https://www.datadoghq.com/blog/tines-observability-pipelines-security-automation/)

_Datadog_

Datadog가 보안 자동화 플랫폼 Tines와 Observability Pipelines의 연동 사례를 소개했다. 보안팀이 겪는 문제는 여러 형식으로 쏟아지는 시끄러운 로그와, 대응을 늦추는 수작업 단계다. Observability Pipelines가 로그를 표준화하고 라우팅하는 동안 Tines는 파이프라인 API를 호출해 실시간으로 로그 처리 방식을 바꾼다. 예를 들어 직원 오프보딩 시 Tines 워크플로가 Okta 계정을 비활성화하면서 동시에 해당 사용자의 로그에 security:high와 offboarded:true 태그를 자동으로 붙인다. 다른 예로 Tines가 ServiceNow CMDB에서 알려진 스캐너 IP를 확인해 Reference Table을 갱신하면 Observability Pipelines가 그 IP의 로그를 걸러내며, 분석가가 의심 사용자 ID를 입력하면 해당 사용자의 모든 로그에 security:high 태그가 실시간으로 붙는다.

> 💡 로그 파이프라인을 정적 라우팅 계층이 아니라 보안 워크플로에서 API로 실시간 제어되는 대상으로 바꾸면, 오프보딩이나 위협 조사 같은 반복 작업에서 수동 태깅·필터링 단계를 없애 대응 시간을 줄일 수 있다.

### [Troubleshoot and secure your code faster with Datadog’s Bitbucket Cloud Source Code integration](https://www.datadoghq.com/blog/bitbucket-cloud-source-code-integration/)

_Datadog_

Datadog가 Bitbucket Cloud용 소스 코드 통합 기능을 출시했다. 저장소를 연결하면 Static Code Analysis, Software Composition Analysis, Secret Scanning, Infrastructure as Code Security로 코드를 분석해 개발자가 Datadog와 Bitbucket 양쪽에서 같은 발견 사항을 확인하고 바로 수정 경로로 이동할 수 있다. 코드 인식 APM 기능은 애플리케이션 원격 측정 데이터를 특정 저장소와 커밋에 연결해, Error Tracking과 Continuous Profiler 같은 도구에서 스택 프레임을 실제 소스 코드와 바로 이어준다. PR 화면에는 Code Coverage와 Test Optimization이 테스트 커버리지와 실패·플레이키 테스트를 보여주고, Code Security는 변경된 라인에 새로 생긴 취약점과 설정 오류를 표시한다. 엔지니어는 트레이스에서 곧바로 영향받은 소스 파일로 이동할 수 있고, 리뷰어는 Bitbucket 화면을 벗어나지 않고 테스트·보안 피드백을 볼 수 있다.

> 💡 런타임 트레이스와 PR 화면을 같은 커밋 기준으로 묶어두면, 장애 원인 파일을 찾는 일과 보안·테스트 리뷰가 별도 도구를 오가지 않고 한 흐름에서 끝나 MTTR과 리뷰 지연을 동시에 줄인다.

### [같은 장애를 두 번 겪지 않기 위해, 배포 전에 리뷰합니다 — KRIS 개발기](https://tech.kakao.com/posts/831)

_카카오_

카카오가 배포 전 리스크를 잡는 에이전트 KRIS(Kakao Risk Inspection Service)를 소개했다. AI 코드 리뷰 서비스 코드버디가 응답 품질은 계속 좋아졌지만 "이 변경이 과거 장애 패턴과 닮았는가"는 보지 못한다는 문제에서 출발했다. 사내 장애를 분류해보니 사람의 실수가 과반이었고 그중 소스코드 오류가 약 40%, 설정값 오류가 약 20%를 차지해, 반복되는 패턴을 배포 전에 검색 가능한 형태로 되돌려 보낼 여지가 있다고 판단했다. KRIS는 GitHub PR과 사내 배포시스템의 diff를 Compare Provider로 추출하고, Policy RAG로 관련 규칙을 검색한 뒤 규칙별 판정 로직으로 위반 여부를 가리고, 마지막으로 LLM이 환경·설정·인프라 3축으로 심각도를 재평가하는 순서로 동작한다. 규칙 위반 여부는 같은 입력이면 항상 같은 결과가 나오는 코드가 판정하고 심각도만 LLM이 맥락에 따라 정하도록 역할을 나눠 판정이 매일 달라지는 문제를 막았고, 분석에 실패하거나 권한이 부족한 경우는 LOW가 아닌 별도의 UNKNOWN 상태로 남긴다.

> 💡 장애 원인을 사후 회고 문서에만 남기지 않고 배포 직전 diff와 대조 가능한 규칙으로 바꿔두면, 같은 조직에서 반복되는 실수를 범용 코드 리뷰나 보안 스캐너가 잡지 못하는 지점에서 한 번 더 막을 수 있다.

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
