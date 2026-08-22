---
title: Security Standard
description: Baseline controls for secure OSS development and operational boundaries.
project: OpenForge
path: openforge/standards/security
order: 1013
lastModified: 2026-08-22
---

# Security Standard

OpenForge treats security as a lifecycle property rather than a final checklist.

## Baseline

- least-privilege repository and workflow permissions
- protected secrets and machine identities
- dependency and artifact integrity controls
- vulnerability detection and response
- release and deployment boundaries
- documented exceptions with explicit risk ownership

## Trust boundaries

Source, dependencies, CI runners, generated artifacts, release credentials, deployment targets, and external tools are distinct trust domains. Crossing a boundary requires validation or isolation appropriate to the risk.

## Risk-based governance

Controls should reduce material risk without making single-maintainer OSS impractical. Automation is preferred where repeatability matters.

## Canonical source

[OpenForge Security Standard](https://github.com/dasomel/openforge/blob/main/docs/security.md)