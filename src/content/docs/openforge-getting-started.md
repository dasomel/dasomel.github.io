---
title: Getting Started
description: 기존 OSS에 OpenForge를 단계적으로 적용하는 방법.
project: OpenForge
path: openforge/getting-started
order: 1002
lastModified: 2026-08-21
---

# Getting Started

가장 작은 유효 기준선부터 적용하고, 실제 evidence를 확인하면서 범위를 넓힙니다.

## 1. Inventory

먼저 다음을 확인합니다.

- repository structure와 documentation
- language/runtime/toolchain
- package manager와 lockfile
- CI/CD workflow
- container와 deployment asset
- identity, observability, backup, offline 요구사항

## 2. Repository Template 적용

GitHub, PR, security-sensitive path, toolchain verification, CI template부터 시작합니다.

## 3. Build / Release 적용

Dependency policy, SBOM, immutable workflow action, release verification, rollback evidence를 추가합니다.

## 4. Deployment Baseline 적용

필요한 계층만 선택합니다. Docker, Kubernetes/Kustomize, GitOps, OIDC/SSO, observability, backup/restore, offline bundle을 프로젝트 상황에 맞게 적용합니다.

## 5. Deviation 기록

Template은 universal drop-in configuration이 아닙니다. 특히 security boundary나 운영 방식이 달라지는 예외는 문서화합니다.

## 6. Evidence 연결

프로젝트 README에서 cne.io.kr 문서로 연결하고, 문서에서는 정확한 OpenForge template과 실제 repository 구현을 역링크합니다.
