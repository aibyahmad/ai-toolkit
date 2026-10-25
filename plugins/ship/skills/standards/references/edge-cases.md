# Edge cases — the checklist

Go through what applies to the change. Each one either gets handled in code or is consciously out of scope.

## Input
- Empty, whitespace-only, very long, unicode/emoji, leading/trailing spaces.
- Wrong type or format (text in a number field, bad email, malformed JSON).
- Negative, zero, huge numbers; decimals and rounding for money.
- Duplicates: the same item submitted twice, the same name used twice.
- Files: empty, huge, wrong type, wrong extension, malicious content.

## Data
- No data yet (first-time user), exactly one item, thousands of items.
- Deleted or missing records still referenced elsewhere.
- Old data in a shape the new code doesn't expect.
- Timezones, daylight saving, dates at month/year boundaries, locale formats.

## Users and access
- Signed out; session expired mid-action.
- A user trying to read or change someone else's data by changing an ID in the URL or request.
- Roles: each role sees and can do only what it should.
- The same user in two tabs or two devices at once.

## Network and timing
- Slow responses: show progress, time out sensibly.
- Failed requests: clear error, retry where safe, nothing left half-saved.
- Double click / double submit: the action happens once.
- Out-of-order responses: an older answer must not overwrite a newer one.
- Offline or flaky connection on mobile.

## Systems
- Third-party API down, slow, rate-limited or returning something unexpected.
- Background jobs that run twice, run late, or crash halfway.
- Partial failure across several steps: either all of it happens or it can be safely retried.
- Limits: rate limits, quotas, max sizes, and what the user sees when they hit them.
