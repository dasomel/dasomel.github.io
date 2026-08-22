---
title: Day-2 운영 & 재해복구
description: Velero 백업 자동화, Air-Gap 오프라인 번들 배포 및 노드 점검 런북.
project: Narwhal
path: narwhal/operations
order: 1107
lastModified: 2026-08-23
---

# Day-2 운영 & 재해복구

Narwhal은 설치 후 지속적인 클러스터 운영과 재해 복구를 위한 구체적인 런북을 제공합니다.

## 정기 백업 및 복구 (Velero)

- 매일 자정 전체 Kubernetes 매니페스트 및 PVC 볼륨 스냅샷을 SeaweedFS S3에 자동 백업
- 재해 발생 시 단일 명령어로 전체 클러스터 상태 복원:
  ```bash
  velero restore create --from-backup narwhal-daily-backup-latest
  ```

## Air-Gap 오프라인 배포

인터넷 연결이 차단된 폐쇄망 환경을 위해 사전 패키징된 아카이브 번들을 제공합니다.
- `narwhal-bundle-arm64.tar.gz` / `narwhal-bundle-amd64.tar.gz`
- 컨테이너 이미지 120종, Helm 차트 35종, OS deb 패키지 및 바이너리 포함
- 설치 스크립트 실행 시 로컬 레지스트리로 자동 로드
