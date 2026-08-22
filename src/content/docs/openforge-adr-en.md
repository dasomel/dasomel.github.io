---
title: Architecture Decision Records (ADR)
description: Key architectural decisions, design rationale, and trade-offs behind OpenForge.
project: OpenForge
path: openforge/adr
order: 1009
lastModified: 2026-08-23
---

# Architecture Decision Records (ADR)

ADRs capture not just what was implemented, but **why specific architectural choices and trade-offs were made**.

## ADR Index

### ADR-0001: Separation of Source Assets and Public Documentation
- **Status**: Accepted
- **Decision**: The OpenForge GitHub repository remains the authoritative Source of Truth for standards, templates, and reusable assets. The `cne.io.kr` web portal provides bilingual documentation, conceptual guides, tutorials, and adoption evidence.
- **Rationale**: Keeps implementation assets and public presentation layers decoupled, allowing each to evolve according to its own lifecycle.

### ADR-0002: 1:1 Bilingual Documentation Policy
- **Status**: Accepted
- **Decision**: All public documentation maintains strict 1:1 structural parity between canonical English (`<name>-en.md`) and first-class Korean (`<name>.md`).
- **Rationale**: Ensures global open-source accessibility while providing native, high-quality documentation for Korean-speaking engineers.
