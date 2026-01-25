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

## Fork 컴포넌트

### Portal 관련
- **cp-portal-ui**: 컨테이너 플랫폼 포털 UI
- **cp-portal-api**: 컨테이너 플랫폼 포털 API
- **cp-portal-common-api**: 포털 공통 API

### Migration 관련
- **cp-migration-ui**: 마이그레이션 UI
- **cp-migration-api**: 마이그레이션 API
- **cp-migration-auth-api**: 마이그레이션 인증 API

### 기타 컴포넌트
- **cp-catalog-api**: Helm 차트를 사용한 애플리케이션 설치/관리 API
- **cp-metrics-api**: 메트릭 수집 API
- **cp-remote-api**: 원격 관리 API
- **cp-terraman**: Terraform 기반 인프라 관리
- **cp-chaos-api**: Chaos Engineering API
- **cp-chaos-collector**: Chaos Engineering 모니터링 및 데이터 수집

## 주요 수정 사항

### 멀티 아키텍처 빌드
- **AMD64/ARM64 동시 빌드**: Docker buildx를 활용한 멀티플랫폼 이미지 생성
- **통합 매니페스트**: 단일 이미지 태그로 여러 아키텍처 자동 선택
- **ARM64 최적화**: Apple Silicon, AWS Graviton 환경 지원

### GitHub Actions 자동화
- 자동 빌드 및 배포 파이프라인
- 이미지 레지스트리: GitHub Container Registry (ghcr.io)
- 버전 관리 및 태깅 자동화

## 사용 목적

K-PaaS Container Platform을 다양한 아키텍처 환경에서 실행할 수 있도록 하여:
- Apple Silicon (M1/M2/M3) 기반 개발 환경 지원
- AWS Graviton 등 ARM64 기반 클라우드 인스턴스 활용
- 비용 효율적인 인프라 운영 가능

## 참고 링크

- **Organization**: [dasomel-k-pass](https://github.com/dasomel-k-pass)
- **원본 저장소**: [K-PaaS](https://github.com/k-paas)
