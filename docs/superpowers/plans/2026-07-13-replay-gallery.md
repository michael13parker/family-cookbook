# Replay Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Commit only reviewed transcript JSONLs and build a committed, privacy-filtered gallery of individual `claude-replay` sessions.

**Architecture:** The Markdown transcript index remains the visibility source. A tested Node module parses and validates it, a build script invokes pinned `claude-replay@0.8.1` only for publishable sessions, and a generated gallery links the resulting self-contained HTML files.

**Tech Stack:** Node.js 18+, npm, Node built-in test runner, `claude-replay@0.8.1`, HTML/CSS

---

## File Map

- Modify: `.gitignore` — fail-closed transcript rules and `node_modules/`.
- Commit: `session-transcripts/README.md` — catalog and build instructions.
- Commit: 13 reviewed, email-masked `session-transcripts/*.jsonl` files.
- Create: `package.json`, `package-lock.json` — pinned tooling and scripts.
- Create: `scripts/mask-transcripts.mjs` — deterministic email-local-part masking.
- Create: `test/mask-transcripts.test.mjs` — masking and JSONL-validity tests.
- Create: `replay.config.json` — gallery title and featured session IDs.
- Create: `scripts/replay-catalog.mjs` — pure catalog parsing, validation, resolution, and ordering.
- Create: `scripts/build-replays.mjs` — privacy gate, upstream CLI invocation, stale cleanup, and gallery generation.
- Create: `test/replay-catalog.test.mjs` — parser/privacy/order tests.
- Create: `test/replay-gallery.test.mjs` — generated gallery and privacy tests.
- Create: `replays/index.html` — committed gallery.
- Create: `replays/sessions/<id>.html` — 13 committed self-contained replays.

## Task 1: Publish Only Reviewed Transcript Sources

**Files:**
- Modify: `.gitignore`
- Modify: `session-transcripts/README.md`
- Create: `package.json`
- Create: `scripts/mask-transcripts.mjs`
- Create: `test/mask-transcripts.test.mjs`
- Add: the 13 reviewed, email-masked JSONLs listed below

- [ ] **Step 1: Write failing email-masking tests**

Create an initial ESM `package.json` with the test command:

```json
{
  "name": "family-cookbook-replays",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test test/*.test.mjs"
  }
}
```

Test the pure API:

```javascript
assert.equal(
  maskEmails("Owner: person.name+tag@gmail.com"),
  "Owner: ****@gmail.com",
)
assert.equal(maskEmails("Event: abc123@google.com"), "Event: ****@google.com")
assert.equal(maskEmails("No email here"), "No email here")
```

Test that masking a representative JSONL line still parses with `JSON.parse`, masks
every duplicate occurrence, preserves email domains, and leaves calendar UUIDs,
event names, dates, and local paths unchanged.

- [ ] **Step 2: Run the focused test and verify RED**

```bash
node --test test/mask-transcripts.test.mjs
```

Expected: FAIL because `scripts/mask-transcripts.mjs` does not exist.

- [ ] **Step 3: Implement the minimal masker**

Export:

```javascript
export function maskEmails(text) {}
export function findUnmaskedEmails(text) {}
```

The executable form accepts source and destination paths, replaces every email-like
local part with exactly `****`, writes valid JSONL, and fails if any unmasked email
remains.

- [ ] **Step 4: Run the focused test and verify GREEN**

```bash
node --test test/mask-transcripts.test.mjs
```

Expected: all masking tests pass.

- [ ] **Step 5: Replace the broad transcript ignore rule**

Ignore `session-transcripts/*.jsonl` by default, then unignore exactly:

```gitignore
session-transcripts/*.jsonl
!session-transcripts/4d01476d-e1af-468e-9a1e-019cb740c98f.jsonl
!session-transcripts/9cd153b5-7650-4ae1-bf5b-ec920cdc0c52.jsonl
!session-transcripts/893d1ee6-7032-470a-b83a-918e37db5fcf.jsonl
!session-transcripts/9864a6ff-a2d2-4dfc-9312-e60ff327434f.jsonl
!session-transcripts/8a6a3065-a0d4-44ea-a6a5-be4d949d9956.jsonl
!session-transcripts/40873f62-c1ae-4301-bdc8-e3151632634c.jsonl
!session-transcripts/076ff2e6-4e03-4b50-9c4c-fbeed80d6d81.jsonl
!session-transcripts/afbfe472-e824-46d6-a419-29a767855bf7.jsonl
!session-transcripts/518b8197-79de-48cc-b48b-779fb99c85bf.jsonl
!session-transcripts/b0ccfe0e-4bc2-4dd8-bc68-b8a63cbe3479.jsonl
!session-transcripts/4255feb1-8a08-4920-8db1-79f947e9855e.jsonl
!session-transcripts/844ea45c-8dd6-41d1-a981-6576bf121e6a.jsonl
!session-transcripts/83cc026c-570e-45e2-ad33-a89bb907e7d9.jsonl
node_modules/
```

Do not alter the user's unrelated ignore rules.

- [ ] **Step 6: Create masked publishable copies**

Read the 13 approved raw JSONLs from the source working directory and write only
masked copies into this feature worktree. Never stage or commit an unmasked raw
copy. Verify every output line parses as JSON and every email-like match has the
literal local part `****`.

- [ ] **Step 7: Clarify catalog semantics**

Update the README note so blank Visibility means publishable and `hide`/`hidden`
means private. Add concise `npm install`, `npm test`, and `npm run replay:build`
instructions without changing the user's bookmark or visibility values. State that
published files mask email local parts only; calendar IDs, event details, dates,
and local paths remain visible.

- [ ] **Step 8: Verify fail-closed ignore and masking behavior**

Run a script that derives the 13 blank-visibility IDs and 15 private IDs from the
table, then checks `git check-ignore`:

```bash
git check-ignore session-transcripts/*.jsonl
```

Expected: only the 15 private JSONLs are printed.

Also scan all 13 publishable files and fail if any email-like token has a local part
other than `****`.

- [ ] **Step 9: Commit the reviewed source catalog**

Stage `.gitignore`, `package.json`, masking code/tests,
`session-transcripts/README.md`, and the 13 masked JSONLs. Inspect staged names and
confirm no private ID or unmasked email is present before committing:

```bash
git diff --cached --name-only
git commit -m "feat: publish masked development transcripts"
```

## Task 2: Add Catalog Parsing and Privacy Tests

**Files:**
- Modify: `package.json`
- Create: `package-lock.json`
- Create: `scripts/replay-catalog.mjs`
- Create: `test/replay-catalog.test.mjs`

- [ ] **Step 1: Install the pinned package**

Run:

```bash
npm install --save-dev --save-exact claude-replay@0.8.1
```

Set package scripts:

```json
{
  "scripts": {
    "test": "node --test test/*.test.mjs",
    "replay:build": "node scripts/build-replays.mjs"
  }
}
```

- [ ] **Step 2: Write failing parser/privacy tests**

Tests must assert:

```javascript
assert.equal(parseCatalog(markdown).filter((item) => item.publishable).length, 1)
assert.equal(parseCatalog(markdown).filter((item) => !item.publishable).length, 2)
assert.throws(() => parseCatalog(markdownWithUnknownVisibility), /Unknown visibility/)
assert.deepEqual(
  orderForGallery(items, ["build-id", "requirements-id"]).map((item) => item.id),
  ["requirements-id", "build-id", "other-id"],
)
```

Also test malformed row width, duplicate IDs, missing matches, and ambiguous matches.

- [ ] **Step 3: Run tests and verify RED**

Run:

```bash
npm test
```

Expected: FAIL because `scripts/replay-catalog.mjs` does not exist.

- [ ] **Step 4: Implement the minimal catalog module**

Export:

```javascript
export function parseCatalog(markdown) {}
export function resolveCatalog(entries, transcriptFiles) {}
export function orderForGallery(entries, featuredIds) {}
```

Parse seven cells, extract every shortened ID, normalize visibility, preserve table
order, and HTML-decode only the small set of entities introduced by Markdown table
formatting. Reject unknown visibility and all resolution ambiguity.

- [ ] **Step 5: Run tests and verify GREEN**

Run:

```bash
npm test
```

Expected: all catalog tests pass with zero warnings.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json scripts/replay-catalog.mjs test/replay-catalog.test.mjs
git commit -m "feat: add privacy-aware replay catalog"
```

## Task 3: Build and Test the Gallery

**Files:**
- Create: `replay.config.json`
- Create: `scripts/build-replays.mjs`
- Create: `test/replay-gallery.test.mjs`

- [ ] **Step 1: Add exact featured configuration**

```json
{
  "title": "Family Cookbook — Build Session Replays",
  "featuredSessionIds": [
    "4d01476d-e1af-468e-9a1e-019cb740c98f",
    "893d1ee6-7032-470a-b83a-918e37db5fcf",
    "afbfe472-e824-46d6-a419-29a767855bf7",
    "518b8197-79de-48cc-b48b-779fb99c85bf",
    "4255feb1-8a08-4920-8db1-79f947e9855e"
  ]
}
```

- [ ] **Step 2: Write failing gallery tests**

Test pure exported helpers:

```javascript
assert.match(html, /Requirements session/)
assert.ok(html.indexOf("Requirements session") < html.indexOf("Build session"))
assert.match(html, /data-source="Claude Code"/)
assert.match(html, /data-source="Cursor"/)
assert.doesNotMatch(html, /Private sessions/)
assert.doesNotMatch(html, /hidden-session-id/)
```

Verify featured stars, lower-right source logo markup, escaped titles/summaries, and
links under `sessions/<full-id>.html`.

- [ ] **Step 3: Run tests and verify RED**

Expected: FAIL because gallery helpers do not exist.

- [ ] **Step 4: Implement builder helpers and privacy gate**

Export:

```javascript
export function renderGallery({ title, sessions, featuredIds }) {}
export function expectedReplayIds(sessions) {}
```

The executable path must:

1. parse and resolve the catalog;
2. compare publishable/private IDs with Git ignore state;
3. fail before writing if any private file is tracked or any publishable file is ignored;
4. remove and recreate `replays/sessions/`;
5. invoke local `claude-replay` for each publishable JSONL;
6. verify generated IDs exactly match publishable IDs;
7. write `replays/index.html` last.

- [ ] **Step 5: Run tests and verify GREEN**

Run:

```bash
npm test
```

Expected: all catalog and gallery tests pass.

- [ ] **Step 6: Commit**

```bash
git add replay.config.json scripts/build-replays.mjs test/replay-gallery.test.mjs
git commit -m "feat: add replay gallery builder"
```

## Task 4: Generate and Verify Committed Replays

**Files:**
- Create: `replays/index.html`
- Create: `replays/sessions/*.html`

- [ ] **Step 1: Build all publishable sessions**

Run:

```bash
npm run replay:build
```

Expected: 13 replay files and one gallery index.

- [ ] **Step 2: Verify output privacy and links**

Use a Node verification script to assert:

- output filenames equal the 13 publishable full IDs;
- none of the 15 private IDs appears in any output path or gallery HTML;
- every gallery replay link resolves;
- featured cards are first in chronological order;
- Requirements precedes Build;
- every card contains the correct Claude Code or Cursor logo markup.

- [ ] **Step 3: Run the full test/build cycle**

```bash
npm test
npm run replay:build
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 4: Commit generated output and process documentation**

```bash
git add replays docs/superpowers/specs docs/superpowers/plans
git commit -m "docs: add development replay gallery"
```

## Task 5: Final Repository Verification

**Files:**
- Verify all files above

- [ ] **Step 1: Audit tracked and ignored transcript sets**

Confirm `git ls-files session-transcripts` contains README plus exactly 13 JSONLs.
Confirm every `hide`/`hidden` JSONL is ignored and absent from `git ls-files`.

- [ ] **Step 2: Rebuild from a clean generated directory**

Delete only generated `replays/index.html` and `replays/sessions/`, run
`npm run replay:build`, and confirm `git diff --exit-code -- replays`.

- [ ] **Step 3: Run final checks**

```bash
npm test
npm run replay:build
git diff --check
git status --short
```

Expected: tests/build pass, generated output is reproducible, and the working tree
is clean after the requested commits.
