---
title: "Ldapium 아키텍처"
description: "OpenLDAP 2.6.14 기반 Ldapium의 서버·관리 UI·Helm 통합 아키텍처"
project: "Ldapium"
order: 501
lastModified: 2026-08-19
---

## 개요

**Ldapium**은 OpenLDAP 2.6.14를 upstream source에서 직접 빌드하고, 관리 UI와 Kubernetes Helm chart를 하나의 OSS 프로젝트로 묶습니다.

Beulga에서 사용할 수 있지만 Beulga에 종속되지 않으며, Kubernetes와 Docker Compose 환경에서 독립적으로 구성할 수 있습니다.

## 구성

```text
                 Ldapium
                    │
       ┌────────────┼────────────┐
       │            │            │
    Server        UI          Helm Chart
       │            │            │
 OpenLDAP 2.6.14  Go + React   StatefulSet
       │          distroless   optional UI
       │                         Backup
       │                         Replication
       └──────────────┬──────────┘
                      │
                Kubernetes / Compose
```

## Server Image

`image/`는 Debian 기반 빌드 환경에서 OpenLDAP 2.6.14를 upstream tarball과 checksum으로 고정하여 빌드합니다.

- `back-mdb`
- TLS via OpenSSL
- Cyrus SASL
- `memberof`, `refint`, `ppolicy`, `unique`, `syncprov`
- `{ARGON2}` password hashing module
- 기본 admin password 없음
- sample data 없음
- linux/amd64 + linux/arm64

## Management UI

`ui/`는 Go backend와 React frontend를 하나의 distroless static image로 패키징합니다.

주요 기능:

- DIT browser
- User / Group CRUD
- Password set / self-service change
- Account unlock
- `memberOf` 표시
- Password policy view
- LDAP password login
- 선택적 Keycloak OIDC/PKCE SSO

기본 LDAP 로그인에서는 로그인한 사용자의 bind identity를 사용하고, SSO 모드에서만 별도 LDAP service account를 사용합니다.

## Replication

`replicaCount > 1`이면 N-way multi-provider replication이 활성화됩니다.

```text
ldapium-0 ─────┐
      ↕        │
ldapium-1 ──────┼── Multi-provider sync
      ↕        │
ldapium-2 ─────┘
```

Peer 목록은 Helm chart가 StatefulSet ordinal과 headless Service를 기반으로 생성하고 이미지에 전달합니다.

## Backup

Kubernetes 환경에서는 별도 backup CronJob + PVC를 사용합니다.

- LDAP data tree + `cn=config`
- `ldapsearch` 기반 네트워크 dump
- retention 정책
- `ou=operations`에 backup status 기록

Replication은 backup을 대체하지 않습니다. 잘못된 삭제 역시 모든 replica로 복제되기 때문입니다.

## 보안 모델

- 이미지에 기본 credential 없음
- Helm rendering에서도 admin password 필수
- non-root container
- UI session secret 별도 관리
- SSO confidential client secret 별도 Secret
- LDAP UI service account와 admin credential 분리
- CI에서 CodeQL / Trivy / license check / OpenSSF Scorecard 수행

## 공급망

Release workflow는 Git tag를 기준으로 server image, UI image, Helm chart를 동일한 버전으로 만들고 provenance 및 SBOM attestation을 생성하도록 설계되어 있습니다.

현재 저장소는 prototype이며, 실제 GHCR/Release artifact가 생성됐는지는 해당 tag의 Actions 실행과 registry에서 별도로 확인해야 합니다.
