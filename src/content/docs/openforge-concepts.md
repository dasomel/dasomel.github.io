---
title: Concepts
description: OpenForge Engineering Model의 핵심 개념.
project: OpenForge
path: openforge/concepts
order: 1001
lastModified: 2026-08-21
---

# Concepts

OpenForge는 **정책(Policy)**, **구현(Implementation)**, **증거(Evidence)**를 분리합니다.

## 세 계층

| 계층 | 목적 | 예 |
|---|---|---|
| Standard | 기대하는 Engineering Outcome 정의 | Supply Chain Security Standard |
| Template | 바로 적용할 수 있는 시작점 제공 | Kubernetes Deployment baseline |
| Reference Implementation | 프로젝트별 적용과 trade-off 설명 | Narwhal deployment |

## Trust Model

Provenance, Signature, SBOM은 안전함을 보증하는 문서가 아니라 검증을 위한 evidence입니다. Source, build input, workflow identity, artifact content, deployment context를 함께 확인해야 합니다.

## Change Model

Dependency/runtime/toolchain 변경은 workflow 전체에 영향을 주는 변경입니다. 예를 들어 build command가 Bun을 사용하게 되면 그 command를 실행하는 모든 workflow를 함께 확인해야 합니다.

## Governance Model

OpenForge는 단독 maintainer와 multi-maintainer OSS 모두를 고려합니다. 사람 수를 강제하기보다 변경 위험과 자동화된 통제를 기준으로 governance 수준을 조정합니다.
