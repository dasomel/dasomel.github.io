---
title: Documentation Standard
description: OpenForge guidance for consistent OSS documentation quality and information architecture.
project: OpenForge
path: openforge/standards/documentation
order: 1010
lastModified: 2026-08-22
---

# Documentation Standard

OpenForge documentation is an **engineering interface**: readers should be able to understand, apply, and verify what a project recommends.

## Principles

- English is the canonical language; Korean is maintained as a first-class translation.
- Documentation is separated by purpose: Concepts, Guides, Tutorials, Reference, Operations, Troubleshooting, and ADRs.
- Implementation ownership and explanatory documentation ownership are kept separate.
- Examples should be executable where practical, with environment assumptions stated explicitly.
- Security and operational claims should be backed by evidence or source references where possible.

## Change management

A behavior-changing implementation change should trigger review of related documentation, examples, runbooks, troubleshooting content, and ADRs. Repository CI should validate documentation structure and naming conventions.

## OSS portal model

`cne.io.kr/oss/openforge` does not mirror the repository verbatim. The repository is the implementation source of truth; the portal explains why and when to apply the standard, trade-offs, evidence, and project examples.

## Canonical source

[OpenForge Documentation Standard](https://github.com/dasomel/openforge/blob/main/docs/documentation.md)