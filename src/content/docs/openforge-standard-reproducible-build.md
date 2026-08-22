---
title: 재현 가능한 빌드 표준
description: 결정론적 빌드 산출물, 환경 고정 및 재현성 검증 체계.
project: OpenForge
path: openforge/standards/reproducible-build
order: 1020
lastModified: 2026-08-23
---

# 재현 가능한 빌드 표준

동일한 소스 코드와 커밋 해시로부터 빌드된 산출물은 언제나 비트 단위로 동일해야 합니다.

## 재현성 요구사항

- **빌드 환경 고정**: 컨테이너 베이스 이미지 태그(SHA256 다이제스트)와 컴파일러 버전을 고정합니다.
- **타임스탬프 정규화**: `SOURCE_DATE_EPOCH` 환경변수를 사용하여 빌드 아티팩트의 생성 시각을 결정론적으로 고정합니다.
- **Lockfile 필수**: 모든 패키지 매니저는 의존성 체크섬이 포함된 Lockfile을 필수로 커밋하고 CI에서 `--frozen-lockfile`로 설치합니다.

## 원문 및 권위 소스 (Canonical Source)

- [Reproducible Build Standard](https://github.com/dasomel/openforge/blob/main/docs/reproducible-build.md)
