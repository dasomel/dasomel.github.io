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

- Documentation Standard
- Repository Standard
- GitHub Standard
- Development Standard
- Engineering Tooling Standard / Matrix
- CI/CD Standard
- Release Standard
- Internationalization Standard
- OSS Compliance Standard

## Change & Compatibility

- Change Management and Impact Analysis
- Upgrade and Compatibility Engineering
- Reproducible Build

Dependency, runtime, toolchain 변경은 workflow 전체의 영향 분석 대상으로 봅니다. 최신 버전이라는 이유만으로 즉시 채택하지 않고 호환성, 운영 영향, 검증 가능성을 함께 평가합니다.

## Security & Supply Chain

- Security Standard
- Supply Chain Security Standard
- Package and Artifact Identity
- CI/CD Security / Resilience
- Developer Environment Security
- AI-Assisted Engineering Security
- Container / Kubernetes / IaC Security
- Secrets and Machine Identity
- Vulnerability Management
- Security and Supply-Chain Incident Response
- Release Security
- Security Exceptions and Waivers

## Governance & Evidence

- Maintainer Governance
- Reference Practices Audit
- Reference Implementation Metrics

특히 Metrics는 문서화, Architecture, GitHub, CI/CD, Security, Supply Chain, Change Management, Upgrade/Compatibility, Developer Environment, AI-assisted Engineering, Release, Resilience, Configuration, Localization 등을 프로젝트 maturity 관점에서 평가합니다.

## Authoritative Source

정식 기준 문서는 [OpenForge repository의 `docs/`](https://github.com/dasomel/openforge/tree/main/docs)에 있습니다.

이 포털은 각 standard의 목적, 적용 시점, 실제 OSS에 적용할 때의 trade-off와 evidence를 설명하는 역할을 합니다.
