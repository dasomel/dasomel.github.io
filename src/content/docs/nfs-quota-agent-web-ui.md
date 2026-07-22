---
title: "웹 UI"
description: "NFS Quota Agent에 내장된 대시보드의 사용 방법, 탭 구성 및 API 정보"
project: "NFS Quota Agent"
order: 403
lastModified: 2026-07-17
---

## 내장 대시보드 활성화

NFS Quota Agent는 스토리지 관리를 시각화하는 통합 웹 대시보드를 내장하고 있습니다. 에이전트 실행 시 다음 플래그를 통해 활성화할 수 있습니다.

- **CLI 실행 시**: `nfs-quota-agent run --enable-ui --ui-addr=:8080`
- **Helm 배포 시**: `values.yaml` 내에서 `webUI.enabled=true`, `webUI.addr=":8080"` 설정

활성화되면 브라우저에서 `http://<node-ip>:8080`을 통해 접근할 수 있습니다.

## 주요 탭 구성

### 1. Quotas (메인 화면)
쿼터가 적용된 전체 디렉토리의 상태를 테이블 형식으로 표시합니다.
- 컬럼 헤더 클릭 시 사용량, 디렉토리명 기준으로 정렬됩니다.
- 디렉토리 행을 클릭하면 하위 디렉토리(📁) 및 크기 정보를 포함한 파일(📄)을 보여주는 **파일 브라우저**가 확장됩니다.
- 디스크 총 용량, 사용률에 대한 상태 요약 카드를 상단에서 한눈에 볼 수 있습니다.

### 2. Orphans (고아 디렉토리 관리)
클러스터에 없는 파일시스템 상의 고아 디렉토리 목록을 표시합니다.
- `--enable-auto-cleanup` 기능이 필요합니다.
- `Live` 모드로 설정된 경우, 화면 내 체크박스를 이용해 선택한 고아 디렉토리들을 즉시 삭제("Delete Selected")할 수 있습니다.
- 유예 기간(Grace Period)에 따른 삭제 가능 상태를 표시합니다 ("Can Delete" 또는 "In Grace Period").

### 3. Trends (사용량 추이)
과거부터 수집된 스토리지 사용량을 기반으로 추세를 분석합니다.
- `--enable-history` 기능이 필요합니다.
- 24시간, 7일, 30일 간의 증감량과 방향성 아이콘을 통해 디렉토리별 증가 속도를 확인할 수 있습니다.

### 4. Policies (네임스페이스 정책)
네임스페이스별 쿼터 설정(LimitRange, Annotation 등)과 이로 인한 위반 내역을 모아 표시합니다.
- `--enable-policy` 기능이 필요합니다.

### 5. Audit Logs (감사 로그)
쿼터의 생성, 수정, 삭제 이력을 열람합니다.
- `--enable-audit` 기능이 필요합니다.
- 화면 상단의 필터를 통해 "실패(Fails only)" 액션, 생성("CREATE") 등으로 특정 기록만 필터링하여 검색할 수 있습니다.

## 편의 기능

- **다크 모드**: 우측 상단의 달 아이콘으로 라이트/다크 테마를 토글할 수 있으며, 선호도는 로컬 스토리지에 유지됩니다.
- **단축키**: `R`키(새로고침), `1~5`숫자키(탭 이동), `/`키(검색창 포커스) 등을 지원합니다.

## REST API 참조

대시보드의 모든 정보는 REST API를 통해서도 제공되며, 이를 이용해 외부 모니터링이나 자체 스크립트 연동이 가능합니다.

- `/api/status`: 디스크 전체 및 쿼터 요약 정보 (GET)
- `/api/quotas`: PV/PVC 정보를 포함한 전체 쿼터 목록 (GET)
- `/api/files?path=/export/default`: 특정 디렉토리 하위 내용 탐색 (GET)
- `/api/orphans/delete`: 고아 디렉토리 강제 삭제 (POST, Live 모드에서만 동작)
- 기타: `/api/audit`, `/api/trends`, `/api/policies` 등
