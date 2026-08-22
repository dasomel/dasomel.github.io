---
title: MLOps 파이프라인
description: 로컬 LLM 파인튜닝(LoRA/QLoRA), MLX 양자화 변환 및 고속 분산 추론.
project: KubeMetal
path: kubemetal/mlops
order: 1802
lastModified: 2026-08-23
---

# MLOps 파이프라인

KubeMetal에서 로컬 모델을 파인튜닝하고 서빙하는 파이프라인 가이드입니다.

## 지원 파이프라인

1. **원클릭 모델 다운로드**: HuggingFace / Ollama 가중치 다운로드
2. **LoRA / QLoRA 파인튜닝**: 커스텀 데이터셋을 활용한 로컬 지도학습(SFT)
3. **4-bit / 8-bit 양자화 변환**: Apple MLX 포맷 변환으로 메모리 사용량 70% 절감
4. **고속 로컬 서빙**: OpenAI 호환 `/v1/chat/completions` API 엔드포인트 제공
