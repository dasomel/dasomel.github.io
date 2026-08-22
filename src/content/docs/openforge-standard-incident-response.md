---
title: 보안 및 장애 대응 표준
description: 장애 및 보안 사고 분석, 완화 절차, Lessons Log 회귀 테스트화.
project: OpenForge
path: openforge/standards/incident-response
order: 1032
lastModified: 2026-08-23
---

# 보안 및 장애 대응 표준

장애와 보안 사고는 시스템을 개선하고 신뢰성을 강화할 수 있는 중요한 학습 기회입니다.

## 장애 대응 4단계

1. **격리 및 완화 (Mitigate)**: 영향받는 서비스를 격리하고 빠른 롤백 또는 핫픽스로 피해를 최소화합니다.
2. **원인 분석 (Analyze)**: 시스템 로그, 메트릭, 변경 이력을 수집하여 근본 원인을 분석합니다.
3. **회귀 테스트 작성 (Prevent)**: 동일한 장애가 다시 발생하지 않도록 자동화된 회귀 테스트를 작성합니다.
4. **Lessons Log 기록 (Learn)**: `docs/lessons-log.md`에 사고 내용과 교훈을 기록하고 표준을 개선합니다.

## 원문 및 권위 소스 (Canonical Source)

- [Security & Incident Response](https://github.com/dasomel/openforge/blob/main/docs/incident-response.md)
