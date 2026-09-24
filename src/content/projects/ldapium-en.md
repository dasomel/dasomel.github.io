---
title: "ldapium"
description: "An OpenLDAP Kubernetes packaging stack built from upstream source: server, management UI, Helm, and offline delivery"
github: "https://github.com/dasomel/ldapium"
tags: ["OpenLDAP", "LDAP", "Kubernetes", "Helm", "Go", "TypeScript", "TLS", "Air-Gap", "SBOM"]
order: 12
type: "own"
featured: true
problem: "OpenLDAP deployment options often combine stale images, inconsistent packaging, default-credential risks, and incomplete ARM64/offline support"
solution: "Build OpenLDAP 2.6.15 from the upstream tarball and package it with zero-default-passwords, multi-architecture images, a management UI, Helm, backup/restore, offline bundles, and release evidence"
---

## Project Overview

**ldapium** packages OpenLDAP for maintainable Kubernetes and standalone deployment.

The project is not a replacement LDAP implementation. It is a **supply-chain and operational packaging boundary around upstream OpenLDAP**: server image, optional web UI, Helm chart, Compose workflow, backups, replication, TLS, and air-gapped delivery. It currently ships an OpenLDAP 2.6.15-based server image.

The current project status is **prototype**, with installation behavior documented from actual runtime verification and `helm test` used as a post-install check. The first release, **v0.1.0**, published on 2026-09-23, and the server/UI images and Helm chart are confirmed published to GHCR.

## Why ldapium Exists

The primary problem is deployment sustainability rather than LDAP protocol functionality.

- long-lived images can carry obsolete OpenLDAP versions
- ecosystem packaging and chart availability can change underneath consumers
- ARM64 support is inconsistent across common images
- sample users can become real federated identities by accident
- default credentials are an avoidable security boundary

ldapium addresses this by owning the packaging process while keeping upstream OpenLDAP authoritative.

## Components

| Path | Role |
|---|---|
| `image/` | OpenLDAP 2.6.15 server built from upstream source |
| `ui/` | DIT browser, user/group CRUD, password operations |
| `charts/ldapium/` | Kubernetes deployment, TLS, storage, replication, backup |
| `scripts/` | Credentials, backups, offline bundles, operational tooling |

The server uses the MDB backend with overlays such as `memberof`, `refint`, `ppolicy`, `unique`, and `syncprov`, plus TLS and Cyrus SASL. It also builds (opt-in loadable) `accesslog`, `auditlog`, `constraint`, `deref`, `dynlist`, `sssvlv`, and `otp`, and loads `{ARGON2}` password hashing by default. TLS hardening enforces a TLS 1.2 floor via `olcTLSProtocolMin` and an explicit `olcTLSCipherSuite` baseline, with optional mTLS-based SASL EXTERNAL mapping and `LDAP_ANONYMOUS_READ_BASE` to narrow anonymous read to a subtree.

### Images and registries

Confirmed published to GHCR as of v0.1.0:

- `ghcr.io/dasomel/ldapium:0.1.0` — the OpenLDAP 2.6.15 server (the C/OpenLDAP daemon, not a Go binary)
- `ghcr.io/dasomel/ldapium-ui:0.1.0` — Go backend + React frontend, one distroless static image running as uid 65532
- `oci://ghcr.io/dasomel/charts/ldapium:0.1.0` — the Helm chart

Both images are built for `linux/amd64` and `linux/arm64`, each on a **native runner**, because OpenLDAP's `configure` uses runtime probes that are not reliable under emulation.

### Management UI features

DIT browser, user and group CRUD, group membership by search-and-select, password set and self-service change, account unlock, admin-initiated account lock (disable), `memberOf` display, paged listings, a password-policy view, a `cn=Monitor` health view, organizational metadata on users, operator action history and a monitor log view, and an unauthenticated LDAP provider health endpoint. Every request binds as the logged-in user, so session privileges are decided by the directory's own ACLs, and the UI itself holds no service account (the Keycloak SSO path is the one exception). Hardening includes per-client-IP throttling of failed logins, redaction of internal error detail from HTTP responses, and redaction of `userPassword` in the DIT entry browser. Optional Keycloak SSO (OIDC with PKCE) is gated on a realm role and binds login state to the browser that began it, preventing CSRF-style login hijacking. The UI supports Korean and English throughout.

## Security Defaults

### Zero default passwords

The server refuses to start without an explicit administrative credential. Kubernetes deployments should use Secrets rather than shell arguments or committed values.

### No sample directory data

The base image does not silently create demo users or groups. Directory content is an explicit input, which is important when the directory is federated with an identity provider.

### Strict TLS

TLS-enabled replication and LDAP access verify CA and certificate names rather than silently accepting unknown endpoints. Certificate renewal is handled by Secret replacement followed by a rolling restart.

## Kubernetes Architecture

<Mermaid chart={`flowchart TB
  CLIENTS["Keycloak · Applications · LDAP Clients"] -->|"LDAP / LDAPS · 389 / 636"| SERVER["ldapium Server\nOpenLDAP 2.6.15\nMDB · TLS · overlays"]
  UI["Optional Management UI"] -.->|"LDAP service"| SERVER
  SERVER -->|"persistent storage"| DATA["LDAP data · cn=config"]`} />

The optional UI accesses the directory through the LDAP service and can use Keycloak SSO with a dedicated role-limited service account.

## Replication and Operations

Setting `replicaCount` above 1 automatically turns on N-way multi-provider replication and wires up the peer list (or `replication.enabled` can force it on or off explicitly). Standalone mode disables replication and is useful for local development. Production-like deployments should treat replication topology, TLS, backup, and restore as one operational contract. A cold-start election keeps several nodes booting at once from each creating their own copy of the base DIT.

The Helm chart is StatefulSet-based, with a per-replica PVC, headless Service, PodDisruptionBudget, and topology spread. Replication parameters (`retry`, `interval`, bind DN, a separate replication Secret) are adjustable chart values.

Install the chart with an explicit version and credential:

```bash
helm install directory oci://ghcr.io/dasomel/charts/ldapium \
  --version 0.1.0 \
  --namespace directory --create-namespace \
  --set auth.adminPassword="$(openssl rand -base64 24)" \
  --set ldap.rootDN=dc=example,dc=org

helm test directory --namespace directory --logs
```

The chart test exercises an admin bind and directory operations, and checks that the `memberOf` behavior expected from the configured overlay actually works.

### Key Helm values

- `auth.adminPassword` / `auth.existingSecret` — neither defaults to anything; leaving both empty fails `helm install`/`template` outright (the same principle as the server refusing to start without a password).
- `tls.enabled` (default `false`) — mounts a Secret's `tls.crt`/`tls.key`/optional `ca.crt` to enable LDAPS and TLS-based replication. **As of v0.1.0 this path exists only as templates and entrypoint logic — it has not been verified end-to-end against a live cluster.**
- `replication.*` — `retry`, `interval`, the replication bind DN, and a separate replication Secret.
- `seed.enabled` (default `false`) — mounts LDIF as a ConfigMap, applied on first boot only. Off by default on principle.
- `backup.enabled` — turns on a CronJob that dumps the data tree and `cn=config`, prunes by retention, and records each run into `ou=operations`.
- `ldap.maxOpenFiles` (default `4096`) — slapd's file-descriptor cap. Measured: leaving the runtime default (1048576) costs ~650MB of RSS from connection-table reservation alone.
- `ldap.dbMaxSize` — left empty, it's derived from `persistence.data.size`. The mdb map size itself barely affects RSS (measured: under 1MiB of RSS change from 10GiB to 2GiB).
- `ldap.uniqueAttributes` (default `uid,mail`) — attributes the `unique` overlay enforces.
- `ldap.passwordPolicyEnabled` (default `true`), `ldap.passwordHash` (default `{ARGON2}`).

## Backup and Restore

The project provides scheduled Kubernetes backups and a standalone `scripts/backup.sh` path covering the directory data tree and `cn=config`. Both paths prune old backups by retention and record each run's status into the directory itself (`ou=operations`). Restores need to consider both directory content and configuration, and replication order in multi-node deployments. Detailed RPO/RTO and procedures are documented in `charts/ldapium/README.md`.

## Air-Gapped Delivery

`scripts/offline-bundle.sh` combines images, the Helm chart, SBOMs, and checksums into one offline bundle. `scripts/offline-install.sh` verifies the contents and uses `imagePullPolicy=Never`, so missing artifacts fail the install outright rather than silently pulling from an external registry.

<Mermaid chart={`flowchart TB
  TAG["release tag"] --> ART["images + Helm chart"]
  ART --> EVIDENCE["SBOM + checksums + provenance"]
  EVIDENCE --> BUNDLE["offline bundle"]
  BUNDLE --> VERIFY["verify"]
  VERIFY --> INSTALL["install without live registry access"]`} />

## Supply Chain and Compliance

The project uses checksum verification for Go modules (`go.sum`-based `-mod=readonly`, including a tamper-detection test), SHA-pinned Actions, pinned tool digests (`syft`, `govulncheck`, and others that used to float on `latest` are now pinned by digest), pinned base-image digests, Trivy, CodeQL, license allow-list checks (`scripts/licenses.sh --check`), SPDX/CycloneDX SBOMs, and provenance attestations around release artifacts.

The v0.1.0 GitHub Release confirms `ldapium.spdx.json`, `ldapium.cdx.json`, `ldapium-ui.spdx.json`, `ldapium-ui.cdx.json`, `manifest.json`, and `SHA256SUMS` are actually attached as release assets. Build provenance and SBOM attestations for the images are signed with GitHub's OIDC identity and can be verified with `gh attestation verify oci://ghcr.io/dasomel/ldapium:0.1.0 --repo dasomel/ldapium`.

License handling separates the project's Apache-2.0 work from OpenLDAP's own licensing and inventories third-party components in generated notices.

## Known Limitations

As stated in the v0.1.0 CHANGELOG:

- **TLS is unverified end to end.** The templates and entrypoint handle certificates and TLS-protected replication, but no one has watched it work against a live cluster. It is off by default.
- **The UI's settings page lists modules and overlays from configuration, not the running server.** Those values live in `cn=config`, which requires an admin identity no UI session can hold, so the list is kept in sync with `image/Dockerfile` by hand.
- **No upgrade path is promised yet.** 0.1.0 is the first release, so there is nothing to upgrade from.
- **The e2e workflow itself has never run in CI.** It installs the chart into a kind cluster and runs `helm test`; the test script itself was developed and verified against a live directory, but the CI wiring around it is new.

## Current Status

**v0.1.0** (released 2026-09-23, the first release) — currently **Prototype**. The packaging and security model are intentionally public early, but release artifacts should be treated according to the actual GitHub Release, Actions, and GHCR state rather than README text alone. `ghcr.io/dasomel/ldapium:0.1.0`, `ghcr.io/dasomel/ldapium-ui:0.1.0`, and the Helm chart `oci://ghcr.io/dasomel/charts/ldapium:0.1.0` are confirmed published to GHCR, and the "Known Limitations" above still apply.

## Documentation Index

| Topic | Document | Purpose |
|---|---|---|
| Overview | [ldapium Overview](/oss/en/ldapium/overview) | Packaging strategy and scope |
| Architecture | [Directory Architecture](/oss/en/ldapium/architecture) | Server, UI, and chart boundaries |
| Getting Started | [Installation Guide](/oss/en/ldapium/getting-started) | Compose and Helm |
| Air-Gap | [Air-Gap Deployment](/oss/en/ldapium/air-gap) | Offline bundle and verification |
| Operations | [Operations & Backup](/oss/en/ldapium/operations) | TLS, replication, backup/restore |

## Project Relationship

<Mermaid chart={`flowchart TB
  UP["OpenLDAP upstream"] --> LDAP["ldapium"]
  LDAP --> IMG["server image"]
  LDAP --> UI["management UI"]
  LDAP --> HELM["Helm chart"]
  LDAP --> OFFLINE["offline bundle"]
  IMG --> IDP["Kubernetes IDP / Narwhal"]
  UI --> IDP
  HELM --> IDP
  OFFLINE --> IDP
  IDP --> SSO["Keycloak / SSO / Apps"]`} />
