---
title: Security Standard
description: OpenForge baseline for secure development and operational boundaries.
project: OpenForge
path: openforge/standards/security
order: 1023
lastModified: 2026-08-23
---

# Security Standard

Security is a continuous lifecycle discipline rather than a pre-release checkbox.

## Core Controls

- **Least Privilege**: Repository, CI token, and container runtime permissions restricted to the minimum necessary.
- **Automated Scanning**: Static analysis (SAST), dependency scanning (SCA), and container scanning in CI.
- **Secret Leak Prevention**: Pre-commit and CI secret scanning prevent credential exposure.
- **Vulnerability Disclosure**: Clear `SECURITY.md` defining private vulnerability reporting workflows.

## Canonical Source

- [Security Standard](https://github.com/dasomel/openforge/blob/main/docs/security.md)
