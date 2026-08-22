---
title: 오픈소스 컴플라이언스 표준
description: Apache 2.0 라이선스, SPDX 헤더, 의존성 라이선스 호환성 및 고지.
project: OpenForge
path: openforge/standards/oss-compliance
order: 1038
lastModified: 2026-08-22
---

# OSS 컴플라이언스 표준

라이선스, 저작권 고지, 제3자 구성요소는 개발 작업의 일부로 관리합니다.

## 규칙

- 첫 공개 릴리스 전에 프로젝트 라이선스를 선택하고 공개합니다.
- 제3자 dependency와 라이선스를 추적합니다.
- 필요한 copyright와 attribution notice를 유지합니다.
- 소스가 공개되어 있다는 이유만으로 permissive license라고 가정하지 않습니다.
- source-available 및 copyleft license를 별도로 검토합니다.
- 필요한 경우 NOTICE 또는 third-party attribution 파일을 제공합니다.
- 중요한 license exception이나 배포 제약을 문서화합니다.

## 권장 파일

```text
LICENSE
NOTICE
THIRD-PARTY-LICENSES.md
```

가능한 경우 SPDX identifier를 사용합니다.

## Canonical source

- [OSS Compliance Standard](https://github.com/dasomel/openforge/blob/main/docs/oss-compliance.md)
