# HTML Graphic Gen

Create editable graphics, animated social visuals and matching post copy with your AI agent. Give it a brief or reference, refine the result, then export PNG, MP4 and GIF.

This is Ahmad's public graphic-design skill, combining HTML graphic generation, motion and post-copy guidance. It contains one skill, a portable renderer and an editable example. There are no company-brand defaults or private runtime paths.

![Editable example included in the skill](preview.png)

## Install

### Claude Code

```text
/plugin marketplace add aibyahmad/ai-toolkit
/plugin install html-graphic-gen@ai-toolkit
```

If the marketplace is already installed, update it with `/plugin marketplace update ai-toolkit` first. Restart Claude Code, then ask:

```text
/html-graphic-gen:html-graphic-gen Create a LinkedIn graphic for my free budgeting template.
Use 1080 by 1350, a bold headline and a real preview of what people receive.
```

### Codex CLI

```sh
codex plugin marketplace add aibyahmad/ai-toolkit
codex plugin add html-graphic-gen@ai-toolkit
```

Start a new Codex session and ask: “Use the HTML Graphic Gen skill to turn this brief into a LinkedIn graphic and animated GIF.” If you already added this marketplace, run `codex plugin marketplace upgrade ai-toolkit` before adding the new plugin.

### Standalone skill

Copy the whole [skills/html-graphic-gen](skills/html-graphic-gen) directory into your agent's supported skills folder. For Codex, `~/.codex/skills/html-graphic-gen/` is a supported location; for Claude Code, `~/.claude/skills/html-graphic-gen/`. Keep the scripts, references, package files and example together. Do not overwrite an existing custom skill without a backup.

## Set up exports

The prompt/copy guidance needs no runtime beyond your agent. Actual image/video export needs Node.js 22+, pnpm and Chromium; MP4/GIF also need ffmpeg. Your coding tool/model may have its own cost. The skill does not include image generation, a model, licensed brand assets or hosting.

For a renderer setup that you can inspect and control:

```sh
git clone https://github.com/aibyahmad/ai-toolkit.git
cd ai-toolkit/plugins/html-graphic-gen/skills/html-graphic-gen
pnpm --ignore-workspace install --frozen-lockfile
PLAYWRIGHT_SKIP_BROWSER_GC=1 pnpm --ignore-workspace exec playwright install chromium
node scripts/render.mjs --html examples/starter-kit.html --out output --png
```

For motion, install ffmpeg, then:

```sh
node scripts/render.mjs --html examples/starter-kit.html --out motion --png --mp4 --gif --fps 60
```

See [the export guide](skills/html-graphic-gen/references/export.md) for high-resolution PNGs, file limits, intentional overwrites and upload packaging. The renderer blocks page scripts and non-font external requests; embed your artwork and logos in the HTML.

## Example requests

- “Turn this brief into a launch graphic. Keep the copy short and show the product.”
- “Make a six-second motion visual for this free guide. Show what the reader gets.”
- “Keep this layout and motion; show three genuinely different colour and font pairings.”
- “Keep the approved hook and rehook. Rewrite the body around the value of the download.”
- “Package the accepted post with its caption, GIF, MP4 and cover for scheduling.”

References are inspiration, not permission to copy another creator's work, identity or brand. Publish only claims and contents your resource actually supports.

## License and checks

[MIT](../../LICENSE). Third-party dependencies and assets retain their own licences.

From this repository's root, after installing the renderer dependencies:

```sh
node --test tests/*.test.mjs
claude plugin validate . --strict
claude plugin validate plugins/html-graphic-gen --strict
```
