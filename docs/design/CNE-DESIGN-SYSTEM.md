# CNE Design System

## Purpose

CNE is an engineering workbench, not a generic SaaS landing page. The interface should communicate open-source engineering, evidence, architecture, and technical depth with a restrained editorial visual language.

## Brand principles

1. **Engineering first** — visuals support technical content instead of decorating it.
2. **Editorial hierarchy** — use strong typography and whitespace before adding boxes, gradients, or motion.
3. **Quiet surfaces** — cards and navigation use clear surface layers with thin borders; avoid floating white rectangles on dark backgrounds.
4. **One accent** — teal is the primary brand accent. Amber is reserved for semantic signals and evidence states, not branding.
5. **Evidence over ornament** — diagrams, code, architecture, repository activity, and project artifacts are preferred hero visuals.
6. **Motion with purpose** — use small transitions, scroll reveals, and one meaningful visual motion element rather than many competing animations.

## Inspiration and licensing

The palette refresh borrows visual principles rather than source code from permissively licensed Tailark blocks. Tailark's public blocks repository is MIT licensed. The CNE implementation is original: no Tailark source, proprietary assets, or premium Hero 16 implementation is copied into CNE.

The useful ideas are:

- warm neutral canvas instead of a pure-white page
- bright primary surfaces for content grouping
- strong graphite text hierarchy
- restrained accent color with a clear semantic role
- proof/evidence surfaces that remain visually light rather than turning every box into a dark card

Other "Hero 16" implementations were intentionally not used as direct source material because several are PRO/commercial blocks with redistribution restrictions.

## Color tokens

The palette intentionally separates canvas, surfaces, evidence panels, borders, and text. The visual goal is a light editorial workbench with enough contrast that technical content remains easy to scan.

### Light

- `--bg`: `#f8f7f3` — warm page canvas
- `--bg-subtle`: `#efefeb` — navigation / secondary shell
- `--surface`: `#ffffff` — cards and primary surfaces
- `--surface-hi`: `#f0f3f0` — selected / secondary surface
- `--border`: `#c2cbc6` — visible default boundary
- `--border-soft`: `#dfe3df` — low-emphasis divider
- `--border-hi`: `#89958f` — emphasized boundary
- `--text`: `#171c19` — primary text
- `--text-muted`: `#4f5b55` — readable secondary text
- `--text-faint`: `#717b76` — metadata / tertiary text
- `--accent`: `#0f766e` — primary brand accent
- `--accent-strong`: `#0b5f59` — accent on high-emphasis states
- `--accent-dim`: `rgba(15,118,110,0.10)` — subtle accent surface
- `--signal`: `#b45309` — semantic evidence/warning signal only
- `--signal-dim`: `rgba(180,83,9,0.10)`
- `--code-bg`: `#f0f3f0` — code and lifecycle surface
- `--code-fg`: `#18201c` — code/lifecycle foreground
- `--code-border`: `#aab5af` — code/lifecycle boundary
- `--doc-panel-bg`: `#f2f4f1` — explanatory callout surface
- `--doc-panel-fg`: `#1b241f` — explanatory callout foreground
- `--doc-panel-border`: `#b7c2bc` — explanatory callout boundary
- `--doc-panel-header`: `#e7ebe8` — table header surface

### Dark

- `--bg`: `#0d1110`
- `--bg-subtle`: `#151b19`
- `--surface`: `#171e1b`
- `--surface-hi`: `#202a26`
- `--border`: `#46554f`
- `--border-soft`: `#2d3934`
- `--border-hi`: `#718078`
- `--text`: `#f3f6f4`
- `--text-muted`: `#c3cec8`
- `--text-faint`: `#98a39e`
- `--accent`: `#63d8cc`
- `--accent-strong`: `#86e7dd`
- `--accent-dim`: `rgba(99,216,204,0.13)`
- `--signal`: `#f0a45b`
- `--signal-dim`: `rgba(240,164,91,0.14)`
- `--code-bg`: `#141c19`
- `--code-fg`: `#f0f6f2`
- `--code-border`: `#596861`
- `--doc-panel-bg`: `#1b2521`
- `--doc-panel-fg`: `#edf4f0`
- `--doc-panel-border`: `#586960`
- `--doc-panel-header`: `#25312c`

## Contrast rules

- WCAG 2.2 AA requires at least **4.5:1 for normal text** and **3:1 for large text**.
- WCAG 2.2 also requires **3:1 non-text contrast** for essential component boundaries and states.
- Primary body text must remain visually strong against both `bg` and `surface`.
- Secondary text must be clearly darker than the surface in Light mode and clearly lighter than the surface in Dark mode.
- Cards and documentation boxes must be distinguishable from the page canvas by both fill and border.
- Default component boundaries should be visible without hover or shadow.
- Adjacent surfaces should not differ only by a few RGB levels.
- Box content should use `text` or `text-muted`, never `text-faint`, for primary explanatory prose.
- Accent is for brand emphasis, links, focus, and hero highlights; it is not a substitute for body text.
- `signal` is semantic only and must never become a second brand accent.
- Validate Light and Dark separately.

## Surface hierarchy

Use these levels consistently:

`bg` → page/canvas

`bg-subtle` → shell/sidebar/navigation

`surface` → cards, panels, primary controls

`surface-hi` → selected item, badge fill, active navigation, secondary controls

`code-bg` → code, lifecycle examples, command output, operational evidence

`doc-panel-bg` → explanatory callouts

`doc-panel-header` → table headers and structured evidence summaries

Do not use fixed `bg-white`, `bg-gray-*`, or arbitrary light hex backgrounds inside shared components.

## Box readability

Documentation boxes are information containers, not decoration. Every box should establish three distinct visual roles:

1. **Surface** — clearly separated from the page canvas.
2. **Text** — readable without depending on the border or accent color.
3. **Boundary** — visible enough that the box remains legible without hover or shadow.

For code/lifecycle examples, use `code-bg` + `code-fg` + `code-border`. For explanatory callouts, use `doc-panel-bg` + `doc-panel-fg` with an accent or semantic border only where it conveys meaning. For tables, use `surface` + `doc-panel-header` + visible outer and internal dividers.

The renderer must explicitly inherit CNE theme colors. Generic Typography theme palettes must not override the CNE documentation contract.

## Typography

- Sans: Pretendard Variable
- Mono: JetBrains Mono
- Hero eyebrow: small uppercase monospace
- Hero headline: large editorial sans, tight tracking
- Body: readable 16–18px with generous line height
- Metadata: muted monospace or compact sans
- Documentation prose: approximately 16px with 1.8 line-height for dense technical content
- Box/code text should not be reduced merely to make containers look quieter

## Layout

- Desktop content width: approximately 1180–1440px depending on documentation depth.
- Prefer generous horizontal whitespace.
- Documentation uses three-column layout: navigation / content / on-page navigation.
- Sidebar width should stay visually light; avoid heavy vertical chrome.

## Components

### Header

- Persistent theme-aware surface.
- One language switch and one theme switch.
- Navigation uses `surface-hi` for active states.
- Avoid transparent header states that reduce contrast against hero artwork.

### Cards

- Use `surface` + `border`.
- Rounded corners are moderate, not excessive.
- Shadows are subtle and primarily used on hover.
- A card is for grouping meaningful information, not every small UI element.

### Code blocks

- Copy button belongs only to executable/code blocks (`pre > code`).
- Never add copy controls to ordinary cards, badges, tables, or text boxes.
- Use dual-theme syntax highlighting.
- Keep code background visually distinct from surrounding surfaces.
- Plain lifecycle examples and operational sequences use the same `code-bg` / `code-fg` / `code-border` treatment as code blocks.
- Plain lifecycle blocks render as solid `code-fg` text rather than relying on faint syntax colors.

### Tables

- Use `surface` for the table body and `doc-panel-header` for the header row.
- Use a visible outer border and internal dividers.
- Header and body text must use `text`, not `text-faint`.
- Avoid tables where the only distinction between rows is a barely visible divider.

### OSS Documentation

- Hub uses project cards as the primary navigation objects.
- Project pages use a quiet documentation shell.
- `On this page` is a navigation aid, not a decorative card.
- Project identity comes from typography, metadata, diagrams, and architecture visuals rather than heavy branded chrome.
- Korean and English documentation pages must use the same theme-aware typography and surface rules.

## Hero direction

The home hero borrows the composition principles of modern editorial documentation heroes while remaining CNE-specific. The palette refresh adds a warmer canvas, strong graphite headline, restrained teal action color, and a proof-oriented visual band. The visual hierarchy should communicate what CNE is before the visitor scrolls.

- short technical eyebrow
- strong two-line message
- concise supporting copy
- two or fewer CTAs
- one wide engineering visual
- visual fade into the next section
- accent color reserved for one focal phrase or action
- evidence visuals should use light surfaces with explicit boundaries

Preferred visuals include architecture diagrams, repository/project relationships, Kubernetes flows, GitOps pipelines, OSS maps, and engineering evidence.

## Motion

Use motion selectively:

- 150–250ms UI transitions
- reduced-motion support is mandatory
- one major animated/interactive visual per page is enough
- avoid constant floating, excessive parallax, and decorative cursor effects

## AI design handoff

When asking an AI design or coding system to modify CNE:

1. Read this document first.
2. Preserve the color, surface, typography, and spacing tokens.
3. Reuse existing components before creating new variants.
4. Do not introduce a new brand accent color without a documented reason.
5. Do not copy third-party source code or proprietary blocks; use permissively licensed design ideas and implement CNE-specific tokens/components.
6. Verify both Light and Dark themes before merging.
7. Keep copy controls restricted to code blocks.
8. Check visual contrast for cards, sidebars, headers, buttons, tables, callouts, lifecycle blocks, and code surfaces in both themes.
