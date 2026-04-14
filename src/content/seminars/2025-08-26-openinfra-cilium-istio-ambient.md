---
title: "Cilium과 Istio Ambient 통합전략"
event: "OpenInfra Days Korea 2025"
date: 2025-08-26
slides: ""
tags: ["Cilium", "Istio", "ServiceMesh", "eBPF"]
---

## 발표 개요

OpenInfra Days Korea 2025에서 eBPF 기반의 Cilium과 사이드카 없는 Istio Ambient 모드를 컨테이너 기반 테스트 환경에 통합하는 최신 전략을 발표합니다.

## 주요 내용

### 서비스 메시의 필요성

클라우드 네이티브 인프라의 복잡성과 확장성이 점차 중요해지는 환경에서, 서비스 메시 아키텍처는 마이크로서비스 간 안전하고 가시성 높은 네트워킹을 제공하는 핵심으로 자리매김하고 있습니다.

### Cilium 소개
- eBPF 기반 고성능 네트워크 정책
- 뛰어난 관찰성(Observability) 제공
- Hubble을 통한 실시간 네트워크 모니터링

### Istio Ambient 모드
- 사이드카 없는 경량 메시 아키텍처
- ztunnel 기반 L4 트래픽 처리
- Waypoint Proxy를 통한 L7 정책 적용
- 기존 Sidecar 모드 대비 리소스 절감

### Cilium + Istio Ambient 통합 전략
- 컨테이너 기반 테스트 환경 구성
- 두 기술의 역할 분담 및 상호 보완
- 네트워크 정책 계층화 전략
- 통합 시 주의사항 및 트러블슈팅

## 대상 청중

- Kubernetes 네트워킹 심화 과정에 관심 있는 엔지니어
- 서비스 메시 도입을 검토 중인 팀
- eBPF와 클라우드 네이티브 기술에 관심 있는 개발자
