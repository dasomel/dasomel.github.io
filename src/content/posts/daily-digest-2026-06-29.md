---
title: "📰 데일리 테크 다이제스트 - 2026-06-29"
description: "2026-06-29 Cloud, Kubernetes, AI, DevOps 소식 2건 — 자동 큐레이션 다이제스트."
pubDate: 2026-06-29
tags: ["데일리 다이제스트", "Kubernetes", "Cloud Native", "AI", "DevOps"]
featured: false
draft: false
---
## 🔥 오늘의 주요 소식

### “Bring it to our shop”: Workday’s pitch for keeping AI agents close to your most valuable data

HR·급여 SaaS 플랫폼인 Workday가 가장 민감한 인사·급여 데이터를 외부 AI 시스템으로 내보내는 대신, AI 에이전트를 그 데이터 가까이에서 운영하라고 주장한다 — 기사 제목이 표현한 'bring it to our shop(우리 쪽으로 가져오라)' 전략이다. The New Stack의 Frederic Lardinois가 쓴 이 글에서 Workday CTO Gabe Monroy는 가드레일을 사후에 덧붙이는 것이 아니라 추론 엔진(inference engine) 내부에서 강제해야 한다고 본다. HR·급여 데이터는 '대충 맞는(good enough)' 수준을 용납할 수 없기 때문이라는 논리다. 핵심은 데이터 중력(data gravity)으로, 권위 있는 직원·급여 기록이 이미 존재하는 곳에서 에이전트 작업을 실행해 Workday가 그 에이전트의 거버넌스된 실행 환경이 되려는 것이다. 글은 AI 에이전트, AI 인프라, 그리고 에이전트와 엔터프라이즈 데이터를 잇는 Model Context Protocol(MCP)을 함께 다룬다. Workday는 한동안 AI·에이전트에 투자해 왔으며, 이번 메시지는 모델 성능 자체보다 거버넌스·정확성·신뢰를 강조한다.

> 💡 **왜 중요한가**: 민감한 인사·급여 데이터를 외부 LLM으로 빼내지 않고 데이터가 있는 플랫폼 안에서 에이전트를 돌리며 추론 계층에서 가드레일을 강제하라는 주장은, 데이터 거버넌스·컴플라이언스·데이터 거주성을 중시하는 팀이 '데이터 이동 최소화'를 원칙으로 에이전트 아키텍처를 설계해야 함을 시사한다.

🔗 [원문 보기](https://thenewstack.io/workday-ai-inference-guardrails/) · _The New Stack_

---

## DevOps & 인프라

### [Okta is the first to bring AI agent governance inside FedRAMP boundaries](https://thenewstack.io/okta-ai-agents-fedramp/)

_The New Stack_

Okta가 'Okta for AI Agents — Core'를 FedRAMP·HIPAA 규제 환경에서 정식 출시(GA)하며, AI 에이전트 거버넌스를 이들 컴플라이언스 경계 안으로 들여온 업계 최초 사례라고 밝혔다. 이 제품은 에이전트(비인간) 아이덴티티의 프로비저닝·인증·인가·해지 등 'AI 에이전트 수명주기 관리'를, 정부 기관과 의료 조직이 이미 사람(인간) 아이덴티티 관리에 사용하는 동일한 통제 환경으로 확장한다. 즉 규제 대상 고객은 별도의 검증되지 않은 시스템을 새로 구축하지 않고도, 이미 감사받고 있는 FedRAMP·HIPAA 통제 아래에서 자율 에이전트를 관리할 수 있다. The New Stack의 Darryl K. Taft은 Okta가 이를 에이전트를 최소권한 접근과 감사 대상의 '1급 아이덴티티'로 다루는 이정표로 자리매김한다고 전한다. 이는 에이전트형 AI가 민감한 공공·의료 워크로드로 확산되면서 '머신·에이전트를 위한 아이덴티티'가 부상하는 업계 흐름을 반영한다. 에이전트 거버넌스를 기존 컴플라이언스 경계에 묶음으로써, Okta는 규제 조직이 AI 에이전트를 안전하게 도입하는 문턱을 낮추려 한다.

> 💡 공공·의료처럼 규제가 엄격한 환경에서 에이전트를 사람과 동일한 ID 거버넌스 체계로 관리할 수 있게 되면, 보안·플랫폼 팀은 비인간 아이덴티티의 최소권한·감사·수명주기 통제를 기존 FedRAMP/HIPAA 컴플라이언스 위에서 그대로 확장할 수 있다.

---

_이 다이제스트는 RSS 피드에서 수집한 뒤 AI(Claude)가 요약·정리했습니다. 자세한 내용은 원문 링크를 확인하세요._
