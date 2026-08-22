---
title: Directory Architecture
description: MDB backend storage engine, TLS/mTLS encryption, and Helm chart architecture.
project: ldapium
path: ldapium/architecture
order: 1701
lastModified: 2026-08-23
---

# Directory Architecture

Engineered around the high-throughput MDB storage backend and TLS encryption.

## Architecture Highlights

- **Storage Engine**: OpenLDAP LMDB handling tens of thousands of read queries per second
- **Secure Transports**: LDAPS (port 636) and StartTLS (port 389)
- **Supported Schemas**: Core, Cosine, InetOrgPerson, and RFC2307bis
