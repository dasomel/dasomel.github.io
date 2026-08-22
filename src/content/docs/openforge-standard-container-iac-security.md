---
title: 컨테이너, K8s 및 IaC 보안 표준
description: 경량 컨테이너 이미지, Non-root 실행, NetworkPolicy 및 IaC 보안.
project: OpenForge
path: openforge/standards/container-iac-security
order: 1029
lastModified: 2026-08-23
---

# 컨테이너, K8s 및 IaC 보안 표준

클라우드 네이티브 워크로드는 컨테이너와 쿠버네티스 인프라 계층에서 철저히 격리되어야 합니다.

## 컨테이너 & 쿠버네티스 보안 베이스라인

- **Multi-stage 빌드**: 불필요한 빌드 도구와 패키지를 배제하여 경량 런타임 이미지를 생성합니다.
- **Non-root 사용자 강제**: 컨테이너 내부에서 `USER 65532` 또는 비루트 사용자로 프로세스를 실행합니다.
- **Read-only 루트 파일시스템**: 컨테이너 루트 파일시스템을 읽기 전용으로 설정하고 임시 쓰기는 `emptyDir`로 제한합니다.
- **NetworkPolicy 격리**: 네임스페이스 간 및 워크로드 간 불필요한 네트워크 트래픽을 기본 차단합니다.
- **PodDisruptionBudget (PDB)**: 노드 점검 중에도 고가용성을 유지할 수 있도록 PDB를 구성합니다.

## 원문 및 권위 소스 (Canonical Source)

- [Container, Kubernetes & IaC Security](https://github.com/dasomel/openforge/blob/main/docs/container-iac-security.md)
