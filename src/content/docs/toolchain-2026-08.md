---
title: "2026 Web Toolchain Review"
description: "Next.js, Tailwind CSS, ESLint and the supporting web toolchain review"
project: "Site"
order: 120
lastModified: 2026-08-20
---

## Current migration

This site is evaluating a major refresh to Next.js 16, React 19.2, Tailwind CSS 4 and ESLint 10, together with current releases of next-intl, Shiki and rehype-pretty-code.

The migration is isolated on a dedicated branch until the full static build and visual regression checks pass.

## Already aligned

- App Router dynamic route `params` already uses the promise-based shape expected by modern Next.js.
- Tailwind v4 CSS-first configuration is in place.
- ESLint uses the flat config exported by `eslint-config-next`.
- GitHub Pages remains a static export target.

## Follow-up

`next-mdx-remote` is archived upstream and is tracked as a separate migration item rather than mixed into this major-version upgrade.
