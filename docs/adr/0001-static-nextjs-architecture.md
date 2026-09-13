# ADR-0001: Next.js Static Export & GitHub Pages

- Status: Accepted
- Date: 2026-08-28

## Context
The community blog and docs site requires zero-maintenance static hosting with high Lighthouse performance and SEO indexing.

## Decision
Adopt Next.js with `output: 'export'` deploying to GitHub Pages via automated GitHub Actions workflows.

## Consequences
- Fast CDN delivery with zero server attack surface.
- All dynamic routes are prerendered at build time.
