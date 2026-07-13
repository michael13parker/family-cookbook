# Transcript Archive Index Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add every top-level Cursor session for this project to the local transcript archive and expand its README into a source-aware replay catalog.

**Architecture:** Preserve the archive's flat, gitignored JSONL layout so Claude Code and Cursor files can be passed directly to `claude-replay`. Maintain the human-readable metadata in one chronological Markdown table, with explicit source labels and blank curation fields for future visibility and bookmark decisions.

**Tech Stack:** JSONL session files, Markdown, POSIX shell verification commands

---

## File Map

- Copy into: `session-transcripts/<cursor-session-id>.jsonl` — byte-identical local snapshots of the 10 top-level Cursor sessions.
- Modify: `session-transcripts/README.md` — combined Claude Code/Cursor index, metadata columns, privacy notes, and source-specific sync commands.
- Do not modify: `.gitignore` — `session-transcripts/` is already ignored, and the existing `.gitignore` edit belongs to the user.

### Task 1: Copy Top-Level Cursor Sessions

**Files:**
- Copy: `~/.cursor/projects/Users-michaelparker-Documents-working-folders-07-2026-family-cookbook/agent-transcripts/<id>/<id>.jsonl`
- Create:
  - `session-transcripts/36c42ba2-6a4e-4a26-a940-d1418234e5d5.jsonl`
  - `session-transcripts/4255feb1-8a08-4920-8db1-79f947e9855e.jsonl`
  - `session-transcripts/428b4f9e-db78-4e24-973e-fc8b305b1878.jsonl`
  - `session-transcripts/518b8197-79de-48cc-b48b-779fb99c85bf.jsonl`
  - `session-transcripts/6382ceb2-4b8e-40a2-8ae5-8cb5f2b6df0a.jsonl`
  - `session-transcripts/844ea45c-8dd6-41d1-a981-6576bf121e6a.jsonl`
  - `session-transcripts/8a6a3065-a0d4-44ea-a6a5-be4d949d9956.jsonl`
  - `session-transcripts/a374a42b-828e-4668-9d84-9abe3ead891b.jsonl`
  - `session-transcripts/d684e5a4-694e-49d2-92e7-6fd79360608b.jsonl`
  - `session-transcripts/f74c034a-d19b-4524-b39a-19571abf41fa.jsonl`

- [ ] **Step 1: Confirm the selected source set**

Run:

```bash
printf '%s\n' "$HOME/.cursor/projects/Users-michaelparker-Documents-working-folders-07-2026-family-cookbook/agent-transcripts"/*/*.jsonl
```

Expected: exactly the 10 paths listed above; no path contains `/subagents/`.

- [ ] **Step 2: Copy the selected files without renaming**

Run:

```bash
cp "$HOME/.cursor/projects/Users-michaelparker-Documents-working-folders-07-2026-family-cookbook/agent-transcripts"/*/*.jsonl session-transcripts/
```

Expected: command exits successfully and creates the 10 destination files.

- [ ] **Step 3: Verify source and archive copies are identical**

Run:

```bash
for source in "$HOME/.cursor/projects/Users-michaelparker-Documents-working-folders-07-2026-family-cookbook/agent-transcripts"/*/*.jsonl; do
  cmp "$source" "session-transcripts/$(basename "$source")"
done
```

Expected: exit code 0 with no output.

- [ ] **Step 4: Verify the subagent transcript was excluded**

Run:

```bash
test ! -e session-transcripts/1a53e1e9-8eab-493c-99e9-9a24763ed0d4.jsonl
```

Expected: exit code 0 with no output.

### Task 2: Expand the Transcript Index

**Files:**
- Modify: `session-transcripts/README.md`

- [ ] **Step 1: Update the archive description**

Describe the directory as a local archive of both Claude Code and Cursor raw JSONL
sessions. Document both source locations and retain the warnings that timestamps are
shown in UTC and the archive is gitignored.

- [ ] **Step 2: Expand the table schema**

Use this exact header:

```markdown
| Start (UTC) | End | File | Source | Visibility | Bookmarks | Summary |
|-------------|-----|------|--------|------------|-----------|---------|
```

For every existing row:

- Set `Source` to `Claude Code`.
- Leave `Visibility` empty.
- Leave `Bookmarks` empty.
- Preserve the existing start, end, file ID, and summary text.

- [ ] **Step 3: Add the Cursor rows chronologically**

Add these rows among the existing rows by `Start (UTC)`. End times use `—` because
Cursor's event format has no native timestamps. The aborted timestamp-free session
belongs with the existing stubs at the bottom.

```markdown
| 07-10 17:09 | — | `8a6a3065…` | Cursor |  |  | Move cookbook test-family event times forward one hour for Chicago |
| 07-10 17:54 | — | `518b8197…` | Cursor |  |  | Log the example-recipe issue discovered during kickoff and first-week planning |
| 07-10 18:49 | — | `4255feb1…` | Cursor |  |  | Implement and document the fixes recorded in `docs/bug-log.md` |
| 07-10 18:59 | — | `844ea45c…` | Cursor |  |  | Reset recipe `date last cooked` values for a clean workflow demo |
| 07-10 21:01 | — | `36c42ba2…` | Cursor |  |  | Create a visual map of recipes, config, Claude commands, and MCP connections |
| 07-12 21:20 | — | `6382ceb2…` | Cursor |  |  | Reframe the workflow architecture slides for an executive audience |
| 07-12 21:27 | — | `a374a42b…` | Cursor |  |  | Produce a concise two-sentence summary of the project |
| 07-12 22:25 | — | `428b4f9e…` | Cursor |  |  | Organize the build-process presentation and its supporting visuals |
| 07-13 14:41 | — | `d684e5a4…` | Cursor |  |  | Archive and catalog Claude Code and Cursor transcripts for visual replay |
| — | — | `f74c034a…` | Cursor |  |  | Aborted Cursor request (no conversation content) |
```

- [ ] **Step 4: Add source-specific re-sync commands**

Replace the single re-sync sentence with:

````markdown
## Re-syncing the local archive

Claude Code:

```sh
cp ~/.claude/projects/-Users-michaelparker-Documents-working-folders-07-2026-family-cookbook/*.jsonl session-transcripts/
```

Cursor top-level sessions only:

```sh
cp ~/.cursor/projects/Users-michaelparker-Documents-working-folders-07-2026-family-cookbook/agent-transcripts/*/*.jsonl session-transcripts/
```

The Cursor glob intentionally excludes nested `subagents/` transcripts.
````

### Task 3: Validate the Archive and Index

**Files:**
- Verify: `session-transcripts/*.jsonl`
- Verify: `session-transcripts/README.md`

- [ ] **Step 1: Verify all indexed short IDs resolve uniquely**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
import re

archive = Path("session-transcripts")
readme = (archive / "README.md").read_text()
ids = re.findall(r"`([0-9a-f]{8})…`", readme)
files = list(archive.glob("*.jsonl"))

assert len(ids) == 28, f"expected 28 indexed sessions, found {len(ids)}"
for short_id in ids:
    matches = [path for path in files if path.name.startswith(short_id)]
    assert len(matches) == 1, (short_id, matches)
print("28 indexed sessions resolve uniquely")
PY
```

Expected: `28 indexed sessions resolve uniquely`.

- [ ] **Step 2: Verify table shape and metadata defaults**

Run:

```bash
python3 - <<'PY'
from pathlib import Path

lines = Path("session-transcripts/README.md").read_text().splitlines()
rows = [
    line for line in lines
    if line.startswith("| ") and not line.startswith("| Start (UTC)")
]

assert len(rows) == 27, f"expected 27 rows, found {len(rows)}"
for row in rows:
    cells = [cell.strip() for cell in row.strip("|").split("|")]
    assert len(cells) == 7, (len(cells), row)
    assert cells[3] in {"Claude Code", "Cursor"}, row
    assert cells[4] == "", row
    assert cells[5] == "", row
print("27 rows have valid sources and blank curation fields")
PY
```

Expected: `27 rows have valid sources and blank curation fields`.

- [ ] **Step 3: Confirm privacy behavior and unrelated changes**

Run:

```bash
git check-ignore session-transcripts/README.md session-transcripts/d684e5a4-694e-49d2-92e7-6fd79360608b.jsonl
git status --short
```

Expected:

- Both archive paths are reported as ignored.
- The user's pre-existing `.gitignore` modification remains untouched.
- Only the approved design/plan documents may appear as additional tracked changes.

- [ ] **Step 4: Review the final diff**

Because `session-transcripts/` is ignored, inspect its README directly and use
`git diff -- .gitignore docs/superpowers/` to verify no unrelated tracked content
was changed. Do not create a commit unless the user explicitly requests one.
