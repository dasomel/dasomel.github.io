# 2026 Web Toolchain Review

## Upgrade target

This branch evaluates a maintained MDX pipeline after the Next.js 16 / Tailwind CSS 4 migration.

## Applied migration

- replace archived `next-mdx-remote` with `next-mdx-remote-client`
- keep raw-string MDX rendering for the existing static dynamic-route architecture
- preserve GFM, `rehype-pretty-code`, Mermaid, and table overflow handling
- defer a file-based `@next/mdx` architecture change to a separate phase

## Validation gates

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. Static export verification for GitHub Pages
5. Visual regression review for representative Notes / Tech Digest / Docs / Projects pages

## Follow-up

A future content-pipeline phase can migrate local Markdown files to file-based `@next/mdx` imports after a route/content inventory. That is intentionally separate from this compatibility-preserving dependency migration.
