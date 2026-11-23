---
title: "AI 에이전트와 함께한 Kubernetes 플랫폼 엔지니어링의 수직 계열화"
event: "AWSKRUG 커넥트 소모임 세션 4"
date: 2026-11-26
slides: "https://cne.io.kr/slides/k8s-platform-vertical-awskrug/#1"
tags: ["Kubernetes", "Platform Engineering", "AI Agent", "Open Source", "AWS", "Evidence"]
---

## 주제: 클러스터 구축부터 운영 도구, 개발자 경험, 검증 체계까지

AWS의 관리형 서비스가 플랫폼의 각 영역을 채워 주더라도, 영역 사이의 이음새와 업그레이드 검증은 사용자에게 남습니다. 온프레미스, air-gap, 데이터 주권 요구가 붙으면 그 영역을 직접 맡게 됩니다. 그런 상황을 전제로 AI 에이전트 팀과 함께 Kubernetes 플랫폼의 주요 영역을 오픈소스로 구현하고 연결해 온 경험을 Day-0/1/2 프레임으로 정리해 발표합니다. 발표는 2026년 11월 26일(목) 19:00, 스파크플러스 강남4호점에서 진행할 예정입니다. 슬라이드는 한국어입니다.

## 구성

- **AWS 관점과 Day-0/1/2 프레임**: 플랫폼의 일곱 영역과 AWS 대응물, 이음새, 수직 계열화 지도
- **프로젝트별 역할**: Kube-Ready-Box(Day-0), Narwhal(Day-0~2), NFS Quota Agent, Narwhal Portal, ClusterDeck(Day-2)
- **최근 릴리스**: Narwhal v1.4.0 · v1.5.0(사고가 설계를 바꾼 사례, 아직 남은 한계), Kube-Ready-Box의 보안 재빌드와 배포 채널 이전, NFS Quota Agent v0.6.0의 검증 확대
- **전 구간 검증**: OpenForge의 증거 등급과 포트폴리오 지표, 외부 개발자와 오간 논의
- **AI 에이전트 팀 운영**: 일하는 방식, 실패 사례, 교훈

## 핵심 메시지

- 개별 프로젝트를 이음새로 이으면 하나의 플랫폼 생명주기가 되고, 장애는 회귀 검증으로 남긴다.
- 낮은 증거 등급은 더 강한 런타임 성질을 주장하지 못하며, 완료 주장은 증거가 아니다.
- 이 프로젝트들을 AWS나 EKS에서 검증했다는 발표는 아니며, 외부 논의는 대부분 아직 열려 있다.

## 관련 자료

- [10월 28일 밋업 발표 내용 정리: AI 에이전트와 Kubernetes 플랫폼 수직 계열화](/ko/posts/k8s-platform-vertical-2026/)
- [발표자료 바로 보기](https://cne.io.kr/slides/k8s-platform-vertical-awskrug/#1)
- [OSS 소개](https://cne.io.kr/oss/)
