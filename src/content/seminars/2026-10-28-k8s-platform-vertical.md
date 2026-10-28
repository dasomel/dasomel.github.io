---
title: "AI 에이전트와 함께한 Kubernetes 플랫폼 엔지니어링의 수직 계열화"
event: "Kubernetes Korea Group 밋업 세션 2"
date: 2026-10-28
slides: "https://cne.io.kr/slides/k8s-platform-vertical/#1"
tags: ["Kubernetes", "Platform Engineering", "AI Agent", "Open Source", "Evidence"]
---

## 주제: 클러스터 구축부터 운영 도구, 개발자 경험, 검증 체계까지

Kubernetes 플랫폼에는 설치 말고도 필요한 영역이 많고, 영역 사이의 이음새에서 장애가 반복됩니다. AI 에이전트 팀과 함께 그 영역을 오픈소스로 구현하고 연결해 온 경험을 Day-0/1/2 프레임으로 정리해 발표합니다. 발표는 2026년 10월 28일(수) 19:00에 진행합니다.

## 구성

- **문제와 Day-0/1/2 프레임**: 플랫폼에 필요한 일곱 영역, 수직 계열화 지도
- **프로젝트별 역할**: Kube-Ready-Box(Day-0), Narwhal(Day-0~2), NFS Quota Agent, Narwhal Portal, ClusterDeck(Day-2), 관련 프로젝트 KubeMetal
- **전 구간 검증**: OpenForge의 증거 등급과 KPI, 외부 개발자와 오간 논의
- **AI 에이전트 팀 운영**: 일하는 방식, 하루 흐름, 실패 사례, 교훈

## 핵심 메시지

- 개별 프로젝트를 이음새로 이으면 하나의 플랫폼 생명주기가 되고, 장애는 회귀 검증으로 남긴다.
- 낮은 증거 등급은 더 강한 런타임 성질을 주장하지 못하며, 완료 주장은 증거가 아니다.
- 외부 논의는 대부분 아직 열려 있고, 채택이나 협업이 확정된 것은 아니다.

## 관련 자료

- [발표 내용 정리: AI 에이전트와 Kubernetes 플랫폼 수직 계열화](/ko/posts/k8s-platform-vertical-2026/)
- [발표자료 바로 보기](https://cne.io.kr/slides/k8s-platform-vertical/#1)
- [OSS 소개](https://cne.io.kr/oss/)
