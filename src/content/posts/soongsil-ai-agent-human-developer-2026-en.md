---
title: "Soongsil Guest Lecture Recap: What Humans Should Hold in the Age of AI Agents"
description: "A write-up of 'AI Agents and the Role of the Human Developer', presented in Soongsil University's 2026 Software Special Topics 2. Silent failures drawn from my own incident logs, and a rule for what to hand off versus what to keep."
pubDate: 2026-10-14
tags: ["AI Agent", "Seminar", "Harness Engineering", "CI/CD", "Evidence", "Open Source"]
projects: ["narwhal", "kubemetal"]
featured: false
draft: false
---

On October 14, 2026, I gave a guest lecture, "AI Agents and the Role of the Human Developer", in Soongsil University's Software Special Topics 2. This post rewrites the talk so it can be read on its own after the lecture. The slides themselves are in Korean.

[View the slides](https://cne.io.kr/slides/ai-agent-human-developer/#1). On mobile, swipe left or right or tap the screen edges to move between slides, and use the button at the top right for full screen.

## The answer first

I opened the talk with the conclusion.

- **What to hand to an agent**: drafting, running repeated checks, research and exploration
- **What humans should hold**: goals and criteria, approval, and mechanisms that prevent recurrence

In one sentence: **the person who approves takes the responsibility, and a mechanism prevents the recurrence.**

Responsibility and prevention are different things. Accountability sits with the people and organizations that hold approval and deploy authority, and an AI cannot be an accountable party. Prevention is the developer's job of turning an incident into a discriminating criterion and a regression test, which is where I think the human's work moves in the AI era.

## How I have used AI so far

What changed was less the tool and more the way I used it.

1. **ChatGPT**: converting images into a Ghibli style, purely for fun
2. **Perplexity**: searching, then copy and paste
3. **Claude Pro**: started agent-style development with Claude Code. Tokens were scarce and it was hard, but this is when I began developing from the CLI.
4. **Gemini Pro**: adapted to CLI development, moving from Gemini CLI to Antigravity CLI
5. **Claude Max 5x**: serious development. I built several open-source projects and contributed to eGovFrame.
6. **ChatGPT Plus free pass**: with Codex CLI, I let agents form a team and complement each other

What I hand to AI grew from "receive" to "choose" to "instruct". One lesson was that limits and conditions change over time, so I now run all three CLIs side by side. This journey is my own experience and I do not generalize it.

## How an agent differs from a chatbot

A chatbot takes a question and returns an answer, and a human does the judging and the acting. An agent takes a goal, **chooses and calls tools itself** (reading and editing files, running commands, searching), looks at the result, and decides the next action. That is why you can hand it more work, and for the same reason it can be silently wrong.

The talk covered four basics.

- **Two axes for choosing a model**: frontier or open-weight (who made it), and local or cloud (where it runs). Model names keep changing, so remember the axes.
- **The engineering progression**: prompt engineering (one question), then context engineering (all the tokens that go into the model), then harness engineering (designing tools, documents, verification, and loops). The weight shifts toward building a frame that keeps you from repeating the same mistake.
- **The Ralph loop**: a way to give the AI one task at a time, endlessly. Because it is easy, it needs safety rules. Left running forever, cost piles up and the agent keeps making changes with whatever permissions it holds. Write one task, run a check on every iteration, and set an upper limit.
- **A hub-and-spoke harness**: a human sets the goal, an orchestrator hands out the work, and every result comes back. Authoring and review go to different workers, and files are split by worktree so only one lane touches a given file. Deterministic enforcement (linters, CI, regression tests) holds up the floor.

My own setup is to drive agents on a Mac mini from my phone over Tailscale, with a human doing the approving. The more you run agents remotely and in parallel, the more the approval point matters, which sets up the cases that follow.

## Four silent failures

This is the core. These four come from my own lessons-log and mistakes-log. None was a loud failure. In each, **a pass signal appeared while the thing did not actually work**.

### Case 1. Zero candidates, everyone passes

One check printed `PASS T03 all ArgoCD apps Synced+Healthy`, but there were actually zero ArgoCD apps. The image could not be pulled (ImagePullBackOff), the push failed, and the service returned 503. "Every app is healthy" is true even when there are no apps. The check did not lie. The sentence is simply built that way.

The step script went on with `WARN: had issues, continuing...`. The fix was simple: **count the apps first and FAIL below a threshold**. The lesson in the original log: a check phrased as "all X are Y" needs a floor on the number of X.

### Case 2. One line that stamps success on failure

A markdown lint step ended with `|| true`, so CI stayed green even when the command before it failed. Worse, the "fix" column of the log said it had been fixed on 2026-09-08, while the commit that actually removed that line was on 2026-09-24. **For 16 days the log said it was fixed and the workflow was unchanged.**

There was more of the same kind. A required check would SKIP and `exit 0` when its target was missing, so it passed without comparing anything. Once it was made to compare against the real main, it failed immediately. Writing "fixed" in a document does not fix anything, and a check that can SKIP is not a check. I wrote about a tool that catches this pattern in [A CI Job Can Print FAIL and Still Report Success](/en/posts/echo-branch-false-green-detector/).

### Case 3. The lookup failed and someone else's value appeared

A screen showed hardware specs from a lookup. When the lookup failed, it showed a hardcoded value (`Apple M4 Pro / 14 / 20 / 64GB`) instead. A user on a different machine would see someone else's specs presented as fact. A context-list lookup likewise invented names when it failed. The fact that the lookup had failed disappeared from the screen.

The fix was to return an error (`Err`) on failure, under the principle "Never fabricate state". A plausible default hides a failure.

### Case 4. A "perfect score" the worker wrote itself

An AI worker reported "P1 to P4 done". QA then found a crash in the weekly report's `Decimal` handling, and an entire equivalence and idempotency test suite was missing. The same file also records a model rotation that was a silent no-op: the return code was 0 and the output was empty, so the rotation kept running the same model every time.

The original log uses this incident as the basis for "a worker's own completion claim is not evidence". The evidence is the execution result.

### What the four have in common

What went wrong differed. In cases 1 and 2 the check was wrong, in case 3 the display was wrong, and in case 4 the report was wrong. But PASS, Synced, a green CI, and an on-screen value were all **signals**, not evidence that it works.

> These cases were picked from my own records. They are not compared against successes or against human-written code, so they cannot support the generalization "AI silently fails by nature". The originals for cases 1 to 3 do not say who wrote the code, so I describe them only as "failures from projects done in collaboration with AI". Case 4 is the only one where a false completion report by an AI worker is stated in the source.

## Turning an incident into a test

So I do not stop at recording a failure. I chain it like this.

**Incident, then lesson, then discriminating criterion, then regression test**

narwhal's lessons-log holds 326 entries from 2025-01-27 to 2026-09-26. The action column records "how to tell the difference", and the description of each regression check ends with `(YYYY-MM-DD)` to tie it to its incident. Alongside it sit mutation checks, which feed in deliberately wrong input to prove the check really catches it. kubemetal and kube-ready-box require reading the mistakes-log before work and confirm it with a CI gate.

I did not tally the 326 entries by type. Because the cases in this talk were picked, I did not want to generalize from the counts.

## Case 5. What acceptance looks like in open source

The same question shows up in contributing to open source. By "with AI" here I mean my contribution work overall, done with AI tools. The source material does not say whether AI was used on each of the two PRs below, so I do not claim it.

- **A closed PR and a merged PR on the same day** (2026-08-26, egovframe-common-components): #1166 added only pure utility unit tests and was closed without merging because it did not fit the repository's scope (per the original talk's account; I did not read the PR comment itself). #1167 fixed a typo in a file-download header name and a mismatched property key, added five tests after the review reply, and was merged. Good code still gets closed if it is not a problem the repository wants.
- **State what you checked and what you did not**: #1167 stopped at header string tests and said a real HTTP response call was out of scope. egovframe-template-simple-backend #121 (merged 2026-06-16) checked the YAML and stated in the PR that no real-cluster E2E was run. It is the opposite of a silent PASS: before saying it passed, say what you did not do.

I have submitted 485 PRs to the eGovFramework organization: 222 merged, 263 closed without merging, 0 open (GitHub search, 2026-10-05; the roughly 46 percent merge rate is a calculated figure). These numbers alone say nothing about the effect of AI. I did not compare merge rates between PRs that used AI and PRs that did not, and the count is background, not a goal. What is clear is that even with AI speeding things up, the maintainer decides whether to merge. More on contributing in [Starting eGovFrame Contribution](/en/posts/egovframe-contribution-starter-2026/).

## What to hand off and what to keep

| Fine to hand to AI | What humans keep |
|---|---|
| Collecting logs, listing candidate hypotheses, drafting a fix | Setting the criteria to rule out a hypothesis, defining the evidence for "done" |
| Running repeated checks | Whether to apply automatically (dry-run, approval points) |
| Drafting tests | Confirming the test really catches the failure (mutation checks) |

At the moment an AI says "done", whether to believe it is the approver's call. In case 4 the worker's report had to be verified before approval, and in case 5 the maintainer approved whether the PR would merge.

## Where things are now, and what comes next

More people use agents, but trust moves separately, and the productivity evidence points both ways. In the talk I put the figures side by side rather than picking one.

- Agent use rose from 31 percent to 59 percent (Stack Overflow, 2025 to the 2026-04 survey), while favorable views of AI tools fell from 72 percent to about 60 percent (2025 survey).
- METR's early 2025 study reported that experienced developers were 19 percent slower with AI, and its 2026-02 update said it is redesigning the study because of selection bias.
- A DORA ROI report (covered 2026-05) called AI an "amplifier": +35 to 40 percent for new work and up to +10 percent for legacy.

All of these were checked on 2026-10-05. Not as a prediction but as a direction I can see from my own experience, there are three points. Tools and limits keep changing, so avoid relying on a single tool. What agents take on will grow while verification and approval stay with humans. So the developer's work moves from writing code to criteria, approval, and mechanisms that prevent recurrence.

## Tonight's checklist

The three-line minimum I left the students with.

1. Put a **floor on the count** in any "all are fine" check.
2. Treat a required check that silently SKIPs as a **FAIL**.
3. Attach **execution evidence** (logs, a diff, test output) to every completion report.

For homework I asked them to write up one incident or mistake of their own in four columns: incident, lesson, discriminating criterion, regression test. They can have an AI tidy the draft, but must confirm for themselves that the criterion really catches the failure.

## The one-sentence conclusion

You can hand an agent a lot. But the pattern that repeated in the cases I picked was not a loud failure, it was a **silent failure**, and it was a human who decided whether to believe a "pass". So the developer's work moves toward building mechanisms that refuse to trust a "pass" and catch the failure, and toward keeping the seat of approval.

If you are curious how I keep agent instructions short, see also [A Longer AGENTS.md Was Not the Answer](/en/posts/openforge-engineering-02-agent-engineering/).
