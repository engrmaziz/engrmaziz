---
title: "Autonomous Agentic Coding Harnesses"
description: "Autocomplete is not an engineering loop. A harness writes, runs tests, reads the compiler, and repairs until the checks pass."
category: "Developer Tools"
date: "2026-09-18"
author: "Engr. Musharraf Aziz"
readingTime: "12 min read"
difficulty: "Intermediate"
featured: true
coverImage: "/images/blog/cover-agentic-coding.webp"
coverAlt: "A gold circular loop connecting code, terminal, test, and repair glyphs on a navy background"
directAnswer: "Agentic coding harnesses replace one-shot code generation with a closed loop. The model edits the repo, runs the terminal, reads compiler and linter output, runs unit tests, and repairs itself until acceptance checks pass. The harness — tests, limits, and logs — is the product. The model is a replaceable worker inside it."
tags:
  - agentic coding
  - test-driven development
  - developer tools
  - CI
  - LLM agents
related_services:
  - technical-consulting/workflow-automation
faqs:
  - q: "What is an agentic coding harness?"
    a: "A loop around a coding model that applies a patch, runs commands and tests, parses failures, and retries until acceptance criteria pass or a budget runs out."
  - q: "How is this different from autocomplete?"
    a: "Autocomplete suggests the next tokens in an editor. A harness owns a goal, a terminal, and a stop condition. It is finished only when checks pass, not when the text looks plausible."
  - q: "What stops a harness from damaging the repo?"
    a: "A branch or worktree, a command allowlist, a step budget, no production credentials, and a human merge. The model should not push to main."
---

> **The first draft is not the deliverable.** A coding agent is done when the tests, the linter, and the acceptance notes you wrote are green — or when it stops and shows you why they are not.

## Understanding the harness

Inline autocomplete made models useful inside an editor. It did not make them responsible for a change. One-shot generation has the same hole: the file looks right, the build is red, and a human reconstructs the intent from a diff they did not ask to debug.

The workflow that replaced it is a harness. You state acceptance criteria as commands, not as vibes. The agent may edit files. It must run the compiler, the linter, and the unit tests. It reads the output as state, not as something to apologize about. It patches again. It stops on green, on a step limit, or on a failure class you marked as human-only — migrations, auth, secrets.

That loop is ordinary CI with a model in the middle. The novelty is not “AI wrote code.” The novelty is that the stop condition is executable.

## The engineering framework

Four roles, kept separate.

**Spec.** A ticket, a failing test, or both. If you cannot say how you will know the change worked, the agent will invent a definition of done.

**Worker.** The model, behind a tool interface: read file, write file, run command. Swap the model without rewriting the loop. Open or closed, the harness should not care. See [how distillation changes which worker you can pin](/blog/open-weight-frontier-parity-distillation).

**Judge.** Tests and linters. They do not negotiate. A flaky test is a harness bug, not a model personality.

**Governor.** Step budget, wall clock, path allowlist, and a ban on credentials. This is the same least-privilege idea as [desktop agent security](/blog/desktop-agent-security-credential-hijacking), applied to a repo instead of a screen.

![Four-step loop: write, run, read compiler output, repair until checks pass](/images/blog/diagram-harness.webp)

California product teams and Florida operations teams hit the same misuse: letting the agent run against production data because “the sandbox was slow.” The harness belongs on a branch, with fixture data, in CI. I wire that discipline into [workflow automation](/services/technical-consulting/workflow-automation) when the loop has to touch a real system of record — still with an audit log, still remote.

## What the trace must contain

A harness you cannot replay is a chatbot with a terminal. Every attempt should store the goal, the diff, the exact commands, the exit codes, and the slice of stdout and stderr that the model was allowed to see. Store the model ID. Store the step index. When attempt four goes green, you should be able to show that attempts one through three failed for a reason a human recognizes — a type error, a missed fixture, a lint rule — not because the model “tried harder.”

That trace is also your bill. If eighty percent of the tokens are the model re-reading a file it already wrote, narrow the tools. If the same lint rule fails every time, fix the prompt once or fix the linter config, do not pay for the lesson on every pull request.

California and Florida product teams adopting this on a shared monorepo should start on one package with fast tests. A harness pointed at a forty-minute suite will time out, retry, and teach the model to skip tests. Short, deterministic checks are the whole design.

## The loop, without the romance

Autocomplete suggests the next line and waits. A one-shot generator writes a file and also waits, usually for you to notice it does not compile. A harness does not wait for your eyes. It writes a patch, runs the commands you allowed, reads the compiler, the linter, and the tests, and tries again until the acceptance checks pass or it hits a budget and stops.

That last clause is the whole design. “Until it works” without a budget is how a harness spends a night rewriting a file the test never asked for. The acceptance criteria are the contract: these tests, this lint config, this typecheck, and no diff outside these paths. If the criteria are vague, the model will satisfy a story it told itself. If the criteria are executable, you can see the attempt fail for a reason a human recognizes.

The model is still allowed to be wrong. The harness is not allowed to hide that. Every attempt stores the goal, the diff, the exact commands, the exit codes, and the slice of output the model was allowed to see. Store the model id. Store the step index. When attempt four goes green, you should be able to show that attempts one through three failed on a type error, a missed fixture, or a lint rule.

## What to put in the box on the first week

Start with one package and a fast suite. A harness pointed at a forty-minute test run will time out, retry, and learn to skip tests. Short, deterministic checks are not a compromise. They are the only feedback the loop can use before the budget runs out.

Give it a narrow tool list. Read a file. Write a patch. Run the test command. Run the linter. Do not give it a general shell on the first day, and do not give it your cloud credentials so it can “debug production.” The [credential problem](/blog/desktop-agent-security-credential-hijacking) shows up the moment a coding agent is also a desktop agent. A repo harness and an OS-level agent are different trust decisions. Do not collapse them because both are called agents.

Review the trace for waste. If most of the tokens are the model re-reading a file it just wrote, narrow the tools. If the same lint rule fails on every pull request, fix the prompt once or fix the linter config. Do not pay for that lesson on every branch.

## How this sits next to a human review

A green suite is not a design review. The harness proves the checks you wrote. It does not prove you wrote the right checks. Keep a person on the diff for anything that changes a public interface, a migration, or a permission. Let the harness grind through the mechanical repair: the type error, the unused import, the test that failed because a fixture name changed.

California and Florida product teams adopting this on a shared monorepo should name an owner for the harness config the same way they name an owner for CI. An unowned loop will widen its own permissions the first time a test is inconvenient. The config is the product. The model inside it should be swappable, which is why the [distillation scorecard](/blog/open-weight-frontier-parity-distillation) belongs next to this one: when you change model id, you re-run the same acceptance suite before you trust the new id to repair code.

I wire these loops into [workflow automation](/services/technical-consulting/workflow-automation) only where the checks already exist. If the team cannot say what “done” means as a command, the harness has nothing to obey.

## Key attributes and checklist

1. Start from a failing test or a command that currently exits non-zero.
2. Give the agent a worktree, not main.
3. Allowlist commands. `rm -rf`, cloud CLIs, and production deploys are not in the set.
4. Feed stderr back in full, truncated only with a stated byte cap.
5. Stop after N failed attempts and attach the trace. Infinite repair is a bill.
6. Require a human merge. The harness proposes; it does not ship.
7. Track cost per green PR, not tokens per hour. Retries are the real price.

Autocomplete can stay in the editor. The harness is how you let a model touch a repository without pretending a plausible diff is a finished one.

## An acceptance file, not a vibe

Put the definition of done in the repo as commands.

```text
pnpm typecheck
pnpm lint
pnpm test --filter web
```

The harness may not edit that file unless the task says so. It may not add a skip. It may not delete a failing test to go green. Those three bans are worth more than a longer system prompt. Encode them as checks on the diff: if a test file loses an assertion, the attempt is a failure even when the suite is red for a different reason, and it is a louder failure when the suite is green.

Cap attempts. Eight is plenty for a mechanical repair. If attempt eight is still red, stop and hand the trace to a person with the last compiler excerpt on top. A person can see a wrong assumption in a minute. The model will spend the next dollar rephrasing it. The cap is how you keep the harness from becoming the most expensive CI job you run.

When the suite is green, the pull request still shows the trace link. Reviewers should be able to open attempt one and see the original error. If the trace is missing, the green check is not evidence. It is a claim. I do not merge claims. I merge diffs that a command accepted and a person understood.

That is the standard I want on client repos as well. The harness can live in [the automation around the repo](/services/technical-consulting/workflow-automation). It should not live in a chat window that nobody can replay.

## Frequently asked questions

### What is an agentic coding harness?

A loop around a coding model that applies a patch, runs commands and tests, parses failures, and retries until acceptance criteria pass or a budget runs out.

### How is this different from autocomplete?

Autocomplete suggests the next tokens in an editor. A harness owns a goal, a terminal, and a stop condition. It is finished only when checks pass, not when the text looks plausible.

### What stops a harness from damaging the repo?

A branch or worktree, a command allowlist, a step budget, no production credentials, and a human merge. The model should not push to main.

If you want that loop on a real codebase rather than a demo repo, [say which checks define done](/contact?intent=freelance). I will tell you whether the harness is a week or a quarter.
