---
title: GitOps 워크플로
description: Argo CD + Gitea App-of-Apps 선언적 배포 체계.
project: Narwhal
path: narwhal/gitops
order: 1100
lastModified: 2026-08-23
---

# GitOps 워크플로

Narwhal의 모든 인프라 및 플랫폼 애플리케이션은 Argo CD의 App-of-Apps 패턴을 통해 선언적으로 관리됩니다.

## 배포 흐름
1. `gitops/applications/` 디렉토리에 각 애플리케이션 매니페스트 정의
2. 로컬 Gitea 저장소에 변경사항 푸시
3. Argo CD Application Controller가 드리프트(Drift) 감지 및 자동 동기화
4. Sync Waves를 통해 의존성 순서(CRD → CNI/Storage → IAM → Apps)에 맞춰 단계별 배포

## 관련 링크

- [Narwhal 저장소](https://github.com/dasomel/narwhal)
- [Narwhal 포털](/oss/narwhal/)
