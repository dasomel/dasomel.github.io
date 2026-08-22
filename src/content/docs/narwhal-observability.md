---
title: 모니터링 & 로깅
description: Prometheus, Grafana, Loki, Tempo, Hubble 분산 추적.
project: Narwhal
path: narwhal/observability
order: 1100
lastModified: 2026-08-23
---

# 모니터링 & 로깅

Narwhal은 메트릭, 로그, 분산 추적 및 네트워크 시각화를 통합한 전주기 관측성을 제공합니다.

## 관측성 구성
- **Metrics**: Prometheus Operator + Grafana 대시보드
- **Logs**: Grafana Loki + Alloy 로그 에이전트
- **Traces**: Grafana Tempo (OpenTelemetry 호환 분산 추적)
- **Network Telemetry**: Cilium Hubble (eBPF 기반 실시간 서비스 맵)

## 관련 링크

- [Narwhal 저장소](https://github.com/dasomel/narwhal)
- [Narwhal 포털](/oss/narwhal/)
