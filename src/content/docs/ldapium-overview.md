---
title: ldapium 개요
description: 업스트림 소스 컴파일 기반 OpenLDAP 2.6 서버 및 Zero-Default 보안 철학.
project: ldapium
path: ldapium/overview
order: 1700
lastModified: 2026-08-23
---

# ldapium 개요

**ldapium**은 OpenLDAP 2.6 공식 소스 코드를 바탕으로 직접 컴파일하여 생성된 경량·고보안 OpenLDAP 서버 이미지, 현대적 웹 관리 UI 및 Kubernetes 배포용 Helm 차트로 구성된 오픈소스 디렉토리 솔루션입니다.

## 핵심 엔지니어링 원칙

1. **Zero Default Passwords**: 초기 관리자 비밀번호가 이미지에 하드코딩되지 않으며, 환경변수나 시크릿으로만 주입 가능합니다.
2. **Zero Bundled Sample Data**: 불필요한 샘플 데이터가 전혀 포함되지 않은 순수한 베이스라인을 제공합니다.
3. **업스트림 소스 직접 컴파일**: 투명한 Dockerfile 빌드 과정을 통해 공급망 보안을 보장합니다.
