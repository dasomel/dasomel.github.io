---
title: 클러스터 설치 가이드
description: Vagrant + Helm + Argo CD 기반 로컬 데이터 플랫폼 1-클릭 부트스트랩.
project: Beluga
path: beluga/getting-started
order: 1502
lastModified: 2026-08-23
---

# 클러스터 설치 가이드

단일 로컬 머신에서 Beluga 데이터 플랫폼을 부트스트랩하는 가이드입니다.

## 1. 클러스터 구동

```bash
git clone https://github.com/dasomel/beluga.git
cd beluga
vagrant up
```

## 2. 데모 파이프라인 실행 및 데이터 검증

```bash
# 샘플 데이터베이스 및 CDC 파이프라인 생성
make demo-pipeline

# Trino CLI를 통한 Iceberg 테이블 실시간 쿼리
vagrant ssh master -c "trino --server http://localhost:8080 --catalog iceberg --schema default --execute 'SELECT * FROM order_events LIMIT 10;'"
```
