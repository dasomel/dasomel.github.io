---
title: "🧭 Operating Six OSS Projects as One Engineering Portfolio"
description: "How I reviewed six OSS repositories against real files, GitHub Actions, Issues, and release evidence and converged them on a shared engineering and supply-chain standard."
pubDate: 2026-08-20
tags: ["Open Source", "Engineering", "Platform Engineering", "Kubernetes", "Cloud Native", "Supply Chain", "GitHub", "AI-assisted Development"]
featured: false
draft: false
---

## Introduction

Over the past few months I have been developing several open-source projects in parallel.

At first, I thought of them as independent repositories solving different problems.

As the portfolio grew, another problem became visible:

> **Building good code in each repository and operating several OSS projects as a sustainable engineering portfolio are very different problems.**

One repository may use a clean `Makefile`, while another has a canonical `packer/build.sh`. One may already have `SECURITY.md` and private vulnerability reporting while another does not. One may publish SBOM and provenance with container images while another has strong license evidence but weaker release evidence.

I initially solved these differences independently in each repository. Eventually I realized that the same classes of problems were repeating.

So I changed the approach.

I reviewed all six OSS projects against a shared Engineering Standard and compared the actual files, GitHub Actions, Issues, and release documentation. The goal was not to make every repository identical, but to make the portfolio understandable through a common engineering language.

---

## 1. The six OSS projects

The portfolio currently includes:

```text
                 OSS Engineering Portfolio
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   kube-ready-box     Narwhal         KubeMetal
        │                │                │
        │                ▼                │
        │          Narwhal Portal         │
        │                                  │
        └──────────────┬───────────────────┘
                       │
               Cloud Native / Platform
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
         Beluga              ldapium
             │
             ▼
      Data / Platform      nfs-quota-agent
```

### Narwhal

A Kubernetes-based Internal Developer Platform integrating GitOps, IAM/SSO, Service Mesh, Observability, Registry, Storage, Backup, Policy, API Gateway, and Portal capabilities.

### Beluga

A data platform connecting Kafka, CDC, Flink, Iceberg, Trino, Superset, Airflow, Kubernetes, and GitOps.

### KubeMetal

A hybrid MLOps desktop environment connecting Apple Silicon host compute with a Kubernetes control plane.

### kube-ready-box

An Ubuntu-based Vagrant Box that packages Kubernetes prerequisites and OS tuning into a reproducible development environment.

### ldapium

An OpenLDAP project that builds upstream OpenLDAP and packages the image, UI, and Helm chart as one operational path.

### nfs-quota-agent

A Kubernetes agent connecting NFS filesystem project quotas with Kubernetes PersistentVolumes.

The repositories solve different problems, but they share an engineering lifecycle.

---

## 2. Why a common Engineering Standard?

With six repositories, the same questions started appearing repeatedly:

```text
Does the repo have SECURITY.md?

Does the release artifact include an SBOM?

What is the canonical build entrypoint?

Does CI run the same commands as local development?

Is there a smoke test before release?

Can an artifact be traced back to a source revision?

Do license evidence and SBOM share the same release identity?

Can the project be reproduced offline?
```

Solving each problem separately fixes the symptom but does not define what “ready” means.

The missing piece was therefore not another feature. It was a **shared vocabulary and definition of done**.

---

## 3. Taxonomy before feature lists

The first useful artifact was a portfolio taxonomy:

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

The goal is not to force every repository to implement the same architecture.

The goal is to make very different repositories comparable using the same engineering language.

---

## 4. The shared eleven-area checklist

As of August 20, 2026, the six repositories were reviewed against eleven areas:

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

The checklist is not merely a document. It is used as an audit index for actual Issues and repository evidence.

---

## 5. Repository Governance

The first area asks whether the repository is trustworthy and understandable as an open-source project.

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

For example, a project using `packer/build.sh` as its canonical build entrypoint should not be considered incomplete simply because it lacks a Makefile.

The standard should describe the engineering intent rather than mandate one filename.

---

## 6. Build and reproducibility

The key question is:

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

The portfolio standard therefore does not require `make` everywhere. It requires one **clear canonical build interface** used consistently by developers and CI.

---

## 7. Common command vocabulary

I want the repositories to share a useful vocabulary wherever possible:

```text
help
fmt
lint
validate
test
security
license
sbom
build
package
e2e
clean
release
attest
```

The implementation can differ.

What matters is that a developer can move from one repository to another and quickly understand which commands represent the same engineering intent.

Aliases and documentation are often better than forcing all projects into one toolchain.

---

## 8. CI and false-green prevention

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

Not every project needs every stage.

A VM image project and a desktop application cannot share the same E2E model. The important question is whether the required stages for that repository are clearly defined.

One rule is especially important:

> **A required sub-check must not fail while the overall CI still reports success.**

False-green behavior hides engineering risk and makes an otherwise impressive pipeline less trustworthy.

---

## 9. Security, license, SBOM, and provenance

Security is broader than finding vulnerable source code.

The portfolio standard covers:

```text
secret scanning / push protection
credential exposure prevention
dependency vulnerability scanning
container / image scanning
GitHub token least privilege
release integrity
private security reporting
known limitations
signed / attested release status
```

Supply-chain evidence matters as well:

```text
Source revision
      ↓
Build
      ↓
Artifact
      ↓
SBOM / provenance
      ↓
Release identity
```

The standard explicitly distinguishes **current implementation from target state**. A repository may already have strong SBOM and provenance while still having signed releases on the roadmap.

That distinction makes the portfolio more honest and easier to improve.

---

## 10. Offline and reproducibility requirements

Several of these projects are designed for environments where internet access cannot be assumed.

That changes what “works on my machine” means.

The standard therefore asks:

```text
Can dependencies be resolved deterministically?
Can images be mirrored?
Can a release be rebuilt offline?
Are required artifacts documented?
Is external service dependency explicit?
```

Air-gapped support is not a single feature. It is a property of the entire supply chain.

---

## 11. Cross-OSS contracts

The final area asks how the repositories relate to each other.

For example:

```text
kube-ready-box
       ↓
    Narwhal
       ↓
Narwhal Portal

Beluga
  ↕
shared platform / data concepts

ldapium
  ↓
identity services

nfs-quota-agent
  ↓
storage contract
```

Once several repositories form an ecosystem, release changes in one repository can become integration changes in another.

That means the portfolio needs explicit contracts around compatibility, supported versions, and integration tests.

---

## Conclusion

The main lesson from this audit is that a multi-repository OSS portfolio needs a different definition of quality from an individual project.

The goal is not to make six repositories look identical.

The goal is to make them **consistently understandable, reproducible, secure, and maintainable while preserving the architecture appropriate to each project**.

AI-assisted development makes implementation faster, but it also increases the number of changes one engineer can introduce across multiple repositories.

That makes shared engineering standards more useful, not less.

The checklist is therefore becoming part of how I decide whether an OSS project is ready for the next stage of development.
