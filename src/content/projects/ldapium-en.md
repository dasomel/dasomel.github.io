---
title: "ldapium"
description: "An OpenLDAP Kubernetes packaging stack built from upstream source: server, management UI, Helm, and offline delivery"
github: "https://github.com/dasomel/ldapium"
tags: ["OpenLDAP", "LDAP", "Kubernetes", "Helm", "Go", "TypeScript", "TLS", "Air-Gap", "SBOM"]
order: 12
type: "own"
featured: true
problem: "OpenLDAP deployment options often combine stale images, inconsistent packaging, default-credential risks, and incomplete ARM64/offline support"
solution: "Build OpenLDAP 2.6.14 from the upstream tarball and package it with zero-default-passwords, multi-architecture images, a management UI, Helm, backup/restore, offline bundles, and release evidence"
---

## Project Overview

**ldapium** packages OpenLDAP for maintainable Kubernetes and standalone deployment.

The project is not a replacement LDAP implementation. It is a **supply-chain and operational packaging boundary around upstream OpenLDAP**: server image, optional web UI, Helm chart, Compose workflow, backups, replication, TLS, and air-gapped delivery.

The current project status is **prototype**, with installation behavior documented from actual runtime verification and `helm test` used as a post-install check.

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
| `image/` | OpenLDAP 2.6.14 server built from upstream source |
| `ui/` | DIT browser, user/group CRUD, password operations |
| `charts/ldapium/` | Kubernetes deployment, TLS, storage, replication, backup |
| `scripts/` | Credentials, backups, offline bundles, operational tooling |

The server uses the MDB backend with overlays such as `memberof`, `refint`, `ppolicy`, `unique`, and `syncprov`, plus TLS and Cyrus SASL.

## Security Defaults

### Zero default passwords

The server refuses to start without an explicit administrative credential. Kubernetes deployments should use Secrets rather than shell arguments or committed values.

### No sample directory data

The base image does not silently create demo users or groups. Directory content is an explicit input, which is important when the directory is federated with an identity provider.

### Strict TLS

TLS-enabled replication and LDAP access verify CA and certificate names rather than silently accepting unknown endpoints. Certificate renewal is handled by Secret replacement followed by a rolling restart.

## Kubernetes Architecture

```text
        Keycloak / Applications / LDAP Clients
                       │
                 LDAP / LDAPS
                       │
                       ▼
              ┌───────────────────┐
              │ ldapium server    │
              │ OpenLDAP 2.6.14   │
              │ MDB + TLS + overlays
              └─────────┬─────────┘
                        │
                   persistent data
```

The optional UI accesses the directory through the LDAP service and can use Keycloak SSO with a dedicated role-limited service account.

## Replication and Operations

Increasing `replicaCount` enables multi-provider replication. Standalone mode disables replication and is useful for local development. Production-like deployments should treat replication topology, TLS, backup, and restore as one operational contract.

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

## Backup and Restore

The project provides scheduled Kubernetes backups and a standalone `scripts/backup.sh` path covering the directory data tree and `cn=config`. Restores need to consider both directory content and configuration, and replication order in multi-node deployments.

## Air-Gapped Delivery

Offline bundles combine images, the Helm chart, SBOMs, and checksums. The offline installer verifies the contents and uses `imagePullPolicy=Never` so missing artifacts fail rather than silently pulling from an external registry.

```text
release tag
   ↓
images + chart
   ↓
SBOM + checksums + provenance
   ↓
offline bundle
   ↓
verify
   ↓
install without live registry access
```

## Supply Chain and Compliance

The project uses checksum verification for Go modules, SHA-pinned Actions, pinned tool digests, Trivy, CodeQL, license allow-list checks, SPDX/CycloneDX SBOMs, and provenance attestations around release artifacts.

License handling separates the project's Apache-2.0 work from OpenLDAP's own licensing and inventories third-party components in generated notices.

## Current Status

**Prototype.** The packaging and security model are intentionally public early, but release artifacts should be treated according to the actual GitHub Release, Actions, and GHCR state rather than README text alone.

## Documentation Index

| Topic | Document | Purpose |
|---|---|---|
| Overview | [ldapium Overview](/oss/en/ldapium/overview) | Packaging strategy and scope |
| Architecture | [Directory Architecture](/oss/en/ldapium/architecture) | Server, UI, and chart boundaries |
| Getting Started | [Installation Guide](/oss/en/ldapium/getting-started) | Compose and Helm |
| Air-Gap | [Air-Gap Deployment](/oss/en/ldapium/air-gap) | Offline bundle and verification |
| Operations | [Operations & Backup](/oss/en/ldapium/operations) | TLS, replication, backup/restore |

## Project Relationship

```text
OpenLDAP upstream
       ↓
     ldapium
       ├── server image
       ├── management UI
       ├── Helm chart
       └── offline bundle
              ↓
       Kubernetes IDP / Narwhal
              ↓
        Keycloak / SSO / Apps
```
