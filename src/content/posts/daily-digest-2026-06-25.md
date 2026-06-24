---
title: "📰 데일리 테크 다이제스트 - 2026-06-25"
description: "2026-06-25 Cloud, Kubernetes, AI, DevOps 소식 15건 — 자동 큐레이션 다이제스트."
pubDate: 2026-06-25
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### HCP Vault Dedicated introduces cluster disaster recovery (public preview)

HashiCorp가 완전 관리형 시크릿 관리 서비스인 HCP Vault Dedicated에 클러스터 재해 복구(disaster recovery)를 퍼블릭 프리뷰로 추가했다. 이 기능은 선택한 클라우드 공급자에 리전 단위 장애가 발생하더라도 클러스터의 고가용성을 유지하도록 설계됐다. 크로스 리전 DR은 AWS와 Azure의 Essentials·Standard 티어 클러스터에서 지원되며, flex/entitlement 과금 조직이 클러스터 생성 시 또는 기존 클러스터 설정 편집으로 백업 네트워크(HVN)를 구성해 활성화한다. DR 복제본은 기본 클러스터와 같은 공급자에 있어야 하고 기본 HVN과는 다른 리전에 둬야 한다. 재해가 선언되면 HashiCorp가 직접 크로스 리전 DR 복제본으로 페일오버를 수행하며, 페일오버가 끝나면 Vault에 접근하는 워크로드에는 전환이 투명하게 처리된다. 기존 클러스터에 DR을 켜면 복제가 진행되는 동안 최대 10분간 클러스터를 사용할 수 없다. Vault는 인증·동적 시크릿·암호화 워크플로의 핵심 인프라이므로 다운타임 비용이 커, 복구를 우연에 맡기지 않으려는 조직을 겨냥한 기능이다.

> 💡 **왜 중요한가**: 시크릿 관리 평면이 단일 장애점이 되지 않도록, 운영 부담 없이 관리형 Vault에 리전 장애 대비를 붙일 수 있게 됐다.

🔗 [원문 보기](https://www.hashicorp.com/blog/hcp-vault-dedicated-introduces-cluster-disaster-recovery-public-preview) · _HashiCorp_

---

## Kubernetes & Cloud Native

### [Spotlight on WG Device Management](https://kubernetes.io/blog/2026/06/24/wg-device-management-spotlight-2026/)

_Kubernetes_

Kubernetes 블로그가 Device Management 워킹그룹(WG)을 조명하는 인터뷰를 게재했다. AI·엣지·통신 워크로드가 늘면서 CPU·메모리를 넘어 GPU·TPU·네트워크 인터페이스 같은 특수 하드웨어를 명세·할당해야 할 필요가 커진 데 대응하는 그룹이다. WG의 핵심 산출물인 Dynamic Resource Allocation(DRA)이 Kubernetes 1.34에서 GA로 졸업해, 장치를 '불투명한 정수'로만 다루던 기존 Device Plugin API의 한계를 넘어섰다. DRA는 장치 관리를 모델링(ResourceSlice API로 벤더가 하드웨어 역량 광고), 요청(ResourceClaim API로 사용자가 요구 사항 정의), 스케줄링, 액추에이션의 네 단계로 구조화한다. 공동 의장은 Kevin Klues(NVIDIA), Patrick Ohly(Intel), John Belamaric(Google)이며, WG는 2024년 파리 KubeCon을 계기로 결성됐다. 이 작업은 sig-node·sig-scheduling·sig-autoscaling·sig-network·sig-architecture 등 다섯 SIG에 걸쳐 진행되며, 향후 장치 장애 감지·완화와 NVLink·TPU 3D 토러스 같은 장치 그룹 인터커넥트 인지를 과제로 본다.

> 💡 AI/ML 워크로드의 가속기 스케줄링이 1급 시민이 됐다 — DRA GA로 GPU·TPU 할당이 선언적이고 세분화 가능해져 클러스터 운영 모델이 바뀐다.

### [From Awareness to Engineered Accessibility in Open Source](https://www.cncf.io/blog/2026/06/24/from-awareness-to-engineered-accessibility-in-open-source/)

_CNCF_

CNCF 블로그가 오픈소스에서의 접근성(accessibility)을 '인식'에서 '설계된 접근성'으로 끌어올리는 과정을 정리했다. 필자는 Diana Todea(VictoriaMetrics DevRel, Merge-Forward Neurodiversity 챕터 리드)와 Ryan Etten(Red Hat 수석 아키텍트, 위스콘신 CNCF 조직자)이다. 이들은 신경다양성(ND) 기여자와 동료를 위한 커뮤니티 'Merge Forward Neurodiversity'를 소개하며, 운영의 'Day 1/Day 2' 비유를 접근성에 적용한다. 즉 인식과 개인의 대처에 초점을 둔 'Day 1 접근성'에서, 시스템 차원에서 인지적 마찰을 줄이는 'Day 2 보편적 설계'로 무게중심을 옮기자는 것이다. 글은 KubeCon NA 2025(애틀랜타), KubeCon EU 2026(암스테르담), Open Source Summit NA 2026(미니애폴리스) 세 컨퍼런스를 거치며 논의가 발전한 과정을 추적한다. 또한 신경다양성을 '초능력'으로 미화하는 '뉴로탤런트' 서사를 비판하고, 비동기 커뮤니케이션·작업 방식 README·거버넌스 구조 개선처럼 모호함을 줄이는 실천을 제안한다.

> 💡 접근성을 개인의 적응이 아니라 문서·커뮤니케이션·거버넌스의 시스템 설계 책임으로 재정의해, OSS 기여자 풀을 넓히려는 시도다.

---

## AI & ML

### [Accelerating Transformers Fine-Tuning with NVIDIA NeMo AutoModel](https://huggingface.co/blog/nvidia/accelerating-fine-tuning-nvidia-nemo-automodel)

_Hugging Face_

Hugging Face Transformers v5가 Mixture-of-Experts(MoE) 모델을 1급으로 지원하면서(전문가 백엔드, 동적 가중치 로딩, PyTorch DeviceMesh 기반 분산 실행) 프런티어 모델의 주류 아키텍처를 떠받치게 됐다. NVIDIA NeMo AutoModel은 이 v5 위에 Expert Parallelism(EP), DeepEP 융합 all-to-all 디스패치, TransformerEngine 커널을 추가한 오픈 라이브러리다. 같은 from_pretrained() API를 그대로 쓰면서 임포트 한 줄만 바꾸면 되고, 코드 변경은 없다. NVIDIA는 native Transformers v5 대비 MoE 파인튜닝에서 학습 처리량 3.4~3.7배, GPU 메모리 29~32% 절감을 측정했다고 밝혔다. 벤치마크에는 16개 H100 노드(128 GPU)에 걸친 Nemotron 3 Ultra 550B A55B 전체 파인튜닝과, 단일 노드(8×H100)의 Qwen3-30B-A3B·Nemotron 3 Nano 30B A3B가 포함된다. save_pretrained()는 표준 HF 체크포인트를 그대로 내보내 vLLM·SGLang에서 로드할 수 있다.

> 💡 MoE 파인튜닝의 메모리·처리량 병목을 코드 변경 없이 개선해, 같은 HF API로 대형 MoE 모델 학습의 진입 장벽을 낮춘다.

### [OpenAI and Broadcom unveil LLM-optimized inference chip](https://openai.com/index/openai-broadcom-jalapeno-inference-chip)

_OpenAI_

OpenAI가 Broadcom과 함께 LLM 추론에 최적화된 커스텀 칩 'Jalapeño'를 공식 발표했다. OpenAI는 이를 자사의 첫 'Intelligence Processor'로 부르며, 모델·커널·서빙 시스템·제품 요구를 아우르는 LLM 이해를 바탕으로 처음부터 설계했다고 밝혔다. Jalapeño는 두 회사가 함께 구축하는 다세대 컴퓨트 플랫폼의 첫 가속기로, Broadcom이 실리콘 구현과 네트워킹을, Celestica가 보드·랙·시스템을 맡는다. 칩은 초기 도면에서 양산 준비까지 약 9개월 만에 도달했으며, OpenAI는 자사 모델을 설계 가속에 활용했다고 설명했다. 초기 테스트에서 와트당 성능이 현재 최첨단을 상당히 앞선다고 주장했다. 초기 배포는 2026년 말을 목표로 하며 이후 세대로 확장할 계획이다.

> 💡 OpenAI의 수직 통합(자체 추론 칩)은 추론 효율과 공급 안정성을 노린 행보로, AI 인프라 비용 구조 재편과 Nvidia 의존도 변화의 신호다.

### [Introducing the FFASR Leaderboard: Benchmarking ASR in the Real World](https://huggingface.co/blog/ffasr-leaderboard)

_Hugging Face_

Treble Technologies와 Hugging Face가 현실적인 원거리(far-field) 음향 조건에서 음성인식(ASR) 모델을 평가하는 첫 개방형 커뮤니티 벤치마크 'FFASR 리더보드'를 출시했다. 깨끗한 근접 마이크 벤치마크는 회의실 전사, 차량용 비서, 스마트 글라스, 휴머노이드 로봇처럼 잔향·소음·마이크 거리가 큰 실제 환경의 성능을 예측하지 못한다는 문제의식에서 출발한다. 벤치마크는 욕실부터 사무실·교실·식당까지 20~470㎥ 규모의 가구가 갖춰진 14개 방을 시뮬레이션하며, Treble의 하이브리드(저·중역대 파동 기반 + 고역대 기하음향) 엔진으로 음향 데이터를 생성하고 실측과 대조해 검증(sim-to-real)한다. 정확도 지표 WER과 함께 NVIDIA L4 GPU에서 측정한 처리속도 RTFx를 보고하며, 둘의 트레이드오프를 파레토 전선으로 보여준다. 보류된(held-out) 평가셋은 14개 방·3개 SNR 단계에 걸친 약 2,000개 무향 샘플(조건별 약 8시간)로 구성된다. 제출된 모든 모델에서 낮은 SNR의 원거리 WER이 근접 WER보다 수 배 높게 나타나는 일관된 격차가 확인됐고, Whisper·IBM Granite Speech·Cohere Transcribe·Wav2Vec2/HuBERT·SpeechBrain 등을 지원하며 이동 음원·마이크 어레이·에코 제거가 로드맵에 올라 있다.

> 💡 깨끗한 음성 벤치마크가 실제 원거리 환경 성능을 예측하지 못한다는 점을 정량화해, 음성 제품 배포 전 robustness 평가의 공개 기준을 제시한다.

---

## 클라우드 업데이트

### [Enhanced data resilience with cross-region backups in Backup and DR Service](https://cloud.google.com/blog/products/storage-data-transfer/backup-and-dr-service-adds-cross-region-backups/)

_Google Cloud_

Google Cloud가 Backup and DR Service에 크로스 리전 백업(cross-region backups)을 추가했다. 비즈니스 연속성을 위해서는 견고한 백업 전략이 필요하지만, 멀티 리전 백업이 최고 수준의 가용성을 제공하는 대신 비용이 크다는 점이 배경이다. 많은 조직이 리전 단위 장애로부터 데이터를 보호하면서도 더 비용 효율적인 방법을 원하고, 동시에 데이터 레지던시(데이터 소재지) 요건을 지켜야 한다. 크로스 리전 백업은 바로 이 지점을 겨냥해, 멀티 리전보다 경제적인 방식으로 리전 장애 대비를 제공하는 옵션이다. 이를 통해 백업 데이터를 다른 리전에 두어 단일 리전 장애 시에도 복구 가능성을 유지할 수 있다. DR 설계에서 가용성·비용·규제 준수 사이의 균형을 잡으려는 팀에게 선택지를 넓혀준다.

> 💡 데이터 레지던시를 지키면서 리전 장애에 대비하는 비용 효율적 백업 옵션으로, DR 설계에서 가용성·비용·규제의 균형점을 넓혀준다.

### [Zero-Day Exploitation of Vulnerability (CVE-2026-20245) in Cisco Catalyst SD-WAN Manager](https://cloud.google.com/blog/topics/threat-intelligence/zero-day-exploitation-cisco-catalyst-sd-wan-manager/)

_Google Cloud_

Google의 Mandiant가 2026년 초 한 서비스 제공업체의 SD-WAN 인프라를 노린 위협 행위자를 식별하고, Cisco Catalyst SD-WAN Manager의 제로데이 취약점 CVE-2026-20245의 실제 악용 정황을 공개했다. 이 취약점은 SD-WAN Manager CLI의 권한 상승 결함으로 CVSS 7.8 등급이며, 인증된 로컬 공격자가 조작된 파일을 올려 명령 주입(command injection)으로 root 권한의 임의 명령을 실행할 수 있다. 악용에는 netadmin 권한이 필요해, 유효한 자격증명을 갖거나 CVE-2026-20182·CVE-2026-20127 같은 다른 취약점을 함께 악용해야 한다. 보고 시점에 패치나 완화책은 제공되지 않았고, 온프레미스·Cloud-Pro·Cisco 관리형 클라우드·정부용(FedRAMP) 등 모든 배포 형태가 영향을 받는다. Cisco는 악용이 엣지 장비로 설정 변경을 푸시한 제한적 사례도 관찰했다. 보고서는 Chester Sng, Pete Boonyakarn, Logeswaran Nadarajan이 작성했다.

> 💡 네트워크 관리 평면(SD-WAN Manager) 장악은 곧 엣지 전체 위협으로 번지므로, 패치 부재 상황에서는 자격증명·관리자 접근 통제 강화가 급선무다.

---

## DevOps & 인프라

### [OpenAI wants to claim more of the AI stack with Jalapeño, its first custom chip](https://thenewstack.io/openai-jalapeno-custom-chip/)

_The New Stack_

OpenAI가 첫 자체 커스텀 추론 가속기 'Jalapeño'를 발표했다. Broadcom과 공동 개발했고 캐나다 전자 제조사 Celestica가 보드·랙·시스템 통합을 지원한다. Jalapeño는 LLM 추론에 최적화된 칩으로, 두 회사가 함께 구축하는 다세대(multi-generation) 컴퓨트 플랫폼의 첫 단계로 자리매김했다. 초기 설계 도면에서 양산 준비까지 약 9개월이라는, 통상 수년이 걸리는 반도체 개발 주기 대비 매우 빠른 일정으로 진행됐으며, OpenAI는 자사 모델을 칩 설계 일부에 활용해 속도를 높였다고 밝혔다. 초기 테스트에서 와트당 성능이 현재 최첨단 대비 상당히 우수하다고 주장했고, 2026년 말 초기 배포를 목표로 한다. The New Stack은 이 수직 통합이 Nvidia에 대한 일격이자 개발자 유연성에는 불확실성을 남긴다고 짚었다.

> 💡 추론 비용과 공급망을 자체 실리콘으로 내재화하려는 움직임으로, Nvidia 의존도는 줄지만 OpenAI 스택 종속 우려가 함께 커진다.

### [Azul wants to find your unpatched JVMs before AI does](https://thenewstack.io/azul-java-security-jvm-mythos/)

_The New Stack_

Azul Systems가 기업의 Java 런타임 노출을 사전에 드러내는 무료 JVM 취약점 위험 평가(JVM vulnerability risk assessment)를 제공한다고 발표했다. 핵심 메시지는 패치되지 않은 JVM을 'AI가 먼저 찾기 전에' 식별하라는 것으로, 런타임 가시성 확보를 방어의 출발점으로 제시한다. The New Stack은 Azul의 마케팅이 Anthropic의 Mythos AI 모델(당시 일반 공개되지 않은 상태)을 위협 서사의 근거로 크게 끌어온다고 지적했다. 즉 AI가 취약점 스캐닝을 가속하면 미패치 Java 런타임이 더 빠르게 표적이 될 수 있다는 논리다. 다만 매체는 이 위협 서사를 Azul이 독립적으로 검증할 수 없는 주장이라고 선을 그었다. 결과적으로 이 기사는 제품 자체보다, 보안 마케팅에서 'AI 위협'이 어떻게 동원되는지를 비판적으로 조명한다.

> 💡 AI가 취약점 탐색을 가속하는 국면에서, 패치 안 된 런타임을 파악하는 자산·런타임 가시성이 방어의 첫 단추라는 점을 환기한다.

### [Will it Mythos? One coder’s verdict on Anthropic’s blend of debugging](https://thenewstack.io/will-it-mythos-benchmark/)

_The New Stack_

독립 개발자 Joe Cooper(swelljoe)가 Anthropic의 Mythos 모델이 실제로 어려운 보안 버그를 찾아내는지 검증하는 벤치마크 서비스를 만들었다. 그는 Anthropic 자체 문서에서 Mythos가 발견했다고 소개한 버그들을 모아 테스트 셋을 구성했다. 핵심 질문(정말 까다로운 버그를 잡아내는가)에 대한 그의 결론은 '단호하게, 아마도(a resounding, maybe)'였다. Mythos는 다른 현행 모델보다 보안 버그를 잘 찾았고, 실험에 참여한 어떤 모델도 찾지 못한 버그 4개를 단독으로 발견했다. 다만 Cooper는 프롬프트·도구·하네스(harness) 변경만으로도 기존 공개 모델들의 성능이 좋아질 수 있다고 덧붙였다. 그는 테스트를 계속하며 벤치마크를 발전시킬 계획이라고 밝혔다.

> 💡 보안 자동화 도구를 도입하기 전, 벤더 자체 벤치마크를 독립적으로 재현·검증하려는 커뮤니티 움직임으로 실제 성능 가늠에 참고가 된다.

### [Chainguard targets Java’s unpatched vulnerability backlog with drop-in remediated libraries](https://thenewstack.io/chainguard-java-libraries-spring-boot-cves/)

_The New Stack_

Chainguard가 레거시 Java 환경에 쌓인 미패치 취약점 백로그를 겨냥해, 그대로 끼워 넣을 수 있는(drop-in) 보안 패치 라이브러리를 내놨다. 이 라이브러리는 이미 쓰고 있는 바로 그 Java(및 Python·JavaScript) 패키지의 대체본으로, 검증된 소스에서 안전한 환경에서 빌드된다. Chainguard는 상위(upstream) 버전의 치명적·고위험 CVE 수정을 백포트하고 각 수정이 실제로 문제를 해결하는지 테스트한다고 밝혔다. Spring Boot 마이크로서비스, Maven/Gradle 빌드, Kubernetes에서 돌아가는 Java 앱을 대상으로 한다. Java의 경우 패치된 산출물에 기본 버전 뒤 '-0.cgr.N' 접미사를 붙여 게시하며, BOM을 갱신해 transitive(간접) 의존성까지 수정 버전으로 끌어올릴 수 있다. 핵심은 메이저 버전 업그레이드를 미루면서도 보안을 유지하게 해준다는 점이다.

> 💡 메이저 업그레이드 없이 직접·간접 의존성 취약점을 줄여주는 공급망 보안 접근으로, 레거시 Java 운영팀의 패치 부담을 덜어준다.

### [Agentic infrastructure operations begin with accurate, reliable infrastructure data](https://thenewstack.io/netbox-infrastructure-ai-agents/)

_The New Stack_

이 글은 '에이전트 기반 인프라 운영은 정확하고 신뢰할 수 있는 인프라 데이터에서 출발한다'는 명제를 다룬다. 자동 프로비저닝 같은 인프라 자동화가 AI 적용의 매력적인 표적이지만, 에이전트가 제대로 동작하려면 개별 데이터 포인트뿐 아니라 구성 요소들이 '어떻게 연결·관계되는지'를 이해해야 한다는 것이다. 이런 맥락(컨텍스트)이 없으면 에이전트는 환각을 일으키거나, 권한을 넘어서거나, 실제 환경을 추론하지 못한다. NetBox는 네트워크·인프라의 기록 시스템(system of record), 즉 사실의 원천(source of truth)으로 자리해 이 의미론적 맥락을 제공한다. NetBox MCP 서버는 Model Context Protocol로 NetBox와 LLM을 연결해 모델이 인프라 데이터에 직접 추론·작용하도록 한다. 핵심 메시지는 신뢰할 수 있는 인프라 데이터가 안전한 에이전트 자동화의 전제 조건이라는 점이다.

> 💡 에이전트 자동화의 전제는 정확한 인프라 SoT(source of truth)이며, 데이터 품질이 곧 자동화의 안전성과 직결된다.

### [Sakana Fugu is more than a router. But it’s not the blueprint for AI sovereignty, either.](https://thenewstack.io/sakana-fugu-ai-sovereignty/)

_The New Stack_

도쿄 연구소 Sakana AI가 2026년 6월 22일 멀티 에이전트 오케스트레이션 시스템 'Fugu'를 공개했다. Fugu는 단일 OpenAI 호환 모델 API로 제공되며, 다른 LLM들(및 자기 자신의 인스턴스)로 이뤄진 풀을 호출해 작업을 라우팅·위임·검증·종합하도록 학습된 언어 모델이다. 하나의 엔드포인트에 요청을 보내면 Fugu가 직접 답할지, 아니면 뒤에서 특화 모델 팀을 꾸릴지 스스로 결정한다. Sakana는 Fugu와 Fugu Ultra를 함께 내놨고, 프런티어 모델을 직접 학습하는 대신 모델 풀에 작업을 라우팅하는 방식으로 SWE-Pro 54.2, GPQA-Diamond 95.1을 기록했다고 밝혔다. 이는 주요 벤치마크에서 Anthropic의 Fable·Mythos에 필적하면서 수출통제 리스크를 피하는 접근으로, 가격은 입력 100만 토큰당 5달러부터 시작한다. 등장 시점은 미국 상무부가 수출통제 지침에 따라 Anthropic의 Fable 5·Mythos Preview의 국제 접근을 중단시킨 지 약 10일 뒤였다. The New Stack은 Fugu가 '단순 라우터 이상이지만, AI 주권의 청사진은 아니다'라고 평가했다.

> 💡 프런티어 모델을 직접 학습하지 않고 오케스트레이션으로 성능을 확보하는 전략으로, 수출통제·주권 리스크를 우회하지만 지연 등 운영상 한계도 드러낸다.

### [Advancing AI agent security in Vault](https://www.hashicorp.com/blog/advancing-ai-agent-security-in-vault)

_HashiCorp_

HashiCorp가 몇 주 전 조기 접근(early access) 프로그램으로 발표했던 Vault의 네이티브 AI 에이전트 지원을, 이제 모든 Vault Enterprise 고객을 대상으로 퍼블릭 프리뷰로 개방한다. 이 기능은 에이전트형 IAM, 즉 신뢰할 수 있는 정체성, 위임된 권한 부여, 세분화된 통제, 종단 간 추적을 관리하도록 한다. 구체적으로는 에이전트를 등록하는 에이전트 레지스트리, 에이전트별 정체성 기반 정책, 그리고 특정 작업·기간 후 만료되는 임시 권한을 부여하는 요청 단위(ephemeral) 권한 부여를 제공한다. 또한 Vault를 등록된 에이전트 엔터티에 대한 OAuth 리소스 서버로 활용할 수 있다. 배경에는 자율적이고 비결정적인 AI 에이전트가 정체성·위임·런타임 정책 평가·임시 권한을 결합한 근본적으로 다른 권한 모델을 요구한다는 인식이 있다. 비인간(non-human) 행위자의 보안 과제를 정면으로 겨냥한 업데이트다.

> 💡 비결정적 AI 에이전트에 맞춘 단명(ephemeral) 권한과 에이전트 레지스트리는, 비인간 행위자 IAM이 시크릿 관리의 새로운 축이 되고 있음을 보여준다.

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
