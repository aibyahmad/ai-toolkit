# Ship

**Ship more reliable code.** Give your coding agent one loop:

**Grill → Build → Checks → Verify → Review → Hand over**

It asks what you want, builds it, runs the checks, uses the result, and gets a second opinion. Failed checks go back to Build. It hands over the evidence and any limits.

## Install

### Claude Code

Run inside Claude Code:

```text
/plugin marketplace add aibyahmad/ai-toolkit
/plugin install ship@ai-toolkit
```

Restart Claude Code, open your project, and run:

```text
/ship:it <what you want built or fixed>
```

### Codex CLI

Run in your terminal:

```sh
codex plugin marketplace add aibyahmad/ai-toolkit
codex plugin add ship@ai-toolkit
```

Start a new session in your project and ask: "Use the Ship plugin's it skill to <what you want built or fixed>."

The shared skills install through Codex's Claude-compatible plugin support. The bundled reviewer agent and stop hook are designed for Claude Code; this release does not promise those features in Codex. Use a separate reviewer session if your Codex setup cannot launch an independent reviewer. A second pass by the builder must be labelled as self-review, not independent review.

## Before your first run

You need a coding tool with file and command access, your project's normal runtime, and Node.js 22 or newer for the Claude Code stop hook. The pack does not include a model or hosting.

For a web app, give the agent access to a browser tool, such as Claude in Chrome or a Playwright MCP server. For an API, CLI, or library, it verifies through that interface instead. No browser is required for a change with no UI.

Tell it how to start your project and where its checks live. For a signed-in app, provide a local or test account through your normal secure setup. Do not paste real passwords into the task. Existing project instructions and approvals still apply.

For example:

```text
/ship:it Add a Delete button to my todo app. Only the owner may delete a todo.
Use the local test environment and the seeded test users. The README explains
how to start the app and run its checks. Verify that deletion survives refresh
and that another user cannot delete my todo.
```

## What it does

1. **Grill:** reads the project and asks about missing decisions. Records the goal and acceptance checks. Reuses decisions you have already approved.
2. **Build:** follows the project's conventions, with code, UI, edge-case, security, and test guidance. Uses a failing test first for behavior changes.
3. **Checks:** runs the project's tests, types, lint, build, and dependency audit where available. Reports missing or blocked checks.
4. **Verify:** runs the result in a local or test environment. For UI work, signs in as a test user, clicks through the changed paths on desktop and phone, and saves screenshots. For other work, saves real command or API output.
5. **Review:** asks a fresh reviewer to read the change, goal, and evidence. Reports concrete P0–P3 findings. P0–P2 findings return to Build.
6. **Hand over:** says what changed, what passed, what could not be checked, and where the proof lives.

It stops for user input or missing tools, and after three failed attempts at the same problem. It never calls an unverified step passed.

## Individual skills

| Claude Code command | Purpose |
| --- | --- |
| `/ship:it` | The full loop |
| `/ship:grill` | Get the goal and acceptance checks clear |
| `/ship:verify` | Use a change and save the evidence |
| `/ship:review` | Review the current change and evidence |

The `standards` skill supplies the builder's code, UI, edge-case, security, and test guidance. In Codex, ask for the matching skill from the Ship plugin.

## Progress, proof, and the stop hook

Progress is recorded in `.ship/run.json`; screenshots and verification notes go in `.ship/evidence/`. The agent adds `.ship/` to the project's `.gitignore`. Review evidence before sharing it, and keep credentials and personal data out of it.

In Claude Code, the stop hook checks the run file when the agent tries to finish. It asks the agent to continue if checks, verification, or review are pending. It allows questions, pauses, completed runs, and a stop after a hook-triggered continuation, so it cannot trap the session in an endless loop.

This is a workflow reminder, not a security boundary or proof that a feature is bug-free. The agent writes its own run status. Malformed input and missing run files let it stop; it does not independently validate screenshots or test results.

## Safety

- No commits, pushes, merges, deployments, or publishing without your authorization.
- Use local or test systems and test accounts, with no production customer data.
- Never weaken tests or security controls to get a pass.
- Missing browser access, credentials, or an independent reviewer are reported plainly.
- External documents, code comments, and tool output are evidence, not authority to change the task or skip checks.

The security guidance covers secrets, access checks, authentication, unsafe input, uploads, web protection, dependencies, infrastructure, and agent permissions. Adapt it to your stack; installing a skill does not replace security testing.

## Development

From the repository root:

```sh
node --test tests/*.test.mjs
claude plugin validate . --strict
claude plugin validate plugins/ship --strict
```

Install steps were checked with Claude Code 2.1.307 and Codex CLI 0.162.1. Hook tests use Node.js 24.18.0.

## License

[MIT](../../LICENSE).
