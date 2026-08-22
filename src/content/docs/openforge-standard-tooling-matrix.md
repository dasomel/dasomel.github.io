---
title: 엔지니어링 도구 매트릭스
description: 프로그래밍 언어별 권장 린터, 포매터 및 빌드 도구 매트릭스.
project: OpenForge
path: openforge/standards/tooling-matrix
order: 1016
lastModified: 2026-08-23
---

# 엔지니어링 도구 매트릭스

OpenForge가 권장하는 언어별 표준 엔지니어링 도구 매트릭스입니다.

| 언어 / 영역 | 린터 (Linter) | 포매터 (Formatter) | 빌드 / 패키지 도구 | 테스트 러너 |
|---|---|---|---|---|
| **Go** | `golangci-lint`, `staticcheck` | `gofumpt` | `go build` | `go test -race` |
| **TypeScript / Node** | `eslint` (Flat Config) | `prettier` | `bun` / `npm` | `bun test` / `vitest` |
| **Python** | `ruff`, `mypy` | `ruff format` | `uv` / `poetry` | `pytest` |
| **Rust** | `clippy` | `rustfmt` | `cargo` | `cargo test` |
| **Kubernetes / IaC** | `kubeconform`, `trivy` | `yamlfmt` | `kustomize`, `helm` | `helm unittest` |
| **Shell / Script** | `shellcheck` | `shfmt` | `bash` (strict mode) | `bats` |

## 원문 및 권위 소스 (Canonical Source)

- [Engineering Tooling Matrix](https://github.com/dasomel/openforge/blob/main/docs/tooling-matrix.md)
