---
title: 모니터링 & 로깅
description: Prometheus, Grafana, Loki, Tempo, Alloy 및 Hubble eBPF 관측성.
project: Narwhal
path: narwhal/observability
order: 1105
lastModified: 2026-08-23
---

# 모니터링 & 로깅

Narwhal은 메트릭, 로그, 분산 추적 및 네트워크 흐름을 단일 화면에서 교차 분석할 수 있는 풀스택 관측성을 제공합니다.

## 관측성 데이터 파이프라인

```text
[ Kubernetes Pods & Nodes ]
      │
      ├─ Metrics (Prometheus Exporters) ──► Prometheus ──► Grafana
      ├─ Logs (Alloy Agent) ──────────────► Loki ────────► Grafana
      ├─ Traces (OpenTelemetry SDK) ─────► Tempo ───────► Grafana
      └─ Network Flows (eBPF BPF Maps) ──► Hubble UI
```

## 4대 관측성 축

1. **Metrics (Prometheus Operator)**: 노드 CPU/메모리, XFS 스토리지 용량, APISIX 요청 수집 및 임계치 알림
2. **Logs (Grafana Loki + Alloy)**: 레이블 기반 경량 로그 인덱싱 및 멀티 테넌트 로그 쿼리
3. **Traces (Grafana Tempo)**: 마이크로서비스 간 HTTP/gRPC 호출 지연시간 추적 (Trace ID 기반 로그-트레이스 연계)
4. **Network Telemetry (Cilium Hubble)**: DNS 실패, 패킷 드롭, 서비스 간 통신 흐름을 eBPF로 실시간 시각화
