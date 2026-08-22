---
title: Day-2 운영 & 재해복구
description: Velero 백업, 에어갭 오프라인 번들, 업그레이드 가이드.
project: Narwhal
path: narwhal/operations
order: 1100
lastModified: 2026-08-23
---

# Day-2 운영 & 재해복구

플랫폼 배포 이후의 지속적인 운영과 재해 복구 절차를 정의합니다.

## 운영 수칙
- **백업 자동화**: Velero를 통한 클러스터 리소스 및 PVC 스냅샷 일일 자동 백업
- **Air-Gap 번들 배포**: 외부 인터넷망과 단절된 폐쇄망 환경을 위한 사전 패키징 번들 설치
- **노드 유지보수**: `kubectl drain` 및 PodDisruptionBudget 기반 무중단 롤링 점검

## 관련 링크

- [Narwhal 저장소](https://github.com/dasomel/narwhal)
- [Narwhal 포털](/oss/narwhal/)
