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

### The actual deployment flow

| Step | Revision / Run | Status | Meaning |
| --- | --- | --- | --- |
| **1** | `Commit A` · `97ca593` | **New revision** | Existing `main` change |
| **2** | `Deploy #364` | **Running** | Deployment starts for Commit A |
| **3** | `Commit B` · `76e1a3e` | **New revision** | A newer change arrives on `main` |
| **4** | `Deploy #364` | **Cancelled** | Older deployment is superseded by the newer revision |
| **5** | `Deploy #365` | **Started** | Deployment starts for Commit B |
| **6** | Build | **✅ Success** | Latest revision builds successfully |
| **7** | Pages Deploy | **✅ Success** | Latest revision reaches production |

> **Key point:** `Deploy #364 cancelled` does not mean the final deployment failed. The important check is whether the latest revision, `76e1a3e`, was successfully built and deployed by `Deploy #365`.

<Mermaid chart={`flowchart TD
    A[Commit A: 97ca593] --> B[Deploy #364]
    B --> C[Commit B: 76e1a3e]
    C --> D[Deploy #364 cancelled]
    C --> E[Deploy #365]
    E --> F[Build success]
    F --> G[Pages deploy success]

    classDef commit fill:#f8fafc,stroke:#64748b,color:#334155,stroke-width:1.5px
    classDef deploy fill:#ecfeff,stroke:#06b6d4,color:#155e75,stroke-width:1.5px
    classDef cancel fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef success fill:#ecfdf5,stroke:#10b981,color:#065f46,stroke-width:1.5px
    class A,C commit
    class B,E deploy
    class D cancel
    class F,G success
`} />

### A cancelled run is not automatically a deployment failure

The important state is not the previous run in isolation. **Treat the previous run and the latest revision as one deployment lifecycle.**

| Check | What to verify |
| --- | --- |
| **Previous run** | Was it `cancelled` rather than failed? |
| **Latest revision** | Was a new deployment run created? |
| **Latest build** | Did the latest revision build successfully? |
| **Latest deployment** | Did the Pages deployment complete successfully? |

In this case, the older run `#364` was cancelled, but a new `#365` run was created for the latest revision `76e1a3e`. The build completed successfully and Pages deployment followed.

## Why keep this in the migration record?

CI/CD incidents are easier to interpret when we look at the **revision-to-deployment lifecycle**, not just a single run status.

| Previous state | Latest state |
| --- | --- |
| `97ca593` | `76e1a3e` |
| Deploy `#364` | Deploy `#365` |
| **Cancelled / Superseded** | **Build ✅ → Deploy ✅** |

For repositories where `main` can receive consecutive changes, a `cancelled` run should be investigated together with the newer run before being classified as an incident.

This became another useful part of the Bun migration case study: the work was not only about changing runtimes, but also about understanding the real CI/CD execution boundaries and deployment lifecycle.
