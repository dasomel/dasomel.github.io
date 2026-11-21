---
title: "Harbor arm64 fork를 정리하며: upstream이 따라와 준 날"
description: "Bitnami 무료 이미지 종료로 시작한 Harbor multi-arch fork를, 공식 v2.16.0의 arm64 지원에 맞춰 종료한 기록과 11개월 운영에서 배운 것"
pubDate: 2026-11-21
tags: ["Harbor", "Container Registry", "ARM64", "Multi-Arch", "Bitnami", "GitHub Actions", "Supply Chain Security"]
featured: false
draft: false
---

2026-11-21, [dasomel/harbor](https://github.com/dasomel/harbor) fork의 자동 동기화와 릴리스 빌드를 멈췄습니다. Harbor v2.16.0(2026-11-10)이 공식적으로 arm64 이미지를 내기 시작했기 때문입니다. 이 글은 fork를 왜 시작했고, 무엇을 만들었고, 왜 지금 내려놓는지의 기록입니다.

## 왜 시작했나: Bitnami 이미지가 멈췄다

그동안 Harbor arm64 이미지는 Bitnami가 제공하는 multi-arch 이미지를 써 왔습니다. 그런데 2025년 8월 Bitnami 무료 이미지 카탈로그가 종료되면서 Harbor 이미지도 업데이트가 멈췄습니다. Docker Hub를 직접 조회하면 지금 상태가 그대로 보입니다.

| 저장소 | 상태 (2026-11-21 조회) |
|---|---|
| `bitnamilegacy/harbor-core` | 마지막 태그 `2.13.2-debian-12-r3`(2025-08-19), `amd64, arm64` |
| `bitnami/harbor-core` | 공개 태그 없음, "Bitnami Secure Image"로 전환 |

공식 Harbor 이미지는 amd64만 있었습니다. ARM64 환경에서 최신 Harbor를 계속 쓰려면 직접 만드는 수밖에 없었고, 그래서 2025년 12월 goharbor/harbor를 fork해 multi-arch 빌드를 시작했습니다.

## fork에서 한 일

- **amd64 + arm64 multi-arch 이미지**: buildx로 두 아키텍처를 빌드해 하나의 manifest로 묶고 `ghcr.io/dasomel/goharbor/`에 배포했습니다. 공식 Helm chart와 이미지 이름이 호환됩니다.
- **공급망 보안**: 이미지마다 SPDX SBOM, SLSA provenance, Cosign keyless 서명을 붙였습니다.
- **자동화**: upstream을 주기적으로 머지하고, upstream에 새 GA 태그가 생기면 fork에서 릴리스를 자동으로 빌드했습니다.
- **결과**: v2.15.0부터 v2.15.4까지 multi-arch 릴리스를 냈습니다.

## 왜 지금 멈추나

Harbor v2.16.0이 arm64를 정식 지원합니다. 릴리스에 `harbor-offline-installer-v2.16.0-arm64.tgz`가 함께 올라오고, Docker Hub의 `goharbor/harbor-core:v2.16.0`도 `amd64, arm64` manifest입니다. 이 작업은 upstream [PR #22311](https://github.com/goharbor/harbor/pull/22311)(Full Multi-Architecture Enablement)로 들어갔고, 이 fork가 기여한 것은 아닙니다.

fork가 있어야 할 이유가 사라졌으니 자동 빌드를 끝냈습니다. arm64가 필요하면 upstream v2.16 이상을 쓰면 됩니다.

v2.15.5는 arm64로 내지 못했습니다. 2.15 라인의 베이스 이미지 `goharbor/photon:5.0-legacy`가 2026-11-09 갱신 이후 amd64 전용이 됐기 때문입니다. 2.16용 베이스(`photon:5.0`)로 바꾸면 빌드는 되지만 베이스 OS가 바뀌므로, 유지보수 라인에 그렇게 내보내지는 않았습니다. fork의 마지막 릴리스는 v2.15.4입니다.

## 11개월 운영하며 배운 것

### 1. fork는 "유지"가 일이다

3시간마다 upstream을 따라가며 workflow가 1,700번 넘게 돌았습니다. 동기화 스크립트는 충돌이 나면 fork 전용 파일을 fork 버전으로 남기게 되어 있었는데, 그 파일들은 upstream 변경을 영영 받지 못하고 조용히 낡아 갑니다. 정리할 때 보니 fork의 `CI.yml`은 Go 1.25.6에 머물러 있었고, upstream은 이미 1.27.3이었습니다.

### 2. `ubuntu-latest`는 계약이 아니다

GitHub-hosted runner의 `ubuntu-latest`가 2026-10-19부터 Ubuntu 26.04로 넘어가자, 코드를 한 줄도 바꾸지 않았는데 CI가 깨졌습니다. 테스트 스크립트의 `sudo -E env ... make go_check`에서 `GOPATH`가 넘어가지 않아 lint 도구를 `/root/go/bin`에서 찾았고, API 테스트 job은 컨테이너 안 Docker daemon을 띄우지 못했습니다. runner를 `ubuntu-24.04`로 고정하자 6개 job이 모두 다시 통과했습니다. 재현성이 중요한 파이프라인이라면 runner 버전을 고정하세요.

### 3. 멀티아키는 내 코드보다 베이스 이미지 문제다

빌드가 깨진 원인은 대부분 Harbor 코드가 아니라 베이스 OS 이미지에 arm64 manifest가 있느냐였습니다. v2.15.5가 그랬듯, upstream이 베이스 태그 하나를 다시 올리는 것만으로 arm64 빌드가 끊깁니다.

### 4. 예약 실행은 보장되지 않는다

fork 저장소의 scheduled workflow는 몇 번이나 며칠에서 몇 주씩 실행되지 않았습니다. 수동 실행도 `Actions has been disabled for this repository`로 거부되다가 나중에 저절로 풀렸습니다. 정확한 원인은 끝내 확인하지 못했습니다. 무료 runner의 예약 실행에 릴리스 파이프라인 전체를 걸면 안 된다는 것을 배웠습니다.

### 5. 외부 배포처에 기대던 것은 언젠가 직접 책임져야 한다

Bitnami 사례처럼 무료 배포는 언제든 바뀔 수 있습니다. 그리고 그 공백을 upstream이 메워 주면, 미련 없이 내려놓는 것도 운영입니다.

그동안 fork 이미지를 써 주신 분들께 감사드립니다.
