# 2026 Web Toolchain Review

## Upgrade target

This branch evaluates a major toolchain refresh for the blog:

- Next.js 16.x
- React 19.2.x
- Tailwind CSS 4.3.x
- ESLint 9.x (ESLint 10 deferred due upstream React plugin compatibility)
- next-intl 4.13.x
- Shiki 4.4.x
- rehype-pretty-code 0.14.x

## Applied migration

- Tailwind CSS v4 CSS-first setup with `@import "tailwindcss"` and `@plugin "@tailwindcss/typography"`.
- Dedicated `@tailwindcss/postcss` PostCSS plugin.
- Removed the legacy Tailwind v3 JavaScript/TypeScript config.
- Migrated ESLint to the flat config exposed by `eslint-config-next`.
- Next.js App Router dynamic routes already use promise-based `params`, so the Next 16 async request API shape is already present in the project.

## Validation gates

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. Static export verification for GitHub Pages
5. Visual regression review for Tailwind v4 Preflight and utility changes

CI now refreshes `package-lock.json` automatically for same-repository pull requests before validation, so dependency metadata stays synchronized with `package.json`.

## Known follow-up

`next-mdx-remote` is archived upstream and should not be treated as a long-term dependency. A future migration should evaluate a maintained MDX pipeline before removing it.

## Major versions deliberately evaluated together

Next.js 16 and Tailwind CSS 4 form the current modern web toolchain candidate. ESLint 10 is deferred until the upstream React lint plugin supports its context API. This branch is merge-ready only after CI verifies both linting and the complete static export.
