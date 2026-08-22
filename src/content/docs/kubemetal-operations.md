---
title: 성능 최적화 & 운영
description: Unified Memory 튜닝, 호환성 매트릭스, E2E 검증.
project: KubeMetal
path: kubemetal/operations
order: 1800
lastModified: 2026-08-23
---

# 성능 최적화 & 운영

Apple Silicon 하드웨어 성능을 극대화하기 위한 운영 가이드입니다.

## 성능 튜닝
- macOS sysctl `iogpu.wired_mem_limit` 파라미터 조정을 통한 GPU 메모리 확장
- M1/M2/M3/M4 칩셋별 모델 크기 권장 매트릭스 준수
- E2E 자동화 테스트 시나리오 실행

## 관련 링크

- [KubeMetal 저장소](https://github.com/dasomel/kubemetal)
- [프로젝트 홈](/oss/kubemetal/)
