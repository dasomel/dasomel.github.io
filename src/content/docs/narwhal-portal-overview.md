---
title: 포털 개요
description: Narwhal IDP 통합 관리 포털의 아키텍처 철학, 사용자 경험 및 기능 범위.
project: Narwhal Portal
path: narwhal-portal/overview
order: 1200
lastModified: 2026-08-23
---

# 포털 개요

**Narwhal Portal**은 Narwhal Kubernetes IDP의 모든 리소스와 개발자 워크플로를 통합 제어하는 현대적인 단일 관리 포털입니다.

## 핵심 가치

1. **단일 관제 창구 (Single Pane of Glass)**: 35개 컴포넌트(ArgoCD, Keycloak, Grafana, SeaweedFS 등)의 개별 대시보드를 찾아다닐 필요 없이 중앙에서 플랫폼 상태를 파악할 수 있습니다.
2. **Next.js 16 & React 19 아키텍처**: Server Components를 활용하여 초기 로딩 성능을 극대화하고 클라이언트 상호작용을 매끄럽게 처리합니다.
3. **타입 안전한 gRPC 통신**: 클러스터 백엔드 서비스와 Protocol Buffers 기반의 gRPC-web으로 통신하여 데이터 무결성과 초저지연 응답성을 확보합니다.

## 주요 기능 모듈

- **플랫폼 상태 모니터링**: 클러스터 노드 리소스 사용률, etcd 쿼럼, 인그레스 트래픽 실시간 시각화
- **GitOps 배포 파이프라인 관리**: Argo CD 애플리케이션 목록 및 동기화 상태 조회, 원클릭 동기화 트리거
- **IAM 및 사용자 권한 워크벤치**: Keycloak OIDC 토큰 세션 기반의 역할별(Admin / Developer) 기능 분리
- **릴리스 카탈로그 및 런북 탐색**: 플랫폼 릴리스 이력 및 표준 엔지니어링 런북 조회
