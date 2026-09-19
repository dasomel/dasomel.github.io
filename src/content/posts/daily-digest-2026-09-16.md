---
title: "📰 데일리 테크 다이제스트 - 2026-09-16"
description: "2026-09-16 Cloud, Kubernetes, AI, DevOps 소식 31건 — 자동 큐레이션 다이제스트."
pubDate: 2026-09-16
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### Meta lets Claude and Codex configure WhatsApp Business via MCP

메타가 WhatsApp Business Tools MCP 서버를 출시해 Claude, Codex, Cursor, ChatGPT 같은 AI 에이전트가 기업의 WhatsApp Business 메시징 설정을 직접 수행할 수 있게 됐다. 기존에는 개발자가 메타 Developer Console, Business Manager, API 문서, 코드 에디터를 오가며 수동으로 계정을 만들고 전화번호를 인증해야 했지만, 이제는 에이전트에게 요구사항을 설명하면 계정 생성, 전화번호 인증, Cloud API 등록까지 대행한다. 에이전트는 메시지 템플릿 작성·수정, 웹훅과 샘플 메시지 테스트도 수행하며, 과거 경고 없이 실패했던 서비스 약관·결제수단·비즈니스 인증 관련 문제도 사전에 짚어준다. 메타의 기존 Meta Social Technologies MCP와 함께 쓰면 API 엔드포인트 탐색, 문서 검색, 오류 트러블슈팅도 가능하다. 다만 MCP 연동이 메타의 요건 자체를 없애주지는 않아 계정 인증, 비즈니스 심사, 결제 정보 등록, 약관 동의는 여전히 사람이 처리해야 한다. 기사는 에이전트가 WhatsApp Business 운영을 위한 별도 아이덴티티를 부여받지는 않는다는 점도 지적한다.

> 💡 **왜 중요한가**: 온보딩을 자동화하는 MCP 서버는 설정 시간을 줄여주지만, 결제·계정 인증 같은 사람이 반드시 개입해야 하는 단계와 에이전트에게 별도 아이덴티티가 없다는 점은 DevOps 팀이 감사 추적과 책임 소재를 설계할 때 반드시 반영해야 할 제약이다.

🔗 [원문 보기](https://thenewstack.io/meta-mcp-whatsapp-business-claude/) · _The New Stack_

---

## Kubernetes & Cloud Native

### [What I learned organizing KCD Lima 2026](https://www.cncf.io/blog/2026/09/15/what-i-learned-organizing-kcd-lima-2026/)

_CNCF_

2026년 7월 18일, 페루 리마의 UTEC(Universidad de Ingeniería y Tecnología) 바랑코 캠퍼스에서 세 번째 Kubernetes Community Days(KCD) Lima가 열렸다. 등록자 2,200명 이상 중 900명 이상이 실제로 참석했으며, 연사 60명이 5개 트랙(Auditorio Principal, Aula Magna, UTEC Ventures, Garage Concept Lab, 워크숍 전용 705호)에서 54개 세션을 진행했다. 공동 조직자인 론 레케나(Ronald Requena, Rumbo CTO 겸 Universidad Ricardo Palma 교수)는 2026년 8월부로 페루 담당 CNCF 앰배서더가 됐다. 조직자는 CNCF에 투명성 보고서를 제출하고 스폰서에게 감사 인사를 전했다고 밝혔으며, 올해는 기존 스폰서들이 재참여하고 새 스폰서도 합류했다고 전한다. 국제 연사들도 이미 KCD Lima를 알고 있었기에 흔쾌히 참여를 수락했다고 언급하며, 이번 행사가 페루의 클라우드 네이티브·쿠버네티스·데브옵스·오픈소스 생태계 강화와 학계-테크 커뮤니티 간 다리 역할을 했다고 정리한다.

> 💡 지역 KCD 커뮤니티가 900명 규모·54세션으로 3회 연속 재현 가능한 스폰서·연사 파이프라인을 구축했다는 점은, DevOps 엔지니어가 지역 클라우드 네이티브 생태계 성숙도를 가늠하는 선행 지표로 참고할 만하다.

### [Kubernetes Changed Block Tracking API - Beta Differences](https://kubernetes.io/blog/2026/09/14/csi-changed-block-tracking-beta/)

_Kubernetes_

CSI 드라이버용 변경 블록 추적(Changed Block Tracking, CBT) 기능은 2025년 9월 알파로 처음 도입됐으며, 이번 글은 2026년 3월 나온 external-snapshot-metadata 프로젝트 v1.0.0 릴리스로 베타에 승격되면서 알파 대비 달라진 점을 정리한다. 가장 큰 변화는 SnapshotMetadataService 커스텀 리소스가 v1alpha1에서 v1beta1로 승격된 것이다. CBT는 CSI SnapshotMetadata gRPC 서비스, SnapshotMetadataService CRD, external-snapshot-metadata 사이드카라는 세 가지 핵심 구성 요소로 이뤄지며, 이 글은 바뀐 이름과 버전에 맞춰 API 사용법을 다시 한 번 짚어준다. 현재 CBT는 블록 볼륨에만 적용되고, 파일 볼륨이나 네트워크 파일 공유의 변경 목록 추적은 이 기능 범위에 포함되지 않는다는 제약도 명시한다. 이 글은 Veeam Kasten 소속 Prasad Ghangal이 2026년 9월 14일 작성했으며, 쿠버네티스 블로그의 스토리지 관련 기능 승격 시리즈 중 하나다.

> 💡 백업 벤더(Veeam 등)의 증분 백업 파이프라인이 이 CRD 버전 변경(v1alpha1→v1beta1)에 맞물려 있으므로, CSI 드라이버·백업 도구를 업그레이드할 때는 CBT API 버전 호환성을 먼저 확인해야 한다.

### [Kubernetes v1.37: Memory QoS Graduates to Beta](https://kubernetes.io/blog/2026/09/14/kubernetes-v1-37-memory-qos-graduates-to-beta/)

_Kubernetes_

쿠버네티스 v1.37에서 메모리 QoS(Memory QoS) 기능이 베타로 승격되며 기본적으로 활성화됐다. cgroup v2를 사용하는 리눅스 노드에서 메모리 컨트롤러를 활용해 커널에 컨테이너 메모리를 어떻게 다뤄야 할지 더 나은 힌트를 제공하는 기능으로, v1.22에서 알파로 처음 도입됐고 v1.36에서 계층형 메모리 예약(tiered memory reservation) 기능이 추가되며 확장됐다. v1.37부터는 MemoryQoS 피처 게이트가 베타로 전환돼 모든 v1.37 kubelet에서 별도 설정 없이 기본으로 켜진다. 업그레이드 시 중요한 변경점은 memoryThrottlingFactor의 기본값이 0.9에서 null로 바뀐 것으로, 이는 명시적으로 설정하지 않는 한 memory.high가 자동으로 설정되지 않음을 의미하며 기존 워크로드와의 하위 호환성을 지키기 위한 조치다. 클러스터 운영자는 메모리 스로틀링, memoryReservationPolicy를 통한 계층형 메모리 예약, 두 가지를 함께 사용하는 방식, 또는 기능 자체를 끄는 방식을 kubelet 설정으로 선택할 수 있다. 다만 알려진 제약으로 memoryReservationPolicy는 파드 단위가 아니라 노드 전체 단위로 적용되며, 하드 예약 시 페이지 캐시도 컨테이너 cgroup 사용량에 포함되어 계산된다.

> 💡 memoryThrottlingFactor 기본값이 0.9에서 null로 바뀌었으므로, v1.36 이하에서 스로틀링 동작을 의도적으로 활용하던 클러스터는 v1.37 업그레이드 시 memory.high가 더 이상 자동 설정되지 않는다는 점을 kubelet 설정에서 명시적으로 확인해야 한다.

### [Cilium 1.20: Gateway API ExternalAuth, TCPRoute/UDPRoute, ENI IPAM for IPv6, and more](https://www.cncf.io/blog/2026/09/14/cilium-1-20-gateway-api-externalauth-tcproute-udproute-eni-ipam-for-ipv6-and-more/)

_CNCF_

Cilium 1.20은 2026년 두 번째로 나온 메이저 오픈소스 Cilium 릴리스로, Gateway API 지원을 v1.4에서 v1.6으로 끌어올리며 ExternalAuth, CORS 필터, ListenerSets를 새로 추가했다. TCPRoute와 UDPRoute 지원이 추가되면서, 지금까지 HTTP·gRPC 트래픽에만 쓰던 것과 동일한 Gateway API 모델로 데이터베이스, DNS 서버, 게임 서버 같은 비-HTTP L4 서비스도 관리할 수 있게 됐다. ExternalAuth 기능은 GEP-1494에 정의된 Gateway API ExternalAuth 필터를 통해, HTTPRoute로 들어오는 요청을 애플리케이션에 도달하기 전에 외부 서비스로 인증·인가할 수 있게 한다. IPv6용 ENI IPAM도 새로 지원되는데, 멀티풀 할당자로의 전환을 기반으로 AWS ENI를 통해 파드에 IPv6 프리픽스를 할당할 수 있으며, 오퍼레이터가 Prefix Delegation으로 각 노드의 ENI에 /80 프리픽스를 붙이면 에이전트가 그 범위 안에서 파드 주소를 할당하는 방식으로 동작한다. 이 밖에도 혼합 커널 환경을 위한 netkit/veth 데이터패스 자동 선택, 클라우드 제공업체가 Cilium의 eBPF 데이터패스를 포크 없이 확장할 수 있는 새로운 데이터패스 플러그인 시스템이 추가됐다.

> 💡 TCPRoute·UDPRoute와 ExternalAuth 지원으로 DB·DNS 같은 비-HTTP 서비스까지 Gateway API 한 모델로 라우팅·인증 정책을 통일할 수 있게 됐으므로, 서비스 메시·인그레스 정책을 여러 API로 분산 관리하던 팀은 Cilium 1.20 업그레이드 시 정책 통합을 검토할 만하다.

---

## AI & ML

### [Bypassing inference bottlenecks: Accelerating complex AI search with Retrieve-for-Train](https://research.google/blog/bypassing-inference-bottlenecks-accelerating-complex-ai-search-with-retrieve-for-train/)

_Google Research_

구글 리서치가 복잡한 AI 검색에서 쿼리를 여러 하위 쿼리로 분해하는 팬아웃(fan-out) 작업을 추론 시점이 아니라 학습 시점으로 옮기는 Retrieve-for-Train(R4T) 프레임워크를 공개했다. 기존 방식은 수백 개의 중간 사고 사슬(chain-of-thought) 토큰을 생성해 검색어를 계획하는데, 대화형 AI에는 괜찮지만 집합 값(set-valued) 검색에는 심각한 구조적 병목이 된다고 설명한다. R4T는 오프라인 강화학습을 한 번 활용해 보상에 부합하는 팬아웃 패턴을 찾아낸 뒤 이를 지도학습용 데이터로 컴파일하고, 이 최적화된 탐색 행동을 경량 디퓨전(diffusion) 리트리버에 증류(distill)해 추론 시점에는 단일 패스로 팬아웃을 생성하게 한다. 이 방식으로 팬아웃 지연을 12~20배 단축해 거의 50초 걸리던 작업을 1초 미만으로 줄였다. 5390만 파라미터 규모의 디퓨전 리트리버가 오토리그레시브 LLM을 대체해 전체 결과 집합을 한 번의 병렬 패스로 생성한다. 이 연구는 ICML 2026에 'Efficient, Property-Aligned Fan-Out Retrieval via RL-Compiled Diffusion'이라는 제목으로 발표됐다.

> 💡 추론 시점의 사고 사슬을 학습 시점 강화학습으로 옮기고 결과를 소형 디퓨전 모델로 증류하는 접근은, 검색·추천처럼 지연에 민감한 서빙 워크로드에서 GPU 비용과 p99 레이턴시를 동시에 낮출 수 있는 실질적인 인프라 최적화 패턴이다.

### [Your Agent Aced the Task. Will It Do It Again?](https://huggingface.co/blog/ibm-research/altk-evolve-consistency)

_Hugging Face_

IBM 리서치가 AI 에이전트가 평균적으로는 성공하지만 반복 실행할 때마다 결과가 들쭉날쭉한 신뢰성 격차(reliability gap) 문제를 다룬 ALTK-Evolve의 일관성(consistency) 가이드라인을 공개했다. AppWorld의 test_normal 벤치마크에서 GPT-4.1 기반 ReAct 에이전트는 평균 77.4%의 성공률을 보이지만, 같은 과제를 5번 반복했을 때 5번 모두 성공하는 비율(Pass^5)은 53.0%에 불과하다는 구체적 수치를 제시한다. 이를 진단하기 위해 IBM은 Consistency Analyzer라는 도구를 도입했는데, 정답(ground truth) 없이도 기록된 단일 궤적(trajectory)을 제어된 재샘플링으로 재생시켜 각 의사결정 단계에서 모델 출력이 얼마나 흔들리는지를 측정하고, 뒤집히기 쉬운(flip-prone) 단계를 찾아낸다. 이렇게 얻은 일관성 가이드라인을 ALTK-Evolve의 장기 일화적 메모리(episodic memory) 프레임워크에 반영하면, AppWorld 벤치마크에서 일관성 격차가 절반으로 줄어들어 GPT-4.1 ReAct 에이전트의 Pass^5가 53.0%에서 69.0%로 향상됐다. ALTK-Evolve는 에이전트가 과거 실행에서 생성한 가이드라인을 학습해 시간이 지날수록 개선되도록 돕는 메모리 시스템이라고 설명한다.

> 💡 평균 성공률만 보고 에이전트를 프로덕션에 배포하면 77% 대 53%(Pass^5) 같은 반복 신뢰성 격차를 놓치게 되므로, 운영 환경에서는 단일 실행 성공률이 아니라 반복 실행 일관성을 SLO 지표로 삼아야 한다.

### [AI for Societal Impact](https://blog.google/innovation-and-ai/technology/ai/ai-for-societal-impact/)

_Google AI_

구글이 AI for Societal Impact 컬렉션을 공개해, 전문가와 지역 리더들이 AI의 기회를 모두가 누릴 수 있도록 활용하는 사례를 모았다. 구글은 질병을 발견·치료·예방 가능하게 만드는 일, 자연재해를 예측하는 일, 학습 기회를 넓히는 일, 더 많은 사람에게 경제적 기회를 열어주는 일 등 핵심 영역에서 지역사회 및 연구자와 파트너십을 맺고 있다고 밝힌다. 지난 10년간 AI가 이론적 연구에서 실제 세계의 영향력으로 꾸준히 발전해 왔으며, 이제는 그 효과가 측정 가능한 수준에 이르러 인류가 복잡한 문제를 해결하는 방식을 근본적으로 바꾸고 있다고 설명한다. 이 프로젝트들은 지역 리더와 연구자가 함께 참여해 각 커뮤니티의 필요에 맞춘 해법을 만드는 협업 방식이라고 기사는 전한다. 이번 컬렉션은 2026년 9월 15일 구글 블로그의 혁신·AI 섹션에 게시됐다.

> 💡 지역 리더와의 공동 설계를 전제로 한 이런 소셜임팩트 프로젝트는 결국 다양한 언어·지역 인프라 제약 위에서 모델을 서빙해야 한다는 뜻이므로, 클라우드 엔지니어에게는 저대역폭·엣지 배포 요구가 늘어나는 신호로 읽힌다.

### [Building AI to accelerate science and improve lives](https://blog.google/innovation-and-ai/technology/ai/ai-applications-science-people/)

_Google AI_

구글이 과학 발전과 삶의 개선을 위한 AI 활용 사례를 정리한 글에서, 자사 AI 기술이 이제 70억 명이 사용하는 300개 이상의 언어를 지원하며 이는 전 세계 인구의 86%에 해당한다고 밝혔다. 또한 실제 사람들이 전 세계에서 AI를 어떻게 쓰고 있는지 보여주는 AI & Economy ATLAS의 새로운 인터랙티브 인사이트를 공개했다. 과학 분야 성과로는 AlphaGenome Atlas를 통해 인간 게놈 전체에서 가능한 90억 개의 단일 문자 유전적 변이를 매핑해 연구자들에게 공개한 것을 꼽았다. 또한 AI 연구를 활용해 항공업의 기후 영향을 줄이는 작업을 확대했으며, 이는 이미 영국과 아시아 일부 지역에 적용되고 있다고 설명한다. 구글은 질병의 발견·치료·예방, 자연재해 예측, 학습 기회 확대, 경제적 기회 확산이라는 핵심 영역에 계속 집중하겠다고 밝혔으며, 이 글은 2026년 9월 15일 게시됐다.

> 💡 게놈 전체 90억 개 변이 매핑 같은 대규모 생명과학 AI 데이터셋의 공개는 향후 연구기관·바이오텍 워크로드가 요구할 스토리지·컴퓨트 규모를 가늠하는 선행 신호로, 클라우드 팀은 대용량 공개 데이터셋 서빙과 접근 제어 설계를 미리 준비할 필요가 있다.

### [AI for everyone in every language](https://blog.google/innovation-and-ai/technology/ai/ai-for-every-language/)

_Google AI_

구글이 그동안 기술에서 소외됐던 언어들까지 포함해 사람들이 수백 개 언어로 소통할 수 있도록 돕는 AI 활용 사례를 소개했다. Gemini 3.5 Live Translate는 70개 언어와 2,000개 이상의 언어 쌍에 걸쳐 실시간 음성 번역을 지원하며, 코드 스위칭(code-switching)과 감정적 뉘앙스까지 자연스럽게 포착한다고 밝힌다. 구글은 단순 텍스트 번역을 넘어 세계 각지의 살아있는 언어를 실제 쓰이는 그대로 이해하는 모델을 구축하는 방향으로 나아가고 있다고 설명하며, 목표를 전 세계에서 가장 많이 쓰이는 1,000개 언어 지원으로 제시한다. 이를 위해 텍스트뿐 아니라 감정, 어조, 실생활 속 속어까지 AI가 이해하도록 훈련하고, 안정적인 인터넷 연결이 없는 지역까지 도구가 작동하도록 각지 지역 커뮤니티와 협업하고 있다고 전한다. 아울러 Gemma 3 기반의 새로운 오픈 번역 모델 컬렉션인 TranslateGemma를 공개해 55개 언어에 걸쳐 위치나 기기와 무관하게 소통을 지원한다고 밝혔다.

> 💡 TranslateGemma처럼 Gemma 3 기반 오픈 번역 모델을 공개한 것은, 클라우드에 상시 연결하지 않고도 온디바이스·엣지에서 저지연 번역 파이프라인을 자체 호스팅할 수 있는 선택지가 늘었다는 의미다.

### [How Fyxer built an AI executive assistant people trust](https://openai.com/index/fyxer)

_OpenAI_

OpenAI는 AI 비서 스타트업 Fyxer가 어떻게 사용자들이 신뢰하는 AI 임원 비서를 만들었는지 소개한다. Fyxer는 OpenAI 모델과 파인튜닝, 메모리, 실제 사용자 피드백을 결합해 받은편지함을 정리하고 각 사용자의 어투로 이메일 초안을 작성하며, 업무가 여러 툴 사이를 오가도 흐름을 놓치지 않고 따라가도록 설계됐다. 하나의 거대한 텍스트 생성 모델 대신 분류·의도 예측·메모리 검색·초안 생성 등을 담당하는 30~50개의 특화된 모델로 작업을 나눠 처리하며, 50만 시간이 넘는 비서 업무 워크플로 데이터를 학습에 활용했다. 성과 지표도 구체적으로 제시되는데, AI가 작성한 초안의 53%가 수정 없이 그대로 채택되고, 90일 시점 사용자 유지율이 90%에 달하며, 2025년 한 해 동안 연간 반복 매출(ARR)이 100만 달러에서 3,200만 달러로 성장했다. Fyxer는 앞으로 단순 답장 초안 작성을 넘어, 사용자의 관계·선호·진행 중인 업무 맥락을 더 깊이 이해해 커뮤니케이션과 업무 조율을 더 폭넓게 관리하는 AI 비서로 발전시키는 것을 목표로 한다고 밝혔다.

> 💡 하나의 범용 LLM에 모든 것을 맡기기보다 분류·의도 예측·메모리 검색·생성을 각각 특화 모델(30~50개)로 분리한 아키텍처는, 응답 지연과 비용을 낮추면서도 실사용자 피드백으로 개별 컴포넌트를 독립적으로 개선할 수 있다는 점에서 운영 관점의 시사점이 크다.

---

## 클라우드 업데이트

### [Introducing new session management tools with native, granular controls](https://cloud.google.com/blog/products/identity-security/introducing-new-session-management-tools-with-native-granular-controls/)

_Google Cloud_

구글 클라우드가 Context-Aware Access(CAA)에 통합된 세션 관리 기능을 대폭 개편해, 조직 단위(OU)에 묶인 포괄적 정책에서 벗어나 자동화 우선의 세밀한 정책으로 전환했다. 세션 컨트롤은 이제 Terraform, gcloud CLI, REST API로 프로그래밍 방식으로 관리할 수 있어 DevSecOps 워크플로에 그대로 편입되며, 수동 UI 설정 의존도를 없앴다(GA). 정책 타깃도 OU 대신 구글 그룹을 지정할 수 있게 되어, 예를 들어 결제 관리자나 프로젝트 소유자 같은 권한 있는 사용자에게는 2시간짜리 세션을, 일반 개발자에게는 16시간 표준 세션을 조직 계층과 무관하게 적용할 수 있다(GA). 또한 구글 클라우드 콘솔, gcloud, 특정 OAuth 애플리케이션별로 세션 정책을 정밀하게 지정할 수 있어 BI 도구 같은 정상적인 연동이 과도하게 엄격한 정책으로 끊기는 문제를 방지한다(GA). Access Context Manager(ACM) 안에 구글 클라우드 콘솔 네이티브 경험도 프리뷰로 추가되어, 과거 Google Workspace 관리자 콘솔에서만 가능했던 설정을 다른 CAA 정책과 함께 통합 구성할 수 있다. 기본 세션 길이는 16시간으로 전 고객에게 전역 적용되며, 자격 증명 탈취와 계정 탈취(ATO) 위험을 완화하는 데 초점을 둔다.

> 💡 세션 정책을 Terraform/API로 코드화하고 OU 대신 그룹·애플리케이션 단위로 타기팅할 수 있게 되면서, 보안팀은 특권 계정만 짧은 세션 TTL을 강제하는 최소권한 정책을 IaC 파이프라인에 그대로 편입시킬 수 있게 됐다.

### [Best practices for handling cloud reliability incidents](https://cloud.google.com/blog/topics/developers-practitioners/cloud-reliability-incident-handling-best-practices/)

_Google Cloud_

구글 클라우드가 클라우드 안정성 장애 대응을 위한 5단계 프레임워크 확인(Verify)-조사(Investigate)-보고(Report)-해결(Resolve)-리뷰(Review)를 공개했으며, 그 앞에 사전 대비를 위한 준비(Prepare) 단계를 추가로 다룬다. 준비 단계에서는 로드밸런서 트래픽 전환 같은 자동화된 대응 액션, Cloud Logging·Cloud Trace·Cloud Monitoring 등 관측성 도구 활용, 역할·알림·소통 절차를 정리한 플레이북 문서화, 연중 여러 차례 진행하는 모의 장애 대응 훈련을 권장한다. 확인 단계에서는 Personalized Service Health(자사 프로젝트·리전에 특화된 경보이며 발생 중 사고와 확인된 사고를 구분)와 자연어 질의가 가능한 Gemini Cloud Assist, 공개용 Cloud Service Health Dashboard를 핵심 도구로 제시한다. 조사 단계에서는 5xx 오류 급증·지연 증가 같은 신호를 Cloud Monitoring으로, DEADLINE_EXCEEDED나 SERVICE_UNAVAILABLE 같은 구체적 오류를 Cloud Logs의 Log Explorer로 확인하라고 안내하며, 변경 직후 증상이 나타났다면 마지막으로 정상이었던 구성으로 롤백하는 전략을 권한다. 보고 단계에서는 프로덕션 서비스가 완전히 불가능한 P1(치명적)과 상당한 성능 저하가 있는 P2(높음)로 우선순위를 나누고, 프로젝트 ID·시간대 포함 타임스탬프·오류 메시지·영향 범위·정량화된 비즈니스 영향을 담아 지원 케이스를 접수하라고 설명하며, Premium/Enhanced 지원 고객은 P1 케이스에 대해 에스컬레이트 버튼을 쓸 수 있다. 해결 단계에서는 이해관계자와의 투명한 소통, 다중 리전 아키텍처로의 페일오버, Service Health Dashboard의 우회책 확인을 권하고, 리뷰 단계에서는 비난 없는(blameless) 사후 분석과 구글이 공개하는 사후 보고서 검토를 통한 재해복구 계획 개선을 제안한다.

> 💡 Personalized Service Health와 Gemini Cloud Assist를 사전 구성해두면 장애 발생 시 구글 문제인지 우리 문제인지를 구분하는 초기 조사 시간을 크게 단축할 수 있어, 이 설정 여부가 평균 복구 시간(MTTR)에 직접 영향을 준다.

### [Agent Substrate brings high-density, scalable, trusted infrastructure to GKE](https://cloud.google.com/blog/products/containers-kubernetes/agent-substrate-available-on-gke/)

_Google Cloud_

구글 클라우드가 오픈소스 에이전트 실행 런타임 Agent Substrate를 GKE에서 정식 제공한다고 발표했다. 이 런타임은 하나의 클러스터에서 수백만 개의 샌드박스를 실행하며 표준 컨테이너 런타임 대비 10배 높은 밀도를 달성하고, 호스트 한 대당 휴면 상태 에이전트 1,000개 이상을 배치할 수 있다. 성능 면에서는 서스펜드된 에이전트의 재개(resume) 작업이 500밀리초 이내에 끝나고, 초당 500회 이상의 서스펜드/리쥼 활성화를 처리하며, 활성화된 에이전트는 프리워밍된 워커에 밀리초 단위로 디스패치된다. 보안은 커널·네트워크 수준에서 기본 적용되는데, 하드웨어로 격리된 Cloud Hypervisor microVM과 오버헤드가 낮은 gVisor 샌드박스를 함께 쓰고, 통합 게이트웨이로 세밀한 네트워크 정책 아래 인그레스·이그레스를 관리하며 자격 증명은 에이전트가 접근할 수 없는 곳에 주입해 호스트 탈출과 자격 증명 탈취를 막는다. GKE 통합 측면에서는 스팟·온디맨드를 넘나드는 커스텀 ComputeClasses, 30% 더 나은 가격 대비 성능을 제공하는 구글 Axion Arm 기반 프로세서 지원, 밀리초 단위로 NFS 마운트를 붙였다 뗄 수 있고 여러 에이전트가 동시에 협업할 수 있는 RWX(Read-Write-Many) 접근을 지원하는 Filestore 에이전트 볼륨이 포함된다. 초기 설계 파트너인 Nous Research는 OpenRouter 사용량 기준 전 세계 1위 AI 에이전트인 Hermes Agent를 이 위에 구축했으며, Antigravity·Claude Code·Codex·OpenClaw 등도 Agent Substrate를 기반으로 동작한다. Agent Substrate는 오픈소스로 어떤 쿠버네티스 인프라에서도 구동 가능하며, 비프로덕션 워크로드는 모든 GKE 고객이 즉시 쓸 수 있고 프로덕션 GA 지원은 대기자 명단(allowlist)을 통해 제공된다.

> 💡 microVM·gVisor 격리와 초당 500회 서스펜드/리쥼, 클러스터당 수백만 샌드박스라는 수치는 대규모 멀티테넌트 에이전트 워크로드를 안전하게 밀집시켜 유휴 컴퓨트 낭비를 줄이는 구체적 설계 기준점을 제공하므로, 자체 에이전트 실행 플랫폼을 설계 중인 팀이라면 Agent Substrate를 참조 아키텍처로 검토할 가치가 있다.

### [Have it both ways: stay discoverable in search while disallowing AI training](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/)

_Cloudflare_

클라우드플레어가 검색 노출은 유지하면서 AI 학습만 거부할 수 있도록 Accountable(책임 있는) 지정 제도와 Disallow AI Training 설정을 새로 도입했다. Accountable 지정을 받으려면 크롤러 운영사가 AI 학습 옵트아웃 방법을 제공하고, AI 생성 검색 요약에서도 옵트아웃을 허용하며, 콘텐츠가 URL 단위로 어떻게 쓰이는지 가시성을 제공하고, 학습 거부가 기존 검색 순위에 영향을 주지 않는다는 점을 공개적으로 확인해야 한다. 현재 애플, 구글, 마이크로소프트가 이 기준을 충족했거나 충족 시점을 구체적으로 제시해 Accountable로 지정됐다고 밝힌다. 가장 다루기 어려운 부분은 검색과 학습을 하나의 크롤러가 동시에 수행하는 혼합 사용(mixed-use) 크롤러였는데, Accountable로 지정된 혼합 사용 크롤러는 검색용으로는 계속 허용하면서 학습 전용 크롤러는 모두 차단하며, 아마존·앤트로픽·메타·OpenAI가 운영하는 학습 전용 크롤러도 여기에 포함된다. 새로운 컨트롤과 권장 설정이 공개돼, 퍼블리셔와 기업이 검색·AI 학습·AI 에이전트에 걸쳐 자사 콘텐츠 사용 방식을 독립적으로 통제할 수 있게 됐다.

> 💡 하나의 User-Agent가 검색과 AI 학습을 동시에 수행하던 혼합 사용 크롤러 문제를 분리해준다는 것은, 사이트 운영자가 robots.txt나 WAF 규칙을 크롤러 목적별로 세분화해 재작성해야 할 필요가 생겼다는 뜻이므로 엣지 설정 감사가 필요하다.

### [Give every teammate and agent the right level of access to your Workers](https://blog.cloudflare.com/workers-granular-authorization/)

_Cloudflare_

클라우드플레어가 2026년 9월 15일부터 개별 Worker 단위로 접근 권한을 부여할 수 있는 세밀한 권한 관리 기능을 출시했다. 팀원, 에이전트, CI/CD 워크플로에 네 가지 역할 중 하나를 선택해 부여할 수 있는데, Worker 코드나 변경 권한 없이 설정·메트릭·로그·트레이스만 볼 수 있는 Metadata Read-Only, 수정·배포 권한 없이 코드와 관측성 데이터까지 읽을 수 있는 Content Read-Only, 삭제 권한만 없이 업데이트와 배포가 가능한 Editor, Editor 권한에 삭제까지 더한 Admin으로 구성된다. 팀원에게는 Cloudflare 대시보드의 Manage Account > Members에서 권한 정책을 만들어 범위를 특정 Worker로 지정하고 역할을 선택해 부여하며, 에이전트나 CI/CD 워크플로에는 Account API Tokens에서 계정 소유 API 토큰을 생성해 범위를 지정된 Worker로 좁히고 역할을 지정한다. 동일한 접근 권한이 필요한 팀 전체에는 개별 멤버 대신 사용자 그룹에 권한 정책을 할당해 그룹에 추가된 모든 사람이 자동으로 정책을 상속받게 할 수 있다. Worker 단위 접근 제어는 대시보드, API, Terraform을 통해 모든 고객에게 오늘부터 제공된다.

> 💡 CI/CD 토큰과 AI 에이전트에게 계정 전역 API 토큰 대신 특정 Worker에 한정된 Editor/Admin 역할을 발급할 수 있게 되면서, 배포 파이프라인의 최소권한 원칙을 강제하고 토큰 유출 시 폭발 반경을 단일 Worker로 제한할 수 있다.

### [The datacenter myth: Why sovereign AI demands a tenancy model, not just geography](https://www.redhat.com/en/blog/datacenter-myth-why-sovereign-ai-demands-tenancy-model-not-just-geography)

_Red Hat_

레드햇은 디지털 주권(sovereign AI) 논의가 흔히 "서버를 자국 내에 두고 데이터를 국경 안에 유지하면 된다"는 지리적 접근에 머무른다고 지적하며, 이것만으로는 규제 환경의 요구를 충족할 수 없다고 주장한다. "우리를 믿어달라"는 신뢰 기반 규제에서 "증명해 보이라"는 검증 기반 규제로 옮겨가는 흐름 속에서, AI 워크로드는 단순한 데이터 위치 고정보다 훨씬 엄격한 격리를 요구한다는 것이다. 레드햇은 대안으로 동일한 물리 인프라를 여러 고객이 공유하더라도 논리적·암호화적·운영적으로 완전히 분리되는 테넌시(tenancy) 모델을 제시한다. 구체적으로는 Red Hat Enterprise Linux, OpenShift, Ansible을 기반으로 한 "랜딩존(landing zone)"이라는 사전 구성된 격리 구역 개념을 소개하며, 배포 시점부터 운영 가드레일을 강제해 관할권 통제를 기술적으로 증명하는 역할을 한다고 설명한다. 또한 쿠버네티스 기반 배치 정책을 활용해 민감한 AI 워크로드가 특정 지리적·규제적 구역을 벗어나지 않도록 강제하는 방안도 언급한다. 결론적으로 레드햇은 디지털 주권이 체크박스식 컴플라이언스나 지리적 데이터 미러링으로는 달성되지 않으며, 데이터·인력·접근 프로토콜이 상호작용하는 방식 자체를 근본적으로 재설계해야 한다고 강조한다.

> 💡 인프라 위치만으로는 규제 대응이 끝나지 않으므로, 클라우드/DevOps 엔지니어는 OpenShift·Ansible 기반 랜딩존처럼 배포 시점부터 논리적 격리와 접근 통제를 강제하는 구조를 설계에 반영해야 감사 대응 부담을 줄일 수 있다.

### [Opening the black box: Profiling a secured agentic pipeline on Red Hat OpenShift AI](https://www.redhat.com/en/blog/opening-black-box-profiling-secured-agentic-pipeline-red-hat-openshift-ai)

_Red Hat_

이 글은 기업이 자율 에이전트 파이프라인으로 전환하면서 마주치는 두 가지 핵심 질문, 즉 "성능 저하 없이 에이전트에 보안을 추가할 수 있는가"와 "어디에 최적화 노력을 집중해야 가장 효과적인가"에 답하기 위해, Red Hat OpenShift AI 위에서 보안이 적용된 에이전틱 파이프라인을 프로파일링한 사례를 다룬다. 코드 실행용 샌드박스를 안전하고 감사 가능한 방식으로 프로비저닝하면서도 지연 시간 오버헤드를 측정하고 최적화할 수 있음을 보여주는 것이 핵심 메시지다. 저자들은 관측 가능성(observability)이 에이전트라는 블랙박스를 감사 가능한 시스템으로 바꾸는 열쇠라고 강조하며, 세밀한 텔레메트리 없이는 "어떤 모델이 요청을 처리했는가", "어떤 버전의 프롬프트가 사용됐는가" 같은 기본적인 감사 질문에도 답할 수 없다고 지적한다. 이를 위해 네트워크 활동, HTTP 활동, 프로세스 활동, 파일시스템 활동 네 가지 범주의 구조화된 보안 텔레메트리를 수집하며, 이는 OTel 트레이스·Prometheus 메트릭 같은 기존 운영 관측성과는 별개로 다뤄진다. 전체적으로 에이전트, 도구, 모델이 방출하는 텔레메트리를 서비스와 동일한 파이프라인으로 수집·저장하는 구조를 취해, 보안과 성능을 동시에 검증할 수 있게 한다.

> 💡 에이전트 워크로드에 샌드박스와 보안 계층을 추가할 때는 막연히 오버헤드를 걱정하기보다, 보안 이벤트(네트워크·HTTP·프로세스·파일시스템)를 운영 텔레메트리와 분리해 구조화 수집하고 프로파일링해 어디를 최적화할지 데이터로 정하는 접근이 필요하다.

### [Fedora 45 Beta now available](https://www.redhat.com/en/blog/fedora-45-beta-now-available)

_Red Hat_

페도라 프로젝트는 2026년 9월 15일, 10월 정식 출시를 앞둔 페도라 리눅스 45 베타를 공개했다. 데스크톱 환경에서는 커널 내장 콘솔을 대체하는 사용자 공간 가상 터미널 구현체 kmscon이 도입돼 렌더링, 국제화·폰트 처리, 시각적 통합, 보안이 개선됐고, 페도라 워크스테이션은 GNOME 51로, 커널은 Linux 7.2로 올라간다. 개발 도구 체인도 대거 갱신되어 Python 3.15, Go 1.27, GCC 16.2, glibc 2.44를 조기에 사용할 수 있고, Podman 6와 Pandas 3, 새 버전의 MySQL·MariaDB도 포함된다. 보안 측면에서는 기본적으로 유효한 패키지 서명이 없으면 설치를 막도록 정책이 강화됐고, DNF5는 의존성 해결이나 업그레이드 과정에서 사용자가 명시적으로 지시하지 않는 한 충돌하는 서드파티 저장소 간 자동 벤더 전환을 기본적으로 비활성화한다. 데스크톱 비밀정보 관리는 GNOME Keyring, KWallet 같은 개별 백엔드 대신 oo7로 표준화됐다. 애플 실리콘 사용자를 위한 Fedora Asahi Remix 45 베타는 M3·M3 Pro·M3 Max 칩 초기 지원을 추가했고, 모든 애플 실리콘 맥에서 H.264·VP9 하드웨어 비디오 디코딩을, M3 맥에서는 AV1 하드웨어 디코딩까지 지원한다.

> 💡 패키지 서명 필수화와 DNF5의 벤더 자동 전환 차단은 공급망 보안 강화에 직접 도움이 되므로, 온프레미스나 엣지에서 Fedora를 베이스 이미지로 쓰는 팀은 베타 단계에서 미리 패키징·저장소 정책을 점검해두는 것이 좋다.

---

## DevOps & 인프라

### [OpenAI’s voice model doesn’t think. That’s the point.](https://thenewstack.io/voice-agent-latency-architectures/)

_The New Stack_

음성 에이전트는 실제 작업을 처리해야 하는 순간 지연 문제가 바로 드러나는데, 최근 닷새 사이 구글과 OpenAI가 서로 다른 해법을 내놓았다고 기사는 전한다. 구글의 Gemini 3.8 Live Extended Thinking은 추론을 음성 모델 안에 그대로 두고, 비동기 도구 호출을 실행하는 동안에도 계속 말을 이어갈 수 있게 설계됐다. 반면 OpenAI는 역할을 분리해, 실시간 대화는 GPT-Live-1이 전담하고 복잡한 작업은 별도의 백엔드 추론 모델이 처리하도록 아키텍처를 나눴다. OpenAI는 GPT-Live-1의 턴테이킹(turn-taking) 지연을 약 800밀리초로 제시하는데, 이는 실시간 음성 레이어를 백엔드 추론 작업과 분리해 둔 덕분이라고 설명한다. 즉 OpenAI의 음성 모델은 '생각하지 않는' 대신 반응성을 우선하고, 무거운 추론은 뒤로 넘기는 방식으로 지연 문제를 해결한 것이다.

> 💡 음성 에이전트 아키텍처를 고를 때는 단일 모델에 추론까지 몰아넣을지, GPT-Live-1처럼 실시간 응답 레이어와 백엔드 추론을 분리할지가 관측 대상(트레이스 경계)과 장애 격리 전략을 결정짓는 핵심 설계 축이 된다.

### [AWS agents will suggest your new flights. Code decides what gets booked.](https://thenewstack.io/aws-agents-deterministic-validation/)

_The New Stack_

AWS는 항공편 결항 후 AI 에이전트가 대체 일정을 제안하되 실제 예약 변경과 결제는 결정론적(deterministic) 코드가 검증·통제하는 새로운 Step Functions 패턴을 공개했다. 이 패턴에서는 Amazon Bedrock AgentCore로 구성한 여러 전문 에이전트가 새 일정을 제안하고 보상 메시지 초안을 작성하며, Step Functions의 결정론적 단계가 예약을 바꾸거나 결제를 실행하기 전에 이 제안을 검증한다. 기사는 통제되지 않은 에이전트가 코드셰어 제약을 무시하거나, 서류상으로만 최소 환승 시간을 충족하는 항공편으로 재예약하거나, 항공권 발권지를 잘못 읽어 엉뚱한 규제 체계로 보상금을 계산할 수 있다고 지적한다. '에이전트가 제안하고, 결정론적 코드가 검증한다'는 원칙이 핵심이며, Bedrock AgentCore의 전문 에이전트들을 Step Functions로 오케스트레이션하면 생성형 AI의 추론 능력과 결정론적 검증의 안전장치를 동시에 확보할 수 있다고 설명한다. Step Functions는 수천 명의 승객에 대한 네이티브 팬아웃(fan-out), 사람의 검토가 필요할 때 컴퓨팅 비용 없이 케이스를 일시 정지하는 콜백 패턴, 감사 추적으로 쓸 수 있는 영속적 실행 이력을 제공한다. AWS는 이 패턴이 자동화된 결정이 실제 재정적·규제적 결과를 낳는 모든 영역에 적용 가능하다고 밝혔다.

> 💡 에이전트에 예약·결제 같은 되돌리기 어려운 행위를 직접 맡기는 대신, propose-then-validate 구조로 결정론적 검증 계층을 강제하면 감사 추적과 장애 격리가 쉬워지고 규제 리스크를 코드 레벨에서 통제할 수 있다.

### [Simplifying Terraform for IBM Z with intent-driven workflows](https://www.hashicorp.com/blog/simplifying-terraform-for-ibm-z-with-intent-driven-workflows)

_HashiCorp_

해시코프가 IBM Terraform Self-Managed for Z and LinuxONE(Terraform for Z)에 의도 기반(intent-driven) 워크플로를 도입한다고 발표했다. 이는 운영자가 원하는 인프라 결과를 정의하면 가이드된 에이전트가 정해진 거버넌스 경계 안에서 작업을 실행하는 새로운 상호작용 모델로, 기존 인프라 리소스 탐색·환경 시뮬레이션·변경 사항 리허설이라는 세 가지 핵심 기능을 제공한다. 운영자는 Terraform에 대한 깊은 전문 지식 없이도 자연어로 의도를 설명하거나 정해진 워크플로 목록 중에서 선택할 수 있으며, 시스템이 필요한 단계를 안내하고 입력값을 수집해 변경 전에 검토용 증거를 제시한다. 변경을 실행하기 전에는 시뮬레이션된 환경에서 워크플로를 리허설해 팀이 프로세스를 검증하고 영향을 파악할 수 있게 하며, 의사결정·승인·생성된 산출물·실행 이력을 포함한 완전한 기록을 남겨 감사와 컴플라이언스에 활용할 수 있도록 한다. 초기 워크플로는 Terraform for Z 및 LinuxONE 환경의 배포 작업에 초점을 맞추며, 추가적인 인프라 수명주기 관리 워크플로도 계획돼 있다. 이 기능은 2026년 하반기 중 정식 출시(GA)될 예정이며, 관심 있는 이들은 해시코프 영업팀에 문의해 조기 접근을 요청할 수 있다.

> 💡 자연어 의도를 받아 리허설·증거 제시 후 실행하는 구조는 메인프레임처럼 변경 실수의 대가가 큰 환경에서 IaC 변경 리뷰 절차를 자동화하면서도 승인·실행 이력을 감사 추적으로 남길 수 있어, 규제 산업의 GitOps 파이프라인 설계에 참고할 만한 패턴이다.

### [The AI Hurricane Is Here](https://snyk.io/blog/ai-hurricane-is-here/)

_Snyk_

Snyk 블로그는 AI를 둘러싼 위험이 불확실한 안개에서 실제 피해를 일으키는 허리케인으로 전환됐다고 주장하며, 매주 심각한 취약점이 새로 발견되고 AI를 활용한 공격자가 정교한 공격의 진입 장벽을 낮추고 있으며 AI 공급망 자체가 새로운 공격 대상이 됐다고 지적한다. 글은 세 가지 핵심 문제를 짚는데, 자동화된 공격이 사람 속도의 처리 백로그를 압도하는 속도로 진행되는 점, 에이전틱(agentic) 개발이 검증되지 않은 도구를 스스로 불러다 쓰며 코드를 작성하는 점, 그리고 프로덕션에서 돌아가는 AI 애플리케이션들이 인벤토리도, 정책도, 감사 추적도 없이 운영되는 점을 든다. 글은 Dario Amodei의 프런티어 속도에 맞추자(pace the frontier)는 제안과 크라우드스트라이크 조지 커츠(George Kurtz)의 런타임 보안 반론을 함께 엮어, 코드나 수정 사항을 생성하는 시스템이 스스로의 유일한 검증자가 되어서는 안 된다는 공통 원칙을 이끌어낸다. 마지막으로 인셉션 단계에서 보안을 내재화하고, 런타임에 통제를 강제하며, 독립적으로 방어를 검증한다는 3단계 프레임워크로 마무리하며, 다가오는 Snyk-Anthropic 공동 웨비나를 함께 소개한다. 글은 실제 사례로 앤트로픽의 2026년 9월 보고서를 인용하는데, 러시아 국가 배후 스파이 조직이 AI 보조 워크플로를 이용해 자신들의 임플란트를 식별·수정·재빌드·재배포했고, 새로운 탐지 로직이 작성·배포되는 속도보다 AI가 방어 루프를 닫는 속도가 더 빨랐다는 내용이다.

> 💡 코드를 생성한 AI 시스템이 자기 결과물의 유일한 검증자가 되면 안 된다는 원칙은, CI/CD 파이프라인에 AI가 작성한 코드·설정 변경을 반드시 별도의 독립적 정책 엔진이나 런타임 통제로 재검증하는 게이트를 넣어야 한다는 실무 지침으로 바로 이어진다.

### [토스증권이 GPU-aware를 넘어 GPU-native 클러스터를 구축한 방법](https://toss.tech/article/gpu-native-cluster)

_토스_

토스증권은 수백 명의 개발자가 함께 쓰는 대규모 쿠버네티스 클러스터에서 GPU 리소스를 안정적으로 운영하기 위해, 단순히 GPU를 인식시키는 수준(GPU-aware)을 넘어 클러스터 운영 로직 전반을 GPU 중심으로 재설계하는 GPU-native 전략을 도입했다. 검증되지 않은 노드가 워크로드를 받아 장애를 일으키는 문제를 막기 위해, 정상 동작을 확인하는 꼼꼼한 검증 절차를 통과한 노드만 GPU 작업을 배정받도록 게이트를 두었다. 또한 여러 팀이 같은 GPU 자원을 공유할 때 워크로드가 서로 엉키지 않도록 세분화된 배치·격리 전략을 적용해, 팀 간 간섭을 줄이면서도 자원 활용률을 높였다. 이 과정에서 GPU 디바이스 설정뿐 아니라 쿠버네티스 스케줄링, 모니터링 설정까지 함께 재점검해 GPU 클러스터 운영의 여러 계층을 일관되게 관리했다. 이는 토스증권이 이전에 공개한 고성능 GPU 클러스터 도입기, GPU 가상화(MIG) 도입기 시리즈의 후속작으로, 앞선 작업에서 쌓은 운영 경험을 기반으로 한 것으로 보인다. 다만 이 세션에서는 toss.tech 도메인에 대한 직접 접근이 네트워크 정책으로 차단되어, 이 요약은 검색으로 확인된 해당 글의 내용을 바탕으로 작성했다.

> 💡 대규모 멀티테넌트 쿠버네티스에서 GPU를 안정적으로 공유하려면 디바이스 인식만으로는 부족하고, 노드 헬스체크 게이팅과 팀별 격리 정책을 스케줄러·모니터링 계층까지 함께 설계해야 한다는 점을 보여주는 사례다.

### [Monitor TAS and gang scheduling for AI training in Kubernetes](https://www.datadoghq.com/blog/monitor-tas-and-gang-scheduling-for-ai-training-in-kubernetes/)

_Datadog_

Datadog는 쿠버네티스에서 분산 AI 학습을 안정적으로 돌리기 위한 토폴로지 인식 스케줄링(Topology-Aware Scheduling, TAS)과 갱 스케줄링(gang scheduling)을 어떻게 모니터링하는지 설명한다. TAS는 노드를 블록·랙·호스트 같은 토폴로지 단위로 묶고, 작업의 파드들을 하나의 도메인 안에 배치해 학습 중 GPU 간 통신 지연을 최소화하는 역할을 한다. 갱 스케줄링은 일부 파드만 먼저 실행되고 나머지는 대기하는 "부분 갱 시작"으로 인해 할당된 GPU가 놀게 되는 상황을 막기 위해, 필요한 워커 파드 전체가 동시에 바인딩되도록 전부-아니면-전무 방식을 강제한다. 이를 위해 스케줄러 위에서 어드미션을 결정하고 파드 템플릿에 토폴로지 제약을 기록하는 오픈소스 잡 큐 Kueue와, PodGroup 커스텀 리소스로 갱 조립을 조율하는 Coscheduling 플러그인이 쓰인다. Datadog는 kueue_pending_workloads(상태별 큐 깊이), kueue_admission_wait_time_seconds(p99 상승 시 병목 신호), kueue_evicted_workloads_total(NodeFailures 사유는 TAS 관련 용량 손실을 의미) 같은 Kueue 메트릭과 PodGroup의 .status.phase(Pending/Scheduling/Running/Failed)를 함께 수집한다. 여기에 GPU NVLink·PCIe 처리량, Ray의 ray_placement_groups·ray_tasks, PyTorch DDP/Horovod의 초당 스텝·토큰 처리량 지표를 상관분석해 학습이 멈췄을 때 배치 실패인지 갱 조립 실패인지 판별하며, Capacity Planning·GPU Fleet Explorer·Training Optimization·Continuous Tracing(NCCL 스팬 포함) 같은 프리뷰 기능으로 랙 등 토폴로지 태그 기준의 교차 상관을 지원한다.

> 💡 학습 파이프라인이 멈췄을 때 GPU가 비어있는지, 갱 조립이 안 됐는지, 토폴로지 배치가 잘못됐는지를 구분하려면 Kueue의 admission·eviction 메트릭과 PodGroup 상태, GPU NVLink·PCIe 처리량을 토폴로지 태그로 교차 상관시키는 대시보드를 미리 갖춰둬야 사고 시 원인 특정 시간을 크게 줄일 수 있다.

### [How to operate shared platforms safely at agent scale](https://www.datadoghq.com/blog/operating-shared-platforms-agent-scale/)

_Datadog_

Datadog는 여러 팀이 하나의 플랫폼을 공유하며 AI 에이전트를 운영할 때 안전하게 확장하는 방법을 설명한다. 핵심은 모델 트래픽만 볼 게 아니라 트리거, 모델 요청, 도구 호출, 큐, CI·워크플로 작업, 샌드박스 연산, 다운스트림 API, 최종 부작용까지 이어지는 전체 "에이전트 궤적"을 매핑해 의존성을 완전히 파악하는 것이다. 대화형 에이전트와 백그라운드 코딩 에이전트는 의존성 구조는 비슷하지만 용량 프로필이 완전히 다른데, 전자는 저지연 응답과 동시 연결이 필요하고 후자는 몇 시간에 걸쳐 작업이 큐에 쌓인다. 실제로 Datadog 내부의 코딩 에이전트 평가에서 분당 요청 수(RPM) 2,000건, 하루 토큰 소비량 450억 개로 추산됐는데, RPM은 감당할 만했지만 토큰 소비량은 업스트림 토큰 처리량 한도에 근접했을 것이라고 밝힌다. 용량 부족 상황에 대응하기 위해 워크로드·오너·환경·서비스 등급·태스크(런) ID 같은 일관된 식별자로 출처를 구분하고, 중요도별로 큐잉·동시성 축소·폴백·거부 중 어떤 과부하 대응을 할지 정하는 워크로드 클래스 정책을 권장한다. Datadog는 고객 트래픽을 보호하는 출처별 레이트리밋 버킷을 두고 평가용 트래픽은 아예 별도 프로바이더 계정으로 분리했으며, 실제 트래픽 급증 시 일부 스팬에 호출 출처가 "unknown"으로 태깅되는 문제를 겪은 뒤 429 응답으로 조기 반환되는 요청에도 호출 출처를 남기도록 거부 텔레메트리를 개선했고, AI 게이트웨이의 그레이스풀 셧다운 대기 시간도 5초에서 60초로 늘려 롤링 배포 중 p99 인플라이트 요청이 여유 있게 끝나도록 했다.

> 💡 에이전트 워크로드를 모델 API 트래픽만으로 용량 계획하면 안 되고, 큐·CI 잡·샌드박스까지 포함한 전체 궤적을 워크로드 등급별로 식별·레이트리밋하고 AI 게이트웨이의 그레이스풀 셧다운 시간도 넉넉히 둬야, 특정 팀의 평가 트래픽이 고객 트래픽을 잠식하거나 롤링 배포 중 요청이 끊기는 사고를 막을 수 있다.

### [Manage Cursor costs with Datadog Cloud Cost Management](https://www.datadoghq.com/blog/cursor-cloud-cost-management/)

_Datadog_

Datadog는 클라우드 비용 관리(Cloud Cost Management, CCM) 플랫폼에 AI 코딩 도구 Cursor를 통합해, 기존에는 인프라 비용과 따로 관리되던 AI 엔지니어링 지출을 하나로 합쳐 볼 수 있게 했다. 사용자, AI 모델, Max Mode 여부, 헤드리스 모드, 빌링 그룹별로 Cursor 지출을 필터링할 수 있고, 사용자별 비용과 기간 대비 변화를 함께 보여줘 지출 변화나 이상치 사용자를 바로 찾아낼 수 있다. 기본 제공 대시보드는 30일 단위 사용량 변화 추이, 예산 소진 위젯, 모델별 비용 비교와 더불어, 탭 완성 수락률(tab completion acceptance rate)과 수락된 코드 한 줄당 비용 같은 지표를 담은 "효율성" 섹션을 제공한다. 과거 패턴에서 벗어난 지출 급증을 자동으로 감지하는 이상 탐지 기능도 있으며, Bits Chat과 연동해 급증 원인이 특정 모델·사용자·기능 중 무엇인지 근본 원인 분석을 제공한다. 팀은 임계값 기반 알림을 주는 비용 모니터와 예산을 설정해 예산 초과를 사전에 막을 수 있다. Cursor 비용은 AWS·Azure 같은 클라우드, Snowflake·Databricks 같은 SaaS, OpenAI·Anthropic 같은 다른 AI 프로바이더 지출과 함께 하나의 대시보드에서 통합 분석된다.

> 💡 탭 완성 수락률·수락 코드 한 줄당 비용 같은 효율성 지표를 비용 데이터와 나란히 두면, 단순히 Cursor 지출을 줄이는 것이 아니라 생산성 대비 비용이 적절한가를 근거로 예산을 조정할 수 있다.

### [What Stripe data shows about fraud at AI startups](https://stripe.com/blog/what-stripe-data-shows-about-fraud-at-ai-startups)

_Stripe_

스트라이프가 지난 1년간 자사 플랫폼의 사기 시도율과 고객 어뷰징 패턴을 분석한 결과, 2025년 3분기 기준 AI 스타트업의 사기 시도율이 전체 스타트업 평균보다 4.3배 높은 것으로 나타났다. 더 구체적으로는 AI 서비스 가입 시도 6건 중 1건이 사기성 활동과 연관돼 있는 것으로 집계됐다. 특히 최근 6개월 사이 AI 구독 기업을 겨냥한 다중 계정 어뷰징이 40% 증가했으며, 가장 집중적으로 공격받은 기업들은 평균 154% 증가, 일부는 600%를 넘는 증가를 겪었다. 배경에는 AI 경제 특유의 구조가 있는데, 일반 소프트웨어 무료 체험과 달리 AI 서비스 가입에는 되팔 수 있는 컴퓨팅 토큰이 딸려오기 때문에 사기범들이 결제 사기보다 무료 체험·토큰 지급 어뷰징 쪽으로 공격 방식을 옮겨가고 있다는 것이다. 스트라이프는 이에 대응해 사기 탐지 제품인 Radar의 역량을 강화해 AI 스타트업이 이런 점점 정교해지는 공격 패턴에 맞설 수 있도록 돕고 있다고 밝혔다.

> 💡 무료 체험에 딸려오는 컴퓨팅 토큰 자체가 환금성 있는 자산이 되면서 어뷰징 벡터가 결제 사기에서 가입·크레딧 어뷰징으로 이동했으므로, AI 서비스를 운영하는 팀은 결제 사기 방어뿐 아니라 신규 가입·토큰 지급 단계의 이상 탐지를 별도로 강화해야 한다.

### [Digital Experience Monitoring with Grafana Cloud: Session Replay, synthetic checks, and faster investigations](https://grafana.com/blog/digital-experience-monitoring-with-grafana-cloud-session-replay-synthetic-checks-and-faster-investigations/)

_Grafana_

그라파나 랩스는 그라파나 클라우드의 디지털 경험 모니터링(Digital Experience Monitoring) 기능을 세션 리플레이, 신시틱 체크, 더 빠른 장애 조사라는 세 축으로 확장했다고 발표했다. 신시틱 모니터링(Synthetic Monitoring)은 핵심 사용자 여정에 대해 자동화된 체크를 주기적으로 실행해 실제 사용자가 문제를 겪기 전에 장애를 잡아내는 역할을 한다. 프런트엔드 옵저버빌리티의 세션 리플레이는 사용자가 웹 애플리케이션 안에서 실제로 본 화면과 행동을 시각적으로 재생할 수 있게 해주며, 이를 Core Web Vitals, 사용자 액션, 트레이스 같은 실사용자 모니터링 신호와 연계해 버그 조사와 근본 원인 분석에 활용할 수 있다. 이번 업데이트의 핵심은 신시틱 모니터링과 프런트엔드 옵저버빌리티의 통합으로, 신시틱 브라우저 체크가 실행될 때마다 자동으로 프런트엔드 옵저버빌리티 세션이 생성돼 체크 실패 즉시 리플레이·사용자 여정·연관 트레이스로 바로 이동해 실제 사용자에게 미친 영향을 확인할 수 있다. 그라파나 랩스는 이 조합이 평균 복구 시간(MTTR)을 시간 단위에서 분 단위로 줄여준다고 설명하며, 결국 능동적·통제된 신시틱 신호와 실사용자 기반 신호를 하나의 플랫폼에서 엮어 디지털 경험 모니터링을 완성하는 것을 목표로 한다.

> 💡 신시틱 체크 실패에서 곧바로 프런트엔드 세션 리플레이·트레이스로 연결되는 구조는, 온콜 엔지니어가 이 실패가 진짜 사용자에게 영향을 줬는지를 알림 하나로 즉시 판단할 수 있게 해 불필요한 에스컬레이션을 줄여준다.

### [How Canvas Powers the AI Agent Development Feedback Loop](https://www.honeycomb.io/blog/how-canvas-powers-ai-agent-development-feedback-loop)

_Honeycomb_

허니콤은 자사의 AI 기반 관측 워크스페이스인 Canvas가 AI 에이전트 개발의 피드백 루프 전 단계, 즉 계측, 단일 실행 이해, 고칠 가치가 있는 문제 찾기, 수정사항 배포, 효과 검증을 어떻게 지원하는지 설명한다. 기반이 되는 텔레메트리는 모델 호출, 도구 호출, 핸드오프마다 타이밍·토큰·에러를 함께 기록하며, 각 단계는 스팬으로, 하나의 요청에서 나온 스팬들은 트레이스로, 하나의 완전한 에이전트 실행에서 나온 트레이스들은 대화(conversation) 단위로 묶인다. 허니콤은 오픈텔레메트리(OpenTelemetry) 프로젝트의 주요 기여자로서, OTel GenAI 시맨틱 컨벤션 v1.40.0을 플랫폼에 통합해 gen_ai.* 속성을 1급 시민으로 취급하고, 모델 평가·도구 실행·MCP 호출·LLM·에이전트가 모두 일관되게 관측되도록 했다. Canvas는 허니콤의 오픈텔레메트리 네이티브·이벤트 기반 아키텍처 위에 구축돼, AI가 조사를 인터랙티브하고 설명 가능하며 실행 가능하게 만드는 데 필요한 속도와 맥락을 제공한다. 이를 통해 텔레메트리는 단순 디버깅뿐 아니라 행동 분석, 개선 방향 제시, 실험 측정, 비즈니스 가치 증명까지 아우르는 용도로 설계됐다.

> 💡 에이전트 관측을 별도 도구로 다루기보다 기존 OTel GenAI 시맨틱 컨벤션(gen_ai.* 속성)을 채택해 모델·도구·MCP 호출을 표준 스팬·트레이스로 계측해두면, 에이전트 실행도 기존 서비스 관측 파이프라인과 툴체인에 그대로 얹을 수 있다.

### [GitLab Dedicated: Compliance for a new regulatory era](https://about.gitlab.com/blog/gitlab-dedicated-compliance/)

_GitLab_

이 글은 NIS2 같은 규제가 더 이상 먼 미래의 계획 사항이 아니라 지금 당장 대응해야 하는 현실이라는 점을 짚으며 시작한다. 유럽연합 사이버보안청(ENISA)의 NIS360 보고서는 회원국과 각국 감독기관이 NIS2 대상 핵심 분야의 사이버보안 성숙도를 평가하고 격차를 식별하도록 돕기 위해 마련됐으며, 감독당국이 실제로 각 산업 분야의 보안 성숙도를 적극적으로 점검하고 있음을 확인해준다. 2022년 12월 채택된 NIS2 지침은 필수·중요 기관에게 사이버보안 강화, 기술 공급망 보호, EU 전역에 걸친 중대 사고의 신속한 보고를 요구한다. GitLab은 이런 규제 환경에서 GitLab Dedicated라는 싱글테넌트 환경이 격리·통제·감사 대응력을 제공해 DORA, NIS2, GDPR 준수를 단일 플랫폼에서 단순화한다고 설명한다. 구체적으로는 GitLab의 Secure 스테이지가 코드 보안과 공급망 리스크를 탐지·대응할 수 있는 기능을 제공해, NIS2가 요구하는 공급업체·서비스 제공자와의 공급망 보안 리스크 관리를 지원한다고 밝힌다.

> 💡 NIS2가 공급망 보안·사고 신속 보고를 요구하는 만큼, EU 대상 서비스를 운영하는 팀은 싱글테넌트 격리와 Secure 스테이지형 공급망 스캐닝을 CI/CD 파이프라인에 기본값으로 넣는 편이 감사 대응 비용을 줄인다.

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
