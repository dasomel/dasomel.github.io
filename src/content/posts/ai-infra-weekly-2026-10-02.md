---
title: "AI Infrastructure Weekly · 2026 W40 — GPU 스케줄링과 분산 추론 최적화"
description: "복구된 주간 연구 브리핑: GPU 스케줄링과 분산 추론 최적화."
pubDate: 2026-10-02
updatedDate: 2026-11-24
tags: ["AI Infrastructure", "Kubernetes", "MLOps", "Research"]
featured: false
draft: false
---

> 복구된 AI Infra Research Brief 기록을 2026-11-24에 재편집한 AI 보조 리서치입니다. 원문에 남은 논문 식별자는 검증을 위해 보존하고, 수치와 미검증 릴리스 주장은 제외합니다. 원문 전체를 복구한 것은 아닙니다.

## 기존 브리핑의 연구 목록

- [SPLASH](https://arxiv.org/abs/2609.37626)
- [Argus](https://arxiv.org/abs/2609.39067)
- [ThunderEP](https://arxiv.org/abs/2609.40093)
- [HAPMoE](https://arxiv.org/abs/2609.39350)

## 아키텍처 및 운영 시사점

Kueue 0.20과 MLX 0.32.3도 원 브리핑의 추적 대상이었다. 스케줄러의 admission과 inference runtime의 병렬 실행을 분리하고 통신·메모리·tail latency를 함께 측정한다.

## 읽기 / 검증 / 추적

원문 링크의 제목과 결과를 확인한 뒤 활용한다. 격리 환경에서 기준값·실패 기준을 정의하고 PoC를 수행하며 공식 릴리스를 추적한다. 프로젝트 적용 내용은 실증된 기능이 아닌 제안이다.

- [Kueue releases](https://github.com/kubernetes-sigs/kueue/releases)
- [MLflow releases](https://github.com/mlflow/mlflow/releases)
- [MLX releases](https://github.com/ml-explore/mlx/releases)

