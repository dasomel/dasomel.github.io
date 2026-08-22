---
title: 오픈소스 컴플라이언스 표준
description: Apache 2.0 라이선스, SPDX 헤더, 의존성 라이선스 호환성 및 고지.
project: OpenForge
path: openforge/standards/oss-compliance
order: 1038
lastModified: 2026-08-23
---

# 오픈소스 컴플라이언스 표준

오픈소스 라이선스와 저작권 준수는 법적 신뢰성을 확보하기 위한 기본 의무입니다.

## 컴플라이언스 규칙

- **표준 라이선스**: OpenForge 프로젝트는 Apache License 2.0을 기본 라이선스로 채택합니다.
- **SPDX 헤더 명시**: 모든 소스 파일 상단에 `SPDX-License-Identifier: Apache-2.0` 식별자를 표기합니다.
- **의존성 호환성 감사**: 상용 배포 및 오픈소스 호환성을 저해하는 의존성 라이선스 유입을 CI에서 차단합니다.

## 원문 및 권위 소스 (Canonical Source)

- [OSS Compliance Standard](https://github.com/dasomel/openforge/blob/main/docs/oss-compliance.md)
