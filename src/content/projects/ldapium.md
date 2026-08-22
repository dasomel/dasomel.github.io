---
title: "ldapium"
description: "업스트림 소스 직접 컴파일 기반 OpenLDAP 2.6 서버, 웹 관리 UI 및 Helm 차트"
github: "https://github.com/dasomel/ldapium"
tags: ["LDAP", "OpenLDAP", "Kubernetes", "Helm", "Security", "Docker", "Air-Gap"]
order: 12
type: "own"
featured: true
problem: "공개된 다수 OpenLDAP 컨테이너 이미지는 하드코딩된 기본 관리자 비밀번호, 불필요한 샘플 데이터, 불투명한 소스 빌드로 인해 보안 취약점과 에어갭 배포 난항을 유발함"
solution: "OpenLDAP 2.6을 업스트림 소스로부터 직접 컴파일하고, 기본 비밀번호 0개(Zero Default Passwords) 원칙과 현대적 웹 UI 및 Helm 차트를 결합한 안전한 엔터프라이즈 디렉토리 솔루션 구축"
---

## 프로젝트 소개

**ldapium**은 OpenLDAP 2.6 공식 소스 코드를 바탕으로 직접 컴파일하여 생성된 경량·고보안 OpenLDAP 서버 이미지, 현대적 웹 관리 UI 및 Kubernetes 배포용 Helm 차트로 구성된 오픈소스 디렉토리 솔루션입니다.

하드코딩된 기본 관리자 패스워드를 완전히 배제하고, 샘플 데이터 없는 순수 베이스라인과 엄격한 라이선스 컴플라이언스를 보장합니다.

### 핵심 기능 및 보안 원칙

- **업스트림 소스 직접 컴파일**: OpenLDAP 2.6 최신 소스로부터 불필요한 모듈을 제거하고 최소 의존성으로 빌드
- **Zero Default Passwords**: 초기 관리자 비밀번호 하드코딩을 원천 금지하고 최초 구동 시 환경변수 또는 Secret으로만 주입
- **현대적 웹 관리 UI**: 직관적인 사용자/그룹 디렉토리 관리, OU 계층 구조 탐색 및 비밀번호 재설정 기능
- **Air-Gap 오프라인 완벽 지원**: 인터넷 연결이 차단된 폐쇄망 환경을 위한 사전 패키징 번들 제공
- **Kubernetes Helm 차트**: TLS/mTLS, PersistentVolumeClaim, ConfigMap이 통합된 프로덕션 매니페스트

---

## 아키텍처 다이어그램

```text
  Clients / SSO (Keycloak, APISIX, Linux PAM)
                       │
                       ▼ ldaps:// (:636) / ldap:// (:389)
  ┌────────────────────────────────────────────────────────┐
  │  ldapium Server (OpenLDAP 2.6 Compiled from Source)   │
  │  - MDB Storage Engine                                  │
  │  - TLS / mTLS Mutual Authentication                    │
  │  - Custom Schema Ingestion (RFC2307bis, POSIX)         │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │  ldapium Web Management UI                             │
  │  - User / Group CRUD                                   │
  │  - Organizational Unit (OU) Tree Explorer              │
  └────────────────────────────────────────────────────────┘
```

---

## 시작하기 (Quickstart)

```bash
# 1. 저장소 클론
git clone https://github.com/dasomel/ldapium.git
cd ldapium

# 2. Docker Compose로 안전하게 로컬 실행
cp .env.example .env
docker compose up -d

# 3. Kubernetes Helm 배포
helm install ldapium ./charts/ldapium -n identity --create-namespace
```

---

## 상세 기술 문서

| 주제 | 문서 링크 | 설명 |
|---|---|---|
| **개요 (Overview)** | [ldapium 개요](/oss/ldapium/overview) | OpenLDAP 2.6 컴파일 및 Zero-Default 보안 철학 |
| **아키텍처 (Architecture)** | [디렉토리 아키텍처](/oss/ldapium/architecture) | MDB 엔진, TLS 암호화 및 Helm 차트 구조 |
| **시작하기 (Getting Started)** | [설치 및 배포 가이드](/oss/ldapium/getting-started) | Docker Compose 및 Helm 차트 배포 절차 |
| **에어갭 배포 (Air-Gap)** | [오프라인 번들 가이드](/oss/ldapium/air-gap) | 폐쇄망 설치를 위한 아티팩트 번들링 |
| **운영 가이드 (Operations)** | [운영 및 백업/복구](/oss/ldapium/operations) | TLS 인증서 교체, `slapcat`/`slapadd` 백업 |
