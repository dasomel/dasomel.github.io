---
title: "Harbor Multi-Arch"
description: "Harbor 컨테이너 레지스트리를 fork하여 멀티아키텍처(AMD64/ARM64) 빌드를 지원하도록 수정"
github: "https://github.com/dasomel/harbor"
tags: ["Container Registry", "Multi-Arch", "ARM64", "Security"]
order: 3
type: "fork"
---

## 프로젝트 소개

[Harbor](https://goharbor.io/)는 CNCF Graduated 프로젝트로, 컨테이너 이미지를 저장하고 배포하는 오픈소스 레지스트리입니다.

이 프로젝트는 **Harbor 공식 저장소를 fork**하여 멀티아키텍처(AMD64/ARM64) 빌드와 소프트웨어 공급망 보안 기능을 추가한 버전입니다.

## Fork 배경

공식 Harbor는 AMD64 아키텍처만 공식 지원하고 있어, ARM64 기반 환경(Apple Silicon, AWS Graviton 등)에서 사용하기 어려웠습니다. 이 fork는 다음을 목표로 합니다:

- ARM64 네이티브 지원으로 다양한 플랫폼에서 Harbor 실행 가능
- 최신 보안 표준(SBOM, SLSA, Cosign) 적용
- 공식 릴리스와 지속적인 동기화 유지

## 주요 수정 사항

### 멀티 아키텍처 빌드
- **AMD64/ARM64 동시 빌드**: Docker buildx를 활용한 멀티플랫폼 이미지 생성
- **통합 매니페스트**: 단일 이미지 태그로 여러 아키텍처 자동 선택
- **ARM64 최적화**: Apple Silicon, AWS Graviton, Raspberry Pi 지원

### 소프트웨어 공급망 보안
- **SBOM (Software Bill of Materials)**: Syft를 활용한 컨테이너 이미지 구성요소 목록 생성
- **SLSA 빌드 증명**: GitHub Actions를 통한 빌드 프로세스 무결성 증명
- **Cosign OIDC 키리스 서명**: GitHub OIDC를 활용한 키리스 이미지 서명

### CI/CD 개선
- **GitHub Actions 워크플로우 최적화**: 릴리스 태그 기반 빌드 트리거
- **자동 업스트림 동기화**: fork 전용 파일의 머지 충돌 자동 해결
- **ghcr.io 이미지 레지스트리**: Docker Hub 대신 GitHub Container Registry 사용

## 빌드 파이프라인

```yaml
# GitHub Actions 워크플로우
- name: Build and Push
  steps:
    - Docker buildx (AMD64 + ARM64)
    - Trivy 취약점 스캔
    - Syft SBOM 생성
    - Cosign 서명
    - SLSA Provenance 생성
```

## 사용 방법

이미지는 공식 Helm 차트와 호환되는 명명 규칙을 따릅니다.

```bash
# Harbor 이미지 Pull (아키텍처 자동 선택)
docker pull ghcr.io/dasomel/goharbor/harbor-core:v2.12.0
docker pull ghcr.io/dasomel/goharbor/harbor-portal:v2.12.0
docker pull ghcr.io/dasomel/goharbor/harbor-registryctl:v2.12.0
docker pull ghcr.io/dasomel/goharbor/harbor-jobservice:v2.12.0

# Trivy 어댑터
docker pull ghcr.io/dasomel/goharbor/trivy-adapter-photon:v2.12.0
```

## 업스트림 동기화

이 fork는 Harbor 공식 저장소와 자동으로 동기화됩니다. 업스트림 변경사항은 자동으로 반영되며, fork 전용 수정 사항은 별도로 관리됩니다.

| 버전 | AMD64 | ARM64 | 업스트림 |
|------|-------|-------|----------|
| v2.12.x | ✅ | ✅ | goharbor/harbor v2.12 |
| v2.11.x | ✅ | ✅ | goharbor/harbor v2.11 |
| v2.10.x | ✅ | ✅ | goharbor/harbor v2.10 |

## 주요 변경 이력

자세한 변경 이력은 [FORK_CHANGES.ko.md](https://github.com/dasomel/harbor/blob/main/FORK_CHANGES.ko.md)를 참조하세요.

## 기여 및 이슈

- 버그 리포트나 기능 제안은 [Issues](https://github.com/dasomel/harbor/issues)에 등록해 주세요
- ARM64 관련 이슈는 이 fork에서, 일반적인 Harbor 이슈는 [공식 저장소](https://github.com/goharbor/harbor)에 등록해 주세요
