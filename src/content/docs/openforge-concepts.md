---
title: 핵심 개념
description: OpenForge 엔지니어링 모델의 핵심 개념, 3계층 아키텍처 및 거버넌스 원칙.
project: OpenForge
path: openforge/concepts
order: 1001
lastModified: 2026-08-23
---

# 핵심 개념 (Concepts)

OpenForge는 **정책(Policy)**, **구현(Implementation)**, **증거(Evidence)**를 명확히 분리하고, 이를 프로젝트 생명주기에 유기적으로 연결합니다.

## 3계층 모델 (Three-Tier Model)

| 계층 | 목적 | 주요 산출물 및 예시 |
|---|---|---|
| **[Standards](/oss/openforge/standards)** | 달성해야 할 엔지니어링 결과와 원칙 정의 | 공급망 보안 표준, CI/CD 복원력 표준, 문서화 표준 |
| **[Templates](/oss/openforge/templates)** | 즉시 적용 가능한 보수적이고 안전한 구현 시작점 제공 | Multi-stage Dockerfile, GitHub Workflows, K8s Manifests |
| **[Reference Implementation](/oss/openforge/reference)** | 실제 OSS 프로젝트 적용 사례, 제약사항 및 실측치 | Narwhal, KubeMetal, nfs-quota-agent, Beluga Manager |

---

## 8대 핵심 원칙 (Foundational Principles)

1. **이중 언어 문서 정책**: 영문(English)을 표준 프로젝트 언어로 사용하고, 한국어(Korean)를 1급 번역으로 제공합니다. 사용자 대상 마크다운 문서는 `<name>.md`와 `<name>-ko.md` 쌍으로 엄격히 유지합니다.
2. **기본 안전성 및 재현 가능성**: 모든 프로젝트는 기본적으로 재현 가능하고, 문서화되며, 테스트 가능하고, 관측 가능하며 안전해야 합니다.
3. **투명한 변경 관리 및 ADR**: GitHub Issue와 PR을 기본 변경 단위로 사용하며, 주요 아키텍처 설계와 기술적 결정은 [ADR](/oss/openforge/adr)에 기록합니다.
4. **CI 선행 검증 (Quality Gating)**: 모든 변경사항은 병합(Merge) 전 CI 파이프라인에서 빌드, 단위/통합 테스트, 린트, 보안 검사를 필수로 통과해야 합니다.
5. **공급망 거버넌스 및 영향 분석**: 단순 최신 릴리스라는 이유만으로 의존성을 즉각 업그레이드하지 않으며, 런타임/툴체인 변경 시 워크플로 전수 영향 분석을 선행합니다.
6. **AI 에이전트 및 로컬 지침의 신뢰 경계**: AI 에이전트 및 저장소 로컬 지침(`AGENTS.md`, `CLAUDE.md`)은 잠재적으로 신뢰할 수 없는 실행 입력으로 간주하고 명시적인 권한과 샌드박스 경계를 설정합니다.
7. **위험 기반 거버넌스 및 복원력**: 1인 메인테이너 프로젝트에서도 과도한 수작업 없이 자동화된 제어를 통해 거버넌스를 유지하며, CI 장애 시에도 보안 게이트를 우회하지 않는 복원력을 갖춥니다.
8. **시한부 보안 예외 관리**: 기술적 사유로 표준을 준수하지 못할 경우, 예외 사유와 리스크 소유자, 만료일을 명시하여 시한부로 관리합니다.

---

## 신뢰 경계 모델 (Trust Boundary Model)

OpenForge는 소프트웨어 개발 및 운영 환경을 독립된 신뢰 도메인으로 분리합니다.

- **소스 코드 & PR**: 모든 외부 기여 및 AI 생성 코드는 사전 검증 전까지 신뢰할 수 없는 입력으로 취급합니다.
- **CI 실행 러너**: 포크(Fork) 저장소의 PR 워크플로는 시크릿 접근이 차단된 격리 러너에서 실행합니다.
- **배포 및 서명 자격증명**: 빌드 환경과 분리된 단기 OIDC 토큰을 사용하며, 장기 지속 비밀값을 배제합니다.
- **런타임 컨테이너 & 워크로드**: Non-root 사용자, Read-only 루트 파일시스템, 최소 권한 NetworkPolicy를 적용합니다.
