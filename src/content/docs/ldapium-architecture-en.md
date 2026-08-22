---
title: Directory Architecture
description: MDB backend engine, TLS encryption, and Helm chart architecture.
project: ldapium
path: ldapium/architecture
order: 1700
lastModified: 2026-08-23
---

# Directory Architecture

Engineered around the high-throughput MDB storage backend and TLS encryption.

## Architecture Layers
- **Storage Engine**: OpenLDAP LMDB (Lightning Memory-Mapped Database)
- **Security**: TLS 1.3 / mTLS mutual certificate authentication
- **Schemas**: Core, Cosine, InetOrgPerson, and RFC2307bis schemas

## Related Links

- [ldapium Repository](https://github.com/dasomel/ldapium)
- [English Project Home](/oss/en/ldapium/)
