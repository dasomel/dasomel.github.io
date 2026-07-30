---
title: "아키텍처"
description: "KubeMetal의 Control/Compute 분리 구조, Tauri v2 백엔드 구성, 포트·VM 사이징·호스트 브리지 설계 결정"
project: "KubeMetal"
order: 501
lastModified: 2026-07-30
---

## 개요

KubeMetal은 Apple Silicon 전용 하이브리드 MLOps 데스크톱 앱입니다. Kubernetes 표준 제어면과 macOS 호스트 네이티브 MLX 연산을 하나의 Tauri v2(Rust) + React/TypeScript 앱으로 통합합니다.

MLflow, SeaweedFS 같은 MLOps 스택은 Colima(`vz` + `virtiofs`) 위에서 구동되는 경량 K3s 클러스터 안에 파드로 배포되어 표준 K8s 매니페스트로 관리됩니다. 반면 MLX 기반 파인튜닝·서빙 같은 실제 연산은 K8s 파드 내부가 아니라 macOS 호스트 프로세스로 직접 실행됩니다.

## Control/Compute 분리 — 선호가 아니라 하드웨어 제약

이 분리는 설계 취향이 아니라 하드 불변식입니다. **Apple Silicon의 Metal GPU는 리눅스 VM으로 패스스루할 수 없습니다.** 따라서 K8s Pod 안에서는 MLX 연산을 수행할 방법 자체가 없습니다.

- **K8s(Control)** — 실험 추적(MLflow), 아티팩트 저장(SeaweedFS), 오케스트레이션(Prefect 3) 같은 표준 MLOps 제어면만 담당합니다.
- **macOS 호스트(Compute)** — GPU를 쓰는 모든 작업은 Rust 백엔드가 스폰하는 호스트 프로세스로 위임됩니다.

이 하이브리드 구조 덕분에 클라우드 GPU 비용 없이 로컬 데스크톱에서 시작해, 향후 원격 GPU 서버나 멀티노드 K3s 클러스터로 확장하는 경로를 열어둘 수 있습니다.

<Mermaid chart={`flowchart TB
  subgraph HOST["macOS 호스트 (Apple Silicon)"]
    APP["KubeMetal.app<br/>Tauri v2 (Rust) + React"]
    MLX["MLX 호스트 프로세스<br/>mlx-lm / mlx-vlm"]
    METAL["Metal GPU<br/>(VM 패스스루 불가)"]
  end

  subgraph VM["Colima VM (vz + virtiofs)"]
    subgraph K3S["K3s 클러스터"]
      MLF["MLflow<br/>실험 추적 / 모델 레지스트리"]
      SWF["SeaweedFS<br/>S3 아티팩트 저장소"]
      PFT["Prefect 3<br/>오케스트레이션"]
      BR["mac-gpu-service<br/>ExternalName"]
    end
  end

  APP -->|"lifecycle / kubectl"| K3S
  APP -->|"spawn"| MLX
  MLX --> METAL
  MLX -->|"실험 로그 / 모델 등록"| MLF
  MLF -->|"아티팩트"| SWF
  BR -->|"host.lima.internal"| MLX

  style APP fill:#eff6ff,stroke:#2563eb,stroke-width:2px,color:#111
  style MLX fill:#eff6ff,stroke:#2563eb,color:#111
  style METAL fill:#f9fafb,stroke:#d1d5db,color:#111
  style MLF fill:#f0fdf4,stroke:#059669,color:#111
  style SWF fill:#f0fdf4,stroke:#059669,color:#111
  style PFT fill:#f0fdf4,stroke:#059669,color:#111
  style BR fill:#fffbeb,stroke:#d97706,color:#111
  style HOST fill:#fff,stroke:#9ca3af,color:#111
  style VM fill:#fafafa,stroke:#d1d5db,color:#374151
  style K3S fill:#fff,stroke:#9ca3af,color:#374151
`} />

## 앱 구성

### 백엔드 (Rust / Tauri v2)

기능 도메인별 IPC 커맨드 모듈로 나뉩니다.

| 모듈 | 역할 |
|------|------|
| `colima` | Colima(vz) VM 및 K8s 클러스터 라이프사이클 제어 |
| `provision` | MLflow / SeaweedFS / Prefect / 브리지 매니페스트 적용 |
| `deploy_target` | 배포 대상 컨텍스트 해석 — 클러스터를 상수가 아닌 설정으로 취급 |
| `metrics` | RAM/CPU/GPU·발열 상태 수집 |
| `mlx` | 호스트 MLX venv 설치, LoRA 파인튜닝, 모델 서빙 |
| `modelhub` | Hugging Face 검색 → 다운로드 → S3 업로드 → MLflow 등록 |
| `data_ingest`, `rag` | 데이터 수집 DAG, 청킹, LanceDB RAG |
| `prefect` | 파이프라인 오케스트레이션 |
| `port_forward`, `access` | 포트포워딩 및 서비스 원클릭 접근 |
| `guardrails` | 메모리 압박 / 발열 / 배터리 / 슬립 방지 가드 |

`services/process.rs`가 외부 CLI 스폰을 단일 경로로 감당합니다. `.app` 번들은 셸 PATH를 상속하지 않으므로, 모든 외부 CLI는 경로 해석기를 거쳐 실행되고 자식 프로세스에 넘길 PATH도 여기서 구성됩니다.

### 프론트엔드 (React 19 / TypeScript)

`dashboard`, `kagent`, `pipeline`, `modelhub`, `mlx`, `data`, `access`, `airgap` 등 탭 단위 컴포넌트 트리로 구성됩니다. UI 토큰은 `DESIGN.md` 프론트매터를 단일 소스로 삼아 Tailwind 설정에 1:1 매핑됩니다.

## 주요 설계 결정

### 포트 배치

| 서비스 | 포트 | 비고 |
|--------|------|------|
| MLflow | 5001 | macOS AirPlay가 5000을 점유 |
| SeaweedFS S3 API | 8333 | |
| SeaweedFS Filer UI | 8888 | |
| Prefect | 4200 | |
| 모델 서빙 | 8080 | |
| kagent UI | 8090 | 8080은 서빙이 소유 |

모든 로컬 URL은 `localhost`가 아닌 `127.0.0.1`을 사용합니다.

### VM 사이징은 감지된 RAM에서 파생

하드코딩하지 않고 호스트 RAM에서 프로파일을 산정하며, 백엔드가 프론트엔드 입력을 클램프합니다.

| 호스트 RAM | VM 할당 |
|-----------|---------|
| 16GB | 4GB / 2 CPU |
| 32–48GB | 8GB / 4 CPU |
| 64GB+ | 12GB / 6 CPU |

### Pod → 호스트 브리지

파드가 호스트 MLX 서비스에 도달하는 경로는 `ports` 필드 없는 ExternalName 서비스(`mac-gpu-service` → `host.lima.internal`)입니다. Colima 환경에서 CoreDNS가 `192.168.5.2`로 해석하는 것을 온디바이스로 검증했으며, `host.docker.internal`은 쓰지 않습니다.

주의할 함정 하나 — **ExternalName은 DNS 이름만 받습니다.** IP를 넣은 CNAME은 NXDOMAIN이 되고, 시도해도 아무것도 시끄럽게 실패하지 않습니다. IP를 대상으로 삼아야 하면 셀렉터 없는 Service + EndpointSlice를 써야 하고, 렌더 스크립트가 이를 자동으로 전환합니다.

### 메트릭 — sudo 없이 수집

`sysinfo` 기반 RAM/CPU에 `ioreg -c IOAccelerator`를 통한 sudo-free GPU 지표, `NSProcessInfo.thermalState` 기반 발열 상태를 더합니다. `powermetrics`와 sudo/root 경로는 권한 헬퍼 없이는 금지입니다.

발열에는 **CLI 소스가 없습니다** — `pmset -g therm`, `sysctl`, `ioreg AppleSMC`가 이 하드웨어에서 모두 빈 값으로 측정됐습니다. 발열 기반 학습 일시정지는 옵트인이며 `serious`에서만 발동합니다(`fair`는 부하 시 정상 상태). 수동 재개는 그 일시정지 원인을 남은 실행 동안 무효화하지만, 메모리 압박 `critical`은 단독으로는 무효화할 수 없습니다.

### MLX 런타임 2종

텍스트용 `mlx-lm`과 비전용 `mlx-vlm`이 하나의 venv를 공유하며 기본값은 `mlx-lm`입니다. 두 서버 모두 `--host 127.0.0.1`을 명시적으로 지정합니다 — `mlx_vlm.server`의 기본값이 `0.0.0.0`이기 때문입니다.

비전 파인튜닝에는 함정이 몇 개 있습니다. `mlx_vlm.lora`에서 `--adapter-path`는 출력이 아니라 *재개*를 뜻하고, 출력은 `--output-path`입니다. `--train-vision`은 비양자화(bf16) 모델을 요구합니다 — 4-bit 모델은 `QuantizedMatmul::vjp`에서 죽습니다.

## 상태를 꾸며내지 않는다

이 프로젝트의 관측 가능성 원칙은 단순합니다. **프로브가 실패하면 실패를 그대로 드러냅니다.** 하드코딩된 디바이스 스펙, 만들어낸 kubeconfig 컨텍스트, 준비된 로그 라인, 가정된 파드 준비 상태, 검증하지 않은 성공을 출력하는 스크립트는 모두 결함으로 취급합니다. 초록색 게이트는 코드가 컴파일된다는 뜻이지 기능이 동작한다는 뜻이 아닙니다.

관련 문서: [사용법](/ko/docs/kubemetal-usage) · [외부 클러스터 연동](/ko/docs/kubemetal-integration)
