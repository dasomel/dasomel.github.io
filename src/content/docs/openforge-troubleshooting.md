---
title: 문제 해결 가이드
description: 증상-증거-원인-조치-회귀방지 중심의 OpenForge 프로젝트 장애 분석 가이드.
project: OpenForge
path: openforge/troubleshooting
order: 1008
lastModified: 2026-08-23
---

# 문제 해결 가이드 (Troubleshooting)

OpenForge는 막연한 추측 대신 **검증 가능한 증거(Evidence-First)**를 중심으로 장애를 분석하고 재발을 방지합니다.

## 표준 장애 해결 워크플로 (Incident Flow)

```text
증상 확인 (Symptom: 실패한 명령, 오류 메시지, 관측된 이상)
      ↓
영향 범위 측정 (Scope: 영향받는 컴포넌트, 워크플로, 사용자)
      ↓
증거 수집 (Evidence: 로그, 메트릭, 실행 타임스탬프, 재현 단계)
      ↓
근본 원인 분석 (Root Cause: 코드 버그, 설정 드리프트, 공급망 문제)
      ↓
조치 및 검증 (Fix: 수정 코드 배포 및 로컬/CI 테스트 통과)
      ↓
회귀 테스트 작성 (Regression Test: 동일 문제 재발 방지 자동화)
      ↓
Lessons Log 및 문서 반영 (Documentation: 학습 내용 기록 및 표준 개선)
```

---

## 필수 기록 항목

장애 발생 시 `docs/lessons-log.md`에 다음 항목을 반드시 기록합니다:

1. **재현 명령어 및 워크플로**: 오류를 유발한 정확한 명령어
2. **기대 결과 vs 실제 결과**: 시스템의 정상 동작과 실제 출력
3. **환경 정보**: OS, 런타임, 패키지 버전, 커밋 해시
4. **직전 변경 내역**: 문제 발생 직전에 병합된 PR 또는 의존성 업데이트
5. **검증된 조치 내용**: 문제를 해결한 실제 수정사항 및 회귀 테스트 케이스
