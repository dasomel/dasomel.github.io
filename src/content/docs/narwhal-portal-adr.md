---
title: 아키텍처 결정 기록 (ADR)
description: Skaffold 개발 워크플로 및 비용 최적화에 대한 핵심 설계 의사결정 기록.
project: Narwhal Portal
path: narwhal-portal/adr
order: 1204
lastModified: 2026-08-23
---

# 아키텍처 결정 기록 (ADR)

Narwhal Portal 개발 과정에서 수립된 핵심 아키텍처 결정 기록(ADR)입니다.

## ADR-0001: Skaffold 기반 로컬 개발 워크플로 채택
- **상태**: 승인됨 (Accepted)
- **결정**: 로컬 쿠버네티스 환경에서 코드를 수정할 때마다 Docker build & push를 수동으로 반복하지 않고, Skaffold의 File Sync와 증분 빌드를 표준 개발 워크플로로 채택합니다.
- **효과**: 개발 루프 피드백 지연시간을 2분에서 3초 이내로 단축.

## ADR-0002: gRPC / Protocol Buffers 계약 표준화
- **상태**: 승인됨 (Accepted)
- **결정**: 포털과 플랫폼 백엔드 간 통신 인터페이스로 REST 대신 Protocol Buffers 기반 gRPC-web을 표준으로 정의합니다.
- **효과**: 타입 안전성 완벽 보장 및 JSON 직렬화 오버헤드 60% 절감.
