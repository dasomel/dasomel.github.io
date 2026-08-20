---
title: "Frontend Toolchain"
description: "Current framework/tooling baseline, upstream status, and upgrade strategy for this blog"
project: "Site"
order: 20
lastModified: 2026-08-20
---

## Baseline

This document tracks the frontend stack used by `dasomel.github.io` against upstream releases. Versions are reviewed as of **2026-08-20**. A newer release is not automatically adopted; compatibility with the current site is part of the decision.

## Runtime

| Component | Current site | Upstream reference | Decision |
|---|---:|---:|---|
| Node.js | GitHub Pages build **24.19.0** | 24.19.0 LTS | Applied |
| Next.js | 15.5.x line | 16.2.9 stable / 15.5.23 backport | Major migration separately validated |
| React | 19.x | 19.2.8 stable | Minor refresh candidate |
| next-intl | 4.x | 4.13.6 | Minor refresh candidate |

Node.js 24.19.0 is the current LTS line used by the Pages build instead of Node 22.

## Markdown / MDX

| Component | Current site | Upstream reference | Decision |
|---|---:|---:|---|
| next-mdx-remote | 6.0.0 | 6.0.0 | **Upstream archived** — migration needed |
| rehype-pretty-code | 0.14.x | 0.14.5 | Patch refresh candidate |
| Shiki | 4.x | 4.4.3 | Minor refresh candidate |
| remark-gfm | 4.0.x | 4.0.1 | Current stable |
| gray-matter | 4.0.x | 4.0.3 | Current stable |

The `next-mdx-remote` repository was archived on 2026-04-09. That makes it a long-term maintenance risk. The current runtime remains in place for stability, but the planned direction is to migrate to Next.js's official MDX integration (`@next/mdx`) or another maintained static MDX pipeline.

## UI / CSS

| Component | Current site | Upstream reference | Decision |
|---|---:|---:|---|
| Tailwind CSS | 3.4.x | 4.3.3 | Major migration separately validated |
| tailwind-merge | 2.x | 2.6.1 (Tailwind 3) / 3.6.0 (Tailwind 4) | Keep v2 with Tailwind 3 |
| Lucide React | 0.x | 1.31.0 | Major migration separately validated |
| PostCSS | 8.5.x | 8.5.26 | Patch refresh candidate |
| Autoprefixer | 10.4.x | 10.5.4 | Minor refresh candidate |

Tailwind 4 and Lucide 1.x require compatibility testing before adoption because they are major migrations for the current codebase.

## Build / Quality

| Component | Current site | Upstream reference | Decision |
|---|---:|---:|---|
| ESLint | 9.x | 10.8.1 | Major migration separately validated |
| TypeScript | 5.x | 5.9.3 stable / 7.0.2 latest | Keep the 5.9 line |
| Mermaid | 11.16.1 | 11.16.1 | Current |
| reading-time | 1.5.0 | 1.5.0 | Current |
| clsx | 2.1.1 | 2.1.1 | Current |

TypeScript 7 is newer, but the site keeps the 5.9 line to keep the Next.js/MDX compatibility surface predictable.

## Upgrade policy

```text
upstream release
      ↓
compatibility check
      ↓
lockfile refresh
      ↓
static build (344+ pages)
      ↓
visual / route verification
      ↓
merge
```

The goal is not “latest at all costs.” The priority is a reproducible static build that still renders the whole site correctly.

## Next validation targets

1. React 19.2.x / next-intl 4.13.x / Shiki 4.4.x / rehype-pretty-code 0.14.x stable refresh
2. `next-mdx-remote` → `@next/mdx` or another maintained MDX pipeline
3. Next.js 16.2.x migration
4. Tailwind CSS 4 migration
5. ESLint 10 migration
6. Lucide 1.x migration
