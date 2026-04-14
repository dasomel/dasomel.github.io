---
title: "Redesigned the Site with Narrative Authority Design"
description: "The story of transforming a flat blog into a professional portfolio combining narrative and authority"
pubDate: 2026-04-15
tags: ["Design", "Next.js", "Portfolio"]
featured: true
---

## Why Redesign

The existing site was clean but **flat**. Visitors would arrive, think "oh, it's a blog," and leave. Despite 11+ years of IT experience, 50+ presentations, and diverse community activities, the depth wasn't being communicated.

Two goals:
- **Storytelling (50%)** — What journey has this person taken
- **Expertise (50%)** — What specific achievements and activities exist

## The Narrative Authority Approach

We chose a design direction combining "narrative + authority."

### Homepage

| Before | After |
|--------|-------|
| Generic headline | "From Developer to Cloud Infrastructure, N Years of Journey" (dynamic) |
| Tech chip list | Impact Bar (talks, IT experience, OSS projects — auto-calculated) |
| Project card grid | Featured Work (problem→solution story cards) |
| OSS section | Speaking Highlights |

Impact Bar numbers are **dynamically calculated** from content. Adding a seminar automatically increases the talk count, and the experience years auto-update each year.

### About Page

The biggest transformation:

- **Narrative Intro** — Journey summarized in one paragraph
- **3 Role Cards** — Engineer / Professor / Community Leader
- **Community Activities** — CloudBro, OPA, OPDC
- **Mentoring** — K-PaaS competitions, eGovFrame contributions — 9 entries
- **Expert Activities** — NIA advisory, SaaS evaluation — 7 entries
- **Awards** — From ministerial commendation to OPA Awards — 12 entries
- **Research Reports** — NIA commissioned — 5 papers
- **Conference Wall** — Auto-extracted from seminar data
- **OSS Contributions** — OpenMetadata, KakaoCloud Terraform Provider

### Speaking Page

Transformed from a simple yearly list to a **timeline UI** with Summary Stats and highlighted presentations.

### Work Page

Removed Projects/Forks separation, replaced with **tag filter + case study cards**. Featured projects show "Problem | Solution" in a two-column layout.

### Blog Page

Added tag filter, pinned featured post, and reading time display.

## Technical Changes

### New Packages

- `rehype-pretty-code` + `shiki` — Code block syntax highlighting
- `remark-gfm` — GFM table support
- `mermaid` — Architecture diagram rendering

### Shared Components

Three reusable components extracted:

- `ImpactStats` — Numeric stats bar (shared by Home, Speaking)
- `TagFilter` — Tag filter chips (shared by Work, Blog)
- `FeaturedCard` — Emerald-bordered highlight card (shared by Home, Blog, Speaking)

### Design System Unification

All pages unified from hardcoded Tailwind color classes to CSS variable-based design tokens (`var(--text)`, `var(--accent)`, etc.).

### MDX Improvements

- ``Mermaid`` custom component for diagram support
- `rehype-pretty-code` with github-light theme for code blocks
- `remark-gfm` for proper markdown table rendering

## Built with AI

This redesign was a collaboration with **Claude Code**. From brainstorming to design spec, implementation plan, and parallel agent execution — the entire process was done with AI.

Using parallel sub-agents to redesign 5 pages simultaneously proved particularly effective.
