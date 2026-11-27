---
title: "AI Infrastructure Weekly · 2026 W48 — KV 데이터플레인, GPU 메모리, 에이전트 격리"
description: "TripleKV와 HiPerfCC, vLLM 0.34, Kueue 0.20.8, Agent Sandbox, MLflow SSRF, MLX 업데이트를 운영 관점에서 분석한다."
pubDate: 2026-11-27
tags: ["AI Infrastructure", "Kubernetes", "MLOps", "Research"]
featured: false
draft: false
---

> AI-assisted research briefing. 조사 범위는 2026-11-14–27(KST)이다. 수치는 논문·프로젝트 릴리스가 보고한 결과이며 독립 재현값이 아니다. 2026-11-13 공개된 MLflow 보안 권고는 같은 날짜의 회고 스캔에서 확인해 별도 표시했다. 제안한 PoC와 프로젝트 적용은 실제 구현 상태와 구분한다.

## 이번 주 요약

- Agent serving의 KV cache는 GPU 내부 LRU 문제가 아니라 tool 실행시간을 이용해 SSD→DRAM 복구를 숨기는 데이터플레인 문제로 이동하고 있다.
- vLLM 0.34는 warmup 후 실제 남은 GPU 메모리로 KV 용량을 산정하고 복구 경로를 강화했지만, 기본값 변경은 GPU 공유 환경에서 회귀 위험을 만든다.
- Kueue 0.20.8은 DRA·MultiKueue quota와 workload lifecycle 오류를 누적 수정했다. 0.21.0-rc.2는 consumable-capacity quota를 Beta로 올렸다.
- Agent Sandbox는 warm pool·suspend/resume·sandbox-scoped token을 보강했다. MLflow artifact URI SSRF는 3.18.0 이상을 요구하는 보안 조치다.
- MLX 0.32.5와 mlx-swift-lm 3.33.0은 Metal kernel 및 Swift 추론 API를 확장했지만, M4 Max 성능 향상은 별도 측정이 필요하다.

## 1. Agentic inference의 KV cache를 tool-aware 3계층으로 관리

**주요 출처:** 2026-11-18 [TripleKV](https://arxiv.org/abs/2611.25112), 2026-11-21 [HiPerfCC-KVCache](https://arxiv.org/abs/2611.28702)

### TripleKV — SSD 읽기를 tool 실행 구간 안으로 이동

TripleKV는 GPU HBM(L1)·host DRAM(L2)·SSD(L3)를 하나의 KV 계층으로 다룬다. Agent harness가 tool 호출별 완료 시점을 예측하고 필요한 KV block을 SSD에서 DRAM으로 비동기 prefetch한다. DRAM은 GPU-resident block의 중복 사본을 유지하지 않는 non-inclusive tier로 바뀌며, prefetch된 block은 재사용 시점까지 보호한다. GPU로의 마지막 전송은 request admission 이후 기존 vLLM 경로를 사용한다.

논문은 Qwen3-30B-A3B를 H100 NVL 한 장에서 실행했다. 모델 weight 이후 KV용 HBM은 32 GiB, DRAM은 64 GiB, SSD는 1 TiB RAID였고, 12–20개 agent thread와 네 종류의 benchmark trace를 재생했다. 저자들은 critical-path SSD read가 요청의 45–76%에서 10% 미만으로 줄고, vLLM DRAM·SSD baseline 대비 p95 TTFT가 최대 49% 개선됐다고 보고한다.

**운영 의미:** agent harness는 다음 turn이 재사용할 prefix를 알고 있으므로 예측 대상은 block identity보다 tool 완료 시점이다. harness가 tool latency metadata를 내보내고 KV manager가 prefetch·eviction을 수행하는 분리가 적절하다. prefix hit ratio 외에 critical-path SSD-read fraction, tool-latency prediction error, DRAM pressure, prefetch bytes, recomputed tokens를 관찰해야 한다.

**증거와 한계:** arXiv preprint다. 단일 H100 NVL·단일 MoE 모델·trace replay이며 baseline은 2026년 6월의 vLLM 0.24를 확장한 구현이다. vLLM 0.34에서 같은 결과가 나온다고 볼 수 없고, 독립 공개 구현도 확인하지 못했다.

### HiPerfCC-KVCache — Confidential Computing의 보호 전송 병목 완화

HiPerfCC는 GPU confidential computing에서 보호된 KV 복사가 driver lock을 오래 점유해 독립 serving 작업까지 멈추는 문제를 분석한다. SGLang 구현은 bounded backup submission, 준비된 token readback 우선 처리, auxiliary context와 공유 GPU staging으로 KV restore 병렬성을 높인다. H200 세 모델·세 workload에서 staged HiCache-Workers baseline 대비 output-token throughput 기하평균 1.74배(최대 2.72배), 평균 TTFT 36%(최대 59%) 감소를 보고했다. RTX PRO 6000 Blackwell에서도 기하평균 1.28배를 보고한다.

**운영 의미:** confidential GPU 환경에서는 대역폭뿐 아니라 driver-lock hold time, 보호 복사 granularity, token-readback queueing, context별 restore latency를 관찰한다. 일반 GPU serving에는 바로 적용할 이유가 적다. 논문은 preprint이며 공개 구현이나 upstream SGLang 릴리스는 확인하지 못했다.

## 2. vLLM 0.34.0 — 동적 KV 용량과 복구 기능, 큰 기본값 변경

**출처:** 2026-11-16 [vLLM v0.34.0](https://github.com/vllm-project/vllm/releases/tag/v0.34.0)

v0.34.0은 Model Runner V1을 제거하고 V2만 남겼다. Extensible KV cache가 기본 활성화되어 CUDA graph capture와 warmup 뒤 실제 남은 메모리로 KV cache 크기를 산정한다. 기본 block size는 16에서 64로 바뀌었고 ROCm 7.2 artifact는 제거되어 ROCm 10.0을 사용해야 한다. CUDA artifact는 13.0 기준이다.

운영상 중요한 변화는 CRIU + cuda-checkpoint 기반 checkpoint/restore, fault-tolerant DP·EP scale-down에서 dead rank 제거 및 expert 재분배, opt-in cache-aware admission ordering이다. serving engine이 cache 상태와 복구 가능한 실행 단위를 직접 관리하는 방향이다.

릴리스 노트는 H200의 특정 모델에서 KV capacity가 433k에서 672k token으로 늘어난 사례를 제시하지만, 일부 모델·동시성 조건에서 TPOT가 6–18% 증가했다고도 적는다. 이는 프로젝트가 보고한 모델별 측정치이지 일반적인 성능 보장이 아니다.

**운영 트레이드오프:** GPU 전체를 Pod 하나가 독점하는 환경과 MPS·time-slicing 공유 환경을 같은 설정으로 운영하면 안 된다. 공유 환경에서는 memory headroom을 명시적으로 제한하고 warmup 이후 실제 KV capacity, OOM, TTFT, TPOT를 함께 검증한다. Model Runner V1 의존 custom logits processor와 block-size 가정도 확인한다.

**성숙도:** 정식 OSS 릴리스다. CUDA·ROCm, GPU 세대, custom kernel, connector, GPU sharing 방식별 canary가 필요하다.

## 3. Kueue 0.20.8 — DRA quota와 MultiKueue lifecycle correctness

**출처:** [v0.20.7 (2026-11-19)](https://github.com/kubernetes-sigs/kueue/releases/tag/v0.20.7), [v0.20.8 (2026-11-26)](https://github.com/kubernetes-sigs/kueue/releases/tag/v0.20.8), [v0.21.0-rc.2 (2026-11-24)](https://github.com/kubernetes-sigs/kueue/releases/tag/v0.21.0-rc.2)

0.20.7은 DeviceClass 누락 또는 scheduling 중 quota charge 변경으로 DRA Workload가 잘못 admit되거나 오래된 charge로 quota를 예약하는 문제를 수정했다. 동일 device capacity의 중복 청구도 거부한다. MultiKueue에서는 worker cluster 제거 후 원격 Workload를 정리하지 않고 재-dispatch해 같은 Job이 두 번 실행될 수 있던 경로와 orphan 처리된 manager Job의 원격 Job이 남는 경로를 수정했다. ConcurrentAdmission pending count 중복과 stale metric도 정리했다.

0.20.8은 controller logging policy 정렬이 중심이다. 여러 controller의 per-object 로그가 verbosity 2에서 3으로 이동하고 structured log key가 바뀌었다. 기존 Loki parser·alert·Grafana 대시보드가 로그 문자열이나 key에 의존한다면 업그레이드 전 수정해야 한다.

**운영 의미:** DRA correctness는 GPU 개수뿐 아니라 DeviceClass·capacity source·quota charge의 정확성에 달려 있다. MultiKueue는 worker 제거·재연결·manager 재시작 시 remote object가 중복 실행되거나 orphan으로 남지 않는지 검증한다. 0.20.8은 안정 patch로 검토할 가치가 있지만 patch chain과 logging migration을 함께 확인한다.

**다음 단계:** 0.21.0-rc.2는 pre-release다. DRA prioritized-list와 consumable-capacity quota가 Beta로 올라가 DeviceClass capacity dimension을 별도 quota resource로 표현할 수 있다. GPU partition·NPU capacity 모델링에 의미가 있지만 stable release와 CRD/feature-gate 호환성 확인 전 production 적용은 보류한다.

## 4. Agent Sandbox와 MLflow — 실행 격리와 artifact fetch 신뢰 경계

### Kubernetes SIG Agent Sandbox v1.0.12

**출처:** 2026-11-20 [Agent Sandbox v1.0.12](https://github.com/kubernetes-sigs/agent-sandbox/releases/tag/v1.0.12), [architecture / README](https://github.com/kubernetes-sigs/agent-sandbox)

Agent Sandbox는 Sandbox CRD/controller와 SandboxClaim, SandboxTemplate, SandboxWarmPool로 단일·상태형 실행 환경을 선언적으로 관리한다. v1.0.12는 Go·Python·TypeScript SDK의 suspend/resume, claim lifecycle option, pool별 readiness grace period, CI runner 예제를 추가했다. sandbox-router에는 namespace/name/UID에 바인딩된 v2 token이 들어갔다.

보안 경계는 분명히 해야 한다. scoped token은 특정 Sandbox identity에 묶이지만 만료 전까지 해당 Sandbox의 모든 port·method·path를 허용한다. path-level least privilege token은 아니다. 모든 router replica를 업그레이드하기 전에 새 token을 발급하면 구버전 replica가 403으로 거부한다.

Suspend는 Pod를 삭제하고 claim과 PVC를 남긴다. Pod snapshot을 별도로 사용하지 않으면 process, memory, emptyDir는 보존되지 않는다. Agent Sandbox 자체가 kernel isolation을 제공하는 것도 아니다. gVisor나 Kata Containers 같은 RuntimeClass가 실제 격리 강도를 결정한다.

**운영 제안:** untrusted agent code에는 per-sandbox identity, 짧은 token TTL, egress 제한, metadata endpoint 차단, read-only artifact mount를 함께 적용한다. warm pool은 시작 지연을 줄이지만 idle sandbox 비용과 namespace quota를 늘린다.

### MLflow SSRF — 3.18.0 미만 tracking server는 조치 대상

**출처:** 2026-11-13 [GHSA-mr9f-g8qf-4w4j / CVE-2026-118628](https://github.com/mlflow/mlflow/security/advisories/GHSA-mr9f-g8qf-4w4j), [MLflow 3.18.0](https://github.com/mlflow/mlflow/releases/tag/v3.18.0)

MLflow tracking server가 client가 제출한 experiment artifact location과 model-version source의 scheme/host를 충분히 검증하지 않아 artifact endpoint를 통해 server가 임의 host/port에 연결하도록 만들 수 있었다. 권고는 High, CVSS 8.2다. 영향 버전은 3.18.0 미만이고 수정 버전은 3.18.0이다. 3.17.0–3.17.2는 일반 host 검증을 추가했지만 wasbs URI 우회가 남아 있다.

**운영 조치:** MLflow 3.18.0 이상으로 올리고 tracking-server 인증을 켜며 egress를 승인된 artifact-storage host로 제한한다. 다른 host-addressed artifact scheme이 실제로 필요한 경우에만 MLFLOW_ALLOWED_HOST_ADDRESSED_ARTIFACT_SCHEMES를 좁게 설정한다. http/https 전체를 기본 허용하지 않는다. Kubernetes NetworkPolicy 또는 egress gateway로 내부 CIDR과 cloud metadata endpoint 접근을 차단한다.

현재 릴리스 목록에서 MLflow 3.18.0이 최신 정식 버전이다. 이번 기간에는 3.19 기능 릴리스보다 이 보안 조치가 우선이다.

## 5. Apple Silicon MLX — Metal kernel과 Swift inference API

**출처:** 2026-11-25 [MLX v0.32.5](https://github.com/ml-explore/mlx/releases/tag/v0.32.5), 2026-11-17 [mlx-swift-lm 3.33.0](https://github.com/ml-explore/mlx-swift-lm/releases/tag/3.33.0)

MLX 0.32.5에는 Metal FP4 dequantization·quantized-matmul 경로, speculative decoding용 SDPA kernel, sliding-window attention, distributed ring pending send/recv list data race 수정이 포함됐다. M1/M2의 head dimension 512 SDPA 수정도 있지만 M4 Max 성능 개선으로 해석하면 안 된다. 릴리스 노트는 M4 Max 통합 성능 수치를 제공하지 않는다.

mlx-swift-lm 3.33.0은 Qwen 3.8 및 MTP drafter, LFM3 계열 모델을 추가하고 reasoning stream을 answer stream과 분리했다. KV cache 조회·복원·eviction API도 확장했다. Swift API에는 source-breaking 변경이 있으므로 Python mlx-lm과 같은 런타임으로 취급하지 않는다.

**운영 의미:** M4 Max에서 0.32.4와 0.32.5를 같은 모델·quantization·prompt·thermal 조건으로 비교한다. prompt processing, decode tokens/s, peak unified memory, cache eviction, 장시간 실행 후 memory growth를 측정한다. Swift 앱은 mlx-swift 0.33.0과 mlx-swift-lm 3.33.0을 별도 조합으로 검증한다.

## 공개 OSS 적용 가능성

아래는 현재 저장소 README에 명시된 기능과 이번 연구에서 도출한 제안을 구분한다.

- **Narwhal:** 현재 README에는 Kueue나 Agent Sandbox 통합이 명시돼 있지 않다. GPU workload admission이 범위에 들어오면 Kueue 0.20.8을 선택적 add-on으로 평가할 수 있다. Agent Sandbox를 도입한다면 Cilium egress policy와 Kyverno policy로 RuntimeClass, privileged Pod, hostPath, metadata 접근을 제한하는 구성이 후보지만 아직 제안이다.
- **KubeMetal:** 현재 검증 경로는 K3s 안의 MLflow·SeaweedFS와 macOS host process로 실행되는 MLX를 분리한다. MLX 0.32.5는 host-mlx 경로의 버전 고정·회귀 시험 대상으로 적합하다. MLflow는 CVE 수정 버전 3.18.0 이상인지 우선 확인한다. Kueue/DRA는 로컬 Mac GPU가 Kubernetes device로 실제 발견·할당·격리·계정화되기 전에는 기본 경로에 넣지 않는다.
- **Beluga:** 현재는 Kafka/CDC·Flink·Iceberg·Trino·Airflow 중심이며 AI agent runtime 통합은 확인되지 않는다. 향후 untrusted agent가 data task를 실행한다면 per-job Sandbox, 제한된 object-store credential, Cilium egress policy, OPA/OpenFGA 권한을 결합하는 방향을 검토할 수 있다. 현재 기능으로 표현하지 않는다.

## 이번 범위에서 반복하지 않은 항목

- **분산 학습:** 2026-11-14 이후 새로 검증할 만한 주요 training/checkpoint 시스템 릴리스나 논문은 확인하지 못했다. Kubeflow Trainer 2.4.0은 11월 6일 릴리스로 이번 cutoff 이전이므로 신규 항목으로 계산하지 않았다.
- **MLflow:** 3.18.0 이후 새 정식 릴리스는 확인되지 않았다. 기능 반복 소개보다 CVE 조치가 우선이다.
- **SGLang:** 공식 release page의 최신 stable은 0.5.23이다. 0.5.24 stable은 확인되지 않아 nightly를 릴리스처럼 다루지 않았다.
- **국내 생태계:** 이번 cutoff 이후 위 아키텍처 판단을 바꿀 수준의 국내 Kubernetes/AI infra OSS 1차 출처 업데이트는 확인하지 못했다. 근거가 부족한 국내 소식은 추가하지 않았다.

## 우선순위

### Read now

1. [TripleKV](https://arxiv.org/abs/2611.25112) — agent tool latency와 SSD→DRAM prefetch
2. [vLLM 0.34.0](https://github.com/vllm-project/vllm/releases/tag/v0.34.0) — KV memory sizing과 breaking defaults
3. [Kueue 0.20.8](https://github.com/kubernetes-sigs/kueue/releases/tag/v0.20.8) — DRA/MultiKueue correctness와 log migration
4. [MLflow GHSA](https://github.com/mlflow/mlflow/security/advisories/GHSA-mr9f-g8qf-4w4j) — 3.18.0 미만 tracking server 보안 조치

### Test / prototype

- **Kueue 0.20.8 staging:** DeviceClass 누락·중복 capacity source·quota 재계산·worker 제거 시나리오를 재생한다. 성공 기준은 실제 Pod/Workload 수와 quota·metric이 일치하고 중복 원격 Job이 0인 것. 중복 실행, stale reservation, 음수/유실 gauge가 하나라도 나오면 실패다.
- **vLLM 0.34 canary:** 0.33 대비 warmup 후 KV capacity, p95 TTFT/TPOT, GPU OOM, concurrent process 간섭을 측정한다. 모델별 SLO를 넘거나 shared-GPU OOM이 발생하면 기본값 변경을 롤백한다.
- **Agent Sandbox 1.0.12:** gVisor 또는 Kata RuntimeClass에서 claim-to-ready p95, token 만료, 다른 sandbox/namespace 접근, metadata egress 차단을 시험한다. cross-sandbox 접근이나 metadata endpoint 도달이 한 번이라도 성공하면 실패다. suspend 뒤 process와 emptyDir가 사라지는 동작도 검증한다.
- **MLX 0.32.5:** 동일한 M4 Max에서 0.32.4/0.32.5의 prompt/decode throughput, peak unified memory, 30분 반복 실행 후 memory growth를 비교한다. 출력 정확성 회귀, 반복 OOM, 지속적인 memory 증가가 있으면 채택하지 않는다.
- **TripleKV 아이디어:** 전체 구현 대신 agent tool trace에서 tool별 완료시간 예측 오차와 prefetch coverage를 먼저 측정한다. prefetch가 foreground I/O를 방해하거나 DRAM pressure를 높이면 확장하지 않는다.

### Watch

- Kueue 0.21 stable 전환과 consumable-capacity DRA quota의 실제 GPU/NPU 운영 사례
- TripleKV 공개 구현 및 vLLM 0.34 기준 재현 결과
- HiPerfCC 코드 공개와 SGLang upstream 통합
- Agent Sandbox runtime snapshot/suspend semantics와 multi-tenant token 정책
- SGLang 0.5.24 stable, MLflow 3.19, 후속 MLX release

