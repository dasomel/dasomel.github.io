---
title: 시작하기
description: 신규 또는 기존 OSS 프로젝트에 OpenForge 엔지니어링 표준과 템플릿을 단계적으로 적용하는 방법.
project: OpenForge
path: openforge/getting-started
order: 1002
lastModified: 2026-08-23
---

# 시작하기 (Getting Started)

OpenForge는 모든 기준을 한 번에 강제하지 않고, 가장 작은 유효 기준선부터 단계적으로 적용하며 검증하는 점진적 접근법을 권장합니다.

## 4단계 점진적 적용 로드맵

```text
[1단계] 저장소 진단 (Inventory)
      ↓
[2단계] 기본 구조 및 GitHub 템플릿 배치 (Bootstrap)
      ↓
[3단계] CI 툴체인 및 품질 게이트 구축 (Quality Gate)
      ↓
[4단계] 보안 거버넌스 및 성숙도 측정 (Governance & Metrics)
```

---

## 단계별 실행 가이드

### 1단계: 저장소 인벤토리 진단 (Inventory)

대상 프로젝트의 현재 상태를 점검합니다.

- 저장소 디렉토리 레이아웃 및 필수 문서(`LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`)
- 프로그래밍 언어, 런타임 버전, 패키지 매니저 및 Lockfile 고정 여부
- GitHub Issue/PR 템플릿 및 브랜치 보호 규칙
- CI/CD 파이프라인(빌드, 테스트, 린트) 및 컨테이너 빌드 설정

### 2단계: 저장소 템플릿 적용 (Bootstrap)

OpenForge의 공통 템플릿을 저장소에 복사합니다.

```bash
# 1. OpenForge 저장소 클론
git clone https://github.com/dasomel/openforge.git

# 2. GitHub Issue / PR 템플릿 복사
cp -r openforge/templates/github/ .github/

# 3. 영/한 README 템플릿 배치
cp openforge/templates/design/README-template.md README.md
cp openforge/templates/design/README-template-ko.md README-ko.md
```

### 3단계: CI 툴체인 및 자동화 파이프라인 구성 (Quality Gate)

언어별 린터 및 CI 워크플로를 배치하고 로컬 자동화 태스크를 설정합니다.

```bash
# CI 워크플로 복사
cp openforge/templates/workflows/ci.yml .github/workflows/ci.yml
```

- **Go**: `gofumpt`, `staticcheck`, `golangci-lint`
- **TypeScript/Node**: `eslint`, `prettier`, `typescript`
- **Python**: `ruff`, `mypy`, `pytest`

### 4단계: 보안 거버넌스 및 성숙도 평가 (Metrics)

- Dependabot 설정 및 시크릿 스캔 활성화
- 컨테이너 Multi-stage 및 Non-root 사용자 적용
- [Reference Implementation Metrics](/oss/openforge/reference/metrics)에 따라 성숙도 점수 측정 및 미비점 보완
