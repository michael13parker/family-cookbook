# Session Transcripts (local archive — gitignored)

This local, gitignored archive contains raw Claude Code and Cursor JSONL sessions
for later replay. Source directories:

- Claude Code: `~/.claude/projects/-Users-michaelparker-Documents-working-folders-07-2026-family-cookbook/`
- Cursor: `~/.cursor/projects/Users-michaelparker-Documents-working-folders-07-2026-family-cookbook/agent-transcripts/`

Table timestamps are UTC. Cursor files lack native event timestamps, so embedded
user timestamps provide session starts where available.

Raw transcripts can contain private data, source code, local paths, and tool
output; review them before sharing. A blank Visibility cell means the transcript
is reviewed as publishable and committable. `hide` or `hidden` means the
transcript is private and ignored by Git. A blank Bookmarks cell means bookmarks
have not yet been curated.

Committed publishable JSONLs are masked before Git with partial blurring:

- emails: `person@gmail.com` → `****@gmail.com`
- calendar and event UUIDs: middle segments → `****`
- macOS home paths: `/Users/username/` → `/Users/****/`

Run `npm run mask:transcripts` after re-syncing raw files to re-apply masking.

## Session index (chronological)


| Start (UTC) | End         | File                     | Source      | Visibility | Bookmarks                               | Summary                                                                                                                                                                                                    |
| ----------- | ----------- | ------------------------ | ----------- | ---------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 07-09 16:27 | 16:27       | `dd8db83c…`              | Claude Code | hidden     |                                         | Stub (working-dir setup, no conversation)                                                                                                                                                                  |
| 07-09 16:30 | 18:41       | `4d01476d…`              | Claude Code |            | requirements session                    | **Day-1 requirements session:** progress-notes diary started, Apple Reminders MCP research (rem vs automating-mac-apps vs FradSer apple-events), requirements interview (2 rounds), ratings schema decided |
| 07-09 16:59 | 17:07       | `9cd153b5…`              | Claude Code |            | apple-events MCP                        | Trust/approve the apple-events MCP server project-scoped                                                                                                                                                   |
| 07-09 18:27 | 07-10 16:00 | `893d1ee6…`              | Claude Code |            | build session                           | **The big build session:** vault EPERM workaround (docs moved in-repo), `build-tasks.md` created, apple-events MCP verified, Phase 1 built + committed, Apple Notes → Google Docs pivot, GCP OAuth setup   |
| 07-10 15:53 | 16:21       | `9864a6ff…`              | Claude Code |            | Google Docs MCP Setup                   | Google Docs MCP verified end-to-end (list/create/delete)                                                                                                                                                   |
| 07-10 17:09 | —           | `8a6a3065…`              | Cursor      |            | Setup Test Family                       | Move cookbook test-family event times forward one hour for Chicago                                                                                                                                         |
| 07-10 17:18 | 17:47       | `40873f62…`              | Claude Code |            | /import-recipe Test                     | Recipe imports from NYT Cooking / Delish URLs                                                                                                                                                              |
| 07-10 17:41 | 18:08       | `076ff2e6…`              | Claude Code |            | pantry stables manual over ride         | Pantry staples updates (chickpeas, butter, parmesan, rice, ginger)                                                                                                                                         |
| 07-10 17:50 | 17:55       | `afbfe472…`              | Claude Code |            | [bug-log.md](http://bug-log.md) created | `bug-log.md` created (log-only, no actioning during testing)                                                                                                                                               |
| 07-10 17:54 | —           | `518b8197…`              | Cursor      |            | add to bug log, Bugs 001–005            | Log the example-recipe issue discovered during kickoff and first-week planning                                                                                                                             |
| 07-10 18:10 | 18:13       | `e3023673…`              | Claude Code | hide       |                                         | Check off "/plan-week run for real" in build-tasks.md                                                                                                                                                      |
| 07-10 18:17 | 18:22       | `c33a3631…`              | Claude Code | hide       |                                         | Save cookbook name ("I Dream of Dinner")                                                                                                                                                                   |
| 07-10 18:24 | 18:42       | `b0ccfe0e…`              | Claude Code |            | Phase 5                                 | Phase 5 decision (defer to launchd) + Phase 6 share polish                                                                                                                                                 |
| 07-10 18:49 | —           | `4255feb1…`              | Cursor      |            | action [bug-log.md](http://bug-log.md)  | Implement and document the fixes recorded in `docs/bug-log.md`                                                                                                                                             |
| 07-10 18:59 | —           | `844ea45c…`              | Cursor      |            | demo clean up                           | Reset recipe `date last cooked` values for a clean workflow demo                                                                                                                                           |
| 07-10 21:01 | —           | `36c42ba2…`              | Cursor      | hidden     |                                         | Create a visual map of recipes, config, Claude commands, and MCP connections                                                                                                                               |
| 07-10 21:44 | 07-12 22:48 | `83cc026c…`              | Claude Code |            | bug fixes BUG-001–005                   | Bug fixes (BUG-001–005), demo prep: reset recipe cooked-history                                                                                                                                            |
| 07-12 21:20 | —           | `6382ceb2…`              | Cursor      | hidden     |                                         | Reframe the workflow architecture slides for an executive audience                                                                                                                                         |
| 07-12 21:27 | —           | `a374a42b…`              | Cursor      | hidden     |                                         | Produce a concise two-sentence summary of the project                                                                                                                                                      |
| 07-12 22:25 | —           | `428b4f9e…`              | Cursor      | hidden     |                                         | Organize the build-process presentation and its supporting visuals                                                                                                                                         |
| 07-12 22:49 | 23:05       | `c98e4ca0…`              | Claude Code | hidden     |                                         | Short continuation (no user messages)                                                                                                                                                                      |
| 07-12 23:19 | 23:29       | `e82a614d…`              | Claude Code | hidden     |                                         | Approval/continuation session                                                                                                                                                                              |
| 07-13 02:29 | 02:36       | `6e40ce08…`              | Claude Code | hidden     |                                         | Git cleanup interview                                                                                                                                                                                      |
| 07-13 02:33 | 02:46       | `a015c22f…`              | Claude Code | hidden     |                                         | This session: methodology doc + transcript archive                                                                                                                                                         |
| 07-13 14:41 | —           | `d684e5a4…`              | Cursor      | hidden     |                                         | Archive and catalog Claude Code and Cursor transcripts for visual replay                                                                                                                                   |
| —           | —           | `000bc95f…`, `c1783108…` | Claude Code | hidden     |                                         | Empty stubs                                                                                                                                                                                                |
| —           | —           | `f74c034a…`              | Cursor      | hidden     |                                         | Aborted Cursor request (no conversation content)                                                                                                                                                           |




## Gallery workflow (once setup is complete)

Once gallery setup is complete, install dependencies, run tests, and build the
replay gallery with:

```sh
npm install
npm test
npm run mask:transcripts
npm run replay:build
```

These are the intended gallery workflow commands; the tooling is not included
in this archive-publishing task.

## Re-syncing the local archive

Run both commands from the repository root.

Claude Code:

```sh
cp ~/.claude/projects/-Users-michaelparker-Documents-working-folders-07-2026-family-cookbook/*.jsonl session-transcripts/
```

Cursor top-level sessions only:

```sh
cp ~/.cursor/projects/Users-michaelparker-Documents-working-folders-07-2026-family-cookbook/agent-transcripts/*/*.jsonl session-transcripts/
```

The Cursor glob intentionally excludes nested `subagents/` transcripts.