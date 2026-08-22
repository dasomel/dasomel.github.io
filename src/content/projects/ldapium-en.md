---
title: "ldapium"
description: "OpenLDAP 2.6 compiled from upstream source: secure server image, web UI, and Helm chart"
github: "https://github.com/dasomel/ldapium"
tags: ["LDAP", "OpenLDAP", "Kubernetes", "Helm", "Security", "Docker", "Air-Gap"]
order: 12
type: "own"
featured: true
problem: "Public OpenLDAP container images often bundle hardcoded default credentials, unvetted sample data, and opaque binaries that violate compliance"
solution: "OpenLDAP 2.6 compiled directly from upstream source with zero hardcoded defaults, a modern web UI, and production-grade Helm charts"
---

## Project Overview

**ldapium** is a high-security directory solution combining an OpenLDAP 2.6 server image compiled directly from upstream source, a modern web management UI, and Kubernetes Helm charts.

It enforces a strict **Zero Default Passwords** invariant and provides seamless air-gapped deployment bundles for enterprise environments.

### Key Highlights

- **Compiled from Upstream Source**: Direct source compilation of OpenLDAP 2.6 stripping unneeded modules for a minimal attack surface
- **Zero Default Passwords**: Strict prohibition of default credentials; passwords injected exclusively via runtime secrets
- **Modern Web Administration UI**: Intuitive web interface for user/group management, OU hierarchies, and credential resets
- **Air-Gap Ready**: Offline bundles packaged for disconnected enterprise infrastructures
- **Production Kubernetes Helm Chart**: Native TLS/mTLS, PersistentVolumeClaim, and ConfigMap integration

---

## Architecture Diagram

```text
  Clients / SSO (Keycloak, APISIX, Linux PAM)
                       │
                       ▼ ldaps:// (:636) / ldap:// (:389)
  ┌────────────────────────────────────────────────────────┐
  │  ldapium Server (OpenLDAP 2.6 Compiled from Source)   │
  │  - MDB Storage Engine                                  │
  │  - TLS / mTLS Mutual Authentication                    │
  │  - Custom Schema Ingestion (RFC2307bis, POSIX)         │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │  ldapium Web Management UI                             │
  │  - User / Group CRUD                                   │
  │  - Organizational Unit (OU) Tree Explorer              │
  └────────────────────────────────────────────────────────┘
```

---

## Getting Started

```bash
# 1. Clone repository
git clone https://github.com/dasomel/ldapium.git
cd ldapium

# 2. Run locally via Docker Compose
cp .env.example .env
docker compose up -d

# 3. Deploy via Helm to Kubernetes
helm install ldapium ./charts/ldapium -n identity --create-namespace
```

---

## Documentation Index

| Topic | Document Link | Summary |
|---|---|---|
| **Overview** | [ldapium Overview](/oss/en/ldapium/overview) | OpenLDAP 2.6 compilation and zero-default security |
| **Architecture** | [Directory Architecture](/oss/en/ldapium/architecture) | MDB backend, TLS encryption, and Helm layout |
| **Getting Started** | [Installation Guide](/oss/en/ldapium/getting-started) | Docker Compose and Helm deployment workflows |
| **Air-Gap** | [Air-Gap Deployment](/oss/en/ldapium/air-gap) | Offline image packaging and verification |
| **Operations** | [Operations & Backup](/oss/en/ldapium/operations) | TLS certificate rotation and `slapcat`/`slapadd` |
