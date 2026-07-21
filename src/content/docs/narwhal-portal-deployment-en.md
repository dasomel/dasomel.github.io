---
title: "Portal Deployment & Security"
description: "Deployment strategies for the Narwhal IDP Portal and secret hardening procedures for clean installs"
project: "Narwhal Portal"
order: 203
lastModified: 2026-07-17
---

## Deployment Strategy

While the portal features a built-in, in-cluster Kaniko build pipeline that pushes to the Harbor registry, the production environment (validated as of iter20) relies exclusively on **pre-built, pinned external images** for deployment. The Kaniko build loop has been demoted to an optional local development tool.

<Mermaid chart={`flowchart LR
  SRC["Source Code"]
  
  subgraph DEV["Optional Dev Path (Kaniko)"]
    GITEA["In-cluster Gitea"]
    KAN["Kaniko Job"]
    HAR["harbor.local.narwhal.internal"]
  end

  subgraph PROD["Actual Production Path (GitOps)"]
    GHCR(["ghcr.io/dasomel/narwhal-portal:1.0.15<br/>(Pinned GHCR)"])
    ARGO["ArgoCD GitOps"]
    DEPLOY(["Cluster Deployment"])
  end

  SRC -.->|"Local / Push"| GITEA
  GITEA -.->|"Build"| KAN
  KAN -.->|"Push"| HAR
  
  SRC -->|"CI/CD Publish"| GHCR
  GHCR -->|"Image Pull"| ARGO
  ARGO -->|"Sync"| DEPLOY

  style GHCR fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style DEPLOY fill:#f0fdf4,stroke:#059669,color:#111
  style ARGO fill:#f0fdf4,stroke:#059669,color:#111
  style DEV fill:#fafafa,stroke:#d1d5db,color:#374151
  style PROD fill:#fafafa,stroke:#d1d5db,color:#374151
  style SRC fill:#fff,stroke:#9ca3af,color:#111
  style GITEA fill:#f9fafb,stroke:#d1d5db,color:#111
  style KAN fill:#f9fafb,stroke:#d1d5db,color:#111
  style HAR fill:#f9fafb,stroke:#d1d5db,color:#111
`} />

- **Deployment Image**: `ghcr.io/dasomel/narwhal-portal:1.0.15`
- **No In-cluster Build Required**: The image is pulled directly from the GitHub Container Registry (GHCR) and run without consuming internal cluster build resources.
- **Base Image Pinning**: Even if you choose to build your own images, to mitigate supply chain attacks, you must enforce `@sha256:` digest pinning in the `Dockerfile` for the `node:22-alpine` and `oven/bun:1.3.13-alpine` base image declarations.

## Secret Bootstrap (Clean Install)

During a clean cluster installation, a dedicated automation script is used to bootstrap the `.env.local` configuration required to launch the portal.

```bash
./scripts/bootstrap-secrets.sh
```

- **Auto-generated Keys**: These secrets are safely randomized and written to the file instantly:
  - `AUTH_SECRET`
  - `VALKEY_PASSWORD`
  - `LIVE_INGEST_SECRET`
- **Manual Input Required Keys**: These remain as placeholders in the generated `.env.local` file. Infrastructure operators must manually issue these values from their respective consoles and replace the environment variables:
  - `OIDC_CLIENT_SECRET` (OIDC client for Keycloak portal integration)
  - `KEYCLOAK_ADMIN_CLIENT_SECRET` (Keycloak Service Account client)
  - `OPENBAO_TOKEN` (OpenBao AppRole access token)
  - `ARGOCD_TOKEN` (ArgoCD API access token)
  - `K8S_SA_TOKEN` (Short-lived SA token for cluster permissions)
  - `APISIX_API_KEY` (APISIX gateway admin access key)

## Security Hardening and Operational Configuration

The following are the mandatory security audit measures necessary to meet production-level portal operations.

### 1. Keycloak OIDC and API Authentication
- **OIDC Client**: The `narwhal-portal` client is configured to handle portal user logins. Scopes are strictly limited to `openid email profile groups`.
- **Admin API Integration (Service Account)**: When the portal backend performs operations such as querying the user list, it does not use standard user credentials. Instead, it generates an `idp-portal-admin` Service Account client and communicates via the `client_credentials` grant type. (In accordance with security audit findings, the use of ROPC grants is strictly forbidden).

### 2. Communication Encryption (Forced TLS & HTTPS)
- **Valkey (Cache)**: Plaintext communication is completely blocked. The portal code verifies the `VALKEY_TLS=true` environment variable, mandates the TLS scheme `rediss://` for the `VALKEY_URL`, and enforces the AUTH authentication procedure using the `VALKEY_PASSWORD` parameter.
- **OpenBao**: All API calls mandate the `https://` (`OPENBAO_ADDR`) protocol. Any attempts to retrieve secrets over standard HTTP are blocked.

### 3. Resource Control and Principle of Least Privilege
- **ArgoCD Project Allowlist**: By assigning a comma-separated list to the `ARGOCD_DEVELOPER_PROJECTS` environment variable, you restrict the scope of application projects that users with the `developer` role can Sync or Rollback via the portal.
- **Short-lived Tokens (TokenRequest API)**: For cluster API authentication, the use of legacy long-lived tokens (e.g., expiring in decades like 2036) is deprecated. The portal uses either a Projected Volume token configured with `expirationSeconds: 3600`, or a temporary 1-hour short-lived token issued manually via the `kubectl create token` command and injected as an environment variable.
- **Tuning Job Digest Verification**: The tuning Job image, which spawns as a privileged container for cluster node management, undergoes strict runtime verification. To prevent runtime hijacking, it must follow the exact `TUNING_JOB_IMAGE=...@sha256:<64hex>` digest pin format; otherwise, execution is denied.
