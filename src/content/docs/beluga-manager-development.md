---
title: 로컬 개발 가이드
description: 현재 저장소 검증 방법과 향후 애플리케이션 기술 스택 결정 경계.
project: Beluga Manager
path: beluga-manager/development
order: 1602
lastModified: 2026-09-14
---

# 로컬 개발 가이드

Beluga Manager는 아직 Frontend/Backend 기술 스택을 확정하지 않았습니다. 존재하지 않는 `pnpm` 개발 서버나 Mock API를 실행 가능한 것처럼 안내하지 않습니다.

```bash
# 저장소 클론 및 현재 기반 검증
git clone https://github.com/dasomel/beluga-manager.git
cd beluga-manager
make verify
```

현재 검증 대상은 문서 frontmatter, 필수 저장소 파일, 영·한 문서 쌍과 CI 기반입니다. 실제 application stack을 선택할 때는 별도 ADR로 runtime, package manager, API framework와 UI framework를 확정한 뒤 명령어를 추가해야 합니다.
