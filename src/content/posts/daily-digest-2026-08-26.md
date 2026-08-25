---
title: "📰 데일리 테크 다이제스트 - 2026-08-26"
description: "2026-08-26 Cloud, Kubernetes, AI, DevOps 소식 23건 — 자동 큐레이션 다이제스트."
pubDate: 2026-08-26
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### Shopify’s CEO threatened to ban Claude Code. Anthropic had already closed the feature request.

Shopify CEO 토비 뤼트케가 자사에서 Claude Code를 금지할 수도 있다고 X에 경고했는데, 도구 성능이 아니라 Anthropic이 AGENTS.md 표준을 읽지 않는다는 이유 때문이다. Shopify는 수천 명의 개발자가 하나의 거대한 모노레포에서 작업하며, 코딩 에이전트는 디렉터리 트리를 따라 재귀적으로 지침 파일을 읽어 그 위치에 맞는 규칙을 적용한다. 문제는 OpenAI가 만들어 지금은 Linux Foundation 산하 Agentic AI Foundation이 관리하는 AGENTS.md를 Claude Code가 네이티브로 읽지 않고 자체 CLAUDE.md만 인식한다는 점이다. 한 디렉터리에 AGENTS.md만 있고 CLAUDE.md가 없으면 Claude Code를 쓰는 개발자 일부가 다른 팀과 다른 규칙으로 일하게 되는 이른바 '스플릿 브레인' 문제가 생긴다. Shopify는 이를 자동화로 우회하고 있지만 뤼트케는 이런 복잡성 비용 자체가 불필요하다고 지적했으며, Anthropic은 CLAUDE.md에서 AGENTS.md를 임포트하거나 심볼릭 링크를 쓰는 우회책만 제공하고 재귀적 AGENTS.md 탐색 요청은 '계획 없음'으로 종료한 상태다. AGENTS.md는 공개 후 1년도 안 돼 6만여 개 오픈소스 프로젝트와 Codex, Cursor, Gemini CLI, GitHub Copilot 등 다수 도구에서 채택된 사실상 업계 표준으로 자리잡고 있다.

> 💡 **왜 중요한가**: 멀티 에이전트 도구를 같은 모노레포에서 함께 쓰는 조직이라면 CLAUDE.md와 AGENTS.md의 불일치가 조용히 팀별로 다른 규칙을 적용시키는 리스크이므로, 플랫폼 팀은 지금 당장 두 파일을 동기화하는 자동화나 심볼릭 링크 체계를 갖춰야 한다.

🔗 [원문 보기](https://thenewstack.io/shopify-claude-code-agentsmd/) · _The New Stack_

---

## Kubernetes & Cloud Native

### [The lazy developer’s guide to observing your own code](https://www.cncf.io/blog/2026/08/25/the-lazy-developers-guide-to-observing-your-own-code/)

_CNCF_

CNCF 블로그에 실린 이 글은 관측가능성 계측(OpenTelemetry)을 애플리케이션 코드에 직접 넣어야 하는 '시프트 레프트' 요구에 개발자들이 흔히 갖는 반감을 다루며, 왜 이것이 SRE만이 아니라 개발자 자신에게도 이득인지 설명한다. 계측이 디버깅 시간을 줄이고, 기능을 더 빨리 배포하게 하며, 느린 경로나 숨은 재시도·엣지케이스를 프로덕션 전에 드러내고, 마이크로서비스 간 예측 불가능한 상호작용을 이해하게 하며, AI가 생성한 품질이 들쭉날쭉한 '바이브코딩' 코드를 파악하는 데도 도움이 된다는 5가지 이점을 제시한다. 실제 개발자 인터뷰에서는 언어별 OpenTelemetry SDK/SIG마다 성숙도가 다르고, Rust·Elixir처럼 제로코드(자동) 계측이 없는 언어는 수동 계측 부담이 크며, SDK·eBPF·컴파일타임 계측 등 선택지가 너무 많고, API 안정성·의존성 업그레이드·높은 카디널리티 속성 문제 등이 실질적 고충으로 꼽혔다. 이에 대한 실천 팁으로는 Java·.NET·Python·JavaScript·PHP·Go에서 제공되는 제로코드 계측으로 먼저 시작하고, 부족한 부분은 수동 계측으로 채우며, 코드를 작성하면서 동시에 계측하는 '관측성 주도 개발(ODD)'을 실천하고, AI를 계측 작업에 적절히 활용하라고 권한다. 계측 대상 선정에서는 모든 메서드 호출에 스팬을 붙이지 말고 인바운드 요청, DB·캐시·API·메시지큐로의 아웃바운드 호출, 비즈니스 핵심 연산 등 의미 있는 작업 단위에만 스팬을 붙이라고 조언한다(원문은 이후 추가 팁이 이어지나 이번 발췌에는 포함되지 않음).

> 💡 새 언어나 팀에 계측 표준을 확립할 때는 제로코드 자동 계측이 없는 언어(Rust, Elixir 등)에서 수동 계측 부담이 급격히 커진다는 점을 미리 고려해, 스택 선택 단계에서부터 관측성 비용을 아키텍처 결정에 반영해야 한다.

### [Stop trying to learn all of Kubernetes at once](https://www.cncf.io/blog/2026/08/25/stop-trying-to-learn-all-of-kubernetes-at-once/)

_CNCF_

Portainer.io의 Joep Piscaer가 쓴 이 CNCF 블로그 글은 Kubernetes 학습이 막막한 이유가 좋은 입문 자료 부재 때문이라며, 세부 설정을 외우기보다 먼저 갖춰야 할 5가지 정신적 골격(mental scaffolding)을 제시한다. 첫째는 '원하는 상태와 재조정(reconciliation)'으로, 컨테이너 실행을 명령하는 게 아니라 존재해야 할 상태를 선언하면 시스템이 계속 현실과 대조해 격차를 메운다는 것이 셀프힐링·스케일링·롤아웃 등 모든 동작의 공통 원리다. 둘째는 컨트롤 플레인과 워커 노드의 분리 및 '폐기 가능성(disposable)'의 의미로, vSphere 경험자가 아픈 호스트를 살리려는 본능과 달리 Kubernetes는 아픈 노드를 그냥 교체하고 어떤 건강한 노드든 어떤 워크로드든 돌릴 수 있게 설계됐다는 점을 강조한다. 셋째는 컨테이너→파드→서비스→인그레스→외부로 이어지는 4단계 네트워킹 레이어로, 대부분의 네트워킹 혼란은 '지금 이게 어느 레이어에서 일어나는 문제인지'를 모르는 데서 온다고 설명한다. 넷째는 requests/limits를 제안이 아니라 생존 계약으로 다뤄야 한다는 점으로, 이를 잘못 설정하면 자원 낭비 또는 최악의 순간에 파드가 축출되는 두 가지 실패 모드로 이어지며 이것이 '스테이징에선 되는데 프로덕션에선 안 되는' 문제의 가장 흔한 원인이라고 지적한다. 다섯째는 CNI·CSI가 왜 플러그인 구조인지에 대한 이해로, Kubernetes가 네트워킹·스토리지 구현을 의도적으로 위임했기 때문에 다양한 CNI 옵션이 혼란이 아니라 유연성 선택의 결과임을 알면 도구 생태계의 난립이 납득된다고 조언하며, 서비스메시나 정책 엔진 같은 나머지 주제는 실제 문제에 부딪힐 때 배워도 늦지 않다고 결론짓는다.

> 💡 온보딩 자료를 만드는 플랫폼 팀이라면 request/limit을 '제안'이 아닌 '생존 계약'으로, 노드를 '고쳐야 할 자산'이 아닌 '폐기 가능한 자원'으로 재프레이밍하는 이 5가지 골격을 신규 인력 교육의 최소 커리큘럼으로 채택하면, 'staging에선 되는데 prod에선 안 되는' 사고의 상당수를 사전에 예방할 수 있다.

---

## AI & ML

### [AgentHands: Generating interactive hand gestures for spatially grounded agent conversations in XR](https://research.google/blog/agenthands-generating-interactive-hand-gestures-for-spatially-grounded-agent-conversations-in-xr/)

_Google Research_

Google XR 연구팀이 CHI 2026에 발표한 AgentHands는 LLM 기반 대화 에이전트에 발화와 동기화된 손짓을 더해 확장현실(XR)에서 공간적으로 근거 있는 안내를 제공하는 프로토타입이다. 기존 Project Astra나 Gemini 3.1 Flash Live 같은 시스템은 2D 화면에서 바운딩박스 오버레이로 물체를 짚어주지만, Android XR 같은 몰입형 플랫폼에서는 이런 평면 UI가 한계가 있어 손을 이용한 체화된 대화로 넘어가야 한다는 문제의식에서 출발했다. 연구팀은 손 모양(handedness), 공간 배치(mid-air/object-anchored/user-relative), 시간적 움직임과 시각효과(예: 열기 위험을 알리는 붉은 빛) 등 6개 차원의 분류체계를 정립했고, 시선 추적과 장면 재구성으로 물체를 3D 바운딩박스로 등록하는 환경 인식 모듈, 지시·묘사·감정표현용 손짓 라이브러리, LLM 응답에 GestureEvent를 삽입하는 추론 단계, 텍스트-음성 변환과 손 애니메이션을 단어 단위 타임스탬프로 동기화하는 실행 엔진으로 워크플로를 구성했다. 난초 관리나 3D 프린터 조작 같은 실습형 시나리오에서 시연됐으며, 12명을 대상으로 한 사용자 연구에서 음성만 제공하는 조건 대비 물체 위치 파악과 방향 이해에서 통계적으로 유의미한 향상(p\<0.05)을 확인했다. 다만 소규모 프로토타입 연구로, 대규모 배포나 상용화 로드맵은 아직 제시되지 않았다.

> 💡 지금은 순수 연구 단계지만, XR·공간 컴퓨팅 제품을 다루는 팀이라면 향후 온디바이스 에이전트 UX 설계에 텍스트-음성-제스처 동기화라는 새로운 지연시간·상태관리 요구사항이 추가될 수 있음을 미리 염두에 둘 만하다.

### [5 ways to upgrade your home decor with Google Search](https://blog.google/products-and-platforms/products/search/home-decor-tips/)

_Google AI_

Google 블로그에 게재된 소비자용 팁 글로, 홈 인테리어 계획을 실제로 실행에 옮기는 데 Google Search 기능을 활용하는 5가지 방법을 소개한다. AI Mode에서는 방 사진을 업로드하고 벽 너비 같은 조건을 알려주면 어울리는 가구를 추천받고, 원하는 색상·소재의 소파를 실제 공간에 합성한 목업 이미지까지 볼 수 있다. Google Lens로는 길에서 본 빈티지 소품 사진을 찍어 유사 상품과 가격대를 검색할 수 있고, 최신 Pixel·갤럭시 S26 기기에서는 Circle to Search로 소셜 피드나 웹페이지의 이미지를 원 그리듯 선택해 바로 검색할 수 있다. Search Live는 카메라 영상을 공유하면서 실시간 음성으로 질문해 선반 설치 같은 DIY 작업을 단계별로 안내받는 기능이며, 마지막으로 상품 목록에서 가격 이력을 확인하거나 가격 하락 알림을 설정해 최적의 구매 시점을 잡을 수 있다. 글 자체는 Google AI가 생성한 요약을 포함하고 있으며, 홈데코 관련 검색어(홈데코 영감, 빈티지 러그 등)가 최근 급증했다는 트렌드 데이터도 함께 제시한다. 개발자·인프라 관점의 기술적 내용은 없는 순수 소비자 마케팅 콘텐츠다.

> 💡 이 글에는 인프라·개발자向 정보가 전혀 없지만, AI Mode의 이미지 기반 시각화·가격 이력 트래킹이 여기서 소비자 기능으로 상용화됐다는 사실은 같은 멀티모달 검색+생성 패턴이 조만간 엔터프라이즈 제품 카탈로그나 자산 관리 도구에도 확산될 신호로 참고할 만하다.

### [Granite 4.2 LLMs: How They're Built](https://huggingface.co/blog/ibm-granite/granite-4-2)

_Hugging Face_

IBM Granite 팀이 Hugging Face에 게재한 기술 상세 포스트로, Granite 4.2를 만든 학습 파이프라인 전체를 공개한다. 아키텍처는 GQA(어텐션 헤드 40개, KV 헤드 8개)와 RoPE(θ=10,000,000), SwiGLU MLP, RMSNorm, 분리된 입출력 임베딩을 쓰는 순수 디코더 전용 밀집 트랜스포머이며, 3B/8B/30B 세 모델 모두 동일한 설계와 학습 절차를 공유한다. 사전학습은 약 15조 토큰을 5단계로 나눠 진행했고 5단계에서 컨텍스트를 512K까지 확장했으며, SFT 데이터는 에이전틱 31.6%·비에이전틱 68.4% 비율로 약 720만 샘플(약 1000억 토큰, 그중 학습 대상은 650억 토큰)을 사용했다. 에이전틱 코퍼스는 소프트웨어공학(SWE) 69%, 도구 호출 12.1%, 터미널 사용 8%, 수학 3.5% 등으로 구성되며 OpenHands, SWE-agent, Gemini CLI, Codex 등 다양한 에이전트 스캐폴드로 생성된 궤적을 GPT-OSS-120B와 Gemma 4를 LLM 심판으로 써서 품질 필터링하고 SHA-256 해시로 중복 제거했다. 30B 모델은 에이전틱 코딩에 특화된 2차 SFT를 추가로 거쳤고(리플레이 데이터 16% 유지), 이후 8B·30B 모델은 실제 샌드박스 환경에서 도구 사용을 학습하는 멀티스테이지·멀티환경 강화학습 파이프라인을 거친다. vLLM 등 OpenAI 호환 엔드포인트로 서빙하면 OpenAI 함수 호출 포맷으로 도구 호출을 그대로 방출해 기존 에이전트 하네스에 추가 접착 코드 없이 연결된다.

> 💡 SFT 데이터의 소스 스캐폴드(OpenHands, SWE-agent, Codex 등)와 LLM 심판 필터링, SHA-256 중복 제거까지 구체적으로 공개했다는 점은, 자체 에이전틱 모델을 파인튜닝하려는 팀에게 데이터 파이프라인 설계의 실질적 참고 사례가 된다.

### [Quantization-Aware Healing: a compressed, 4-bit model that outperforms its full-precision original](https://huggingface.co/blog/MultiverseComputingCAI/quantization-aware-healing)

_Hugging Face_

Multiverse Computing 팀이 발표한 Quantization-Aware Healing(QAH)은 구조적으로 압축(레이어·헤드·뉴런 제거)된 모델을 4비트로 양자화한 뒤 성능을 복구하는 새로운 기법으로, 원본 압축 전 모델을 프리즈된 티처로 삼아 KL발산으로 직접 증류한다는 것이 핵심이다. 기존 방식인 QAT(양자화 인식 학습)는 이미 비싼 다단계 후처리 학습 과정을 저정밀 순전파로 다시 돌려야 해 비용이 크고 훈련이 불안정해질 수 있으며, QAD(양자화 인식 증류)는 압축된 뒤 복구된 bfloat16 체크포인트를 티처로 쓰기 때문에 그 체크포인트 자체의 성능 한계에 학생 모델이 갇히는 문제가 있다. QAH는 대신 압축 전 원본 풀사이즈·풀정밀도 모델을 티처로 직접 증류함으로써 이 천장을 제거하고, 32K 토큰 장문 컨텍스트 힐링을 위해 별도 논문에서 제시한 메모리 효율적 청크 단위 KL발산 손실을 재사용해 고정된 GPU 메모리 예산 안에서 처리한다. GPT-OSS 120B를 60B로 구조 압축한 뒤 MXFP4로 양자화하고 QAH를 적용한 결과, 9개 벤치마크 중 7개에서 자기 자신의 bfloat16(16비트) 버전을 능가했으며 특히 장문맥 추론(AA-LCR)에서 +7.4점, 수학(AIME 2025)에서 +5.6점의 큰 향상을 보였다. 심지어 파라미터 수가 절반이고 가중치 메모리가 약 4분의 1에 불과한 QAH 60B 모델이 120B 원본 티처보다 LiveCodeBench에서 더 높은 점수(66.5 대 66.0)를 기록했으며, GPT-OSS 9B 모델로 QAT와 정면 비교한 실험에서도 QAH가 동등하거나 더 나은 정점 성능과 더 안정적인 학습 곡선을 보였다.

> 💡 구조 압축 후 양자화된 모델을 서빙하는 팀이라면, 복구된 bfloat16 체크포인트를 티처로 쓰는 기존 QAD 방식이 성능 천장을 만든다는 사실을 알고 원본 풀정밀도 모델을 직접 티처로 쓰는 QAH로 전환하면 추가 인프라 비용 없이 정확도를 끌어올릴 여지가 있다.

### [The full stack behind abundant intelligence](https://openai.com/index/the-full-stack-behind-abundant-intelligence)

_OpenAI_

OpenAI CFO 사라 프리아가 쓴 이 글은 칩·컴퓨트·모델·제품 전반의 발전이 어떻게 복리로 작용해 더 유용한 지능을 더 큰 규모로, 더 낮은 비용에 제공하는지를 설명한다. 핵심 개념은 제본스 역설로, 효율성이 높아질수록 더 많은 용도가 경제적으로 타당해져 소비가 확대되고 새로운 경제 활동(더 많은 작업 완료, 더 나은 의사결정, 더 많은 제품 출시, 더 많은 매출)이 창출된다는 것이다. 프리아는 이를 OpenAI의 '복리 우위' 구조로 설명하는데, 더 나은 기술이 더 나은 경제성을 만들고, 그 경제성이 다음 발전을 위한 자금을 대며, 모든 개선이 시스템 전체를 강화한다는 순환 구조다. 구체적 근거로 Artificial Analysis의 코딩 에이전트 인덱스에서 GPT-5.6 Sol이 최대 추론 모드로 다른 선도 모델 대비 출력 토큰을 54% 적게 쓰면서도 신기록을 세웠다는 사례를 든다. 이 글은 컴퓨트 단위당 유용한 지능이 모델·라우팅·하드웨어 최적화를 통해 점점 더 효율화되고 있다는 주장을 뒷받침하는 CFO 관점의 경제 논리 글이며, 원문은 봇 차단으로 전문 접근이 제한돼 이번 요약은 검색 결과에 나타난 발췌·인용에 기반했다.

> 💡 제본스 역설을 근거로 효율화가 곧 지출 감소가 아니라 사용량 확대를 부른다고 주장한다는 점에서, 인프라 예산을 세우는 엔지니어는 모델 비용이 떨어질수록 총 컴퓨트 지출은 오히려 늘어날 수 있다는 전제로 용량 계획을 세워야 한다.

### [Jalapeño’s first results show industry-leading speed and efficiency in AI inference](https://openai.com/index/jalapeno-first-results)

_OpenAI_

OpenAI가 Broadcom과 공동 개발한 자체 추론 전용 칩 Jalapeño의 첫 벤치마크 결과를 공개했다. Semianalysis의 InferenceX 벤치마크로 테스트한 결과, 세 가지 모델에 걸쳐 와트당 처리량이 기존 최선의 추론 프로세서 대비 1.5~1.9배 높았고 종단간 지연시간은 1.7~3.6배 단축됐으며, 상호작용성이 높은 워크로드에서는 비교 대상 시스템보다 2.1~4.1배 빨랐다고 밝혔다. 설계의 핵심은 데이터 이동과 통신 지연을 최소화하는 것으로, 응답 생성 중 사용되는 KV 캐시를 포함한 모델 상태를 명시적으로 배치하고 로컬에 유지하면서 추론 단계별로 컴퓨트·메모리·네트워킹의 최적 조합을 활성화하는 방식이다. OpenAI는 자사 모델을 개발 과정에 활용하며 Jalapeño를 설계했다고 밝혔으며, 2026년 말까지 소규모로 배포를 시작해 2027년 본격 확장할 계획이고 2세대·3세대 칩도 이미 준비 중이라고 언급했다. 이는 OpenAI가 엔비디아 등 기존 추론 하드웨어 공급업체에 대한 의존도를 낮추고 자체 실리콘으로 추론 비용과 지연시간을 직접 통제하려는 움직임을 보여주는 사례다.

> 💡 1.5~1.9배의 와트당 처리량 개선이 실증되면 대규모로 추론을 운영하는 조직의 단위 토큰당 전력·비용 구조가 바뀔 수 있으므로, 자체 추론 인프라를 계획 중인 팀은 2026년 말 소량 배포 이후 실측 가격·가용성 발표를 주시할 필요가 있다.

### [Disrupting a new covert influence campaign from Russia](https://openai.com/index/disrupting-malicious-uses-of-ai-influence-campaign-russia)

_OpenAI_

OpenAI는 러시아發로 추정되는 새로운 은밀한 영향력 공작을 적발해 관련 ChatGPT 계정을 차단했다고 발표했다. 이 조직은 이스라엘 기반의 '전문가 커뮤니티'를 자처하는 가짜 싱크탱크 International Burke Institute(IBI)를 운영하며, 러시아 접속 차단을 우회하기 위해 VPN을 사용했다. 주된 활용 방식은 IBI 웹사이트 게시글을 홍보하는 소셜미디어 게시물(X, LinkedIn, Facebook, Substack, Telegram)을 ChatGPT로 생성하는 것이었는데, 러시아어로 요청하면서도 영어·독일어로 결과물을 생성하도록 지시했고 러시아어 화자임을 드러낼 언어적 단서를 숨기라고 명시적으로 주문했다. 샘플로 확인한 IBI 게시글 36건 중 34건이 표절이었으며 일부는 프랜시스 후쿠야마나 노엄 촘스키의 저작으로 잘못 귀속됐고, 이 조직은 러시아를 옹호하고 프랑스·독일·미국을 비판하는 '주권 지수(sovereignty index)'도 운영했다. OpenAI는 이 사례를 자사의 정기적인 악용 사례 적발·차단 보고서의 일환으로 공개했으며, 국가 배후 행위자가 AI를 영향력 공작에 동원하는 패턴이 계속되고 있음을 보여준다.

> 💡 공작이 언어 단서 은폐 지시나 VPN 우회 같은 구체적 회피 전술로 플랫폼 접근 제한을 뚫었다는 점에서, AI 플랫폼을 운영하는 팀은 지역·IP 기반 차단만으로는 불충분하며 콘텐츠 패턴·행동 이상 탐지를 병행해야 한다는 실무적 교훈을 얻을 수 있다.

### [Wire It, Run It, Deploy It: AI Workflows in Gradio](https://huggingface.co/blog/gradio-workflow-guide)

_Hugging Face_

Hugging Face의 Gradio 팀이 새 기능 `gr.Workflow`를 소개하는 글로, 여러 AI 모델·함수를 잇는 파이프라인을 코드가 아니라 시각적 그래프로 구성할 수 있게 한다. 참조(입력), 오퍼레이터(작업 단계), 서브젝트(출력)라는 세 종류의 타입이 지정된 노드를 드래그해 연결하면 Gradio가 각 노드를 실행 가능하고 중간 결과가 보이는 드래그앤드롭 캔버스로 서빙하며, 동일한 그래프가 자동으로 REST API가 되고 Hugging Face Spaces에 한 번의 명령으로 배포된다. 예시로는 이미지 편집(Qwen-Image-Edit 단일 노드), FLUX로 이미지를 생성한 뒤 배경 제거·TTS·LLM 타이틀 생성을 조합하는 미디어 스튜디오(각 출력이 /sticker, /voiceover, /episode_title 같은 개별 REST 엔드포인트가 됨), 하나의 프롬프트에서 여러 이미지 변형을 병렬 생성하는 팬아웃 패턴, Hugging Face 데이터셋 통계를 병렬로 4개 노드에서 분석하는 앱, `@spaces.GPU` 데코레이터로 ZeroGPU를 통해 노드 안에서 자체 GPU 모델을 돌리는 예제가 소개된다. 오퍼레이터는 사용자 정의 Python 함수, Hugging Face Inference Providers의 모델, 다른 Gradio Space, 또는 Hub 데이터셋의 행이 될 수 있으며, 완성된 워크플로는 Python `gradio_client`나 순수 curl로도 그대로 호출할 수 있다. `gr.Workflow(bind=[your_function]).launch()` 몇 줄로 시작할 수 있고, 각 데모는 실제 작동하는 Hugging Face Space로 제공돼 그대로 복제해 커스터마이징할 수 있다.

> 💡 각 워크플로 노드가 자동으로 독립된 REST 엔드포인트가 된다는 점은, 프로토타입 단계의 멀티모델 파이프라인을 별도 API 게이트웨이 구축 없이 곧바로 내부 서비스나 프로덕션 통합에 연결할 수 있게 해 배포 리드타임을 크게 줄여준다.

---

## 클라우드 업데이트

### [Bringing gVisor sandboxes to distributed Ray clusters](https://cloud.google.com/blog/products/containers-kubernetes/gvisor-sandboxes-for-ray-clusters-on-gke/)

_Google Cloud_

Google Cloud가 Anyscale과 협력해 분산 Ray 클러스터에 gVisor 기반 샌드박싱을 네이티브로 통합하는 실험적 라이브러리를 발표했다. RL(강화학습) 후처리 워크플로에서 Ray가 사실상 표준 컴퓨트 런타임으로 자리잡으면서, 에이전틱·추론 모델의 동적 롤아웃과 코드 생성, 멀티턴 도구 상호작용을 안전하게 격리 실행할 방법이 병목이 되고 있었다. Ray Sandboxing은 별도 추상화 대신 각 샌드박스를 Ray Actor로 표현해 기존 Ray 스케줄러가 노드 배치, CPU·메모리 예약, 생명주기 관리, 장애 복구를 그대로 처리하도록 설계됐고, Ray 2.58부터 `ray.experimental.sandbox` API로 OCI 호환 이미지에서 샌드박스를 생성해 명령 실행·파일 입출력·상태 조회·종료까지 다룰 수 있다. 저수준 제어가 필요하면 `SandboxRuntime`으로 로컬 gVisor 샌드박스 풀을 직접 구성할 수도 있다. gVisor를 선택한 이유는 Linux 시스템콜 인터페이스 상당 부분을 유저스페이스에서 구현해 호스트 커널과의 격리 경계를 추가로 두면서도 OCI 호환·서브초 단위 시작·낮은 메모리 오버헤드를 제공해 미세한 단위의 분산 리소스로 쓰기 적합하기 때문이다. 향후 버전에서는 Agent Substrate, Kata Containers 등 다른 샌드박싱 런타임도 지원할 계획이며, 관련 문서와 GKE 사용 가이드, GitHub 이슈를 통한 피드백 채널도 공개됐다.

> 💡 모델이 생성한 코드나 도구 호출을 신뢰할 수 없는 입력으로 취급해야 하는 RL·에이전트 파이프라인을 GKE에서 운영한다면, 별도 격리 인프라를 직접 구축하는 대신 Ray의 기존 스케줄러·장애복구 모델 안에서 gVisor 샌드박스를 1급 리소스로 다룰 수 있다는 점이 운영 복잡도를 크게 낮춘다.

### [Now introducing Gemini Enterprise for Legal](https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-for-legal/)

_Google Cloud_

Google Cloud CEO 토마스 쿠리안이 발표한 Gemini Enterprise for Legal은 법률 실무 특화 산업 솔루션 라인업의 첫 제품으로, 범용 모델 지능만으로는 법률 업무의 엄격한 기밀 유지·매터 권한·윤리적 방화벽 요건을 충족할 수 없다는 문제의식에서 출발했다. 핵심은 네 가지 구성요소로, 계약 검토·레드라이닝·플레이북 작성·규제 동향 스캐닝·법률 리서치·DSAR 처리 등을 수행하는 도메인 특화 '스킬', 문서관리시스템·판례저장소·리서치 서비스를 기존 권한 체계를 그대로 상속해 연결하는 보안 MCP 커넥터, 실제로 작업을 완결하는 사전 구축 에이전트, 그리고 Accenture·Deloitte·KPMG 등 파트너 생태계다. 이 모든 것은 VPC·CMEK 보안 정책을 적용하고 출처 인용이 검증 가능한 단일 거버넌스 대시보드 위에서 작동한다. 구체적 활용 사례로는 법규 변경을 자동 추적해 정책 초안을 생성하는 규제 동향 스캐닝, DSAR(개인정보 접근요청) 자동 처리, 벤더 계약·NDA·M&A 문서를 플레이북과 대조해 고위험 조항을 표시하는 계약 검토, 소송 서류 봉인 시 민감 정보를 자동 식별하는 문서 편집 등이 있다. Google Workspace·Microsoft 365 같은 생산성 도구는 물론 iManage·NetDocuments 같은 문서관리시스템, Docusign, Everlaw·RelativityOne 같은 이디스커버리 플랫폼, Thomson Reuters HighQ, CourtListener 등 법률 전문 시스템과 MCP로 직접 연동되며, 접근 권한은 각 시스템의 기존 역할 기반 통제를 그대로 상속한다.

> 💡 이 제품의 핵심 차별점은 모델 성능이 아니라 MCP 커넥터가 문서관리시스템의 기존 매터 권한과 윤리적 방화벽을 그대로 상속한다는 거버넌스 설계이므로, 규제 산업에 AI 에이전트를 도입하는 플랫폼 팀은 접근제어를 에이전트 레이어에서 재구현하지 말고 원본 시스템 권한을 통과시키는 이 패턴을 참고할 만하다.

### [Now introducing Gemini Enterprise for Financial Services](https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-for-financial-services/)

_Google Cloud_

Google Cloud CEO 토마스 쿠리안이 자본시장·기업금융 워크플로를 겨냥한 Gemini Enterprise for Financial Services를 발표했다. 범용 AI로는 라이선스된 시장 데이터, 사내 모델, 기밀 고객 파일을 넘나드는 금융 실무에 필요한 실시간 정확성·데이터 계보 검증·엄격한 보안을 충족할 수 없다는 문제의식에서, 재사용 가능한 도메인 스킬, 보안 MCP 커넥터, 실행형 에이전트, 개방형 파트너 생태계라는 4가지 구성요소를 거버넌스 컨트롤 플레인 위에 결합했다. 핵심은 Google이 자체 구축·관리하는 'Financial Research 에이전트'로, 50개 이상의 파운데이션 스킬을 탑재해 신뢰도 점수·명시적 방법론·감사용 데이터 스냅샷·정확한 출처 인용과 함께 엔드투엔드 리서치를 수행하며 Agent-to-Agent(A2A) API로 기존 워크플로에 연결할 수 있다. 활용 사례로는 PDF·엑셀·SEC 공시를 다중 포맷으로 취합해 복잡한 기업 지배구조와 최종수익자(UBO)를 파악하는 KYC 리서치, 채권 포트폴리오 리스크 노출 분석을 5분 이내로 단축하는 포트폴리오 리질리언스, 신용시장 미스프라이싱을 식별하는 크레딧 기회 발굴, 영업제안서 준비 기간을 며칠에서 몇 분으로 압축하는 채권 발행 가속화 등이 있다. Daloopa, FactSet, Finnhub, Moody's, MSCI, PitchBook, SEC Edgar, CoinDesk 등 라이선스 시장 데이터·규제 공시·리스크 평가·디지털 자산 소스와 MCP로 직접 연동되며, 접근 권한은 기존 라이선스 계약과 역할 기반 통제를 그대로 유지한다.

> 💡 핵심 가치는 모델 자체가 아니라 신뢰도 점수·감사용 데이터 스냅샷·출처 인용을 기본 제공하는 Financial Research 에이전트의 설명가능성 설계이므로, 감사 추적이 필수인 금융 조직이 에이전트를 도입할 때 이런 감사가능성(auditability)을 자체 구축할지 이 계층을 채택할지 판단 기준으로 삼을 만하다.

### [Streamlining container security: Red Hat Hardened Images now supported in AWS InspectorScan API and ECR Basic scanning](https://www.redhat.com/en/blog/streamlining-container-security-red-hat-hardened-images-now-supported-aws-inspectorscan-api-and-ecr-basic-scanning)

_Red Hat_

Red Hat이 자사의 최소화된 컨테이너 베이스 이미지 카탈로그인 Red Hat Hardened Images를 AWS의 InspectorScan API와 Amazon ECR Basic 스캐닝에서 지원한다고 발표했다. 배경은 불필요한 셸·패키지 매니저·도구가 포함된 전통적 베이스 이미지가 취약점 알림 홍수를 유발해 보안팀은 노이즈 트리아지에, 개발팀은 CVE 대응에 시달린다는 문제다. Hardened Images는 애플리케이션 실행에 필요한 파일만 담아 Red Hat의 신뢰된 소프트웨어 파이프라인으로 빌드·엄격히 테스트되며, CIS·STIG·OpenSCAP 같은 컴플라이언스 인증을 지원하는 표준화된 보안 프로필을 제공한다. Amazon ECR Basic 스캐닝은 50개 이상의 데이터 피드(벤더 보안 권고, 위협 인텔리전스, NVD 등)를 활용해 레지스트리에 저장된 이미지의 OS 패키지 CVE를 이미지 푸시 시 자동 또는 수동으로 스캔하며 결과를 ECR 콘솔과 EventBridge로 전달한다. AWS InspectorScan API는 CI/CD 파이프라인에서 SBOM을 받아 NVD·CVSS 점수가 매겨진 상세 취약점 리포트를 반환함으로써 이미지가 레지스트리에 도달하기 전 빌드 단계에서부터 취약한 이미지를 게이트체크로 막을 수 있게 한다. 또한 Hardened Images는 쉘·패키지 매니저 없는 프로덕션용 Default, 빌드 도구가 포함된 다단계 빌드용 Builder, FIPS 140-2/3 검증 암호화 모듈을 강제하는 규제 환경용 FIPS 등 용도별 변형을 제공하며, 카탈로그 전체는 약 60개 핵심 이미지와 150개 이상의 변형으로 구성돼 있다.

> 💡 InspectorScan API가 빌드 단계에서, ECR Basic 스캐닝이 레지스트리 저장 후 단계에서 각각 취약점을 잡는 이중 계층 구조라는 점을 이해하면, AWS 네이티브 컨테이너 보안을 이미 쓰는 팀은 Hardened Images로 베이스 이미지를 바꾸는 것만으로 별도 서드파티 스캐너 없이 CVE 노이즈를 구조적으로 줄일 수 있다.

### [Preparing OpenStack for the post-quantum era: A systematic approach to crypto-agility](https://www.redhat.com/en/blog/preparing-openstack-post-quantum-era-systematic-approach-crypto-agility)

_Red Hat_

Red Hat이 OpenStack 생태계 전반의 양자내성암호(PQC) 취약점을 체계적으로 조사한 결과를 공개했다. Shor 알고리즘을 실행할 수 있는 암호학적으로 유의미한 양자컴퓨터(CRQC)가 등장하면 OpenStack이 토큰 서명, 키 생성, TLS, 비밀 저장에 쓰는 RSA, ECDSA, ECDH, Ed25519가 모두 깨지는 이른바 'Q-day'가 오는데, 이는 지금 암호화된 데이터를 수집해뒀다가 미래에 복호화하는 'harvest now, decrypt later' 공격 위험을 이미 현재화시킨다. 2026년 4월 PTG에서 출범한 업스트림 PQC Migration Pop-up Team과 다운스트림 27개 엔지니어링 팀이 90개 이상의 저장소를 자체 제작 스캐너로 분석해 총 572건의 발견 사항과 23개 팀에 걸친 39개 교차 패턴을 문서화했으며, 독립된 보안팀이 별도 스캔으로 모든 결과를 검증했다. 4가지 구조적 문제로는 Barbican의 SimpleCrypto 플러그인이 RSA/DSA 키만 생성하는 점, Keystone이 ECDSA P-256으로 하드코딩된 토큰 서명을 쓰며 설정 옵션이 없다는 점, oslo.messaging의 레거시 SSL 버전 맵이 TLS 1.3을 지원하지 않아 서비스간 메시징 전체의 PQC 하이브리드 키교환을 막고 있다는 점, cert-manager·Go 오퍼레이터의 기본 암호 설정이 RSA-2048이나 프로토콜 다운그레이드를 허용한다는 점을 꼽았다. 다만 OpenSSL 3.5(ML-KEM/ML-DSA 네이티브 지원)와 pyca/cryptography 48.0/49.0으로 플랫폼이 업그레이드되면 프로토콜 버전을 제한하지 않는 Python 서비스의 TLS 하이브리드 키교환 등 상당수 항목은 애플리케이션 코드 변경 없이 자동으로 해결된다고 밝혔다.

> 💡 OpenStack을 운영하는 조직은 OpenSSL 3.5로 플랫폼을 올리는 것만으로 해결되는 항목과, Keystone·Barbican처럼 하드코딩된 알고리즘 선택 때문에 애플리케이션 코드를 직접 고쳐야 하는 항목을 구분해 우선순위를 매겨야 하며, 이 기사의 4대 패턴 목록이 그 체크리스트로 바로 쓸 만하다.

### [Paying it forward: How mentorship comes full circle for early talent](https://www.redhat.com/en/blog/paying-it-forward-how-mentorship-comes-full-circle-early-talent)

_Red Hat_

Red Hat 인턴십 프로그램의 멘토링 문화를 다루는 기업 문화 소개 글로, 기술적 내용은 없다. 남동부 상업지역 기술 계정 매니저(TAM) 팀을 이끄는 마크 리히터는 인턴 아르나 우파디아야를 지도하며 오히려 베테랑 팀원들이 신입의 시각에서 배우는 상호적 경험을 강조했다. 시니어 소프트웨어 엔지니어 알렉스 올라델레는 앤서블 오토메이션 허브 팀 인턴 메이슨 마인스를 멘토링하며 그의 긍정적 에너지가 팀 전체 분위기를 바꿨다고 전했다. 롤리·보스턴의 대학 인턴들은 고교 인턴십 프로그램 참가자들을 다시 멘토링하는 순환 구조를 경험했다. 보스턴 세일즈 인턴 앨리사 로고진은 자신이 성장한 만큼 신입을 가르치며 스스로도 배웠다고 밝혔다. 이 글은 인턴들이 실제 업무 과제를 맡아 진로를 탐색하도록 돕는다는 점과, 멘토링이 일방적 지도가 아니라 관리자·동료·인턴 사이에서 양방향으로 이뤄진다는 점을 강조한다. 전반적으로 Red Hat이 관리자-인턴, 동료 간, 시니어 인턴-신입 인턴 등 모든 경험 수준에서 상호적 멘토링 문화를 조성하고 있음을 알리는 채용 브랜딩 성격의 글이다.

> 💡 순수 기업 문화 홍보 글로 클라우드·데브옵스 엔지니어가 기술적으로 참고할 내용은 없지만, 채용 브랜딩 관점에서 신입 엔지니어 온보딩·멘토링 프로그램을 설계하는 매니저에게는 참고 사례가 될 수 있다.

---

## DevOps & 인프라

### [IBM’s new Granite 4.2 models add reasoning and stay dense](https://thenewstack.io/ibm-granite-reasoning-models/)

_The New Stack_

IBM이 30억, 80억, 300억 파라미터로 구성된 오픈웨이트 Granite 4.2 모델군을 출시했다. 업계 다수가 Mamba/attention 하이브리드 아키텍처로 옮겨가는 것과 달리 IBM은 처음부터 사전학습한 밀집(dense) 디코더 전용 트랜스포머 구조를 유지한다. Granite 4.2는 '추론 중심' 릴리스로, thinking/non-thinking 모드에 더해 쉬운 질문에는 적은 추론 토큰만 쓰는 low-effort 모드를 새로 도입했다. Apache 2.0 라이선스로 15조 토큰을 5단계에 걸쳐 학습했고 컨텍스트 윈도우를 512K까지 확장했으며(공개 설정은 128K 지원), 1조 토큰 규모의 합성 코드 데이터도 포함했다. 8B와 30B 모델은 추가로 에이전틱 강화학습 단계를 거쳐 도구 호출, 코드 편집·실행, 터미널 조작, 웹 검색이 가능하다. 벤치마크에서는 획기적이지 않지만 8B가 30B에 근접한 성능을 내면서도 일반 Mac이나 저가형 RTX GPU에서도 구동 가능하다는 점을 강조했고, 코딩 성능은 Qwen 3.8 27B 등 경쟁 모델에 뒤처진다. IBM은 엔터프라이즈가 가벼우면서도 실제 워크플로에서 계획·실행이 가능한 에이전트를 구축하도록 돕는 것이 목표라고 설명했다.

> 💡 저비용 하드웨어에서 돌아가는 8B 밀집 모델이 30B에 근접한 성능을 낸다는 점은, 에이전틱 워크로드를 자체 인프라에서 저렴하게 운영하려는 플랫폼 팀에게 프론티어 모델 대신 검토할 만한 현실적 대안을 제시한다.

### [How telemetry pipelines keep AI agent costs under control](https://thenewstack.io/agentic-ai-telemetry-costs/)

_The New Stack_

Apica가 후원한 이 기사는 AI 에이전트가 프로덕션에 확산되면서 텔레메트리 비용이 통제 불능 수준으로 치솟고 있다는 문제를 다룬다. Apica가 Omdia/Informa TechTarget에 의뢰해 북미·서유럽 IT 의사결정자 300여 명을 조사한 결과 59%가 모니터링 비용 때문에 에이전틱 AI 배포를 종료하거나 연기한 적이 있으며, 특히 사이버보안·컴플라이언스·부정거래 탐지처럼 고위험 영역에서 이런 중단이 두드러졌다. 지난 1년간 텔레메트리 볼륨이 3배로 늘었다는 응답이 54%였고 그중 43%가 AI/ML 워크로드 때문이었으며, 관측가능성(observability) 지출은 평균 317만 달러로 전년 대비 28% 증가했고 향후 2년간 평균 9.5배 폭증할 것으로 예상됐다. 원인은 에이전트 하나의 작업이 최상위 트레이스, 여러 모델 호출, 검색·도구 호출, 재시도·루프, 하위 에이전트 위임 등으로 분기하며 tool_name·agent_id·trace_id 같은 고카디널리티 식별자를 대량 생성하기 때문이다. Apica CPTO 앤디 만은 해법으로 데이터를 소스 단에서 먼저 처리하는 '파이프라인 우선' 아키텍처를 제안하는데, 반복되는 성공 이벤트는 샘플링하되 실패·재시도·정책 위반·이상 지연은 보존하고, 민감 정보는 소스에서 리댁션한다. Apica 조사에 따르면 텔레메트리 파이프라인을 도입한 조직은 에이전틱 AI 확산에 대한 준비도가 50% 더 높고, 성숙한 조직 중에서는 파이프라인 도입 기업이 운영비용 문제를 피할 확률이 80% 더 높았으며, 레거시 관측가능성 플랫폼 대비 총소유비용을 40%까지 절감할 수 있다고 주장한다.

> 💡 에이전트 하나가 트레이스·도구 호출·재시도를 기하급수적으로 늘려 고카디널리티 텔레메트리를 양산한다는 점에서, 관측가능성 스택을 이미 갖춘 조직도 소스 단 샘플링·필터링 계층 없이는 에이전틱 AI 확산과 함께 관측 비용이 예산을 초과해 배포 자체가 취소될 위험이 있다.

### [The Grafana AI SDK for Go: a shared foundation for building AI applications](https://grafana.com/blog/the-grafana-ai-sdk-for-go-a-shared-foundation-for-building-ai-applications/)

_Grafana_

Grafana Labs가 자사 팀들이 각자 다른 LLM 클라이언트 추상화를 반복해서 만들던 문제를 해결하기 위해 만든 Grafana AI SDK for Go를 오픈소스로 공개했다. 모델 호출, 스트리밍 응답, 도구(함수) 실행, 구조화된 출력 생성, 멀티스텝 에이전트 실행을 위한 공통 인터페이스를 제공하며, Vercel AI SDK가 쓰는 프로토콜을 그대로 구사해 Go 백엔드가 useChat·useCompletion·useObject 같은 프론트엔드 훅으로 직접 스트리밍할 수 있다. 현재 Anthropic, Amazon Bedrock, OpenAI Responses API, OpenAI 호환 API를 지원하며 프로바이더별 모듈이 분리돼 있어 필요한 의존성만 설치하면 되고, 타임아웃·재시도·모델 폴백·로깅·메트릭·Agent Observability 미들웨어도 내장돼 있다. 설계 모델은 Vercel AI SDK를 참고하되 Go의 관용적 방식(인터페이스, 채널, 명시적 에러, context, 함수형 옵션)으로 재구현했고, 고정된 업스트림 버전에 대해 컨포먼스 테스트를 돌리며 실제 TypeScript 프론트엔드 패키지와도 검증한다. 가장 중요한 공통 기능으로 꼽히는 것은 Agent Observability 미들웨어로, 모델·에이전트 활동, 사용량, 오류, 멀티스텝 관계, 라우팅된 호출을 처리한 프로바이더까지 Grafana에 기록한다. 아직 젊은 프로젝트라 업스트림 기능과의 완전한 기능 동등성은 없으며, 공개된 호환성 베이스라인과 갭 목록을 통해 어떤 기능이 아직 없는지 투명하게 공개하고 있다.

> 💡 여러 팀이 각자 LLM 통합을 만들면 재시도·스트리밍·관측성 관례가 파편화된다는 것이 Grafana의 실제 경험이므로, 다수 팀이 AI 기능을 병렬로 개발하는 조직이라면 공급자 추상화·관측성 미들웨어를 사내 표준으로 조기에 못 박는 편이 나중에 갈아엎는 것보다 저렴하다.

### [Golden Paths for AI agents: What changes when platform users aren’t human?](https://www.datadoghq.com/blog/golden-paths-for-ai-agents/)

_Datadog_

Datadog 엔지니어들이 쓴 이 글은 인간 개발자를 위해 설계된 '골든 패스(Golden Path)'를 AI 에이전트라는 새로운 플랫폼 사용자에 맞게 재설계하는 방법을 다룬다. Gartner의 2026 에이전틱 AI 하이프 사이클 보고서를 인용하며 에이전트가 신기술 중 가장 빠른 채택 곡선을 그리고 있고 이제는 공식적인 '에이전트 경험(AX)' 페르소나로 취급된다고 짚은 뒤, 실시간 대화형 에이전트에는 종단간 데드라인·개별 호출 타임아웃을 두는 동기·저지연 실행 패턴이, 시간이 걸리는 비동기 작업형 에이전트에는 워크플로 상태를 모델 컨텍스트와 별개로 영속화해 재시작 후에도 이어갈 수 있는 내구성(durable) 실행 패턴이 필요하다고 구분한다. Datadog은 자사 AI Gateway의 롤링 배포 중 그레이스풀 셧다운 기간이 진행 중이던 에이전트 요청을 완료하기에 너무 짧아 타임아웃이 급증했던 실제 사례를 소개하며 이를 실증한다. 코드를 실행하는 에이전트는 개발 환경의 파일·자격증명·네트워크 권한을 그대로 상속하므로 표준 서비스와 분리된 격리 샌드박스를 원격 도구로 노출하고 파일시스템·네트워크·리소스·수명을 제한해야 한다고 권고하며, 에이전트의 확률적(probabilistic) 판단과 테스트·보안스캔·승인·머지권한 같은 결정론적(deterministic) 통제를 분리해 확률적 출력이 실행되기 전 반드시 결정론적 게이트를 거치게 하는 '하이브리드 골든 패스' 패턴을 제안한다. 또한 에이전트에 노출하는 모든 플랫폼 기능은 명확한 설명, 타입 지정된 입출력, 버전 관리된 스키마, 기계 판독 가능한 제한과 오류 범주, 명시적 부작용·사전조건·승인 요구사항을 갖춘 기계소비가능(machine-consumable) 계약을 제공해야 하며 이런 가드레일은 오케스트레이션 레벨이 아니라 플랫폼 레벨에서 강제돼야 한다고 강조한다.

> 💡 AI Gateway 롤링 배포에서 그레이스풀 셧다운 시간이 짧아 진행 중이던 에이전트 요청이 타임아웃됐다는 Datadog의 실제 장애 사례는, 에이전트 트래픽을 받는 모든 서비스가 인간 요청 기준으로 튜닝된 배포·셧다운 파라미터를 재검토해야 한다는 구체적 운영 신호다.

### [Scale software delivery pipelines in isolation without owning the runner fleet](https://about.gitlab.com/blog/hosted-runners-for-gitlab-dedicated/)

_GitLab_

GitLab이 GitLab Dedicated(격리된 싱글테넌트 관리형 인스턴스) 고객을 위한 완전관리형 CI 실행 서비스인 Hosted Runners for GitLab Dedicated를 발표했다. 배경은 에이전틱 워크플로가 파이프라인 물량을 늘리면서 완전한 데이터 격리와 러너 인프라 운영 부담이 점점 더 큰 과제가 되고 있다는 점이며, 이제 조직이 직접 러너 플릿을 프로비저닝·패치·확장할 필요가 없어진다. 핵심 특징은 다른 고객과 완전히 격리된 러너 플릿을 제공하며 작업 단위 보안을 위해 각 잡이 새로 프로비저닝된 격리 VM에서 실행되고 완료 후 즉시 삭제되는 '한 러너 당 한 잡' 모델, AWS PrivateLink를 통해 내부 아티팩트 레지스트리·시크릿 매니저·배포 대상에 안전하게 연결하는 네트워크 보안, GitLab Dedicated와 동일한 데이터 상주 요건을 충족하는 컴플라이언스 지원, 99.9% 업타임 SLA다. 러너 생성·관리는 GitLab Dedicated 관리 콘솔인 Switchboard에서 셀프서비스로 가능하며, 사용량은 GitLab Credits 대시보드에서 추적하고 소비한 만큼만 GitLab Credits로 차감되는 종량제 방식이다. 머신 크기는 Small(2vCPU/8GB)부터 2X-Large(32vCPU/128GB)까지 Linux x86-64·Arm64로 제공되며, 이는 러너 인프라를 과잉 프로비저닝(비용 증가)하거나 과소 프로비저닝(대기시간 증가)해야 했던 기존의 트레이드오프를 플랫폼 팀 대신 GitLab이 흡수하겠다는 제안이다.

> 💡 잡 단위로 새 VM을 프로비저닝하고 즉시 삭제하는 '한 러너 당 한 잡' 모델은 자체 러너 플릿을 운영하며 과잉·과소 프로비저닝 사이에서 씨름해온 플랫폼 팀에게, 그 트레이드오프를 SLA가 걸린 벤더 서비스로 이전할지 판단할 근거가 된다.

### [Your alt text passes automated checks. That doesn’t mean it’s any good.](https://github.blog/engineering/user-experience/your-alt-text-passes-automated-checks-that-doesnt-mean-its-any-good/)

_GitHub_

GitHub 엔지니어링팀이 GitHub Accessibility Scanner용으로 만든 alt 텍스트 품질 검사 플러그인의 설계 과정을 다룬다. 출발점은 WebAIM의 2026 WebAIM Million 리포트로, 상위 100만 개 홈페이지 이미지의 16.2%에 alt 텍스트가 아예 없고, 있는 것 중 10.8%는 `alt=image`나 파일명, 인접 이미지와 동일한 텍스트처럼 무의미한 값이라는 사실을 보여준다. 팀은 alt 텍스트만으로 판별 가능한 5가지 결정론적 규칙(속성 부재/공백, 파일명, TODO 같은 자리표시자, ‘image’·‘chart’ 같은 일반명사 단독 사용, 인접 이미지와 동일한 텍스트 반복)을 기본으로 제공하되, 이미지 콘텐츠와 문맥 판단이 필요한 규칙은 옵트인으로 분리해 모델을 호출하도록 설계했다. 특히 반복 alt 텍스트 검출은 처음에 문서 순서로 판별했다가 화면상 멀리 떨어진 두 개의 ‘GitHub’ 로고를 잘못 묶어 실패했고, 이를 바운딩박스 간 간격을 이미지 크기와 비교하는 레이아웃 기반 판정으로 수정했다. 옵트인 AI 품질 검사는 근처 헤딩·페이지 제목·figcaption·링크 여부·주변 600자 텍스트를 함께 비전 모델에 전달하며, 첫 버전이 이미 훌륭한 alt 텍스트에도 항상 ‘더 좋게 만들 수 있다’고 트집을 잡는 문제를 겪은 뒤 4단계 순차 판정 절차, 명시적 안티닛픽 규칙, 판정 전에 근거를 먼저 생성하도록 강제하는 구조화된 출력으로 해결했다. 이 옵트인 규칙은 기본적으로 꺼져 있고, GitHub Models 접근 토큰이 필요하며, 서명된 CDN 토큰이 유출되지 않도록 이미지 URL을 리댁션하는 등 프라이버시·비용을 고려한 데이터 흐름 설계도 함께 다룬다.

> 💡 저자들이 명확히 밝히듯 거짓양성률 높은 품질 규칙은 팀이 그냥 꺼버리기 때문에, 자동 접근성·품질 검사를 CI에 도입하는 팀은 결정론적 규칙과 AI 기반 판단을 명확히 분리하고 AI 규칙은 기본 옵트인으로 두는 이 설계 원칙을 그대로 참고할 만하다.

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
