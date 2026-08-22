---
title: 시크릿 및 머신 신원 표준
description: 단기 토큰, OIDC 페더레이션, 시크릿 탐지 및 하드코딩 자격증명 배제.
project: OpenForge
path: openforge/standards/secrets-identity
order: 1030
lastModified: 2026-08-23
---

# 시크릿 및 머신 신원 표준

비밀값(Secrets)과 머신 신원(Machine Identity)은 수명 주기와 노출 표면을 최소화해야 합니다.

## 시크릿 관리 원칙

- **하드코딩 절대 금지**: 소스 코드나 매니페스트에 비밀값을 절대 포함하지 않습니다.
- **단기 토큰 우선**: 장기 지속 API 키 대신 OIDC 페더레이션을 통한 수명이 짧은 토큰을 발급받아 사용합니다.
- **주기적 회전(Rotation)**: 모든 시크릿은 정기적으로 회전하며 비상 교체 절차를 준비합니다.

## 원문 및 권위 소스 (Canonical Source)

- [Secrets & Machine Identity](https://github.com/dasomel/openforge/blob/main/docs/secrets-identity.md)
