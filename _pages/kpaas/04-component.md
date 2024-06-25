---
#layout: home
title: "구성요소"
permalink: /kpaas/component/
author_profile: false
sidebar:
  nav: kpaas
last_modified_at: 2024-06-26
toc: true
toc_label: "구성요소"
#toc_icon: "cogs"
---
## K-PaaS Local Version
![component.png](/assets/images/kpaas/component.png)

![component_color.png](/assets/images/kpaas/component_color.png)
{: .align-left}
K-PaaS Local Version 제외 컴포넌트


## 컴포넌트
- Core 기능
 
| Component  | 용도                                | 비고          |
|------------|-----------------------------------|-------------|
| Kubernetes | 컨테이너 플랫폼                          |             |
| Portal     | 플랫폼 관리화면                          |             |
| Harbor     | Container Image 저장                | Portal에서 사용 |
| Keycloak   | SSO 로그인                           | Portal에서 사용 |
| Vault      | 플랫폼 메트릭 수집 시 활용</br>(Metrics-API) | Portal에서 사용 |
 
- 제외 컴포넌트

| Component      | 용도         | 비고       |
|----------------|------------|----------|
| ceph           | NFS로 대체 가능 | 많은 자원 소모 |
| Pipeline       | CI/CD용     | 필수 기능 아님 |
| Source Control | 소스 관리      | 필수 기능 아님 |
| Kubeflow       | AI 기능      | 필수 기능 아님 |
