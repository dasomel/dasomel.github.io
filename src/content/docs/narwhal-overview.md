---
title: 플랫폼 개요
description: Narwhal IDP의 아키텍처 철학, 3계층 통합 모델 및 35개 컴포넌트 현황.
project: Narwhal
path: narwhal/overview
order: 1100
lastModified: 2026-08-27
---

# 플랫폼 개요

**Narwhal**은 Kubernetes v1.35 기반 위에서 GitOps, IAM/SSO, Service Mesh, Observability, Artifact Registry, Storage, Backup, Policy, API Gateway 및 관리 포털을 단일 단위로 통합한 오픈소스 **Internal Developer Platform (IDP)**입니다.

## 핵심 엔지니어링 철학

1. **플랫폼 통합이 제품이다 (Integration as a Product)**: 단순히 Kubernetes 위에 도구들을 개별 설치하는 것이 아니라, 컴포넌트 간의 결합 경계(Integration Seams)에서 발생하는 TLS, DNS, OIDC 인증, 네트워크 라우팅 충돌을 사전에 해결하여 제공합니다.
2. **지식의 테스트화 (Knowledge Codification)**: 플랫폼을 운영하며 겪은 263건의 인시던트 교훈을 `lessons-log.md`에 기록하고, 51개의 자동화된 CI 회귀 테스트로 연결하여 동일 장애의 재발을 원천 차단합니다.
3. **환경 무관한 재현성 (Environment-Agnostic)**: 로컬 개발 환경(Vagrant + Kube-Ready-Box), 퍼블릭 클라우드(Kakao Cloud AMD64), 인터넷 연결이 차단된 에어갭(Air-Gap) 폐쇄망 환경 어디서나 동일한 아키텍처로 구동됩니다.

## 3계층 아키텍처 모델

<Mermaid chart={`flowchart TB
  L3["L3 · Management & Developer Experience\nNarwhal Portal · Self-Service Workbenches · Release Tracking"]
  L2["L2 · Platform Services & Governance\nArgo CD + Gitea · Keycloak + APISIX · Prometheus/Grafana/Loki/Tempo · NFS/SeaweedFS · OpenBao/Kyverno"]
  L1["L1 · Infrastructure & Core Networking\nKubernetes v1.35 HA · kube-vip · Cilium · Istio Ambient · Kube-Ready-Box"]
  L3 -->|"platform APIs / identity / telemetry"| L2
  L2 -->|"cluster services / policy / storage / networking"| L1`} />

이 모델은 단순 기술 스택 목록이 아니라 **사용자 경험 → 플랫폼 서비스 → 인프라 기반**으로 책임 경계를 분리합니다. 상위 계층은 하위 계층의 세부 구현을 직접 노출하기보다 안정적인 플랫폼 계약을 소비합니다.

## 주요 스펙 및 베이스라인

- **Kubernetes**: v1.35 HA Control Plane (etcd 3-node quorum)
- **노드 리소스**: 기본 3 Master (2 vCPU, 4GB RAM) + 3 Worker (4 vCPU, 8GB RAM)
- **네트워크 대역**: Node (`192.168.56.0/24`), Pod (`10.244.0.0/16`), Service (`10.96.0.0/12`), LoadBalancer (`192.168.56.200~220`)
- **DNS 규격**: `*.local.narwhal.internal` (dnsmasq 내장 확인)
