---
title: Standards
description: OpenForge 표준을 Engineering concern과 lifecycle 관점에서 탐색합니다.
project: OpenForge
path: openforge/standards
order: 1003
lastModified: 2026-08-22
---

# Standards

OpenForge 표준은 특정 구현을 강제하기보다 **검증 가능한 Engineering Outcome**을 정의합니다. 프로젝트는 자신의 기술 스택과 threat model에 맞는 구현을 선택합니다.

## Foundation

- [Repository Standard](/oss/openforge/standards/repository)
- [Documentation Standard](/oss/openforge/standards/documentation)
- [GitHub Standard](/oss/openforge/standards/github)
- [Development Standard](/oss/openforge/standards/development)
- [Engineering Tooling Standard](/oss/openforge/standards/tooling)
- [Engineering Tooling Matrix](/oss/openforge/standards/tooling-matrix)
- [CI/CD Standard](/oss/openforge/standards/ci-cd)
- [Release Standard](/oss/openforge/standards/release)
- [Internationalization Standard](/oss/openforge/standards/i18n)
- [OSS Compliance Standard](/oss/openforge/standards/oss-compliance)

## Change & Compatibility

- [Change Management & Impact Analysis](/oss/openforge/standards/change-management)
- [Upgrade & Compatibility Engineering](/oss/openforge/standards/upgrade-compatibility)
- [Reproducible Build](/oss/openforge/standards/reproducible-build)

Dependency, runtime, toolchain 변경은 workflow 전체의 영향 분석 대상으로 봅니다. 최신 버전이라는 이유만으로 즉시 채택하지 않고 호환성, 운영 영향, 검증 가능성을 함께 평가합니다.

## Security & Supply Chain

- [Security Standard](/oss/openforge/standards/security)
- [Supply Chain Security Standard](/oss/openforge/standards/supply-chain)
- [Package and Artifact Identity](/oss/openforge/standards/package-identity)
- [Plugin Supply-Chain Intake Standard](/oss/openforge/standards/plugin-supply-chain)
- [CI/CD Security Standard](/oss/openforge/standards/ci-security)
- [CI/CD Resilience Standard](/oss/openforge/standards/ci-resilience)
- [Developer Environment Security](/oss/openforge/standards/developer-environment-security)
- [AI-Assisted Engineering Security](/oss/openforge/standards/ai-engineering-security)
- [Container, Kubernetes & IaC Security](/oss/openforge/standards/container-iac-security)
- [Secrets & Machine Identity](/oss/openforge/standards/secrets-identity)
- [Vulnerability Management](/oss/openforge/standards/vulnerability-management)
- [Security & Supply-Chain Incident Response](/oss/openforge/standards/incident-response)
- [Release Security](/oss/openforge/standards/release-security)
- [Security Exceptions & Waivers](/oss/openforge/standards/security-exceptions)

## Governance & Evidence

- [Maintainer Governance](/oss/openforge/standards/maintainer-governance)
- [Reference Practices Audit](/oss/openforge/standards/reference-practices)
- [Reference Implementation Metrics](/oss/openforge/reference/metrics)

특히 Metrics는 문서화, Architecture, GitHub, CI/CD, Security, Supply Chain, Change Management, Upgrade/Compatibility, Developer Environment, AI-assisted Engineering, Release, Resilience, Configuration, Localization 등을 프로젝트 maturity 관점에서 평가합니다.

## Authoritative Source

정식 기준 문서는 [OpenForge repository의 `docs/`](https://github.com/dasomel/openforge/tree/main/docs)에 있습니다.

이 포털은 각 standard의 목적, 적용 시점, 실제 OSS에 적용할 때의 trade-off와 evidence를 설명하는 역할을 합니다.

