---
name: standards
description: The engineering standard to build to — clean code, real UI states, edge cases, security by default and meaningful tests. Use whenever writing or changing code, especially inside /ship:it's build step, and when reviewing code against good practice.
---

# Standards — build it like it has to last

Read the project's existing code first and **match its conventions**: language, structure, naming,
package manager, styling system, test framework. These standards fill the gaps; the project's own rules
win where they're stricter.

Load the reference for what you're touching:

| Working on | Read |
|---|---|
| Any code | [references/code.md](references/code.md) |
| Screens, components, forms, copy | [references/ui.md](references/ui.md) |
| Anything with input, data, network or users | [references/edge-cases.md](references/edge-cases.md) |
| Anything at all — security applies everywhere | [references/security.md](references/security.md) |
| Tests | [references/tests.md](references/tests.md) |

## The short version

1. **Small and focused.** One job per function and file. Smallest change that meets the goal.
2. **Boring beats clever.** Explicit, readable code someone else can debug at 2am.
3. **Fix the cause, not the symptom.** No silent catch-and-ignore, no hard-coded special cases.
4. **Every state is designed.** Loading, empty, error, success, no permission — not just the happy path.
5. **Assume bad input and bad networks.** Validate, time out, retry sensibly, fail safely.
6. **Secure by default.** Check permissions on every action, never trust the client, never leak secrets.
7. **Test what users see.** Behaviour through the public interface, including the failure cases.
8. **Leave no mess.** No TODOs, debug logs, dead code, commented-out blocks or fake placeholders.
