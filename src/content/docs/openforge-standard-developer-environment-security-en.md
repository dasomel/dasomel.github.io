---
title: Developer Environment Security
description: Local workstation boundaries, credential isolation, and secure tool execution.
project: OpenForge
path: openforge/standards/developer-environment-security
order: 1027
lastModified: 2026-08-23
---

# Developer Environment Security

Developer workstations are critical trust boundaries where source code and credentials interact.

## Workstation Guidelines

- **Credential Isolation**: Production credentials strictly isolated from development environments.
- **No Unsafe Execution**: Disallow piping unverified remote scripts into local shells (`curl | bash`).
- **Tool Auditing**: Regularly audit IDE plugins and local developer toolchains.

## Canonical Source

- [Developer Environment Security](https://github.com/dasomel/openforge/blob/main/docs/developer-environment-security.md)
