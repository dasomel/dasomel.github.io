---
title: GitOps 워크플로
description: Argo CD + Gitea App-of-Apps 선언적 배포 및 Sync Waves 의존성 관리.
project: Narwhal
path: narwhal/gitops
order: 1102
lastModified: 2026-08-23
---

# GitOps 워크플로

Narwhal의 모든 인프라와 35개 플랫폼 애플리케이션은 **Argo CD**와 자체 호스팅 **Gitea** 저장소를 기반으로 선언적 GitOps로 관리됩니다.

## App-of-Apps 아키텍처

루트 애플리케이션(`root-app`) 하나가 `gitops/applications/` 디렉토리의 모든 자식 애플리케이션 매니페스트를 재귀적으로 추적하고 동기화합니다.

```text
                      [ root-application ]
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼ (Wave 1: Core)        ▼ (Wave 2: Infra)       ▼ (Wave 3: Apps)
  - cilium                - keycloak              - narwhal-portal
  - kube-vip              - apisix                - demo-apps
  - cert-manager          - prometheus-stack      - user-workloads
  - nfs-csi-driver        - seaweedfs             - chaos-mesh
```

## Sync Waves 단계별 의존성 제어

컴포넌트 간의 부트스트랩 의존성을 해결하기 위해 `argocd.argoproj.io/sync-wave` 어노테이션을 활용합니다.

- **Wave -1**: Custom Resource Definitions (CRDs) 및 네임스페이스 생성
- **Wave 0**: CNI (Cilium), 인증서 관리자 (cert-manager), 스토리지 드라이버 (NFS CSI)
- **Wave 1**: IAM (Keycloak), 시크릿 볼트 (OpenBao), API Gateway (APISIX)
- **Wave 2**: 관측성 스택 (Prometheus, Loki, Tempo, Alloy) 및 데이터베이스 (CloudNativePG)
- **Wave 3**: 관리 포털 (Narwhal Portal), 사용자 애플리케이션 및 카오스 엔지니어링 도구

## GitOps 동기화 검증 명령어

```bash
# 전체 애플리케이션 상태 조회
kubectl get applications -n argocd

# 특정 애플리케이션 동기화 트리거
argocd app sync keycloak --prune

# GitOps 드리프트(Drift) 검사
argocd app diff keycloak
```
