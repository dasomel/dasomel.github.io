---
title: Troubleshooting
description: Evidence-first 방식의 OpenForge 프로젝트 Troubleshooting.
project: OpenForge
path: openforge/troubleshooting
order: 1008
lastModified: 2026-08-21
---

# Troubleshooting

추측을 나열하기보다 evidence를 중심으로 문제를 좁혀갑니다.

## Incident Format

```text
Symptom
  ↓
Scope
  ↓
Evidence
  ↓
Root cause
  ↓
Fix
  ↓
Regression test
  ↓
Documentation update
```

## 최소 기록

- 정확한 command/workflow
- 기대 결과
- 실제 결과
- 관련 log
- environment/runtime version
- 장애 직전 변경
- 검증된 fix
- 재발 방지 또는 regression coverage

## 예시

한 workflow의 build command가 새로운 runtime을 사용하도록 변경되었는데 deployment workflow에는 해당 runtime이 없어 실패할 수 있습니다. 해결은 단순히 해당 workflow에 runtime을 설치하는 것에 그치지 않고, workflow-wide runtime inventory와 regression validation을 변경 계약에 포함하는 것입니다.
