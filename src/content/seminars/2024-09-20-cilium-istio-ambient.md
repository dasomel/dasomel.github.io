---
title: "Cilium과 Istio Ambient 통합전략"
event: "CloudBro"
date: 2024-09-20
slides: "https://github.com/dasomel/seminar"
tags: ["Cilium", "Istio", "Service Mesh", "eBPF", "CloudBro"]
---

## 발표 개요

[CloudBro](https://www.cloudbro.ai) 세미나에서 Cilium CNI와 Istio Ambient Mesh를 함께 활용하여 Kubernetes 네트워크와 서비스 메시를 효과적으로 구성하는 전략을 다룹니다.

## 주요 내용

### Cilium 소개
- eBPF 기반 네트워킹
- 네트워크 정책 및 가시성
- Hubble을 통한 모니터링

### Istio Ambient Mesh
- Sidecar 없는 서비스 메시
- ztunnel과 waypoint proxy
- 기존 Istio 대비 장점

### 통합 전략
- Cilium + Istio Ambient 아키텍처
- 네트워크 정책 계층화
- 성능 벤치마크 결과

## 대상 청중

- Kubernetes 네트워킹에 관심 있는 DevOps 엔지니어
- 서비스 메시 도입을 고려하는 팀
- eBPF 기술에 관심 있는 개발자
