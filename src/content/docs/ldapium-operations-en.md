---
title: Operations & Backup
description: TLS certificate rotation, monitoring, and `slapcat`/`slapadd` DR.
project: ldapium
path: ldapium/operations
order: 1700
lastModified: 2026-08-23
---

# Operations & Backup

Operational maintenance, certificate renewal, and disaster recovery runbooks.

## Backup & Restore Commands
```bash
# Generate backup
slapcat -n 1 -l /backup/ldap-$(date +%Y%m%d).ldif

# Restore backup
slapadd -n 1 -l /backup/ldap-backup.ldif
```

## Related Links

- [ldapium Repository](https://github.com/dasomel/ldapium)
- [English Project Home](/oss/en/ldapium/)
