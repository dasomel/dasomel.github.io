---
title: 운영 가이드
description: OpenForge 기반 프로젝트의 배포 이후 수명주기, 관측성, 백업/복구 및 운영 기준.
project: OpenForge
path: openforge/operations
order: 1006
lastModified: 2026-08-23
---

# 운영 가이드 (Operations)

OpenForge 기반 프로젝트는 설치 및 빌드 방법뿐 아니라 **배포 이후의 운영 수명주기(Lifecycle)**까지 명확히 문서화합니다.

## 필수 운영 점검 항목

1. **상태 진단 엔드포인트**: Liveness(`/healthz`), Readiness(`/readyz`), Startup 프로브 명세를 정의합니다.
2. **관측성(Observability)**: Prometheus 메트릭 엔드포인트, 구조화된 JSON 로그 형식, OpenTelemetry 추적 표준을 준수합니다.
3. **설정 및 시크릿 분리**: 민감 정보(Secret)는 코드 저장소에 저장하지 않으며, 환경변수나 시크릿 볼륨을 통해서만 주입합니다.
4. **업그레이드 및 롤백**: 무중단 롤링 업데이트, 데이터베이스 마이그레이션 호환성, 비상 롤백 절차를 명시합니다.
5. **백업 및 재해 복구(DR)**: 정기 백업 스케줄뿐 아니라 실제 데이터 복구 테스트 Runbook을 검증합니다.
6. **장애 대응 절차**: 심각도별 인시던트 대응 체계와 [Troubleshooting 가이드](/oss/openforge/troubleshooting)를 유지합니다.
