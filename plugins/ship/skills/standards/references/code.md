# Code

## Structure
- One clear job per function, component, module and endpoint. If you need "and" to describe it, split it.
- Keep UI, business logic, data access and external calls apart.
- Keep functions short and shallow: early returns over deep nesting; aim for under ~15 branches per function.
- Prefer plain functions and data over class hierarchies, factories and magic registration.
- No hidden side effects: importing a file must not write data, send email or call an API.

## Naming
- Names say what something *means*, not what type it is: `unpaidInvoices`, not `list2` or `data`.
- Booleans read as questions: `isExpired`, `hasAccess`, `canEdit`.
- Match the names the project and its users already use for the same idea.

## Errors
- Handle the failures you expect, explicitly. Show users a safe, useful message; log the detail (minus secrets).
- Never swallow errors silently (`catch {}`), and never return fake success.
- Separate "retry might work" (timeouts, 503) from "never will" (bad input, 403).

## Data and types
- Treat types and schemas as contracts. Avoid `any`, `as` casts and ignore-comments unless there's a written reason.
- Validate data at the edges (requests, files, third-party responses) and trust it inside.
- Migrations must be safe for existing data and for the previous version still running.

## Dependencies
- Prefer what the project already uses. Add a new dependency only when it clearly earns its place.
- Check it's the real, maintained package (spelling, publisher, downloads, recent releases) — typosquats are common.
- Pin exact versions and commit the lockfile.

## Cleanliness
- No TODO/FIXME, debug `console.log`/`print`, commented-out code, dead branches or unused imports.
- Don't copy-paste blocks; reuse what exists. But a little duplication beats the wrong abstraction.
- Comments explain *why* a decision was made, not what the next line does.
- Keep docs (README, setup, API docs) in step with behaviour you changed.
