# AI Component Specification & MDX Schema

This specification outlines the available MDX components, their TypeScript interfaces, and valid usage patterns for AI agents writing content on `dasomel.github.io`.

## 1. Component Catalog

### `EvidenceCallout`
Highlights engineering hypotheses, experiments, verified benchmarks, or incident lessons.

- **Props**:
  - `title` (optional string): Header text for the callout.
  - `type` (optional enum): `"hypothesis" | "experiment" | "evidence" | "lesson"` (default: `"evidence"`).
  - `children` (React.ReactNode): Body content.

- **Example**:
```mdx
<EvidenceCallout type="evidence" title="Bun 1.4 Cold Start Improvement">
  CI workflow execution time was reduced by 41% across 10 clean runner trials.
</EvidenceCallout>
```

---

### `BenchmarkGrid`
Displays before-and-after performance metrics and percentage differences.

- **Props**:
  - `title` (optional string): Section title.
  - `metrics` (array of objects):
    - `label` (string): Metric name.
    - `before` (string): Baseline measurement (e.g. `"15.26s"`).
    - `after` (string): Optimized measurement (e.g. `"8.99s"`).
    - `diff` (string): Difference percentage or delta (e.g. `"-41%"`).
    - `isPositive` (optional boolean): Defaults to `true` (renders accent color).

- **Example**:
```mdx
<BenchmarkGrid
  title="CI Pipeline Performance Comparison"
  metrics={[
    { label: "Dependency Install", before: "15.26s", after: "8.99s", diff: "-41% (6.27s saved)" },
    { label: "Total CI Duration", before: "49.5s", after: "38.5s", diff: "-22% (11s saved)" }
  ]}
/>
```

---

### `DigestCard`
Formatted entry card for Tech Digest highlights with tags and source links.

- **Props**:
  - `category` (string): Topic label (e.g. `"Kubernetes"`, `"AI Infra"`).
  - `title` (string): Headline.
  - `summary` (string): 2-3 sentence overview.
  - `sourceUrl` (optional string): Upstream URL.
  - `sourceLabel` (optional string): Link anchor text.
  - `tags` (optional string array): Keywords.

- **Example**:
```mdx
<DigestCard
  category="Kubernetes"
  title="Istio Ambient Mesh 1.25 Release"
  summary="Sidecarless ambient mesh reaches general availability with substantial memory savings."
  sourceUrl="https://istio.io/latest/news/releases/1.25.x/"
  sourceLabel="Istio Blog"
  tags={["Istio", "ServiceMesh", "Ambient"]}
/>
```

---

### `Mermaid`
Renders architectural diagrams, state machines, and xycharts with full theme synchronization.

- **Props**:
  - `chart` (string): Mermaid template string.

- **Example**:
```mdx
<Mermaid chart={`flowchart LR
    A[Source] --> B[CI Runner]
    B --> C{Verify}
    C -->|Pass| D[Deploy]
`} />
```
