---
title: "GitHub Pages Deployment Concurrency After the Bun Migration"
description: "A practical record of how an older Pages deployment was cancelled after a newer main revision arrived, and how to interpret that state correctly."
pubDate: 2026-08-21
tags: ["Bun", "GitHub Actions", "CI/CD", "GitHub Pages", "Deployment"]
featured: false
draft: false
---

## An older deployment was cancelled after a newer main revision arrived

While finishing the Bun migration and CI cleanup, multiple changes landed on `main` in a short window.

GitHub Actions showed the earlier Pages deployment as `cancelled`, followed by a new deployment for the newer commit.

The actual sequence was:

```text
Commit A: 97ca593
    ↓
Deploy #364
    ↓
New main commit arrives
    ↓
Deploy #364 cancelled
    ↓
Commit B: 76e1a3e
    ↓
Deploy #365
    ↓
Build ✅
Deploy ✅
```

<Mermaid chart={`flowchart TD
    classDef commit fill:#f8fafc,stroke:#64748b,color:#334155,stroke-width:1.5px
    classDef deploy fill:#ecfeff,stroke:#06b6d4,color:#155e75,stroke-width:1.5px
    classDef cancel fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef success fill:#ecfdf5,stroke:#10b981,color:#065f46,stroke-width:1.5px

    A[Commit A: 97ca593] --> B[Deploy #364]
    B --> C[New main commit]
    C --> D[Deploy #364 cancelled]
    C --> E[Commit B: 76e1a3e]
    E --> F[Deploy #365]
    F --> G[Build success]
    G --> H[Pages deploy success]
    class A,C,E commit
    class B,F deploy
    class D cancel
    class G,H success
`} />

### A cancelled run is not automatically a deployment failure

The important state is not the previous run in isolation. Check the relationship between the revision and the latest deployment.

| Check | What to verify |
| --- | --- |
| Previous run | It was cancelled rather than failed |
| New revision | A new deployment run was created |
| Latest deployment | Build and Pages deployment both succeeded |

In this case, the older run #364 was superseded. The newer #365 run built the latest revision successfully and continued to Pages deployment.

## Why keep this in the migration record?

CI/CD incidents are easier to interpret when we look at the **revision-to-deployment lifecycle**, not just a single run status.

```text
Older revision
    ↓
Older deployment
    ↓
Superseded

Latest revision
    ↓
Latest deployment
    ↓
Production
```

For repositories where `main` can receive consecutive changes, a `cancelled` run should be investigated together with the newer run before being classified as an incident.

This became another useful part of the Bun migration case study: the work was not only about changing runtimes, but also about understanding the real CI/CD execution boundaries and deployment lifecycle.
