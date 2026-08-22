---
title: 운영 및 백업/복구
description: TLS 인증서 교체, slapcat/slapadd 데이터베이스 백업 및 복구 런북.
project: ldapium
path: ldapium/operations
order: 1704
lastModified: 2026-08-23
---

# 운영 및 백업/복구

ldapium의 일일 운영, 인증서 교체 및 재해 복구 지침입니다.

## 데이터베이스 백업 및 복원

```bash
# 1. 백업 생성 (slapcat)
slapcat -n 1 -l /backup/ldap-$(date +%Y%m%d).ldif

# 2. 백업 복구 (slapadd)
slapadd -n 1 -l /backup/ldap-backup.ldif
```
