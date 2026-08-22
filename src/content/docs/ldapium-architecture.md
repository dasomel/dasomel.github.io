---
title: 디렉토리 아키텍처
description: MDB 엔진, TLS 암호화 및 Helm 차트 구조.
project: ldapium
path: ldapium/architecture
order: 1700
lastModified: 2026-08-23
---

# 디렉토리 아키텍처

고성능 MDB 스토리지 엔진과 TLS 암호화 계층을 사용합니다.

## 기술 계층
- **스토리지 엔진**: OpenLDAP LMDB (Lightning Memory-Mapped Database)
- **보안**: TLS 1.3 / mTLS 상호 인증 지원
- **스키마**: Core, Cosine, InetOrgPerson, RFC2307bis 지원

## 관련 링크

- [ldapium 저장소](https://github.com/dasomel/ldapium)
- [프로젝트 홈](/oss/ldapium/)
