---
title: 문서화 표준
description: 이중 언어 문서 모델, 단일 진실 공급원(SoT) 및 문서 구조 표준.
project: OpenForge
path: openforge/standards/documentation
order: 1012
lastModified: 2026-08-23
---

# 문서화 표준

문서화는 단순한 부가 산출물이 아니라 프로젝트의 동작 방식을 정의하는 핵심 인터페이스입니다.

## 이중 언어 정책 (Bilingual Policy)

- **영어(English) Canonical**: 영어를 표준 프로젝트 언어로 사용합니다 (`<name>.md` 또는 `<name>-en.md`).
- **한국어(Korean) First-Class**: 한국어를 1급 번역으로 동등하게 제공합니다 (`<name>-ko.md` 또는 `<name>.md`).
- **1:1 구조 대칭성**: 영문과 한글 문서는 제목, 목차, 코드 블록, 링크가 1:1 대칭을 이루어야 합니다.

## 단일 진실 공급원 (Source of Truth)

- 구현 템플릿과 정식 기준은 `openforge` 저장소에 유지합니다.
- 웹 포털(`/oss/openforge/`)은 개념 설명, 튜토리얼, 트레이드오프 및 적용 증거를 제공합니다.
- 동일한 소스를 여러 곳에 중복 복사하지 않고 명시적인 소스 맵으로 연결합니다.

## 원문 및 권위 소스 (Canonical Source)

- [Documentation Standard](https://github.com/dasomel/openforge/blob/main/docs/documentation.md)
