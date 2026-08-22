---
title: "OpenForge"
description: "오픈소스 프로젝트를 일관된 품질과 구조로 만들고 운영하기 위한 Blueprint, Engineering Standards 및 Reusable Templates"
github: "https://github.com/dasomel/openforge"
tags: ["Open Source", "Engineering Standards", "GitHub", "CI/CD", "Security", "Supply Chain", "AI", "Developer Tools", "Kubernetes", "Templates"]
order: 2
type: "own"
featured: true
problem: "새로운 OSS 프로젝트를 시작할 때마다 Repository 구조, 문서, GitHub 워크플로, CI/CD, Supply Chain 보안, AI 개발 안전성, 변경 영향 분석, 릴리스 거버넌스 기준을 매번 처음부터 구성해야 함"
solution: "실제 OSS 개발 및 운영 경험을 기반으로 표준화된 Blueprint, 29개 세부 Engineering Standards, 15개 영역의 Reusable Implementation Templates, Maturity Scorecard를 제공하여 일관되고 검증 가능한 엔지니어링 토대 구축"
---

## 프로젝트 소개

**OpenForge**는 고품질 오픈소스 프로젝트를 일관된 엔지니어링 토대 위에서 생성·발전·배포·운영·유지보수하기 위한 공통 **Blueprint + Engineering Standards + Reusable Templates**입니다.

새로운 OSS 프로젝트를 시작할 때마다 반복되는 저장소 구조 설계, 문서화 규칙, CI/CD 파이프라인, 공급망 보안, 릴리스 관리, 거버넌스 체계를 처음부터 다시 만들지 않고 검증된 모범 관행을 즉시 적용할 수 있도록 돕습니다.

특정 언어나 프레임워크를 강제하지 않으며, 프로젝트의 자율성을 존중하면서도 플랫폼 전반의 품질 불변식을 유지하는 **실용적인 엔지니어링 기준선(Practical Baseline)**을 제공합니다.

### 3계층 모델 (Three-Tier Model)

OpenForge는 **정책(Policy)**, **구현(Implementation)**, **증거(Evidence)**를 분리하여 다음과 같은 3계층 구조로 운영됩니다.

| 계층 | 역할 | 산출물 및 예시 |
|---|---|---|
| **[Standards](/oss/openforge/standards)** | 달성해야 할 엔지니어링 결과와 원칙 정의 | Documentation, Supply Chain Security, CI/CD Resilience, AI Security |
| **[Templates](/oss/openforge/templates)** | 즉시 적용 가능한 보수적이고 안전한 시작 자산 제공 | GitHub Workflows, Multi-stage Dockerfile, K8s Manifests, Policy Rules |
| **[Reference Implementation](/oss/openforge/reference)** | 실제 OSS 프로젝트 적용 사례, 트레이드오프 및 실측치 | Narwhal, KubeMetal, nfs-quota-agent, Beluga Manager |

---

## 핵심 원칙 (Core Principles)

OpenForge의 모든 표준과 템플릿은 다음과 같은 핵심 원칙을 기반으로 설계되었습니다.

- **이중 언어 문서 정책**: English를 canonical project language로 사용하고 Korean을 first-class translation으로 제공합니다. 사용자 대상 문서는 `<name>.md`와 `<name>-ko.md` 쌍으로 유지합니다.
- **기본 안전성 및 재현 가능성 (Secure & Reproducible by Default)**: 모든 프로젝트는 기본적으로 재현 가능하고, 문서화되고, 테스트 가능하며, 관측 가능하고, 접근 가능하며 안전해야 합니다.
- **투명한 변경 관리 및 ADR**: GitHub Issue와 Pull Request를 기본 변경 관리 단위로 사용하며, 중요한 아키텍처 결정은 [ADR (Architecture Decision Records)](/oss/openforge/adr)에 기록합니다.
- **CI 선행 검증 (Quality Gating)**: 모든 변경사항은 병합(Merge) 전에 CI에서 빌드, 테스트, 린트, 보안 검사를 통과해야 합니다.
- **공급망 거버넌스 및 맹목적 업데이트 지양**: 단순 호환성만으로 최신 의존성을 즉시 채택하지 않으며, 런타임/툴체인/패키지 변경 시 [Change Management](/oss/openforge/standards/change-management)에 따라 워크플로 전체 영향 분석을 선행합니다.
- **AI 에이전트 및 로컬 지침의 신뢰 경계**: AI 에이전트와 저장소 로컬 지침(`AGENTS.md`, `CLAUDE.md`)은 잠재적으로 신뢰할 수 없는 실행 입력(Untrusted Execution Input)으로 간주하고 [AI Engineering Security](/oss/openforge/standards/ai-engineering-security)에 따라 권한과 샌드박스 경계를 설정합니다.
- **위험 기반 거버넌스 및 CI 복원력**: 1인 메인테이너 프로젝트에서도 과도한 인적 부담 없이 자동화된 제어를 통해 거버넌스를 유지하며, CI 장애가 보안 게이트의 무분별한 우회로 이어지지 않도록 복원력(Resilience)을 설계합니다.
- **의도적 예외의 시한부 관리**: 프로젝트 요구에 따른 예외는 사유, 범위, 만료 시한을 명시적으로 문서화하여 관리합니다.

---

## 프로젝트 생명주기 모델 (Project Lifecycle)

OpenForge는 프로젝트의 시작부터 운영, 장애 학습, 표준 개선으로 이어지는 선순환 생명주기를 가집니다.

```text
Idea
  ↓
Project Definition (목적, 범위, 라이선스 정의)
  ↓
Repository Bootstrap (디렉토리 구조, GitHub Templates)
  ↓
Documentation + Architecture (README 쌍, ADR 체계, 문서 인벤토리)
  ↓
Standards + Template Adoption (CI/CD, Docker, K8s, Security Baseline)
  ↓
Implementation (Language Tooling, Code Intelligence, Makefile)
  ↓
Change Impact / Supply Chain Review (의존성 분석, 핀 고정, Lockfile)
  ↓
CI / Security / Testing (Static Check, Unit/E2E, Container/Code Scan)
  ↓
Release / Publish Verification (SemVer, Changelog, SBOM, 서명 검증)
  ↓
Operations / Observability (Health, Metrics, Logs, Backup Runbook)
  ↓
Maintenance / Incident Learning (Lessons Log, 회귀 테스트화)
  ↓
Lessons / Metrics (Maturity Scorecard 점검)
  ↓
OpenForge Improvement (공통 표준 및 템플릿으로 환류)
```

> **선순환 개선 루프**: `Standard → Apply → Measure → Learn → Improve → Standardize`

---

## 엔지니어링 표준 체계 (Standards Portfolio)

OpenForge는 오픈소스 개발 전 과정을 아우르는 **29개 세부 엔지니어링 표준**을 정의합니다.

### 1. 코어 및 저장소 관리 (Core & Repository)

- **[Repository Standard](/oss/openforge/standards/repository)**: 표준 디렉토리 레이아웃, 루트 파일 불변식 (`LICENSE`, `SECURITY.md`, `CONTRIBUTING.md` 등).
- **[Documentation Standard](/oss/openforge/standards/documentation)**: 영/한 문서 쌍 규칙, 문서 모델, 용어집 및 아키텍처 다이어그램 가이드라인.
- **[GitHub Standard](/oss/openforge/standards/github)**: Issue Template (Bug, Feature, Architecture), PR Template, CODEOWNERS, 라벨링 및 브랜치 보호 규칙.
- **[Development Standard](/oss/openforge/standards/development)**: 언어별 권장 툴체인 (Go: `gofumpt`/`staticcheck`, Node/TS: ESLint/Prettier, Python: Ruff), Makefile 작업 자동화.
- **[Engineering Tooling Standard](/oss/openforge/standards/tooling)** / **[Tooling Matrix](/oss/openforge/standards/tooling-matrix)**: 툴체인 선정, 설정 관리 및 언어별 도구 매트릭스.
- **[CI/CD Standard](/oss/openforge/standards/ci-cd)**: 지속적 통합/배포 파이프라인 및 사전 검증 품질 게이트.
- **[Internationalization Standard](/oss/openforge/standards/i18n)**: UI 프로젝트의 다국어 리소스 구조 및 번역 키 관리 표준.

### 2. 보안 및 공급망 거버넌스 (Security & Supply Chain)

- **[Security Standard](/oss/openforge/standards/security)**: Multi-stage 빌드, Non-root 사용자, Read-only 루트 파일시스템, NetworkPolicy, PDB, Seccomp 적용.
- **[Supply Chain Security](/oss/openforge/standards/supply-chain)**: 패키지 불변 식별자 검증, 서명 및 체크섬 확인, 비인가 레지스트리 유입 차단.
- **[Package & Artifact Identity](/oss/openforge/standards/package-identity)**: 불변 패키지 출처, 체크섬, 전자서명 및 메타데이터 무결성 검증.
- **[Plugin Supply-Chain Intake](/oss/openforge/standards/plugin-supply-chain)**: 외부 플러그인·스킬·도구의 무결성 검증, 실행 행위 정책 및 인테이크 파이프라인.
- **[CI/CD Security](/oss/openforge/standards/ci-security)**: CI 시크릿 최소 권한 원칙, 불변 GitHub Actions SHA 핀 고정, 릴리스 격리.
- **[CI/CD Resilience](/oss/openforge/standards/ci-resilience)**: CI 서비스 장애 시 안전한 Fallback 전략 및 리스크 완화.
- **[Developer Environment Security](/oss/openforge/standards/developer-environment-security)**: 로컬 개발 환경 경계, 자격증명 격리 및 안전한 도구 실행.
- **[AI-Assisted Engineering Security](/oss/openforge/standards/ai-engineering-security)**: 로컬 환경 권한 격리, AI 코딩 에이전트의 프롬프트 인젝션 방어 및 샌드박스 실행 제어.
- **[Container, Kubernetes & IaC Security](/oss/openforge/standards/container-iac-security)**: 컨테이너 하드닝, Non-root 실행, NetworkPolicy 및 IaC 보안.
- **[Secrets & Machine Identity](/oss/openforge/standards/secrets-identity)**: OIDC 기반 클라우드 인증, 토큰 수명 주기 관리, 하드코딩 시크릿 탐지.
- **[Vulnerability Management](/oss/openforge/standards/vulnerability-management)**: 취약점 발견 시 triage 프로세스, 보안 패치 워크플로, 재발 방지.
- **[Security & Incident Response](/oss/openforge/standards/incident-response)**: 장애 및 보안 사고 분석, 완화 절차, Lessons Log 회귀 테스트화.
- **[Security Exceptions & Waivers](/oss/openforge/standards/security-exceptions)**: 시한부 보안 예외 처리, 리스크 소유권 명시 및 만료 감사 체계.

### 3. 변경 관리, 릴리스 및 컴플라이언스 (Release & Governance)

- **[Change Management & Impact Analysis](/oss/openforge/standards/change-management)**: 의존성/런타임 업데이트 시 파이프라인 및 워크플로 전수 영향 분석.
- **[Upgrade & Compatibility Engineering](/oss/openforge/standards/upgrade-compatibility)**: 하위 호환성 검증, 지원 주기 및 버전 드리프트 방지.
- **[Reproducible Build](/oss/openforge/standards/reproducible-build)**: 빌드 환경 및 타임스탬프 고정, 결정론적(Deterministic) 빌드 산출물 검증.
- **[Release Standard](/oss/openforge/standards/release)** / **[Release Security](/oss/openforge/standards/release-security)**: SemVer, Keep a Changelog 형식, SBOM 생성, 암호화 산출물 서명.
- **[Maintainer Governance](/oss/openforge/standards/maintainer-governance)**: 1인 메인테이너와 멀티 메인테이너 프로젝트를 위한 위험 기반 승인 및 자동화 거버넌스.
- **[OSS Compliance](/oss/openforge/standards/oss-compliance)**: Apache 2.0 라이선스 기반, SPDX 헤더 표준화, 라이선스 호환성 감사.
- **[Reference Practices Audit](/oss/openforge/standards/reference-practices)**: 실제 오픈소스 프로젝트로부터 모범 관행 추출 및 지속적 검증.

---

## 재사용 가능한 템플릿 카탈로그 (Reusable Templates)

OpenForge 저장소의 [`templates/`](https://github.com/dasomel/openforge/tree/main/templates) 디렉토리에는 즉시 활용 가능한 검증된 구현 템플릿이 포함되어 있습니다.

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

> **템플릿 적용 원칙**: 템플릿은 범용 만능 설정이 아니라 보수적인 출발점입니다. 대상 프로젝트의 런타임, 권한, 인프라 환경 및 위협 모델에 맞춰 버전과 설정을 반드시 커스터마이징해야 합니다.

---

## 성숙도 평가 메트릭 (Reference Metrics)

OpenForge는 저장소의 엔지니어링 품질과 표준 준수 여부를 객관적으로 측정하기 위한 **[Maturity Scorecard](/oss/openforge/reference/metrics)**를 제공합니다.

### 채점 기준

- **`2`**: 표준이 완벽히 구현되어 있으며 가능한 영역은 CI/CD로 자동화됨
- **`1`**: 수동으로 운영되거나 부분적으로 구현됨
- **`0`**: 미구현 또는 기준 미달
- **`N/A`**: 프로젝트 성격상 해당 없음 (예: CLI 도구의 UI i18n 항목)

### 영역별 주요 평가 지표

| 영역 | 핵심 점검 항목 | 목표 상태 |
|---|---|---|
| **Documentation** | 영문/한글 README 쌍, 아키텍처 문서, 개발 가이드, Lessons Log | 영/한 1:1 완비, 장애 기록 누적 |
| **Architecture** | 아키텍처 결정 기록(ADR) 체계 운영 | `docs/adr/` 디렉토리 및 인덱스 유지 |
| **GitHub** | Issue/PR 템플릿, CODEOWNERS, 라벨링 체계 | 표준 템플릿 기반 변경 흐름 확립 |
| **CI / Validation** | 빌드, 테스트, 포맷 검증, 문서 유효성 검사 | Merge 전 필수 게이트 자동화 |
| **Security** | Dependabot, 컨테이너 스캔, 시크릿 탐지, SECURITY 정책 | 정기 스캔 및 SBOM 생성 자동화 |
| **Development** | 언어별 표준 포매터(`gofumpt` 등), Makefile 작업 도구 | 단일 명령어로 로컬 테스트/빌드 가능 |
| **Release** | SemVer, CHANGELOG, 릴리스 워크플로, 산출물 서명 | 태그 기반 자동 빌드 및 서명 발행 |
| **Configuration** | `.env.example`, 환경변수/설정 경계 정의 | 비밀값과 일반 설정 분리 |
| **Localization** | UI 프로젝트의 다국어 지원 리소스(`ko-KR`, `en-US`) | 구조화된 i18n 리소스 번들 관리 |

---

## 참고 구현 프로젝트 (Reference Implementations)

OpenForge의 표준과 템플릿은 실제 프로덕션 및 오픈소스 환경에서 운영 중인 프로젝트들로부터 추출되고 검증되었습니다.

| 프로젝트 | 설명 | OpenForge 반영 주요 패턴 |
|---|---|---|
| **[Narwhal](/ko/projects/narwhal)** | Kubernetes 기반 Internal Developer Platform (IDP) | 35개 GitOps 앱 통합, 263건의 `lessons-log.md` 회귀 테스트화, Air-gap 오프라인 번들 |
| **[Narwhal Portal](/ko/projects/narwhal-portal)** | Cloud Native 통합 관리 포털 | Next.js/Tailwind 아키텍처, ADR 거버넌스, Keycloak OIDC 통합 |
| **[nfs-quota-agent](/ko/projects/nfs-quota-agent)** | Linux XFS Project Quota 관리 gRPC/HTTP 데몬 | Go `gofumpt` 린트 표준, systemd 서비스 템플릿, 단위/통합 테스트 |
| **[Kube-Ready-Box](/ko/projects/kube-ready-box)** | Kubernetes 노드용 사전 튜닝 OS 베이스 이미지 | 커널 파라미터 최적화, 스토리지 쿼터 자동화, Vagrant/Packer 빌드 |
| **[KubeMetal](/ko/projects/kubemetal)** | Bare-metal Kubernetes 클러스터 수명주기 관리자 | Makefile 통합 태스크 러너, 릴리스 자동화, 하드웨어 호환성 매트릭스 |
| **[ldapium](/ko/projects/ldapium)** | OpenLDAP 기반 디렉토리 서비스 통합 솔루션 | `.env.example` 설정 표준, GitHub Scorecard 및 Dependabot 보안 거버넌스 |
| **[Beluga Manager](/ko/projects/beluga-manager)** | 멀티 클러스터 오케스트레이션 및 엣지 관리 UI | UI i18n (`ko-KR` / `en-US`), REST API 계약, 컨테이너 보안 베이스라인 |

---

## 시작하기 (Getting Started)

새로운 프로젝트나 기존 저장소에 OpenForge를 단계적으로 적용하는 절차입니다.

```bash
# 1. OpenForge 저장소 클론 및 템플릿 확인
git clone https://github.com/dasomel/openforge.git

# 2. 프로젝트 기본 디렉토리 구조 및 GitHub 템플릿 복사
cp -r openforge/templates/github/ .github/
cp openforge/templates/design/README-template.md README.md
cp openforge/templates/design/README-template-ko.md README-ko.md

# 3. 언어별 툴체인 및 CI 워크플로 배치
cp openforge/templates/workflows/ci.yml .github/workflows/ci.yml

# 4. 대상 프로젝트 환경에 맞게 권한, 경로, 버전 파라미터 커스터마이징
```

단계별 상세 가이드는 [Getting Started 문서](/oss/openforge/getting-started)를 참고합니다.

---

## 기술 문서 가이드 (Documentation Index)

OpenForge 포털에서 제공하는 상세 주제별 기술 문서입니다.

| 주제 | 문서 링크 | 주요 내용 |
|---|---|---|
| **Overview** | [문서 개요](/oss/openforge/overview) | 문서 모델, Source of Truth, 포털 구조 안내 |
| **Concepts** | [핵심 개념](/oss/openforge/concepts) | 3계층 모델, 신뢰 모델, 변경 모델, 거버넌스 원칙 |
| **Getting Started** | [시작하기](/oss/openforge/getting-started) | 저장소 진단, 템플릿 적용, 점진적 표준화 가이드 |
| **Standards** | [표준 모음](/oss/openforge/standards) | Core, Security, Engineering 세부 표준 목록 |
| **Templates** | [템플릿 카탈로그](/oss/openforge/templates) | CI/CD, Container, K8s, Policy 템플릿 상세 |
| **Blueprints** | [아키텍처 블루프린트](/oss/openforge/blueprints) | 플랫폼/애플리케이션 아키텍처 청사진 |
| **Operations** | [운영 가이드](/oss/openforge/operations) | 관측성, 헬스체크, 백업/복구, 장애 대응 |
| **Reference** | [참조 맵](/oss/openforge/reference) | 표준, 템플릿, 구현체 권위 소스 맵 |
| **Metrics** | [성숙도 메트릭](/oss/openforge/reference/metrics) | Repository Maturity Scorecard 및 평가 지표 |
| **Troubleshooting** | [문제 해결](/oss/openforge/troubleshooting) | 증상 → 증거 → 원인 → 조치 기반 장애 분석 가이드 |
| **ADR** | [아키텍처 결정 기록](/oss/openforge/adr) | OpenForge 핵심 설계 결정 및 트레이드오프 기록 |

---

## 관련 링크

- **GitHub Repository**: [dasomel/openforge](https://github.com/dasomel/openforge)
- **Engineering Standards**: [OpenForge Docs on GitHub](https://github.com/dasomel/openforge/tree/main/docs)
- **Reusable Templates**: [OpenForge Templates on GitHub](https://github.com/dasomel/openforge/tree/main/templates)
- **English Documentation**: [OpenForge English Portal](/oss/en/openforge/)

