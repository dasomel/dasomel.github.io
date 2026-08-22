---
title: Secrets & Machine Identity
description: Short-lived tokens, OIDC federation, secret scanning, and zero hardcoded credentials.
project: OpenForge
path: openforge/standards/secrets-identity
order: 1030
lastModified: 2026-08-23
---

# Secrets & Machine Identity

Secrets and machine identities must minimize lifetime and exposure surfaces.

## Management Principles

- **Zero Hardcoded Secrets**: Static credentials never exist in source code or configuration files.
- **Short-Lived Identities**: Long-lived API keys replaced with temporary tokens via OIDC federation.
- **Automated Rotation**: Secrets rotated periodically with verified emergency revocation workflows.

## Canonical Source

- [Secrets & Machine Identity](https://github.com/dasomel/openforge/blob/main/docs/secrets-identity.md)
