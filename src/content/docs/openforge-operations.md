---
title: Operations
description: OpenForge 프로젝트의 배포 이후 운영 문서 기준.
project: OpenForge
path: openforge/operations
order: 1006
lastModified: 2026-08-21
---

# Operations

OpenForge 기반 프로젝트는 설치 방법뿐 아니라 배포 이후 lifecycle까지 문서화합니다.

## 최소 운영 항목

- health / readiness
- metrics / traces / structured logs
- configuration / secret boundary
- upgrade / rollback
- backup / restore validation
- offline / air-gap behavior
- incident response

## Evidence

운영 문서는 실제 manifest, workflow, runbook, validation command를 연결해야 합니다. “backup 지원”만 적고 restore evidence가 없다면 운영 기준을 충족한 것으로 보지 않습니다.

## Release Lifecycle

```text
Release
 → verify
 → deploy/canary
 → observe
 → promote
 → evidence 기록
 → last-known-good 유지
```
