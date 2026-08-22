---
title: AI-Assisted Engineering Security
description: Trust boundaries for AI agents, prompt injection defense, and sandbox isolation.
project: OpenForge
path: openforge/standards/ai-engineering-security
order: 1028
lastModified: 2026-08-23
---

# AI-Assisted Engineering Security

AI coding agents offer significant productivity gains but must be treated as untrusted execution inputs.

## Security Controls

- **Explicit Boundaries**: AI agents are never granted production deployment or direct push permissions.
- **Prompt Injection Defense**: Untrusted text from issues and PRs is sanitized before ingestion into agent contexts.
- **Sandboxed Execution**: Agent-generated commands execute in isolated, non-privileged environments.
- **Human in the Loop**: Final merge and release decisions remain exclusively with human maintainers.

## Canonical Source

- [AI-Assisted Engineering Security](https://github.com/dasomel/openforge/blob/main/docs/ai-engineering-security.md)
