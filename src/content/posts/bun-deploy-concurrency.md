---
title: "Bun 전환 이후 GitHub Pages 배포 동시성 기록"
description: "Bun migration 이후 main에 연속 변경이 발생했을 때 이전 Pages 배포가 취소되고 최신 revision이 배포되는 과정을 기록합니다."
pubDate: 2026-08-21
tags: ["Bun", "GitHub Actions", "CI/CD", "GitHub Pages", "Deployment"]
featured: false
draft: false
---

## 연속된 main 변경에서 이전 Deploy가 취소됐다

Bun migration과 CI 구조를 정리하는 과정에서 `main`에 짧은 시간 안에 연속으로 변경이 들어갔습니다.

실제 Actions에서는 이전 Pages Deploy가 `cancelled`로 끝나고, 더 최신 commit에 대한 새로운 Deploy가 이어졌습니다.

이번 사례에서는:

```text
Commit A: 97ca593
    ↓
Deploy #364
    ↓
새로운 main commit 발생
    ↓
Deploy #364 cancelled
    ↓
Commit B: 76e1a3e
    ↓
Deploy #365
    ↓
Build ✅
Deploy ✅
```

<Mermaid chart={`flowchart TD
    classDef commit fill:#f8fafc,stroke:#64748b,color:#334155,stroke-width:1.5px
    classDef deploy fill:#ecfeff,stroke:#06b6d4,color:#155e75,stroke-width:1.5px
    classDef cancel fill:#fef2f2,stroke:#ef4444,color:#991b1b,stroke-width:2px
    classDef success fill:#ecfdf5,stroke:#10b981,color:#065f46,stroke-width:1.5px

    A[Commit A: 97ca593] --> B[Deploy #364]
    B --> C[New main commit]
    C --> D[Deploy #364 cancelled]
    C --> E[Commit B: 76e1a3e]
    E --> F[Deploy #365]
    F --> G[Build success]
    G --> H[Pages deploy success]
    class A,C,E commit
    class B,F deploy
    class D cancel
    class G,H success
`} />

### 이것은 반드시 장애를 의미하지 않는다

이 상황에서 `cancelled`만 보고 배포 실패로 판단하면 안 됩니다.

| 확인 항목 | 판단 기준 |
| --- | --- |
| 이전 run | `cancelled`인지 확인 |
| 최신 commit run | 새 Deploy가 생성됐는지 확인 |
| 최신 Deploy | build와 실제 Pages deployment가 성공했는지 확인 |

이번 사례에서는 이전 run #364가 취소됐지만 최신 revision의 #365가 생성됐고, 실제 build를 성공적으로 완료한 뒤 Pages deployment까지 진행됐습니다.

## 왜 이 기록을 남기는가

CI/CD에서 중요한 것은 개별 run의 상태 하나가 아니라 **revision과 deployment의 관계**입니다.

```text
Older revision
    ↓
Older deployment
    ↓
Superseded

Latest revision
    ↓
Latest deployment
    ↓
Production
```

따라서 연속적인 `main` push가 가능한 저장소에서는 `cancelled` run을 즉시 장애로 분류하기보다, 최신 revision이 정상적으로 배포됐는지 확인하는 것이 더 정확합니다.

이번 Bun migration에서 이 사례까지 기록해 두면 runtime 변경뿐 아니라 **실제 CI/CD 운영 과정에서 발생한 execution race와 deployment lifecycle**까지 함께 설명할 수 있습니다.
