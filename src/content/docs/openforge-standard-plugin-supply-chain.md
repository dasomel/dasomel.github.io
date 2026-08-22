---
title: Plugin Supply-Chain Intake Standard
description: 외부 plugin, skill, hook, script의 안전한 intake와 검증 모델.
project: OpenForge
path: openforge/standards/plugin-supply-chain
order: 1015
lastModified: 2026-08-22
---

# Plugin Supply-Chain Intake Standard

OpenForge는 외부 plugin, skill, hook, script, repository를 **명시적인 intake 검증 전까지 untrusted executable input**으로 취급합니다.

## 신뢰 모델

이름, 조직, star, publisher 정보만으로 신뢰를 결정하지 않습니다. 최소한 source identity, content integrity, dependency integrity, executable behavior를 독립적으로 확인합니다.

## Intake evidence

```yaml
source:
  repository: <repository>
  revision: <immutable-commit>
content:
  digest: sha256:<digest>
assessment:
  static_policy: pass
  network_policy: restricted
  approved_by: <policy-or-maintainer>
```

## 정적 검사

install hook, remote code download, dynamic execution, credential 접근, 예상 밖 filesystem/network 사용, persistence, 난독화 payload 등을 검사합니다.

## 격리와 폐기

가능하면 credential 없이 설치/검증하고 network allowlist와 filesystem boundary를 사용합니다. 문제가 발견되면 quarantine → 차단 → 영향 확인 → known-good revision 복구 → 재검증 순서로 처리합니다.

## Offline catalog

Air-gapped 환경에서는 immutable revision과 digest를 trusted catalog에 기록하고 catalog에 없거나 digest가 일치하지 않는 plugin은 fail-closed하는 것을 기준으로 합니다.

## Canonical source

[Plugin Supply-Chain Intake Standard](https://github.com/dasomel/openforge/blob/main/docs/plugin-supply-chain.md)