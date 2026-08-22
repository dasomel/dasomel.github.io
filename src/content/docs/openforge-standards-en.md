---
title: Standards
description: OpenForge standards grouped by engineering concern and lifecycle.
project: OpenForge
path: openforge/standards
order: 1003
lastModified: 2026-08-22
---

# Standards

OpenForge standards define **verifiable engineering outcomes** rather than prescribing a single implementation. Projects choose technologies and controls that fit their environment and threat model.

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

Dependency, runtime, and toolchain changes are treated as workflow-wide impact-analysis events. A newer release is not adopted merely because it is newer; compatibility, operational impact, and verification are considered together.

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

The metrics score practical maturity across documentation, architecture, GitHub, CI/CD, security, supply chain, change management, upgrade/compatibility, developer environment, AI-assisted engineering, release, resilience, configuration, and localization.

## Authoritative Source

The authoritative standards are maintained in [`docs/`](https://github.com/dasomel/openforge/tree/main/docs) in the OpenForge repository.

This portal explains the purpose, adoption context, trade-offs, and evidence associated with those standards in real OSS projects.
