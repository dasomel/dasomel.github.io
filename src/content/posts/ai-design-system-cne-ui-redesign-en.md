---
title: "How I Reworked the CNE UI with AI and a Design System"
description: "How Projects, Project Detail, Notes, Tech Digest, Docs, Speaking, and shared navigation were brought under one design language, with AI used as an execution partner."
pubDate: 2026-08-22
tags: ["Design System", "AI", "UI/UX", "Accessibility", "Open Source"]
featured: false
---

Recently, I worked on a broad UI redesign of the CNE site. Rather than replacing everything at once, I defined a design system first and then applied the same principles repeatedly across the actual product until the experience converged.

In this process, AI was not the tool that "designed the site for me." It was closer to an execution partner: applying established rules across multiple screens, comparing existing implementations, finding inconsistencies, and helping iterate quickly.

The result was a shared visual language across Projects, Project Detail, Notes, Tech Digest, Docs, Speaking, About, and the global Header.

## The problem was not a single page

The first issues looked simple.

Light and Dark mode did not always have the same surface hierarchy. Some pages used cards that felt too heavy, while other areas had borders that were too weak. On mobile, some screens became unnecessarily dense and the visual priority between primary and secondary information was not always clear.

Projects made the problem particularly visible.

Search, filters, result counts, cards, and GitHub actions were all useful, but emphasizing every element independently made the whole screen noisy. The problem therefore became less about making an individual card look better and more about **redefining information priority**.

## I made the design system the reference point first

The most important decision was to define the relationship between surfaces and typography before adding more components.

The basic surface hierarchy became:

```text
bg
 └─ bg-subtle
     └─ surface
         └─ surface-hi
```

Code and operational information use dedicated `code-*` tokens, while documentation panels have their own `doc-panel-*` role.

I also separated semantic color roles:

- Teal: brand, links, focus, primary emphasis
- Amber: evidence and semantic signals
- Border: structural separation
- Shadow: a secondary elevation cue rather than a substitute for hierarchy

Once these roles were explicit, pages needed fewer ad-hoc colors and backgrounds.

## I treated Projects like a small product

Projects became the main testing ground for the redesign.

The initial changes grouped search and tag filters into an explorer surface and made result counts and active state explicit.

From there, the work evolved roughly like this:

```text
search / filter
  ↓
empty state
  ↓
mobile filtering
  ↓
keyboard focus
  ↓
hover interaction
  ↓
card density
  ↓
section rhythm
  ↓
entry hierarchy
  ↓
action hierarchy
  ↓
surface contrast
```

One of the most important improvements was separating **primary and secondary actions**.

The main destination of a project card should be the project itself. If GitHub and other source links have the same visual weight, users have to decide between multiple equally strong targets.

The project title and detail entry therefore became the primary action, while repository/source actions were intentionally reduced to a secondary role.

The related implementation work is tracked in [Projects entry hierarchy](https://github.com/dasomel/dasomel.github.io/pull/211), [card action hierarchy](https://github.com/dasomel/dasomel.github.io/pull/212), and [surface contrast](https://github.com/dasomel/dasomel.github.io/pull/214).

## Project Detail became an engineering case study

The project detail page was reshaped so it reads less like a simple project overview and more like an **engineering case study**.

The resulting flow is:

```text
Hero
 ↓
Problem / Response
 ↓
Source Snapshot
 ↓
Signals
 ↓
Docs / Notes / Tech Digest
 ↓
Engineering Content
```

Long-form content received a constrained reading width, stronger H2/H3 hierarchy, and clearer section boundaries.

Related content was also separated by role so Docs, Notes, and Tech Digest no longer look like one undifferentiated list.

The goal was not to remove information. It was to make the **different kinds of information visibly different**.

Relevant changes landed through [Project Detail mobile reading rhythm](https://github.com/dasomel/dasomel.github.io/pull/213), [case-study hierarchy](https://github.com/dasomel/dasomel.github.io/pull/215), and [related content groups](https://github.com/dasomel/dasomel.github.io/pull/216).

## Notes, Tech Digest, and Docs now share one system

These content surfaces have different purposes:

- Notes: Engineering Notes
- Tech Digest: Tech Signal
- Docs: Reference

They do not need to look identical, but if typography, surfaces, and spacing are all different, the site starts to feel like several unrelated products.

I therefore introduced a shared collection surface and a common rhythm:

```text
Hero
 ↓
Context / Notice
 ↓
Featured content
 ↓
Archive
```

The same system now covers keyboard focus, title wrapping, reduced-motion behavior, and metadata rhythm.

The shared PostList was also refined so the title is the strongest scan target, while date and reading time live together as compact metadata.

This work continued through [collection interaction states](https://github.com/dasomel/dasomel.github.io/pull/217), [collection rhythm](https://github.com/dasomel/dasomel.github.io/pull/218), and [post list scanability](https://github.com/dasomel/dasomel.github.io/pull/219).

## AI did not decide the design

The most important lesson from using AI here was **not to let the AI determine the design direction**.

There were human-defined principles first:

```text
Engineering first
Editorial hierarchy
Quiet surfaces
One primary accent
Evidence over ornament
Motion with purpose
```

AI was then used to apply those rules to real code, compare the result with the existing implementation, and find places where the same rule was breaking across different pages.

For example, after changing a Project card, the important questions were not just whether the card looked better:

> Does the same hierarchy hold on Project Detail?
>
> Does the same surface relationship survive Dark mode?
>
> Does mobile preserve the same information priority?
>
> Do keyboard focus and reduced-motion still behave correctly?

The important part was repeating the **same design questions** across the site.

That made consistency more valuable than any individual AI-generated visual improvement.

## Accessibility and responsive behavior were part of the system

Focus states and reduced-motion were not treated as a final QA checkbox. They were part of the design system itself.

Links and cards received explicit `focus-visible` states. Hover transforms were constrained for touch-oriented environments, and unnecessary motion is removed when users prefer reduced motion.

Mobile was also not treated as "desktop in one column."

I revisited title wrapping, metadata density, section spacing, and navigation surfaces to decide what should remain visually dominant as the viewport gets smaller.

## Eventually, I stopped making tiny PRs

The redesign happened through many small changes, but the final phase intentionally changed strategy.

Visual cleanup can become endless when every remaining detail gets its own PR. So the last step bundled the remaining UI, accessibility, responsive, and theme work into one **cross-site consistency pass**.

The final [PR #220](https://github.com/dasomel/dasomel.github.io/pull/220) covered header focus, mobile navigation, About and Speaking interactions, narrow-screen behavior, and the final UI QA checklist. That closed this redesign cycle.

## What I learned

The biggest takeaway is that a design system is not just a document. It is a **repeatable decision framework**.

Color tokens alone do not make a design system.

The hierarchy defined for Projects has to hold on Project Detail. The metadata rhythm used for Notes should still feel natural in Tech Digest. The same meaning structure should survive Light mode, Dark mode, and mobile layouts.

This becomes even more important when AI is involved.

Instead of repeatedly asking an AI to "make it prettier," it is more effective to keep asking questions such as:

```text
What is the primary action here?
What is the role of this surface?
Why does secondary information have the same visual weight?
Does Dark mode preserve the same meaning hierarchy?
Does mobile preserve the same priority?
```

That turns AI from a source of random visual variation into a tool for applying a consistent system at scale.

The CNE redesign is now complete for this cycle.

Going forward, I do not want to keep polishing the UI through endless micro-changes. The plan is to expand the design system when a new feature or a real usability problem requires it.

The goal was never simply to make the site prettier. It was to make the identity of CNE as an **Open Source Engineering Workbench** feel consistent across every surface.
