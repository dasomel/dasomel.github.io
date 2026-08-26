# Visual Storytelling System

Issue #250 adds a visual explanation layer on top of the OSS Workbench design system.

## Components
- `ArchitectureDiagram`: responsive, accessible execution-flow diagrams for Narwhal, KubeMetal, Beluga, NFS Quota Agent, and OpenForge.
- `EcosystemInfographic`: Home-level map of how the OSS projects relate.
- `EngineeringJourneyInfographic`: Story-level evolution from framework/community work to DevOps, Cloud Native, Platform Engineering, OSS/AI, and teaching.
- `ProjectVisual`: compact at-a-glance visual evidence for featured projects.
- `ProjectArchitectureImage`: durable repository-managed project visual where an image asset adds value.
- `BrandMark`: compact connected-D identity shared by the header and favicon family.

## Principles
1. Explain before decorate.
2. Keep architecture claims grounded in project README/docs.
3. Mobile diagrams become vertical flows; no horizontal overflow.
4. Use semantic site tokens and preserve light/dark readability.
5. Prefer SVG and accessible HTML over large raster images.
6. Use real screenshots only when they provide durable engineering evidence; avoid generic stock imagery.
7. Every meaningful image has alt text and/or a figure caption.

## Brand assets
- `/icon.svg`: compact favicon
- `/icon-v2.svg`: app/touch icon
- `/icon-maskable.svg`: PWA safe-zone icon
- `/og-workbench.svg`: 1200×630 social card
- `/images/brand/connected-d.svg`: reusable brand mark
- `/images/projects/narwhal/platform-map.svg`: Narwhal architecture overview
