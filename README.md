# AI Toolkit

Reusable skills, prompts, tools, and resources by Ahmad.

## Resources

| Resource | What it does |
| --- | --- |
| [Ship](plugins/ship/README.md) | Helps your coding agent build the right thing, check it, use it, and get a fresh review before handing it over. |
| [HTML Graphic Gen](plugins/html-graphic-gen/README.md) | Create graphics, animated visuals and matching post copy, with PNG/MP4/GIF export. |

## Install Ship

In Claude Code:

```text
/plugin marketplace add aibyahmad/ai-toolkit
/plugin install ship@ai-toolkit
```

Then restart Claude Code and run:

```text
/ship:it add a dark mode toggle to settings
```

In the Codex CLI:

```sh
codex plugin marketplace add aibyahmad/ai-toolkit
codex plugin add ship@ai-toolkit
```

Start a new Codex session and ask: "Use the Ship plugin's it skill to add a dark mode toggle to settings."

See [Ship's guide](plugins/ship/README.md) for prerequisites, setup, the individual skills, and the differences between tools.

## Other creators

[Grill / grilling](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md) is by Matt Pocock. Get it from [the original repository](https://github.com/mattpocock/skills); it is not included or presented as Ahmad’s work here.

## License

[MIT](LICENSE). The resources are free; your coding tool, model usage, and hosting may have their own costs.
