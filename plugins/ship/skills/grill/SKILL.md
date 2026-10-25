---
name: grill
description: Interview the user until the goal of a change is completely clear before any code is written — what done looks like, edge cases, what must not change. Use at the start of /ship:it, or when the user says "grill me" or asks to make sure you understand before building.
---

# Grill — understand before you build

Most agent work goes wrong before the first line of code: it builds the wrong thing. Your job here is to
reach a shared, specific picture of "done" with the user. Questions are cheap. Rebuilding is not.

## How to grill

1. **Look first, ask second.** Read the relevant code, docs and existing screens before asking anything.
   Never ask the user for a fact you can find yourself (file names, current behaviour, which framework).
   The user decides; you research.
2. **Ask one question at a time.** Pick the most important missing decision, keep it short, and give
   your recommended answer so the user can just say "yes":

   ```
   Q1. Who can use this? → I'd say: signed-in users only.
   ```

3. **Wait for the answer**, then ask the next question if needed. Research facts yourself.
4. **Stop when the important decisions are clear.** Play the goal back in 3–6 bullets. Reuse prior
   approvals; do not ask the user to confirm the same decision again. Ask for approval only where the
   project or action requires it and it has not already been given.

## What to pin down

Cover whichever of these apply. Skip the ones that clearly don't.

- **Outcome:** what can the user do afterwards that they can't do now? How will they know it worked?
- **Who:** which users or roles; who must *not* be able to do this.
- **Where:** which screens, endpoints, commands or files are in scope — and which are not.
- **Data:** what is created, changed or deleted; what happens to existing data.
- **Edge cases:** empty, huge, invalid or duplicate input; slow or failed network; double submit;
  no permission; first-time user; mobile.
- **Must not break:** existing behaviour, APIs or flows that have to stay the same.
- **Security:** any secrets, personal data, payments, uploads or third-party calls involved.
- **Proof:** the 3–8 **acceptance checks** that will prove it works. Write them so they can be tested
  in a browser or with a command, e.g. "A signed-out visitor who opens /settings is sent to sign-in."

## Output

Write the agreed goal and acceptance checks into `.ship/run.json` → `notes` (when running inside
/ship:it), then move on. If the user says "just build it", play back your assumptions in one short list
first so they can correct anything important.
