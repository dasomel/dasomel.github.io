---
title: 국제화(i18n) 표준
description: 다국어 UI 리소스 구조, 번역 키 관리 및 로케일 일관성 표준.
project: OpenForge
path: openforge/standards/i18n
order: 1037
lastModified: 2026-08-23
---

# 국제화(i18n) 표준

사용자 인터페이스(UI)를 제공하는 프로젝트는 초기 설계부터 다국어 지원을 고려해야 합니다.

## 국제화 표준 수칙

- **기본 로케일 지원**: 한국어(`ko-KR`)와 영어(`en-US`)를 기본 지원합니다.
- **구조화된 리소스 번들**: 번역 텍스트는 코드에 하드코딩하지 않고 `messages/ko.json`, `messages/en.json`으로 분리합니다.
- **누락 키 검증**: CI 파이프라인에서 로케일 간 번역 키 누락 여부를 자동으로 검사합니다.

## 원문 및 권위 소스 (Canonical Source)

- [Internationalization Standard](https://github.com/dasomel/openforge/blob/main/docs/i18n.md)
