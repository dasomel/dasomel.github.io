# 2026 Web Toolchain Upgrade

This branch evaluates Next.js 16, Tailwind CSS 4, ESLint 9, and Bun 1.4 together with current compatible supporting libraries.

Validation gates: `bun install`, `bun test`, `bun build`, `bun run lint`, `bun run build`, static export verification, and visual regression review.

The project uses Bun as the package manager and JavaScript/TypeScript runtime; `bun.lock` is the source of dependency reproducibility.

`next-mdx-remote` is tracked separately because its upstream repository is archived.
