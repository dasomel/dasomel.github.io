---
title: Reference
description: How OpenForge standards, templates, reference implementations, and evidence are connected.
project: OpenForge
path: openforge/reference
order: 1007
lastModified: 2026-08-22
---

# Reference

OpenForge does not copy every artifact into one location. It separates the authoritative source by asset type and connects those sources through project evidence.

## Source Map

| Need | Authoritative source | Portal role |
|---|---|---|
| Standard | `openforge/docs/` | Explain purpose, adoption context, and trade-offs |
| Template | `openforge/templates/` | Explain usage and project-specific adaptation |
| Reference implementation | Target OSS repository | Explain implementation and constraints |
| Engineering decision | Project ADR | Record rationale and alternatives |
| Incident lesson | Issue / incident / regression test | Provide evidence for standard improvement |
| Maturity | `docs/reference-metrics.md` | Provide a practical maturity model |

## Evidence Loop

```text
OpenForge Standard
      ↓
Project Application
      ↓
Implementation
      ↓
CI / Review / Runtime Evidence
      ↓
Incident / Lesson / Metric
      ↓
Standard Improvement
```

This separates “a standard exists” from “the standard has been exercised in a real project” while keeping the two connected.

## Reference Projects

The OpenForge README identifies projects such as Narwhal, Narwhal Portal, nfs-quota-agent, kube-ready-box, KubeMetal, ldapium, and Beluga Manager as reference projects.

They are not dependencies. They form a **reference set used to validate and improve repeatable engineering practices**.

## Canonical Links

- [OpenForge repository](https://github.com/dasomel/openforge)
- [OpenForge standards](https://github.com/dasomel/openforge/tree/main/docs)
- [OpenForge templates](https://github.com/dasomel/openforge/tree/main/templates)
- [Reference metrics](https://github.com/dasomel/openforge/blob/main/docs/reference-metrics.md)
