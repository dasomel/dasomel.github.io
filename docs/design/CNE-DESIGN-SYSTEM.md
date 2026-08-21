# CNE Design System

## Purpose

CNE is an engineering workbench, not a generic SaaS landing page. The interface should communicate open-source engineering, evidence, architecture, and technical depth with a restrained editorial visual language.

## Brand principles

1. **Engineering first** — visuals support technical content instead of decorating it.
2. **Editorial hierarchy** — use strong typography and whitespace before adding boxes, gradients, or motion.
3. **Quiet surfaces** — cards and navigation use clear surface layers with thin borders; avoid floating white rectangles on dark backgrounds.
4. **One accent** — teal is the primary accent. Supporting colors should remain neutral unless a specific technical state requires otherwise.
5. **Evidence over ornament** — diagrams, code, architecture, repository activity, and project artifacts are preferred hero visuals.
6. **Motion with purpose** — use small transitions, scroll reveals, and one meaningful visual motion element rather than many competing animations.

## Color tokens

The system intentionally separates canvas, surfaces, borders, and text by perceptual contrast. Similar colors must not be used for adjacent semantic layers merely to keep the palette visually quiet.

### Light

- `--bg`: `#f5f7f5` — page canvas
- `--bg-subtle`: `#e9efec` — navigation / secondary shell
- `--surface`: `#ffffff` — cards and primary surfaces
- `--surface-hi`: `#e4ebe8` — selected / secondary surface
- `--border`: `#6f837a` — visible default border; at least 3:1 against the page canvas
- `--border-soft`: `#c5d1cb` — low-emphasis divider
- `--border-hi`: `#4d6158` — emphasized border
- `--text`: `#111613` — primary text
- `--text-muted`: `#34433d` — readable secondary text
- `--text-faint`: `#63716b` — metadata / tertiary text
- `--accent`: `#08786f`
- `--code-bg`: `#e8efeb` — documentation/code surface
- `--code-fg`: `#1b2621` — code/plain-text foreground
- `--code-border`: `#6f837a` — visible code surface boundary

### Dark

- `--bg`: `#090e0d`
- `--bg-subtle`: `#101816`
- `--surface`: `#18211e`
- `--surface-hi`: `#23302b`
- `--border`: `#6b8077` — visible default border; at least 3:1 against the canvas
- `--border-soft`: `#3b4c45` — low-emphasis divider
- `--border-hi`: `#81968d` — emphasized border
- `--text`: `#f1f7f4`
- `--text-muted`: `#c0ccc6`
- `--text-faint`: `#91a099`
- `--accent`: `#62e3d7`
- `--code-bg`: `#0d1411` — documentation/code surface
- `--code-fg`: `#eef6f2` — code/plain-text foreground
- `--code-border`: `#6b8077` — visible code surface boundary

## Contrast rules

- WCAG 2.2 AA requires at least **4.5:1 for normal text** and **3:1 for large text**. citeturn629156search2
- WCAG 2.2 also requires **3:1 non-text contrast** for essential component boundaries and states. citeturn629156search3
- Primary body text must remain visually strong against both `bg` and `surface`.
- Secondary text must be clearly darker than the surface in Light mode and clearly lighter than the surface in Dark mode.
- Cards and documentation boxes must be distinguishable from the page canvas by **both fill and border**; do not rely on a subtle shadow alone.
- Default borders used to communicate a component boundary should target at least 3:1 against the adjacent canvas. This is intentionally stronger than the previous quiet-border palette.
- Adjacent surfaces should not differ only by a few RGB levels.
- Box content should use `text` or `text-muted`, never `text-faint`, for primary explanatory prose.
- Accent is for emphasis, links, focus, and hero highlights; it is not a substitute for body text.
- Validate Light and Dark separately. A palette that works in one mode may require a different value in the other mode.
- Treat focus indicators separately from ordinary borders; WCAG guidance recommends a visible focus treatment with sufficient contrast, and the change in appearance should reach 3:1. citeturn629156search1

## Surface hierarchy

Use these levels consistently:

`bg` → page/canvas

`bg-subtle` → shell/sidebar/navigation

`surface` → cards, panels, primary controls

`surface-hi` → selected item, badge fill, active navigation, secondary controls

`code-bg` → code, lifecycle examples, command output, operational evidence

Do not use fixed `bg-white`, `bg-gray-*`, or fixed light hex backgrounds inside shared components.

## Box readability

Documentation boxes are information containers, not decoration. Every box should establish three distinct visual roles:

1. **Surface** — clearly separated from the page canvas.
2. **Text** — readable without depending on the border or accent color.
3. **Boundary** — visible enough that the box remains legible without hover or shadow.

For code/lifecycle examples, use `code-bg` + `code-fg` + `code-border`. For explanatory callouts, use `surface-hi` + `text-muted` with an accent or semantic border only where it conveys meaning.

Avoid pale text on pale surfaces, dark text on near-black surfaces, and one-pixel borders whose contrast is too weak to communicate grouping.

## Typography

- Sans: Pretendard Variable
- Mono: JetBrains Mono
- Hero eyebrow: small uppercase monospace
- Hero headline: large editorial sans, tight tracking
- Body: readable 16–18px with generous line height
- Metadata: muted monospace or compact sans

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

### Tables

- Use `surface` for the table body and `surface-hi` for the header row.
- Use a visible outer border and internal dividers.
- Header and body text must use `text`, not `text-faint`.
- Avoid tables where the only distinction between rows is a barely visible divider.

### OSS Documentation

- Hub uses project cards as the primary navigation objects.
- Project pages use a quiet documentation shell.
- `On this page` is a navigation aid, not a decorative card.
- Project identity comes from typography, metadata, diagrams, and architecture visuals rather than heavy branded chrome.

## Hero direction

The home hero borrows the composition principles of modern editorial documentation heroes while remaining CNE-specific. VitePress demonstrates a strong hero-name/text/tagline/action hierarchy, while its theme is controlled through explicit CSS variables. Docusaurus similarly separates theme palettes and recommends WCAG-AA contrast; CNE follows the same principle without copying their implementation. citeturn886154search0turn886154search4

- short technical eyebrow
- strong two-line message
- concise supporting copy
- two or fewer CTAs
- one wide engineering visual
- visual fade into the next section
- accent color reserved for one focal phrase or action
- strong background/surface separation around the visual

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
4. Do not introduce a new accent color without a documented reason.
5. Do not copy a third-party component implementation; use the design idea and implement it with CNE's own tokens/components.
6. Verify both Light and Dark themes before merging.
7. Keep copy controls restricted to code blocks.
8. Check visual contrast for cards, sidebars, headers, buttons, tables, callouts, and code surfaces in both themes.
