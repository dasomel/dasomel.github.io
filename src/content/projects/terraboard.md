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
- AWS S3 (상태) + DynamoDB (잠금)
- S3 호환 백엔드 (예: MinIO)
- Google Cloud Storage
- Terraform Cloud (remote)
- GitLab

여러 버킷/프로바이더를 동시에 구성할 수 있으며, 내부 데이터셋 저장을 위해 PostgreSQL 데이터베이스가 필요합니다.

## Fork에서 추가한 점

이 fork는 컨테이너 빌드 및 릴리스 파이프라인을 현대화했습니다.

- **멀티 아키텍처 이미지**: amd64/arm64 Docker 이미지를 GHCR로 발행
- **공급망 보안**: SBOM 생성, SLSA provenance attestation, Cosign 키리스 서명 및 검증
- **최신 툴체인**: Go 1.23 적용, Terraform 1.13.5 내부 패키지로 업그레이드(hashicorp/terraform 의존성 제거)
- **자동 릴리스**: GitHub Release 자동 생성 및 OCI 레이블/어노테이션 정비
- 최신 버전: v2.5.1

## 아키텍처

<Mermaid chart={`graph LR
  A["🖥️ Browser<br/>(AngularJS)"] -->|HTTP| B["⚙️ Terraboard<br/>(Go API)"]
  B -->|Query| C["☁️ Backend<br/>(S3 / GCS / TC)"]
  B -->|Read/Write| D["🗄️ PostgreSQL"]
  style A fill:#f0fdf4,stroke:#059669,color:#111
  style B fill:#f0fdf4,stroke:#059669,color:#111
  style C fill:#f9fafb,stroke:#d1d5db,color:#111
  style D fill:#f9fafb,stroke:#d1d5db,color:#111
`} />

## 참고 링크

- **원본 저장소**: [camptocamp/terraboard](https://github.com/camptocamp/terraboard)
- **공식 문서**: [Terraboard Documentation](https://github.com/camptocamp/terraboard#readme)
