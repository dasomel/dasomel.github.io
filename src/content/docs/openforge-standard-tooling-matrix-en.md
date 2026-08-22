---
title: Engineering Tooling Matrix
description: Recommended linters, formatters, and build tools per programming language.
project: OpenForge
path: openforge/standards/tooling-matrix
order: 1016
lastModified: 2026-08-23
---

# Engineering Tooling Matrix

Recommended engineering tooling matrix across major programming languages and domains:

| Language / Domain | Linter | Formatter | Build / Package | Test Runner |
|---|---|---|---|---|
| **Go** | `golangci-lint`, `staticcheck` | `gofumpt` | `go build` | `go test -race` |
| **TypeScript / Node** | `eslint` (Flat Config) | `prettier` | `bun` / `npm` | `bun test` / `vitest` |
| **Python** | `ruff`, `mypy` | `ruff format` | `uv` / `poetry` | `pytest` |
| **Rust** | `clippy` | `rustfmt` | `cargo` | `cargo test` |
| **Kubernetes / IaC** | `kubeconform`, `trivy` | `yamlfmt` | `kustomize`, `helm` | `helm unittest` |
| **Shell / Scripts** | `shellcheck` | `shfmt` | `bash` (strict mode) | `bats` |

## Canonical Source

- [Engineering Tooling Matrix](https://github.com/dasomel/openforge/blob/main/docs/tooling-matrix.md)
