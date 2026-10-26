---
name: html-graphic-gen
description: Create graphics, animated social visuals and accompanying post copy from a brief or reference using HTML/CSS. Export PNG, MP4 and GIF. Use for posters, social cards, banners, lead magnets, reference-based graphics, post copy and motion previews. Not for building product application screens.
license: MIT
---

# HTML Graphic Gen

Turn a message or reference into an editable HTML graphic, a real animation when requested, and useful accompanying copy. Work in the user's project/output folder; this skill's files are reusable tools, not a place to save their private work.

## 1. Choose the requested output

- **Graphic:** design the single idea or offer. Read [references/design.md](references/design.md).
- **Motion:** build meaningful CSS animation and export a playable GIF or MP4, not only a still. Read [references/export.md](references/export.md).
- **Post copy:** write the requested hook, rehook or full post. Read [references/copy.md](references/copy.md). Do not silently rewrite approved copy during visual changes.
- **Package:** pair the latest accepted caption with its matching accepted visual and validated upload files.

Infer dimensions, audience, brand, platform and output location from the brief and project context. If only a social post is specified, use 1080 × 1350 (4:5). Ask only for a missing decision that materially changes the result. Respect the user's brand; do not impose one company's palette, logo, typeface or voice on another user.

## 2. Make one clear idea visible

For a lead magnet, show the actual resource format and useful outcome: a plugin can look installable, a guide can have a preview, a kit can show its included assets. A process diagram alone may fail to make the download desirable. Keep the exact prompts/setup in the resource while explaining what the reader receives.

Use real, relevant product logos supplied by the user or obtained from a legitimate source. Keep their colours and keep them visible throughout the animation. Do not imply unsupported integrations, sponsorship or endorsements. If a mark is unavailable, use a truthful text label rather than inventing it.

Reduce text to the headline, necessary short labels and CTA. Choose type and colour for this graphic; do not repeat one font stack or palette on every post. For new-direction variants, explore different visual ideas too. For a colour/type-only revision, preserve the accepted layout and motion.

Study supplied references using the available image/video/browser tools. If asked to use the user's profile or Featured posts, inspect the actual copy/visuals through the available browser controls. Read only unless a separate action is authorized. Engagement counts are observations, not proof that a design choice caused performance.

## 3. Build the HTML

Use one standalone HTML file with an exact-size canvas, no body margin and no overflow. Include:

```html
<meta name="width" content="1080">
<meta name="height" content="1350">
<meta name="duration" content="6">
<meta name="still" content="2">
```

Use CSS animations only. Embed images as data URIs; do not depend on local absolute paths or remote image links. Inline SVG works well for original icons and simple shapes. The renderer permits Google Fonts styles/fonts; embed other fonts as data URIs. Page JavaScript, frames, forms and other external requests are blocked by its content policy.

Keep the first frame useful. Have the whole composition present early. Motion should demonstrate an input becoming output, an install, an example or the offered asset; calm floating can support it. Avoid blank starts, bouncing arrivals and fading the whole scene away. Complete whole animation cycles by the clip's end.

## 4. Preview, check and refine

Use [references/export.md](references/export.md) for setup and commands. `examples/starter-kit.html` is an editable example, not a mandatory design template.

First render a PNG and inspect alignment, overflow, legibility and contrast at feed size. Then render actual motion and inspect beginning/middle/end frames. Open a fitted live HTML preview through available browser controls when supported. Deliver the GIF/MP4 as well; a static image alone does not complete an animation request.

Preserve accepted choices and save versions before changing direction. Do not silently change the message when the user asks only for a logo, colour, font or timing change.

## 5. Deliver useful files

Save the HTML source and selected exports, plus `post.txt` if copy was requested. For an unspecified social scheduler, 1080 × 1350 is a useful upload size; a compact GIF target is under 5 MB and at most 250 frames. Check the actual platform/scheduler requirements before claiming upload compatibility. Include a smooth H.264 MP4 and PNG cover as alternatives. High-resolution PNGs are available with `--scale 3`.

Verify dimensions, byte size, frame count, duration and caption length before calling a package ready. Keep rejected variants and old copy outside the final upload folder. Publishing, scheduling or sending the resource needs its own authorization; creating the local assets does not authorize it.
