---
title: 배포 및 운영
description: 컨테이너 빌드, 환경변수 및 쿠버네티스 배포.
project: Beluga Manager
path: beluga-manager/operations
order: 1600
lastModified: 2026-08-23
---

# 배포 및 운영

프로덕션 배포 및 설정 기준입니다.

## 운영 가이드라인
- Multi-stage 경량 컨테이너 이미지 배포
- ConfigMap을 통한 클러스터 엔드포인트 주입
- `/health` 프로브를 통한 파드 상태 점검

## 관련 링크

- [Beluga Manager 저장소](https://github.com/dasomel/beluga-manager)
- [프로젝트 홈](/oss/beluga-manager/)
