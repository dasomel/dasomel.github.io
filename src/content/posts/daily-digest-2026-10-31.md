---
title: "📰 데일리 테크 다이제스트 - 2026-10-31"
description: "2026-10-31 Cloud, Kubernetes, AI, DevOps 소식 17건 — 자동 큐레이션 다이제스트."
pubDate: 2026-10-31
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### Anthropic just removed one of Claude’s biggest usage limits — but not for everyone

Anthropic이 $200 요금제 사용자를 대상으로 롤링 5시간 세션 사용량 제한을 해제한다고 발표했습니다. 이번 개편을 통해 기존 Max 5x 플랜은 Max(월 $100), Max 20x 플랜은 Ultra(월 $200)로 명칭이 변경되었으며 기존 구독자는 별도 절차 없이 자동 전환됩니다. Ultra 요금제는 Pro 대비 10배, Max는 5배의 주간 사용량을 제공하며, 각 플랜은 월 구독료와 동일한 $100 및 $200 상당의 Claude Platform API 크레딧을 매달 포함합니다. 과거에는 대규모 리팩터링이나 장시간 디버깅 도중 주간 한도가 남아 있어도 5시간 세션 캡에 걸려 작업이 중단되는 문제가 빈번했습니다. 계정 및 결제 내역 기반의 자동 검증을 통과한 계정부터 순차적으로 세션 캡이 해제되며, 남용 방지를 위해 수동 검증 요청은 지원되지 않습니다. 경쟁사인 OpenAI 역시 전날 Pro 및 Business Premium 사용량 한도를 상향 조정하면서 코딩 에이전트 시장에서의 헤비 유저 유치 경쟁이 가열되고 있습니다.

> 💡 **왜 중요한가**: 장시간 자율 코딩 에이전트를 운용하는 엔지니어는 세션 차단 병목 없이 지속적인 리팩터링 작업을 수행할 수 있으나, 단시간 집중 작업 시 주간 쿼터가 조기 소진될 수 있으므로 토큰 소비 모니터링이 필수적입니다.

🔗 [원문 보기](https://thenewstack.io/claude-ultra-session-limit/) · _The New Stack_

---

## Kubernetes & Cloud Native

### [KubeCon + CloudNativeCon NA 2026: End User TAB recommendations and tips](https://www.cncf.io/blog/2026/10/29/kubecon-cloudnativecon-na-2026-end-user-tab-recommendations-and-tips/)

_CNCF_

CNCF 최종 사용자 기술 자문위원회(End User TAB)의 Ricardo Rocha가 솔트레이크시티에서 개최되는 KubeCon + CloudNativeCon NA 2026의 주요 세션 추천과 참여 팁을 공개했다. 이번 행사에서는 플랫폼 엔지니어링, 공공, 텔레콤, 연구 분야의 신규 엔드유저 그룹 BoF 세션과 에이전틱 AI 배포 참조 아키텍처를 실시간으로 구축하는 워크숍이 진행된다. TAB 위원 Joseph Sandoval은 단 한 번의 LIST 호출로 수만 개 노드 클러스터가 2주간 두 차례 제어 장애에 빠졌던 Anthropic의 apiserver 과부하 사례 세션을 추천했다. 아울러 Salesforce와 NVIDIA가 협력해 다중 클러스터를 단일 kubectl 환경처럼 다루도록 구축한 프록시 및 Isomorphic Labs와 Google의 Kueue 튜닝 사례도 주요 발표로 소개되었다. 또한 Juliano Martinez 위원은 수백 개의 프로덕션 클러스터에서 Canal에서 Cilium으로 무중단 CNI 마이그레이션을 달성한 Walmart의 대규모 인프라 전환 세션을 강조했다.

> 💡 수만 노드 환경의 apiserver 부하 방지와 대규모 무중단 CNI 마이그레이션 사례는 대규모 쿠버네티스 클러스터를 운영하는 플랫폼 엔지니어에게 실질적인 장애 복원력 가이드를 제공합니다.

---

## AI & ML

### [nemotron-halloween](https://huggingface.co/blog/nvidia/nemotron-halloween)

_Hugging Face_

NVIDIA 블로그 글은 단일 로컬 워크스테이션에서 완전히 자급자족형으로 동작하는 대화형 할로윈 프로젝션 '몬스터하우스(MonsterHouse)' 구현 사례를 공개했다. 시스템은 NVIDIA RTX PRO 6000 Blackwell Max-Q와 RTX PRO 4000 Blackwell GPU를 장착한 단일 워크스테이션에서 모든 모델 파이프라인을 구동하며, 언어·음성 모델은 앞의 GPU에서, 언리얼 엔진 그래픽과 Audio2Face-3D는 뒤의 GPU에서 돌아간다. 음성 인식에는 경량 스트리밍 모델인 Nemotron 3 ASR(0.6B Q8_0 GGUF)을 사용하여 방문자의 음성을 텍스트로 변환한다. 대화 추론은 소형 언어 모델 Nemotron 3.5 Bolt E4B(4GB)가 맡고 LoRA 어댑터가 괴팍한 해적선 성격을 부여한다. 필자는 5,000개 이상의 다중 턴 대화 데이터셋으로 LoRA를 학습했고, 글은 NeMo AutoModel에 Bolt E4B용 LoRA 레시피가 있다고 안내한다. 음성 합성은 짧은 레퍼런스 샘플 기반의 Magpie TTS Zeroshot을 쓰고, Audio2Face-3D와 언리얼 엔진 5를 연동해 입술 애니메이션을 만든다. Nemotron 3 Nano Omni가 의상을 묘사하고 YOLO와 ByteTrack이 방문자 수를 세고 추적한다.

> 💡 클라우드 연결 없이 블랙웰 GPU 워크스테이션 단 한 대로 ASR, 소형 LLM, TTS, 3D 렌더링, 컴퓨터 비전을 저지연 파이프라인으로 결합할 수 있어 네트워크 단절 환경의 엣지 AI 운영 가능성을 입증했다.

---

## 클라우드 업데이트

### [4 real? Tracking exploitation and patching of eMudhra’s weak keys](https://blog.cloudflare.com/emudhra-patching/)

_Cloudflare_

Cloudflare는 2026년 10월 19일 eMudhra가 115자리 수를 써야 할 8개 중간 CA 개인키를 4, 56, 66, 115, 155, 156, 230, 237처럼 터무니없이 약한 값으로 만들었다는 사실을 알게 된 뒤의 패치 경과와 악용 현황을 공개했다. 누구나 이 서명키를 복원해, 인증서 투명성(CT)을 강제하지 않는 미패치 클라이언트가 받아들일 모든 도메인의 인증서를 만들 수 있는 위험이었다. Cloudflare는 10월 19일부터 Pingora를 쓰는 고객 오리진 대상 프록시를 수 시간 만에 패치해 약한 키를 거부하게 했고, 이 키를 신뢰하는 다른 시스템을 찾는 AI 지원 소스 분석은 4시간 만에 끝냈다. Pingora 로깅에서 일주일간 약 22,000건의 약한 키 핸드셰이크 시도가 잡혔는데 3분의 2는 테스트 사이트 요청이었고, 나머지 대부분은 약한 중간 인증서로 스스로 인증서를 만든 오리진으로 보였으며 검증이 설정된 핸드셰이크는 모두 거부되었다. 약 160건은 SAN이 요청된 SNI와 무관한 다른 조직의 도메인(일부는 소비자 IoT 기기 관련)을 가리켰으나 서버의 기본 인증서로 보여 Cloudflare 연결 가로채기의 증거는 없었고, 다만 위조 인증서 하나가 Mozilla 버그 보고 공개 1시간 이내인 10월 20일 18:19 UTC로 찍혀 있어 표적 가로채기 가능성은 배제되지 않는다. 5,000만 건의 챌린지 페이지 프로브에서 최신 브라우저는 대부분 패치되었지만 봇과 오래된 브라우저는 그렇지 않았고, Android WebView 같은 임베디드 브라우저는 30~40%가 여전히 약한 체인을 받아들였다. eMudhra는 공개 CA 사업에서 철수한다고 발표했으며, Cloudflare는 신뢰 저장소를 폐기 정보와 CT 키로 빠르게 갱신할 수 있어야 한다며 upki 같은 프로젝트에 기대를 밝혔다.

> 💡 약한 중간 CA 키 사고에서는 아웃바운드 프록시의 즉각적인 거부와 로깅, 그리고 신뢰 저장소를 정적 목록이 아니라 빠르게 갱신할 수 있는 구조로 운영하는 능력이 노출 범위를 좌우한다.

### [What’s new in AI infrastructure and orchestration in October](https://cloud.google.com/blog/topics/ai-infrastructure/whats-new-in-ai-infrastructure-this-month/)

_Google Cloud_

구글 클라우드는 2026년 10월 AI 인프라 및 오케스트레이션 분야의 신규 제품과 업데이트를 정리해 발표했고, 이 글에는 9월 항목도 함께 실려 있다. 10월에는 자율 AI 에이전트용 하드웨어 격리 마이크로VM 샌드박스 컴퓨트 서비스 'Agent Compute Engine'이 공개되었으며, 초 단위 미만 활성화와 카피온라이트(CoW) 메모리 공유를 통한 높은 워크로드 밀도를 내세우고 Agent Gateway, Agent Registry 같은 거버넌스 기능이 함께 확대되었다. GKE에서는 인플레이스 파드 리사이즈로 초기화 중에만 컨테이너 CPU를 높여 콜드 스타트를 최대 2배 앞당기는 'CPU startup boost'가 프리뷰로 제공되고, Wiz Runtime Sensor 애드온(프리뷰)이 Standard와 Autopilot 클러스터에 eBPF 런타임 위협 탐지를 제공한다. 오픈소스로는 메타와 협력해 낸 PyTorch 네이티브 스택 'TorchTPU'와, TPU·GPU 혼합 환경에서 캐시 인식 라우팅과 계층형 KV 캐시 오프로딩을 제공하는 쿠버네티스 네이티브 서빙 스택 'llm-d 1.0'이 소개되었다. NVIDIA GTC Berlin 2026에서는 Vera Rubin NVL72 기반 A5X 인스턴스, Virgo 네트워크, Managed Lustre 업데이트가 발표되었고 Cloud Run용 Temporal Serverless Workers도 나왔다. 9월 섹션에는 내부 테스트 기준 AI 추론 기동 시간을 최대 89% 줄인다는 'GKE Pod snapshots', Titanium 오프로드와 Hyperdisk Extreme로 최대 25 GiB/s 스토리지 처리량과 100만 IOPS를 내는 M4N VM 정식 출시(GA), AWS EKS의 IaC와 매니페스트를 GKE로 옮기는 'GKE agentic migration'이 담겨 있다.

> 💡 에이전트 microVM 샌드박스, GKE 인플레이스 리사이즈, 캐시 인식 라우팅이 플랫폼 수준에서 제공되면서 분산 클러스터의 AI 추론 콜드 스타트 지연과 가속기 유휴 비용을 줄일 구체적인 수단이 늘었다.

### [When the Kubernetes API went silent: A three-layer networking mystery](https://cloud.google.com/blog/products/networking/the-three-layer-gke-network-mystery/)

_Google Cloud_

유럽 서부 리전의 GKE 클러스터에서 kube-apiserver 연결 시 간헐적인 I/O 타임아웃이 발생하여 약 800명의 개발자 작업이 중단되고 릴리스가 동결되는 장애가 발생했습니다. 지원팀은 커스텀 kopf 오퍼레이터, External Secrets Operator, 보안 에이전트, conntrack 테이블 고갈(130만 중 50% 수준), KCP VM 크기 조정 등을 조사했으나 모두 원인에서 배제되었습니다. KCP VM NIC(PIGv)와 kube-apiserver 컨테이너 내부의 패킷을 동시 캡처한 결과, 포트 재사용 시 이전 연결에 속한 out-of-order ACK가 새 SYN 핸드셰이크에 응답하고 있음을 확인했습니다. 정밀 조사 결과 패킷 재정렬로 FIN이 순서 없이 도착했을 때 커널 버그로 인해 FIN_WAIT_2 상태가 영구 고착되었고, Envoy의 SHUT_WR 설정으로 인해 타임아웃이 동작하지 않았습니다. 여기에 2026년 2월 배포된 Andromeda USPS 스위치 업데이트가 RFC 5961 challenge ACK를 비정상 드롭하면서 포트 재사용 시 연결이 완전히 실패하는 3개 계층의 결합 버그로 판명되었습니다. 구글은 USPS 롤백 및 프록시 프로토콜 수정을 적용하고, Eric Dumazet이 작성한 리눅스 커널 패치를 6.9.7 및 LTS에 백포트하여 GKE 1.33.5 버전에 영구 반영했습니다.

> 💡 Private Service Connect 기반의 관리형 쿠버네티스 제어 평면 장애를 신속히 규명하려면 애플리케이션 계층 지표에만 의존하지 않고 호스트 가상 NIC와 컨테이너 내부의 동시 패킷 캡처 및 커널 상태 진단 체계를 갖추어야 합니다.

### [Innovate on your own business terms: Google Cloud spend caps now generally available](https://cloud.google.com/blog/topics/cost-management/google-cloud-spend-caps-now-generally-available/)

_Google Cloud_

구글 클라우드가 리소스 강제 삭제 없이 과도한 비용 청구를 방지할 수 있는 Google Cloud Budgets 지출 상한(Spend Caps) 기능을 정식 출시(GA)했습니다. 함께 공개된 Spend Caps API를 통해 엔지니어링 팀은 수백 개의 개발자 샌드박스 및 테스트 프로젝트 전반에 걸쳐 예산 상한을 프로그래밍 방식으로 자동 적용하고 해제할 수 있습니다. 수 시간이 소요되는 표준 정산 파이프라인을 기다리지 않고 비용 보고서에서 실시간 추정 비용을 즉시 확인하여 예산 초과 원인을 수 분 내에 분석할 수 있습니다. 기존에는 상한 도달 시 콘솔에서 수동으로 제한을 풀어야 했으나, 이제 매월 1일 차단된 서비스가 자동으로 재개되는 월별 자동 재설정(automated monthly reset) 옵션이 추가되었습니다. 지출 상한은 종량제(Pay-as-you-go) 및 약정 할인(CUD) 요청을 중단시키지만, 사전 예약된 프로비저닝된 처리량(Provisioned Throughput)은 트래픽을 지속 서빙합니다. 예산 관리자는 기본 임계값인 50%, 80%, 100% 도달 시 알림을 받으며 예측 모니터링 기능인 Early Anomalies Detection과 결합하여 클라우드 비용을 방어할 수 있습니다.

> 💡 FinOps 및 플랫폼 엔지니어는 Spend Caps API를 인프라 프로비저닝 파이프라인에 통합하여 개발 샌드박스의 예산 초과 리스크를 원천 차단하고 프로덕션 예약 용량과의 분리 거버넌스를 확립해야 합니다.

### [Cloudflare services for private origins is now generally available](https://blog.cloudflare.com/private-origins-public-to-private/)

_Cloudflare_

클라우드플레어는 프라이빗 IP를 대상으로 하는 DNS 레코드에 WAF, 캐싱, 봇 관리, Workers 등을 그대로 적용할 수 있는 프라이빗 오리진 서비스(Services for Private Origins)를 정식 출시했습니다. 이를 통해 인터넷에 직접 노출되지 않는 사내 API, AI 에이전트 백엔드, MCP 서버, 운영 도구를 인바운드 방화벽 개방이나 오리진별 커넥터 설치 없이 외부 요청에 안전하게 연결할 수 있습니다. 프록시 설정된 A 또는 AAAA 레코드가 RFC 1918, RFC 6598(100.64.0.0/10), RFC 4193(fc00::/7) 대역을 가리킬 경우 프라이빗 네트워크 라우팅이 자동으로 활성화됩니다. 클라우드플레어 프록시 계층은 Origin API 메타데이터의 private_routing 플래그를 감지하여 IPsec, GRE, CNI, Cloudflare Tunnel, Cloudflare Mesh를 통해 트래픽을 안전하게 전달합니다. Cloudflare WAN 및 Mesh 연동 시에는 100.64.0.0/12(IPv4) 및 2606:4700:cf1:5000::/64(IPv6) 대역에 대한 리턴 라우트 구성이 요구됩니다. 현재 Argo Smart Routing과 전용 CDN Egress IP는 지원되지 않으며, 오리진 상태 확인(health check)을 사용하려면 Cloudflare Load Balancing 구성이 필요합니다.

> 💡 내부 MCP 서버 및 사내 AI 에이전트 백엔드를 외부에 공개할 때 방화벽 인바운드 홀 오픈 없이 Cloudflare One 기반 전용 터널과 WAF 보안 계층을 일원화하여 공격 표면을 최소화할 수 있습니다.

### [How parental leave helped 2 new parents find their rhythm](https://www.redhat.com/en/blog/how-parental-leave-helped-2-new-parents-find-their-rhythm)

_Red Hat_

Red Hat의 Global Employee Experience Program Manager 케이티 홉스(Katie Hobbs)가 2025년 목표로 세운 Global Paid Parental Leave 정책의 실제 효과를 두 직원의 경험으로 소개했다. 이 정책은 거주 지역과 관계없이 자녀를 맞는 직원에게 글로벌 최소 기준을 보장하며, 입사 첫날부터 적용되어 출산 부모는 18주, 비출산 부모는 4주 전액 급여를 받는다. 복직 직원은 시간제로 일하면서 급여 100%를 받는 유연한 2주 단계적 복귀를 선택할 수 있다. 선임 보상 컨설턴트 앨리 홀랜드는 출산 부모로서 두 번 휴직했고, 기술 프로그램 매니저 대니얼 스크루다토는 둘째 출산 때 비출산 부모로 휴직했다. 스크루다토는 휴직 몇 달 전 매니저와 인수인계 계획을 세워 프로젝트 소유권을 분명히 했고, 휴직 중 전화, 문자, Slack 연락이 없었으며 복귀 뒤 일주일의 적응 시간을 받았다. 홀랜드도 리더들이 완전한 휴직을 지지해 일 걱정이 없었고 정신 건강이 훨씬 좋았다고 말했다. 다만 이 프로그램은 현재 단계적으로 시행 중이라 모든 국가에 완전히 적용되지는 않았고, 휴직 기간, 급여, 구조는 현지 법규에 따라 다를 수 있다.

> 💡 장기 휴직이 예정된 팀은 사전에 소유권을 명확히 넘기는 인수인계 계획과 복귀 뒤 적응 기간을 정책으로 두는 것이 휴직자와 남은 팀 모두의 운영 부담을 줄이는 방법이다.

### [Friday Five — October 30, 2026 | Red Hat](https://www.redhat.com/en/blog/friday-five-october-30-2026-red-hat)

_Red Hat_

Red Hat이 2026년 10월 30일자 Friday Five에서 통신사 AI 전략, HPC 자동화, GPU 전용 RHEL 에디션, KubeVirt 로드맵, 오픈소스 활용을 다섯 항목으로 정리했다. Red Hat의 Joe Fernandes는 AT&T, T-Mobile, Orange Business 같은 통신사가 토큰 비용 상승과 주권 확보 요구 때문에 자체 인프라 위의 오픈 웨이트 모델로 옮겨 가고 있다고 설명했다. BMW는 약 15,000대의 Windows와 Linux 서버로 구성된 HPC 클러스터를 30년 된 맞춤형 시스템에서 Red Hat Ansible Automation Platform으로 옮겨, 최대 60시간 걸리던 복잡한 작업이 약 20분에 끝나고 셀프서비스로 일상 관리 작업도 줄었다고 한다. RHEL for NVIDIA 26.03은 Vera Rubin 대응을 포함해 최신 NVIDIA 하드웨어를 Day 0부터 지원하는 파트너 최적화 RHEL 에디션으로, 제한된 수의 패키지만 수정하고 표준 RHEL 사용자 공간은 유지한다. KubeVirt는 Red Hat이 시작한 지 10년이 되어, GPU와 장치용 동적 리소스 할당(DRA), 증명(attestation)을 갖춘 기밀 VM, 구조화된 플러그인, 플러그형 가상화 스택을 담은 로드맵이 제시되었다. 다섯 번째 항목은 오픈소스 프로그램 오피스(OSPO), 명확한 기여 정책, 이너소스 관행으로 조직이 협업을 확장하고 중복 작업을 줄이는 방법을 다룬다.

> 💡 대규모 인프라 운영팀은 자동화 플랫폼으로 약 15,000대 규모 서버 작업을 표준화하고, 새 GPU 도입 시 표준 RHEL 사용자 공간을 유지하는 파트너 최적화 OS 에디션을 검토할 수 있다.

### [Direct VM networking in AWS: Introducing BGP cloud connector on Red Hat OpenShift Service on AWS](https://www.redhat.com/en/blog/direct-vm-networking-aws-introducing-bgp-cloud-connector-red-hat-openshift-service-aws)

_Red Hat_

Red Hat의 Specialist Solution Architect Daniel Axelrod가 Red Hat OpenShift Service on AWS(ROSA) 클러스터 버전 4.22 이상에서 쓰는 BGP 클라우드 커넥터를 소개했다. 클라우드에는 직접 IP 라우팅이 없어 OpenShift Virtualization 게스트 VM이 VM의 IP 주소를 가리는 NodePort Service와 Route에 의존해야 했던 한계를 해소하는 기능이다. BGP 클라우드 커넥터는 클러스터 오버레이 네트워크(ClusterUserDefinedNetwork, CUDN)와 클러스터가 있는 VPC 사이의 트래픽을 BGP로 Amazon VPC Route Server에 경로를 알려 연결한다. 클러스터 워커 노드가 라우터 역할을 하고 한 번에 한 워커 노드가 해당 CUDN 트래픽의 게이트웨이가 되며, 활성 게이트웨이 노드가 내려가면 Route Server가 BGP로 장애를 감지해 VPC 라우트 테이블을 정상 노드로 바꾼다. VM이 NAT를 거치지 않고 고유 IP를 외부에 유지하므로 소스 IP 기반 방화벽과 접근 제어, Active Directory Dynamic DNS, 서버 IP가 같아야 하는 구형 Valkey 클러스터링 같은 소프트웨어가 제대로 동작하며, Transit Gateway나 Direct Connect로 회사 네트워크와도 종단 간 연결할 수 있다.

> 💡 클라우드의 ROSA 클러스터에서 VM을 운영할 때 BGP와 VPC Route Server로 VM의 고유 IP를 유지하면 NodePort와 Route를 거치는 우회 구성 없이 IP 기반 네트워크 요구사항을 충족할 수 있다.

### [Azure Cloud HSM Hardware Audit Logging: Verifiable audit trails for security and compliance](https://azure.microsoft.com/en-us/blog/azure-cloud-hsm-hardware-audit-logging-verifiable-audit-trails-for-security-and-compliance/)

_Azure_

마이크로소프트는 규제 대상 및 보안 민감 워크로드를 위해 하드웨어 보안 모듈 자체에서 감사 기록을 생성하는 Azure Cloud HSM 하드웨어 감사 로깅 기능을 발표했습니다. 기존 플랫폼이나 운영체제 계층의 로그와 달리, 암호화 경계와 가장 가까운 HSM 물리 하드웨어 디바이스에서 직접 관리 작업 증적을 수집합니다. 이 기능은 사용자 인증 및 세션, 관리자 계정 변경, 보안 정책 및 설정 업데이트, 암호화 키 라이프사이클 작업, 백업 및 복원 이력을 포괄적으로 기록합니다. 가독성 있는 텍스트 로그뿐만 아니라 HSM이 서명한 바이너리 증적, 전자 서명, 인증서 및 검증 유틸리티를 제공하여 고객이 서명된 감사 배치의 무결성과 진위 여부를 독립적으로 검증할 수 있도록 지원합니다. 감사 로깅은 변경 불가능한 HSM 파티션 정책으로 강제되어 일상적인 관리 작업 중 임의로 비활성화될 수 없으며, 수집된 로그는 Azure Monitor Log Analytics 및 Microsoft Sentinel과 직접 연동됩니다.

> 💡 클라우드 HSM 감사를 OS 계층이 아닌 하드웨어 파티션 정책 수준의 불변 서명 로그로 강제하면 규제 준수 검증 시 내부자 권한 남용이나 로그 위변조 위협을 원천적으로 차단할 수 있습니다.

### [Introducing the Microsoft Copilot harness in Foundry Agent Service](https://devblogs.microsoft.com/foundry/microsoft-copilot-harness-in-foundry/)

_Azure_

마이크로소프트가 Foundry Agent Service 환경에서 선언적 AI 에이전트를 실행할 수 있는 Microsoft Copilot 하네스의 퍼블릭 프리뷰를 발표했습니다. 이 하네스는 SKILL.md 파일 기반의 재사용 가능한 스킬 패키징, Model Context Protocol(MCP) 도구 연동, 코드 실행 및 서브에이전트 위임 기능을 제공합니다. 개발자는 Azure Developer CLI(azd)와 azure.yaml 매니페스트를 통해 에이전트 아키텍처와 도구 구성을 소스 코드로 관리하고 배포할 수 있습니다. 함께 발표된 호스티드 에이전트용 장기 실행 복원력은 이번 주 정식 출시(GA)되었으며, Foundry가 중단을 감지해 원래 입력으로 작업을 다시 시작하고 진행 상황 저장과 재개 지점 복원, 중복 작업 방지는 에이전트 코드가 맡아야 합니다. Copilot 하네스 런타임은 2026년 12월 1일 전까지 무료이며, 12월 1일부터 샌드박스 컴퓨트와 메모리가 vCPU 시간당 0.0994달러, GiB 시간당 0.0118달러로 청구되고 모델 추론과 별도 과금 도구는 따로 청구됩니다.

> 💡 선언적 매니페스트 기반의 관리형 하네스와 MCP 도구 생태계를 채택하면 에이전트 런타임 인프라 구축 부담을 덜고 GitOps 파이프라인 안에서 AI 워크플로를 안전하게 배포할 수 있습니다.

---

## DevOps & 인프라

### [Busy GPUs can hide slow AI inference on Kubernetes](https://thenewstack.io/ai-inference-kubernetes-observability/)

_The New Stack_

The New Stack은 HPE 후원 시리즈 4편에서 쿠버네티스 클러스터가 정상이어도 그 위의 AI 서비스는 사용자를 실망시킬 수 있다고 짚었다. 첫 토큰은 빠르지만 완료가 느릴 수 있고, 응답이 빨라도 틀린 답일 수 있으며, GPU가 바쁘다는 사실은 둘 다 설명하지 못한다. HPE의 Marius Bogoevici는 첫 토큰 시간, 출력 토큰당 시간, 신뢰성, 용량, 자원 효율, 비용, 답변 품질을 측정하라고 권하고, GPU가 100%라서 잘하고 있다는 판단을 경계한다. OpsRamp의 Mahesh Ramachandran은 대표적인 프롬프트와 컨텍스트 길이, 출력량, 트래픽 수준에서 서빙 시스템을 출시 전에 프로파일링해 기준선을 만들라고 한다. Karthik Subramanian은 네트워크 구성과 벡터 데이터베이스 응답 시간, GPU 파티션이 너무 작은지 같은 모델 주변 의존성을 조사 경로로 든다. 쿠버네티스 HPA는 설정한 커스텀 또는 외부 메트릭을 쓸 수 있어 CPU가 추론에 나쁜 지표라고 HPA를 바꿀 필요는 없지만, 메트릭 파이프라인과 스케일 한도, 가속기 용량을 직접 갖추고 시험해야 한다. 프롬프트와 응답이 로그와 트레이스에 남을 수 있어 수집 범위와 보관, 접근 권한도 정해야 한다.

> 💡 GPU 사용률만 보지 말고 출시 전 기준선과 비교할 첫 토큰 시간, 토큰당 시간, 답변 품질을 함께 관측하고 HPA에 쓸 커스텀 메트릭 파이프라인을 시험해야 한다.

### [What worries Entire co-founder Thomas Dohmke about the future of tech?](https://thenewstack.io/we-are-developers-tech-predictions/)

_The New Stack_

전 GitHub CEO Thomas Dohmke는 스타트업 Entire에서 GitHub 대안을 출시했고, 기존 풀 리퀘스트 대신 AI 에이전트가 코드 변경을 평가하고 개발자가 감독하는 Trails 리뷰 시스템을 내세웠다. The New Stack은 9월 새너제이의 WeAreDevelopers World Congress North America에서 기술의 미래에 대해 무엇이 기대되고 무엇이 걱정인지 여러 사람에게 물었다. Dohmke는 더 많은 아이디어를 동작하는 소프트웨어로 만들 수 있어 기쁘지만, 사람들이 코딩을 더 배울 필요가 없다고 생각하는 점이 걱정이며 아이들이 컴퓨터 과학의 기초를 이해해야 한다고 말했다. SAP의 Josh Bentley는 몇 주 걸리던 일을 몇 시간이나 며칠에 만들 수 있게 됐지만, 만드는 것의 맥락을 이해하지 못한 채 빌더로 인정받는 점을 우려했다. AWS의 Darko Mesaroš는 더 많은 사람이 만드는 것을 반기면서도 나쁜 코드와 AI slop을 걱정하며 더 의도적으로 만들길 바랐다. Docker의 Mark Cavage는 업계가 AI 에이전트 주변의 효율과 신뢰, 안전을 충분히 빨리 마련하지 못할까 걱정했다. GitHub의 Cassidy Williams는 안전 가드레일과 참여 비용을 우려했고, PwC의 Matt Hobbs는 지금 만든 것을 더 낫고 빠르고 안전하게 다시 만들 수 있다는 점에 기대를 표했다.

> 💡 코드 작성과 검토를 에이전트가 맡을수록 플랫폼 팀은 신뢰와 안전을 확인하는 자동화된 가드레일과 사람의 감독 지점을 설계해야 한다.

### [How we use Insights to improve the agent behind Insights](https://www.datadoghq.com/blog/improving-insights-agent-observability/)

_Datadog_

Datadog 엔지니어들이 Agent Observability의 Insights로 Insights 자신을 구동하는 내부 AI 에이전트의 비용과 신뢰성 문제를 진단하고 고친 사례를 공유했다. 한 인사이트는 두 번의 에이전트 실행에서 다섯 번의 검색 호출이 약 8만 토큰의 내용을 반환해 모델 요청에 그대로 포함되었음을 보여 주었고, 이는 search_llmobs_spans 도구가 너무 많은 트레이스 내용을 돌려준 탓이었다. 작업별 정보가 도구 정의보다 앞에 놓여 공유 프리픽스가 깨져 프롬프트 캐시를 재사용하지 못했으며, Datadog은 반복되는 지침과 도구 정의를 재사용 가능하게 하면 월 약 2,734달러를 절감할 수 있다고 추정했지만 실제 절감액을 측정한 것은 아니라고 밝혔다. 신뢰성 측면에서는 update_insight 도구를 필수 insight 객체 없이 약 18분 동안 동일하게 다섯 번 호출했고, 스킬 로더가 돌려준 이름을 쓰라는 지침을 어기고 리소스 이름을 추측하거나 바꾼 세션이 193개 있었다. 이런 문제에는 인사이트의 증거와 권장 수정안을 코딩 에이전트에 넘기는 Fix with Bits 옵션을 썼고, 코딩 에이전트는 검색이 컴팩트 프리뷰를 반환하도록 바꾸는 PR과 테스트를 준비했다. Agent Observability의 Insights는 정식 출시(GA)되었고 월 최대 4만 LLM span까지 쓸 수 있는 무료 티어가 있다.

> 💡 에이전트를 운영하는 팀은 트레이스로 도구 반환 크기, 프롬프트 프리픽스 순서, 반복되는 잘못된 도구 호출을 점검해 토큰 낭비와 캐시 미적중을 줄일 수 있다.

### [Stripe on Stripe: What we learned moving $1B in vendor payments to Global Payouts](https://stripe.com/blog/stripe-on-stripe-what-we-learned-moving-1b-in-vendor-payments-to-global-payouts)

_Stripe_

Stripe는 연 2만 건에 가까운 벤더 지급을 70개 이상 시장에서 처리해 왔고, 이를 Global Payouts로 옮긴 경험을 공유했다. 예전에는 ERP에 연결된 은행 직접 연동으로 지급했고 연동이 없는 곳은 은행 포털에 수동으로 입력했으며, Global Payouts는 단일 API로 현지 은행 이체, 국제 송금, 스테이블코인을 처리한다. 2026년 10월까지 미국과 영국의 3,400개 이상 벤더에 10억 달러가 넘는 금액을 지급했다. 새 시장에서 벤더 지급을 설정하는 시간은 최대 6주에서 1주로 줄었고, 재무와 자금 관리팀은 자동 리포팅과 대사로 월 20~30시간을 절감하는 것으로 추정되며 지급 성공률은 99.9%를 유지했다. 첫 교훈은 은행 시스템에 닿기 전에 벤더 데이터를 검증하라는 것이었고, 과거 은행 연동은 잘못되거나 불완전한 정보를 늘 걸러내지 못했다. 큰 금액의 지급이 기존 한도를 넘으면 수동 처리해야 했으므로 Outbound Payments API의 ACH와 전신 송금 한도를 1억 달러로 올렸고, 수취인이 알아보기 쉽도록 맞춤형 명세서 표기(statement descriptor)도 추가했다. Global Payouts는 현재 미국과 영국에서 정식 출시(GA)되어 있고 160개국 이상으로 송금할 수 있다.

> 💡 핀테크 및 엔터프라이즈 결제 인프라를 구축할 때는 자금 이동 이전 단계의 데이터 유효성 검증과 거래 한도 오케스트레이션을 선제적으로 자동화해야 수동 개입과 정산 지연을 방지할 수 있습니다.

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
