---
title: "📰 데일리 테크 다이제스트 - 2026-07-25"
description: "2026-07-25 Cloud, Kubernetes, AI, DevOps 소식 14건 — 자동 큐레이션 다이제스트."
pubDate: 2026-07-25
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### Opus 5 costs a third of the price — and that’s actually the problem

앤스로픽이 금요일 Opus 5를 출시했다. Opus 4.8이 나온 지 두 달 만이고 6월의 Mythos 5, Fable 5, Sonnet 5 릴리스에 이어 새 세대를 마무리하는 모델로, 경량 Haiku만 업그레이드를 기다리게 됐다. 플래그십 Fable 5보다 작지만 훨씬 저렴하고 눈에 띄게 덜 제한적이며, 사람의 개입 없이 훨씬 오래 프로그래밍 작업을 이어가도록 설계됐다. 가격은 100만 입력 토큰당 5달러, 출력 25달러로 에이전틱 작업의 비용 대비 성능 비율을 뒤집는다. Frontier-Bench와 GDPval-AA 같은 코딩·지식 노동 평가에서 새로운 최고 수준을 세웠고, OSWorld 2.0 컴퓨터 사용 벤치마크에서는 어떤 비용대에서도 다른 모든 모델을 앞서며 Fable 5의 최고 성적을 3분의 1을 조금 넘는 가격으로 넘어섰다. 새로운 문제를 풀어야 하는 ARC-AGI 3에서는 차순위 모델의 세 배 점수를 냈다. 운영 비용이 낮아진 덕에 팀은 더 큰 코딩 작업을 맡길 여유가 생기는데, 그만큼 보안을 다르게 생각해야 한다는 것이 기사의 지적이다. 앤스로픽은 이 모델이 자기 작업을 검증하고 성공할 때까지 신중하게 반복하는 데 훨씬 강하다고 밝혔으며, 벤치마크 테스트에서 불완전한 프롬프트를 받고 기계 부품 도면을 볼 수 없게 막히자 이미지 데이터로 부품을 재구성하는 컴퓨터 비전 파이프라인을 스스로 작성했다.

> 💡 **왜 중요한가**: 가격이 내려가 더 큰 작업을 맡기게 되면 에이전트의 실행 반경도 함께 커지므로, 비용 절감을 챙기기 전에 격리 환경부터 준비하는 순서가 맞다.

🔗 [원문 보기](https://thenewstack.io/opus-5-agentic-coding-cost/) · _The New Stack_

---

## Kubernetes & Cloud Native

### [Agentic AI Needs Guardrails, Not Guesswork](https://www.docker.com/blog/agentic-ai-needs-guardrails-not-guesswork/)

_Docker_

Docker가 엔터프라이즈 보안 리더들을 모아 에이전틱 AI의 최대 과제인 "개발자를 늦추지 않으면서 AI 에이전트를 통제하는 방법"을 논의한 라운드테이블을 정리했다. 참여자는 Docker CISO Mark Lechner, Warp 창업자 겸 CEO Zach Lloyd, NanoCo 공동창업자 겸 CEO Gavriel Cohen, CISO 커뮤니티 창립자 Moriah Hara다. Moriah Hara는 사업 부서는 AI 에이전트를 어디에나 두고 싶어 하는데 CISO는 일부 도구를 감내하며 아무것도 터지지 않기를 기도하는 처지에 놓인다고 말했다. Zach Lloyd는 중앙집중식 가시성과 접근 통제를 갖춘 클라우드 기반 에이전트 인프라를 주장했다. Gavriel Cohen은 권한이 없는 데이터부터 시작하는 보조 바퀴식 접근과 이미지에 최소 7일의 릴리스 경과 기간을 두라고 권했다. 언급된 Docker 제품은 격리되고 폐기 가능한 마이크로VM 기반 에이전트 실행 환경 Docker Sandboxes, 팀 전반의 에이전트 통제를 담당하는 Docker AI Governance, 안전한 기반 이미지인 Docker Hardened Images, 도구 호출의 인증·인가·로깅을 담당하는 병목 지점 Docker MCP Gateway다.

> 💡 이미지에 최소 7일의 릴리스 경과를 요구하라는 권고는 Dependabot의 3일 쿨다운과 같은 논리이며, 공급망 방어의 기본 패턴이 "즉시 채택하지 않기"로 수렴하고 있음을 보여준다.

### [My LFX mentorship journey with kgateway](https://www.cncf.io/blog/2026/07/24/my-lfx-mentorship-journey-with-kgateway/)

_CNCF_

CNCF 블로그가 kgateway로 진행한 LFX 멘토십 경험기를 실었다. 필자는 클라우드 네이티브 생태계에서 오랫동안 일해온 엔지니어로 오픈소스가 경력의 핵심이었다고 밝힌다. kgateway는 Envoy Proxy와 쿠버네티스 Gateway API 위에 세워져 쿠버네티스 환경의 트래픽을 관리하며 강력하고 확장 가능한 기반을 제공한다. 멘토십 과제는 HTTP 폴트 주입을 통한 카오스 엔지니어링 지원을 추가하는 것으로, 플랫폼 팀이 지연과 중단 같은 실패를 트래픽에 의도적으로 주입할 수 있게 한다. 기여 내용은 TrafficPolicy 확장을 통한 폴트 주입 구현으로 지연 주입, HTTP·gRPC 상태 코드를 쓰는 중단 주입, 응답 속도 제한, 라우트별 재정의를 포함한다. 이 밖에 BackendConfigPolicy 병합 의미론 작업을 완료했고 ExtProc의 필터 단계 위치를 설정 가능하게 만들었다.

> 💡 게이트웨이 계층에서 폴트를 주입할 수 있으면 애플리케이션을 건드리지 않고 회복탄력성을 시험할 수 있어, 카오스 실험의 도입 장벽이 낮아진다.

### [OpenTelemetry has graduated… Now what?](https://www.cncf.io/blog/2026/07/24/opentelemetry-has-graduated-now-what/)

_CNCF_

CNCF가 OpenTelemetry의 졸업 이후를 다뤘다. OpenTelemetry는 2026년 5월 CNCF 졸업 지위를 획득해 쿠버네티스, 프로메테우스 같은 프로젝트와 나란히 운영 준비된 엔터프라이즈급 표준의 자리에 올랐다. 프로젝트 통계로는 2,800개가 넘는 기업에서 온 1만 2천 건 이상의 기여와 수백 명의 메인테이너를 보유하며, 쿠버네티스에 이어 CNCF 프로젝트 중 두 번째로 높은 속도를 기록한다. 졸업 요건으로는 주요 조직 전반의 운영 채택, 문서화된 거버넌스 모델, 확립된 커뮤니티 건강성 절차, 완료된 보안 감사, 안정적인 버전 관리 API, 포괄적 문서, TOC 심사 통과를 충족했다. 향후 로드맵은 생성형 AI 시맨틱 컨벤션을 통한 에이전틱 워크플로 관측성, 브라우저·모바일 관측성 확대, 텔레메트리 스키마 거버넌스를 담당하는 Weaver와 무코드 계측을 제공하는 OpenTelemetry Injector를 통한 엔터프라이즈 규모 도구화다. 생태계 성장으로는 프로파일링을 신호로 추가하고 OTel Collector와 Demo를 확장했으며 OpAMP, OTel Operator, Weaver, Arrow 구성요소를 도입했다.

> 💡 생성형 AI 시맨틱 컨벤션이 로드맵에 올랐다는 점이 실무적으로 중요해서, 에이전트 계측을 자체 규격으로 만들고 있다면 표준화를 기다릴지 판단할 근거가 된다.

### [Launch of the AI Infra SIG under the CNCF Japan chapter: First meetup and call for speakers](https://www.cncf.io/blog/2026/07/23/launch-of-the-ai-infra-sig-under-the-cncf-japan-chapter-first-meetup-and-call-for-speakers/)

_CNCF_

CNCF 일본 챕터 산하에 AI Infra SIG가 출범하며 첫 밋업과 발표자 모집을 알렸다. AI가 생성형에서 에이전트로 나아가면서 확장 가능하고 효율적인 인프라 수요가 커지고 있다는 것이 배경이다. SIG는 클라우드 네이티브 AI 인프라의 모범 사례를 다루며 범위는 스케줄링(DRA, Kueue), 오케스트레이션(JobSet, KubeRay), 배포 플랫폼(KServe, llm-d), 네트워킹, 에이전트 인프라를 포괄한다. 첫 밋업은 2026년 10월 1일 18:00~21:00 JST에 도쿄 Garden Terrace Kioicho에서 열리며 라이브 스트림도 제공되고 등록은 무료다. 발표자 모집 마감은 2026년 8월 28일이며 일반 세션은 20~30분, 라이트닝 토크는 5~10분이다. 운영진은 LY Corporation, IBM Research Tokyo, CyberAgent, Preferred Networks에서 온 공동 리드 6명이며 Cloud Native Community Japan 산하에 이 SIG를 세웠다. 목표는 AI 인프라의 최적화 기법, 운영 모범 사례, 실제 경험을 공유하면서 업스트림 오픈소스 기여를 강화하는 것이다.

> 💡 SIG 범위가 스케줄링부터 에이전트 인프라까지 걸쳐 있다는 점에서, AI 인프라 논의가 GPU 할당을 넘어 워크로드 오케스트레이션 전반으로 넓어지고 있음을 보여준다.

---

## 클라우드 업데이트

### [BGP ORIGIN attribute manipulation and its impact on the Internet](https://blog.cloudflare.com/bgp-origin-attribute/)

_Cloudflare_

Cloudflare가 BGP ORIGIN 속성 조작과 그것이 인터넷에 미치는 영향을 심층 조사했다. 결과는 트래픽 상의 이점을 노리는 트랜싯 제공자에 의해 BGP 경로의 거의 70%가 ORIGIN 속성 재작성을 겪는다는 것이다. 공개 BGP 수집기 전반의 ORIGIN 값 분포는 IGP 89.8%, EGP 3.5%, INCOMPLETE 6.7%였다. 직접 피어 분석에서는 피어의 약 10%가 ORIGIN을 IGP로 조작했고 상위 50개 AS 중 26%가 이 관행에 관여했다. ORIGIN 재작성은 트래픽을 대형 Tier-1 ISP 쪽으로 몰아가며, IPv6 경로에서는 조작하는 네트워크를 통과하는 경로가 40% 더 많아졌다. RFC 4271은 ORIGIN이 다른 스피커에 의해 변경되어서는 안 된다고 규정하지만 위반이 광범위하게 일어나고 있다. 현대 인터넷 라우팅에서 ORIGIN 재작성에 정당한 기술적 근거는 없다는 것이 결론이다. 권고는 모든 BGP 구현이 수신·광고하는 모든 경로에서 ORIGIN을 IGP로 설정하도록 요구하는 것이며, ORIGIN이 경로 선택에 미치는 영향을 폐기하는 "Scrubbing BGP ORIGIN Attribute" 초안의 부활을 제안한다.

> 💡 경로의 70%가 재작성된다면 ORIGIN은 사실상 신호로서 의미를 잃은 셈이라, 이 속성에 기대는 트래픽 엔지니어링 정책은 근거를 다시 확인해야 한다.

### [Open Knowledge format v0.2 tackles agentic trust](https://cloud.google.com/blog/products/data-analytics/okf-v0-2-adds-trust-signals/)

_Google Cloud_

구글 클라우드가 Open Knowledge Format(OKF) v0.2를 공개했다. 2026년 6월 OKF를 처음 소개할 때 에이전트에 필요한 맥락(테이블 스키마, 지표 정의, 런북)을 다뤄야 한다고 주장한 바 있다. OKF는 마크다운과 YAML 프론트매터로 구조화된 메타데이터를 형식 중립적으로 공유하는 명세로, AI 에이전트가 지식 번들을 읽고 쓸 수 있게 한다. v0.2는 에이전트가 신뢰도를 판단할 수 있게 하는 다섯 가지 신뢰 신호 계열을 추가했다. 출처를 나타내는 provenance, 생성·검증 여부를 나타내는 trust, `stale_after`로 표현하는 freshness, 상태를 나타내는 lifecycle, Attested Computation 유형의 attestation이다. 구체적 신호로는 `generated`, `verified`, `sources`, `status`, `stale_after`, `usage_count`, `last_modified`, `executor`, `attester`, `receipt`가 있다. 핵심 기능인 Attested Computation은 승인된 연산과 결정적 검증자를 함께 담아 선언된 대로 정확한 SQL·쿼리가 실행됐는지 job_id·executed_sql·result를 담은 영수증으로 확인한다. v0.2는 추가 방식이라 v0.1 번들은 그대로 동작한다.

> 💡 에이전트가 읽는 메타데이터에 신선도와 검증 여부를 명시적으로 담는 접근은, 에이전트가 오래된 런북을 근거로 판단하는 실패를 구조적으로 막는 방법이다.

### [What’s new with Google Cloud](https://cloud.google.com/blog/topics/inside-google-cloud/whats-new-google-cloud/)

_Google Cloud_

구글 클라우드의 "What's new with Google Cloud" 페이지가 다이제스트에 포함됐다. 구글 클라우드의 최신 소식과 발표, 자료, 행사, 학습 기회를 한곳에 모으는 상시 갱신 허브다. 계속 갱신되는 페이지라 수집 시점의 개별 항목은 이후 내용과 다르다.

> 💡 같은 URL의 상시 허브 페이지가 여러 날짜의 다이제스트에 반복 등장하므로, 수집 파이프라인에서 중복 배제 규칙을 둘지 판단할 근거가 된다.

### [Updated Cyber Threat Actor Naming System](https://cloud.google.com/blog/topics/threat-intelligence/updated-cyber-threat-actor-naming-system/)

_Google Cloud_

Google Threat Intelligence Group(GTIG)이 위협 행위자 추적을 위한 통합 명명 체계를 도입한다고 밝혔다. 새 체계는 두 단어 조합의 암호명 방식이다. 첫 단어는 특정 행위자를 가리키는 고유하고 기억하기 쉬운 용어로, 가능하면 기존 공개 보고서에서 가져오고 없으면 무작위로 생성한다. 두 번째 단어는 출신·동기에 따라 위협 클러스터를 분류하며 CASTLE(중국), ION(이란), NEPTUNE(북한), RELIC(러시아), COMET(사이버 범죄)로 나뉜다. 예시로 FIN11은 RAZOR COMET, APT28은 LAKE RELIC, APT33은 BLEAK ION, APT37은 PLAIN NEPTUNE이 된다. 도입은 가장 활발한 수십 개 그룹부터 순차적으로 개명하는 방식이며 이전 이름도 GTI 플랫폼에서 계속 검색할 수 있고 MITRE ATT&CK 매핑도 유지된다. 초기 조사 단계의 위협 클러스터에는 계속 UNC(미분류) 표기를 쓴다. 발표일은 2026년 7월 25일이고 7월 30일 갱신에서 전체 명명 표가 추가됐다.

> 💡 이전 이름이 계속 검색된다는 점이 실무적으로 중요해서, 기존 위협 인텔 문서와 탐지 규칙을 당장 고치지 않아도 되지만 표기 혼재는 관리 대상이 된다.

### [Gain stronger pod isolation on Microsoft Azure Red Hat OpenShift with OpenShift sandboxed containers](https://www.redhat.com/en/blog/gain-stronger-pod-isolation-microsoft-azure-red-hat-openshift-openshift-sandboxed-containers)

_Red Hat_

Red Hat이 Microsoft Azure Red Hat OpenShift에서 OpenShift sandboxed containers로 파드 격리를 강화하는 방법을 소개했다. OpenShift에서 컨테이너 워크로드를 돌리고 있다면 이미 업계 최고 수준의 프로세스 격리를 누리고 있다는 전제에서 출발한다. 이 기능은 각 파드를 전용 커널을 가진 경량 VM 안에서 돌려 하이퍼바이저 기반 워크로드 격리를 기존 OpenShift 보안 통제 위에 얹는다. 기술 기반은 각 파드를 자체 경량 VM에서 돌리는 오픈소스 프로젝트 Kata Containers다. Azure Red Hat OpenShift에서 사용할 수 있으며 OpenShift sandboxed containers 오퍼레이터가 설치·설정·수명주기 관리를 담당한다. 배포는 OperatorHub에서 오퍼레이터를 설치하고 KataConfig 리소스를 만든 뒤 파드 명세에 `runtimeClassName`을 추가하는 방식이다. 권장 용도는 신뢰할 수 없는 코드, 특권 컨테이너, 멀티테넌트 워크로드, 그리고 런타임에 검토되지 않은 코드를 생성하는 AI·에이전트 워크로드다. 샌드박스 파드는 자기 VM에 할당된 것보다 많은 CPU·메모리를 쓸 수 없고 명시적으로 통과시킨 장치에만 접근할 수 있다.

> 💡 런타임에 검토되지 않은 코드를 생성하는 에이전트 워크로드가 권장 용도로 명시됐다는 점이, 에이전트 실행 환경 격리를 컨테이너가 아닌 VM 수준에서 잡아야 하는 이유를 뒷받침한다.

### [Friday Five — July 24, 2026](https://www.redhat.com/en/blog/friday-five-july-24-2026-red-hat)

_Red Hat_

Red Hat의 주간 소식 모음 "Friday Five" 2026년 7월 24일자다. 첫째, KubeCon + CloudNativeCon North America와 나란히 열리는 Red Hat OpenShift Commons Gathering Salt Lake City 2026 등록이 시작됐다. 사용자·기여자·파트너·Red Hat 전문가를 아우르는 글로벌 OpenShift 커뮤니티가 모여 지식과 운영 경험을 공유하는 자리다. 둘째, Red Hat이 파트너의 일상 운영을 간소화하고 투자를 보호하며 명확한 재무 활주로를 제공하기 위한 다섯 가지 파트너 프로그램 개선을 발표했다. 셋째, Red Hat의 Vincent Danen이 AI 에이전트가 기업 위험을 어떻게 재편하는지 인터뷰했다. AI가 고객 지원, 소프트웨어 개발, 운영 워크플로에 이미 내장돼 있고 보안 요건이 계속 변하고 있다는 내용이다. 넷째, 암호학적으로 유의미한 양자 컴퓨터가 보안팀이 지금 대비해야 할 시급한 일정이라는 점을 다루며 공격자들이 이미 암호화된 기업 트래픽을 수집해 저장하고 있다고 경고한다. 다섯째, Kubernetes Fleet Management Report 2026이 복잡한 분산 환경 전반의 조직적 관리 문제를 다루며 과제가 도입에서 운영으로, 즉 규모에서 클러스터를 일관되게 운영하는 쪽으로 옮겨갔다고 짚는다.

> 💡 "지금 수집해두고 나중에 복호화한다"는 위협 모델이 명시된 만큼, 장기 기밀성이 필요한 데이터라면 양자 내성 전환 일정을 미룰 근거가 약해진다.

### [Beyond the blind spots: Defeating frontier AI model threats in your application development process](https://www.redhat.com/en/blog/beyond-blind-spots-defeating-frontier-ai-model-threats-your-application-development-process)

_Red Hat_

Red Hat이 프런티어 AI 모델이 애플리케이션 개발 과정에 만드는 위협과 대응을 다뤘다. 몇 달 전을 돌아보면 사이버보안 세계가 얼마나 많이 바뀌었는지 놀랍다는 인식에서 출발한다. 위협으로는 프런티어 모델(Claude Mythos)이 오픈소스 코드베이스의 취약점을 기계 속도로 자율 발견한다는 점, 취약점 보고가 1년에서 2주 단위로 압축돼 연간 분류 물량이 두 배로 늘었다는 점, 자체 구축 쿠버네티스의 파편화로 수십만 개의 중첩 CVE 의존성이 만드는 "전장의 안개", 활짝 열린 동서 컨테이너 트래픽을 악용하는 측면 이동을 든다. 권장 방어로는 개발자 파이프라인 통합을 통한 보안 좌측 이동, 마이크로세그멘테이션과 제로 트러스트 네트워크 정책, 아티팩트와 컨테이너 이미지의 암호학적 서명 강제, 사전 강화된 "골든 패스" 템플릿 사용을 제시한다. 언급된 Red Hat 제품은 자동 패치·커널 보안 수정·불변 CoreOS를 갖춘 OpenShift, 백포트 패치로 AI 기반 수정을 하는 Lightwell, 코드 서명의 Trusted Artifact Signer, SBOM 감사의 Trusted Profile Analyzer, 런타임 모니터링의 Advanced Cluster Security, 규정 준수 템플릿의 Developer Hub, 중앙 구성요소 저장소인 Quay다.

> 💡 취약점 보고 주기가 1년에서 2주로 압축돼 분류 물량이 두 배가 됐다는 관측이 핵심이며, 사람 손으로 CVE를 분류하던 절차는 그 속도를 따라갈 수 없다는 뜻이다.

---

## DevOps & 인프라

### [Jensen Huang made his first X post. He used it to lobby Washington about open-weight AI.](https://thenewstack.io/nvidia-open-weight-letter/)

_The New Stack_

NVIDIA CEO 젠슨 황이 X에 올린 첫 게시물로 프런티어 오픈 웨이트 모델을 지지하는 공개 서한을 공유했다. 마이크로소프트, 메타, Hugging Face를 비롯한 25개 조직이 서명한 이 서한은 오픈 모델이 보안을 개선하고 더 빠른 혁신을 이끌며 국가와 기업이 자국 AI 인프라를 더 잘 통제할 수 있게 한다고 주장한다. 금요일이라는 시점이 눈에 띄는데, 호스팅 서비스에만 의존하는 대신 오픈 웨이트 모델을 자체 환경에서 돌리는 조직이 늘고 있는 흐름과 맞물리기 때문이다. 서한은 오픈 웨이트 AI를 오픈소스 소프트웨어에 견주며 광범위한 접근이 수십 년의 소프트웨어 혁신을 이끌었고 같은 원리가 AI에도 적용된다고 본다. 모든 요청을 호스팅 모델로 보내는 대신, 조직은 오픈 웨이트 모델을 내려받아 자체 인프라에서 돌리고 특정 워크로드에 맞게 커스터마이즈하며 민감한 데이터를 자기 방화벽 뒤에 둘 수 있다는 것이다. NVIDIA는 이미 이 방향으로 움직여왔고 로컬 모델과 프런티어 모델이 비용·속도·통제를 기준으로 일을 나누는 미래를 그려왔다. 서한은 오픈 웨이트가 모든 조직이 적절한 비용에 적절한 작업에 적절한 모델을 맞출 수 있게 해, 진짜 프런티어 문제에만 프런티어급 역량을 남기고 나머지는 효율적인 특화 모델로 처리하게 한다고 주장한다.

> 💡 "진짜 프런티어 문제에만 프런티어급 역량을 남긴다"는 표현이 실용적 배분 기준이라, 모든 요청을 최상위 모델로 보내는 구조라면 작업 난도별 분류부터 시작할 만하다.

### [Anthropic’s Opus 5 is almost Fable 5](https://thenewstack.io/anthropics-opus-5-almost-fable-5/)

_The New Stack_

앤스로픽이 금요일 Opus 5를 출시했다. Fable 5 출시 전까지 회사의 플래그십이던 계열의 최신 버전으로, 앤스로픽은 Opus 5가 여러 영역에서 Fable 5의 성능에 근접하면서 가격은 절반이라고 밝혔다. 토큰 비용은 100만 입력·출력당 5달러와 25달러로 Opus 4.8과 같다. Fable 5와 달리 30일 데이터 보존 정책에 동의하지 않아도 쓸 수 있고, Claude Max 구독자의 기본 모델이자 Claude Pro 구독자가 접근할 수 있는 최고 모델이 됐다. 앤스로픽은 이 모델이 역대 가장 유능한 Opus이며 이전보다 훨씬 오래 자율적으로 작업하면서 자기 결과를 점검하고 오류에서 회복할 수 있다고 강조한다. 다만 가장 야심 찬 작업과 며칠 단위 자율성이 필요한 프로젝트에는 여전히 Fable 5가 선택지이며 Opus 5는 매일 쓰도록 설계됐다고 설명한다. 실제로 앤스로픽이 공개한 거의 모든 벤치마크에서 Opus 5가 Fable 5를 앞서기 때문에, 둘을 가르는 것은 아주 오랜 시간 하나의 프로젝트를 붙들 수 있는 능력으로 보인다. GDPval-AA v2 지식 노동 벤치마크에서 1861점을 기록해 Fable 5(1747), GPT-5.6 Sol(1736), Opus 4.8(1593)을 앞섰다. 종단 간 비즈니스 워크플로를 측정하는 Zapier의 AutomationBench에서도 1위이며, 같은 과제당 비용에서 차순위 모델의 두 배 통과율을 낸다고 앤스로픽은 밝혔다.

> 💡 벤치마크상 하위 모델이 상위 모델을 앞서는데도 계열이 유지된다는 점이 핵심이라, 모델 선택 기준을 점수가 아니라 지속 가능한 자율 작업 시간으로 봐야 한다.

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
