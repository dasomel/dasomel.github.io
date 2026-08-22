---
title: Plugin Supply-Chain Intake Standard
description: Intake and verification model for external plugins, skills, hooks, scripts, and repositories.
project: OpenForge
path: openforge/standards/plugin-supply-chain
order: 1015
lastModified: 2026-08-22
---

# Plugin Supply-Chain Intake Standard

OpenForge treats external plugins, skills, hooks, scripts, and repositories as **untrusted executable inputs until an explicit intake policy passes**.

## Trust model

Repository names, organizations, stars, or publisher claims are not sufficient trust signals. Source identity, content integrity, dependency integrity, and executable behavior should be assessed independently.

## Intake evidence

```yaml
source:
  repository: <repository>
  revision: <immutable-commit>
content:
  digest: sha256:<digest>
assessment:
  static_policy: pass
  network_policy: restricted
  approved_by: <policy-or-maintainer>
```

## Static inspection

Inspect install hooks, remote code retrieval, dynamic execution, credential access, unexpected filesystem/network behavior, persistence, and obfuscated executable payloads.

## Isolation and revocation

Prefer installation without credentials, with network allowlists and filesystem boundaries. On suspicion, quarantine → block → assess impact → restore a known-good revision → re-validate.

## Offline catalog

For air-gapped environments, record immutable revisions and content digests in a trusted catalog. Reject plugins not in the catalog or with mismatched digests.

## Canonical source

[Plugin Supply-Chain Intake Standard](https://github.com/dasomel/openforge/blob/main/docs/plugin-supply-chain.md)