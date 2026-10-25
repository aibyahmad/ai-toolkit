# UI and design

## Clarity first
- Each screen has one obvious purpose and one primary action. A new user should know what to do in seconds.
- Hierarchy through size, weight, spacing and contrast: the important thing first, metadata last.
- Remove anything that doesn't help someone understand, act or get feedback.

## Consistency
- Use the project's design system: its components, colours, spacing scale, type sizes, radii and icons.
- No one-off colours, random margins or new button styles. Reuse a component with a variant instead.
- The same action looks and behaves the same everywhere.

## Every state is a screen
Design and build all that apply, not just the happy path:
- **Loading** — skeleton or spinner where content will appear; no layout jump when it arrives.
- **Empty** — says what this is and what to do next, with the action right there.
- **Error** — says what went wrong in plain words and how to fix or retry. Never a raw stack trace.
- **Success** — clear confirmation the action worked.
- **Disabled / pending** — buttons show they're working and can't be double-clicked.
- **No permission** — explains why, doesn't just show a blank page.
- **Partial / long data** — long names truncate gracefully, huge lists paginate or virtualise.

## Responsive
- Works on a phone (~390px wide) and on desktop. Stack instead of squashing; no sideways scrolling.
- Touch targets at least ~44px. Nothing important hidden behind hover only.

## Forms
- Labels on every field (not just placeholders). Mark required fields.
- Validate as the user goes, but don't shout before they've typed. Errors sit next to the field.
- Keep what they typed when something fails. Disable submit while it's sending.

## Accessibility
- Semantic HTML (`button` for buttons, `a` for links, headings in order).
- Everything works with a keyboard, with a visible focus ring.
- Text contrast at least 4.5:1. Images have alt text; icon-only buttons have an accessible name.
- Don't use colour alone to show meaning.

## Copy
- Short, plain words. Say what the user gets, not how the system works.
- Buttons are verbs: "Save changes", not "OK".
- No jargon, internal names or codes in user-facing text.

## Motion and performance
- Animation only to explain change or give feedback; fast and smooth; respects reduced-motion settings.
- No jank: optimise images, avoid needless re-renders, keep bundles lean.
