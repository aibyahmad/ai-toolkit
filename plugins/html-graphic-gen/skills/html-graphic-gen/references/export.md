# Render and package

## Install the renderer once

You need Node.js 22 or newer and pnpm. Run these commands from the directory containing this skill's `package.json` (not from your application root):

```sh
pnpm --ignore-workspace install --frozen-lockfile
PLAYWRIGHT_SKIP_BROWSER_GC=1 pnpm --ignore-workspace exec playwright install chromium
```

For MP4 and GIF, install ffmpeg using your operating system's package manager. On macOS, `brew install ffmpeg` is one option. Otherwise use the [official ffmpeg download links](https://ffmpeg.org/download.html). The renderer uses `ffmpeg` on PATH, or the binary named by `FFMPEG_PATH`.

The renderer opens a fresh headless Chromium profile. It renders your standalone HTML, not a logged-in browser or website. Page scripts are blocked. Images must be embedded, and remote fonts are limited to Google Fonts. Run it only on graphics you own or have permission to use.

## Try the included example

```sh
node scripts/render.mjs --html examples/starter-kit.html --out output --png
```

For a 3x PNG:

```sh
node scripts/render.mjs --html examples/starter-kit.html --out output-3x --png --scale 3
```

For all three formats:

```sh
node scripts/render.mjs --html examples/starter-kit.html --out motion --png --mp4 --gif --fps 60 --gif-fps 20 --gif-width 1080
```

Existing named files are protected. Use `--overwrite` for an intentional replacement, or choose another output folder/name. `node scripts/render.mjs --help` lists the options.

The HTML metadata defines width, height, duration (1–30 seconds) and still time. Keep all CSS animation cycles aligned to the duration. The renderer seeks CSS animations frame by frame; JS-driven effects and iframe animations are outside its contract. `still` chooses the cover time. MP4 needs even scaled dimensions.

## Scheduling package

For an unspecified social scheduler, a compact starting profile is 1080 × 1350 (4:5), GIF under 5 MB and at most 250 frames, plus an H.264 MP4 and PNG cover. Verify current requirements for the platform and route being used. LinkedIn's scheduler/API frame limit can differ from native media surfaces. Sources: [Assets API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/vector-asset-api), [supported media](https://www.linkedin.com/help/linkedin/answer/a792945).

The renderer caps GIF sampling to 240 frames and rejects a GIF at or above 5 MB. If it reports an oversized file, lower `--gif-fps` or `--gif-width` and rerun with `--overwrite`. Inspect the actual output before uploading; no renderer can verify a third-party scheduler's processing without testing that upload.

Keep the upload folder clear: `post.txt`, `animation.gif`, `video.mp4`, `cover.png`. Keep the HTML and high-resolution masters separately. Check actual dimensions, duration, frame count and file size, plus first/middle/last frames. Read the caption against the final graphic. Then open the folder when requested. Exporting does not authorize publishing.
