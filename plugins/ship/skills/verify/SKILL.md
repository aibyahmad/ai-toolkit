---
name: verify
description: Prove a change works by using it like a real person — start the app, open it in a real browser, sign in with a test account, click through every screen and path the change touched, and capture evidence. Use after building, inside /ship:it, or whenever the user asks to verify, test in the browser or "prove it works".
---

# Verify — only what you saw working counts

Tests passing is not the same as the feature working. Verify means you **ran it and used it**, and you
have evidence.

## 1. Know what you're proving

Use the acceptance checks agreed in the grill step (`.ship/run.json` → `notes`). If there are none,
write them now from the request: one check per behaviour, plus the main failure cases.

## 2. Run the app

- Find how the project starts: README, `package.json` scripts, `Makefile`, `docker-compose`, framework
  defaults. Start it in the background and wait until it answers.
- Use a **local or test environment only**. Never verify against production or real customer data.
- If the change has no UI (an API, CLI or library), verify it the way its user would: call the endpoint,
  run the command, use the function from a tiny script — and save the real output as evidence.

## 3. Use a real browser

Use whichever browser tool you have: a browser extension tool (e.g. Claude in Chrome), a Playwright or
Puppeteer MCP server, or a short Playwright script you run yourself. Prefer a fresh, clean session.

- **Sign in with a test account.** Use credentials from the project's seed data, `.env.example` or test
  fixtures, or create a throwaway test user locally. Never type the user's real passwords. If you can't
  get a test login, ask the user for one and set `waiting_for_user`.
- **Walk every acceptance check** step by step, as a person would: click, type, submit, go back.
- **Try the edges:** empty state, invalid input, a slow or failed request if you can simulate it, a
  user without access, a phone-sized screen (about 390×844) as well as desktop.
- **Watch the console and network** for errors, failed requests and warnings the change introduced.

## 4. Save evidence

Put everything in `.ship/evidence/`:

- A screenshot for each acceptance check (name it after the check, e.g. `03-signed-out-redirect.png`).
- Desktop and phone screenshots of each changed screen.
- `verify.md`: each check with **pass/fail**, what you did, what you saw, and any console or network
  errors. Keep secrets and personal data out of screenshots and notes.

## 5. Decide

- **Every check passed, nothing new in the console** → set `"verify": "pass"`.
- **Anything failed or looked wrong** (broken layout, wrong copy, missing state, error in console) →
  `"verify": "fail"`, write what failed in `notes`, go back to Build. After the fix, re-verify the
  failed checks *and* anything the fix could have touched.
- **Couldn't verify something** (no browser tool, no test account, needs real hardware) → say exactly
  what wasn't verified and why. Never mark it as passed.

Stop the app processes you started when you're done.
