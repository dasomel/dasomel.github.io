---
title: "KubeMetal"
description: "Apple Silicon 전용 하이브리드 MLOps 데스크톱 앱 — K8s 제어면(Colima/K3s)과 macOS 호스트 MLX 연산을 하나로"
github: "https://github.com/dasomel/kubemetal"
tags: ["MLOps", "Apple Silicon", "MLX", "Kubernetes", "K3s", "Tauri", "Rust", "React"]
order: 8
type: "own"
featured: true
problem: "Apple Silicon의 Metal GPU는 리눅스 VM으로 패스스루할 수 없어, K8s 파드 안에서 MLX 연산을 수행할 방법이 없다"
solution: "제어(MLflow·SeaweedFS)는 K3s 파드에 두고 GPU 연산은 macOS 호스트 프로세스로 분리해, 클라우드 GPU 없이 로컬에서 MLOps 전 과정을 돌린다"
---

## 프로젝트 소개

KubeMetal은 **Apple Silicon 전용 하이브리드 MLOps 데스크톱 앱**입니다. Kubernetes 표준 제어면과 macOS 호스트 네이티브 MLX 연산을 하나의 Tauri v2(Rust) + React/TypeScript 앱으로 통합합니다.

MLflow, SeaweedFS 같은 MLOps 스택은 Colima(`vz` + `virtiofs`) 위에서 구동되는 경량 K3s 클러스터 안에 파드로 배포되어 표준 K8s 매니페스트로 관리됩니다. 반면 MLX 기반 파인튜닝·서빙 같은 실제 연산은 K8s 파드 내부가 아니라 macOS 호스트 프로세스로 직접 실행됩니다.

## Control/Compute 분리 — 선호가 아니라 하드웨어 제약

이 분리는 설계 취향이 아니라 하드 불변식입니다. Apple Silicon의 Metal GPU는 리눅스 VM으로 패스스루할 수 없기 때문에, K8s Pod 안에서는 MLX 연산을 수행할 방법 자체가 없습니다.

- **K8s(Control)** — 실험 추적(MLflow), 아티팩트 저장(SeaweedFS), 오케스트레이션(Prefect 3)만 담당
- **macOS 호스트(Compute)** — GPU를 쓰는 모든 작업은 Rust 백엔드가 스폰하는 호스트 프로세스로 위임

덕분에 클라우드 GPU 비용 없이 로컬 데스크톱에서 시작해, 향후 원격 GPU 서버나 멀티노드 K3s 클러스터로 확장하는 경로를 열어둘 수 있습니다.

## 앱 구성 — 8개 탭

| 탭 | 역할 |
|----|------|
| **대시보드** | RAM/CPU 실시간 모니터링, Colima(vz) K8s 클러스터 원클릭 시작/정지, MLOps 스택 프로비저닝, 포트포워딩 제어 |
| **kagent 운영** | 클러스터 AIOps — 컨텍스트별 kagent 진단 조회, AI 에이전트(security / promql / observability) 토글, kagent UI 연결 |
| **파이프라인** | 클러스터 구동 → 프로비저닝 → 모델 다운로드 → 파인튜닝 → MLflow 등록 → 서빙까지 단계별 상태 시각화 |
| **모델 허브** | Hugging Face 검색 → 호스트 다운로드 → SeaweedFS S3 업로드 → MLflow Model Registry 등록까지 원클릭 |
| **MLX 스튜디오** | 호스트 MLX venv 설치, 로컬 모델 LoRA 파인튜닝(진행률·손실 실시간), `mlx_lm.server` 서빙 시작/정지 |
| **데이터** | 데이터 수집 DAG(웹/파일/HF → 청킹 → LanceDB RAG → SeaweedFS S3 백업), DVC 데이터셋 버전 관리 |
| **접근 콘솔** | 프로비저닝된 서비스로 크리덴셜 없이 원클릭 접근, 헬스 상태 조회 |
| **Air-Gap 관리** | 폐쇄망용 오프라인 번들(이미지·차트·바이너리) 다운로드와 오프라인 설치, 자산 버전 확인 |

## 주요 설계 결정

- **포트 배치** — MLflow 5001(AirPlay가 5000 점유), SeaweedFS S3 8333, Filer UI 8888, Prefect 4200, 모델 서빙 8080, kagent UI 8090. 모든 로컬 URL은 `127.0.0.1`을 사용합니다.
- **VM 사이징 자동 산정** — 하드코딩 대신 감지된 호스트 RAM에서 프로파일을 계산합니다(16GB → 4GB/2CPU, 32–48GB → 8GB/4CPU, 64GB+ → 12GB/6CPU).
- **Pod → 호스트 브리지** — `ports` 필드 없는 ExternalName 서비스(`mac-gpu-service` → `host.lima.internal`). CoreDNS 해석을 온디바이스로 검증했습니다.
- **sudo 없는 메트릭** — `sysinfo` 기반 RAM/CPU에 `ioreg -c IOAccelerator` GPU 지표와 `NSProcessInfo.thermalState` 발열 상태를 더합니다. `powermetrics`와 sudo 경로는 쓰지 않습니다.
- **MLX 런타임 2종** — 텍스트용 `mlx-lm`과 비전용 `mlx-vlm`이 하나의 venv를 공유하며 기본값은 `mlx-lm`입니다.

## 외부 클러스터 연동

이미 운영 중인 클러스터는 기본적으로 **에이전트 온리**로 연결합니다. MLOps 스택은 앱 자신의 k3s에 두고, 외부 클러스터에는 kagent 에이전트만 설치해 관찰·진단 대상으로 삼습니다. 클러스터 안의 어떤 것도 Mac의 로컬 스택에 의존하지 않습니다.

MLOps 스택 전체를 기존 클러스터에 올리는 풀스택 배포는 옵트인 경로이며, 사전점검 → 렌더링 확인 → 적용 순서로 진행됩니다. 검증되지 않은 브리지 주소는 추측을 배포하는 대신 렌더를 거부합니다. 두 경로 모두 실제 운영 중인 6노드 K3s HA 클러스터([Narwhal](/ko/projects/narwhal))에서 Kyverno Enforce 정책·사설 미러 레지스트리·ArgoCD GitOps 환경을 통과해 실측 검증됐습니다.

## 실측 성능 (참고)

Apple M4 Pro / 64GB, 패키징 앱 경유 측정값입니다. 모델·프롬프트·하드웨어에 따라 달라집니다.

| 항목 | 실측값 | 조건 |
|------|--------|------|
| VLM 서빙 처리량 | 196–198 tok/s | Qwen2-VL-2B-Instruct-4bit, mlx-vlm 0.6.7 |
| VLM 서빙 TTFT | 442–767 ms | 위와 동일 |
| LoRA 파인튜닝 | 학습 파라미터 674.5M(30.5%), 피크 메모리 8.7GB | Qwen2-VL-2B bf16, `--train-vision` |

## 기술 스택

TypeScript · Rust(Tauri v2) · Python · Colima/K3s · MLflow · SeaweedFS · Prefect 3 · MLX

자세한 내용은 [아키텍처](/ko/docs/kubemetal-architecture) · [사용법](/ko/docs/kubemetal-usage) · [외부 클러스터 연동](/ko/docs/kubemetal-integration) 문서를 참고하세요.
