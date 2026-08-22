# AI Design System Rules for dasomel.github.io

This document governs all automated agents (Claude Code, Antigravity, Luna Chat Coder) creating, editing, or styling pages, UI components, and MDX articles for `dasomel.github.io` / `cne.io.kr`.

## Core Invariants

1. **Never Hardcode Color Classes**:
   - ❌ `text-gray-900`, `bg-gray-50`, `text-emerald-500`, `bg-white`, `#171717`
   - ✅ Always use CSS semantic variables: `var(--text)`, `var(--text-muted)`, `var(--bg)`, `var(--surface)`, `var(--accent)`, `var(--border)`
2. **Support Both Light and Dark Themes**:
   - The theme switches via `<html data-theme="dark|light">`.
   - Never assume light or dark is default; verify contrast in both modes against WCAG 2.2 AA (minimum 4.5:1 for body text, 3:1 for components).
3. **Use Registered MDX Components in Articles**:
   - Use `<Mermaid chart={...} />` for flowcharts, sequence diagrams, and xycharts.
   - Use `<EvidenceCallout type="hypothesis|experiment|evidence|lesson" title="...">...</EvidenceCallout>` for engineering findings.
   - Use `<BenchmarkGrid title="..." metrics={[...]} />` for performance comparisons.
   - Use `<DigestCard category="..." title="..." summary="..." sourceUrl="..." tags={[...]} />` for tech digest highlights.
   - Use `<Badge>...</Badge>` for tags.

## Token Reference

| Purpose | Semantic Token | Light Mode Value | Dark Mode Value |
|---|---|---|---|
| Page Canvas | `--bg` | `#fafaf9` | `#151b23` |
| Secondary Shell | `--bg-subtle` | `#f4f4f2` | `#1a222c` |
| Elevated Cards | `--surface` | `#ffffff` | `#212a36` |
| Active / Hover Item | `--surface-hi` | `#f1f5f9` | `#2a3645` |
| Primary Text | `--text` | `#334155` | `#f0f6fc` |
| Secondary Text | `--text-muted` | `#475569` | `#cbd5e1` |
| Tertiary / Metadata | `--text-faint` | `#64748b` | `#94a3b8` |
| Brand Accent | `--accent` | `#0d9488` | `#2dd4bf` |
| Accent Surface Tint | `--accent-dim` | `rgba(13,148,136,0.08)` | `rgba(45,212,191,0.12)` |
| Accent Button Text | `--accent-fg` | `#ffffff` | `#042f2e` |
| Signal / Warning | `--signal` | `#d97706` | `#fbbf24` |
| Default Border | `--border` | `#e2e8f0` | `#303e50` |
| Soft Divider | `--border-soft` | `#f1f5f9` | `#253242` |
| Emphasized Border | `--border-hi` | `#cbd5e1` | `#4d627d` |
| Code / Panel Surface | `--code-bg`, `--doc-panel-bg` | `#f8fafc` | `#121820` / `#1a222d` |
