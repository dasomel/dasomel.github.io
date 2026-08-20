---
title: "AI 시대의 OSS, 면사무소보다 목욕탕을 만들어야 한다"
description: "AI가 코드를 더 빠르게 만들어 주는 시대에 내가 만들고 있는 OSS를 다시 바라봤다. Narwhal, Beluga, KubeMetal, eGovFrame Launcher, nfs-quota-agent, ldapium을 사용자의 실제 마찰을 줄이는 관점에서 정리한다."
pubDate: 2026-08-20
tags: ["AI", "Open Source", "Platform Engineering", "Kubernetes", "Cloud Native", "Developer Experience"]
featured: false
draft: false
---

## 들어가며

최근 GeekNews에서 **「AI 시대, 개발자는 면사무소가 아니라 목욕탕을 만들어야 한다」**는 글을 읽었습니다.

글의 비유가 인상적이었습니다.

다큐멘터리에서 한 마을의 주민들은 새 면사무소보다 목욕탕이 필요하다고 이야기합니다. 공급자가 보기에는 면사무소가 그럴듯한 해결책이지만, 사용자의 실제 삶을 들여다보면 전혀 다른 문제가 보였던 것입니다.

이 이야기를 읽고 나서 제가 만들고 있는 오픈소스 프로젝트들을 다시 봤습니다.

그동안 저는 Kubernetes, GitOps, Data Platform, MLOps 같은 기술을 어떻게 잘 통합할 것인지에 많은 시간을 썼습니다. 좋은 아키텍처를 만들고, 버전을 맞추고, 장애를 재현하고, 테스트를 늘리는 일도 중요했습니다.

그런데 질문을 하나 바꿔보니 프로젝트들이 조금 다르게 보였습니다.

> **이 OSS는 어떤 기술을 제공하는가가 아니라, 누군가의 어떤 마찰을 없애고 있는가?**

AI가 코드를 더 빠르게 만들어 주는 시대라면 이 질문은 더 중요해진다고 생각합니다.

AI는 면사무소를 이전보다 훨씬 빨리 지어줄 수 있습니다. 그렇기 때문에 개발자는 무엇을 만들지 결정하는 단계에서 더 오래 생각해야 합니다.

제가 만들고 있는 OSS를 이 관점에서 다시 정리해봤습니다.

---

## 1. Narwhal — Kubernetes를 설치하는 것이 아니라 운영의 마찰을 줄이는 것

[Narwhal](https://github.com/dasomel/narwhal)은 Kubernetes 기반의 오픈소스 Internal Developer Platform입니다.

GitOps, IAM/SSO, API Gateway, Service Mesh, Observability, Registry, Storage, Backup, Policy, Portal 등을 하나의 플랫폼으로 통합합니다.

겉으로만 보면 꽤 전형적인 플랫폼 프로젝트처럼 보입니다.

```text
Kubernetes
  + GitOps
  + SSO
  + API Gateway
  + Service Mesh
  + Observability
  + Registry
  + Storage
  + Backup
  + Policy
  + Portal
```

하지만 Narwhal에서 제가 실제로 해결하려는 문제는 Kubernetes 설치가 아닙니다.

Kubernetes 자체는 비교적 쉽게 설치할 수 있습니다. 더 어려운 것은 그 위에 올라가는 서로 다른 프로젝트가 **같이 동작하도록 만드는 것**입니다.

예를 들어:

```text
Kubernetes
   ↕
Keycloak
   ↕
APISIX
   ↕
Istio
   ↕
ArgoCD
   ↕
Grafana / Gitea / Harbor / Headlamp
```

각 프로젝트가 개별적으로 잘 동작하는 것과 전체가 함께 동작하는 것은 전혀 다른 문제입니다.

인증 claim이 맞지 않을 수 있고, TLS 체인이 어긋날 수 있고, 특정 Helm chart 변경 때문에 기존 설정이 깨질 수 있고, air-gapped 환경에서는 인터넷에 있던 작은 dependency 하나가 전체 설치를 멈출 수도 있습니다.

그래서 Narwhal에서는 **component 자체보다 component 사이의 seam을 제품으로 봅니다.**

그리고 이 생각은 운영 기록에도 반영되어 있습니다.

현재 `lessons-log.md`에는 발생했던 통합 문제들을 기록하고 있습니다. 단순히 "어떻게 고쳤는가"만 적는 것이 아니라 비슷한 원인으로 보이는 다른 문제와 어떻게 구분할 것인지까지 기록하고, 가능한 문제는 regression test로 연결합니다.

```text
Incident
   ↓
Lesson
   ↓
Discriminator
   ↓
Regression Test
```

이 구조는 기술 자랑을 위한 것이 아닙니다.

플랫폼 운영자가 같은 문제를 다시 만났을 때 **처음부터 다시 삽질하지 않도록 하는 것**이 목적입니다.

Narwhal을 목욕탕 관점에서 다시 정의하면 이렇게 말할 수 있습니다.

> **Kubernetes와 수십 개의 Cloud Native 프로젝트 사이에서 운영자가 반복해서 겪는 통합 마찰을 없애는 플랫폼**

이렇게 보면 35개의 애플리케이션을 넣었다는 사실보다, 그 35개를 실제로 같이 움직이게 만들기 위해 어떤 문제를 제거했는지가 더 중요해집니다.

---

## 2. Beluga — 데이터 기술을 전시하는 것이 아니라 데이터의 흐름을 직접 경험하게 하는 것

[Beluga](https://github.com/dasomel/beluga)는 로컬 VM 위에서 데이터 플랫폼 전체를 재현하는 프로젝트입니다.

Kafka와 CDC, Flink, Iceberg, Trino, Superset, Airflow 등을 Kubernetes와 GitOps로 묶습니다.

기술 목록만 보면 꽤 무겁습니다.

```text
PostgreSQL
   ↓ CDC
Kafka
   ↓
Flink
   ↓
Iceberg
   ↓
Trino
   ↓
Superset
```

여기에 Airflow와 Catalog, Object Storage, SSO, Policy까지 들어갑니다.

처음에는 이것을 "현대적인 데이터 플랫폼을 한 번에 구성해보는 프로젝트"라고 생각했습니다.

하지만 사용자 관점에서 보면 조금 다른 표현이 더 좋다고 생각하게 됐습니다.

사용자가 원하는 것은 Kafka를 설치하는 것이 아닙니다.

사용자가 원하는 것은 아마 이런 경험일 것입니다.

> PostgreSQL에 데이터를 넣었더니 CDC가 발생하고, Kafka를 거쳐 Flink에서 처리되고, Iceberg에 저장되고, Trino로 조회하고, 마지막에는 대시보드에서 결과를 볼 수 있다.

즉 제품은 컴포넌트 목록이 아니라 **하나의 데이터 여정**입니다.

그래서 Beluga에서 중요한 것은 단순히 `helm template`이 성공하는 것이 아닙니다.

실제 클러스터 상태를 보고 Kafka/CDC, Flink/Iceberg, Trino, Airflow 등의 end-to-end 흐름이 살아 있는지를 확인하는 테스트를 별도로 둡니다.

```text
설정 파일이 맞다
        ≠
플랫폼이 실제로 동작한다
```

이 차이를 줄이는 것이 Beluga가 해결하려는 마찰입니다.

앞으로도 Beluga를 발전시킬 때는 "어떤 컴포넌트를 더 넣을까"보다 **사용자가 데이터가 흘러가는 전체 과정을 얼마나 쉽게 이해하고 재현할 수 있는가**를 기준으로 보려고 합니다.

---

## 3. KubeMetal — Apple Silicon의 제약을 감추는 것이 제품이다

[KubeMetal](https://github.com/dasomel/kubemetal)은 Apple Silicon에서 로컬 MLOps 환경을 만드는 프로젝트입니다.

이 프로젝트의 가장 중요한 설계는 의외로 Kubernetes 자체가 아닙니다.

Apple Silicon에서는 GPU compute와 Linux VM의 관계가 일반적인 x86 서버 환경과 다릅니다. 그래서 KubeMetal은 **Control과 Compute를 물리적으로 분리**합니다.

```text
             KubeMetal
                 │
       ┌─────────┴─────────┐
       │                   │
   Kubernetes           macOS Host
   Control Plane          Compute
       │                   │
 MLflow / SeaweedFS      MLX / GPU
```

Kubernetes 안에서는 MLOps control plane을 관리하고, 실제 GPU 작업은 macOS host process에서 수행합니다.

기술적으로는 꽤 재미있는 구조지만 사용자에게 중요한 것은 이런 구현 방식이 아닙니다.

사용자는 단순히:

> **"내 Mac에서 GPU를 이용해서 모델을 학습하고 서빙하고 싶다."**

라고 생각할 가능성이 높습니다.

KubeMetal의 역할은 사용자가 Apple Silicon의 제약을 하나하나 이해하지 않아도 되도록 만드는 것입니다.

Dashboard에서 클러스터를 시작하고, MLOps stack을 준비하고, 모델을 내려받고, 학습하고, MLflow에 등록하고, 서빙하는 흐름을 하나의 경험으로 연결합니다.

이런 관점에서 보면 KubeMetal의 핵심은 "8개 탭의 MLOps 앱"이 아니라:

> **Apple Silicon에서 발생하는 Kubernetes와 GPU 사이의 현실적인 마찰을 사용자가 직접 다루지 않도록 숨기는 것**

입니다.

기능이 많아질수록 오히려 이 중심을 잃지 않는 것이 중요하다고 생각합니다.

---

## 4. eGovFrame Launcher — 가장 명확한 "목욕탕"형 OSS

[eGovFrame Launcher](https://github.com/dasomel/egovframe-launcher)는 전자정부 표준프레임워크 예제를 로컬에서 실행하기 위한 GUI 런처입니다.

이 프로젝트를 만든 이유는 아주 단순합니다.

eGovFrame 예제를 처음 실행하려면 생각보다 해야 할 일이 많습니다.

```text
Git clone
   ↓
JDK 확인
   ↓
Maven 확인
   ↓
프로젝트별 요구사항 확인
   ↓
Tomcat / DB / Redis / RabbitMQ 준비
   ↓
포트 충돌 확인
   ↓
Build
   ↓
Deploy
   ↓
Run
   ↓
Log 확인
```

그런데 사용자가 정말 원하는 것은 이 모든 과정이 아닙니다.

> **"예제를 한번 실행해보고 싶다."**

그래서 Launcher는 Clone, Build, Run, Stop, Open, Log를 하나의 흐름으로 묶고, JDK를 감지하고, WAR 프로젝트에는 격리된 Tomcat을 사용하고, 필요한 Docker 인프라를 자동으로 준비하고, 포트 충돌까지 관리합니다.

이 프로젝트는 제가 만든 OSS 가운데 가장 직접적으로 이번 비유와 연결됩니다.

공급자 입장에서는 "개발환경 자동화 도구"일 수 있지만, 사용자 입장에서는 그냥 **"귀찮은 준비 작업을 없애주는 버튼"**입니다.

이런 프로젝트를 만들 때는 오히려 기능을 더 넣는 것보다 준비 과정의 단계를 얼마나 줄였는지를 보는 것이 맞습니다.

```text
기존
clone → 설치 → 설정 → build → deploy → run

Launcher
        ↓
      Run
```

물론 실제로는 여러 단계가 내부에서 실행됩니다.

중요한 것은 **사용자가 그 단계를 직접 관리하지 않아도 된다는 것**입니다.

---

## 5. nfs-quota-agent — 작지만 정확한 문제를 해결하는 OSS

[nfs-quota-agent](https://github.com/dasomel/nfs-quota-agent)는 규모로 보면 Narwhal이나 Beluga와 비교할 수 없는 작은 프로젝트입니다.

하지만 이번 관점에서는 오히려 아주 좋은 예입니다.

Kubernetes에서는 PVC에 저장 용량을 선언할 수 있습니다.

그런데 NFS 기반 스토리지를 사용할 때 Kubernetes의 추상화만으로는 실제 NFS 서버의 filesystem quota가 원하는 방식으로 강제되지 않을 수 있습니다.

그러면 운영자는 이런 질문을 하게 됩니다.

> "PVC는 10Gi라고 했는데 실제 디스크는 왜 계속 늘어나지?"

nfs-quota-agent는 이 지점을 파고듭니다.

NFS server node에서 실제 filesystem의 project quota를 관리하고, Kubernetes의 PV와 연결해 quota 상태를 추적합니다.

```text
Kubernetes PVC
      ↓
PersistentVolume
      ↓
NFS
      ↓
Filesystem
      ↓
Project Quota
```

즉 Kubernetes abstraction과 실제 storage enforcement 사이의 틈을 메우는 것입니다.

이런 OSS는 기능이 화려하지 않아도 좋습니다.

사용자가 겪는 문제가 명확하고, 그 문제가 실제로 사라진다면 충분히 가치가 있습니다.

OSS의 크기보다 **마찰과 해결책의 연결이 얼마나 선명한가**가 더 중요하다는 점을 보여주는 프로젝트입니다.

---

## 6. ldapium — 새로운 LDAP이 아니라 "지금 Kubernetes에서 쓸 수 있는 LDAP"를 만든다

[ldapium](https://github.com/dasomel/ldapium)은 OpenLDAP을 Kubernetes에서 사용할 수 있도록 패키징한 프로젝트입니다.

여기서도 중요한 것은 OpenLDAP 자체를 새로 만드는 것이 아닙니다.

기존 선택지들을 실제 환경에서 사용하다 보면:

- 오래된 이미지가 남아 있거나
- Kubernetes용 Helm chart가 더 이상 유지되지 않거나
- arm64를 지원하지 않거나
- writable LDAP이 필요한데 대안이 읽기 전용인 경우가 생깁니다.

OpenLDAP이라는 기술은 여전히 존재하지만, **현재의 Kubernetes 사용자가 실제로 설치하고 운영할 수 있는 형태**는 별개의 문제입니다.

그래서 ldapium은 upstream OpenLDAP source를 기반으로 이미지를 만들고, Helm chart와 관리 UI를 제공하고, multi-architecture와 테스트, 백업, provenance, SBOM 같은 운영 요소까지 함께 다룹니다.

이 프로젝트의 핵심 문장은 오히려 이것에 가깝습니다.

> **LDAP을 새로 발명하는 것이 아니라, 사용자가 지금 필요한 형태로 가져다 쓰게 만든다.**

이런 프로젝트를 만들다 보면 "왜 굳이 또 만들었는가?"라는 질문을 받게 됩니다.

그럴 때 답은 새로운 기능이 아니라 **기존 사용 경로에서 사라진 마찰**이어야 한다고 생각합니다.

---

## 7. 여섯 프로젝트를 한 문장으로 묶으면

이번 글을 쓰면서 보니 각 프로젝트는 서로 다른 분야에 있는 것 같지만 비슷한 구조를 갖고 있습니다.

```text
사용자
  │
  ├─ eGovFrame 예제를 실행하고 싶다
  │       ↓
  │   eGovFrame Launcher
  │
  ├─ Kubernetes 플랫폼을 운영하고 싶다
  │       ↓
  │   Narwhal
  │
  ├─ 데이터 파이프라인 전체를 재현해보고 싶다
  │       ↓
  │   Beluga
  │
  ├─ Apple Silicon에서 로컬 GPU MLOps를 하고 싶다
  │       ↓
  │   KubeMetal
  │
  ├─ NFS PVC quota를 실제 filesystem에서 강제하고 싶다
  │       ↓
  │   nfs-quota-agent
  │
  └─ Kubernetes에서 현재형 OpenLDAP을 쓰고 싶다
          ↓
      ldapium
```

이걸 기술 이름으로 묶으면 서로 관련이 없어 보입니다.

하지만 사용자 문제로 묶으면 꽤 일관됩니다.

> **복잡한 시스템을 직접 조립하고 운영해야 하는 마찰을 줄인다.**

저는 앞으로 OSS를 만들 때 이 기준을 더 중요하게 보려고 합니다.

---

## 8. AI 시대에는 "더 많이 만드는 능력"보다 "무엇을 안 만들지 판단하는 능력"이 중요해진다

AI를 사용하면 작은 기능 하나를 추가하는 비용이 매우 낮아집니다.

그 결과 프로젝트에 기능이 늘어나는 속도도 빨라집니다.

```text
좋은 아이디어
   ↓
AI에게 구현 요청
   ↓
몇 분 또는 몇 시간
   ↓
기능 추가
```

이것은 분명한 장점입니다.

하지만 제품 관점에서는 새로운 문제가 생깁니다.

**만들 수 있으니까 만들게 되는 것**입니다.

Dashboard를 하나 더 만들 수 있고,

API를 하나 더 붙일 수 있고,

설정 옵션을 하나 더 추가할 수 있고,

자동화를 하나 더 넣을 수 있습니다.

그러다 보면 프로젝트는 점점 "면사무소"가 됩니다.

모든 것을 갖춘 것처럼 보이지만, 정작 사용자가 처음 해결하려던 문제는 더 어려워질 수 있습니다.

그래서 AI 시대의 개발자는 오히려 다음 질문을 더 자주 해야 한다고 생각합니다.

> **이 기능이 사용자의 삶에서 어떤 마찰을 없애는가?**

답이 분명하지 않다면 만들지 않는 것도 좋은 선택입니다.

---

## 9. AI가 벌어준 시간을 어디에 써야 하는가

AI가 코드를 작성해주는 덕분에 개발자의 시간이 남는다면 선택지는 두 가지입니다.

```text
A. 기능을 더 많이 만든다

B. 사용자를 더 많이 이해한다
```

저는 앞으로 B에 더 많은 시간을 써야 한다고 생각합니다.

실제 운영 환경에서 어떤 작업이 가장 번거로운지 보고,

어떤 설정이 반복되는지 보고,

어떤 오류가 계속 반복되는지 보고,

어떤 명령어를 모든 사람이 복사해서 쓰고 있는지 보고,

어떤 단계 때문에 새로운 사용자가 중간에 포기하는지 보는 것입니다.

그리고 그 문제를 OSS로 없애는 것입니다.

AI는 구현 속도를 올릴 수 있습니다.

하지만 **무엇을 구현해야 하는지는 사용자의 삶을 봐야 알 수 있습니다.**

---

## 마치며

이번 글을 계기로 제가 만들고 있는 OSS들을 다시 봤습니다.

처음에는 각각 다른 기술을 실험하는 프로젝트라고 생각했습니다.

Narwhal은 Kubernetes Platform,

Beluga는 Data Platform,

KubeMetal은 Local MLOps,

eGovFrame Launcher는 개발 도구,

nfs-quota-agent는 Storage Agent,

ldapium은 LDAP packaging 프로젝트입니다.

하지만 사용자 관점에서 다시 보니 공통점이 있습니다.

> **복잡한 기술을 더 많이 제공하는 것이 아니라, 사용자가 그 복잡성을 직접 감당해야 하는 순간을 줄이는 것.**

앞으로 OSS를 만들면서도 "무엇을 더 넣을까?"보다 먼저 이렇게 물어보려고 합니다.

> **사람들이 지금 어디에서 막히고 있는가?**
>
> **그 문제를 없애면 무엇이 달라지는가?**
>
> **그리고 그 해결책을 한 번 쓰면 다시 돌아가고 싶지 않을 만큼 단순하게 만들 수 있는가?**

AI 시대의 개발자가 만드는 좋은 OSS는 어쩌면 거대한 면사무소가 아니라, 사용자가 정말 필요로 했던 **작고 정확한 목욕탕**에 더 가까울지도 모르겠습니다.

---

### 참고

- [AI 시대, 개발자는 면사무소가 아니라 목욕탕을 만들어야 한다 — GeekNews](https://news.hada.io/topic?id=32662)
- [Narwhal](https://github.com/dasomel/narwhal)
- [Beluga](https://github.com/dasomel/beluga)
- [KubeMetal](https://github.com/dasomel/kubemetal)
- [eGovFrame Launcher](https://github.com/dasomel/egovframe-launcher)
- [nfs-quota-agent](https://github.com/dasomel/nfs-quota-agent)
- [ldapium](https://github.com/dasomel/ldapium)
