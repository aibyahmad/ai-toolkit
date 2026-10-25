---
name: it
description: Ship a change reliably. Runs one loop — grill the user until the goal is clear, build it to a high standard, run the checks, verify it in a real browser, get a fresh independent review, then hand over with proof. Use when the user types /ship:it, or asks to build, fix or change something and wants it done properly, verified or "shipped".
---

# /ship:it — ship more reliable code

You are about to build something for the user and prove it works before you say it's done.
Run the six steps below **in order**. A step that fails sends you back to **Build** — never skip ahead,
never hand over work that hasn't passed every step.

```
1 Grill → 2 Build → 3 Checks → 4 Verify → 5 Review → 6 Hand over
             ↑__________ anything fails ___________|
```

## Keep a run file

Create `.ship/run.json` in the project root when you start, and update it as you go. While it says the
run isn't finished, a hook stops you from ending your turn early.

```json
{
  "task": "one line: what the user asked for",
  "stage": "grill | build | checks | verify | review | done | paused",
  "checks": "pending | pass | fail",
  "verify": "pending | pass | fail",
  "review": "pending | pass | fail",
  "waiting_for_user": false,
  "loops": 0,
  "notes": []
}
```

- Set `"waiting_for_user": true` before you stop to ask the user something; set it back after they answer.
- If the user tells you to stop, set `"stage": "paused"`.
- Each time a failure sends you back to Build, add 1 to `loops` and reset every later step to `pending`.
- Add `.ship/` to `.gitignore` if it isn't there. Never commit it.

## 1. Grill — get the goal right first

Follow the [grill skill](../grill/SKILL.md). Ask until you could explain back exactly what "done" looks
like: who uses it, what they see, what happens on bad input, what must not change. Reuse decisions and
approvals already given. If the request is clear and authorized, summarize what you understood and
proceed. Ask only about missing decisions that materially affect the result.

Write the agreed goal and the **acceptance checks** (the things Verify will prove) into `notes`.

## 2. Build — to a high standard

Follow the [standards skill](../standards/SKILL.md) while you write code: clean structure, real UI states, edge cases and
security by default. Read the project's existing code and conventions first and match them. Keep the
change as small as the goal allows. For a behaviour change, write a focused test, run it and confirm
it fails for the expected reason, then make the smallest change that passes. Include relevant failure
and denied-access cases. For a refactor, establish passing behaviour tests first.

## 3. Checks — the fast, cheap safety net

Find and run the project's own checks: tests, type check, lint, build, and the project's dependency
audit (e.g. `npm audit` / `pnpm audit` / `pip-audit` / `cargo audit`) if one exists. Look in
`package.json` scripts, `Makefile`, CI workflow files and the README to find them.

- Anything red → fix the cause in Build. Don't skip, mute or delete a failing test to get green.
- If the project has no checks at all, say so in `notes` and at least run a build or a syntax check.

Set `"checks": "pass"` only when everything you ran is green.

## 4. Verify — use it like a real person would

Follow the [verify skill](../verify/SKILL.md). For UI work, start the app, open a real browser, sign in with a test account,
click through every screen and path the change touched, and capture evidence (screenshots, console
errors, network failures) in `.ship/evidence/`. Code that "should work" is not verified; only what you
saw working is. For a change without a UI, verify through its real API, CLI, or library interface instead.

Something broken or off → back to Build. Set `"verify": "pass"` only when every acceptance check passed
with evidence.

## 5. Review — a fresh pair of eyes

Follow the [review skill](../review/SKILL.md). It hands the change and the evidence to a **fresh reviewer** that didn't
write the code, and gets back ranked findings (P0–P3).

- Any P0, P1 or P2 → back to Build, then run Checks and Verify again for what you changed.
- P3s are optional polish: fix the cheap ones, list the rest for the user.

Set `"review": "pass"` only when the latest review has no P0–P2 findings.

## 6. Hand over — with proof

Set `"stage": "done"`. Then tell the user, briefly:

- **What changed** — in plain words, what they can now do.
- **Proof** — which acceptance checks passed and where the evidence is (`.ship/evidence/`).
- **Checks run** — and anything that couldn't run, with the reason.
- **Left for you** — open P3s, anything you couldn't verify, any decision that's theirs.

Don't claim anything you didn't see. If a step couldn't be completed, say so plainly instead of
calling the work done.

## Hard rules

- Never commit, push, merge, deploy or publish unless the user explicitly asked for it in this chat.
- Never put real secrets in code, logs, test data, screenshots or `.ship/`. Use test accounts only.
- Never weaken a test, check or security control to make a step pass.
- Stop and ask before anything destructive, irreversible, paid or outside the project.
- If you've looped back to Build 3 times on the same problem, stop and tell the user what's blocking
  you instead of trying a fourth time.
