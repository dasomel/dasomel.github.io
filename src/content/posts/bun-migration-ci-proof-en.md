---
title: "Migrating from npm to Bun — From the First Failure to CI Evidence"
description: "A practical record of migrating dasomel.github.io from npm to Bun 1.4, including the first failed deployment, the fixes, and measured GitHub Actions performance improvements."
pubDate: 2026-08-21
tags: ["Bun", "Next.js", "GitHub Actions", "CI/CD", "Performance", "Developer Experience"]
featured: false
draft: false
---

## Introduction

Changing a development tool is rarely just a matter of replacing a few commands in `package.json`.

For a production web project with CI/CD, the local runtime, dependency lockfile, automation scripts, GitHub Actions, and Pages deployment environment all need to agree on the same runtime contract.

This week I migrated the actively maintained `dasomel.github.io` repository toward **Bun 1.4**.

The final architecture looks simple:

```text
npm
  ↓
Bun 1.4
```

The actual migration was not quite that simple.

The first attempt failed because the build scripts had started calling Bun while the GitHub Pages deployment workflow did not provision Bun. After fixing that gap, I completed the dependency/tooling migration, added Bun-native validation, and compared actual GitHub Actions execution times.

This post is therefore not a generic "Bun is fast" article. It is an **engineering record of the failure, diagnosis, repair, and measured result**.

---

## 1. The original state

The project originally used Node.js and npm as its primary tooling.

A representative build script looked like this:

```json
{
  "scripts": {
    "build": "next build && node scripts/generate-rss.js"
  }
}
```

GitHub Actions installed dependencies with npm:

```yaml
- name: Setup Node
  uses: actions/setup-node@v6
  with:
    node-version: 24.19.0
    cache: npm

- name: Install dependencies
  run: npm ci --prefer-offline --no-audit --no-fund
```

So the repository effectively had one runtime model:

```text
Next.js
  └─ Node.js

automation scripts
  └─ Node.js

package install
  └─ npm

CI
  └─ Node + npm
```

---

## 2. Why move to Bun?

The motivation was not simply to find a faster package manager.

The repository also contains RSS generation, daily digest processing, event collection, project metadata refresh, and other automation scripts.

I wanted to reduce the number of moving parts and make the repository's tooling contract more explicit:

```text
Next.js
  └─ executed through Bun

automation scripts
  └─ executed with Bun

package install
  └─ bun install

CI
  └─ Bun 1.4
```

This does **not** mean replacing Next.js's internal build engine with Bun. The project still uses Next.js/Turbopack. The migration is primarily about the dependency and JavaScript tooling layer.

---

## 3. The first migration failed

The first step was to move automation scripts to Bun.

For example:

```diff
- "build": "next build && node scripts/generate-rss.js"
+ "build": "next build && bun scripts/generate-rss.js"
```

Other event, digest, and metadata commands were updated the same way.

The repository also started declaring the required Bun version:

```json
"engines": {
  "bun": ">=1.4.0"
}
```

But this introduced a subtle deployment problem.

### The Pages workflow still did not have Bun

The build script now expected:

```text
next build
  ↓
bun scripts/generate-rss.js
```

The GitHub Pages runner, however, did not yet install Bun.

Conceptually:

```text
CI validation
  ↓
✅ Bun installed

Pages deployment
  ↓
❌ Bun not installed
  ↓
bun command unavailable
```

The deployment was fixed by explicitly provisioning Bun in the Pages workflow:

```yaml
- name: Setup Bun
  uses: oven-sh/setup-bun@v2
  with:
    bun-version: 1.4.0

- name: Verify Bun version
  run: bun --version
```

The repair landed in commit `a3388fa9`, specifically to make the deployment environment capable of executing the updated build script. urlCommit: install Bun for Pages deploymenthttps://github.com/dasomel/dasomel.github.io/commit/a3388fa9b8ca4258d2573011bc2cd67d132e593d

---

## 4. The first lesson: runtime is part of the change

This looked like a small CI configuration issue, but it exposed a broader principle.

> **The runtime required by the source code and the runtime provisioned by the execution environment should be treated as one change unit.**

A local success such as:

```bash
bun run build
```

is not enough.

You must also validate:

```text
Local
CI validation
Automation workflows
Pages deployment
```

The first failure happened precisely because one of those environments was left behind.

---

## 5. Second stage: complete the Bun migration

After repairing Pages, I completed the repository-wide tooling transition.

The migration commit introduced the following changes.

### Dependency state

```text
package-lock.json
      ↓
bun.lock
```

### Automation scripts

```text
node scripts/xxx.mjs
      ↓
bun scripts/xxx.mjs
```

### Build

```text
next build && node scripts/generate-rss.js
      ↓
next build && bun scripts/generate-rss.js
```

### CI runtime

Bun 1.4 became an explicit CI dependency:

```yaml
- name: Setup Bun
  uses: oven-sh/setup-bun@v2
  with:
    bun-version: 1.4.0

- name: Verify Bun version
  run: bun --version
```

I also added Bun-native validation instead of relying only on the production build:

```text
bun test
bun run build:tools
bun run build
```

The overall migration is captured in the Bun toolchain commit. urlCommit: migrate project tooling to Bunhttps://github.com/dasomel/dasomel.github.io/commit/28b7ed41836b266610978d30a7c58b9582696d7d

---

## 6. Measuring the real CI speed

Instead of assuming Bun was faster, I compared actual GitHub Actions logs from the same GitHub-hosted `ubuntu-24.04` runner.

### Dependency installation

The npm-based run reported:

```text
npm ci
added 690 packages in 15s
```

The timestamp-based duration was about **15.26 seconds**.

The Bun-based run reported:

```text
bun install --frozen-lockfile --no-progress
694 packages installed [8.99s]
```

That is about **8.99 seconds**.

So the observed dependency-install improvement was:

```text
npm ci       15.26s
bun install   8.99s
-------------------
Difference    6.27s
Improvement   ~41%
```

---

## 7. Next.js itself did not suddenly get much faster

One of the most useful findings was that the Next.js build time stayed almost the same.

The previous run compiled Next.js in roughly **10.3 seconds**.

The Bun-based run compiled it in roughly **9.8 seconds**.

The overall build flow stayed in the low-20-second range.

In other words:

```text
Bun migration
   ↓
dependency installation     ✅ significant improvement
Next.js/Turbopack build     ≈ nearly unchanged
```

That makes sense because this migration did not replace Next.js's internal compiler. It changed the package manager and JavaScript automation runtime around it.

So the most credible performance claim for this repository is not "Bun makes Next.js build dramatically faster". It is **"Bun reduced the repeated dependency/tooling overhead around the build."**

---

## 8. The full CI job became shorter

The end-to-end workflow comparison was even more useful.

### Earlier workflow

```text
checkout
Node setup
npm cache restore
Bun setup
npm ci
next build
RSS generation
cleanup
```

Total runtime was about **49.5 seconds**.

### Current workflow

```text
checkout
Bun setup
Bun cache restore
bun install
bun test
bun build smoke test
next build
RSS generation
cleanup
```

Total runtime was about **38.5 seconds**.

The observed change was therefore:

```text
Before      ≈49.5s
After       ≈38.5s
-------------------
~11s shorter
~22% faster
```

And the current workflow actually contains more validation:

```text
bun test
bun run build:tools
```

So the improvement was not simply the result of deleting verification steps.

---

## 9. The measured result

The main measurements from the actual Actions logs are summarized below.

| Metric | npm-based | Bun-based |
| --- | ---: | ---: |
| Dependency install | 15.26s | 8.99s |
| Next.js compile | 10.3s | 9.8s |
| Overall build flow | ~23s | ~24s |
| Whole CI job | ~49.5s | ~38.5s |
| Unit/runtime test | not present | `bun test` |
| Tool bundle smoke test | not present | `bun build` |

So the most accurate one-line conclusion is:

> **The migration did not dramatically accelerate Next.js itself, but it reduced the total CI cycle by about 22% while adding Bun-native validation.**

---

## 10. One more cleanup pass

After the migration was working, another small issue appeared: the Pages workflow had accumulated duplicate Bun setup/verification blocks.

Conceptually it had become:

```text
Setup Bun
Verify Bun
...
Setup Bun
Verify Bun
```

It worked, but it was unnecessary duplication.

The final cleanup removed the duplicate setup and kept a single Bun 1.4 provisioning block in the Pages workflow.

That final cleanup is a useful reminder that migration work should include a **post-success simplification pass**, not just getting the pipeline green.

---

## 11. Why the migration was staged instead of being a single change

I deliberately did not change the package manager, lockfile, CI, Pages deployment, and all automation in one giant step.

The reason is simple: when several dimensions change at the same time, it becomes harder to identify the actual source of a failure.

The migration therefore evolved roughly as follows:

```text
Node + npm
   +
Bun runtime
      ↓
validate runtime assumptions
      ↓
fix Pages runtime gap
      ↓
Bun package manager
+ bun.lock
+ Bun automation scripts
      ↓
add test / smoke validation
      ↓
measure actual CI time
      ↓
remove duplicate setup
```

The first failed deployment was useful because it isolated a very specific problem: **Bun itself was not the problem; the deployment environment did not provision the runtime that the new build script required.**

---

## 12. Engineering lessons

### Runtime migration is bigger than `package.json`

```text
package.json change
≠
complete migration
```

You also need to account for CI, Pages, automation workflows, caches, and the lockfile.

### Performance should be measured in the actual workflow

A generic benchmark is useful, but it is less important than what happens in the repository that you actually maintain.

Here, the most relevant measurements were:

```text
15.26s → 8.99s
```

for dependency installation, and:

```text
≈49.5s → ≈38.5s
```

for the complete CI job.

### A component not getting faster is still a useful result

Next.js did not become dramatically faster. That is fine.

It lets us make a more precise statement about where Bun helped instead of attributing every improvement to Bun.

### Failure history is part of engineering evidence

The first failed deployment is not noise to hide.

It explains why runtime provisioning was made explicit in both CI and Pages, and why the final design is more robust than the first attempt.

---

## 13. The resulting tooling model

The repository now follows a much clearer tooling contract:

```text
┌───────────────────────────────┐
│       dasomel.github.io       │
├───────────────────────────────┤
│ Next.js 16 + Turbopack        │
│ React 19                      │
│                               │
│ Bun 1.4                       │
│ ├─ package manager            │
│ ├─ automation runtime        │
│ ├─ test runner               │
│ └─ build tooling             │
│                               │
│ GitHub Actions                │
│ ├─ CI                         │
│ ├─ daily digest               │
│ ├─ metadata update            │
│ ├─ event update               │
│ └─ Pages deployment           │
└───────────────────────────────┘
```

The important part is not simply "Bun is installed".

The goal is to make the repository's **runtime contract explicit and consistent across all execution boundaries**.

---

## Conclusion

The Bun migration did not succeed on the first attempt.

The first attempt changed the build scripts to call Bun, but the Pages deployment environment did not have Bun installed:

```text
build script
   ↓
Bun call
   ↓
Pages runner
   ↓
Bun missing
   ↓
failure
```

That failure exposed the missing runtime provisioning step. After fixing it, I completed the dependency and automation migration, added runtime and smoke validation, and measured the result in real GitHub Actions runs.

The observed results were:

```text
Dependency install
npm ci        15.26s
bun install    8.99s
             ↓
            ~41% improvement

Whole CI
≈49.5s
   ↓
≈38.5s
   ↓
~22% improvement
```

At the same time, the Next.js build itself stayed almost unchanged.

So the most accurate conclusion is:

> **Bun did not magically make Next.js fast. It simplified and accelerated the dependency/tooling layer of the repository, reducing the real CI cycle by about 22%.**

For me, the more important outcome was methodological: **fail, isolate the cause, repair the execution boundary, and measure again.**

That is a much more useful way to approach a tooling migration than simply declaring that the new tool is faster.
