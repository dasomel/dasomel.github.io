---
title: "📰 데일리 테크 다이제스트 - 2026-09-22"
description: "2026-09-22 Cloud, Kubernetes, AI, DevOps 소식 22건 — 자동 큐레이션 다이제스트."
pubDate: 2026-09-22
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### Grok Build vs. Claude Code: I tested which one has the better memory

9월 16일 xAI가 터미널 코딩 에이전트 Grok Build에 메모리 기능을 추가했다. 프로젝트별(workspace) 범위와 모든 프로젝트에 적용되는 전역(global) 범위로 마크다운 노트를 저장하는 방식이다. Claude Code는 이미 몇 달 전부터 비슷한 "auto memory"를 제공해왔는데, 저장소별로 MEMORY.md 인덱스와 개별 노트 파일을 유지한다. 실제 비교 테스트에서 Grok Build는 전역 범위 덕분에 "모든 프로젝트에 적용" 규칙을 무관한 두 번째 저장소에도 제대로 반영했지만, Claude Code는 저장소별 범위 제한 때문에 사용자에게 경고까지 하고도 그 규칙을 적용하지 못했다. Claude Code가 모든 테스트에서 더 빨랐지만 총 토큰 사용량(576,863 대 390,848)과 세션당 비용(1.05달러 대 0.41달러)은 2~3배 더 많았다. 저자는 정확도와 비용 면에서 지금은 Grok Build가 대부분의 사용자에게 더 나은 선택이라고 결론지었다.

> 💡 **왜 중요한가**: 터미널 코딩 에이전트를 팀 표준으로 정할 때는 속도뿐 아니라 메모리 범위 설계(전역 vs 저장소별)와 세션당 토큰 비용까지 함께 따져야 한다.

🔗 [원문 보기](https://thenewstack.io/grok-build-vs-claude-code-memory/) · _The New Stack_

---

## Kubernetes & Cloud Native

### [How Ramp runs GPU AI workloads at scale with ECS Managed Instances](https://aws.amazon.com/blogs/containers/how-ramp-runs-gpu-ai-workloads-at-scale-with-ecs-managed-instances/)

_AWS Containers_

핀테크 플랫폼 Ramp는 GPU 기반 AI 추론을 상시 운영한다. 자체 관리하던 EC2 GPU 워크로드를 Amazon ECS Managed Instances로 옮기면서 Terraform 기반 구현으로 약 50~60대의 EC2 인스턴스를 마이그레이션했다(기사 발췌 기준). 같은 마이그레이션을 다룬 별도의 AWS 고객 사례 페이지에 따르면 Ramp는 작업 프로비저닝 시간을 50% 넘게 단축했다. 이를 통해 배포 속도를 높이고 인프라 관리는 AWS에 맡겼다고 한다. 원문 블로그 글 자체는 네트워크 제한으로 열지 못해, 이 요약은 주어진 발췌문과 별도의 AWS 사례 페이지를 바탕으로 작성했으며 원문 전체를 확인한 것은 아니다.

> 💡 원문 전체를 확인하지 못했더라도, 이 사례는 ECS Managed Instances가 프로덕션 규모의 GPU 추론에도 실용적인 선택지가 되고 있음을 보여주는 구체적인 신호이며, Terraform 기반의 EC2 유연성은 유지하면서 노드 프로비저닝 부담은 덜어낼 수 있다는 뜻이다.

### [Kubernetes v1.37: Tracking When a PersistentVolumeClaim Was Last Used (Beta)](https://kubernetes.io/blog/2026/09/21/kubernetes-v1-37-pvc-last-used-time/)

_Kubernetes_

쿠버네티스 v1.37은 PersistentVolumeClaimUnusedSinceTime 기능 게이트를 알파(v1.36)에서 베타로 승격시켰고, 기본으로 활성화된다. 기존 PVC 보호 컨트롤러가 이제 각 PVC 상태에 "Unused" 컨디션을 추가한다. 해당 클레임을 참조하는 종료되지 않은(non-terminal) 파드가 없으면 True(Reason=NoPodsUsingPVC)로, 파드가 다시 참조하면 False(Reason=PodUsingPVC)로 바뀐다. 이 컨디션의 표준 lastTransitionTime 필드는 PVC가 정확히 언제 유휴 상태가 됐는지 기록하므로, 클러스터 관리자나 모니터링 도구, 외부 컨트롤러가 PVC와 파드를 일일이 대조하는 별도 스크립트 없이 바로 이 값을 조회할 수 있다. 종료된 파드는 사용으로 간주하지 않지만 대기 중이거나 스케줄이 불가능한 파드도 사용으로 인정되며, 쿠버네티스 자체가 이 정보를 근거로 무언가를 자동 삭제하지는 않고 정리 도구가 활용할 수 있도록 유휴 시각만 노출한다.

> 💡 네이티브 Unused 컨디션과 타임스탬프 덕분에 이제 PVC-파드 대조용 자체 스크립트를 유지보수하지 않고도 쿠버네티스 API를 직접 기반으로 스토리지 비용 관리와 방치된 PVC 정리 자동화를 구축할 수 있어, 엔지니어링 부담과 자체 휴리스틱에 따른 오탐 삭제 위험을 함께 줄일 수 있다.

---

## AI & ML

### [Pruning LLMs Like a Physicist: Block Removal as an Ising Optimization Problem](https://huggingface.co/blog/MultiverseComputingCAI/pruning-llms-like-a-physicist-block-removal-as-an)

_Hugging Face_

Multiverse Computing이 공개한 방법은 LLM의 블록(레이어) 제거를 이징 유리 스핀계의 저에너지 상태를 찾는 문제로 재구성한다. 각 트랜스포머 블록을 남길지/뺄지 결정하는 이진 변수로 두고, 단 한 번의 캘리브레이션 패스로 얻은 헤시안 기반 2차 테일러 전개로 블록 간 쌍대 결합(pairwise coupling)을 계산한 뒤, 브루트포스·타부 탐색·양자 영감(quantum-inspired) 솔버로 최적 조합을 찾는다. 블록을 독립적으로 점수 매기는 기존 평균장(mean-field) 방식과 달리 블록 간 상호작용을 반영하는 것이 핵심이며, 가장 성능이 좋은 가지치기 구성은 바닥 상태가 아니라 여기 상태(excited state)인 경우가 많았다고 밝힌다. Llama-3.3-70B-Instruct를 50% 깊이로 압축했을 때 MMLU 점수가 기존 최선 베이스라인 50대에서 약 77까지 올라 약 23점 향상됐고, NVIDIA Nemotron 계열처럼 Mamba/어텐션/MoE가 섞인 하이브리드 아키텍처에도 적용된다. 다만 huggingface.co 원문 페이지는 네트워크 제약으로 직접 열지 못해, 검색으로 확인된 논문·보도 내용을 바탕으로 작성함.

> 💡 50% 압축에서도 MMLU를 거의 원본 수준으로 지키는 가지치기 방법이 실제로 검증되면, 추론 비용을 절반으로 줄이면서 서빙 인프라 규모도 함께 줄일 여지가 커지므로 배포 전 모델 선정 단계에서 압축 기법을 비교 항목에 포함할 가치가 있다.

### [Advisory Group on Mathematics and Artificial Intelligence](https://openai.com/index/advisory-group-on-mathematics-and-ai)

_OpenAI_

OpenAI는 프린스턴 고등연구원(Institute for Advanced Study)에 자리 잡은 독립 자문 그룹인 'Advisory Group on Mathematics and Artificial Intelligence'와 협력한다고 발표했다. 그룹에는 François Charles, Camillo De Lellis, Timothy Gowers, Martin Hairer, Nikhil Srivastava, Ulrike Tillmann, Ravi Vakil, Edward Witten, Melanie Matchett Wood 등 수학자 9명이 참여한다. 이들은 무보수로 활동하고 요청 없이도 의견을 낼 수 있으며 자신들의 견해를 공개할 수 있어 회사로부터 일정한 독립성을 갖는다. 이 그룹의 역할은 OpenAI가 새로운 수학적 결과를 어떻게 평가·전달할지, 학술·전문 기준을 어떻게 지킬지, 연구·학습을 지원하는 도구를 어떻게 만들지 자문하는 것이며, 다만 OpenAI의 내부 수학 연구 속도 자체를 늦추거나 방향을 바꾸도록 자문할 권한은 없다고 명시됐다. 이 발표는 OpenAI 내부 모델이 여러 수학 분야에 걸쳐 100개 이상의 오래된 미해결 문제를 풀었다고 주장하면서 수학계 일각에서 제기된 우려에 대한 대응으로 나온 것이다.

> 💡 AI가 내놓은 수학적 성과 주장을 외부 전문가 패널이 검증·소통 절차에 관여하는 형태이므로, 운영 조직이 벤더의 AI 성능 주장(특히 벤치마크·연구 결과)을 그대로 받아들이지 말고 독립적 검증 체계가 있는지를 도입 판단 기준으로 삼아야 한다는 신호다.

### [Higgsfield AI ships new video features in a day with GPT-6 Astra](https://openai.com/index/higgsfield-from-prompt-to-production-with-astra)

_OpenAI_

Higgsfield AI는 OpenAI의 GPT-6 Astra를 활용해 새로운 비디오 광고 기능을 하루 만에 출시했다. GPT-6 Astra는 OpenAI가 코딩·추론·복합 지식 작업에서 지금까지 가장 강력하다고 소개한 모델이다. 실시간 3D 생성 능력과 여러 단계에 걸친 작업을 계획하는 장기 과업 계획(long-horizon task planning) 능력을 함께 갖췄다. Higgsfield는 이 모델을 이용해 한 번의 프롬프트로 최대 100개의 광고 변형본을 생성하는 기능을 만들었고, 이를 통해 국가별로 맞춤화된 버전까지 자동으로 뽑아낼 수 있게 했다. 엔지니어 1명이 이 기능 릴리스를 하루 만에 완성해, 소규모 사업자들이 더 빠르게 비디오 광고를 제작해 시장에 낼 수 있도록 했다.

> 💡 엔지니어 1명이 모델의 장기 과업 계획 능력에 기대어 하루 만에 프로덕션 기능을 배포했다는 건, 팀 규모나 기존 릴리스 주기를 전제로 한 배포 파이프라인·리뷰 체계를 AI 코딩 에이전트 도입 이후 다시 산정해야 할 수 있다는 뜻이다.

### [Building standards for the next phase of AI](https://openai.com/index/building-standards-next-phase-ai)

_OpenAI_

OpenAI는 9월 21일 공개한 포스트에서 프런티어 AI에 대한 공통 기술 표준을 미국 주도로 마련하자고 제안했다. 기존 AI 안전 연구소(AI safety institute) 네트워크와 CAISI 같은 각국 산업 기구를 활용해, 자가개선(RSI)을 포함한 자동화된 AI 연구의 편익과 위험을 관리하자는 것이 골자다. 구체적으로는 자가개선 진행 상황 측정, AI 기업 내부의 자율 연구 비중, 사람이 개입해야 하는 임계값, 정합성(alignment) 사고를 분류·보고하는 공통 체계 등 측정·사고보고 프로토콜을 제시했다. OpenAI는 이 표준이 라이선스나 의무적 출시 전 심사가 아니라 자발적 기술 벤치마크이며, 각국 정부가 이를 법제화할지는 스스로 결정할 사안이라고 선을 그었다. "미국이 전 세계 국가들과 협력해 최첨단 AI 기술 표준 수립을 주도해야 한다"고 밝혔다. 원문 페이지를 직접 열지 못해, 웹 검색으로 확인된 원문 인용 정보를 바탕으로 작성함.

> 💡 자가개선 임계값과 사고보고 체계가 표준화되면, 사내 AI 플랫폼 운영팀도 향후 모델의 자율 연구·배포 파이프라인에 사람 개입(HITL) 게이트와 인시던트 분류 로그를 갖추도록 요구받을 가능성이 크다.

### [tokenizers v1: encode, decode and scaling, measured](https://huggingface.co/blog/tokenizers-v1)

_Hugging Face_

Hugging Face는 9월 21일, 토크나이저 라이브러리의 새 메이저 버전인 tokenizers v1을 공개하며 성능에 집중했다고 밝혔다. v1 릴리스 후보는 기존 v0.23 대비 경우에 따라 수십 배(tens of times) 빠르다고 소개된다. 블로그는 인코딩, 디코딩, 스케일링, 지연시간, 처리량, 메모리 사용량, 패키지 크기 등 항목별 벤치마크 결과를 제시한다. 모델 연산 자체보다 가벼운 작업으로 여겨지던 토크나이제이션이, 대규모 데이터셋 학습, 동시 요청 서빙, 긴 입력 처리 같은 워크로드 확장 상황에서는 모델에 데이터를 제대로 공급하지 못하는 병목이 될 수 있다는 문제의식이 배경이다. 원문 페이지를 직접 열지 못해, 웹 검색으로 확인된 원문 인용 정보를 바탕으로 작성함.

> 💡 대규모 배치·긴 컨텍스트 서빙 환경에서는 토크나이저 버전 업그레이드만으로도 GPU 유휴 시간을 줄이고 처리량을 개선할 여지가 있으니, 추론 파이프라인 점검 시 토크나이저 버전도 모니터링 대상에 포함할 만하다.

---

## 클라우드 업데이트

### [Global AI routing with &lt;1% overhead on multi-cluster GKE Inference Gateway](https://cloud.google.com/blog/products/containers-kubernetes/gpu-and-tpu-utilization-with-multi-cluster-gke-inference-gateway/)

_Google Cloud_

구글 클라우드가 멀티 클러스터 GKE Inference Gateway를 통해 지리적으로 분산된 GPU/TPU 클러스터 전역에서 라우팅 오버헤드 1% 미만을 달성했다고 발표했다. 기존 라운드로빈 방식 대신 LLM-d 라우터와 Endpoint Picker Proxy(EPP)가 각 추론 엔진의 KV 캐시 사용률을 실시간으로 읽는다. 이 값이 40%를 넘으면 다음 건강한 리전으로 트래픽을 흘려보낸다. us-east5·us-west8·europe-west4 3개 GKE 클러스터, 노드 17,000개, SGLang으로 서빙되는 MoE 모델로 테스트한 결과 1개 클러스터에서 초당 0.72건(2,898토큰/초)이던 처리량이 3개 클러스터에서 초당 2.10건(8,457토큰/초)으로 거의 선형에 가깝게 늘었고 성공률은 99.9% 안팎을 유지했다. LeaderWorkerSet(LWS)과 연동해 분산 LLM 엔진의 마스터-워커 파드 토폴로지도 그대로 존중한다.

> 💡 GPU/TPU 확보난이 상시화된 환경에서는 리전 단일 클러스터 용량에 의존하기보다, KV 캐시 같은 애플리케이션 신호 기반 글로벌 라우팅을 클러스터 운영 표준으로 채택하는 편이 비용 대비 처리량을 크게 끌어올릴 수 있다.

### [Maximizing Apache Spark availability: Mitigating compute stockouts with flexible VMs and other best practices](https://cloud.google.com/blog/products/data-analytics/maximize-apache-spark-availability-with-flexible-vms/)

_Google Cloud_

구글 클라우드가 Managed Service for Apache Spark용 '플렉서블 VM' 기능으로 AI 수요 급증에 따른 머신 타입 재고 부족(stockout) 문제에 대응하는 방법을 소개했다. 특정 머신 패밀리 하나만 요청하는 대신 N2/N2D 같은 2세대와 N4/C4 같은 4세대 패밀리를 순위(rank)별로 나열해 두면, 매니지드 스파크가 rank 0부터 차례로 프로비저닝을 시도하고 실패 시 자동으로 다음 순위로 넘어간다. 예시로 n2d-standard-16을 1순위로 두고 n2-standard-16, n4/n4d-standard-16(Hyperdisk Balanced), c4/c3-standard 계열, 마지막으로 e2-standard-16까지 폴백 체인을 구성하며, `gcloud dataproc clusters create`의 `--worker-instance-selection` 옵션으로 설정한다. 이 기능은 프라이머리 워커뿐 아니라 프리엠티블 세컨더리 워커, 마스터 노드에도 동일하게 적용된다. 함께 권장되는 관행으로 AutoZone, 오토스케일링, 부분 클러스터 생성, 리전 폴백, 머신 패밀리에 종속되지 않는 유연한 확정사용할인(CUD) 채택이 제시된다.

> 💡 Spark 클러스터를 특정 머신 패밀리 하나에 고정해 둔 팀은 재고 부족이 곧 파이프라인 SLA 위반으로 직결되므로, rank 기반 폴백 구성과 유연 CUD 전환을 지금 파이프라인 정의에 넣어두는 것이 리스크 관리의 핵심이다.

### [Scale your AI workloads faster and more efficiently with GKE Pod snapshots](https://cloud.google.com/blog/products/containers-kubernetes/gke-pod-snapshots/)

_Google Cloud_

GKE Pod 스냅샷은 실행 중인 워크로드의 상태(CPU와 GPU 메모리 포함)를 그대로 저장했다가 필요할 때 복원해 콜드 스타트 지연을 없애는 기능이다. 스냅샷은 고처리량 Cloud Storage에 저장되며, Pod snapshot CRD로 대상 파드·저장 위치·보존 정책·복원 방식을 선언적으로 정의한다. 구글이 제시한 벤치마크에 따르면 AI 추론 시작 지연이 89% 줄었다. A3 H100 GPU 기준 700억 파라미터 LLM은 37초, 80억 파라미터 모델은 15초 만에 로드됐다. 실제 고객 사례로 Retake(Codeway)는 시작 시간을 1분에서 8초로 단축했다고 소개됐다.

> 💡 모델 웨이트를 매번 새로 내려받아 로딩하는 구조에서는 스케일 아웃이 곧 비용과 지연의 선형 증가를 뜻하지만, Pod 스냅샷을 오토스케일링 정책에 결합하면 트래픽 급증 시에도 과잉 프로비저닝 없이 빠른 복원으로 대응할 수 있다.

### [Python Workers are now generally available](https://blog.cloudflare.com/python-workers-ga/)

_Cloudflare_

클라우드플레어가 Python Workers를 정식 출시(GA)해 Python을 TypeScript/JavaScript와 동급의 1급 언어로 Cloudflare Developer 플랫폼에 올렸다. workers.asgi·workers.wsgi 커넥터 패키지를 통해 FastAPI·Django·Flask를 네이티브로 지원하며, Uvicorn이나 Gunicorn 같은 별도 서버 없이 Workers 런타임 자체가 웹 서버 역할을 한다. HTTP 클라이언트가 JavaScript의 fetch API를 거치도록 패치되면서 openai, langchain, mcp 같은 AI 라이브러리도 별도 글루 코드 없이 그대로 동작하고, Workers AI·R2·D1·Hyperdrive·Durable Objects·Queues·Workflows 등 클라우드플레어 생태계와 바로 연동된다. 또한 클라우드플레어는 Python 패키지를 WebAssembly로 크로스 컴파일하는 방식을 표준화하는 PEP 783(PyEmscripten)을 제안해 채택시켰고 cibuildwheel에 관련 지원을 추가했다. 다만 blog.cloudflare.com 원문은 네트워크 제약으로 직접 열지 못해, 검색으로 확인된 관련 보도를 바탕으로 작성함.

> 💡 FastAPI/Django/Flask가 별도 WSGI/ASGI 서버 없이 엣지에서 그대로 돌아간다는 것은, 기존 Python 백엔드 팀이 인프라 재작성 없이 배포 지형(리전 수, 콜드스타트, 운영 부담)을 엣지 컴퓨팅으로 옮길 수 있다는 뜻이라 마이그레이션 검토 우선순위를 앞당길 만하다.

### [Turning security complexity into useful intelligence: What’s new in Red Hat Lightspeed](https://www.redhat.com/en/blog/turning-security-complexity-useful-intelligence-whats-new-red-hat-lightspeed)

_Red Hat_

Red Hat은 Lightspeed(과거 Red Hat Insights)의 새 보안 기능을 소개했다. 핵심은 보안 탐지 결과를 원시 YARA 시그니처 그대로 보여주는 대신, 해당 시그니처가 무엇을 탐지하며 왜 특정 워크로드에 위험이 되는지를 평문(plain-language)으로 즉시 요약해 제공하는 것이다. 배경에는 인프라 담당자가 보안 전문가 역할까지 떠맡으면서, 표준 경보의 복잡한 탐지 데이터를 해석하는 데 시간을 쓴 뒤에야 다음 조치를 판단할 수 있었던 인력 부족 문제가 있다. Lightspeed는 이런 예측적 분석과 AI 기반 인사이트를 통해 팀이 더 빠르고 안전하게 규모 있는 운영을 하도록 돕는 것을 목표로 한다. 원문 페이지를 직접 열지 못해, 웹 검색으로 확인된 원문 인용 정보를 바탕으로 작성함.

> 💡 경보를 워크로드 맥락과 함께 평문으로 번역해주는 기능은 보안 전담 인력이 부족한 인프라 팀의 평균 대응 시간(MTTR)을 줄이는 데 실질적으로 기여할 수 있다.

### [2026 update: The road to quantum-safe cryptography in Red Hat OpenShift](https://www.redhat.com/en/blog/road-to-quantum-safe-cryptography-red-hat-openshift)

_Red Hat_

Red Hat이 1년 전 게시물을 이어 OpenShift의 양자내성 암호(post-quantum cryptography) 로드맵을 2026년판으로 갱신했다. OpenShift는 RHEL의 EUS(확장 업데이트 지원) 릴리스만 기반으로 하기 때문에, 코어 OpenShift 컴포넌트의 양자내성 지원은 2026년 봄 예정인 RHEL 9.8·10.2 릴리스를 기다려야 한다. 반면 UBI 9.7, UBI 10, UBI 10.1에는 ML-KEM, ML-DSA, SLH-DSA를 지원하는 PQC 지원 OpenSSL이 먼저 탑재되어, 이 UBI 이미지를 쓰는 애플리케이션과 워크로드는 더 일찍 양자내성 암호를 적용할 수 있다. 아울러 Red Hat은 2025년에 인그레스 컨트롤러, 서비스 메시, 혹은 양자내성 TLS 키 교환을 쓰는 프런트엔드 프록시 등을 통해 OpenShift에 양자내성 요소를 도입하는 방안을 모색했다고 언급한다. 걸림돌로는 OpenShift 다수 컴포넌트가 Go로 작성돼 있고, Go 버전과 쿠버네티스 업스트림·OpenShift 버전 간 긴밀한 종속 관계가 있다는 점이 지적된다. 원문 페이지를 직접 열지 못해, 웹 검색으로 확인된 원문 인용 정보를 바탕으로 작성함.

> 💡 클러스터 운영팀은 코어 OpenShift 컴포넌트의 양자내성 전환을 RHEL 9.8/10.2 도착 시점(2026년 봄)까지 기다려야 하는 반면, PQC 지원 OpenSSL이 포함된 UBI 이미지로 워크로드를 먼저 옮기면 그 전에도 부분적으로 양자내성을 확보할 수 있다.

---

## DevOps & 인프라

### [TypeSafe launched Jev because sequential LLMs are “totally useless for computers”](https://thenewstack.io/typesafe-jev-system-one/)

_The New Stack_

TypeSafe가 2년간의 스텔스 모드를 마치고 지난주 DCVC가 주도한 4,000만 달러 규모의 시드 투자와 함께 등장했다. 이와 함께 대화가 아닌 기계의 의사결정을 위한 "System One" 모델 Jev를 출시했다. 창업자 Almeida는 자기회귀 방식의 순차적 텍스트 생성이 "자연스러운 대화에는 좋지만 컴퓨터에는 전혀 쓸모없다"고 주장하며, 초인적인 채팅 모델들이 왜 AGI로 이어지지 못했는지 자문한 데서 아이디어가 나왔다고 말한다. Jev는 단어 대신 확률과 신뢰도 점수로 결정을 출력한다. TypeSafe는 이 방식이 "코드에 훨씬 가깝게" 동작해 환각(hallucination)이 불가능하다고 주장한다. 회사의 공개 게시글에 따르면 Jev는 기존 LLM 대비 20~200배 빠르고 40~400배 저렴하며, 출력 토큰은 무료라고 밝혔다.

> 💡 TypeSafe의 주장이 독립적인 벤치마크로 검증된다면 고빈도·저지연 에이전트 의사결정을 범용 LLM 대신 전용 결정 모델로 넘겨 운영 비용과 지연을 크게 줄일 수 있겠지만, "환각이 불가능하다"는 주장은 아직 2년 스텔스 스타트업의 자체 발표일 뿐이라 중요한 의사결정에 쓰기 전 제3자 검증이 필요하다.

### [Your AI agent is burning tokens on choices that don’t need words](https://thenewstack.io/kev-skips-text-generation/)

_The New Stack_

Kev는 Qwen 3.5를 기반으로 한 0.8B, 4B, 9B 규모의 오픈소스 결정 모델(decision model) 패밀리다. 도구 라우팅, yes/no 판정, 순위 매기기 같은 단순한 에이전트 의사결정에서 텍스트 생성 과정을 아예 건너뛴다. 자기회귀 디코딩 루프 대신 상태와 후보들을 한 번의 순전파(forward pass)로 처리하고 포인터 헤드(pointer head)에서 확률값을 읽어낸다. Noul(yes/no), Choice(후보 선택), Score(등급 매기기) 세 가지 결정 유형을 지원하며, 이는 TypeSafe의 System One API 구조를 그대로 따른다. Kev-9B는 도메인 외 테스트에서 83.7%의 정확도를 기록했지만, 저자들은 미학습 데이터에서 확률 보정(calibration)이 흔들릴 수 있고 파인튜닝이 베이스 모델의 일반 지식·산술 성능을 떨어뜨린다고 밝혔다.

> 💡 라우팅·게이팅·순위 매기기 같은 개별 의사결정 지점에서 전체 LLM 호출 대신 작은 비생성형 결정 모델을 쓰는 것은 멀티 에이전트 파이프라인의 단계별 토큰 비용을 줄이는 구체적인 방법이지만, 미학습 도메인에서는 확률 보정이 흔들릴 수 있으므로 새 의사결정 영역에 적용할 때마다 모니터링이 필요하다.

### [Open-Sourcing Rebalancer: A Generic, High-Performance Library for Solving Assignment Problems](https://engineering.fb.com/2026/09/21/open-source/rebalancer-generic-high-performance-library-assignment-problems/)

_Meta Engineering_

메타가 2026년 9월 21일 Apache 2.0 라이선스로 Rebalancer를 오픈소스로 공개했다. 이는 제약 조건을 만족시키면서 목표를 최적화해 객체를 컨테이너에 배정하는 '할당 문제(assignment problem)'를 푸는 C++ 라이브러리(파이썬 바인딩 포함)로, 메타 내부에서 9년 넘게 프로덕션에서 사용돼 왔다. 이 라이브러리는 네 가지 관심사를 분리한다 — 객체·컨테이너·차원·목표·제약을 정의하는 네임드-스펙 DSL로 문제를 명세하는 방법, 이를 메모리에 효율적으로 저장하는 방법, 이를 푸는 방법, 그리고 디버깅하는 방법이며, 대규모 인스턴스(객체·컨테이너 약 100만 개까지)를 위한 로컬 서치 엔진과 HiGHS·Gurobi·FICO Xpress를 활용하는 최적해 MIP 백엔드를 함께 제공한다. 메타 내부에서는 하드웨어·서버 할당, ML 학습·추론 배치, 트래픽 라우팅, 로드밸런싱 마이그레이션은 물론 회의실 배정이나 지원 티켓 라우팅 같은 비인프라 문제에도 쓰여 왔다. 설계와 프로덕션 운영 경험은 2024년 OSDI 논문 "Optimizing Resource Allocation in Hyperscale Datacenters"에 정리돼 있다.

> 💡 용량 배치, 로드밸런싱, 트래픽 라우팅 로직을 직접 구축하는 인프라 팀이라면, Rebalancer는 자체 제작한 빈패킹 휴리스틱 대신 9년간 프로덕션에서 검증되고 Apache 2.0으로 공개된 대안을 얻게 되며, 규모가 클 때는 로컬 서치, 문제 크기가 허용될 때는 증명 가능한 최적해를 주는 MIP 경로를 함께 쓸 수 있다.

### [Introducing Our New Dropbox API Documentation](https://dropbox.tech/developers/new-dropbox-api-documentation)

_Dropbox_

드롭박스가 새 API 문서 사이트(docs.dropboxapi.com)를 공개했다. 엔드포인트, 타입, 스키마와 관련 설명을 한 화면에 묶어주는 반응형 UI와 개선된 내비게이션·검색을 제공한다. 또한 브라우저에서 바로 엔드포인트를 호출해 실제 응답을 확인할 수 있는 테스트 기능이 들어갔다. 페이지를 떠나지 않고 엔드포인트 질의응답·트러블슈팅·코드 예제 제공까지 지원하는 내장 AI 어시스턴트도 포함됐고, MCP(Model Context Protocol) 서버를 통해 호환되는 AI 도구와 연결하는 기능도 지원한다. 원문 페이지 자체는 네트워크 제약으로 직접 열지 못해 검색 결과로 확인된 공개 정보를 바탕으로 작성함.

> 💡 테스트 가능한 라이브 문서와 MCP 연동은 드롭박스 API를 코드 어시스턴트·에이전트 워크플로에 직접 물릴 수 있게 하므로, 이를 연동하는 DevOps 팀은 자격 증명 범위와 요청 로깅을 미리 점검해 두는 편이 안전하다.

### [How Adaptive Tail Sampling Works in the OpenTelemetry Collector](https://www.honeycomb.io/blog/how-adaptive-tail-sampling-works)

_Honeycomb_

Honeycomb가 자사의 Refinery 운영 경험을 바탕으로 만든 adaptive tail sampling 프로세서를 OpenTelemetry Collector에 기부했으며(opentelemetry-collector-contrib에 adaptivetailsamplingprocessor로 알파 진행 중), 지금 당장은 Collector contrib 이미지를 대체하는 Honeycomb Collector Distribution으로 바로 써볼 수 있다. 이 프로세서는 개별 스팬이 아니라 트레이스 전체를 버퍼링한 뒤 판단하는데, 루트 스팬 수신 후 decision_delay(기본 2초)만큼 대기해 늦게 도착하는 스팬까지 모으고, 루트 스팬이 끝내 오지 않는 트레이스는 trace_timeout(기본 30초)이 안전망으로 강제 판단을 내린다. 샘플링 판단은 first-match 규칙 기반으로 EMA(지수이동평균) 샘플러 같은 어댑티브 샘플러에 라우팅되며, 조정 구간(adjustment interval)마다 트래픽 빈도에 따라 표본율을 동적으로 재계산해 급증 구간에서도 중요한 컨텍스트를 유지하려 한다. Refinery와 비교하면 이 프로세서는 표준 Collector 파이프라인 안에서 동일한 사고방식을 구현한 셈이어서 별도의 Refinery 인프라 없이도 유사한 동적 샘플링을 시도할 수 있다는 것이 핵심 차이다. 이 글은 WebFetch로 원문을 직접 열지 못해 검색 스니펫으로 확인된 내용(파라미터 기본값, 프로세서 구조, Refinery 비교)만으로 작성했다.

> 💡 표준 Collector 안에서 트레이스 단위 적응형 샘플링을 쓸 수 있다는 건 매력적이지만, 알파 단계인 데다 트레이스 전체를 버퍼링하는 구조라 decision_delay·trace_timeout 값에 따라 메모리 사용량과 수집 지연이 함께 늘어난다는 점을 용량 산정에 반드시 반영해야 한다.

### [Inside Petal: Building the World’s First Petabit-Class Transoceanic Subsea Cable](https://engineering.fb.com/2026/09/21/connectivity/petal-petabit-transoceanic-subsea-cable/)

_Meta Engineering_

Meta는 프랑스와 미국을 약 7,000km 거리로 연결하는 해저 케이블 'Petal'을 발표했으며, 이는 대양횡단 구간에서 페타비트급 용량을 제공하는 최초의 해저 케이블 시스템이다. Petal은 초당 1페타비트 용량을 제공해 기존 최상급 대양횡단 케이블의 두 배 용량을 전력이나 물리 인프라를 비례해서 늘리지 않고도 구현한다. 이는 대양횡단 해저 케이블 시스템 역사상 세대 간 용량 증가 폭으로는 최대 규모다. 대양횡단 거리에 멀티코어 광섬유를 최초로 적용한 시스템으로, 하나의 광섬유 안에 두 개의 광 전송 경로를 갖는 2코어 광섬유와 전력 소모를 줄인 단일 하우징 리피터 기술을 함께 사용한다. Meta는 해저 케이블 전문업체 NEC 및 Sumitomo Electric Industries와 파트너십을 맺었고, 프랑스 대서양 연안 육양은 Orange가 지원하며, 서비스 개시는 2029년으로 예정돼 있다.

> 💡 2029년 서비스 개시라 당장의 용량 계획에는 영향이 없지만, 대양횡단 용량이 두 배로 늘고 페타비트급 경로가 열리면 향후 유럽-미주 리전 간 대역폭 단가와 회복탄력성(redundancy) 전제를 다시 짜야 할 장기 인프라 변수로 봐야 한다.

### [도메인 지식 없는 디자이너가 팀의 기준을 바꾼 방법](https://toss.tech/article/remittance_transfer)

_토스_

한국의 모든 송금 서비스에서는 돈을 보내기 전에 은행을 먼저 선택하는 것이 당연한 절차로 굳어져 있었는데, 토스 팀은 사용자 인터뷰 중 계좌 입력 화면에서 사용자들이 보내려는 대상의 은행을 찾지 못해 멈춰 서는 특이한 현상을 발견했다. 이는 한두 명의 개별 사례가 아니라 여러 사용자에게서 반복적으로 관찰됐고, 실제 CS 문의 내역을 검토한 결과로도 같은 문제가 확인됐다. 은행·금융 도메인 지식이 없던 디자이너가 이 '당연해 보이는' 요구사항 자체에 의문을 제기하면서, 송금 시 은행명을 사용자가 직접 골라야 하는지를 재검토하는 방향으로 팀의 기준이 바뀌게 됐다. 이 글은 이미 성숙한 규제 도메인 제품에서 도메인 전문성이 없는 구성원이 오히려 당연시되던 전제를 깨고 가치를 더할 수 있다는 사례를 다룬다. 이 요약은 원문을 직접 열지 못해 검색 스니펫으로 확인된 내용에 한정해 작성했다.

> 💡 규제 도메인 제품에서 도메인 전문가가 당연하게 여기던 UX 전제를 비전문가가 사용자 인터뷰·CS 데이터로 검증해 뒤집었다는 사례는, 온보딩이나 옵저버빌리티처럼 도메인 밖 엔지니어가 팀 프로세스에 참여시키는 교차 리뷰가 놓치기 쉬운 마찰을 잡아낼 수 있다는 근거로 쓸 만하다.

### [Understand the top paths users take to convert or drop off with Journey Paths](https://www.datadoghq.com/blog/product-analytics-journey-paths/)

_Datadog_

Datadog Product Analytics의 Journey Paths는 사용자가 특정 워크플로 안에서 실제로 거친 페이지·액션 시퀀스를 빈도순으로 시각화하는 기능이다. 전통적인 퍼널 분석이 단계별 전환율만 보여주고 그 사이에 사용자가 무엇을 했는지는 알려주지 않는다는 한계를 보완한다. Converted Paths 뷰는 결국 전환에는 성공했지만 반복적으로 되돌아가는 등 비효율적인 경로를 드러내고, Drop-off Path 뷰는 흐름이 중간에 끊기는 "막다른 길(dead end)"과 의도한 흐름을 벗어나 돌아오지 않는 "우회(detour)" 두 가지 이탈 패턴을 구분해 보여준다. 예시로 결제 단계에서 40%가 이탈하는 체크아웃 퍼널을 들며, Journey Paths로 보면 많은 사용자가 지원(support) 링크를 클릭한 뒤 돌아오지 않는다는 구체적 행동이 드러난다고 설명한다. 이 기능은 Conversion Analysis(전환·이탈과 상관관계가 있는 속성·세그먼트 통계 순위), Session Replay(개별 세션 녹화), RUM(에러·지연·프러스트레이션 신호 조사)으로 바로 이어서 파고들 수 있고, 차트를 대시보드에 저장할 수도 있다.

> 💡 퍼널의 전환율 숫자만으로는 원인을 알 수 없던 이탈 지점을 Journey Paths로 실제 이탈 경로(예: 지원 링크 클릭 후 미복귀)까지 특정할 수 있으므로, 관측성 대시보드에 전환율 외에 이런 행동 경로 지표를 추가하면 근본 원인 파악과 수정에 걸리는 시간을 줄일 수 있다.

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
