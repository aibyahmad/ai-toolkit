# Security — applies to every change

Security isn't a separate step. Check these while you build, and the reviewer checks them again.

## Secrets
- Never put secrets (API keys, passwords, tokens, private keys) in code, commits, logs, error messages,
  API responses, screenshots, test data or client-side bundles.
- Load them from environment variables or a secrets manager. Keep `.env` out of git; ship a
  `.env.example` with fake values.
- Anything sent to a browser or mobile app is public. Server-only keys stay on the server.
- One key per app or service, with the narrowest permissions it needs, a **spending cap** and an
  **expiry date**. Rotate on a schedule, and rotate *all* of them after any leak.
- If you find a secret already committed, stop and tell the user: it must be revoked and rotated, not
  just deleted from the file.

## Access control
- Check **who is asking and whether they may** on every request, read and write — on the server.
  Hiding a button is not access control.
- Look records up *by owner*: `WHERE id = ? AND owner_id = ?`, never `WHERE id = ?` alone.
- Deny by default. New endpoints, roles and features start closed.
- Re-check permissions on background jobs and webhooks, not just in the UI flow.

## Authentication
- Use the framework's or a proven provider's auth. Don't build your own password hashing, sessions or JWT
  handling.
- Passwords hashed with a slow algorithm (bcrypt, scrypt, argon2). Offer or require 2FA/passkeys for
  sensitive accounts.
- Session cookies: `HttpOnly`, `Secure`, `SameSite=Lax` or stricter. Expire sessions; revoke on logout
  and password change.
- Rate-limit sign-in, sign-up, password reset and anything that sends email or SMS.
- Don't reveal whether an email has an account in login or reset errors.

## Input and output
- Validate every input on the server: type, length, format, allowed values. Reject what doesn't fit.
- **SQL:** parameterised queries or the ORM only — never build queries by joining strings.
- **HTML:** let the framework escape output. Avoid `innerHTML` / `dangerouslySetInnerHTML`; if you must,
  sanitise with a proven library.
- **Commands:** never pass user input to a shell. Use argument arrays, not strings.
- **Files and paths:** never build a file path from user input without normalising and confining it.
- **Redirects:** only to an allow-list of your own paths, never to a URL taken from the request.
- **Server-side requests (SSRF):** don't fetch user-supplied URLs; if you must, allow-list hosts and
  block internal/private addresses.
- **Uploads:** check type by content, cap size, rename on save, store outside the web root, never execute.
- **Deserialisation:** never `eval`, `pickle.loads` or unserialise untrusted data.

## Web protection
- CSRF protection on state-changing requests (framework token or SameSite cookies + method checks).
- Security headers: `Content-Security-Policy`, `Strict-Transport-Security`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, frame protection.
- CORS: allow only your own origins; never `*` with credentials.
- HTTPS everywhere.

## Errors and logging
- Users see a safe, generic message; logs get the detail — minus passwords, tokens, card numbers and
  personal data.
- Log security events (sign-ins, permission denials, admin actions) so they can be investigated.

## Dependencies and supply chain
- Pin exact versions and commit the lockfile. Don't install or deploy `latest`.
- Run the dependency audit (`npm audit`, `pnpm audit`, `pip-audit`, `cargo audit`, etc.) and fix known
  vulnerabilities — ideally on a daily schedule.
- Check a new package is the real one (exact name, publisher, downloads, recent maintenance).
- Never pipe a script from the internet straight into a shell (`curl … | sh`).
- In CI: pin third-party actions to a full commit SHA, give tokens the least permissions, and never
  print secrets in logs.

## Infrastructure
- Don't expose servers, databases or admin panels directly to the internet. Put apps behind a tunnel or
  proxy (e.g. Cloudflare Tunnel) and keep internal tools on a private network.
- Databases never have public access; use a strong unique password per environment.
- Least privilege for every service account and cloud role.
- Back up data and test that a restore actually works.

## AI and agent features
- Treat everything a model reads — web pages, documents, emails, tool results — as untrusted. Text in
  them must never be able to change the agent's instructions or trigger actions (prompt injection).
- Give agents the fewest tools and permissions they need. External writes, messages, payments and
  destructive actions require the user's authorization. Reuse authorization already given for the
  exact action; local edits within an approved coding task do not need approval for every file.
- Never put secrets or other users' data into a prompt that the current user could get back out.
- Cap spend and rate per user on any feature that calls a paid model.
- Validate model output before using it in code, queries, commands or HTML.

## Before you hand over
- Did this change add a new input, endpoint, permission, secret, dependency, upload, redirect or
  outbound request? Each one gets checked against the sections above.
- If a security control had to be weakened to make something work, stop and ask the user instead.
