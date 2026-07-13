# Unify Replays on github-light Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire `github-light` into the replay build pipeline so gallery + session pages share a light theme after regenerate.

**Architecture:** Single change point in `scripts/build-replays.mjs` — pass `--theme github-light` to `claude-replay` and remap inlined gallery CSS tokens. Regenerate committed HTML via `npm run replay:build`.

**Tech Stack:** Node.js, `claude-replay@0.8.1`, Node test runner

---

### Task 1: Failing gallery theme test

**Files:**
- Modify: `test/replay-gallery.test.mjs`

- [ ] **Step 1: Add assertions for light github-aligned tokens**

```js
assert.match(html, /color-scheme:\s*light/);
assert.match(html, /--bg:\s*#ffffff/);
assert.match(html, /--surface:\s*#f6f8fa/);
assert.match(html, /--accent:\s*#0969da/);
assert.doesNotMatch(html, /color-scheme:\s*dark/);
```

- [ ] **Step 2: Run test and confirm failure**

Run: `npm test -- test/replay-gallery.test.mjs`

### Task 2: Update build script

**Files:**
- Modify: `scripts/build-replays.mjs`

- [ ] **Step 1: Remap gallery `:root` tokens to github-light-aligned values**
- [ ] **Step 2: Add `--theme`, `github-light` to `execFileSync` args**
- [ ] **Step 3: Re-run tests — expect pass**

### Task 3: Regenerate committed replays

**Files:**
- Modify: `replays/index.html`, `replays/sessions/*.html` (generated)

- [ ] **Step 1: `npm run replay:build`**
- [ ] **Step 2: Spot-check one session HTML for `--bg: #ffffff` and index for light tokens**
- [ ] **Step 3: `npm test`**
