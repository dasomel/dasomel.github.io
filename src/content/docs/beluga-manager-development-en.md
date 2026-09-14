---
title: Development Guide
description: Current repository verification and the boundary for selecting a future application stack.
project: Beluga Manager
path: beluga-manager/development
order: 1602
lastModified: 2026-09-14
---

# Development Guide

Beluga Manager has not selected a frontend or backend stack. The documentation does not present a nonexistent `pnpm` development server or mock API as executable behavior.

```bash
# Clone and verify the current foundation
git clone https://github.com/dasomel/beluga-manager.git
cd beluga-manager
make verify
```

Current checks cover documentation frontmatter, required repository files, English/Korean document pairs, and the CI foundation. A future application stack must be selected through an ADR before runtime, package-manager, API-framework, or UI commands are added here.
