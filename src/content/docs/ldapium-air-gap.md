---
title: 오프라인 번들 가이드
description: 폐쇄망 설치를 위한 아티팩트 번들링.
project: ldapium
path: ldapium/air-gap
order: 1700
lastModified: 2026-08-23
---

# 오프라인 번들 가이드

인터넷이 없는 폐쇄망 환경을 위한 번들 생성 및 배포 지침입니다.

## 번들링 절차
1. `scripts/bundle-images.sh`로 컨테이너 이미지 아카이브 생성
2. 오프라인 미러 레지스트리에 이미지 푸시
3. Helm values에서 오프라인 레지스트리 경로 지정

## 관련 링크

- [ldapium 저장소](https://github.com/dasomel/ldapium)
- [프로젝트 홈](/oss/ldapium/)
