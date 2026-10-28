---
title: "AI Agents and Vertical Integration of a Kubernetes Platform: Talk Notes"
description: "A write-up of the talk at Kubernetes Korea Group Meetup, Session 2 on October 28, 2026. Project roles seen through a Day-0/1/2 frame, the OpenForge verification system, outside-developer cases, and failures of an AI agent team."
pubDate: 2026-10-28
tags: ["Kubernetes", "Platform Engineering", "AI Agent", "Seminar", "Open Source", "Evidence"]
projects: ["kube-ready-box", "narwhal", "nfs-quota-agent", "narwhal-portal", "clusterdeck", "openforge", "kubemetal"]
featured: false
draft: false
---

On Wednesday, October 28, 2026 at 19:00, I am giving "Vertical Integration of Kubernetes Platform Engineering with AI Agents" in Session 2 of the Kubernetes Korea Group meetup. The subtitle is "from building the cluster to operations tools, developer experience, and verification". This post publishes the slide material as text ahead of the talk. It is not a recap of how the talk went.

[View the slides](https://cne.io.kr/slides/k8s-platform-vertical/#1) · The deck is in Korean and has 55 slides. Numbers and statuses follow the reference dates written on the slides.

## The problem: a platform needs more than installation

Bringing up a cluster is only the start. Infrastructure preparation, cluster installation, networking, storage, authentication, a developer portal, and operations tools all have to connect before it is a platform. Components that each work well start to fail once they are connected: Keycloak OIDC claims, APISIX authentication, service routing, Istio ambient mTLS. Every seam where DNS, TLS, identity, startup order, and version compatibility meet is a candidate for failure, and every upgrade means verifying again.

So the talk treats the seam as a product boundary and follows an approach that turns incident records into regression checks.

## The Day-0/1/2 frame and the vertical integration map

I split the platform lifecycle into three stages. The frame is my own classification, and each entry comes from features listed in the project documents.

| Stage | Meaning | Projects |
|---|---|---|
| Day-0 | Design, environment preparation | Kube-Ready-Box, Narwhal (air-gap bundle) |
| Day-1 | Installation, configuration | Narwhal (installs 35 apps), ClusterDeck (SSH bootstrap) |
| Day-2 | Operations | Narwhal (verification, upgrade gate), NFS Quota Agent, Narwhal Portal, ClusterDeck |
| Whole span | Standards, verification, evidence | OpenForge |

The vertical integration map stacks these from the bottom up. Infrastructure (Kube-Ready-Box) sits at the base, then the platform and cluster (Narwhal), storage (NFS Quota Agent), and developer and operator experience (Narwhal Portal, ClusterDeck). The verification system (OpenForge) cuts across every layer.

## Role of each project

### Kube-Ready-Box (Day-0)

It is not a Kubernetes installer. It turns the state "before Kubernetes goes up" into an image. Packer pre-configures a Ubuntu base image for Kubernetes and ships it through Vagrant Cloud, so several projects reuse the same OS baseline. The image carries swap disabled, kernel modules (`br_netfilter`, `overlay`, `iscsi_tcp`), IP forwarding, conntrack tuning, a `/sys/fs/bpf` mount, storage prerequisite packages, chrony time sync, and security hardening. The latest is v1.1.0 (2026-07-19).

### Narwhal (Day-0 to 2)

Installing dozens of Cloud Native projects separately makes failures recur at the seams. Narwhal integrates 35 GitOps-managed applications into one reproducible IDP. The slide numbers are below (main as of 2026-10-27).

- 35 GitOps-managed apps
- 442 documented incidents
- 394 regression checks
- 1,225 commits (2026-02-08 to 10-26)

The slide frames the commit count not as bragging but as operational evidence that the integration complexity was verified repeatedly. Verification has three layers: Cluster Verification 120+, SSO Verification 49, and Regression 394, and CI runs a 51-check suite on every push. Air-gapped installation is treated as an operating scenario, with per-architecture offline bundles (104 images, 27 charts) built and verified.

The core idea is **Knowledge as Tests**. An incident is kept as a root cause, a discriminator that tells it apart from similar failures, and a regression check, which becomes a gate for the next upgrade. Failed approaches are recorded too.

The latest v1.3.0 (2026-10-22) is a security hardening release, with a bundle integrity chain, a smaller trust boundary, and supply-chain CI gates. The known issues from the release notes are copied onto the slide as they are: the Kyverno image-signing policy is still Audit-only and blocks nothing, mesh-wide PERMISSIVE remains during bootstrap, and the OpenBao raft snapshot encrypted backup is not enabled on any cluster and its live behavior is unverified.

### NFS Quota Agent (Day-2 storage)

For NFS-backed PersistentVolumes, the PVC capacity does not automatically become a limit on real filesystem usage, so one workload can exhaust shared storage. This project runs as a DaemonSet on the NFS server node, watches PVs, and applies filesystem Project Quota automatically to enforce real usage on XFS, ext4, and Btrfs. The quota commands must run on the server's local filesystem, not on an NFS client.

It is currently Beta (v0.5.0, 2026-09-22). The core quota path is verified in CI on a real Linux kernel, but unit tests stub the external quota commands, so they do not prove enforcement by a real kernel. The QuotaPolicy CRD (v1alpha1) may change incompatibly before v1.0, and on ext4 a root writer can bypass the hard limit, so root_squash and non-root workloads are recommended.

### Narwhal Portal (Day-2 experience)

GitOps, SSO, monitoring, storage, and security each have their own UI. The Portal gathers status, applications, nodes, catalog, security, cost, and governance in one Next.js portal. The design principle is that source systems (Argo CD, Kubernetes, Keycloak) stay authoritative, and the Portal does not copy state, only queries and correlates. The latest is the v1.1.4 (2026-10-27) patch release. The code moved to `portal/` in narwhal, and dasomel/narwhal-portal is archived.

![Narwhal Portal dashboard](/slides/k8s-platform-vertical/img/portal-dashboard.png)

### ClusterDeck (Day-2 access)

When you create and delete local VMs and Kubernetes environments often, IPs change and you must reconnect SSH aliases, ProxyJump, kubeconfig, and context names by hand every time. ClusterDeck is a macOS desktop app that ties host discovery, SSH bootstrap, alias and ProxyJump, kubeconfig fetch and normalization, and a connectivity check into one Profile-centered flow. It is a workstation access layer that keeps access paths working, not a management console, and it only touches files it owns. v0.5.0 (2026-10-26) is an unsigned build.

### Related project: KubeMetal

A hybrid MLOps desktop app for Apple Silicon: the Kubernetes control plane runs in a Colima-based VM and GPU compute runs on the macOS host with MLX. It is not part of the same platform line as the five above. It appears as a consumer of Kube-Ready-Box, so the ecosystem map on the slides draws it with a dotted line.

## OpenForge: keeping description and implementation aligned

As OSS projects multiply, each repository's documents, CI, security, agent instructions, and release state evolve differently, and description, implementation, and verification evidence drift apart. OpenForge makes this reproducible and verifiable with shared Standards and Templates, executable audits, an evidence-driven agent workflow, and a lifecycle registry. Its definition of "done" is the core. Generated or merged code is not done. Done means it works inside the intended boundary, is verified with suitable evidence, and its release and rollback impact is understood.

### Evidence classes

Evidence has classes, and a lower class must not make a higher claim. The Rust CLI `openforge assess` looks at L1 Repository, L2 Execution, and L3 Runtime.

| Evidence | What it cannot prove |
|---|---|
| Unit / Stub | Behavior of a real kernel or cluster |
| Build / Type check | Success of real side effects |
| Integration | Properties of the whole environment |
| Runtime / E2E | A guarantee for every environment |
| Post-state | Safety of unrelated resources |

Even when a stub test is green, you cannot say a real kernel enforced the quota. AI only interprets the report and never changes scores or PASS/FAIL. Where agents actually exist, what gets approved is not the natural-language intent but the "resolved invocation that will actually run". Projects without agents (nfs-quota-agent, LDAPium, ClusterDeck) did not get one forced in, and only a reduced profile is defined.

### Portfolio KPIs

The slides define the three dashboard KPIs with their denominators and targets (registry snapshot of 2026-09-24).

- **13 projects**: registered projects with a designated maintainer (11 active, 2 maintenance). The bar is zero ownership gaps.
- **96.9% standards maturity**: the score OpenForge itself earns on the 32 applicable indicators (62/64).
- **61.6% adoption**: the pooled 554/900 score of the Wave 1 audit, against a 70% target. The later Wave 2 audit reads 70.6%, but the dashboard still publishes the earlier snapshot, and the slide states that the two numbers are separate.

![OpenForge portfolio control plane](/slides/k8s-platform-vertical/img/openforge-ko-oss-dashboard.png)

## Outside developer cases

Outside developers are named only by GitHub handle, and statuses follow the slide's 2026-10-26 reference date. First, a caveat: most design issues are still open. **Adoption or collaboration is not confirmed**, and some comments are introductions tied to the commenters' own projects.

### openforge#128: a design contribution becomes a live dashboard

@saniya-malik contributed a Figma reference design for the portfolio dashboard, an optional task in OpenForge issue #128 (volunteered 10-08, design 10-12). After review the issue was closed on 10-13, and the same day dasomel.github.io PR #381 was merged, producing the live dashboard on cne.io.kr. Since only the design was contributed, runtime dependencies and the data contract did not change, and the source of truth remains `portfolio/dashboard.json`. A small UI mismatch was fixed as well: an avatar showing initials looked like a Contributor label and was replaced with a generic icon (PR #386).

### kube-ready-box#79: from bug report to closure

On 2026-10-18, @Evantage-WS reported that the 26.04 box drops into a dracut emergency shell on VirtualBox (macOS 27, M4). It was closed on 10-26 (8 days). The first reply came 4 days after the report.

- It was reproduced and the scope narrowed. A box built in July also failed on the same host, so it was narrowed to a host-side regression rather than a recent change.
- A cause candidate and a workaround were given: three commands switching SATA (AHCI) to NVMe, and the reporter confirmed a login prompt after the NVMe change.
- What could not be confirmed was stated. NAT SSH failed even on a healthy 24.04 box, so `vagrant up` completion was not confirmed.
- The template fix went into PR #80 and the mistakes-log, but PR #80 was merged on 10-26. A full rebuild with the new template and a completed `vagrant up` have not been verified yet.

### Other discussions

On narwhal#73, @Aliipou proposed one-time, action-bound grants and a PEP. The separation of PDP, signer, PEP, and executor was written into the issue and reflected in OpenForge ADR-0013 (openforge#78, merged). Narwhal#73 itself is still open. On the same issue, @23A91A6183 proposed a signed hash-chain evidence log, now waiting for design review. On narwhal#155 and #372, @ozereray left verification proposals on tool permissions, approval, and execution evidence, and both are open. On kubemetal#84 (open), @Lulzx, a CuMetal maintainer, offered support when issues are reported. @iamroseyoung's narwhal PR #4 added a step-by-step verification guide (`docs/evaluation`) and was merged.

## How the AI agent team works

A human holds the goals and approval, and an orchestrator hands work to implementation, critique, research and generation, and verification workers. Every result returns to the orchestrator in a hub-and-spoke shape, and linters, CI, regression tests, and the lessons-log enforce deterministically underneath. Authoring and review are separate, at most 5 run in parallel, and lanes that touch the same files are split by worktree. Instructions are a means of control, not a security boundary.

### A day's real flow

The slides show the flow right after the narwhal v1.3.0 release on 2026-10-22 to 23, from the public GitHub record (dasomel.github.io PR #408). The shared clone sat on another branch, so six documentation files were edited in an isolated worktree based on origin/main, and the orchestrator re-checked the README numbers itself instead of trusting the lane report. `bun test` passed 17, lint reported 0 errors, the build ran, and CI passed. **The human meant to hold the deploy back, but the repository's auto-merge workflow merged PR #408 first**, and the Pages deploy followed. The lesson is that a decision the human should hold has to be checked together with the automation settings.

### Moments when a green light lied

| What it looked like | What it really was | Rule learned |
|---|---|---|
| Stub tests green | Does not prove real prjquota enforcement | A lower evidence class must not claim a strong runtime property |
| RuntimeClass YAML is in the repo | Not an actual sandboxed run | Split into declared, supported, effective, verified |
| Validator fails but echo prints success | echo-branch false-green | Audit with swallowed_failure_detector |
| v0.4.0 looked like a finished release | Partial release from a cosign GHCR login failure | Confirmed a full release at v0.4.1 to v0.4.3 |
| ext4 quota applied | A root writer can bypass the hard limit | Document the limit, recommend root_squash and XFS |

The most painful failure was a line `PASS T03 all ArgoCD apps Synced+Healthy` while there were actually zero ArgoCD apps. Images could not be pulled, the push failed, and the service returned 503. The check did not lie. With zero examinees, "everyone passed" is a true sentence. The stage script printed `WARN` and carried on, and the fix was to count the apps first and FAIL below a threshold (narwhal regression-check T03). A related incident on this site on 2026-08-07: a scheduled run that started 276 minutes late collected an already published digest again (23 items down to 18) and replaced it, while every workflow stayed green. That is why the guard is in two layers and no silent no-op is allowed.

## Lessons

Cut down to four sentences, they are the standard for using AI's speed while keeping reliability.

1. Implementation capability is not execution authority.
2. A completion claim is not evidence.
3. A lower evidence class must not claim a stronger runtime property.
4. Merged code is not portfolio completion until verified state is published.

The more an agent implements, the more a human's responsibility moves rather than disappears. Architecture and product direction, permission and risk boundaries, judging whether the evidence is enough, maintainability and community, exception handling, and release and rollback decisions stay with the human. The goal is not an autonomous repository but one verified by evidence and run under human stewardship.

## Wrap-up

Connect (from Kube-Ready-Box through Narwhal, NFS Quota Agent, Portal, and ClusterDeck), verify (incidents become regression checks, agent execution becomes approval of a resolved invocation, completion becomes evidence plus published state), and leave it behind (models change, but rules, architecture, tests, and operating knowledge stay in the repository). In one sentence: not simple code generation but a verifiable engineering system.

## Links

- [View the slides](https://cne.io.kr/slides/k8s-platform-vertical/#1)
- [OSS overview](https://cne.io.kr/oss/) · [GitHub](https://github.com/dasomel) · [Narwhal](https://github.com/dasomel/narwhal) · [OpenForge](https://github.com/dasomel/openforge)
- Questions and issues are welcome through GitHub Issues.
- A post on the same question with other cases: [Soongsil Guest Lecture Recap: What Humans Should Hold in the Age of AI Agents](/en/posts/soongsil-ai-agent-human-developer-2026/)
