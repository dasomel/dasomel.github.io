---
title: "AI Agent 시대와 인간 개발자의 역할"
event: "숭실대학교 소프트웨어특강2"
date: 2026-10-14
slides: "https://cne.io.kr/slides/ai-agent-human-developer/#1"
tags: ["AI Agent", "Harness Engineering", "Evidence", "University"]
---

## 주제: 에이전트에게 맡길 것, 사람이 쥘 것 — 내 장애 기록으로 보는

표지의 한 줄 `PASS T03 all ArgoCD apps Synced+Healthy`는 통과였지만 실제로는 ArgoCD 앱이 0개였습니다. 이런 조용한 실패 사례를 따라가며 AI Agent 시대에 개발자의 일이 어디로 옮겨가는지 이야기했습니다.

## 학습목표

- AI 에이전트의 동작 원리(도구 선택·호출, 컨텍스트·하네스, 멀티 에이전트)를 설명할 수 있다.
- 에이전트 개발 환경(모델·컨텍스트·하네스)을 구성 수준에서 설명할 수 있다.
- 에이전트가 조용히 틀리는 방식을 알고, "완료" 보고를 증거로 검증할 수 있다.
- 인간과 AI의 역할 분담(맡길 것/쥘 것, 책임과 예방)을 설명하고 자기 프로젝트에 적용할 수 있다.

## 구성

- **나의 AI 여정**: ChatGPT에서 Claude Code, Antigravity CLI, Codex CLI까지 쓰는 방식이 바뀐 과정
- **에이전트란 무엇인가**: 챗봇과의 차이, 모델, 컨텍스트와 하네스, Ralph 루프, 허브앤스포크 멀티 에이전트
- **에이전트가 조용히 틀리는 방식**: 사례 1~4와 피드백 구조(장애 → 교훈 → 판별 기준 → 회귀 테스트)
- **인간과 AI의 역할 분담**: 오픈소스 기여 사례, 맡길 것과 쥘 것, 책임과 예방

## 핵심 메시지

- 책임은 승인하는 사람이 지고, 재발은 장치가 막는다.
- "전부 정상" 검사에는 개수의 하한을, 조용한 SKIP은 FAIL로, 완료 보고에는 실행 증거를 요구한다.
- 사례는 제 기록에서 골라낸 것이라 AI의 일반 특성으로 일반화하지 않는다.

## 관련 자료

- [숭실대 특강 후기: AI Agent 시대, 사람은 무엇을 쥐어야 하나](/ko/posts/soongsil-ai-agent-human-developer-2026/)
- [발표자료 바로 보기](https://cne.io.kr/slides/ai-agent-human-developer/#1)
- [CI가 FAIL을 출력하고도 성공으로 보고할 수 있다](/ko/posts/echo-branch-false-green-detector/)
