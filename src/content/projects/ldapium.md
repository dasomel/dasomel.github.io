---
title: "ldapium"
description: "업스트림 OpenLDAP 소스를 직접 빌드하는 Kubernetes 디렉터리 스택 · 서버 · 관리 UI · Helm"
github: "https://github.com/dasomel/ldapium"
tags: ["OpenLDAP", "LDAP", "Kubernetes", "Helm", "Go", "TypeScript", "TLS", "Air-Gap", "SBOM"]
order: 12
type: "own"
featured: true
problem: "기존 OpenLDAP Kubernetes 이미지와 Helm 선택지의 오래된 버전, 비일관적인 패키징, 기본 credential 위험, ARM64/air-gap 지원 부족으로 유지 가능한 표준 배포 경로를 만들기 어려움"
solution: "OpenLDAP 2.6.14를 업스트림 tarball에서 직접 빌드하고 zero-default-password 원칙, multi-arch 이미지, 관리 UI, Helm, backup/restore, offline bundle, SBOM/provenance를 하나의 프로젝트로 묶음"
---

## 프로젝트 소개

**ldapium**은 Kubernetes 환경에서 OpenLDAP을 실제 운영 가능한 형태로 패키징하기 위한 프로젝트입니다.

핵심은 LDAP 서버 자체를 새로 만드는 것이 아니라 **OpenLDAP upstream을 신뢰 가능한 방식으로 빌드·배포·운영하는 packaging boundary**를 제공하는 것입니다. 현재 OpenLDAP 2.6.14 기반 서버 이미지, 선택형 Web UI, Helm chart, Docker Compose, backup/restore 및 air-gapped 설치 경로를 함께 제공합니다.

현재 상태는 **prototype**입니다. 프로젝트는 초기부터 실제 실행 상태를 기준으로 문서를 작성하고, `helm test`와 CI를 통해 설치 검증을 자동화하는 방향을 취합니다.

## 왜 ldapium인가

프로젝트 README에서 확인한 문제는 특정 OpenLDAP 구현의 기능 부족이 아니라 **배포 생태계의 지속가능성**입니다.

- 오래 유지된 이미지가 현대적인 OpenLDAP LTS 버전을 제공하지 않음
- 일부 chart/image의 배포·접근 조건 변화
- ARM64 지원이 일관되지 않음
- sample account가 directory federation 환경에서 실제 사용자처럼 남을 수 있음
- 기본 관리자 비밀번호가 보안 사고의 시작점이 될 수 있음

ldapium은 이 문제를 “새 LDAP 구현”이 아니라 **오래 유지할 수 있는 upstream packaging** 관점에서 해결합니다.

## 구성 요소

| 경로 | 역할 |
|---|---|
| `image/` | OpenLDAP 2.6.14 서버 이미지. upstream source 직접 빌드 |
| `ui/` | DIT browser, user/group CRUD, password 관리 UI |
| `charts/ldapium/` | Kubernetes StatefulSet 및 운영 기능을 포함한 Helm chart |
| `scripts/` | local credential, backup, offline bundle 등 운영 도구 |

OpenLDAP 서버는 `back-mdb`, `memberof`, `refint`, `ppolicy`, `unique`, `syncprov` 등을 사용하고 TLS와 Cyrus SASL을 지원합니다.

## 보안 기본값

### Zero Default Passwords

서버와 Compose/Helm 모두 기본 관리자 password를 내장하지 않습니다. 값이 없으면 시작하지 않으며, Kubernetes에서는 Secret을 통한 주입을 권장합니다.

### No Sample Data

기본 이미지가 예제 사용자나 그룹을 자동 생성하지 않습니다. 필요한 directory content는 명시적으로 LDIF를 주입합니다. 이 선택은 Keycloak 등 identity provider와 federation하는 환경에서 특히 중요합니다.

### TLS

TLS 활성화 시 LDAPS listener를 제공하고 certificate hostname/CA를 엄격하게 검증합니다. 인증서 갱신은 Secret 교체 후 pod rolling restart로 수행할 수 있습니다.

## Kubernetes 아키텍처

```text
             Keycloak / Applications / LDAP Clients
                            │
                    LDAP / LDAPS 389/636
                            │
                            ▼
                ┌───────────────────────┐
                │    ldapium Server     │
                │  OpenLDAP 2.6.14      │
                │  MDB + TLS + overlays │
                └──────────┬────────────┘
                           │
                  Persistent Storage
                           │
                           ▼
                    LDAP data / cn=config
```

선택적으로 Web UI가 LDAP service를 통해 사용자와 그룹을 관리하며, Keycloak SSO를 사용할 때는 dedicated service account에 역할을 제한하는 구조를 사용할 수 있습니다.

## HA / Replication

`replicaCount`를 늘려 multi-provider replication 구성을 사용할 수 있습니다. 기본 단일 replica는 local 또는 development 환경에 적합하며, replication 환경에서는 TLS와 peer verification, backup/restore 절차를 함께 검토해야 합니다.

## Helm 운영

```bash
helm install directory oci://ghcr.io/dasomel/charts/ldapium \
  --version 0.1.0 \
  --namespace directory --create-namespace \
  --set auth.adminPassword="$(openssl rand -base64 24)" \
  --set ldap.rootDN=dc=example,dc=org

helm test directory --namespace directory --logs
```

`helm test`는 admin bind, scratch entry 생성/삭제, `memberOf` overlay 동작, replication 환경의 전파 등을 검증하는 설치 후 smoke test 역할을 합니다.

## Backup / Restore

LDAP 데이터와 `cn=config`를 모두 백업하는 경로를 제공합니다. Kubernetes에서는 chart의 backup CronJob을 사용하고, standalone 환경에서는 `scripts/backup.sh`로 동일한 dump 경로를 사용할 수 있습니다.

복구 시에는 directory data와 configuration을 분리해서 확인하고, replication 환경에서는 복구 순서에 따른 데이터 일관성을 별도로 검토해야 합니다.

## Air-Gap

ldapium은 image, Helm chart, SBOM, checksum을 하나의 offline bundle로 묶고, offline installer가 필요한 파일이 없거나 verification에 실패하면 외부 registry로 fallback하지 않도록 하는 방향을 취합니다.

```text
release tag
   ↓
images + chart
   ↓
SBOM + checksums + provenance
   ↓
offline bundle
   ↓
verify
   ↓
imagePullPolicy=Never install
```

이는 Narwhal의 air-gapped 운영 모델과 연결하기 좋은 특성입니다.

## Supply Chain / Compliance

프로젝트는 Go modules의 checksum verification, GitHub Actions SHA pinning, tool digest pinning, Trivy, CodeQL, license allow-list, SPDX/CycloneDX SBOM, provenance attestation을 release 경계에 포함합니다.

특히 OpenLDAP 자체와 프로젝트 원본 코드를 라이선스 관점에서 분리하고, published image의 third-party license inventory와 NOTICE를 별도로 관리합니다.

## 현재 상태

**Prototype**. 기능과 packaging boundary는 실제 동작 여부를 기준으로 공개하지만, 아직 광범위한 외부 production adoption을 전제로 하지 않습니다. 배포 artifact도 GitHub Release/Actions/GHCR 상태를 확인한 뒤 사용해야 합니다.

## 상세 기술 문서

| 주제 | 문서 | 내용 |
|---|---|---|
| Overview | [ldapium 개요](/oss/ldapium/overview) | 문제 정의와 packaging 전략 |
| Architecture | [디렉터리 아키텍처](/oss/ldapium/architecture) | server/UI/chart 구조 |
| Getting Started | [설치 가이드](/oss/ldapium/getting-started) | Docker Compose / Helm |
| Air-Gap | [오프라인 배포](/oss/ldapium/air-gap) | bundle / verification / disconnected install |
| Operations | [운영 가이드](/oss/ldapium/operations) | TLS, backup/restore, replication |

## 프로젝트 관계

```text
OpenLDAP upstream
       ↓
     ldapium
       ├── server image
       ├── management UI
       ├── Helm chart
       └── offline bundle
              ↓
       Narwhal / Kubernetes IDP
              ↓
        Keycloak / SSO / Apps
```
