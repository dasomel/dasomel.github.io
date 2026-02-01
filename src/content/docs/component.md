---
title: "구성요소"
description: "K-PaaS Lite 구성요소"
order: 4
lastModified: 2026-02-02
---

## K-PaaS Lite 구성요소

![구성요소](/images/kpaas/component.png)

![구성요소 색상](/images/kpaas/component_color.png)

K-PaaS Lite 제외 컴포넌트

## 컴포넌트

### Core 기능

| Component | 용도 | 비고 |
|-----------|------|------|
| Kubernetes | 컨테이너 플랫폼 | v1.33.5 |
| Portal | 플랫폼 관리화면 | |
| Harbor | Container Image 저장 | Portal 사용 |
| Keycloak | SSO 로그인 | Bitnami Helm chart |
| OpenBao | 플랫폼 메트릭 수집 시 활용 (Metrics-API) | Portal 사용 |
| ChartMuseum | Helm Chart 저장소 | |
| Chaos Mesh | Chaos Engineering | Portal 사용 |
| Kyverno | Kubernetes Policy Engine | |

### 제외 컴포넌트

| Component | 용도 | 비고 |
|-----------|------|------|
| ceph | NFS로 대체 가능 | 많은 자원 소모 |
| Pipeline | CI/CD용 | 필수 기능 아님 |
| Source Control | 소스 관리 | 필수 기능 아님 |
| Kubeflow | AI 기능 | 필수 기능 아님 |
