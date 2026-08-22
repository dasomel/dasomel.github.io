---
title: 운영 및 백업/복구
description: TLS 인증서 교체, `slapcat`/`slapadd` 백업.
project: ldapium
path: ldapium/operations
order: 1700
lastModified: 2026-08-23
---

# 운영 및 백업/복구

일일 운영, 인증서 교체 및 재해 복구 런북입니다.

## 백업 및 복구 명령어
```bash
# 백업 생성
slapcat -n 1 -l /backup/ldap-$(date +%Y%m%d).ldif

# 백업 복구
slapadd -n 1 -l /backup/ldap-backup.ldif
```

## 관련 링크

- [ldapium 저장소](https://github.com/dasomel/ldapium)
- [프로젝트 홈](/oss/ldapium/)
