---
title: "External Cluster Integration"
description: "The two tiers for attaching KubeMetal to an existing Kubernetes cluster — agent-only by default (L1) and opt-in full-stack deployment (L2), plus the GitOps path and air-gap support"
project: "KubeMetal"
order: 503
lastModified: 2026-07-30
---

## Integration Tiers — Agent-Only by Default

The stack's home is the app's own k3s (Colima). An existing external cluster is, by default, connected only as a **target for observation, diagnostics, and operations** — nothing inside that cluster may depend on the Mac's local stack.

| Tier | Scope | Installed in the cluster |
|------|-------|--------------------------|
| **L1 — agent-only (default)** | observe / diagnose / operate | kagent CRDs + agents. No bridge |
| **L2 — full stack (opt-in)** | places the MLOps stack in the external cluster | dedicated `kubemetal` namespace + host bridge |

L1 is the default because of a measurement: L2's onboarding cost — verifying terminal paths, mirror registries, adjusting ArgoCD boundaries — repeats in proportion to the number of clusters.

## L1 — Agent-Only (default path)

```bash
make kagent-up CONTEXT=<kubeconfig-context>   # installs kagent 0.9.12 via helm (kagent ns)
```

Then use the app's **kagent Operations** tab for per-context diagnostics and to toggle agents (security / promql / observability). The kagent UI opens on 8090 via `make forward`.

This path was verified on a live 6-node K3s HA cluster (Narwhal) — measured in-app from preflight through kagent diagnostics using a signed packaged app (2026-07-30).

## L2 — Full-Stack Deployment to an Existing Cluster (opt-in)

The advanced path: put the MLOps stack on an existing Kubernetes cluster instead of bringing up Colima. **The cluster is configuration, not a constant** — the render script owns every per-target substitution (namespace, bridge, StorageClass, image registry), and `scripts/k8s/kustomization.yaml` is the only manifest list.

External clusters get their own dedicated `kubemetal` namespace rather than `default`; `default` stays Colima-only.

<Mermaid chart={`flowchart TB
  PF["1. make preflight<br/>reachability / StorageClass / ArgoCD / Kyverno / bridge candidates"]
  RD["2. make render<br/>inspect output without applying"]
  GATE{"BRIDGE_HOST<br/>verified?"}
  REJ["render refuses<br/>(prevents leaking a Colima-only address)"]
  ARGO{"Does ArgoCD own<br/>the target ns?"}
  PV["3a. make provision<br/>direct apply"]
  GO["3b. make export-gitops<br/>writes files only"]

  PF --> RD --> GATE
  GATE -->|"no"| REJ
  GATE -->|"yes"| ARGO
  ARGO -->|"no"| PV
  ARGO -->|"yes"| GO

  style PF fill:#eff6ff,stroke:#2563eb,color:#111
  style RD fill:#eff6ff,stroke:#2563eb,color:#111
  style GATE fill:#fffbeb,stroke:#d97706,color:#111
  style REJ fill:#fef2f2,stroke:#dc2626,color:#111
  style ARGO fill:#fffbeb,stroke:#d97706,color:#111
  style PV fill:#f0fdf4,stroke:#059669,stroke-width:2px,color:#111
  style GO fill:#f0fdf4,stroke:#059669,stroke-width:2px,color:#111
`} />

### 1. Preflight

Verifies reachability, the default StorageClass, any ArgoCD Application owning the target namespace, Kyverno Enforce policies, and host bridge candidates — all by measurement.

```bash
make preflight CONTEXT=<context> NAMESPACE=kubemetal
```

### 2. Render check

Inspect the result without applying it.

```bash
make render CONTEXT=<context> BRIDGE_HOST=<host-ip> STORAGE_CLASS=<SC>
```

`BRIDGE_HOST` must be **an address from step 1 whose reachability was actually verified**. Omitting it makes the render refuse: without it, a Colima-only address would ship through and the pods would die quietly. An unverified bridge address refuses to render rather than deploying a guess.

### 3. Apply

```bash
make provision CONTEXT=<context> BRIDGE_HOST=<host-ip> STORAGE_CLASS=<SC>
```

This full-stack path was verified on that same 6-node cluster through Kyverno Enforce policies, a private mirror registry (bypassing Docker Hub pull limits), and ArgoCD GitOps with its selfHeal boundary (2026-07-26, terminal path).

## Internal Registry / Mirror

For closed networks, or clusters hitting Docker Hub anonymous pull limits, set `IMAGE_REGISTRY` to redirect Docker Hub images.

```bash
make provision CONTEXT=<context> BRIDGE_HOST=<host-ip> IMAGE_REGISTRY=<host[/project]>
```

## When ArgoCD Owns the Target Namespace

A direct apply gets reverted by selfHeal. Use the GitOps path instead — KubeMetal **writes files only and never pushes to Git.**

```bash
make export-gitops NARWHAL_DIR=/path/to/narwhal CONTEXT=<context> BRIDGE_HOST=<host-ip>
```

Pushing and syncing stay the GitOps repository owner's call.

## Why Code Signing Matters

Reaching a LAN cluster from the packaged app **requires stable code signing.** Ad-hoc signing changes the identifier on every build, so the macOS local network permission never sticks and LAN kubectl is blocked with `no route to host`.

- If a valid codesigning identity exists in the keychain, `make app` signs with it automatically. For this Mac alone, a self-signed certificate is sufficient (measured 2026-07-29).
- Distribution to others needs a Developer ID.

```bash
make app SIGNING_IDENTITY="Developer ID Application: …"
```

## Air-Gap Support

The **Air-Gap Management** tab downloads offline bundles (images, charts, binaries) ahead of time for transfer into a closed network, then performs offline installation and asset version verification. Offline startup itself is verified by a separate gate.

```bash
make verify-airgap
```

## Troubleshooting

```bash
kubectl --context <context> get pods -n kubemetal
kubectl --context <context> get application -A | grep kubemetal   # check ArgoCD ownership
```

Related: [Architecture](/en/docs/kubemetal-architecture) · [Usage](/en/docs/kubemetal-usage)
