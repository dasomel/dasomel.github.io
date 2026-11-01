---
title: "📰 데일리 테크 다이제스트 - 2026-11-01"
description: "2026-11-01 Cloud, Kubernetes, AI, DevOps 소식 3건 — 자동 큐레이션 다이제스트."
pubDate: 2026-11-01
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### The context problem: How Docusign built agents that understand the business behind contracts

Docusign은 단순 전자서명을 넘어 2024년 4월 공개한 지능형 계약 관리(IAM) 플랫폼을 구동하는 계약 전용 AI 엔진 'Iris'의 아키텍처와 컨텍스트 해결 방식을 공유했다. Docusign의 최고기술책임자(CTO) 사그닉 난디(Sagnik Nandy)는 범용 LLM이 여러 수정안과 가격표가 얽힌 계약서를 개별 PDF로 인식하는 한계를 지적하며, 단일 계약 관계를 파악하기 위한 컨텍스트 엔지니어링의 필요성을 강조했다. Iris는 계약 내 문맥, 다중 계약 및 수정안 간 문맥, 사내 규정 및 승인 권한 플레이북, 사용자 문맥 등 4가지 범주의 컨텍스트를 커스텀 로직과 시맨틱 검색으로 결합한다. 시스템은 100만 달러 이상 계약 갱신 조회나 특정 공급업체 지불 의무 확인과 같은 복잡한 질의 처리를 위해 5~6개 도구를 연동하고 오케스트레이션한다. 운영 위험을 방지하기 위해 일정 지출 임계값 이하의 갱신은 Workflow Builder로 자동 승인하되 고액 계약이나 예외 조항은 사람의 검토로 라우팅하는 거버넌스 모델을 적용했다. Docusign에 따르면 고객사 Experian은 Docusign과 CPQ 솔루션을 연동하여 계약 소요 주기를 기존 약 10일에서 수 시간 단위로 대폭 단축했다.

> 💡 **왜 중요한가**: 엔터프라이즈 AI 에이전트를 도입할 때 범용 LLM 추론에만 의존하기보다 도메인 규칙 기반의 결재 워크플로와 인간 개입(HITL) 임계값을 결합해야 예기치 않은 계약 이행 사고를 방지할 수 있다.

🔗 [원문 보기](https://thenewstack.io/docusign-contract-ai-agents/) · _The New Stack_

---

## DevOps & 인프라

### [Five years after the fork, OpenSearch is slowly stepping out of AWS’s shadow](https://thenewstack.io/opensearch-foundation-aws-elasticsearch/)

_The New Stack_

AWS가 2021년 1월 엘라스틱서치(Elasticsearch)를 포크해 시작된 오픈서치(OpenSearch)가 리눅스 재단 산하 독립 프로젝트로 이관된 지 2년이 지나며 탈-AWS 행보를 보이고 있다. 프라하 오픈소스 서밋 유럽에서 재단 총괄 디렉터 비앙카 루이스(Bianca Lewis)는 2024년 9월 리눅스 재단으로의 프로젝트 기증이 라이선스 변경을 막는 중대한 전환점이었다고 밝혔다. 오픈서치 소프트웨어 재단 통계에 따르면 전체 저장소 내 AWS 기여 활동 비중은 첫해 91%에서 2025~2026년 72%로 감소했고, 핵심 저장소의 아마존 소속 메인테이너 비율도 2022년 4월 95%에서 71%로 낮아졌다. '2026 오픈 데이터 인프라스트럭처 보고서'에 따르면 클라우드 내 자체 관리형 배포 비중은 2024년 37%에서 60%로 급증한 반면, AWS 관리형 서비스 이용률은 44%에서 48%로 완만하게 증가했다. 그러나 비도입 기업 71곳 중 24%는 여전히 AWS와의 역사적 연계와 벤더 중립성을 우려 사항으로 꼽았으며, 기술운영위원회(TSC) 15석 중 4석을 AWS가 보유하고 10월에 AWS 소속 앤드루 로스(Andrew Ross)가 의장으로 재선출되는 등 영향력은 지속되고 있다. 기술적으로는 지난 9월 출시된 오픈서치 3.9를 중심으로 벡터 및 하이브리드 검색 기능을 강화하며 RAG 기반 엔터프라이즈 AI 인프라 시장을 집중 공략하고 있다.

> 💡 클러스터 검색 백엔드를 선택할 때 단일 클라우드 제공업체의 관리형 서비스 종속에서 벗어나 자체 관리형 컨테이너 클러스터로 전환하는 사례가 늘고 있어 벤더 락인 방지와 장기 인프라 비용 절감 효과를 동시에 평가해야 한다.

### [Developers ask AI which tool to use. Here’s how we track the answer.](https://thenewstack.io/tracking-ai-tool-recommendations/)

_The New Stack_

2026년 스택오버플로(Stack Overflow) 설문조사에서 개발자의 약 70%가 문제 해결에 AI 에이전트를 활용한다고 응답한 가운데, Webflow 팀이 주요 AI 엔진의 도구 추천 방식을 추적한 결과를 공개했다. 연구진은 9월 25일부터 10월 19일까지 ChatGPT, Claude, Gemini, Perplexity 등 4개 엔진에 "어떤 CMS 플랫폼이 MCP 연동을 지원하는가"라는 프롬프트를 총 100회 실행했다. 분석 결과 Webflow는 전체 응답의 49%에서 언급되었으나, Perplexity에서는 25회 중 22회 언급된 반면 Claude에서는 25회 중 4회에 그쳐 엔진별 편차가 컸다. 특히 서드파티 가이드인 llmcms.org가 전체 응답 100건 중 60건의 인용 출처에 포함되어 AI 엔진이 공식 문서보다 집계 디렉터리에 크게 의존함을 확인했다. 엔지니어링 관점에서 AI 에이전트의 문서 가독성을 높이기 위해 GPTBot 등 크롤러 차단 여부 점검, `/llms.txt` 및 `.md` 확장자 지원, JSON-LD 태그 적용을 제안했다. 또한 MCP(Model Context Protocol) 도구 설계 시 단순 엔드포인트 래핑을 지양하고 의도 기반 도구 명세 작성, OpenAPI 스펙 동기화, OAuth 기반 최소 권한 인가를 권고했다.

> 💡 개발자 도구와 사내 플랫폼 문서를 운영할 때 기존 웹 SEO를 넘어 AI 크롤러 허용 정책, `/llms.txt` 규격, 스키마 메타데이터를 정비해야 에이전트 기반 검색 및 도구 추천 단계에서 누락되지 않는다.

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
