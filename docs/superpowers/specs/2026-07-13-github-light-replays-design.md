# Unify replays on github-light

**Date:** 2026-07-13  
**Status:** Approved for implementation

## Goal

Make the replay gallery index and individual session HTML pages a continuous **github-light** experience that survives `npm run replay:build`.

## Decisions

- Use claude-replay’s built-in `--theme github-light` (no custom theme file).
- Restyle the gallery template in `scripts/build-replays.mjs` to github-light-aligned CSS tokens.
- Regenerate committed `replays/index.html` and `replays/sessions/*.html` via the build pipeline.
- Keep Claude/Cursor brand logo colors unchanged.
- Out of scope: Solarized custom themes, layout redesign, timing/redaction/bookmark changes.

## Token mapping (gallery)

| Token | Value |
| --- | --- |
| `color-scheme` | `light` |
| `--bg` | `#ffffff` |
| `--surface` | `#f6f8fa` |
| `--border` | `#d0d7de` |
| `--text` | `#1f2328` |
| `--muted` | `#656d76` |
| `--accent` | `#0969da` |
| `--star` | `#bc4c00` |
| `--claude` / `--cursor` | unchanged |

Session pages get the full github-light palette from claude-replay (`--accent` purple `#8250df`, etc.). Gallery link accent uses GitHub blue for readability on white cards.

## Implementation

1. Update `scripts/build-replays.mjs`: gallery CSS + `--theme github-light` on each CLI invoke.
2. Extend `test/replay-gallery.test.mjs` to assert light gallery tokens.
3. Run `npm test` and `npm run replay:build`.
