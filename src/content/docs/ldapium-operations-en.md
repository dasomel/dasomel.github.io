---
title: Operations & Backup
description: TLS certificate rotation, slapcat/slapadd database backups, and disaster recovery.
project: ldapium
path: ldapium/operations
order: 1704
lastModified: 2026-08-23
---

# Operations & Backup

Operational maintenance, certificate renewal, and disaster recovery procedures.

## Database Backup & Restore

```bash
# 1. Export backup (slapcat)
slapcat -n 1 -l /backup/ldap-$(date +%Y%m%d).ldif

# 2. Restore database (slapadd)
slapadd -n 1 -l /backup/ldap-backup.ldif
```
