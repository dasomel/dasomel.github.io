---
title: "CI가 FAIL을 출력하고도 성공으로 보고할 수 있다"
description: "OpenForge false-green 탐지기가 `|| true` 패턴에서 구조적으로 다른 두 번째 형태까지 확장된 과정과, 그 과정에서 실제로 잡아낸 narwhal/beluga 버그"
pubDate: 2026-09-24
tags: ["Open Source", "CI/CD", "OpenForge", "Testing", "Platform Engineering", "Evidence"]
featured: false
draft: false
---

CI가 green이라는 것은 "통과했다"는 뜻이어야 합니다. 그런데 OpenForge 하위 OSS 포트폴리오에서 발견된 실제 버그 두 건은 이 가정이 서로 다른 방식으로 깨질 수 있음을 보여줬습니다. 둘 다 테스트가 없어서 생긴 문제가 아니었습니다.

## 첫 번째 형태: 버려지는 exit code

가장 눈에 띄는 버전은 validator의 실패를 의도적으로 버리는 경우입니다.

```bash
markdownlint '**/*.md' || true
```

`markdownlint`가 실제 오류를 찾아도 `|| true`가 exit code를 무조건 `0`으로 덮어쓰기 때문에 셸은 성공을 반환합니다. [OpenForge #71](https://github.com/dasomel/openforge/issues/71)이 추적한 것이 정확히 이 사례였습니다 — narwhal의 `lint.yml`에서 `Markdown Lint (docs)` job이 `main`에 실제 오류를 남기면서도 green을 보고하고 있었습니다.

수정은 [PR #86](https://github.com/dasomel/openforge/pull/86)이었습니다. OpenForge 포트폴리오 감사 스크립트(`templates/scripts/audit-agent-engineering.py`)에 탐지기를 추가해 워크플로 파일, verify 스크립트, `.claude/commands/*.md`를 스캔하고 validator/linter/test/build 명령의 exit status가 무조건 폐기되는 패턴(`|| true`, `|| :`, `; exit 0`)을 찾습니다. 동시에 같은 관용구의 정당한 사용은 오탐으로 잡지 않아야 했습니다 — 결과가 없는 것이 정상인 `grep ... || true`, 또는 이미 실패가 기록된 뒤에 출력하는 진단용 `kubectl get ... || true` 같은 것들입니다. [`tests/test_agent_engineering_audit.py`](https://github.com/dasomel/openforge/blob/main/tests/test_agent_engineering_audit.py)에 참양성·허용 패턴 양쪽의 회귀 픽스처가 있습니다.

## 두 번째 형태: 모든 분기가 무언가를 출력하고 0으로 끝난다

일주일 뒤, 서로 무관한 두 저장소에서 같은 탐지기가 잡지 못하는 다른 실패 형태가 나타났습니다. 이번에는 아무것도 폐기되지 않았습니다 — 스크립트가 자기 결과를 자기 exit code에 애초에 연결한 적이 없었을 뿐입니다.

narwhal의 `Makefile`에 있던 `validate` 타겟이었습니다([#91](https://github.com/dasomel/openforge/issues/91)에서 추적, [narwhal PR #197](https://github.com/dasomel/narwhal/pull/197)에서 수정):

```make
validate:
	@for f in gitops/apps/*.yaml gitops/resources/*.yaml; do \
		yq eval '.' "$$f" > /dev/null && echo "OK: $$f" || echo "FAIL: $$f"; \
	done
```

`&&`/`||` 양쪽 분기 모두 `echo`로 끝나고, `echo`는 항상 성공합니다. 그래서 이 루프는 손상된 GitOps 매니페스트에 `FAIL: <file>`을 출력하면서도 `make validate` 자체는 성공으로 끝났습니다 — `|| true`는 어디에도 없었는데도요. 이 문제는 [OpenForge #54](https://github.com/dasomel/openforge/issues/54)의 skill 성숙도 재현(replay) 작업 중 `narwhal-verification`과 `narwhal-cluster-debug` 스킬을 각각 재현하던 두 개의 독립적인 fresh-session 에이전트가 따로따로 찾아냈습니다.

같은 실패 계열의 변형이 beluga에서도 같은 시기에 발견됐습니다. `make validate`에는 문서상 이미지 태그의 단일 진실 공급원인 `VERSIONS.md`와 실제 Helm 차트가 배포하는 값을 비교하는 검증이 아예 없었고, 그 결과 문서의 `python:3.11-slim`이 실제 배포되는 `python:3.12-slim`과 조용히 어긋나 있었습니다. [beluga PR #128](https://github.com/dasomel/beluga/pull/128)이 이 비교 검증을 추가해 문제를 닫았습니다.

[PR #92](https://github.com/dasomel/openforge/pull/92)는 `templates/scripts/swallowed_failure_detector.py`를 확장해 narwhal 형태를 잡도록 했습니다: 알려진 validator의 결과를 보고하는 조건문(`&&`/`||`, 또는 `if/else`)의 모든 분기가 그 자체로 성공하는 명령으로 끝나고, 루프 이후 어디에도 `exit $fail`이 없는 경우입니다. #71에서 만든 validator-program 분류를 재사용해서 임의의 `echo` 사용에는 반응하지 않도록 했고, yq의 `... > /dev/null` 문법 검사 관용구만 좁게 validator 호출로 취급해서 일반적인 yq 데이터 조회까지 오분류하지 않게 했습니다.

## 증거로 남길 가치가 있는 리뷰 발견

PR #92의 exit-status 전파 검사 첫 버전에는 자체 버그가 있었습니다. `exit $fail`을 뒤에서 찾는 스캔이 "이 Makefile 타겟" 또는 "이 셸 함수"라는 경계 개념 없이 파일 끝까지 그대로 진행됐습니다. 그래서 타겟 A에 버그가 있고 타겟 B에 무관한 `exit $$rc`가 있는 두-타겟 Makefile에서는 A의 진짜 findings가 조용히 억제됐습니다. 이 버그는 PR을 push하기 전 독립적인 리뷰 단계에서 발견됐고, 수정 — Makefile은 다음 탭 없는 줄에서, 셸 스크립트는 다음 함수 정의에서 멈추는 공유 `_block_tail()` 헬퍼 — 은 같은 PR 안에서 이 정확한 cross-target false negative를 재현하는 회귀 테스트 두 개와 함께 반영됐습니다.

```text
$ python3 -m pytest -q
207 passed, 4 subtests passed
```

## 포트폴리오 스캔이 실제로 찾아낸 것

확장된 탐지기로 포트폴리오 매트릭스(`portfolio/agent-audit.json`)를 다시 생성한 [OpenForge PR #96](https://github.com/dasomel/openforge/pull/96) 이후, 추적 대상 저장소 전체의 false-green 개수는 0에서 12로 늘었습니다 — narwhal 하나가 4건, beluga·beluga-manager·kubemetal·clusterdeck·ldapium·nfs-quota-agent·egovframe-launcher·siqoq에 각각 1건씩입니다.

이 글을 쓰는 시점에도 narwhal의 4건 중 2건은 아직 열려 있습니다. `.claude/commands/check.md`와 `.claude/commands/verify.md`는 여전히 문서화된 검증 절차 안에 같은 `yq eval ... > /dev/null && echo "OK: $f" || echo "FAIL: $f"` 패턴을 그대로 담고 있고, 그 패턴이 나왔던 원본 Makefile 타겟은 고쳐졌는데도 이쪽은 아직 고쳐지지 않았습니다. 이것이 지금 포트폴리오의 정직한 상태입니다 — 문제가 발견된 곳 전부에서 해결됐다는 주장이 아니라, 탐지기의 역할은 해결될 때까지 그것을 계속 눈에 보이게 두는 것입니다.

## 버그가 아니라 패턴

두 형태 모두 특별히 이국적이지 않습니다. 둘 다 "스크립트가 맞는 것을 출력한다"를 "스크립트가 맞는 것을 반환한다"와 동일하게 취급한 것이고, 그 코드는 사람이 작성했고 사람이 리뷰했습니다. 실패할 수 없는 validator는 validator가 아니라 validator 이름을 달고 있는 print문일 뿐이고, 커지는 포트폴리오에서 이 구분을 계속 정직하게 유지하는 유일한 방법은 diff 자체가 스스로 보고할 수 없는 다른 모든 것과 똑같이, 이것도 확인하는 것뿐입니다.
