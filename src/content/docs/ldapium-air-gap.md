---
title: 에어갭 배포 가이드
description: 폐쇄망 오프라인 번들 패키징, 레지스트리 미러링 및 검증 절차.
project: ldapium
path: ldapium/air-gap
order: 1703
lastModified: 2026-08-23
---

# 에어갭 배포 가이드

인터넷이 차단된 엔터프라이즈 폐쇄망 환경을 위한 배포 가이드입니다.

```bash
# 1. 온라인 환경에서 번들 생성
./scripts/bundle-images.sh

# 2. 폐쇄망 레지스트리로 이미지 푸시
./scripts/load-images.sh --registry internal-registry.local:5000
```
