# OSS Story Slide Design System

## 목적

OSS Story를 단순한 가로 슬라이드가 아니라 **읽을 수 있는 웹 프레젠테이션**으로 운영하기 위한 전용 디자인 시스템이다. 핵심 목표는 다음 네 가지다.

1. 모든 슬라이드의 정보가 기본 상태에서 충분히 읽혀야 한다.
2. 한 화면에는 하나의 명확한 주장과 그 주장을 뒷받침하는 증거가 우선되어야 한다.
3. 이동·애니메이션은 이해를 돕는 보조 수단이며 콘텐츠 접근을 막아서는 안 된다.
4. 데스크톱, 모바일, 키보드, reduced-motion 환경에서 동일한 콘텐츠 구조를 유지한다.

## 리서치 기준

Apple Human Interface Guidelines의 원칙 중 Purpose, Simplicity, Hierarchy, Flexibility를 기본 기준으로 삼았다. 특히 중요한 내용을 우선하고, 일관된 구조를 유지하며, 플랫폼과 입력 방식에 맞게 적응시키는 원칙을 반영한다.

접근성은 별도 기능이 아니라 기본 레이어로 취급한다. Apple의 접근성 가이드가 강조하는 perceivable, adaptable, intuitive 구조를 기준으로 텍스트 대비, 터치 영역, 키보드 포커스, 큰 텍스트, reduced motion을 설계에 포함한다.

차트와 데이터는 장식보다 정보가 먼저 보이도록 한다. 값은 가장 높은 시각적 우선순위를 갖고, 설명과 출처는 보조 계층으로 둔다.

## Slide anatomy

각 슬라이드는 다음 구조를 기본으로 한다.

```text
[deck progress]

[slide index / topic]

EYEBROW

Claim / headline

Short explanation

Primary evidence / diagram / cards

Supporting source or context

[previous] [next]
```

### 1. Eyebrow

- 9–11px 정도의 mono 계열
- 대문자 또는 짧은 분류명
- accent 색 사용
- 문장보다 **좌표** 역할을 한다.

### 2. Headline

- 한 슬라이드당 하나의 주장
- 최대 2–3줄
- `text-wrap: balance`
- 화면 폭에 따라 유동적으로 축소
- 장식보다 의미 전달을 우선

### 3. Lead

- headline의 의미를 1–2문장으로 보충
- 최대 폭을 제한해 읽기 길이를 짧게 유지
- 본문보다 확실히 작지만 카드 설명보다 크게 유지

### 4. Evidence

슬라이드의 핵심 콘텐츠다.

- 숫자: 큰 값 + 짧은 label + 작은 source
- 구조: node → relation → outcome
- 비교: 2개 또는 3개 축
- 저장소: 이름 → 역할 → 설명 → repository action

카드는 정보의 단위를 분리하기 위한 장치이지 모든 요소를 박스에 넣기 위한 장식이 아니다.

## Layout tokens

| Token | Rule |
|---|---|
| Content width | 최대 1240px |
| Desktop gutter | `clamp(24px, 6vw, 88px)` |
| Mobile gutter | 16–20px |
| Control size | 최소 44px |
| Slide radius | 18–34px 범위에서 역할에 따라 사용 |
| Eyebrow | 9–11px mono |
| Lead | 약 17–22px |
| Body | 12–16px |
| Source | 9–11px |
| Progress | 4px |

44px 터치 타깃은 모바일 입력에서도 탐색 컨트롤이 충분히 눌리도록 유지한다.

## Visual hierarchy

우선순위는 다음 순서를 지킨다.

```text
1. Claim
2. Evidence
3. Interpretation
4. Source / metadata
5. Decorative motion
```

후순위 요소가 상위 요소보다 시선을 빼앗지 않아야 한다.

특히 데이터 슬라이드에서는 숫자와 핵심 라벨이 가장 먼저 보이고 출처는 한 단계 낮은 대비로 배치한다.

## Surface system

### Light

- Canvas: `var(--bg)`
- Content: `var(--surface)`
- Raised content: `var(--surface-hi)`
- Border: `var(--border)`
- Accent: `var(--accent)`

카드에 그림자를 과하게 쓰지 않는다. border + surface 차이를 기본으로 사용하고 hover에서만 약한 elevation을 허용한다.

### Dark

- Dark editorial slides may use `#0F1718` 계열의 독립된 canvas
- 본문 대비는 muted 수준을 넘겨 읽을 수 있어야 한다.
- accent는 주요 신호에만 제한적으로 사용한다.

Apple의 material guidance와 같은 관점에서 **기능 계층과 콘텐츠 계층을 섞지 않는다.** 탐색/컨트롤은 떠 있는 layer로, 실제 이야기 콘텐츠는 독립된 content layer로 유지한다.

## Motion system

Motion은 progressive disclosure와 spatial continuity에만 사용한다.

### 허용

- slide-to-slide horizontal snap
- 짧은 reveal / rise
- progress transition
- subtle hover elevation
- architecture line animation

### 금지 또는 최소화

- 콘텐츠를 읽지 못할 정도의 opacity
- 반복적인 큰 scale/pulse
- 빠른 peripheral motion
- 사용자 입력과 무관한 지속적인 화면 이동

중요: **애니메이션이 실패해도 콘텐츠는 읽혀야 한다.**

현재 구현의 `.reveal { opacity: .12 }`와 같이 비활성 상태에서 콘텐츠를 흐리게 만드는 패턴은 기본 접근성 상태로 사용하지 않는다. 콘텐츠는 기본적으로 `opacity: 1`이어야 하고 motion은 enhancement다.

### Reduced motion

`prefers-reduced-motion: reduce`에서는 반복 animation, 자동 이동, 긴 transition을 거의 제거하고 즉시 상태 변화 또는 단순 fade로 대체한다.

## Navigation system

지원 입력:

- 이전/다음 버튼
- ArrowLeft / ArrowRight
- Home / End
- 데스크톱 wheel → slide 이동
- 모바일 native horizontal scrolling / swipe

탐색 버튼은 최소 44px 영역을 확보하고 keyboard focus가 명확해야 한다.

## Responsive behavior

### Desktop

- 한 slide가 viewport의 주요 콘텐츠 영역을 차지
- dense slide는 vertical scroll을 허용
- horizontal snap은 유지
- architecture / metrics는 2–4열을 활용

### Tablet

- 2열을 기본
- 긴 제목과 architecture를 우선적으로 축소
- navigation controls는 유지

### Mobile

- 콘텐츠를 1열 중심으로 재구성
- 카드 grid는 1열
- 제목은 38–64px 범위에서 유동 조정
- deck controls는 화면을 가리지 않는 위치에 고정
- 긴 슬라이드는 세로 스크롤 허용

## Slide-specific patterns

### Hero

한 문장 + 하나의 큰 visual. 부가정보를 과도하게 넣지 않는다.

### Metrics

최대 3개의 핵심 숫자. 숫자 → label → source 순서.

### Complexity

왼쪽에 시스템 stack, 오른쪽에 integration seam 또는 failure boundary.

### License / adoption

2개의 비교 축을 사용하고 한쪽을 시각적으로 우세하게 만들지 않는다.

### Architecture

중앙의 핵심 플랫폼을 기준으로 주변 systems가 연결된다. edge가 많아질 경우 선보다 grouping을 먼저 보여준다.

### Portfolio

Repository name과 역할을 우선 표시한다. 카드마다 설명의 길이를 비슷하게 유지한다.

### Finish

마지막 슬라이드는 주장 → 다음 행동 순서로 마무리한다. CTA는 1개의 primary action과 제한된 secondary action만 둔다.

## QA checklist

- [ ] 첫 화면 외 모든 슬라이드가 기본 상태에서 읽힌다.
- [ ] headline과 evidence의 시각적 우선순위가 명확하다.
- [ ] 44px 이상의 탐색 hit area가 유지된다.
- [ ] 키보드만으로 모든 탐색이 가능하다.
- [ ] `prefers-reduced-motion`에서 과도한 animation이 제거된다.
- [ ] 모바일에서 가로 이동과 세로 읽기가 충돌하지 않는다.
- [ ] dense slide가 viewport 밖 콘텐츠를 숨기지 않는다.
- [ ] 숫자/차트는 label과 source를 함께 제공한다.
- [ ] dark/light 모두에서 muted text가 읽힌다.
- [ ] print mode에서 슬라이드별 page break가 유지된다.

## 적용 범위

현재 규칙은 `components/oss/OssStoryHorizontal.tsx`의 기존 deck class를 보존하면서 `app/[locale]/oss/story/oss-story.module.css`에서 전용 layer로 적용한다. 기존 콘텐츠 구조를 다시 작성하지 않고도 slide readability와 interaction quality를 먼저 개선하는 것을 목표로 한다.
