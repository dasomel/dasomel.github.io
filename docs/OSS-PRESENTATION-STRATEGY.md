# OSS Presentation Strategy

This document records how cne.io.kr presents the OSS portfolio without changing the technical independence of each repository.

## Positioning

**Cloud Native · Platform Engineering · AI Infrastructure**

The OSS area is an engineering ecosystem, not a repository directory. Public pages prioritize evidence from source, tests, releases, architecture and operations over marketing claims.

## Project hierarchy

| Project | Ecosystem role | Presentation depth |
|---|---|---|
| Narwhal | Flagship Platform | Full product + documentation system |
| NFS Quota Agent | Reusable Component | Full problem/architecture/operations page |
| KubeMetal | Emerging / Cloud-native AI | Product + architecture + workflow |
| OpenForge | Engineering Foundation | Standards + cross-project practice |
| Other projects | Supporting systems | Focused overview + source-driven docs |

## Independence rule

Sharing an ecosystem does not imply runtime coupling or ownership coupling. Components should remain independently installable, testable and releasable where their architecture allows it.

## Page contract

A mature project landing page should answer, in this order:

1. What is it?
2. Why does it exist?
3. What is its role in the ecosystem?
4. How is it different?
5. What does the architecture look like?
6. What engineering evidence exists?
7. How do I try or install it?
8. How is it operated and upgraded?
9. What is the current status and roadmap?
10. Where are the repository and contribution paths?

README files remain developer/contributor entry points. cne.io.kr/oss is the product, architecture, evidence and documentation surface.

## Design rule

Use the site's existing design tokens and light/dark theme as the implementation source of truth. Figma is the shared visual specification and exploration surface, not a second CSS design system.

## Evidence rule

Numbers and claims must come from repository artifacts or automated metadata whenever possible. Prefer reproducible facts such as test counts, documented incidents, release history, supported environments and verification workflows.
