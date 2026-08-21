---
title: ADR
description: Decision records for the OpenForge documentation architecture and standards.
project: OpenForge
path: openforge/adr
order: 1009
lastModified: 2026-08-21
---

# ADR

Architecture Decision Records capture why a choice was made, not only what was implemented.

## ADR-0001: Separate source assets from public documentation

**Status:** Accepted

**Decision:** OpenForge remains the source of truth for standards, templates, and reusable implementation assets. `cne.io.kr` provides bilingual documentation, tutorials, reference explanations, and evidence for those assets.

**Reason:** Duplicating implementation content across repositories creates drift. Separating source assets from explanatory documentation keeps ownership clear while allowing the documentation site to provide a better learning and discovery experience.

**Consequence:** Projects link to both the exact OpenForge asset and the corresponding documentation page.

## Future ADRs

Add decisions here when the documentation architecture, template contract, or portfolio-wide engineering baseline changes.
