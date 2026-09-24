---
title: "ldapium"
description: "업스트림 OpenLDAP 소스를 직접 빌드하는 Kubernetes 디렉터리 스택 · 서버 · 관리 UI · Helm"
github: "https://github.com/dasomel/ldapium"
tags: ["OpenLDAP", "LDAP", "Kubernetes", "Helm", "Go", "TypeScript", "TLS", "Air-Gap", "SBOM"]
order: 12
type: "own"
featured: true
problem: "기존 OpenLDAP Kubernetes 이미지와 Helm 선택지의 오래된 버전, 비일관적인 패키징, 기본 credential 위험, ARM64/air-gap 지원 부족으로 유지 가능한 표준 배포 경로를 만들기 어려움"
solution: "OpenLDAP 2.6.15를 업스트림 tarball에서 직접 빌드하고 zero-default-password 원칙, multi-arch 이미지, 관리 UI, Helm, backup/restore, offline bundle, SBOM/provenance를 하나의 프로젝트로 묶음"
---

## 프로젝트 소개

**ldapium**은 Kubernetes 환경에서 OpenLDAP을 실제 운영 가능한 형태로 패키징하기 위한 프로젝트입니다.

핵심은 LDAP 서버 자체를 새로 만드는 것이 아니라 **OpenLDAP upstream을 신뢰 가능한 방식으로 빌드·배포·운영하는 packaging boundary**를 제공하는 것입니다. 현재 OpenLDAP 2.6.15 기반 서버 이미지, 선택형 Web UI, Helm chart, Docker Compose, backup/restore 및 air-gapped 설치 경로를 함께 제공합니다.

현재 상태는 **prototype**입니다. 프로젝트는 초기부터 실제 실행 상태를 기준으로 문서를 작성하고, `helm test`와 CI를 통해 설치 검증을 자동화하는 방향을 취합니다. 첫 릴리스 **v0.1.0**이 2026-09-23에 공개됐고, 서버·UI 이미지와 Helm chart가 GHCR에 실제 게시된 것을 확인했습니다.

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
| `image/` | OpenLDAP 2.6.15 서버 이미지. upstream source 직접 빌드 |
| `ui/` | DIT browser, user/group CRUD, password 관리 UI |
| `charts/ldapium/` | Kubernetes StatefulSet 및 운영 기능을 포함한 Helm chart |
| `scripts/` | local credential, backup, offline bundle 등 운영 도구 |

OpenLDAP 서버는 `back-mdb`, `memberof`, `refint`, `ppolicy`, `unique`, `syncprov` 등을 사용하고 TLS와 Cyrus SASL을 지원합니다. 이 외에도 `accesslog`, `auditlog`, `constraint`, `deref`, `dynlist`, `sssvlv`, `otp` overlay가 함께 빌드되어 opt-in으로 로드할 수 있고, `{ARGON2}` 비밀번호 해시 모듈이 기본 로드됩니다. TLS 강화 옵션으로 `olcTLSProtocolMin`을 TLS 1.2 이상으로 강제하고 `olcTLSCipherSuite` baseline을 명시적으로 적용하며, 선택적으로 mTLS 기반 SASL EXTERNAL 매핑과 `LDAP_ANONYMOUS_READ_BASE`를 통한 익명 읽기 서브트리 제한을 사용할 수 있습니다.

### 이미지 및 레지스트리

v0.1.0 기준 이미지와 Helm chart가 GHCR에 실제 게시된 것을 확인했습니다.

- `ghcr.io/dasomel/ldapium:0.1.0` — OpenLDAP 2.6.15 서버 (Go 백엔드가 아닌 C/OpenLDAP 데몬)
- `ghcr.io/dasomel/ldapium-ui:0.1.0` — Go 백엔드 + React 프런트엔드, distroless static 이미지 단일 컨테이너, uid 65532로 실행
- `oci://ghcr.io/dasomel/charts/ldapium:0.1.0` — Helm chart

두 이미지 모두 `linux/amd64`, `linux/arm64`를 각각 **네이티브 러너**에서 빌드합니다. OpenLDAP의 `configure`가 에뮬레이션에서는 신뢰할 수 없는 런타임 프로브를 사용하기 때문입니다.

### 관리 UI 기능

DIT browser, 사용자/그룹 CRUD, 검색-선택 방식의 그룹 멤버십 관리, 비밀번호 설정 및 self-service 변경, 계정 잠금 해제, 관리자에 의한 계정 잠금(disable), `memberOf` 표시, 페이지네이션 목록, 비밀번호 정책 뷰, `cn=Monitor` 헬스 뷰, 사용자 조직 메타데이터, 운영자 액션 히스토리/모니터 로그 뷰, 인증 없이 조회 가능한 LDAP provider 헬스 엔드포인트를 제공합니다. 모든 요청은 로그인한 사용자로 bind하므로 세션 권한은 디렉터리 ACL이 결정하며 UI 자체는 서비스 계정을 갖지 않습니다(Keycloak SSO 경로만 예외). 클라이언트 IP 기준 로그인 실패 쓰로틀링, HTTP 응답에서 내부 에러 상세 redaction, DIT 브라우저에서 `userPassword` 값 redaction 등 보안 강화가 적용되어 있습니다. 선택적 Keycloak SSO(OIDC + PKCE)는 realm role로 게이팅되고, 로그인 상태를 시작한 브라우저에 바인딩해 CSRF성 로그인 하이재킹을 방지합니다. 한국어/영어를 모두 지원합니다.

## 보안 기본값

### Zero Default Passwords

서버와 Compose/Helm 모두 기본 관리자 password를 내장하지 않습니다. 값이 없으면 시작하지 않으며, Kubernetes에서는 Secret을 통한 주입을 권장합니다.

### No Sample Data

기본 이미지가 예제 사용자나 그룹을 자동 생성하지 않습니다. 필요한 directory content는 명시적으로 LDIF를 주입합니다. 이 선택은 Keycloak 등 identity provider와 federation하는 환경에서 특히 중요합니다.

### TLS

TLS 활성화 시 LDAPS listener를 제공하고 certificate hostname/CA를 엄격하게 검증합니다. 인증서 갱신은 Secret 교체 후 pod rolling restart로 수행할 수 있습니다.

## Kubernetes 아키텍처

<Mermaid chart={`flowchart TB
  CLIENTS["Keycloak · Applications · LDAP Clients"] -->|"LDAP / LDAPS · 389 / 636"| SERVER["ldapium Server\nOpenLDAP 2.6.15\nMDB · TLS · overlays"]
  UI["Optional Management UI"] -.->|"LDAP service"| SERVER
  SERVER -->|"persistent storage"| DATA["LDAP data · cn=config"]`} />

선택적으로 Web UI가 LDAP service를 통해 사용자와 그룹을 관리하며, Keycloak SSO를 사용할 때는 dedicated service account에 역할을 제한하는 구조를 사용할 수 있습니다.

## HA / Replication

`replicaCount`를 1보다 크게 설정하면 N-way multi-provider replication이 자동으로 켜지고 peer 목록도 자동으로 구성됩니다(`replication.enabled`로 명시적으로 켜고 끌 수도 있습니다). 기본 단일 replica는 local 또는 development 환경에 적합하며, replication 환경에서는 TLS와 peer verification, backup/restore 절차를 함께 검토해야 합니다. 여러 노드가 동시에 부팅될 때 각자 base DIT를 따로 만들지 않도록 cold-start election을 거칩니다.

Helm chart는 StatefulSet 기반으로 replica마다 별도 PVC, headless Service, PodDisruptionBudget, topology spread를 구성합니다. replication 파라미터(`retry`, `interval`, bind DN, 별도 replication Secret)는 chart values로 조정할 수 있습니다.

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

### 주요 Helm values

- `auth.adminPassword` / `auth.existingSecret` — 기본값이 없으며, 둘 다 비어 있으면 `helm install`/`template` 자체가 실패합니다(서버가 admin password 없이 시작을 거부하는 것과 동일한 원칙).
- `tls.enabled` (기본 `false`) — Secret으로 `tls.crt`/`tls.key`/선택적 `ca.crt`를 마운트해 LDAPS와 TLS 기반 replication을 켭니다. **v0.1.0 기준 이 경로는 템플릿과 entrypoint 로직만 존재하며 실제 클러스터에서 end-to-end로 검증되지 않았습니다.**
- `replication.*` — `retry`, `interval`, replication bind DN, 별도 replication Secret을 설정합니다.
- `seed.enabled` (기본 `false`) — LDIF를 ConfigMap으로 마운트해 최초 부팅 시에만 주입합니다. 프로젝트 원칙상 기본은 항상 off입니다.
- `backup.enabled` — data tree와 `cn=config`를 덤프하는 CronJob을 켜고, retention에 따라 정리하며 각 실행 기록을 `ou=operations`에 남깁니다.
- `ldap.maxOpenFiles` (기본 `4096`) — slapd의 file-descriptor 한도. 런타임 기본값(1048576)을 그대로 쓰면 connection table 예약만으로 RSS가 약 650MB 늘어나는 것이 실측됐습니다.
- `ldap.dbMaxSize` — 비워두면 `persistence.data.size`에서 자동 유도됩니다. mdb map 크기 자체는 RSS에 거의 영향을 주지 않는 것으로 확인됐습니다(10GiB→2GiB 변경 시 RSS 변화 1MiB 미만).
- `ldap.uniqueAttributes` (기본 `uid,mail`) — `unique` overlay가 강제하는 속성.
- `ldap.passwordPolicyEnabled` (기본 `true`), `ldap.passwordHash` (기본 `{ARGON2}`).

## Backup / Restore

LDAP 데이터와 `cn=config`를 모두 백업하는 경로를 제공합니다. Kubernetes에서는 chart의 backup CronJob을 사용하고, standalone 환경에서는 `scripts/backup.sh`로 동일한 dump 경로를 사용할 수 있습니다. 두 경로 모두 retention에 따라 오래된 백업을 정리하고, 실행 결과를 디렉터리 자체(`ou=operations`)에 기록합니다.

복구 시에는 directory data와 configuration을 분리해서 확인하고, replication 환경에서는 복구 순서에 따른 데이터 일관성을 별도로 검토해야 합니다. 상세 RPO/RTO와 절차는 `charts/ldapium/README.md`에 정리되어 있습니다.

## Air-Gap

ldapium은 image, Helm chart, SBOM, checksum을 `scripts/offline-bundle.sh`로 하나의 offline bundle로 묶습니다. `scripts/offline-install.sh`는 bundle 내용을 검증한 뒤 `imagePullPolicy=Never`로 설치하므로, 파일이 없거나 verification에 실패하면 외부 registry로 조용히 fallback하지 않고 설치가 그대로 실패합니다.

<Mermaid chart={`flowchart TB
  TAG["release tag"] --> ART["images + Helm chart"]
  ART --> EVIDENCE["SBOM + checksums + provenance"]
  EVIDENCE --> BUNDLE["offline bundle"]
  BUNDLE --> VERIFY["verify"]
  VERIFY --> INSTALL["imagePullPolicy=Never install"]`} />

이는 Narwhal의 air-gapped 운영 모델과 연결하기 좋은 특성입니다.

## Supply Chain / Compliance

프로젝트는 Go modules의 checksum verification(`go.sum` 기반 `-mod=readonly`, 변조 탐지 테스트 포함), GitHub Actions SHA pinning, tool digest pinning(`syft`, `govulncheck` 등 `latest`로 뜨던 항목을 digest로 고정), base 이미지 digest pinning, Trivy, CodeQL, license allow-list(`scripts/licenses.sh --check`), SPDX/CycloneDX SBOM, provenance attestation을 release 경계에 포함합니다.

v0.1.0 GitHub Release에는 실제로 `ldapium.spdx.json`, `ldapium.cdx.json`, `ldapium-ui.spdx.json`, `ldapium-ui.cdx.json`, `manifest.json`, `SHA256SUMS`가 asset으로 첨부되어 있는 것을 확인했습니다. 이미지의 build provenance와 SBOM attestation은 GitHub OIDC identity로 서명되며 `gh attestation verify oci://ghcr.io/dasomel/ldapium:0.1.0 --repo dasomel/ldapium`으로 검증할 수 있습니다.

특히 OpenLDAP 자체와 프로젝트 원본 코드를 라이선스 관점에서 분리하고, published image의 third-party license inventory와 NOTICE를 별도로 관리합니다.

## 알려진 제한사항

v0.1.0 CHANGELOG가 명시한 제한사항입니다.

- **TLS가 end-to-end로 검증되지 않았습니다.** 템플릿과 entrypoint는 인증서·TLS replication을 처리하지만 실제 클러스터에서 동작을 관찰한 적이 없습니다. 기본값은 off입니다.
- **UI 설정 페이지의 모듈/overlay 목록은 실행 중인 서버가 아니라 설정값 기준입니다.** 해당 값은 UI 세션이 가질 수 없는 별도 admin identity를 요구하는 `cn=config`에 있어서, 목록은 `image/Dockerfile`과 수작업으로 동기화됩니다.
- **업그레이드 경로가 아직 없습니다.** 0.1.0이 첫 릴리스이므로 업그레이드할 이전 버전이 없습니다.
- **e2e 워크플로 자체는 CI에서 실행된 적이 없습니다.** kind 클러스터에 chart를 설치하고 `helm test`를 실행하는 워크플로이며, 테스트 스크립트 자체는 실제 디렉터리로 검증됐지만 그 CI 배선은 새로 추가된 상태입니다.

## 현재 상태

**v0.1.0** (2026-09-23 릴리스, 첫 정식 릴리스) 기준 **Prototype**입니다. 기능과 packaging boundary는 실제 동작 여부를 기준으로 공개하지만, 아직 광범위한 외부 production adoption을 전제로 하지 않습니다. `ghcr.io/dasomel/ldapium:0.1.0`, `ghcr.io/dasomel/ldapium-ui:0.1.0`, Helm chart `oci://ghcr.io/dasomel/charts/ldapium:0.1.0`가 GHCR에 실제 게시된 것을 확인했으며, 위 "알려진 제한사항"은 그대로 유효합니다.

## 상세 기술 문서

| 주제 | 문서 | 내용 |
|---|---|---|
| Overview | [ldapium 개요](/oss/ldapium/overview) | 문제 정의와 packaging 전략 |
| Architecture | [디렉터리 아키텍처](/oss/ldapium/architecture) | server/UI/chart 구조 |
| Getting Started | [설치 가이드](/oss/ldapium/getting-started) | Docker Compose / Helm |
| Air-Gap | [오프라인 배포](/oss/ldapium/air-gap) | bundle / verification / disconnected install |
| Operations | [운영 가이드](/oss/ldapium/operations) | TLS, backup/restore, replication |

## 프로젝트 관계

<Mermaid chart={`flowchart TB
  UP["OpenLDAP upstream"] --> LDAP["ldapium"]
  LDAP --> IMG["server image"]
  LDAP --> UI["management UI"]
  LDAP --> HELM["Helm chart"]
  LDAP --> OFFLINE["offline bundle"]
  IMG --> IDP["Narwhal / Kubernetes IDP"]
  UI --> IDP
  HELM --> IDP
  OFFLINE --> IDP
  IDP --> SSO["Keycloak / SSO / Apps"]`} />
