# Architecture Diagram System

This document defines how architecture visuals are authored across cne.io.kr / dasomel Open Engineering Lab.

## Source of truth

- **Figma** defines the visual grammar, hierarchy, terminology, and presentation-grade reference architecture.
- **Mermaid in MDX** is the documentation-native implementation for architecture relationships, flows, sequences, lifecycle, HA/failover, GitOps, identity, storage, networking, and verification paths.
- **Code blocks** remain the right format for literal CLI output, logs, directory trees, configuration, and examples whose exact text is the evidence.

Figma design source: `Dasomel Engineering Lab — V3` → `V5.2 — Diagram System` / `V5.3 — Mermaid Migration Map`.

## Visual grammar

1. Show responsibilities and boundaries before product logos.
2. Use one dominant flow direction per diagram.
3. Main data/control paths use solid arrows; secondary dependencies such as identity, orchestration, evidence, or feedback use dotted arrows when useful.
4. Prefer explicit role labels on edges over decorative boxes.
5. Group components only when the group represents a real boundary such as a cluster, execution plane, sync wave, or agent capability.
6. Keep labels short enough to remain readable on mobile.
7. Do not encode meaning only through color; diagrams must remain understandable in light/dark themes and grayscale.

## Standard patterns

### Split Architecture

Use for KubeMetal-like systems where one product coordinates two execution planes. Desktop may branch horizontally; mobile can stack the branches without changing semantics.

### Layered Platform

Use for Narwhal-like platforms. Present Experience → Platform Services → Infrastructure as responsibilities, not merely a list of technologies.

### Engineering Flow

Use for GitOps, release, air-gap, ingestion, and verification pipelines. Keep the main path visually dominant and model orchestration/identity as supporting dependencies.

### Evidence Flow

Use for test chains and verification. Each stage should communicate what is verified, not only which script runs.

## Migration rule

Legacy box-drawing diagrams (`┌`, `┐`, `└`, `┘`, `│`, `├`, `┤`, `┬`, `┴`, `┼`) that explain architecture should be replaced with Mermaid. Literal terminal output or examples may remain text when the characters themselves are part of the source evidence.

## MDX implementation

Use the shared Mermaid component:

```mdx
<Mermaid chart={`flowchart TB
  A["Boundary A"] -->|"contract"| B["Boundary B"]
  C["Supporting system"] -.->|"secondary dependency"| B`} />
```

The shared renderer inherits site design tokens for light/dark themes. Avoid per-document hard-coded colors unless a diagram has a documented semantic need.
