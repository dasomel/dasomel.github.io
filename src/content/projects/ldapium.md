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

현재는 **prototype 단계**입니다. 프로젝트는 공개되어 있으며 실제 동작을 기준으로 기능을 계속 검증하고 있지만, TLS 경로와 전체 end-to-end 배포 검증 등 일부 영역은 아직 추가 검증이 필요합니다.

> **배포 상태:** 소스와 CI/CD는 준비되어 있으며 GitHub Actions 기반 GHCR 배포 workflow도 구성되어 있습니다. 다만 현재 `v0.1.0` 정식 이미지/차트가 실제 registry에 발행된 상태라고 보장하지 않으며, 릴리스 후 실제 artifact를 확인하는 단계가 남아 있습니다.

## 주요 구성 요소

| 영역 | 내용 |
|------|------|
| **LDAP Server** | OpenLDAP 2.6.14, upstream source build |
| **Backend** | `back-mdb`, OpenSSL TLS, Cyrus SASL |
| **Overlays** | `memberof`, `refint`, `ppolicy`, `unique`, `syncprov` 등 |
| **Management UI** | Go backend + React frontend, DIT 브라우저·사용자/그룹 CRUD |
| **Kubernetes** | StatefulSet, Headless/ClusterIP Service, PVC, PDB, topology spread |
| **Replication** | `replicaCount > 1` 기반 N-way multi-provider replication |
| **Backup** | Kubernetes CronJob + PVC, standalone용 `scripts/backup.sh` |
| **SSO** | 선택적 Keycloak OIDC + PKCE |
| **Security** | non-root, read-only root filesystem, secret 기반 인증정보 주입 |
| **Supply Chain** | CodeQL, Trivy, OpenSSF Scorecard, SBOM, build provenance |

## 주요 설계 원칙

### 기본 계정과 샘플 데이터가 없다

새 설치에서 예제 계정이나 기본 관리자 비밀번호를 자동으로 넣지 않습니다.

관리자 비밀번호는 반드시 설치 시 제공해야 하며, chart도 비밀번호가 없으면 렌더링을 거부합니다.

### OpenLDAP 자체와 패키징을 분리한다

Ldapium은 OpenLDAP의 LDAP 동작을 포크해서 수정하는 프로젝트가 아닙니다.

OpenLDAP upstream release를 따라가면서, 실제 운영에 필요한 다음 패키징 계층을 제공합니다.

```text
OpenLDAP upstream
        ↓
source build
        ↓
container image
        ↓
Helm / Compose
        ↓
management UI / backup / verification
```

### 검증 가능한 배포를 지향한다

단순히 `helm install`이 성공하는 것만 확인하지 않습니다.

Helm chart에는 `helm test` 기반의 디렉터리 검증이 포함되어 있으며, 서비스 연결, 관리자 bind, 엔트리 생성/삭제, `memberOf` overlay 동작, 복제 환경에서의 peer 수렴 등을 검사하도록 구성했습니다.

## 관리 UI

관리 UI는 LDAP 디렉터리를 직접 관리하기 위한 웹 인터페이스입니다.

주요 기능은 다음과 같습니다.

- DIT 브라우징
- 사용자 및 그룹 생성/수정/삭제
- 그룹 멤버 검색 및 선택
- 비밀번호 설정 및 변경
- 계정 잠금 해제
- `memberOf` 관계 표시
- password policy 조회
- optional Keycloak OIDC SSO

UI는 기본적으로 **로그인한 사용자의 LDAP bind**를 사용하도록 설계했습니다. SSO 모드에서만 별도의 LDAP service account를 사용하며, 이 경우에도 별도 Secret과 LDAP ACL을 명시적으로 구성해야 합니다.

## Kubernetes 배포

Helm chart는 다음과 같은 구조를 지원합니다.

```text
                   Helm
                    │
                    ▼
              StatefulSet
          ┌─────────┴─────────┐
          ▼                   ▼
       LDAP-0               LDAP-1 ...
          │                   │
          └──── replication ──┘
                    │
              Optional UI
                    │
                 Keycloak
```

단일 노드에서는 `replicaCount: 1`로 standalone 디렉터리로 동작하고, 2개 이상의 replica를 사용하면 N-way multi-provider replication 구성이 자동으로 활성화됩니다.

## 독립 실행형 배포

Kubernetes가 없어도 사용할 수 있습니다.

```bash
make local-up
make local-credentials
```

기본적으로 LDAP는 `389`, 관리 UI는 `8080` 포트를 사용하며 named volume을 사용해 데이터를 유지합니다.

## 기술 스택

| 구분 | 기술 |
|------|------|
| **Directory** | OpenLDAP 2.6.14 |
| **Backend** | Go |
| **Frontend** | React + Vite |
| **Container** | Docker, multi-arch (`amd64` / `arm64`) |
| **Orchestration** | Kubernetes |
| **Packaging** | Helm OCI chart |
| **SSO** | Keycloak OIDC / PKCE |
| **Security** | Trivy, CodeQL, OpenSSF Scorecard |
| **Supply Chain** | SBOM, build provenance attestation |

## 개발 중인 이유

이 프로젝트는 현재 개발 중인 **Beulga 빅데이터 플랫폼에서 필요한 LDAP 구성요소**를 독립적인 OSS로 만들기 위해 시작했습니다.

Beulga에 최적화하되 Beulga에 종속시키지는 않는 것을 목표로 합니다.

따라서 다음과 같이 사용할 수 있습니다.

```text
Beulga
  └── Ldapium

다른 Kubernetes 플랫폼
  └── Ldapium

Standalone / Docker Compose
  └── Ldapium
```

## 참고 링크

- **GitHub**: [dasomel/ldapium](https://github.com/dasomel/ldapium)
- **README**: [Ldapium README](https://github.com/dasomel/ldapium/blob/main/README.md)
- **Helm Chart 문서**: [charts/ldapium/README.md](https://github.com/dasomel/ldapium/blob/main/charts/ldapium/README.md)
- **Beulga**: 현재 개발 중인 빅데이터 플랫폼에서 LDAP 구성요소로 활용 예정
