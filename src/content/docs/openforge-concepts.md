---
title: Concepts
description: OpenForge Engineering Model의 핵심 개념과 적용 원칙.
project: OpenForge
path: openforge/concepts
order: 1001
lastModified: 2026-08-22
---

# Concepts

OpenForge는 **정책(Policy)**, **구현(Implementation)**, **증거(Evidence)**를 분리하고, 이를 프로젝트 lifecycle에 연결합니다.

## 세 계층

| 계층 | 목적 | 예 |
|---|---|---|
| Standard | 기대하는 Engineering Outcome 정의 | Supply Chain Security Standard |
| Template | 재사용 가능한 구현 시작점 제공 | Kubernetes Deployment baseline |
| Reference Implementation | 실제 프로젝트 적용, 제약과 trade-off 설명 | Narwhal / KubeMetal 등 |

이 구조를 통해 **표준 자체**와 **특정 프로젝트의 구현 방식**을 혼동하지 않도록 합니다.

## Trust Model

Provenance, Signature, SBOM은 “안전함”을 선언하는 자료가 아니라 검증을 위한 **Evidence**입니다.

따라서 다음을 함께 확인해야 합니다.

```text
Source
  + Build Inputs
  + Workflow Identity
  + Artifact Content
  + Deployment Context
      ↓
Verification
```

## Change Model

Dependency, runtime, toolchain 변경은 한 파일의 변경이 아니라 **workflow-wide change**로 봅니다.

예를 들어 build command가 Bun을 사용하게 되었다면, 해당 command를 실행할 수 있는 모든 CI workflow와 script, cache, install step, release path를 함께 확인해야 합니다.

OpenForge의 Change Management / Upgrade & Compatibility 기준은 이런 **변경 영향 분석**을 lifecycle에 포함시키는 것을 목표로 합니다.

## Governance Model

단독 maintainer와 multi-maintainer OSS를 동일한 숫자 규칙으로 관리하지 않습니다.

```text
Change Risk
    ↓
Required Controls
    ↓
Automation / Review / Evidence
```

사람 수 자체를 강제하기보다 변경 위험과 자동화된 통제를 기준으로 governance 수준을 조정합니다.

## Template Model

Templates는 완성된 universal configuration이 아니라 **implementation starting point**입니다.

버전, 권한, 경로, 이미지, domain, identity, ecosystem별 security control은 대상 프로젝트의 threat model과 운영 환경에 맞게 조정해야 합니다.

## Lifecycle Model

OpenForge는 다음 lifecycle에서 반복적으로 학습합니다.

```text
Define
  ↓
Bootstrap
  ↓
Implement
  ↓
Validate
  ↓
Release / Operate
  ↓
Incident / Review / Metrics
  ↓
Improve Standard
```
