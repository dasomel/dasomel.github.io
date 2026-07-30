---
title: "사용법"
description: "KubeMetal 설치와 구동, 8개 탭의 역할, 모델 다운로드부터 파인튜닝·서빙까지의 워크플로와 실측 성능"
project: "KubeMetal"
order: 502
lastModified: 2026-07-30
---

## 요구 사항

- macOS 14+ (Apple Silicon)
- Homebrew
- colima, kubectl — `brew install colima kubectl`
- Node 22+ / pnpm
- Rust (rustup)

Apple Silicon 전용입니다. Intel Mac에서는 MLX 연산 경로가 존재하지 않습니다.

## 앱 구성 — 8개 탭

| 탭 | 역할 |
|----|------|
| **대시보드** | RAM/CPU 실시간 모니터링, Colima(vz) K8s 클러스터 원클릭 시작/정지, MLOps 스택 프로비저닝, 포트포워딩 제어 |
| **kagent 운영** | 클러스터 AIOps — 컨텍스트별 kagent 진단 조회, AI 에이전트(security / promql / observability) 켜고 끄기, kagent UI(8090) 연결 |
| **파이프라인** | 클러스터 구동 → 프로비저닝 → 모델 다운로드 → 파인튜닝 → MLflow 등록 → 서빙까지 단계별 상태를 카드로 시각화 |
| **모델 허브** | Hugging Face 모델 검색 → 호스트 다운로드 → SeaweedFS S3 업로드 → MLflow Model Registry 등록까지 원클릭 흐름, 등록 모델 목록 조회 |
| **MLX 스튜디오** | 호스트 MLX venv 환경 설치, 로컬 모델 기반 LoRA 파인튜닝 실행(진행률/손실 실시간 표시), `mlx_lm.server` 모델 서빙 시작/정지 |
| **데이터** | 데이터 수집 DAG 파이프라인(웹/파일/HF → 청킹 → LanceDB RAG → SeaweedFS S3 백업), DVC 데이터셋 버전 관리 |
| **접근 콘솔** | MLflow / SeaweedFS Filer 등 프로비저닝된 서비스로 크리덴셜 없이 원클릭 접근, 헬스 상태 조회 |
| **Air-Gap 관리** | 폐쇄망용 오프라인 번들(이미지·차트·바이너리) 다운로드와 오프라인 설치, 자산 버전 확인 |

## 구동 방법

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 개발 모드 실행

`beforeDevCommand`로 vite 개발 서버가 자동 기동됩니다.

```bash
pnpm tauri dev
```

### 3. 클러스터 시작

**대시보드** 탭의 **클러스터 시작** 버튼을 누르면, 감지된 호스트 RAM 기반으로 자동 산정된 CPU/메모리 값으로 다음 명령이 내부적으로 실행됩니다.

```bash
colima start --cpu <N> --memory <M> --vm-type=vz --mount-type=virtiofs --kubernetes
```

colima는 재진입 가능하지 않습니다 — 라이프사이클 작업은 한 번에 하나만 수행하고, 산정된 프로파일 이상으로 올리지 않습니다.

### 4. MLOps 스택 프로비저닝

**MLOps 스택 프로비저닝** 버튼을 누르면 MLflow / SeaweedFS(+크리덴셜 Secret) / mac-gpu-bridge 매니페스트가 클러스터에 적용됩니다.

### 5. 포트포워딩

**포트포워딩 시작** 버튼을 누르면 아래 주소로 접속할 수 있습니다.

- MLflow: `http://127.0.0.1:5001`
- SeaweedFS S3 API: `http://127.0.0.1:8333`
- SeaweedFS Filer UI: `http://127.0.0.1:8888`

포트포워드는 부모 프로세스와 함께 죽습니다. 접근이 갑자기 끊기면 먼저 포워드를 소유한 프로세스가 살아 있는지 확인합니다.

### 6. 모델 다운로드 → 파인튜닝 → 서빙

**모델 허브** 탭에서 모델을 다운로드하고, **MLX 스튜디오** 탭에서 파인튜닝/서빙을 실행합니다. 전체 흐름은 **파이프라인** 탭에서, 서비스 접근은 **접근 콘솔** 탭에서 각각 확인합니다.

<Mermaid chart={`flowchart LR
  HF["Hugging Face<br/>모델 검색"] --> DL["호스트 다운로드"]
  DL --> UP["SeaweedFS S3<br/>업로드"]
  UP --> REG["MLflow<br/>Model Registry 등록"]
  REG --> FT["MLX LoRA<br/>파인튜닝 (호스트)"]
  FT --> LOG["MLflow<br/>실험 로그 / 어댑터"]
  LOG --> SRV["mlx_lm.server<br/>서빙 :8080"]

  style HF fill:#f9fafb,stroke:#d1d5db,color:#111
  style DL fill:#eff6ff,stroke:#2563eb,color:#111
  style UP fill:#f0fdf4,stroke:#059669,color:#111
  style REG fill:#f0fdf4,stroke:#059669,color:#111
  style FT fill:#eff6ff,stroke:#2563eb,stroke-width:2px,color:#111
  style LOG fill:#f0fdf4,stroke:#059669,color:#111
  style SRV fill:#eff6ff,stroke:#2563eb,color:#111
`} />

## 실측 성능 (참고)

Apple M4 Pro / 64GB, 패키징 앱 경유, 2026-07-27~28 측정값입니다. 모델·프롬프트·하드웨어에 따라 달라집니다.

| 항목 | 실측값 | 조건 |
|------|--------|------|
| VLM 서빙 처리량 | 196–198 tok/s (서버 보고값) | Qwen2-VL-2B-Instruct-4bit, mlx-vlm 0.6.7, 이미지 포함 OCR 요청 |
| VLM 서빙 TTFT | 442–767 ms | 위와 동일 |
| LoRA 파인튜닝 (비전 스택 포함) | 학습 파라미터 674.5M (30.5%), 피크 메모리 8.7GB | Qwen2-VL-2B bf16, `--train-vision` |
| K8s VM 오버헤드 | 호스트 RAM 기반 자동 산정 (64GB 호스트 → VM 12GB/6CPU) | 연산은 VM 밖 호스트에서 실행 |

## 명령줄 게이트

`make help`가 엔트리포인트이며, 레시피가 정본입니다. 이름으로 알아둘 게이트는 둘입니다.

```bash
make verify          # 테스트 + clippy + tsc + 디자인 린트 + 웹 빌드
make verify-airgap   # 오프라인 기동 프로브
```

## 빌드 / 패키징

```bash
pnpm tauri build   # .app / .dmg 번들 생성 (서명 없음 로컬 빌드)
```

산출물:

- `src-tauri/target/release/bundle/macos/KubeMetal.app`
- `src-tauri/target/release/bundle/dmg/KubeMetal_0.1.0_aarch64.dmg`

키체인에 유효한 codesigning 아이덴티티가 있으면 `make app`이 자동으로 그것으로 서명합니다. LAN 클러스터에 접근하는 패키징 앱에는 안정된 코드 서명이 필요합니다 — 자세한 이유는 [외부 클러스터 연동](/ko/docs/kubemetal-integration) 문서를 참고하세요.

## 트러블슈팅

앱이 보여주는 상태를 의심할 때는 CLI로 직접 확인합니다.

```bash
colima status --json
kubectl --context colima get pods -n default

# 외부 클러스터
kubectl --context <컨텍스트> get pods -n kubemetal
```

관련 문서: [아키텍처](/ko/docs/kubemetal-architecture) · [외부 클러스터 연동](/ko/docs/kubemetal-integration)
