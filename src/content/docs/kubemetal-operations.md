---
title: 성능 최적화 & 운영
description: Unified Memory 메모리 압박 완화, 칩셋별 모델 권장 매트릭스 및 E2E 검증.
project: KubeMetal
path: kubemetal/operations
order: 1804
lastModified: 2026-08-23
---

# 성능 최적화 & 운영

Apple Silicon 하드웨어 연산 성능을 극대화하기 위한 튜닝 가이드입니다.

## 칩셋별 권장 모델 매트릭스

| 칩셋 티어 | 통합 메모리 용량 | 권장 파라미터 크기 | 양자화 수준 |
|---|---|---|---|
| **M1/M2/M3 Base** | 16 GB ~ 24 GB | 7B ~ 8B | 4-bit Q4_K_M |
| **M2/M3/M4 Pro** | 32 GB ~ 64 GB | 14B ~ 32B | 4-bit / 8-bit |
| **M2/M3/M4 Max** | 64 GB ~ 128 GB | 70B | 4-bit Q4_K_M |
| **M2/M3 Ultra** | 128 GB ~ 192 GB | 70B ~ 120B | 8-bit / 16-bit Full |

## GPU 메모리 확장 sysctl 설정

```bash
sudo sysctl iogpu.wired_mem_limit=57344  # 64GB 중 56GB를 GPU에 할당
```
