---
title: 배포 및 운영
description: Multi-stage 컨테이너 빌드, 헬스체크 및 환경변수.
project: Narwhal Portal
path: narwhal-portal/operations
order: 1200
lastModified: 2026-08-23
---

# 배포 및 운영

프로덕션 쿠버네티스 클러스터 배포 기준입니다.

## 운영 베이스라인
- Multi-stage Dockerfile로 런타임 이미지 최소화 (Non-root `USER 10001`)
- `/api/health` 헬스체크 엔드포인트 제공
- ConfigMap 및 Secret을 통한 런타임 환경변수 주입

## 관련 링크

- [Narwhal Portal 저장소](https://github.com/dasomel/narwhal-portal)
- [포털 홈](/oss/narwhal-portal/)
