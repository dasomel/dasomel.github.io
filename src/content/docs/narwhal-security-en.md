---
title: "Security & SSO"
description: "Integrated authentication based on Keycloak OIDC and cluster-wide security hardening"
project: "Narwhal"
order: 104
lastModified: 2026-07-17
---

## Single Sign-On (SSO)

Narwhal provides Single Sign-On (SSO) across all major components in the cluster, powered by **Keycloak OIDC (OpenID Connect)**. The SSO integration is applied in different ways depending on the application capabilities.

| Integration Type | Target Applications | Description |
|------------------|---------------------|-------------|
| **Native SSO (Group A)** | ArgoCD, Grafana, Gitea, Harbor, Headlamp, OpenBao | Applications that have native OIDC/OAuth support and communicate directly with Keycloak. |
| **APISIX OIDC (Group B)** | Hubble UI, Prometheus, Alertmanager, Velero UI | For applications that do not support native SSO, the APISIX API Gateway uses the `openid-connect` plugin to handle authentication at the gateway level. |
| **Browser PKCE (Group C)** | Kubernetes Dashboard | Uses browser-based PKCE (S256) flow to securely exchange tokens without a client secret. |

All authenticated traffic is configured to trust the internal Narwhal Root CA. Dedicated Keycloak Clients and secret mappers (Audience, Groups, etc.) are automatically created for each service.

## Security Components

The following tools handle cluster-wide secret management, policy enforcement, and certificate issuance:

- **OpenBao:** The central secrets manager for the platform. It uses OIDC for UI access control and provides Kubernetes-auth-based dynamic secret injection.
- **Kyverno:** A Kubernetes-native policy engine that enforces Admission and Background policies across the cluster (operates in a fail-closed manner).
  - **One deliberate exception**: Chaos Mesh's `chaos-daemon` requires `privileged` + `hostPID` to inject faults into other pods' network/IO namespaces (hardcoded in the chart's DaemonSet — not a values toggle). It is therefore excluded from the `disallow-privileged-containers` / `disallow-host-namespaces` policies **for the `chaos-testing` namespace only**. See [Testing & Chaos Engineering](/en/docs/narwhal-testing) for details.
- **cert-manager:** Automates the issuance and renewal of TLS certificates via `ClusterIssuer` and `Certificate` CRDs. It manages the internal Root CA and wildcard certificates for `*.local.narwhal.internal`.

## Compliance Hardening

Narwhal is hardened by default to comply with the CIS Benchmark (1.23), NSA (1.0), and Pod Security Standards (PSS) guidelines.

- **Control-plane Protection:** Disabled profiling (`--profiling=false`) on the Kube API Server, Controller Manager, and Scheduler to prevent information leakage.
- **Secret Encryption (At Rest):** All Kubernetes Secrets are encrypted at rest using the `aescbc` provider, and the encryption key is shared across all 3 Master nodes.
- **API Audit Logging:** Applied `--audit-policy-file` to record metadata logs for critical RBAC and Secret access while dropping basic health-check traffic.
- **Node File Permissions:** Restricted permissions on kubelet config files and static pod manifests to `chmod 600`.
- **Workload Least Privilege:** Workloads like the Portal and Valkey are enforced with `runAsNonRoot`, all capabilities dropped, `allowPrivilegeEscalation: false`, and `seccompProfile: RuntimeDefault`.

> **Risk-Accepted Exceptions:** Essential system pods required for platform operation—such as CNI (Cilium), Service Mesh (Istio ztunnel), and storage agents—are deliberately allowed to use Privileges, hostNetwork, and NET_ADMIN due to functional necessities.

## Security Posture in Practice

The following are key security improvements applied during the development and deployment process:

- **Externalization of Plaintext Secrets:** Extracted 3 plaintext shared secrets used by Harbor into a separate Kubernetes Secret named `harbor-shared-secrets` (utilizing a randomly generated 16-char `secretKey` with `generate-if-not-exists` and `existingSecret` references).
- **Purging Git History:** Before pushing the repository to the public GitHub, the `git filter-repo` tool was used to completely purge any accidentally committed plaintext secrets from the entire project history.
- **Enforcing Image Tag Immutability:** Pinned all Harbor images from the mutable `:latest` tag to an explicit immutable version (`:v2.15.1`).
  - **Root Cause Analysis:** The `ubuntu-26.04-xfs` base box had stale `amd64` `:latest` layers baked into its containerd cache. Because `:latest` is a mutable tag, containerd never re-fetched the image, causing an `exec format error` on `arm64` hosts.
  - **Resolution:** By pinning to an explicit version, containerd was forced to pull the correct real `arm64` architecture image from the registry, resolving the issue.
