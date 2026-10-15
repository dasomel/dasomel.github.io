---
title: "beluga-manager를 beluga 모노레포로 통합한 이유"
description: "핀(pin)으로 이어 붙인 두 저장소는 118 커밋을 뒤처졌고 크로스 레포 변경은 원자적이지 않았습니다. beluga-manager를 beluga의 manager/ 디렉터리로 통합한 결정과 대안, 결과를 ADR-0005 기준으로 정리합니다."
pubDate: 2026-10-15
tags: ["Open Source", "Monorepo", "Architecture Decision", "CI/CD", "Beluga", "Platform Engineering"]
projects: ["beluga"]
featured: false
draft: false
---

2026-10-15, `dasomel/beluga-manager`를 `dasomel/beluga`의 `manager/` 디렉터리로 통합했습니다(전체 히스토리 보존). 결정은 beluga의 [ADR-0005](https://github.com/dasomel/beluga/blob/main/docs/adr/0005-consolidate-beluga-manager-into-monorepo.md)에 기록되어 있고, 이 글은 그 배경을 요약합니다. 통합 후 프로젝트 소개는 사이트의 [Beluga 프로젝트 페이지](/ko/projects/beluga)에 합쳤습니다.

## 문제: 핀으로 묶은 두 저장소

`beluga`는 Bash/Helm/Python 기반 Kubernetes 데이터 플랫폼이고, `beluga-manager`는 TypeScript/Node npm workspace 기반 컨트롤 플레인(`domain-api`, `policy-compiler`, `web`)이었습니다. 둘은 Git 저장소가 아닌 상위 작업 디렉터리로 함께 다뤄졌습니다. 통합을 결정한 이유는 세 가지입니다.

- **manager 단독으로는 배포 대상이 없습니다.** upstream 호스트가 `*.local.beluga.internal`로 고정되어 있고, 어댑터는 대부분 stub이며, manager 자신의 ADR-0005가 제안한 차트와 `Application`은 구현된 적이 없습니다. 플랫폼 없이는 의미가 약한 구성이었습니다.
- **정책 seam이 핀 하나에 의존했습니다.** `policies/`의 YAML은 manager의 `policy-compiler`가 `trino.rego`와 `db-roles.sql`의 생성 영역으로 컴파일하고, 테스트 14가 그 결과를 diff합니다. 그런데 `ci.yml`과 `release.yml`은 beluga-manager를 **서로 다른 SHA로 고정**해 체크아웃했고, `ci.yml`의 핀(`a63db0b`)은 통합 시점(`93869de`)에 manager main보다 **118 커밋** 뒤처져 있었습니다. 컴파일러 계약이 바뀌면 다른 저장소에서 핀을 손으로 올려야 했고, 그 수동 단계가 이미 118 커밋 동안 빠져 있었습니다.
- **크로스 레포 변경이 원자적이지 않았습니다.** 컴파일러 변경과 재생성된 산출물은 두 개의 PR로 나뉘어, 함께 리뷰하거나 함께 머지할 수 없었습니다.

## 결정

1. 전체 히스토리와 함께 `manager/`로 가져옵니다.
2. **D-MONO-1**: `manager/`는 자체 `package.json`/lockfile을 유지하고, `manager/**`로 path-filter된 `manager-ci.yml`과 `/manager`용 npm Dependabot 항목을 둡니다. beluga의 워크플로는 문서, SAST, 공급망 같은 공통 관심사를 계속 담당합니다.
3. **D-MONO-2**: 테스트 14와 `ci.yml`/`release.yml`은 같은 트리의 `manager/`에서 컴파일러를 실행합니다. 핀으로 고정한 체크아웃은 제거합니다.
4. **D-MONO-3**: ADR-0005는 manager의 기존 ADR-0005(배포·GitOps 연동)를 대체합니다. manager 전용 배포 차트와 `Application`은 추진하지 않고, 클러스터 내 배포가 필요해지면 beluga `docs/adr/`에 새 ADR로 결정합니다.

## 검토했지만 택하지 않은 대안

- **두 저장소를 유지하고 핀을 더 자주 올리기** — 비원자적 변경과 수동 단계가 그대로 남습니다. 그 수동 단계가 이미 118 커밋 동안 누락됐습니다.
- **컴파일러를 버전이 붙은 npm 패키지로 배포하기** — 소비자가 하나뿐인 도구를 위해 릴리스 파이프라인을 새로 만들어야 합니다.
- **Git submodule** — 결국 핀이고, 기여자와 CI에게 번거롭습니다.

## 결과

- 컴파일러 변경과 재생성된 `trino.rego`/`db-roles.sql`이 한 PR로 들어가므로 seam 검사가 컴파일러와 어긋날 수 없습니다.
- manager는 여전히 플랫폼과 독립적으로 릴리스합니다. CI가 path-filter되어 beluga 전용 PR에서는 manager CI가 돌지 않습니다.
- 저장소 전체 검사(lint, validate, docs, research, SAST)가 이제 `manager/`도 봅니다. manager가 이미 가진 검사와 중복되는 것은 범위에서 빼되, 보안 스캔은 빼지 않습니다.
- 열려 있던 beluga-manager 이슈 22건을 beluga #239–#260으로 이전하고 `area:manager` 라벨을 붙였습니다. 옛 번호와의 대응은 [이 코멘트](https://github.com/dasomel/beluga/issues/239#issuecomment-6186301298)에 있습니다.
- OpenForge에서는 manager의 별도 포트폴리오 항목을 `beluga`로 합쳤습니다. `policy-compiler` capability는 루트 `.openforge/status.json`으로 옮겼고, `dasomel/openforge` 레지스트리의 `beluga-manager` 항목 정리는 그쪽에서 추적합니다.
- `dasomel/beluga-manager`는 `manager/`를 가리키며 아카이브했습니다.

## 이 사이트에서 바뀐 것

`/oss/beluga-manager/…` 같은 옛 주소는 새 위치(`/oss/beluga/manager-…`)로 이동하는 정적 안내 페이지를 두었습니다. 이전 글은 당시 기록이므로 고쳐 쓰지 않고, 별도 저장소로 서술한 곳에 날짜가 붙은 메모만 추가했습니다.

## 남은 일

통합은 구조의 문제를 해결했을 뿐 manager의 성숙도를 바꾸지 않습니다. 기본값은 여전히 fixture 응답이고, 읽기 전용 어댑터는 Flink·Trino·Lakekeeper뿐이며, 인증/인가와 클러스터 배포는 아직 없습니다. 현재 범위는 [매니저 개요](/oss/beluga/manager-overview)에 있는 그대로입니다.
