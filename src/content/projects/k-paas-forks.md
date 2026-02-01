---
title: "K-PaaS Portal Multi-Arch"
description: "K-PaaS 컨테이너 플랫폼 Portal 멀티아키텍처 빌드 지원"
github: "https://github.com/dasomel-k-pass"
tags: ["K-PaaS", "Kubernetes", "Multi-Arch", "ARM64"]
order: 5
type: "fork"
---

## 프로젝트 소개

[K-PaaS Container Platform](https://github.com/k-paas)의 Portal 컴포넌트들을 fork하여 **멀티아키텍처(AMD64/ARM64) 빌드**를 지원하도록 수정한 프로젝트입니다.

## Fork 컴포넌트

### Portal
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

## 주요 수정 사항

### 멀티 아키텍처 빌드
- **AMD64/ARM64 동시 빌드**: Docker buildx를 활용한 멀티플랫폼 이미지 생성
- **통합 매니페스트**: 단일 이미지 태그로 여러 아키텍처 자동 선택
- **ARM64 최적화**: Apple Silicon, AWS Graviton 환경 지원

### GitHub Actions 자동화
- 자동 빌드 및 배포 파이프라인
- 이미지 레지스트리: GitHub Container Registry (ghcr.io)

## 참고 링크

- **Fork Organization**: [dasomel-k-pass](https://github.com/dasomel-k-pass)
- **원본 저장소**: [K-PaaS](https://github.com/k-paas)
