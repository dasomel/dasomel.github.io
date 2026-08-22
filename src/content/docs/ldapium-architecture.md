---
title: 디렉토리 아키텍처
description: MDB 백엔드 스토리지 엔진, TLS/mTLS 암호화 및 Helm 차트 구조.
project: ldapium
path: ldapium/architecture
order: 1701
lastModified: 2026-08-23
---

# 디렉토리 아키텍처

고성능 MDB 스토리지 엔진과 TLS 암호화 계층을 기반으로 설계되었습니다.

## 아키텍처 구성

- **엔진**: OpenLDAP LMDB (초당 수만 건의 읽기 쿼리 처리)
- **보안 통신**: LDAPS (포트 636) 및 StartTLS (포트 389) 지원
- **스키마 지원**: Core, Cosine, InetOrgPerson, RFC2307bis (POSIX 계정/그룹)
