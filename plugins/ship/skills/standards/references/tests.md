# Tests

- **Test behaviour, not implementation.** Go through the public interface (the endpoint, the component as
  a user sees it, the exported function) and assert on what comes out. Tests shouldn't break when you
  refactor internals.
- **One behaviour per test**, named as a sentence: `rejects an expired invite`, `shows the empty state
  when there are no projects`.
- **Cover the unhappy paths**: invalid input, no permission, not found, the dependency failing.
- **For a bug fix, write the failing test first**, watch it fail for the right reason, then fix.
- **No weakening.** Never skip, delete, loosen or `.only` a test to get green. If a test is wrong, fix it
  and say why.
- **Deterministic**: no real network, real time or random data without control. Fix the clock, seed
  randomness, fake external services at their boundary.
- **Fast and isolated**: each test sets up its own data and cleans up; order doesn't matter.
- **Tests must fail clearly.** A test that hangs, runs out of memory or passes because the process
  crashed proves nothing.
- Keep test data obviously fake. Never put real credentials or personal data in tests or fixtures.
