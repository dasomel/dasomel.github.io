# 2026 Web Toolchain Review

## Production baseline

The production site now runs:

- Next.js 16.x
- React 19.2.x
- Tailwind CSS 4.3.x
- ESLint 9.x
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
5. Visual smoke checks for representative project and note pages

## MDX migration follow-up

`next-mdx-remote` was archived by its owner on April 9, 2026. The current implementation uses `next-mdx-remote/rsc` with `remark-gfm`, `rehype-pretty-code`, and a custom Mermaid component.

The first candidate for replacement is the official `@next/mdx` integration. Upstream Next.js documentation and discussion indicate that `@next/mdx` can also handle MDX sourced outside the `app` directory, so the migration should not assume that local content requires another remote-MDX package.

Before changing production, the replacement must preserve:

- local `src/content/**/*.md` files
- dynamic localized post/doc routes
- `remark-gfm`
- `rehype-pretty-code`
- custom `<Mermaid />` rendering
- table overflow wrapper
- Korean/English static generation

`next-mdx-remote-client` is a secondary alternative for comparison, not the default target.

## Major versions deliberately evaluated together

Next.js 16 and Tailwind CSS 4 are now production-tested. ESLint 10 remains deferred because the React lint stack used by `eslint-config-next` is not yet compatible with the ESLint 10 context API.
