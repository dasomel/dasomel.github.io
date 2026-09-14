---
title: Siqoq 개발 및 검증
description: 현재 실행 가능한 Python 기반과 향후 adapter 구현 원칙.
project: Siqoq
path: siqoq/development
order: 1702
lastModified: 2026-09-14
---

# Siqoq 개발 및 검증

```bash
git clone https://github.com/dasomel/siqoq.git
cd siqoq
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
make verify
```

현재 검증은 semantic event와 CLI 같은 작은 executable core에 집중합니다. 새 runtime이나 device를 추가할 때는 기존 event/action contract를 변경하기보다 adapter로 연결하고, simulation과 실제 장치에서 같은 fixture를 재사용할 수 있어야 합니다.

## 완료 증거

- interface 또는 event schema test
- simulator/recorded input과 실제 adapter의 동일 fixture 결과
- perception → event → decision → action result correlation
- accelerator 경로와 CPU baseline의 기능 동등성
- hardware가 필요한 항목과 mock에서만 검증된 항목의 명시적 구분
