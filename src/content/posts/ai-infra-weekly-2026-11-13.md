---
title: "AI Infrastructure Weekly · 2026 W46 — Agent serving의 KV 상태와 훈련 정확성"
description: "복구된 주간 연구 브리핑: Agent serving의 KV 상태와 훈련 정확성."
pubDate: 2026-11-13
updatedDate: 2026-11-24
tags: ["AI Infrastructure", "Kubernetes", "MLOps", "Research"]
featured: false
draft: false
---

> 복구된 AI Infra Research Brief 기록을 2026-11-24에 재편집한 AI 보조 리서치입니다. 원문에 남은 논문 식별자는 검증을 위해 보존하고, 수치와 미검증 릴리스 주장은 제외합니다. 원문 전체를 복구한 것은 아닙니다.

## 기존 브리핑의 연구 목록

- [Bursts That Outlast Themselves](https://arxiv.org/abs/2611.13412)
- [Evolving Infra](https://arxiv.org/abs/2611.12304)
- [Plumbline](https://arxiv.org/abs/2611.13393)
- [VerKV](https://arxiv.org/abs/2611.11319)
- [Can KV Cache Be Reused Across Model Updates?](https://arxiv.org/abs/2611.14051)
- [The GPU Needs an Operating System](https://arxiv.org/abs/2611.08720)

## 아키텍처 및 운영 시사점

Agent의 KV working set은 admission과 복구의 상태 변수다. burst 종료 후에도 cache miss·prefill 재계산·세션 체류시간을 관찰하고, session parking의 효과를 비교한다. Prefill/decode phase switching과 KV placement를 분리해 설계하며, 모델 revision 간 KV 재사용은 품질 회귀를 검증하기 전에는 기본적으로 격리한다. 훈련은 loss 외에도 tokenizer, loss mask, collective, checkpoint round-trip 및 reference gradient 증거를 MLflow에 기록하는 promotion gate를 제안한다. GPU 공유는 평균 활용률만이 아니라 foreground p99 slowdown으로 평가한다. MLX 이슈 #4841, #4856은 로컬 런타임 회귀 검토 대상으로 남긴다.

## 읽기 / 검증 / 추적

원문 링크의 제목과 결과를 확인한 뒤 활용한다. 격리 환경에서 기준값·실패 기준을 정의하고 PoC를 수행하며 공식 릴리스를 추적한다. 프로젝트 적용 내용은 실증된 기능이 아닌 제안이다.

- [Kueue releases](https://github.com/kubernetes-sigs/kueue/releases)
- [MLflow releases](https://github.com/mlflow/mlflow/releases)
- [MLX releases](https://github.com/ml-explore/mlx/releases)
- [MLX issue #4841](https://github.com/ml-explore/mlx/issues/4841)
- [MLX issue #4856](https://github.com/ml-explore/mlx/issues/4856)

