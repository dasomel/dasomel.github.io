---
title: "Why we consolidated beluga-manager into the beluga monorepo"
description: "Two repositories joined by pins had drifted 118 commits apart, and cross-repo changes could not land atomically. This post summarizes the decision to fold beluga-manager into beluga's manager/ directory, the alternatives, and the consequences, based on ADR-0005."
pubDate: 2026-10-15
tags: ["Open Source", "Monorepo", "Architecture Decision", "CI/CD", "Beluga", "Platform Engineering"]
projects: ["beluga"]
featured: false
draft: false
---

On 2026-10-15, `dasomel/beluga-manager` was consolidated, with full history, into the `manager/` directory of `dasomel/beluga`. The decision is recorded in beluga's [ADR-0005](https://github.com/dasomel/beluga/blob/main/docs/adr/0005-consolidate-beluga-manager-into-monorepo.md); this post summarizes the background. The project description now lives on the site's [Beluga project page](/en/projects/beluga).

## Problem: two repositories held together by pins

`beluga` is a Bash/Helm/Python Kubernetes data platform; `beluga-manager` was a TypeScript/Node npm-workspaces control plane (`domain-api`, `policy-compiler`, `web`). They were coordinated through an umbrella workspace that is not itself a Git repository. Three things drove the decision.

- **Manager had no standalone deployment target.** Its upstream hosts are hardcoded `*.local.beluga.internal` names, its adapters are mostly stubs, and the chart and `Application` proposed by manager's own ADR-0005 were never implemented. It only made sense next to the platform.
- **The policy seam hung on a pin.** `policies/` YAML is compiled by manager's `policy-compiler` into `trino.rego` and the generated body of `db-roles.sql`, and test 14 diffs the result. But `ci.yml` and `release.yml` checked out beluga-manager at **two different pinned SHAs**, and the `ci.yml` pin (`a63db0b`) was **118 commits** behind manager's main at import (`93869de`). A compiler-contract change required a manual pin bump in a second repository, and that manual step had already been missed for 118 commits.
- **Cross-repo changes were not atomic.** A compiler change and its regenerated artifacts needed two PRs that could not be reviewed or merged together.

## Decision

1. Import beluga-manager, with full history, into `manager/`.
2. **D-MONO-1**: `manager/` keeps its own `package.json` and lockfile, with a `manager-ci.yml` workflow path-filtered to `manager/**` and an npm Dependabot entry for `/manager`. Beluga's workflows keep covering shared concerns such as docs, SAST, and supply chain.
3. **D-MONO-2**: test 14 and `ci.yml`/`release.yml` run the compiler from `manager/` in the same tree. The pinned checkout is removed.
4. **D-MONO-3**: this ADR supersedes manager's ADR-0005 (deployment and GitOps integration). A separate manager chart and `Application` are not pursued; if in-cluster deployment is needed, it will be decided in a new ADR under beluga's `docs/adr/`.

## Alternatives considered and rejected

- **Keep two repositories and bump the pin more often** — keeps the non-atomic change and the manual step, which had already been missed for 118 commits.
- **Publish the compiler as a versioned npm package** — adds a release pipeline for a tool with a single consumer.
- **Git submodule** — still a pin, and awkward for contributors and CI.

## Consequences

- A compiler change and the regenerated `trino.rego`/`db-roles.sql` land in one PR, so the seam gate cannot drift from the compiler.
- Manager still releases independently of the platform. CI is path-filtered, so beluga-only PRs do not run manager CI.
- Repository-wide checks (lint, validate, docs, research, SAST) now also see `manager/`. A check that duplicates a manager-owned equivalent is scoped out; a security scan never is.
- All 22 open beluga-manager issues were transferred to beluga #239-#260 with the `area:manager` label. The old-to-new mapping is in [this comment](https://github.com/dasomel/beluga/issues/239#issuecomment-6186301298).
- In OpenForge, manager's separate portfolio entry is folded into `beluga`. The `policy-compiler` capability moved into the root `.openforge/status.json`, and retiring the `beluga-manager` entry in the `dasomel/openforge` registry is tracked there.
- `dasomel/beluga-manager` was archived with a pointer to `manager/`.

## What changed on this site

Old addresses such as `/oss/beluga-manager/...` now have static notice pages that forward to the new locations (`/oss/beluga/manager-...`). Earlier posts are records of their time, so they were not rewritten; only a dated note was added where they describe a separate repository.

## What remains

Consolidation fixes a structural problem; it does not change manager's maturity. The default is still fixture responses, the read-only adapters are limited to Flink, Trino, and Lakekeeper, and authentication/authorization and cluster deployment do not exist yet. The current scope is as stated in the [Manager Overview](/oss/en/beluga/manager-overview).
