---
name: review
description: Get an independent review of a change from a fresh agent that didn't write it — against the goal, for regressions, security, reliability, tests and docs — with ranked P0–P3 findings. Use after verify inside /ship:it, or whenever the user asks for a code review of the current changes.
---

# Review — a fresh pair of eyes

The agent that wrote the code is the worst one to review it. Hand the change to the **ship:reviewer**
subagent, which starts with no memory of how the code was written.

## 1. Prepare the brief

Collect, without summarising away detail:

- **The goal and acceptance checks** (from `.ship/run.json` → `notes`).
- **The exact change.** Prefer `git diff` against the starting point of this work, including
  uncommitted and new files (`git status`, `git diff`, `git diff --cached`, and the contents of any
  untracked files you created). If the project isn't a git repo, list every file you changed.
- **The evidence** in `.ship/evidence/` (the verify notes and screenshot names).
- **What checks ran** and their results.

## 2. Run the reviewer

Launch the `ship:reviewer` subagent with that brief. Tell it to review the whole change before
answering and to return findings in its standard format. On another host, use its fresh-agent feature
and give it [the reviewer instructions](../../agents/reviewer.md). If no independent reviewer is
available, report that limit and request a separate reviewer session. A clean second pass by the
builder is self-review, not independent review; do not mark `review` as passed on that basis.

## 3. Act on the findings

- **P0, P1, P2** → fix them in Build, then re-run Checks and re-verify whatever the fix touched, then
  review again. A new change makes the old review stale.
- **P3** → fix the quick ones; list the rest for the user at hand-over.
- **You disagree with a finding** → only dismiss it with a concrete reason (e.g. "the input is already
  validated in X"), and tell the user at hand-over. Never ignore a security finding silently.

Set `"review": "pass"` when the latest review on the latest change has no P0–P2 findings.

## Severity

| Level | Meaning | Examples |
|---|---|---|
| **P0** | Breaks things or is dangerous right now | data loss, leaked secret, anyone can access other users' data, app won't start |
| **P1** | The goal isn't met, or a serious bug/hole | acceptance check fails, missing permission check, crash on a common path, unverified behaviour |
| **P2** | Real problem that will bite soon | missing error/empty state, unhandled edge case, regression risk, no test for changed behaviour, outdated docs |
| **P3** | Worth improving, safe to ship | naming, small duplication, minor polish |
