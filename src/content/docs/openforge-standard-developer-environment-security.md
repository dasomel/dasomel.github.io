---
title: 개발 환경 보안 표준
description: 로컬 개발 환경 경계, 자격증명 격리 및 안전한 도구 실행 체계.
project: OpenForge
path: openforge/standards/developer-environment-security
order: 1027
lastModified: 2026-08-23
---

# 개발 환경 보안 표준

개발자 로컬 워크스테이션은 소스 코드와 배포 자격증명이 공존하는 중요한 보안 영역입니다.

## 로컬 환경 보안 수칙

- **자격증명 분리**: 프로덕션 비밀값과 개발용 비밀값을 엄격히 분리하고 로컬에 영구 저장하지 않습니다.
- **신뢰할 수 없는 스크립트 실행 방지**: `curl | bash` 등 검증되지 않은 원격 스크립트 실행을 금지합니다.
- **IDE 및 확장 도구 감사**: 신뢰할 수 있는 개발 도구와 플러그인만 설치합니다.

## 원문 및 권위 소스 (Canonical Source)

- [Developer Environment Security](https://github.com/dasomel/openforge/blob/main/docs/developer-environment-security.md)
