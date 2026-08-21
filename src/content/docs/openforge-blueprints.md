---
title: Blueprints
description: OpenForge 표준과 템플릿을 조합한 권장 Architecture Pattern.
project: OpenForge
path: openforge/blueprints
order: 1005
lastModified: 2026-08-21
---

# Blueprints

Blueprint는 여러 template을 하나의 일관된 Engineering Scenario로 조합한 것입니다.

## OSS Service Blueprint

```text
Repository
 → CI
 → SBOM / Security Gate
 → Container
 → Registry
 → Kubernetes / GitOps
 → OIDC / SSO
 → Observability
 → Backup / Restore
```

## Platform Component Blueprint

필요한 경우 Kubernetes bootstrap, policy/admission, GitOps, identity, telemetry, persistent storage, offline bundle을 조합합니다.

## 원칙

Blueprint는 반복되는 의사결정을 줄일 만큼 opinionated해야 하지만 가정과 경계를 명시해야 합니다. 특정 제품의 구현을 그대로 복제하는 것이 아닙니다.
