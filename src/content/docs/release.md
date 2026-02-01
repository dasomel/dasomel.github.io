---
title: "Release Note"
description: "K-PaaS Lite 릴리스 노트"
order: 99
lastModified: 2026-02-02
---

## v2.2.0

[GitHub Releases](https://github.com/dasomel/k-paas/releases/tag/v2.2.0)

**릴리스 일자**: 2026년 1월 31일

### K-PaaS v1.7.0 지원

### 주요 변경사항

#### ARM64 지원
- `ghcr.io/dasomel-k-pass` ARM64 Portal 이미지 지원
  - cp-portal-ui, cp-portal-api, cp-catalog-api, cp-metrics-api 등 전체 컴포넌트
- `ghcr.io/dasomel/goharbor` ARM64 Harbor 이미지 지원
  - registry-photon, harbor-registryctl 이미지 hotfix 자동 적용

#### Kakao Cloud 배포
- `terraform-layered/` 3-Layer 구조 추가 (Network → LoadBalancer → Cluster)
- 고정 IP 기반 LB Target 설정
- `deploy.sh` 통합 배포 스크립트
- CoreDNS custom hosts 설정 자동화

#### 인프라 자동화
- Init container 방식 SSL 인증서 주입 (이미지 재빌드 불필요)
- Keycloak Bitnami Helm chart 배포 자동화
- OpenBao unseal key 자동 관리

#### 표준프레임워크 샘플
- egovframe-web-sample 멀티 아키텍처 빌드 지원 (amd64/arm64)
- 컨테이너 이미지 서명 (cosign) 지원
- SBOM (SPDX) 생성 지원

### 버전 호환성

| 설치 도구 | K-PaaS CP | Kubernetes | Ubuntu | 아키텍처 |
|----------|-----------|------------|--------|----------|
| 2.2.0 | v1.7.0 | v1.33.5 | 24.04 | amd64, arm64 |

## v2.1.0

[GitHub Releases](https://github.com/dasomel/k-paas/releases/tag/v2.1.0)

**릴리스 일자**: 2025년 12월 1일

- Support for K-PaaS v1.6.2
- ARM 기반 CPU 지원 개선
- 설치 프로세스 자동화 강화
- 문제 해결 가이드 개선

## v2.0.0

[GitHub Releases](https://github.com/dasomel/k-paas/releases/tag/v2.0.0)

**릴리스 일자**: 2025년 9월 9일

- ARM 기반 CPU 지원 (Apple Silicon)
- Vagrant + VirtualBox 기반 설치
- Kubespray를 활용한 Kubernetes 배포
- Ansible 기반 인프라 자동화

## v1.0.1

[GitHub Releases](https://github.com/dasomel/k-paas/releases/tag/v1.0.1)

**릴리스 일자**: 2025년 6월 9일

- 버그 수정 및 안정성 개선

## v1.0.0

[GitHub Releases](https://github.com/dasomel/k-paas/releases/tag/v1.0.0)

**릴리스 일자**: 2024년 7월 3일

- Support for K-PaaS v1.5.1
- All-in-one installation version
- Multi-master node support
- 경량화 된 shell script 제공
- 원 소스(K-PaaS)를 직접 수정 없어 의존성이 낮음
