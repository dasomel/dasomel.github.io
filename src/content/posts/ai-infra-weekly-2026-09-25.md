---
title: "AI Infrastructure Weekly · 2026 W39 — 분산 AI 실행·복구·KV 캐시"
description: "복구된 주간 연구 브리핑: 분산 AI 실행·복구·KV 캐시."
pubDate: 2026-09-25
updatedDate: 2026-11-24
tags: ["AI Infrastructure", "Kubernetes", "MLOps", "Research"]
featured: false
draft: false
---

> 복구된 AI Infra Research Brief 기록을 2026-11-24에 재편집한 AI 보조 리서치입니다. 원문에 남은 논문 식별자는 검증을 위해 보존하고, 수치와 미검증 릴리스 주장은 제외합니다. 원문 전체를 복구한 것은 아닙니다.

## 기존 브리핑의 연구 목록

- [Crossflow](https://arxiv.org/abs/2609.27085)
- [Dynamo Fast Recovery](https://arxiv.org/abs/2609.25451)
- [KVSET](https://arxiv.org/abs/2609.27746)
- [SARA](https://arxiv.org/abs/2609.26763)
- [EMA](https://arxiv.org/abs/2609.27040)
- [JustFit](https://arxiv.org/abs/2609.17475)

## 아키텍처 및 운영 시사점

분산 실행 시 장애 감지와 복구, 캐시 효율, 자원 배치가 서로 다른 제어 루프라는 관점에서 검토한다. 정상 부하와 노드 장애를 나눠 TTFT, 처리량, 복구 시간, 재시도 중복을 비교한다. MLflow/Kueue 업데이트도 추적한다.

## 읽기 / 검증 / 추적

원문 링크의 제목과 결과를 확인한 뒤 활용한다. 격리 환경에서 기준값·실패 기준을 정의하고 PoC를 수행하며 공식 릴리스를 추적한다. 프로젝트 적용 내용은 실증된 기능이 아닌 제안이다.

- [Kueue releases](https://github.com/kubernetes-sigs/kueue/releases)
- [MLflow releases](https://github.com/mlflow/mlflow/releases)
- [MLX releases](https://github.com/ml-explore/mlx/releases)

