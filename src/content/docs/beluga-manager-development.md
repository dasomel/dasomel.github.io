---
title: 로컬 개발 가이드
description: beluga 저장소의 manager/ 에서 Domain API와 웹 콘솔을 실행하고 검증하는 방법.
project: Beluga
path: beluga/manager-development
order: 1507
lastModified: 2026-10-15
---

# 로컬 개발 가이드

별도로 클론할 저장소는 없습니다. beluga를 클론한 뒤 `manager/`에서 모든 명령을 실행합니다. Node.js 22 이상이 필요하고, `manager/`는 자체 `package.json`과 lockfile을 가진 npm workspace입니다.

```bash
git clone https://github.com/dasomel/beluga.git
cd beluga/manager
npm install
```

## 구조

```text
manager/
├── packages/
│   ├── web/              # React 19 + Vite SPA
│   ├── domain-api/       # Hono + @hono/zod-openapi
│   └── policy-compiler/  # policyctl CLI
└── docs/adr/             # Architecture Decision Records
```

## 실행

```bash
npm run dev       # 웹 콘솔 http://localhost:5180
npm run dev:api   # Domain API http://localhost:8787 (API 문서: /api/v1/docs)
```

API는 기본적으로 `packages/domain-api/src/stub-data/`의 fixture를 반환하므로 Beluga 클러스터 없이 실행됩니다. 이 구성은 UI/API 동작만 보여 주며 실제 upstream 연동의 증거가 아닙니다. 프런트엔드 origin(5180)과 API 주소(8787)는 CORS와 `config.json`에 고정되어 있습니다.

## 검증

```bash
npm run typecheck
npm test
npm run build
npm run audit                    # 의존성 취약점·라이선스 정책
npm run policyctl               # policy compiler CLI
make verify                      # 문서·저장소 구조 검증
make dev-up / make dev-down      # compose로 컨테이너 스택 실행
```

CI는 루트의 `.github/workflows/manager-ci.yml`이며 `manager/**` 변경에만 동작합니다(`working-directory: manager`). 저장소 전체 검사(lint, docs, SAST)는 `manager/`도 함께 봅니다.

이슈는 beluga에서 `area:manager` 라벨로 관리합니다. 기존 beluga-manager의 열린 이슈 22건은 #239–#260으로 이전되었습니다.
