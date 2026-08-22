---
title: 템플릿 카탈로그
description: OpenForge 저장소에서 제공하는 즉시 활용 가능한 재사용 구현 템플릿 카탈로그.
project: OpenForge
path: openforge/templates
order: 1004
lastModified: 2026-08-23
---

# 템플릿 카탈로그 (Templates)

템플릿은 실무에서 검증된 안전하고 보수적인 구현 출발점입니다. 대상 프로젝트의 환경, 권한, 이미지 레지스트리 및 도메인에 맞춰 파라미터를 조정한 뒤 배포합니다.

## 디렉토리 구조

```text
templates/
├── github/          # Issue / PR Templates, CODEOWNERS
├── workflows/       # CI, Release, SBOM, Supply Chain 검증 워크플로
├── scripts/         # Toolchain 검증, Lockfile 검사, 헬퍼 스크립트
├── policy/          # 의존성 정책, 플러그인 Intake 정책, 보안 예외 양식
├── container/       # 경량 Multi-stage Dockerfile 베이스라인
├── kubernetes/      # Deployment, Service, Ingress, NetworkPolicy, PDB, Kustomize
├── gitops/          # Argo CD App-of-Apps 및 GitOps 배포 패턴
├── identity/        # OIDC / Keycloak / OAuth2 통합 규격
├── observability/   # /healthz, /readyz, Prometheus 메트릭, OpenTelemetry 규격
├── backup/          # 백업 및 복구 검증 Runbook
├── offline/         # Air-gap 번들 매니페스트 및 신뢰 플러그인 카탈로그
└── design/          # README 디자인, 아키텍처 다이어그램 템플릿, 상태 배지
```

---

## 주요 템플릿 카테고리

### 1. GitHub & Workflow 템플릿 (`templates/github/`, `templates/workflows/`)
- **Issue Templates**: 버그 리포트, 기능 제안, 아키텍처 토론 템플릿
- **PR Template**: 변경 내용, 테스트 증거, 체크리스트 표준 서식
- **CI Workflow**: 린트, 테스트, 빌드, 보안 검사를 단일 파이프라인으로 자동화
- **Release Workflow**: Git 태그 기반 자동 빌드, CHANGELOG 추출, SBOM 생성 및 GitHub Release 발행

### 2. 컨테이너 & 쿠버네티스 템플릿 (`templates/container/`, `templates/kubernetes/`)
- **Multi-stage Dockerfile**: 빌드 도구와 런타임을 분리하여 이미지 크기를 최소화하고 취약점 노출 표면 축소
- **K8s Manifests**: `Deployment`, `Service`, `Ingress`, `NetworkPolicy`, `PodDisruptionBudget` 표준 매니페스트
- **Kustomize / Argo CD**: 환경별 설정 분리 및 GitOps 선언적 배포 구성

### 3. 보안 & 거버넌스 템플릿 (`templates/policy/`, `templates/identity/`)
- **Dependency Policy**: 패키지 매니저 라이선스 및 취약점 허용 기준
- **OIDC Configuration**: 클라우드 제공업체 및 Keycloak 연동 규격
- **Security Exception Waiver**: 시한부 보안 예외 신청 및 승인 서식

> **템플릿 적용 원칙**: 템플릿은 범용 만능 설정이 아닙니다. 버전 고정, 권한 최소화, 시크릿 분리를 프로젝트 환경에 맞게 반드시 커스터마이징해야 합니다.
