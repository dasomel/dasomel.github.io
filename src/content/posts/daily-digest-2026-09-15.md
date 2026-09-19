---
title: "📰 데일리 테크 다이제스트 - 2026-09-15"
description: "2026-09-15 Cloud, Kubernetes, AI, DevOps 소식 19건 — 자동 큐레이션 다이제스트."
pubDate: 2026-09-15
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### AI’s best coding agent fails 60% of the time — and the data backs it up

The New Stack가 다룬 Real-SWE 벤치마크는 Y Combinator 출신 스타트업 Specific Labs가 만든 것으로, 공개 저장소 문제 대신 실제 기업의 비공개 코드베이스에 에이전트를 투입해 평가한다. 1위인 Claude Code 기반 Fable 5.1은 정답률 38.8%로 1위를 차지했고, Codex CLI의 GPT-6 Astra가 33.8%, Gemini CLI의 Gemini 3.8 Flash가 31.2%로 뒤를 이었다. 즉 최상위 에이전트조차 처음 보는 프로덕션 코드에서는 60% 이상 실패한다는 뜻이다. 실패 원인은 대부분 요구사항 누락, 통합 오류, 검증되지 않은 가정으로 분석됐다. 이는 공개 벤치마크 성적이 낯선 프로덕션 코드베이스 탐색 능력과는 별개라는 점을 시사한다. 벤치마크 결과는 모델 선택 시 마케팅 수치보다 실제 사내 코드 유형에 가까운 평가를 봐야 한다는 근거로 인용되고 있다.

> 💡 **왜 중요한가**: 플랫폼팀은 코딩 에이전트를 사내 CI/PR 파이프라인에 도입할 때 공개 벤치마크 점수를 그대로 신뢰하지 말고, 반드시 자사 코드베이스 표본으로 실패율과 실패 유형(요구사항 누락·통합 오류)을 별도 검증해야 한다.

🔗 [원문 보기](https://thenewstack.io/real-swe-coding-benchmark/) · _The New Stack_

---

## Kubernetes & Cloud Native

### [Kubernetes Changed Block Tracking API - Beta Differences](https://kubernetes.io/blog/2026/09/14/csi-changed-block-tracking-beta/)

_Kubernetes_

CSI 드라이버용 CBT(Changed Block Tracking)는 2025년 9월 알파로 처음 출시됐고, 2026년 3월 external-snapshot-metadata 프로젝트 v1.0.0 릴리스와 함께 베타로 승격됐다. 이번 베타에서 가장 큰 변화는 SnapshotMetadataService CRD를 v1alpha1에서 v1beta1로 승격한 것인데, 이전 버전을 함께 서빙하지 않고 아예 제거했기 때문에 사용자는 수동으로 한 번 업그레이드 작업을 거쳐야 한다. CBT는 동일 PersistentVolume에 속한 두 CSI VolumeSnapshot 사이의 변경된 블록, 혹은 할당된 블록 메타데이터를 안전하게 조회할 수 있는 API로, CSI 드라이버가 이를 구현하면 효율적인 증분(디퍼렌셜) 백업이 가능해진다. 현재 범위는 블록 볼륨에 한정되며, 파일 볼륨이나 네트워크 파일 공유의 변경 목록 추적은 포함하지 않는다. 베타 사이클의 남은 기간에는 GA 승격을 향해 더 많은 CSI 드라이버의 채택과 운영 피드백 확보에 집중한다는 계획이다. 이 글은 2026년 9월 14일 쿠버네티스 공식 블로그에 게재됐다.

> 💡 증분 백업에 CBT를 이미 알파로 쓰고 있던 클러스터라면 SnapshotMetadataService가 v1alpha1을 그대로 제거하고 v1beta1로 넘어가므로, GA 이전이라도 무중단 마이그레이션 계획 없이 업그레이드하면 백업 파이프라인이 끊길 수 있다.

### [Kubernetes v1.37: Memory QoS Graduates to Beta](https://kubernetes.io/blog/2026/09/14/kubernetes-v1-37-memory-qos-graduates-to-beta/)

_Kubernetes_

쿠버네티스 v1.37에서 Memory QoS 기능이 베타로 승격되며 기본 활성화됐다. 이 기능은 cgroup v2를 사용하는 리눅스 노드에서 메모리 컨트롤러를 활용해 커널에 컨테이너 메모리 처리 방식에 대한 더 나은 힌트를 제공한다. 2022년 v1.22에서 알파로 처음 도입됐고, v1.36에서는 계층형 메모리 예약(tiered memory reservation) 기능이 추가되며 확장됐다. 베타 승격에 따라 v1.37 kubelet에서는 별도 설정 없이도 MemoryQoS 기능 게이트가 켜져 있지만, 기본 kubelet 설정은 메모리 스로틀링이나 예약을 활성화하지 않으므로 명시적으로 구성하지 않는 한 memory.high, memory.min, memory.low 값이 cgroup에 기록되지 않아 안전하다. 핵심 변경점은 memoryThrottlingFactor의 기본값이 0.9에서 null로 바뀐 것으로, 업그레이드 시 하위 호환성을 지키기 위해 명시적으로 설정하지 않으면 더 이상 memory.high가 자동으로 설정되지 않는다. 클러스터 운영자는 memoryReservationPolicy를 통해 메모리 스로틀링, 계층형 예약, 둘 다, 또는 기능 자체 비활성화까지 선택적으로 구성할 수 있다.

> 💡 MemoryQoS가 기본 활성화되지만 명시적 설정 전에는 동작이 바뀌지 않으므로, v1.37로 업그레이드하는 클러스터 운영자는 지금이 OOM킬 대신 memory.high/memoryReservationPolicy를 의도적으로 튜닝해 워크로드별 메모리 QoS 정책을 도입할 적기다.

### [Cilium 1.20: Gateway API ExternalAuth, TCPRoute/UDPRoute, ENI IPAM for IPv6, and more](https://www.cncf.io/blog/2026/09/14/cilium-1-20-gateway-api-externalauth-tcproute-udproute-eni-ipam-for-ipv6-and-more/)

_CNCF_

CNCF 블로그가 실리움(Cilium) 1.20 릴리스를 소개했다. 게이트웨이 API 지원이 v1.4에서 v1.6으로 올라가면서 ExternalAuth 필터(GEP-1494 기반), CORS 필터, ListenerSets, 그리고 HTTP/gRPC 외 트래픽을 위한 TCPRoute·UDPRoute가 추가돼 기존에 쓰던 것과 동일한 게이트웨이 API로 L4 서비스까지 관리할 수 있게 됐다. ExternalAuth 필터를 쓰면 HTTPRoute로 들어오는 요청이 애플리케이션에 도달하기 전에 외부 서비스를 통해 인증·인가를 거치도록 만들 수 있다. IPAM 측면에서는 AWS ENI IPAM 모드가 베타로 IPv6를 지원하게 됐는데, 오퍼레이터가 Prefix Delegation을 통해 각 노드의 ENI에 IPv6 /80 프리픽스를 붙이고 에이전트가 그 범위 안에서 파드 주소를 할당하는 방식이다. 또한 구글이 개발에 참여한 확장 가능한 eBPF 데이터패스 플러그인이 도입돼, 실리움을 폐쇄형 네트워킹 어플라이언스가 아니라 클라우드 제공업체가 실리움 릴리스 주기와 독립적으로 자체 eBPF 프로그램을 얹을 수 있는 안정된 코어를 가진 '네트워크 운영체제'에 가깝게 만든다는 설명이다.

> 💡 게이트웨이 API가 TCPRoute/UDPRoute까지 지원하게 되면서 L4·L7 트래픽 관리 도구를 하나로 통합할 수 있으므로, 별도 L4 로드밸런서 설정을 유지해온 클러스터는 실리움 1.20 업그레이드 시 게이트웨이 리소스 통합을 검토할 만하다.

---

## AI & ML

### [Watch astronaut Christina Koch and Google’s James Manyika discuss space, technology, and discovery.](https://blog.google/innovation-and-ai/technology/ai/dialogues-christina-koch/)

_Google AI_

구글 블로그의 '테크놀로지와 사회에 관한 대화(Dialogues on Technology and Society)' 시리즈 최신 편에서 NASA 우주비행사 크리스티나 코크와 구글의 리서치·랩스·테크놀로지&소사이어티 수석부사장 제임스 마니이카가 대담을 나눴다. 코크는 국제우주정거장(ISS)에서 328일을 체류했고 사상 최초의 전원 여성 우주유영을 수행했으며, NASA 아르테미스 II 임무로 달 주위를 도는 여정에도 참여한 이력이 있다. 대담에서는 250,000마일 떨어진 우주에서 지구를 '전기빛 파란 구명정'으로 바라본 경험, 그리고 심우주 탐사·AI·사회적 회복력이 어떻게 맞물리는지가 논의됐다. 특히 장기 임무에서 로봇공학과 머신러닝이 승무원의 위험 완화 및 선외활동 효율화에 어떻게 필수적인 역할을 하는지가 다뤄졌다. 코크는 '우리는 혼자인가'라는 질문도 던지며, 미래 탐험가들에게 두려운 일을 하고 주변 사람들을 지지하라는 조언을 남겼다. 이 대담은 2026년 9월 14일 구글 블로그에 게재됐고 유튜브 영상으로도 공개됐다.

> 💡 이 콘텐츠는 제품·인프라 실무와 직접 관련은 없지만, NASA 임무 사례처럼 자율 로보틱스와 사람 운영자가 함께 일하는 구조는 온콜 대응을 사람이 전담하지 않고 AI 에이전트와 관측가능성 도구가 상시 보조하는 최근 운영 트렌드와 맥이 닿아 있다는 점에서만 참고할 가치가 있다.

### [DevFest is back](https://blog.google/innovation-and-ai/technology/developers-tools/devfest2026/)

_Google AI_

구글 개발자 그룹(GDG) 주도의 데브페스트(DevFest) 2026 시즌이 2026년 10월 1일부터 12월 31일까지 열린다. 115개국에서 800개가 넘는 지역 행사가 열리며 전 세계적으로 약 100만 명의 개발자와 빌더가 참여할 것으로 예상되는, 커뮤니티 주도 기술 컨퍼런스로는 세계 최대 규모다. 이번 시즌의 주제는 '빌드, 시큐어, 스케일: 에이전틱 시대의 개발자와 빌더(Build, Secure, Scale: Developers and Builders in the Agentic Era)'로, 실습 중심의 참여를 강조한다. 참가자들은 Gemini, Google AI Studio, Google Antigravity, Google Cloud, Firebase, Android, Flutter, Angular, Web MCP 등 구글의 기술 스택 전반을 라이브 코드랩, 기술 워크숍, 에이전트톤(agent-athon) 형태로 직접 다뤄볼 수 있다. 각 GDG는 구글의 후원을 받으면서도 자체적으로 의제를 구성해 지역 기술 생태계의 특성과 요구에 맞춰 행사를 조정한다는 점이 특징이다.

> 💡 800개 이상의 지역 행사에서 Google Antigravity·Web MCP 등 최신 에이전틱 툴체인을 실습형 코드랩으로 접할 수 있으므로, 사내 플랫폼팀은 자사 지역 GDG 일정을 확인해 팀원 교육이나 채용 파이프라인으로 활용할 만하다.

### [How Fyxer built an AI executive assistant people trust](https://openai.com/index/fyxer)

_OpenAI_

OpenAI 블로그는 이메일 비서 스타트업 픽서(Fyxer)가 어떻게 신뢰받는 AI 이그제큐티브 어시스턴트를 만들었는지 소개한다. 픽서는 OpenAI 모델을 기반으로, 지도 학습 파인튜닝(SFT)과 LoRA(Low-Rank Adaptation)를 조합해 과업별 특화 모델 변형을 만들면서도 학습 비용을 통제하고, 사용자가 초안을 수정한 내역에서 도출한 직접 선호 최적화(DPO)로 초안 품질을 계속 개선하며 A/B 테스트로 변경사항을 검증한다. 시스템은 50만 시간 이상 축적된 사람 이그제큐티브 어시스턴트 업무 데이터를 학습에 활용했고, 하나의 거대 생성 모델 대신 분류·의도 예측·메모리 검색·초안 생성을 나눠 맡는 30~50개의 특화 모델로 작업을 분산한다. 그 결과 AI가 작성한 초안의 53%가 수정 없이 그대로 채택되고, 90일 시점 사용자 유지율이 90%에 달하며, 2025년 한 해 매출이 100만 달러에서 3,200만 달러(ARR)로 성장했다고 밝혔다. 배포 이후에도 시스템은 실제 사용자 피드백을 통해 계속 개선되는 구조다. OpenAI는 픽서를 범용 모델 위에 파인튜닝과 메모리 기반 개인화를 얹으면 일반적인 답변이 아니라 특정 개인의 어조와 업무 습관에 맞춰갈 수 있다는 사례로 제시한다.

> 💡 픽서 사례는 하나의 거대 모델 대신 30~50개의 소형 특화 모델과 사용자 수정 이력 기반 DPO를 결합한 구조가 실사용 채택률(53%)로 이어졌다는 점에서, 사내 생성형 AI 기능을 설계할 때도 단일 대형 모델보다 태스크 분해와 실사용 피드백 루프를 우선 고려할 근거가 된다.

---

## 클라우드 업데이트

### [Agent-ready analytics: Unlocking insights with BigQuery augmented analytics](https://cloud.google.com/blog/products/data-analytics/bigquery-augmented-analytics-tvfs/)

_Google Cloud_

빅쿼리(BigQuery)에 AI·ML·통계 기법을 결합해 인사이트 발견과 패턴 설명을 자동화하는 증강 분석(augmented analytics) 테이블값 함수(TVF) 6종이 새로 추가됐다. AI.KEY_DRIVERS는 기간·그룹 간 지표 변화의 주요 원인을 식별하고, AI.CAUSAL_EFFECT는 반사실적(counterfactual) 기준선으로 특정 행동·이벤트의 영향을 정량화하며, ML.CORRELATION·ML.DETECT_CHANGE_POINTS·ML.TREND·ML.SEASONALITY가 각각 상관관계, 구조적 변화 시점, 추세, 주기성을 분석한다. 이 함수들은 서로 체이닝할 수 있어 한 함수의 출력을 다음 분석 단계의 입력으로 쓸 수 있고, 수백만 개의 개별 시계열에 걸쳐서도 실행 가능하다. 실제 예시로 오스틴 자전거 대여 데이터를 분석한 사례가 소개됐는데, ML.DETECT_CHANGE_POINTS로 2018년 2월 11일의 구조적 변화를 찾아낸 뒤 AI.KEY_DRIVERS로 UT 학생 멤버십이 7,167.1% 급증한 것이 원인임을 밝혀냈고, AI.CAUSAL_EFFECT는 ARIMA_PLUS 기반 반사실적 모델링으로 358% 증가·89,775건의 추가 이용 건수를 산출했다. 이 함수들은 빅쿼리의 대화형 분석(Conversational Analytics)에서 자연어 질의로도 사용할 수 있고, 구조화된 SQL 출력을 그대로 AI 에이전트의 스킬로 통합할 수 있다.

> 💡 체이닝 가능한 TVF로 change-point 탐지부터 원인 분석까지 SQL 한 파이프라인 안에서 끝낼 수 있으므로, 지표 이상 탐지를 별도 BI 도구 없이 빅쿼리 쿼리 잡이나 알림 파이프라인에 바로 내재화할 수 있다.

### [Announcing Pause/Resume and NVIDIA RTX PRO 6000 Blackwell GPU support in Dataflow](https://cloud.google.com/blog/products/data-analytics/new-dataflow-features-to-enable-large-scale-ai-workloads/)

_Google Cloud_

구글 클라우드가 데이터플로우(Dataflow) 배치 작업의 일시정지·재개(Pause/Resume) 기능을 정식 출시(GA)하고, NVIDIA RTX PRO 6000 Blackwell GPU 지원을 발표했다. Pause/Resume은 실패한 장시간 배치 작업을 처음부터 다시 돌리지 않고 이어서 재개할 수 있게 하며, 우선순위가 낮은 작업의 GPU·TPU 자원을 우선순위가 높은 작업으로 동적으로 재할당하는 데도 쓸 수 있다. 특히 며칠씩 걸리는 배치 작업에서 컴퓨팅 낭비를 줄이고 개발 생산성을 높이는 것이 목적이다. NVIDIA RTX PRO 6000 Blackwell GPU는 96GB vGPU 메모리와 1.6TB/s 대역폭을 갖춘 G4 VM에서 제공되며, 기존 L4 GPU 대비 상당한 성능 향상과 함께 700억 파라미터 이상 모델의 추론까지 지원한다. RunInference, 라이트 피팅(right fitting), GPU 오토스케일링 같은 데이터플로우 ML 기능이 이 GPU에서 네이티브로 동작해, 별도 인프라 관리 없이 데이터플로우 작업 내에서 직접 AI 추론을 수행할 수 있다. 이 발표는 구글 클라우드 제품 매니저 에페사 오리그보와 소프트웨어 엔지니어 대니 매코믹이 2026년 9월 14일 블로그를 통해 공개했다.

> 💡 Pause/Resume GA와 GPU 동적 재할당을 조합하면 며칠 걸리는 배치 작업의 실패 재시작 비용과 유휴 GPU/TPU 비용을 동시에 줄일 수 있으므로, 대규모 배치 파이프라인을 운영하는 팀은 우선순위 기반 선점 전략을 재설계해볼 가치가 있다.

### [Google is a leader in The Forrester Wave™: Public Cloud Platforms, Q3 2026](https://cloud.google.com/blog/products/compute/forrester-wave-public-cloud-platforms-q3-2026-report/)

_Google Cloud_

구글 클라우드가 '포레스터 웨이브: 퍼블릭 클라우드 플랫폼, 2026년 3분기(Q3)' 보고서에서 리더로 선정됐으며, '현재 제공(current offering)' 부문에서 가장 높은 점수를 받았다. 평가 항목 30개 중 23개에서 만점인 5점을 받았고, 비전·혁신·AI 개발 서비스·데이터베이스 서비스·분석 서비스·컨테이너 및 쿠버네티스 서비스 등에서 최고 점수를 기록했다. 구글은 자사의 경쟁력을 TPU, 트랜스포머 아키텍처, 쿠버네티스, Axion 프로세서, Gemini 모델을 아우르는 '실리콘부터 시스템, 모델까지'의 통합 AI 스택에서 찾는다. 에이전트 실행 관련해서는 GKE 에이전트 샌드박스(정식 출시)와 Cloud Run 샌드박스(프리뷰)가 1초 이내, 초당 최대 300개 샌드박스 프로비저닝 속도로 신뢰할 수 없는 에이전트 코드를 기본 차단(default-deny) 보안으로 실행하고, GKE 파드 스냅샷은 컨테이너 메모리를 클라우드 스토리지에 직렬화해 유휴 컴퓨팅 비용을 최대 90% 절감하며(정지 약 100ms, 재개 약 280ms), GKE 추론 게이트웨이는 예측 라우팅으로 최초 토큰 응답 시간(TTFT)을 최대 70% 단축한다. 포레스터는 구글 클라우드가 '에이전틱 엔터프라이즈'를 목표로 하는 비전과, 이미 플랫폼 전반에 스며든 AI를 갖춰 빠른 기술 혁신을 원하는 기업에 적합하다고 평가했다. 이번 2026년 3분기 보고서는 가장 비중 있는 퍼블릭 클라우드 사업자 10곳을 앞서 언급한 30개 기준으로 평가했는데, 구글 클라우드가 그중 최고 종합 점수를 받아 나머지 사업자들을 앞섰다.

> 💡 GKE 파드 스냅샷의 유휴 컴퓨팅 비용 90% 절감과 추론 게이트웨이의 TTFT 70% 단축은 수치가 구체적인 만큼, 에이전트 워크로드를 GKE에서 운영 중이라면 두 기능의 적용 가능성부터 우선 검토할 만하다.

### [Red Hat is named a Leader in IDC MarketScape: Worldwide Private and Hybrid Cloud Management with Automation](https://www.redhat.com/en/blog/red-hat-named-leader-idc-marketscape-worldwide-private-and-hybrid-cloud-management-automation)

_Red Hat_

레드햇은 IDC 마켓스케이프(MarketScape)의 '전 세계 프라이빗 및 하이브리드 클라우드 관리 자동화 2026' 벤더 평가(문서번호 US54644626e, 2026년 6월)에서 리더로 선정됐다고 밝혔다. 다만 원문 기사에는 접근하지 못해 어떤 제품군(예: 앤서블 오토메이션 플랫폼 등)이 평가 대상이었는지, 경쟁사 대비 구체적으로 어떤 강점이 언급됐는지, 리더 사분면 내 위치 등 세부 내용은 확인하지 못했다. 발췌문 기준으로는 이 보고서가 '전 세계 프라이빗 및 하이브리드 클라우드 관리 자동화' 시장을 다루는 2026년 벤더 평가라는 점만 확인된다. 레드햇이 이 카테고리에서 리더로 이름을 올렸다는 사실 자체는 하이브리드 클라우드 자동화 시장에서의 포지셔닝을 보여주는 신호로 볼 수 있다. 원문을 확인하지 못해 제목과 발췌 정보만으로 작성함.

> 💡 3자 애널리스트 리포트에서의 '리더' 선정 발표는 제품 도입 판단의 근거로 삼기보다, 실제 평가 기준과 경쟁사 대비 항목별 점수를 원문 리포트에서 직접 확인한 뒤 조달 의사결정에 반영해야 한다.

### [Modernizing Microsoft SQL Server: Choosing the right path with Red Hat](https://www.redhat.com/en/blog/modernizing-microsoft-sql-server-choosing-right-path-red-hat)

_Red Hat_

레드햇 블로그 글 '마이크로소프트 SQL 서버 현대화: 레드햇과 함께 올바른 경로 선택하기'는 애플리케이션을 컨테이너로 옮기고 쿠버네티스를 도입해 클라우드 네이티브가 되는 것이 흔히 현대화의 '목적지'처럼 제시되지만, 실제 조직의 현실과 의지는 그보다 더 다양하다는 문제의식에서 출발한다. 다만 원문 기사에는 접근하지 못해 레드햇이 실제로 제시하는 구체적인 경로 옵션(예: RHEL에서의 SQL 서버 운영, OpenShift 컨테이너화, 특정 마이그레이션 도구나 파트너십 세부사항)은 확인하지 못했다. 검색을 통해 확인한 레드햇의 기존 자료들은 SQL 서버가 RHEL 인증을 받았고 온프레미스·애저 가상머신·OpenShift 컨테이너 등 다양한 방식으로 배포 가능하며, 앤서블 오토메이션 플랫폼으로 설치·관리를 자동화할 수 있다는 일반적인 내용을 다루지만, 이것이 이번 2026년 9월 14일자 글의 구체적 주장과 일치한다고 확신할 수는 없다. 따라서 이번 글에서는 확인되지 않은 세부사항을 추측해 넣지 않고 발췌문 수준의 내용만 반영했다. 원문을 확인하지 못해 제목과 발췌 정보만으로 작성함.

> 💡 SQL 서버 현대화 경로를 단일 목적지(컨테이너·쿠버네티스)로 단정하기 전에, 벤더가 제시하는 여러 경로 옵션의 실제 마이그레이션 리스크와 라이선스 비용 차이를 원문 자료로 직접 비교해야 한다.

### [From fine-tuned model to cheaper and faster inference: Speculator training on Red Hat OpenShift AI with Kubeflow](https://www.redhat.com/en/blog/fine-tuned-model-cheaper-and-faster-inference-speculator-training-red-hat-openshift-ai-kubeflow)

_Red Hat_

레드햇 개발자 블로그는 OpenShift AI와 쿠브플로우(Kubeflow) 위에서 스펙큘레이터(speculator, 초안 모델) 학습을 통해 파인튜닝된 LLM의 추론 비용을 낮추고 속도를 높이는 방법을 다룬다. 스펙큘레이티브 디코딩(speculative decoding)을 활용하면 추론 비용을 최대 3배까지 줄일 수 있다고 소개하며, 워크플로는 오프라인 데이터 생성, 덴스(dense) 및 MoE(mixture-of-experts) 아키텍처 모두에 대한 초안 모델 학습, 그리고 vLLM에 바로 배포 가능한 허깅페이스 호환 포맷으로의 직렬화 단계로 구성된다. 레드햇은 라마(Llama) 3.1과 3.3, Qwen3 계열 전체, gpt-oss의 20B·120B 버전, gemma 4의 31B·26B 버전 등 프로덕션에서 흔히 쓰이는 모델 계열을 아우르는 사전학습된 스펙큘레이터 모델 컬렉션을 허깅페이스에 지속적으로 공개하고 있다. 이 학습·파인튜닝 플로우를 OpenShift AI에 네이티브로 통합하는 작업은 올해 후반 로드맵에 올라 있어, 앞으로는 관리형 플랫폼 환경에서 동일한 워크플로를 그대로 쓸 수 있게 될 예정이다. 이는 이미 파인튜닝된 모델을 프로덕션에서 서빙 중인 팀이 출력 품질 저하 없이 서빙 비용을 줄일 수 있는 실용적인 방법으로 소개된다.

> 💡 이미 파인튜닝된 70B급 이상 모델을 vLLM으로 서빙 중이라면, 자체 스펙큘레이터를 학습시키는 대신 레드햇이 허깅페이스에 공개한 Llama·Qwen3·gpt-oss용 사전학습 스펙큘레이터를 먼저 적용해 추론 비용 절감 효과를 검증하는 편이 빠르다.

---

## DevOps & 인프라

### [Perplexity’s new agent runs entirely on your GPU — with one expensive catch](https://thenewstack.io/perplexity-portable-computer-windows/)

_The New Stack_

퍼플렉시티의 로컬 에이전트 '포터블 컴퓨터(Portable Computer)'가 윈도우용으로 출시돼 마이크로소프트 스토어에서 내려받을 수 있게 됐다. 실행하려면 최소 24GB VRAM을 갖춘 NVIDIA GeForce RTX 또는 RTX PRO GPU가 필요하며, Pro·Max 구독자에게만 제공된다. 윈도우 버전에서는 퍼플렉시티가 자체 사후학습한 PPLX 27B와 Qwen 3.8 27B 모델을 RTX GPU에 최적화해 지원하고, 내장 브라우저와 툴콜링, 자체 샌드박스인 SPACE도 함께 제공된다. 아웃룩, 원드라이브, 워드, 구글 드라이브, 지메일, 슬랙, 깃허브 등에 연결하는 커넥터를 통해 실제 업무 워크플로 자동화가 가능하다. 로컬에서 처리되는 작업은 크레딧을 소모하지 않고, 파일이 기기 밖으로 나가지 않는다는 것이 프라이버시 측면의 장점이다. 다만 최소 24GB VRAM 요구는 소비자용 GPU 상당수를 배제하는 '값비싼 대가'로 지적된다.

> 💡 로컬 LLM 에이전트가 클라우드 크레딧 비용을 없애는 대신 24GB+ VRAM급 워크스테이션 GPU를 요구하는 구조이므로, 사내 개발자용 AI 에이전트 도입을 검토할 때는 API 비용 절감분과 하드웨어 조달 비용을 함께 비교해야 한다.

### [Digital Experience Monitoring with Grafana Cloud: Session Replay, synthetic checks, and faster investigations](https://grafana.com/blog/digital-experience-monitoring-with-grafana-cloud-session-replay-synthetic-checks-and-faster-investigations/)

_Grafana_

그라파나 클라우드가 세션 리플레이와 신서틱(synthetic) 체크를 연결해 디지털 경험 모니터링(DEM)을 강화했다. 신서틱 모니터링은 핵심 사용자 여정에 대해 자동화된 체크를 실행해 실제 사용자가 겪기 전에 문제를 잡아내고, 프런트엔드 옵저버빌리티의 세션 리플레이는 Core Web Vitals·사용자 액션·트레이스와 상관관계를 지으며 사용자가 실제로 무엇을 봤는지 시각적으로 재생한다. 이번 업데이트의 핵심은 신서틱 모니터링의 모든 브라우저 체크 실행마다 자동으로 매칭되는 프런트엔드 옵저버빌리티 세션이 생성된다는 점이다. 체크 실행 상세 화면에서 'View Frontend Session' 버튼을 누르면 해당 실행의 세션 리플레이, 사용자 여정, 상관된 트레이스로 바로 진입할 수 있다. 이를 통해 실패한 체크에서 실제 사용자 영향 여부까지 조사하는 시간을 크게 단축한다. 그라파나는 이 조합이 평균 복구 시간(MTTR)을 시간 단위에서 분 단위로 줄일 수 있다고 설명한다.

> 💡 신서틱 체크와 세션 리플레이가 자동 연결되면 알림 발생 시 실제 사용자 영향 여부를 확인하는 트리아지 단계가 줄어들므로, 온콜 담당자의 초기 대응 시간을 단축하는 관측가능성 개선으로 바로 도입을 검토할 만하다.

### [AI keeps finding security flaws — here’s what to fix first](https://thenewstack.io/vulnerability-prioritization-business-context/)

_The New Stack_

The New Stack 기사는 AI 도구가 보안 취약점을 대량으로 찾아내면서 오히려 보안팀이 감당하기 어려운 수준의 알림 폭주를 만들어낸다는 문제를 다룬다. 사례로 든 것은 한 보안 연구원이 300명 규모의 글로벌 B2B 기업을 테스트하다가 인터넷에 노출된, 인증이 취약한 데이터베이스를 발견한 일인데, 심각도만 보면 치명적(critical)이었지만 실제로는 채용 후보자 테스트용으로 언제든 초기화되는 데이터베이스여서 실질 위험은 낮았다. 이 사례는 취약점의 CVSS 심각도만으로는 우선순위를 정할 수 없고, 해당 자산이 인터넷에 노출돼 있는지, 어떤 데이터를 다루는지, 매출에 어떤 역할을 하는지 같은 비즈니스 맥락이 있어야 실제 조치 목록이 나온다는 점을 보여준다. 실무적으로는 CISA의 KEV(Known Exploited Vulnerabilities) 카탈로그, EPSS 같은 익스플로잇 가능성 신호와 공격 경로(attack-path) 분석을 결합해 수천 건의 알림을 실행 가능한 10~20건의 티켓으로 줄이는 방식이 제시된다. 한편 기사는 2만 건 이상의 이슈를 분석한 한 학술 연구를 인용해, LLM이 수정한 코드가 개발자가 수정한 코드보다 약 9배 많은 새 취약점을 유발했다는 결과도 함께 소개한다.

> 💡 AI 스캐너가 알림 볼륨을 늘릴수록 CVSS 점수만으로 우선순위를 매기는 관행은 무의미해지므로, 보안·플랫폼팀은 KEV·EPSS·공격 경로 분석과 자산의 비즈니스 맥락을 결합한 트리아지 파이프라인을 먼저 구축해야 한다.

### [How Canvas Powers the AI Agent Development Feedback Loop](https://www.honeycomb.io/blog/how-canvas-powers-ai-agent-development-feedback-loop)

_Honeycomb_

허니콤(Honeycomb)의 Canvas 기능이 정식 출시(GA)되면서, AI 에이전트 개발의 피드백 루프 전 단계를 지원한다는 게 이 글의 핵심이다. 저자들은 AI 에이전트에는 사후 대응식 디버깅이 아니라 진짜 피드백 루프, 즉 에이전트 동작 관찰 → 개선점 발견 → 변경 배포 → 결과 측정이 반복되며 점점 나아지는 구조가 필요하다고 강조한다. Canvas는 OpenTelemetry의 GenAI 시맨틱 컨벤션 준수 여부를 평가해 계측 상의 간극이나 편차를 짚어주고, 허니콤의 에이전트 타임라인(Agent Timeline)·GenAI 패널·비용 집계 같은 기능이 요구하는 텔레메트리 요건을 충족하는지 검증한다. 또한 운영·비즈니스적으로 자주 나오는 질문들을 미리 모아두고, 현재 텔레메트리로 그 질문들에 답할 수 있는지 확인해주는 역할도 한다. 글은 이 피드백 루프를 에이전트 계측 → 단일 실행 이해 → 고칠 가치가 있는 문제 발굴 → 수정 배포 → 효과 입증의 5단계로 정리한다.

> 💡 OTel GenAI 시맨틱 컨벤션 준수 여부를 자동 점검해주는 도구가 GA로 나온 만큼, 에이전트를 프로덕션에 배포하기 전에 계측 표준 부합 여부부터 검증하면 이후 비용·성능 추적이 훨씬 수월해진다.

### [Datadog named the Company to Beat for observability platforms in 2026 Gartner® AI Vendor Race report](https://www.datadoghq.com/blog/datadog-observability-platforms-gartner-ai-vendor-race-2026/)

_Datadog_

데이터독은 2026년 8월 가트너 'AI 벤더 레이스(AI Vendor Race)' 리서치에서 옵저버빌리티 플랫폼 부문 '넘어서야 할 기업(Company to Beat)'으로 지목됐다. 이와 별개로 2026년 가트너 매직 쿼드런트 옵저버빌리티 플랫폼 부문에서도 6년 연속 리더로 선정됐다고 밝혔다. 데이터독은 옵저버빌리티·보안·AI 지원 운영을 아우르는 40개 이상의 통합 제품을 하나의 플랫폼으로 제공하며 IT 운영·개발·보안·비즈니스 팀 간 사일로를 없애는 것을 지향한다고 설명한다. AI 관련 기능으로는 알림을 자율적으로 조사하고 조치를 제안하는 'Bits Investigation', AI 에이전트·LLM 앱의 성능·보안·비용을 가시화하는 '에이전트 옵저버빌리티', AI 에이전트가 데이터독 텔레메트리를 직접 조회할 수 있게 하는 '데이터독 MCP 서버', 네이티브 OpenTelemetry를 지원하는 옵저버빌리티 파이프라인, 로그 데이터를 고객 자체 클라우드 계정에 보관하는 BYOC 로그 관리가 있다. 최근에는 DASH 2026 행사에서 100개 이상의 신규 기능을 공개했고, Adaptive ML을 인수했으며 사카나 AI(Sakana AI)와 전략적 파트너십도 발표했다. 데이터독은 앞으로의 핵심 과제로 AI 워크로드가 만드는 방대한 데이터 볼륨에 따른 비용 관리, 규제 관할별 데이터 거주성·주권 문제, AI 에이전트의 실행 권한에 대한 거버넌스와 감사 가능성을 꼽았다.

> 💡 데이터독이 스스로 꼽은 세 과제(AI 데이터 볼륨 비용, 데이터 주권, 에이전트 실행 권한 거버넌스)는 자사 관측가능성 스택을 도입하려는 팀이 계약 전에 로그 보관 위치(BYOC)와 에이전트 권한 감사 기능부터 요구사항으로 명시해야 함을 시사한다.

### [GitLab Dedicated: Compliance for a new regulatory era](https://about.gitlab.com/blog/gitlab-dedicated-compliance/)

_GitLab_

깃랩(GitLab)은 EU의 NIS2 지침 같은 규제가 더 이상 먼 미래의 계획 사항이 아니라는 점을 강조하며, 자사의 싱글테넌트 매니지드 서비스인 '깃랩 디디케이티드(GitLab Dedicated)'를 컴플라이언스 대응 수단으로 제시한다. 근거로 든 것은 유럽연합 사이버보안청(ENISA)의 NIS360 보고서로, 이 보고서가 감독 당국들이 핵심 분야 전반의 사이버보안 성숙도를 실제로 평가하고 있음을 확인해준다고 인용한다. 깃랩 디디케이티드는 격리된 싱글테넌트 환경에서 통제와 감사 대응력을 제공해 DORA, NIS2, GDPR 같은 규제 준수를 지원한다는 것이 글의 핵심 메시지다. 다만 원문 기사에서 구체적으로 어떤 기능(예: 특정 리전 데이터 상주, 감사 로그 보존 기간, 인증 취득 현황 등)을 제시했는지는 검색을 통해 확인한 자료의 한계로 세부까지는 파악하지 못했다. 발췌문과 검색으로 확인되는 범위 내에서는, 규제 강도가 높아지는 유럽 시장을 겨냥해 매니지드 싱글테넌트 상품의 컴플라이언스 가치를 부각하는 것이 이 글의 목적으로 보인다.

> 💡 NIS2·DORA 대상 조직이라면 싱글테넌트 관리형 호스팅이 감사 대응력과 데이터 격리 요건을 충족하는 가장 빠른 경로일 수 있으므로, 자체 호스팅 GitLab 인스턴스의 규제 대응 부담을 계산할 때 Dedicated로의 이전 비용과 비교 검토해야 한다.

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
