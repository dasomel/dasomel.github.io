---
title: "Ldapium 배포 가이드"
description: "Ldapium의 Kubernetes Helm 및 Docker Compose 배포와 검증 절차"
project: "Ldapium"
order: 502
lastModified: 2026-08-19
---

## Kubernetes / Helm

Ldapium은 Helm chart로 StatefulSet 기반 배포를 지원합니다.

```bash
helm install ldapium oci://ghcr.io/dasomel/charts/ldapium \
  --namespace directory --create-namespace \
  --set auth.adminPassword="$(openssl rand -base64 24)" \
  --set ldap.rootDN='dc=example,dc=org'
```

실제 release artifact가 아직 발행되지 않은 환경에서는 저장소의 `charts/ldapium`을 직접 사용해 chart를 검증할 수 있습니다.

```bash
helm lint charts/ldapium
helm template ldapium charts/ldapium \
  --set auth.adminPassword=ci-render-only-not-a-secret
```

### 보안 주의

`auth.adminPassword`를 Helm 명령줄에 직접 전달하면 shell history에 남을 수 있습니다. 운영에서는 `auth.existingSecret` 방식으로 Kubernetes Secret을 미리 생성하는 것을 권장합니다.

## HA / Replication

```yaml
replicaCount: 3
```

으로 N-way multi-provider replication을 활성화할 수 있습니다. StatefulSet ordinal과 headless Service 기반 peer discovery를 사용합니다.

## TLS

현재 chart에는 TLS 경로가 구현되어 있지만 **end-to-end runtime 검증은 아직 완료되지 않은 prototype 경로**입니다. `tls.enabled=true`로 template은 렌더할 수 있지만 운영 환경 적용 전 실제 인증서·LDAPS·replication 동작을 별도로 검증해야 합니다.

## Management UI

```yaml
ui:
  enabled: true
```

으로 관리 UI Deployment를 활성화합니다. UI는 기본 LDAP 로그인 또는 선택적 Keycloak OIDC/PKCE SSO를 사용할 수 있습니다.

SSO 활성화 시:

- `ui.sso.existingSecret` 필요
- 별도 `ui.ldapServiceAccount.existingSecret` 필요
- `userSearchBase`와 `userSearchFilter` 필요
- callback origin은 정확한 origin 단위로 허용

## Docker Compose

Kubernetes 없이 서버와 UI를 함께 실행할 수 있습니다.

```bash
make local-init
make local-up
make local-credentials
```

기본적으로 LDAP는 `389`, UI는 `8080`으로 노출되며 named volume으로 config/data를 유지합니다.

## 설치 검증

Kubernetes에서는 다음 명령을 가장 먼저 실행합니다.

```bash
helm test ldapium --namespace directory --logs
```

테스트는 root DSE 조회, admin bind, scratch entry 생성/삭제, `memberOf` overlay 및 replication convergence 등을 확인합니다.

## Backup / Restore

Kubernetes backup CronJob을 활성화하면 LDAP data tree와 `cn=config`을 별도 PVC에 백업합니다.

Standalone 환경에서는:

```bash
./scripts/backup.sh -b dc=example,dc=org -o ./backups
```

를 사용합니다.

복제 환경 복원은 모든 replica가 동일한 내용을 되돌릴 수 있으므로 권위 있는 한 노드에서 복원한 뒤 나머지 노드를 다시 구성하는 절차가 필요합니다.

## 현재 릴리스 상태

Ldapium은 현재 **prototype / pre-release** 단계입니다. 소스, CI, Helm chart, release workflow는 준비되어 있지만 정식 `v0.1.0` artifact의 실제 registry publication 여부는 GitHub Actions와 GHCR에서 확인한 뒤 사용자에게 안내해야 합니다.
