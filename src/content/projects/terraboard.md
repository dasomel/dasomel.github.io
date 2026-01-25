---
title: "Terraboard"
description: "Terraform 상태를 시각화하고 쿼리할 수 있는 웹 대시보드 (Fork)"
github: "https://github.com/dasomel/terraboard"
tags: ["Terraform", "IaC", "Dashboard", "DevOps"]
order: 4
type: "fork"
---

## 프로젝트 소개

Terraboard는 Terraform 상태 파일을 시각화하고 탐색할 수 있는 웹 기반 대시보드입니다.

[Camptocamp/terraboard](https://github.com/camptocamp/terraboard)를 fork한 저장소입니다.

## 주요 기능

### 상태 시각화
- **리소스 트리 뷰**: Terraform 상태의 모든 리소스를 계층 구조로 표시
- **상태 히스토리**: 시간에 따른 상태 변경 이력 추적
- **버전 비교**: 서로 다른 상태 버전 간의 차이점 비교

### 검색 및 필터링
- **전체 텍스트 검색**: 리소스 이름, 속성 값으로 검색
- **리소스 타입 필터**: 특정 리소스 타입만 필터링
- **모듈별 그룹화**: 모듈 단위로 리소스 그룹화

### 백엔드 지원
- AWS S3
- Google Cloud Storage
- Azure Blob Storage
- Terraform Cloud/Enterprise

## 아키텍처

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│  Terraboard │────▶│   Backend   │
│   (Vue.js)  │     │   (Go API)  │     │ (S3/GCS/TC) │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  PostgreSQL │
                    └─────────────┘
```

## 참고 링크

- **원본 저장소**: [camptocamp/terraboard](https://github.com/camptocamp/terraboard)
- **공식 문서**: [Terraboard Documentation](https://github.com/camptocamp/terraboard#readme)
