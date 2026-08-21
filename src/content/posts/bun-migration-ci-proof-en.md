---
title: "Migrating from npm to Bun — From the First Failure to CI Evidence"
description: "A practical record of migrating dasomel.github.io from npm to Bun 1.4, including the first failed deployment, measured CI performance, and the removal of duplicate production builds."
pubDate: 2026-08-21
tags: ["Bun", "Next.js", "GitHub Actions", "CI/CD", "Performance", "Developer Experience"]
featured: false
draft: false
---

## Introduction

Changing a development tool is rarely just a matter of replacing a few commands in `package.json`.

For a production web project with CI/CD, the application code, dependency lockfile, automation scripts, GitHub Actions, and Pages deployment environment all need to agree on the same runtime contract.

I migrated the actively maintained `dasomel.github.io` repository from a Node.js + npm-centered toolchain toward **Bun 1.4**.

The final direction looks simple:

```text
npm
  ↓
Bun 1.4
```

The actual migration was not quite that simple.

The first attempt failed because the build scripts had started calling Bun while the GitHub Pages deployment workflow did not provision Bun. After fixing that gap, I completed the dependency and automation migration, added Bun-native validation, measured actual GitHub Actions performance, and finally removed duplicate Next.js production builds between PR validation and Pages deployment.

This post is therefore not a generic “Bun is fast” article. It is an **engineering record of failure, diagnosis, repair, measurement, and pipeline optimization**.

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

The repository also had multiple Node.js automation scripts for RSS generation, daily digest processing, event collection, and project metadata refresh.

The effective model was:

```text
Next.js
  └─ Node.js

automation scripts
  └─ Node.js

package install
  └─ npm

CI / Deploy
  └─ Node + npm
```

---

## 2. Why move to Bun?

The motivation was not simply to find a faster package manager.

The repository contains enough JavaScript automation that a consistent runtime and package toolchain is more valuable than having several partially overlapping execution models.

The target model was:

```text
Next.js
  └─ executed through Bun

automation scripts
  └─ Bun

package install
  └─ bun install

lockfile
  └─ bun.lock

CI / Deploy
  └─ Bun 1.4
```

This does **not** mean replacing Next.js's internal compiler or Turbopack with Bun. Next.js remains the application framework and build engine; Bun becomes the surrounding package/runtime/tooling layer.

---

## 3. The first migration failed

The first step was to move automation scripts to Bun.

For example:

```diff
- "build": "next build && node scripts/generate-rss.js"
+ "build": "next build && bun scripts/generate-rss.js"
```

Other event, digest, and metadata commands were updated the same way.

The project also started declaring the required Bun version:

```json
"engines": {
  "bun": ">=1.4.0"
}
```

But this exposed a deployment gap.

### The Pages workflow still did not have Bun

The build script now expected:

```text
next build
  ↓
bun scripts/generate-rss.js
```

The Pages runner, however, did not yet install Bun.

The real failure path was:

```text
Next.js build
    ↓
success
    ↓
RSS generation through Bun
    ↓
Bun missing on Pages runner
    ↓
bun: not found
```

The important point is that **Next.js itself was not the failing component**. The source code had acquired a new runtime requirement, but the deployment environment had not been updated to provide it.

The fix was to provision Bun explicitly in the Pages workflow:

```yaml
- name: Setup Bun
  uses: oven-sh/setup-bun@v2
  with:
    bun-version: 1.4.0

- name: Verify Bun version
  run: bun --version
```

The repair landed in commit `a3388fa9`.

---

## 4. The first lesson: runtime is part of the change

This looked like a small CI configuration issue, but it exposed a broader principle:

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

The first failure happened precisely because one of those execution boundaries was left behind.

---

## 5. Second stage: complete the Bun-native toolchain

After repairing Pages, I completed the repository-wide tooling transition.

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

Bun 1.4 became an explicit CI dependency and the version was verified on every run.

I also added Bun-native validation:

```text
bun test
bun run build:tools
bun run build
```

Bun was no longer just an additional runtime. It became the repository's **package manager, automation runtime, test runner, and build tooling**.

---

## 6. Measuring the real CI speed

Instead of assuming Bun was faster, I compared actual GitHub Actions logs from the same GitHub-hosted `ubuntu-24.04` runner.

### Dependency installation

The npm-based run took about **15.26 seconds**.

The Bun-based run reported:

```text
bun install --frozen-lockfile --no-progress
694 packages installed [8.99s]
```

So the observed dependency-install result was:

```text
npm ci       15.26s
bun install   8.99s
-------------------
Difference    6.27s
Improvement   ~41%
```

This was the clearest direct performance improvement from the migration.

---

## 7. Next.js itself did not suddenly get much faster

One of the most useful findings was that the Next.js build time stayed almost the same.

The previous build compiled Next.js in roughly **10.3 seconds**.

The Bun-based build compiled it in roughly **9.8 seconds**.

The overall production build remained in the low-20-second range.

In other words:

```text
Bun migration
   ↓
dependency installation     ✅ significant improvement
Next.js/Turbopack build     ≈ nearly unchanged
```

That makes sense because this migration did not replace Next.js's internal compiler.

So the credible performance claim for this repository is not “Bun makes Next.js dramatically faster.” It is:

> **Bun reduced the repeated dependency and tooling overhead around the build.**

---

## 8. The full CI job became shorter

The end-to-end workflow comparison was more interesting.

### Earlier workflow

```text
checkout
Node setup
npm cache restore
npm ci
next build
RSS generation
cleanup
```

Total runtime was about **49.5 seconds**.

### Bun migration workflow

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

The observed change was:

```text
Before      ≈49.5s
After       ≈38.5s
-------------------
~11s shorter
~22% faster
```

And the newer workflow actually contains more validation steps:

```text
bun test
bun run build:tools
```

So the improvement was not simply the result of deleting checks.

---

## 9. One more optimization: remove duplicate production builds

After the Bun migration was stable, I reviewed the CI structure again.

The PR validation workflow was still running the full production build:

```text
PR CI
  └─ bun run build
        ↓
      Next.js production build
```

After merge, the Pages deployment ran the same production build again:

```text
main push
  └─ bun run build
        ↓
      Next.js production build
```

That meant the same change could trigger **two full Next.js production builds** before the site was actually published.

The roles were split instead.

### PR CI — fast quality validation

PR CI now runs:

```text
bun install --frozen-lockfile
        ↓
bun test
        ↓
bun build smoke test
        ↓
bun lint
```

The question is:

> **“Is this change safe to merge?”**

### Pages Deploy — the production build boundary

Once merged to `main`, Pages runs:

```text
bun install --frozen-lockfile
        ↓
bun test
        ↓
bun lint
        ↓
bun run build
        ↓
GitHub Pages deploy
```

The question is:

> **“Can this exact main revision be built and deployed as production?”**

This removes the redundant PR production build while keeping the final production build mandatory immediately before deployment.

The revised PR CI was verified with successful `bun test`, Bun bundle smoke test, and lint runs, with the full Next.js production build removed from the PR path.

---

## 10. The measured result

The main measurements from the actual Actions logs are summarized below.

| Metric | npm-based | Bun-based |
| --- | ---: | ---: |
| Dependency install | 15.26s | 8.99s |
| Next.js compile | 10.3s | 9.8s |
| Overall build flow | ~23s | ~24s |
| Whole CI job | ~49.5s | ~38.5s |
| Unit/runtime test | not present | `bun test` |
| Tool bundle smoke test | not present | `bun build` |
| PR production build | yes | removed |
| Main production build | yes | yes |

So the most accurate one-line conclusion is:

> **The migration did not dramatically accelerate Next.js itself, but it reduced the total CI cycle by about 22% while adding Bun-native validation and then removed a second, redundant production build from the PR path.**

---

## 11. Post-migration cleanup matters too

One more small issue appeared during the migration: the Pages workflow had accumulated duplicate Bun setup/verification blocks.

Conceptually it looked like:

```text
Setup Bun
Verify Bun
...
Setup Bun
Verify Bun
```

It worked, but it was unnecessary duplication.

The final cleanup kept a single Bun 1.4 setup and verification block in the Pages deployment workflow.

This is an easy detail to overlook. A migration is not finished when the pipeline turns green; it is finished when the resulting configuration is also simple and maintainable.

---

## 12. Engineering lessons

### Runtime migration is bigger than `package.json`

```text
package.json change
≠
complete migration
```

CI, Pages, automation workflows, caches, and the lockfile all belong to the same change boundary.

### Performance should be measured in the actual repository workflow

A generic benchmark is useful, but the more relevant numbers were those observed in the project itself:

```text
15.26s → 8.99s
```

for dependency installation, and:

```text
≈49.5s → ≈38.5s
```

for the complete initial migration CI.

### A component not getting faster is still a useful result

Next.js did not become dramatically faster. That is fine.

It lets us make a precise statement about where Bun helped instead of attributing every improvement to Bun.

### PR and Deploy do not need identical responsibilities

PR validation should answer whether a change is safe to merge. The deployment workflow should own the definitive production build.

### Failure history is engineering evidence

The first failed deployment was not noise to hide. It identified the runtime provisioning gap and led directly to a more explicit and robust deployment configuration.

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

Whole initial CI
≈49.5s
   ↓
≈38.5s
   ↓
~22% improvement
```

At the same time, the Next.js build itself stayed almost unchanged.

The final pipeline was then simplified further by removing the redundant PR production build and keeping the definitive Next.js build only at the Pages deployment boundary.

So the most accurate conclusion is:

> **Bun did not magically make Next.js fast. It simplified and accelerated the dependency/tooling layer of the repository, reduced the real CI cycle by about 22%, and allowed the PR pipeline to become faster by removing a redundant production build.**

For me, the more important outcome was methodological: **fail, isolate the cause, repair the execution boundary, measure again, and then simplify the pipeline.**

That is a much more useful way to approach a tooling migration than simply declaring that the new tool is faster.
