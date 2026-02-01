---
title: "K-PaaS Container Platform"
description: "K-PaaS 컨테이너 플랫폼 멀티아키텍처 빌드 지원 (13개 컴포넌트 Fork)"
github: "https://github.com/dasomel-k-pass"
tags: ["K-PaaS", "Kubernetes", "Multi-Arch", "Platform"]
order: 5
type: "fork"
---

## 프로젝트 소개

[K-PaaS Container Platform](https://github.com/k-paas)의 주요 컴포넌트들을 fork하여 **멀티아키텍처(AMD64/ARM64) 빌드**를 지원하도록 수정한 프로젝트입니다.

## K-PaaS Lite 설치 도구

[K-PaaS Lite](https://github.com/dasomel/k-paas)는 Vagrant 기반의 경량 K-PaaS 설치 도구입니다.

### 주요 기능
- **완전 자동화 배포**: Vagrant 기반 원클릭 설치 (VirtualBox, VMware 지원)
- **ARM64 지원**: Apple Silicon 환경에서 VMware Fusion으로 실행 가능
- **클라우드 배포**: Kakao Cloud Terraform 3-Layer 배포 지원

### 버전 호환성

| 설치 도구 | K-PaaS CP | Kubernetes | Ubuntu | 아키텍처 |
|----------|-----------|------------|--------|----------|
| 2.2.0 | v1.7.0 | v1.33.5 | 24.04 | amd64, arm64 |

### 설치 방법

```bash
# Vagrant (로컬)
vagrant up --provider=vmware_desktop

# Kakao Cloud (Terraform)
cd csp/kakao-cloud/terraform-layered
./deploy.sh
```

## Fork 컴포넌트

### Portal 관련
- **cp-portal-ui**: 컨테이너 플랫폼 포털 UI
- **cp-portal-api**: 컨테이너 플랫폼 포털 API
- **cp-portal-common-api**: 포털 공통 API
- **cp-catalog-api**: Helm 차트를 사용한 애플리케이션 설치/관리 API
- **cp-metrics-api**: 메트릭 수집 API

### Chaos Engineering
- **cp-chaos-api**: Chaos Engineering API
- **cp-chaos-collector**: Chaos Engineering 모니터링 및 데이터 수집

### 인프라 관리
- **cp-terraman**: Terraform 기반 인프라 관리
- **cp-remote-api**: 원격 관리 API

### Migration 관련
- **cp-migration-ui**: 마이그레이션 UI
- **cp-migration-api**: 마이그레이션 API
- **cp-migration-auth-api**: 마이그레이션 인증 API

## 주요 수정 사항

### 멀티 아키텍처 빌드
- **AMD64/ARM64 동시 빌드**: Docker buildx를 활용한 멀티플랫폼 이미지 생성
- **통합 매니페스트**: 단일 이미지 태그로 여러 아키텍처 자동 선택
- **ARM64 최적화**: Apple Silicon, AWS Graviton 환경 지원

### 소프트웨어 공급망 보안
- **Cosign 서명**: 컨테이너 이미지 서명 지원
- **SBOM (SPDX)**: 소프트웨어 구성요소 목록 생성

### 표준프레임워크 샘플
- **egovframe-web-sample**: 멀티 아키텍처 빌드 지원 (amd64/arm64)

## 참고 링크

- **K-PaaS Lite**: [dasomel/k-paas](https://github.com/dasomel/k-paas)
- **Fork Organization**: [dasomel-k-pass](https://github.com/dasomel-k-pass)
- **원본 저장소**: [K-PaaS](https://github.com/k-paas)
