---
title: 클러스터 설치 가이드
description: Vagrant + Helm 기반 로컬 부트스트랩.
project: Beluga
path: beluga/getting-started
order: 1500
lastModified: 2026-08-23
---

# 클러스터 설치 가이드

단일 머신에서 전체 데이터 플랫폼을 구동하는 단계입니다.

## 부트스트랩 명령어
```bash
vagrant up
vagrant ssh master -c 'kubectl get pods -A'
```

## 관련 링크

- [Beluga 저장소](https://github.com/dasomel/beluga)
- [프로젝트 홈](/oss/beluga/)
