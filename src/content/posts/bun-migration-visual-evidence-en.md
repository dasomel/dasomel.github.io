---
title: "Bun 1.4 Migration — Visual CI Evidence"
description: "A visual companion to the Bun migration case study, using measured GitHub Actions timings and pipeline diagrams."
pubDate: 2026-08-21
tags: ["Bun", "CI/CD", "GitHub Actions", "Performance", "Next.js", "Engineering"]
featured: false
draft: false
---

## Results at a glance

| Metric | Before | Bun migration | Change |
| --- | ---: | ---: | ---: |
| Dependency install | 15.26s | **8.99s** | **~41% faster** |
| Next.js compile | 10.3s | 9.8s | Nearly unchanged |
| Initial whole CI | 49.5s | **38.5s** | **~22% faster** |

<Mermaid chart={`xychart-beta
    title "Dependency installation time"
    x-axis ["npm ci", "bun install"]
    y-axis "seconds" 0 --> 16
    bar [15.26, 8.99]
`} />

> The clearest improvement appeared in dependency installation and tooling overhead, not in the Next.js compiler itself.

## 1. What changed?

The original model was Node.js + npm.

<Mermaid chart={`flowchart LR
    A[Next.js] --> N[Node.js]
    B[Automation scripts] --> N
    C[Dependencies] --> P[npm]
    D[CI / Deploy] --> P
    N --> E[Execution environment]
    P --> E
`} />

The target was a single Bun-oriented toolchain:

```text
package-lock.json  →  bun.lock
npm ci             →  bun install
node scripts/...   →  bun scripts/...
npm-centered CI    →  Bun 1.4
```

Next.js and Turbopack were not replaced. Bun became the surrounding package, runtime, test, and build tooling layer.

## 2. The first attempt failed

The first change updated the build command:

```diff
- "build": "next build && node scripts/generate-rss.js"
+ "build": "next build && bun scripts/generate-rss.js"
```

The CI workflow installed Bun, but the GitHub Pages deployment workflow did not.

<Mermaid chart={`flowchart TD
    A[Next.js build] --> B[Success]
    B --> C[bun scripts/generate-rss.js]
    C --> D{Bun available on Pages runner?}
    D -- No --> E[bun: not found]
    E --> F[Deployment failed]
    D -- Yes --> G[Continue deployment]
`} />

The failure was not a Next.js compiler failure. It was a **runtime provisioning mismatch** between the source and the deployment environment.

The fix was to explicitly install and verify Bun 1.4 in the Pages workflow.

## 3. Dependency installation improved materially

The measurements came from the same GitHub-hosted `ubuntu-24.04` runner.

```text
npm ci        15.26s
bun install    8.99s
```

<Mermaid chart={`xychart-beta
    title "Install time: npm vs Bun"
    x-axis ["npm ci", "bun install"]
    y-axis "seconds" 0 --> 16
    bar [15.26, 8.99]
`} />

That is about **6.27 seconds saved, or roughly 41%** for dependency installation.

## 4. Next.js did not suddenly become much faster

The Next.js compile step stayed in roughly the same range.

<Mermaid chart={`xychart-beta
    title "Next.js compile time"
    x-axis ["Before", "Bun"]
    y-axis "seconds" 0 --> 12
    bar [10.3, 9.8]
`} />

This is expected. Bun did not replace the Next.js compiler. The main gain was around package and tooling overhead.

## 5. The whole CI job improved

The initial migration comparison was:

```text
Before  ≈ 49.5s
After   ≈ 38.5s
```

<Mermaid chart={`xychart-beta
    title "Whole CI runtime"
    x-axis ["Before", "Bun migration"]
    y-axis "seconds" 0 --> 55
    bar [49.5, 38.5]
`} />

That is roughly **11 seconds, or about 22%**, while the Bun workflow also added Bun-native validation such as `bun test` and a bundle smoke test.

## 6. The next optimization was pipeline design

After the migration, the same production build was being performed in both PR validation and Pages deployment.

<Mermaid chart={`flowchart LR
    A[Pull Request] --> B[PR CI]
    B --> C[Next.js production build]
    C --> D[Merge]
    D --> E[Pages Deploy]
    E --> F[Next.js production build again]
`} />

That redundancy was removed.

<Mermaid chart={`flowchart TD
    A[Pull Request] --> B[Fast PR CI]
    B --> B1[bun install --frozen-lockfile]
    B --> B2[bun test]
    B --> B3[bun build smoke test]
    B --> B4[bun lint]
    B4 --> C[Merge]
    C --> D[Pages Deploy]
    D --> D1[bun install --frozen-lockfile]
    D --> D2[bun test]
    D --> D3[bun lint]
    D --> D4[bun run build]
    D4 --> D5[GitHub Pages]
`} />

The responsibilities are now explicit:

| Pipeline | Question answered |
| --- | --- |
| PR CI | **Is this change safe to merge?** |
| Pages Deploy | **Can this exact main revision be built and deployed?** |

## 7. Final toolchain model

<Mermaid chart={`flowchart TD
    D[Developer] --> B[Bun 1.4]
    B --> I[bun install]
    B --> T[bun test]
    B --> X[bun build]
    B --> N[Next.js CLI]
    P[Pull Request] --> C[Fast CI]
    C --> T2[bun test]
    C --> X2[Bun bundle smoke test]
    C --> L[bun lint]
    M[main] --> G[Pages Deploy]
    G --> R[bun run build]
    G --> H[GitHub Pages]
`} />

The migration therefore was larger than a runtime swap:

```text
Runtime
+ Package Manager
+ Lockfile
+ Automation
+ Test
+ Build tooling
+ CI responsibilities
```

## Final evidence

```text
Dependency install   15.26s → 8.99s   ≈ 41% faster
Initial whole CI     49.5s → 38.5s    ≈ 22% faster
Next.js compile      10.3s → 9.8s     ≈ little change
```

The important engineering result is not just the numbers. It is the sequence:

```text
Failure
  ↓
Diagnosis
  ↓
Runtime fix
  ↓
Measured migration
  ↓
Pipeline simplification
```
