---
title: "🧭 Operating Seven OSS Projects as One Engineering Portfolio — Building a Common Standard with OpenForge"
description: "How Narwhal, Beluga, KubeMetal, kube-ready-box, ldapium, nfs-quota-agent, and OpenForge became one OSS Engineering Portfolio with shared engineering and supply-chain standards."
pubDate: 2026-08-20
tags: ["Open Source", "Engineering", "Platform Engineering", "Kubernetes", "Cloud Native", "Supply Chain", "GitHub", "AI-assisted Development"]
featured: false
draft: false
---

## Introduction

Over the past few months I have been developing several open-source projects in parallel. At first, I thought of them as independent repositories solving different problems.

As the portfolio grew, another problem became visible:

> **Building good code in each repository and operating several OSS projects as a sustainable engineering portfolio are very different problems.**

One repository may use a clean `Makefile`, while another has a canonical `packer/build.sh`. One may already have `SECURITY.md` and private vulnerability reporting while another does not. One may publish SBOM and provenance with releases while another has stronger license evidence but weaker release evidence.

I initially solved these differences independently. Eventually I realized that the same classes of problems were repeating.

So I changed the approach. I reviewed the portfolio against a shared Engineering Standard and compared actual files, GitHub Actions, Issues, release documentation, and supply-chain evidence.

That process led to a seventh project with a different role: **OpenForge**.

OpenForge is not another runtime or platform component. It is an **Open Source Project Blueprint & Engineering Standards** repository that standardizes repository structure, documentation, GitHub workflows, CI/CD, security, releases, localization, development tooling, AI-assisted development, and lifecycle practices.

Its purpose is not to make every project identical. Its purpose is to make different projects understandable through a common engineering language.

---

## 1. The Seven OSS Projects

The portfolio now looks roughly like this:

```text
                 OSS Engineering Portfolio
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
         OpenForge              Cloud / Platform OSS
              │                       │
              │          ┌────────────┼────────────┐
              │          ▼            ▼            ▼
              │       Narwhal       Beluga      KubeMetal
              │          │            │
              │          ▼            ▼
              │   Narwhal Portal   Data Platform
              │
              └──────────────┬────────────────────┘
                             │
                     Reusable Standards
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
    kube-ready-box        ldapium        nfs-quota-agent
```

### Narwhal

A Kubernetes-based Internal Developer Platform integrating GitOps, IAM/SSO, Service Mesh, Observability, Registry, Storage, Backup, Policy, API Gateway, and Portal capabilities.

### Beluga

A data platform connecting CDC, Kafka, Flink, Iceberg, Trino, Superset, Airflow, Kubernetes, and GitOps.

### KubeMetal

A hybrid MLOps desktop environment connecting Apple Silicon host compute with a Kubernetes control plane.

### kube-ready-box

An Ubuntu-based Vagrant Box that packages Kubernetes prerequisites and OS tuning into a reproducible development environment.

### ldapium

An OpenLDAP project that builds upstream OpenLDAP and packages the image, UI, and Helm chart as one operational path.

### nfs-quota-agent

A Kubernetes agent connecting NFS filesystem project quotas with Kubernetes PersistentVolumes, with Helm, multi-arch images, releases, SBOM, and vulnerability scanning.

### OpenForge

OpenForge sits at a different layer. It does not run the applications above. It defines the engineering foundation used to create, evolve, and maintain OSS repositories.

Its standards cover repository, documentation, GitHub, development, tooling, security, CI/CD, release, internationalization, OSS compliance, reference practices, and reference metrics.

OpenForge provides defaults and vocabulary rather than a mandatory stack. Projects can adopt what fits and document intentional deviations through ADRs.

---

## 2. OpenForge Changed the Question

With six repositories, the questions were mostly repository-specific:

```text
Does the repo have SECURITY.md?
Does the release artifact contain an SBOM?
What is the canonical build entrypoint?
```

Adding OpenForge changed the question:

> **Not only “does this repository have the feature?”, but “how do we define this engineering expectation consistently across the portfolio?”**

A `SECURITY.md` file is easy to add. A trustworthy security lifecycle is not.

```text
Security policy
    ↓
Private reporting
    ↓
Credential protection
    ↓
Dependency / image scanning
    ↓
Release integrity
    ↓
Known limitations
```

OpenForge exists to capture that broader intent.

---

## 3. Taxonomy Before Feature Lists

The first useful artifact was not a feature list. It was a portfolio taxonomy:

```text
Foundation
Platform
Data
Security
Observability
Developer Experience
AI / MLOps
Supply Chain
Release
Documentation
Integration
```

The goal is not to force every repository into the same architecture. The goal is to make very different repositories comparable using the same engineering language.

OpenForge connects that language to concrete repository standards.

---

## 4. The Shared Eleven-Area Checklist

As of August 20, 2026, the portfolio audit is organized around eleven areas:

```text
1. Repository Governance
2. Build / Dependency Reproducibility
3. Common Make / Command Vocabulary
4. GitHub Actions / CI
5. Security Engineering
6. License / Third-party Governance
7. SBOM / Provenance
8. Release Management
9. Test / Quality Conformance
10. Offline / Reproducibility
11. Cross-OSS Contract
```

The checklist started as an audit document and issue index. OpenForge turns it into a reusable engineering foundation through its reference practices and maturity metrics.

The loop is now:

```text
Actual OSS projects
      ↓
Issues / CI / release evidence
      ↓
Engineering Standard
      ↓
OpenForge
      ↓
New project bootstrap
      ↓
Real-world feedback
      ↓
OpenForge improvement
```

The standard is therefore not a fixed constitution. It is a repository that evolves through actual engineering evidence.

---

## 5. Repository Governance

The baseline includes:

```text
LICENSE
NOTICE or third-party attribution
SECURITY.md / private reporting
CONTRIBUTING.md or equivalent
CHANGELOG.md
RELEASING.md or a reproducible release procedure
Supported versions / EOL policy
Public repository security settings
```

The audit also showed why standards must allow justified differences.

For example, kube-ready-box uses Packer and `build.sh` rather than a single Makefile. That is not a quality problem when the build interface is explicit, documented, and used consistently by CI.

OpenForge therefore standardizes engineering intent rather than forcing identical filenames.

---

## 6. Build and Reproducibility

The key question remains:

> **Can someone clone the repository and reproduce the same build?**

The audit checks:

```text
canonical build entrypoint
help / usage
single source of truth
dependency pinning
clean checkout build
architecture matrix
artifact ↔ source revision
false-green prevention
local ↔ CI parity
```

The implementation differs across the portfolio:

```text
ldapium / nfs-quota-agent / Beluga / Narwhal
                 │
                 └─ Make-oriented

KubeMetal
  └─ Make + Cargo + pnpm

kube-ready-box
  └─ Packer + build.sh
```

The portfolio standard therefore does not require `make` everywhere. It requires one clear canonical build interface used consistently by developers and CI.

---

## 7. CI, Security, and Supply Chain

The common CI model is:

```text
validate
   ↓
test
   ↓
security
   ↓
license
   ↓
sbom
   ↓
build
   ↓
package
   ↓
e2e
   ↓
release
   ↓
attest
```

Not every project needs every stage. What matters is that the required stages are explicit.

One rule is especially important:

> **A required sub-check must not fail while the overall CI still reports success.**

AI-assisted development makes this more important. Faster implementation means a single false-green condition can propagate across more repositories more quickly.

OpenForge keeps CI/CD, security, and release expectations reusable without pretending that a VM image, desktop application, data platform, and Kubernetes agent have identical test models.

---

## 8. AI-Assisted Development Makes Standards More Important

AI agents can modify repositories much faster than one engineer working manually. They can update files, workflows, Issues, dependencies, release notes, and documentation in one session.

That means the engineering boundary becomes more important, not less:

```text
AGENTS.md / project instructions
            ↓
repository-local policy
            ↓
implementation
            ↓
CI / security / release validation
            ↓
evidence
```

OpenForge includes AI-assisted development in its tooling guidance not to standardize one model, but to preserve repository discipline while using AI.

---

## 9. OpenForge Is a Standardization Layer

The role of each project is now clearer.

Narwhal builds a platform.

Beluga builds a data platform.

KubeMetal builds a local MLOps environment.

kube-ready-box builds an infrastructure foundation.

ldapium provides an identity component.

nfs-quota-agent provides a storage integration component.

**OpenForge standardizes the engineering practices that repeat across all of them.**

That also changes how OpenForge should be evaluated.

The important questions are not only stars or feature count:

```text
Is the standard actually used in real repositories?

Does it reduce repeated work?

Does it improve CI quality?

Is release evidence more consistent?

Does it reduce bootstrap time for new projects?

Does feedback from real projects improve the standard?
```

In that sense, OpenForge is close to an **engineering control plane for the OSS portfolio**.

---

## 10. What Comes Next

The direction is not to make OpenForge a rigid framework.

It is to keep validating it against real projects.

```text
OpenForge
   ↓
Bootstrap / Standard
   ↓
Narwhal / Beluga / KubeMetal / ...
   ↓
Actual Issues / CI / Releases
   ↓
Audit / Metrics
   ↓
OpenForge improvement
```

When a new repository is created, common governance, CI/CD, security, release, localization, and tooling problems should not have to be solved from zero.

At the same time, when a project finds a genuinely new problem, that experience should flow back into OpenForge.

---

## Conclusion

The biggest lesson from this portfolio is that operating multiple OSS projects is not simply a matter of having more repositories. It means operating an engineering system.

The goal is not to make seven repositories look identical.

The goal is to keep each project's architecture and purpose flexible while sharing a common language for:

- repository quality
- CI trustworthiness
- release evidence
- security and supply-chain verification
- AI-assisted development boundaries

OpenForge is becoming the bridge between those shared expectations and the actual engineering workflow.

As the portfolio grows, I increasingly believe that **making more code is less important than making the code we already have repeatable, verifiable, and maintainable**.
