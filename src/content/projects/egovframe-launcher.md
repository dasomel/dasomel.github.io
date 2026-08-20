---
title: "eGovFrame Launcher"
description: "전자정부 표준프레임워크 예제를 clone → build → 기동 → 접속까지 처리하는 로컬 개발용 GUI 런처"
github: "https://github.com/dasomel/egovframe-launcher"
tags: ["eGovFrame", "Go", "Developer Tools", "Spring Boot", "Tomcat", "Docker"]
order: 9
type: "own"
---

## 프로젝트 소개

eGovFrame Launcher는 **전자정부 표준프레임워크(eGovFrame) 예제 프로젝트를 clone → build → 기동 → 접속까지 버튼 몇 번으로 처리하는 로컬 개발용 GUI 런처**입니다. Go 단일 바이너리로 동작하며, 별도 설치 없이 실행하면 브라우저에 대시보드가 열립니다.

표준프레임워크 예제를 처음 돌려보려면 보통 레포마다 clone 위치를 정하고, JDK 버전을 맞추고, WAR는 Tomcat에 배포하고, MSA 예제는 DB·메시징 컨테이너를 먼저 띄우고, 포트가 겹치지 않는지 확인해야 합니다. 이 런처는 그 준비 과정을 대신합니다.

## 최신 소스 점검 · 2026-08-20

최근 소스의 가장 큰 변화는 **RSP 배포 안정성, 런처 관찰성, 사용자 경험**을 실제 장애 사례에서 역으로 강화한 것입니다.

- 다중 deployable 복사에서 기존 15초 RPC timeout이 초과되는 문제를 확인해 RSP publish 전용 timeout을 **120초**로 분리
- Tomcat autoDeploy가 exploded WAR 복사 중 컨텍스트를 먼저 시작해 404/클래스 누락이 발생하는 race를 감지하고, publish 후 URL을 polling해 필요하면 자동 재배포
- 헤더에 실행 중 런처 버전 badge를 표시하고 GitHub Releases의 release note를 조회하는 UI 추가
- 대량 로그에서 SSE `textContent +=`로 발생하던 O(n²) 렌더링 문제를 250ms batching과 4,000줄 상한으로 개선
- Linux MySQL의 `lower_case_table_names` 차이 때문에 공통컴포넌트가 실패하는 문제를 새 컨테이너 기본값으로 보정

즉 이 프로젝트는 단순한 예제 실행 UI에서 **실제 개발 환경의 배포·로그·런타임 마찰을 흡수하는 로컬 플랫폼 도구**로 발전하고 있습니다.

## 주요 기능

| 기능 | 설명 |
|------|------|
| **원클릭 실행** | 카드마다 Clone · Build · Run · Stop · Open · 로그 버튼. Spring Boot 타깃은 Run 하나로 기동까지 완료 |
| **WAR 자동 배포** | `mvn package` 후 타깃 전용 격리 Tomcat 인스턴스에 자동 배포. HTTP·shutdown 포트를 자동 할당해 타깃끼리 충돌하지 않음 |
| **인프라 자동 기동** | Docker가 필요한 타깃은 MySQL 8.0 · Redis 7 · RabbitMQ 3을 idempotent하게 프로비저닝(스키마 스크립트 순차 적재) |
| **JDK 자동 감지** | 시스템에 설치된 JDK를 스캔해 목록 제공. 기본값 JDK 17, 없으면 최신 메이저로 폴백 |
| **실시간 로그** | 빌드·기동 로그를 SSE로 대시보드에 스트리밍. 서비스별 필터·전체화면·복사 지원 |
| **포트 충돌 회피** | 타깃별 기본 포트가 지정되어 있고 카드에서 직접 변경 가능 |
| **VSCode 연동** | 클론된 타깃을 `code`로 바로 열기. Tomcat 연동용 Community Server Connectors 확장 설치 버튼 내장 |

## 지원 타깃

심플 게시판부터 MSA 템플릿까지 10종을 카드로 제공하며, 기동 방식과 기본 포트가 타깃별로 지정돼 있습니다.

| 카테고리 | 타깃 | 기동 방식 | 기본 포트 |
|---|---|---|---:|
| 심플 게시판 | 부트 기반 심플 게시판 (Spring Boot) | Run 즉시 기동 | 8090 |
| 심플 게시판 | 심플 게시판 (XML 기반 · WAR) | 격리 Tomcat 자동 배포 | 8091 |
| 심플 홈페이지 세트 | 템플릿 백엔드 (Spring Boot) | Run (DB 필요) | 8092 |
| 심플 홈페이지 세트 | 템플릿 프론트엔드 (React · Vite) | Run (백엔드 연동) | 5173 |
| 일반 템플릿 | 포털 사이트 템플릿 (WAR) | 격리 Tomcat 자동 배포 | 8093 |
| 일반 템플릿 | 내부업무 시스템 템플릿 (WAR) | 격리 Tomcat 자동 배포 | 8094 |
| 일반 템플릿 | 심플 홈페이지 템플릿 (WAR) | 격리 Tomcat 자동 배포 | 8095 |
| 공통컴포넌트 & MSA | 공통컴포넌트 (WAR) | 격리 Tomcat 자동 배포 | 8096 |
| 공통컴포넌트 & MSA | MSA 공통컴포넌트 | Config→Eureka→Main→Login→Board→Gateway 순차 자동 기동 | 19000 |
| 공통컴포넌트 & MSA | MSA 템플릿 (교육용) | 백엔드 6서비스 → 프론트엔드 순차 기동 (Docker) | 3000 |

## 사용 방법

릴리스 바이너리를 내려받아 실행하면 `http://127.0.0.1:7070`이 자동으로 열립니다.

```bash
# macOS (Apple Silicon)
tar -xzf egov-launcher-darwin-arm64.tar.gz
./egov-launcher-darwin-arm64
```

소스에서 실행하거나, GUI 없이 헤드리스로 쓸 수도 있습니다.

```bash
cd launcher && go run .

bash scripts/00-check-prereqs.sh
bash scripts/01-clone.sh
bash scripts/10-run-boot-sample.sh
```

## 사전 준비물

- **필수**: `git`, JDK 17(권장), `mvn`
- **React 타깃**: `npm`
- **MSA·AI 타깃**: `docker`
- **WAR 타깃**: Tomcat 10.1+ (설정 패널에서 경로 지정)

## 기술 스택

Go 1.26 · JavaScript · SSE · Docker · Maven · Tomcat 10.1+

macOS(arm64/amd64)와 Windows(arm64/amd64) 크로스 빌드를 지원하며, Apache 2.0 라이선스로 공개돼 있습니다.
