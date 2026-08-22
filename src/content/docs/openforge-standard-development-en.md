---
title: Development Standard
description: Language-specific tooling baseline, deterministic formatting, and task automation.
project: OpenForge
path: openforge/standards/development
order: 1014
lastModified: 2026-08-23
---

# Development Standard

A consistent local development environment ensures high code quality and minimizes friction across contributors.

## Core Rules

- **Unified Task Automation**: Common tasks automated via `make test`, `make build`, and `make lint`.
- **Deterministic Formatting**: Code is automatically formatted using language-standard tools prior to commit.
- **Isolated Testing**: Unit tests execute deterministically without relying on external network connectivity.

## Canonical Source

- [Development Standard](https://github.com/dasomel/openforge/blob/main/docs/development.md)
