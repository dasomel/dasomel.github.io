---
title: "AI 에이전트와 Kubernetes 플랫폼 수직 계열화: 발표 자료 정리"
description: "2026년 10월 28일 Kubernetes Korea Group 밋업 세션 2의 발표 내용을 글로 정리했습니다. Day-0/1/2 프레임으로 본 프로젝트별 역할, OpenForge 검증 체계, 외부 개발자 사례, AI 에이전트 팀의 실패 사례입니다."
pubDate: 2026-10-28
tags: ["Kubernetes", "Platform Engineering", "AI Agent", "Seminar", "Open Source", "Evidence"]
projects: ["kube-ready-box", "narwhal", "nfs-quota-agent", "narwhal-portal", "clusterdeck", "openforge", "kubemetal"]
featured: false
draft: false
---

2026년 10월 28일(수) 19:00, Kubernetes Korea Group 밋업 세션 2에서 「AI 에이전트와 함께한 Kubernetes 플랫폼 엔지니어링의 수직 계열화」를 발표합니다. 부제는 "클러스터 구축부터 운영 도구, 개발자 경험, 검증 체계까지"입니다. 이 글은 발표자료를 공개하면서 내용을 글로 먼저 정리한 것이고, 발표가 끝난 뒤의 후기가 아닙니다.

[발표자료 바로 보기](https://cne.io.kr/slides/k8s-platform-vertical/#1) · 슬라이드는 한국어이며 55장입니다. 수치와 상태는 슬라이드에 적힌 기준일을 따릅니다.

## 문제: 설치 말고도 필요한 게 많다

클러스터를 띄우는 것은 시작일 뿐입니다. 인프라 준비, 클러스터 설치, 네트워크, 스토리지, 인증, 개발자 포털, 운영 도구까지 일곱 영역이 모두 이어져야 플랫폼이 됩니다. 각각 잘 동작하는 컴포넌트도 연결되는 순간 문제가 생깁니다. Keycloak OIDC claim, APISIX 인증, 서비스 라우팅, Istio ambient mTLS처럼 DNS, TLS, identity, 시작 순서, 버전 호환성이 만나는 이음새마다 장애 후보가 있고, 업그레이드 때마다 다시 검증해야 합니다.

그래서 발표는 이음새를 제품 경계로 보고, 장애 기록을 회귀 검증으로 바꾸는 접근을 따라갑니다.

## Day-0/1/2 프레임과 수직 계열화 지도

플랫폼의 생명주기를 셋으로 나눕니다. 이 프레임은 발표자의 분류이고, 각 항목은 프로젝트 소개 문서의 기능에서 가져왔습니다.

| 단계 | 의미 | 담당 프로젝트 |
|---|---|---|
| Day-0 | 설계, 환경 준비 | Kube-Ready-Box, Narwhal(air-gap 번들) |
| Day-1 | 설치, 구성 | Narwhal(35 apps 설치), ClusterDeck(SSH bootstrap) |
| Day-2 | 운영 | Narwhal(검증, 업그레이드 gate), NFS Quota Agent, Narwhal Portal, ClusterDeck |
| 전 구간 | 표준, 검증, 증거 | OpenForge |

수직 계열화 지도는 이를 아래에서 위로 쌓은 그림입니다. 인프라(Kube-Ready-Box) 위에 플랫폼·클러스터(Narwhal), 스토리지(NFS Quota Agent), 개발자·운영자 경험(Narwhal Portal, ClusterDeck)이 놓이고, 검증 체계(OpenForge)가 모든 계층을 가로지릅니다.

## 프로젝트별 역할

### Kube-Ready-Box (Day-0)

Kubernetes installer가 아니라 "올라가기 전의 준비 상태"를 이미지로 만드는 프로젝트입니다. Packer로 Kubernetes용 Ubuntu base image를 미리 구성해 Vagrant Cloud로 배포하고, 같은 OS baseline을 여러 프로젝트에서 재사용합니다. swap 비활성화, kernel modules(`br_netfilter`, `overlay`, `iscsi_tcp`), IP forwarding, conntrack 튜닝, `/sys/fs/bpf` 마운트, 스토리지 전제 패키지, chrony 시간 동기화, 보안 하드닝이 이미지에 들어 있습니다. 최신 v1.1.0(2026-07-19)입니다.

### Narwhal (Day-0~2)

수십 개 Cloud Native 프로젝트를 따로 설치할 때 반복되는 이음새 장애를 줄이려고, 35개 GitOps-managed application을 하나의 재현 가능한 IDP로 묶었습니다. 슬라이드의 수치는 다음과 같습니다(2026-10-27 기준 main).

- 35 GitOps-managed apps
- 442건의 documented incidents
- 394개 regression checks
- 1,225 commits (2026-02-08 ~ 10-26)

슬라이드는 커밋 수를 자랑이 아니라 통합 복잡성을 반복해서 검증했다는 운영 증거로 둡니다. 검증은 세 계층입니다. Cluster Verification 120+, SSO Verification 49, Regression 394이고, CI에서는 매 push마다 51-check suite를 돌립니다. air-gap 설치도 운영 시나리오로 보고 아키텍처별 오프라인 번들(104 images, 27 charts)을 만들어 검증합니다.

핵심은 **Knowledge as Tests**입니다. incident를 원인(Root Cause), 비슷한 장애와 구분하는 기준(Discriminator), 회귀 검증(Regression Check)으로 남기면 다음 업그레이드의 관문이 됩니다. 실패했던 접근까지 기록합니다.

최신 v1.3.0(2026-10-22)은 보안 하드닝 릴리스입니다. 번들 무결성 체인, trust boundary 축소, 공급망 CI gate가 들어갔습니다. 릴리스 노트의 Known issues도 슬라이드에 그대로 옮겼습니다. Kyverno 이미지 서명 정책은 아직 Audit 전용이라 아무것도 차단하지 않고, 부트스트랩 중에는 mesh-wide PERMISSIVE가 유지되며, OpenBao raft snapshot 암호화 백업은 어떤 클러스터에도 활성화되지 않았고 라이브 동작도 검증하지 못했습니다.

### NFS Quota Agent (Day-2 스토리지)

NFS 기반 PersistentVolume은 PVC 용량이 파일시스템의 실제 사용량 제한으로 자동 연결되지 않아, 워크로드 하나가 공유 저장소를 소진할 수 있습니다. 이 프로젝트는 NFS 서버 노드에서 DaemonSet으로 PV를 감시하고 파일시스템 Project Quota를 자동 적용해 XFS, ext4, Btrfs에서 실제 사용량을 강제합니다. quota 명령은 NFS client가 아니라 서버의 로컬 파일시스템에서 실행해야 합니다.

현재 Beta(v0.5.0, 2026-09-22)입니다. 핵심 quota 경로는 실제 Linux 커널 CI로 검증하지만, 단위 테스트는 외부 quota 명령을 stub으로 처리하므로 실제 커널 강제를 증명하지 않습니다. QuotaPolicy CRD(v1alpha1)는 v1.0 이전에 호환성 없이 바뀔 수 있고, ext4에서는 root writer가 hard limit을 우회할 수 있어 root_squash와 non-root 워크로드를 권장합니다.

### Narwhal Portal (Day-2 경험)

GitOps, SSO, 모니터링, 스토리지, 보안이 각자의 UI를 가진 문제를 상태, 애플리케이션, 노드, 카탈로그, 보안, 비용, 거버넌스를 하나로 묶은 Next.js 포털로 풀었습니다. 설계 원칙은 원천 시스템(Argo CD, Kubernetes, Keycloak)이 계속 authoritative하고 Portal은 복제하지 않고 조회와 상관관계만 제공한다는 것입니다. 최신은 v1.1.4(2026-10-27) 패치 릴리스이며, 저장소는 narwhal의 `portal/`로 옮겨졌고 dasomel/narwhal-portal은 archived입니다.

![Narwhal Portal 대시보드](/slides/k8s-platform-vertical/img/portal-dashboard.png)

### ClusterDeck (Day-2 접속)

로컬 VM과 Kubernetes 환경을 자주 만들고 지우면 IP가 바뀌고, SSH alias, ProxyJump, kubeconfig, context 이름을 매번 다시 연결해야 합니다. ClusterDeck은 host discovery, SSH bootstrap, alias/ProxyJump, kubeconfig fetch와 정규화, 연결 확인을 Profile 중심 흐름으로 묶는 macOS 데스크톱 앱입니다. 관리 콘솔이 아니라 접속 경로를 유지하는 workstation access layer이고, 자기가 소유한 파일만 건드립니다. v0.5.0(2026-10-26)은 unsigned build입니다.

### 관련 프로젝트: KubeMetal

Apple Silicon에서 Kubernetes control plane은 Colima 기반 VM에, GPU 연산은 macOS host의 MLX에 두는 하이브리드 MLOps 데스크톱 앱입니다. 위 다섯 프로젝트와 같은 플랫폼 계열이 아니라 Kube-Ready-Box의 사용처로 나오는 관련 프로젝트라, 슬라이드의 생태계 지도에서도 점선으로 그렸습니다.

## OpenForge: 설명과 구현이 어긋나지 않게

OSS가 늘수록 저장소마다 문서, CI, 보안, Agent 지침, 릴리스 상태가 다르게 진화해 설명과 구현, 검증 근거가 어긋납니다. OpenForge는 공통 Standards와 Templates, 실행 가능한 audit, 증거 기반 agent workflow, lifecycle registry로 이를 재현하고 검증할 수 있게 만드는 체계입니다. "완료"의 정의가 핵심입니다. 코드가 생성됐거나 merge됐다는 사실이 아니라, 의도한 경계에서 실제로 동작하고 적절한 증거로 검증되고 release와 rollback 영향까지 이해됐을 때를 완료로 봅니다.

### 증거 등급

증거에는 등급이 있고, 낮은 등급은 높은 주장을 하지 못합니다. Rust CLI `openforge assess`는 L1 Repository, L2 Execution, L3 Runtime으로 나눠 봅니다.

| 증거 | 증명하지 못하는 것 |
|---|---|
| Unit / Stub | 실제 커널, 클러스터 동작 |
| Build / Type check | 실제 side effect 성공 |
| Integration | 환경 전체 성질 |
| Runtime / E2E | 모든 환경의 보장 |
| Post-state | 무관한 리소스의 안전성 |

stub 테스트가 초록이어도 실제 커널이 quota를 강제했다고 말할 수 없다는 뜻입니다. AI는 report를 해석할 뿐 점수나 PASS/FAIL을 바꾸지 않습니다. Agent가 실제로 있는 곳에서는 승인 대상을 자연어 의도가 아니라 "실제로 실행될 resolved invocation"으로 둡니다. Agent가 없는 프로젝트(nfs-quota-agent, LDAPium, ClusterDeck)에는 억지로 넣지 않고 reduced profile만 정의했습니다.

### 포트폴리오 KPI

대시보드 KPI 세 개는 분모와 기준을 슬라이드에 적었습니다(레지스트리 스냅샷 2026-09-24 기준).

- **13 프로젝트**: 유지보수 책임자가 지정된 등록 프로젝트(11 활성, 2 유지보수). 책임 공백 0이 기준입니다.
- **96.9% 표준 성숙도**: OpenForge 저장소 자신이 적용 가능한 32개 지표에서 받은 점수(62/64).
- **61.6% 도입률**: Wave 1 감사의 554/900 풀링 점수, 목표 70%. 이후 Wave 2 감사는 70.6%이지만 대시보드는 아직 이전 스냅샷을 게시 중이라, 슬라이드는 두 수치가 별개라고 밝힙니다.

![OpenForge 포트폴리오 컨트롤 플레인](/slides/k8s-platform-vertical/img/openforge-ko-oss-dashboard.png)

## 외부 개발자 사례

외부 개발자는 GitHub 핸들만 적고, 상태는 슬라이드의 2026-10-26 기준입니다. 먼저 밝혀 둘 것은 설계 이슈 대부분이 아직 open이라는 점입니다. **채택이나 협업이 확정된 것이 아니며**, 일부 의견은 각자 프로젝트와 연결된 소개 성격입니다.

### openforge#128: 디자인 기여가 라이브 대시보드로

@saniya-malik이 OpenForge 이슈 #128의 선택 과제였던 포트폴리오 대시보드의 Figma 참조 설계를 기여했습니다(10-08 자원, 10-12 설계). 리뷰를 거쳐 10-13에 이슈가 닫혔고, 같은 날 dasomel.github.io PR #381이 병합되어 cne.io.kr의 라이브 대시보드가 됐습니다. 디자인만 받은 기여라 런타임 의존이나 데이터 계약은 바뀌지 않았고, source of truth는 계속 `portfolio/dashboard.json`입니다. 작은 UI 불일치도 반영해 아바타 이니셜이 Contributor 라벨처럼 보이던 부분을 일반 아이콘으로 고쳤습니다(PR #386).

### kube-ready-box#79: 버그 제보에서 종료까지

@Evantage-WS가 2026-10-18에 26.04 box가 VirtualBox(macOS 27, M4)에서 dracut emergency shell로 떨어진다고 제보했고, 10-26에 종료됐습니다(8일). 첫 응답은 제보 4일 뒤였습니다.

- 재현하고 범위를 좁혔습니다. 7월에 만든 box도 같은 호스트에서 실패해 최근 변경이 아니라 호스트 쪽 회귀로 좁혔습니다.
- 원인 후보와 우회로 SATA(AHCI)를 NVMe로 바꾸는 명령 세 줄을 제시했고, 제보자가 NVMe 변경 후 로그인 프롬프트까지 확인했습니다.
- 확인하지 못한 것은 밝혔습니다. NAT SSH가 정상 24.04 box에서도 실패해 `vagrant up` 완료는 확인하지 못했습니다.
- 템플릿 수정은 PR #80과 mistakes-log로 이어졌지만, PR #80은 10-26에 병합됐습니다. 다만 새 템플릿으로 전체 재빌드한 box와 `vagrant up` 완료는 아직 검증하지 않았습니다.

### 그 밖의 논의

narwhal#73에서는 @Aliipou가 일회성, action-bound grant와 PEP를 제안했고, PDP/signer/PEP/executor 분리를 이슈에 명시했으며 OpenForge ADR-0013(openforge#78 병합)에 반영됐습니다. 다만 narwhal#73 자체는 아직 open입니다. 같은 이슈에 @23A91A6183이 서명 hash-chain 증거 로그를 제안했고 설계 검토 대기 중입니다. narwhal#155, #372에서 @ozereray는 tool 권한, 승인, 실행 증거에 대한 검증 제안을 남겼고 둘 다 open입니다. @Lulzx는 kubemetal#84(open)에서 CuMetal 메인테이너로서 문제 제보 시 지원하겠다고 제안했습니다. @iamroseyoung의 narwhal PR #4는 단계별 검증 가이드(`docs/evaluation`)를 더해 병합됐습니다.

## AI 에이전트 팀은 어떻게 일하는가

사람이 목표와 승인을 쥐고, 오케스트레이터가 구현, 비평, 리서치와 생성, 검증 워커에게 일을 나눕니다. 결과는 모두 오케스트레이터로 돌아오는 허브앤스포크 구조이고, 아래에서 린터, CI, 회귀 테스트, lessons-log가 결정적으로 강제합니다. 작성과 검토는 분리하고, 병렬은 최대 5개이며, 같은 파일을 다루는 레인은 worktree로 나눕니다. 지시문은 통제 수단이지 보안 경계가 아닙니다.

### 하루의 실제 흐름

슬라이드는 2026-10-22~23, narwhal v1.3.0 릴리스 직후의 흐름을 공개 GitHub 기록(dasomel.github.io PR #408)으로 보여 줍니다. 공유 클론이 다른 브랜치에 있어 origin/main 기준 격리 worktree에서 문서 6개 파일을 고쳤고, 레인 보고를 그대로 믿지 않고 오케스트레이터가 README 수치를 직접 다시 확인했습니다. `bun test` 17 pass, lint 0 errors, build를 거쳐 CI가 통과했습니다. 여기서 **사람은 배포를 보류하려 했지만 저장소의 자동 머지 워크플로가 먼저 PR #408을 머지했고**, 이어 Pages 배포가 돌았습니다. 사람이 쥘 결정은 자동화 설정까지 포함해 확인해야 한다는 교훈입니다.

### 초록불이 거짓말을 한 순간들

| 겉보기 | 실제 | 얻은 규칙 |
|---|---|---|
| stub 테스트 green | 실제 prjquota 강제는 증명 못 함 | 낮은 증거 등급은 강한 runtime 주장 금지 |
| RuntimeClass YAML이 저장소에 있음 | 실제 sandbox 실행은 아님 | declared, supported, effective, verified로 분리 |
| validator가 실패해도 echo로 성공 표시 | echo-branch false-green | swallowed_failure_detector로 감사 |
| v0.4.0 릴리스 완료처럼 보임 | cosign GHCR 로그인 실패로 partial release | v0.4.1~v0.4.3에서 완전한 릴리스 확인 |
| ext4 quota 적용됨 | root writer가 hard limit 우회 가능 | 한계 문서화, root_squash와 XFS 권고 |

가장 아팠던 실패는 `PASS T03 all ArgoCD apps Synced+Healthy`였는데 실제로는 ArgoCD 앱이 0개였던 일입니다. 이미지를 받지 못해 push가 실패했고 서비스는 503이었습니다. 검사가 거짓말을 한 것이 아니라 응시자가 0명이면 "전원 합격"이 참인 문장이었습니다. 단계 스크립트는 `WARN` 후 계속 진행했고, 고침은 앱 수를 먼저 세고 기준 미만이면 FAIL로 처리하는 것이었습니다(narwhal regression-check T03). 같은 계열로 이 사이트에서 2026-08-07에 276분 늦게 뜬 예약 런이 이미 발행된 다이제스트를 다시 수집(23건에서 18건)해 갈아치웠는데 워크플로는 전부 초록이었던 사고가 있었고, 그래서 관문을 두 겹으로 두고 조용한 no-op을 만들지 않습니다.

## 교훈

네 문장으로 줄이면 AI의 속도를 쓰면서 신뢰성을 지키는 기준이 됩니다.

1. 구현 능력은 실행 권한이 아니다.
2. 완료 주장은 증거가 아니다.
3. 낮은 증거 등급은 더 강한 runtime 성질을 주장하지 못한다.
4. merge된 코드는 검증된 상태가 게시되기 전까지 포트폴리오 완료가 아니다.

에이전트가 구현을 많이 맡을수록 사람의 책임이 없어지는 것이 아니라 위치가 바뀝니다. architecture와 제품 방향, permission과 risk 경계, 증거가 충분한지의 판단, 유지보수성과 커뮤니티, 예외 처리, release와 rollback 결정은 계속 사람이 쥡니다. 목표는 자율 저장소가 아니라 증거로 검증하고 사람의 stewardship 아래 운영하는 것입니다.

## 정리

잇기(Kube-Ready-Box에서 Narwhal, NFS Quota Agent, Portal, ClusterDeck까지), 검증하기(장애는 회귀 검증으로, 에이전트 실행은 resolved invocation 승인으로, 완료는 증거와 게시된 상태로), 남기기(모델은 바뀌어도 규칙, 아키텍처, 테스트, 운영 지식은 저장소에)입니다. 한 문장으로는 단순한 코드 생성이 아니라 검증 가능한 엔지니어링 체계입니다.

## 관련 링크

- [발표자료 바로 보기](https://cne.io.kr/slides/k8s-platform-vertical/#1)
- [OSS 소개](https://cne.io.kr/oss/) · [GitHub](https://github.com/dasomel) · [Narwhal](https://github.com/dasomel/narwhal) · [OpenForge](https://github.com/dasomel/openforge)
- 질문과 이슈는 GitHub Issues로 받습니다.
- 같은 질문을 다른 사례로 다룬 글: [숭실대 특강 후기: AI Agent 시대, 사람은 무엇을 쥐어야 하나](/ko/posts/soongsil-ai-agent-human-developer-2026/)
