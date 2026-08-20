---
title: "Ldapium"
description: "OpenLDAP 2.6 기반 Kubernetes·독립 실행형 디렉터리 서비스 스택"
github: "https://github.com/dasomel/ldapium"
tags: ["OpenLDAP", "LDAP", "Kubernetes", "Helm", "Docker", "Identity", "Go"]
order: 8
type: "own"
featured: true
problem: "기존 OpenLDAP 컨테이너와 Helm 차트의 유지보수·최신 버전·멀티아키텍처·운영 검증에 공백이 있어 Kubernetes와 독립 환경에서 재현 가능한 디렉터리 스택이 필요함"
solution: "OpenLDAP 2.6.14를 upstream source에서 직접 빌드한 멀티아키텍처 서버 이미지, 관리 UI, Helm chart, Docker Compose, 백업·검증 도구를 하나의 OSS 프로젝트로 제공"
---

## 프로젝트 소개

**Ldapium**은 OpenLDAP 2.6 기반의 **디렉터리 서비스 스택**입니다.

Kubernetes 환경에서는 Helm chart와 StatefulSet을 통해 배포하고, Kubernetes가 없는 환경에서는 Docker Compose 또는 개별 컨테이너로 실행할 수 있도록 설계했습니다.

특히 기존 이미지를 단순히 재패키징하는 방식이 아니라 **OpenLDAP 2.6.14를 upstream source에서 직접 빌드**하고, 서버 이미지와 관리 UI, Helm chart, 운영 스크립트를 하나의 프로젝트에서 함께 관리합니다.

현재는 **prototype 단계**입니다. TLS 경로와 전체 end-to-end 배포 검증 등 일부 영역은 추가 검증이 필요합니다.

> **배포 상태:** GitHub Actions 기반 GHCR 배포 workflow는 준비되어 있습니다. 다만 현재 `v0.1.0` 정식 이미지/차트가 실제 registry에 발행된 상태라고 보장하지 않으며, 릴리스 후 실제 artifact 확인이 필요합니다.

## 최신 소스 점검 · 2026-08-20

최근 소스에서는 단순 기능 추가보다 **멀티아키텍처 재현성과 replication 수렴 검증, supply-chain 추적성**을 강화했습니다.

- exporter build toolchain pinning
- cross-architecture build를 명시적으로 분리·검증
- 연속 provider failure 상황에서 replication convergence SLO 테스트 추가
- release tag를 workflow SHA에서 안전하게 해석해 supply-chain 추적성을 강화

따라서 Ldapium의 현재 핵심 방향은 **“LDAP 서버를 띄우는 것”보다 여러 아키텍처와 장애 상황에서도 동일한 운영 결과를 재현하는 것**입니다.

## 주요 구성 요소

| 영역 | 내용 |
|---|---|
| **LDAP Server** | OpenLDAP 2.6.14, upstream source build |
| **Backend** | `back-mdb`, OpenSSL TLS, Cyrus SASL |
| **Overlays** | `memberof`, `refint`, `ppolicy`, `unique`, `syncprov` 등 |
| **Management UI** | Go backend + React frontend, DIT·사용자·그룹 관리 |
| **Kubernetes** | StatefulSet, Headless/ClusterIP Service, PVC, PDB, topology spread |
| **Replication** | `replicaCount > 1` 기반 N-way multi-provider replication |
| **Backup** | Kubernetes CronJob + PVC, standalone `scripts/backup.sh` |
| **SSO** | 선택적 Keycloak OIDC + PKCE |
| **Supply Chain** | CodeQL, Trivy, OpenSSF Scorecard, SBOM, build provenance |

## 검증 구조

Helm chart에는 `helm test` 기반 디렉터리 검증이 포함되어 있습니다.

- root DSE / Service 연결
- 관리자 bind
- scratch entry 생성·삭제
- `memberOf` overlay 동작
- 복제 환경 peer 수렴

## 관리 UI

- DIT 브라우징
- 사용자 및 그룹 CRUD
- 그룹 멤버 검색 및 선택
- 비밀번호 설정·변경
- 계정 잠금 해제
- `memberOf` 표시
- password policy 조회
- optional Keycloak OIDC SSO

## Kubernetes 배포

```text
Helm
  ↓
StatefulSet
  ├─ LDAP-0
  ├─ LDAP-1 ...
  └─ Optional UI
       ↓
    Keycloak OIDC
```

`replicaCount: 1`은 standalone, 2 이상은 N-way multi-provider replication입니다.

## 독립 실행형 배포

```bash
make local-init
make local-up
make local-credentials
```

기본 LDAP `389`, UI `8080`, named volume 기반 데이터 영속성을 제공합니다.

## Beluga와의 관계

Ldapium은 현재 개발 중인 **Beluga 데이터 플랫폼에서 필요한 LDAP 구성요소**에서 출발했지만 Beluga에 종속되지 않는 독립 OSS를 목표로 합니다.

```text
Beluga
  └── Ldapium

다른 Kubernetes 플랫폼
  └── Ldapium

Standalone / Docker Compose
  └── Ldapium
```

## 기술 문서

| 문서 | 내용 |
|---|---|
| [아키텍처](/ko/docs/ldapium-architecture) | 서버·UI·Helm·replication·backup 구조 |
| [배포 가이드](/ko/docs/ldapium-deployment) | Helm, Compose, TLS, SSO, backup·restore |

## 참고 링크

- **GitHub**: [dasomel/ldapium](https://github.com/dasomel/ldapium)
- **README**: [Ldapium README](https://github.com/dasomel/ldapium/blob/main/README.md)
- **Helm Chart 문서**: [charts/ldapium/README.md](https://github.com/dasomel/ldapium/blob/main/charts/ldapium/README.md)
