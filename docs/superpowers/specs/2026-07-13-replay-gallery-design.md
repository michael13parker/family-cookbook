# Replay Gallery Design

## Goal

Publish the reviewed Family Cookbook development sessions as a committed visual
gallery powered by `claude-replay`, while ensuring sessions marked `hide` or
`hidden` never enter Git or generated replay output.

## Privacy and Version Control

`session-transcripts/README.md` remains the human-readable catalog and visibility
source. Visibility values are interpreted after trimming and lowercasing:

- `hide` and `hidden`: private
- blank: publishable
- any other value: a build error, preventing an accidental privacy assumption

The archive README remains committed and continues to list metadata for private
sessions. JSONL files are ignored by default, then each currently publishable file
is explicitly unignored. This fail-closed structure keeps new or unreviewed
transcripts private until `.gitignore` is deliberately updated.

The build verifies that every publishable row resolves to one JSONL file, every
private row is ignored and untracked, and only publishable sessions are rendered.

Before a publishable JSONL is committed, every email-like value is masked by
replacing its complete local part with four asterisks while preserving the domain:
`person@gmail.com` becomes `****@gmail.com`. The replacement is applied globally
to the raw JSONL text so duplicated tool results and email-like calendar event IDs
are handled consistently without changing JSON structure.

Per the approved scope, calendar UUIDs, event names, dates, and local filesystem
paths are not masked. The archive documentation states this residual exposure
explicitly so a blank Visibility value is not mistaken for full anonymization.

## Upstream Integration

Install the released `claude-replay` package at the exact version `0.8.1` as a
development dependency. Do not fork or vendor upstream source. This repository
owns only the catalog parser, gallery builder, configuration, and generated output.

The npm commands are:

- `npm test`: validate catalog parsing and privacy behavior
- `npm run replay:build`: regenerate all publishable replays and the gallery

## Components

### Catalog parser

A focused module reads the Markdown table in `session-transcripts/README.md`,
normalizes each row, expands shortened IDs against local JSONL filenames, and
returns ordered session metadata. It rejects malformed rows, unknown visibility
values, duplicate IDs, missing files, and ambiguous ID matches.

### Replay configuration

A small JSON configuration stores the gallery title and the five featured session
IDs:

1. Requirements session (`4d01476d…`)
2. Build session (`893d1ee6…`)
3. `bug-log.md` created (`afbfe472…`)
4. Add to bug log, Bugs 001–005 (`518b8197…`)
5. Action `bug-log.md` (`4255feb1…`)

Featured sessions are displayed first but sorted by their existing chronological
catalog order. All remaining publishable sessions follow chronologically.

### Replay builder

The builder removes stale generated session HTML before each build, invokes the
local `claude-replay` binary once for each publishable JSONL, and writes committed
output under `replays/`. A build failure stops the process without presenting an
incomplete gallery as successful.

### Gallery

`replays/index.html` presents cards containing:

- bookmark text as the card title, falling back to the summary
- source and date
- summary
- a star for featured sessions
- a Claude Code or Cursor logo in the lower-right corner
- a link to the corresponding self-contained replay

The gallery has a published-session count and source summary. It does not display a
private-session count or render private session cards.

## Generated Output

Generated replay HTML and the gallery index are committed. Every generated replay
contains the full contents of its corresponding publishable transcript, so the
privacy checks run before generation and again during verification. Stale output
is deleted to prevent a session that later becomes hidden from remaining in Git.

## Testing and Verification

Node's built-in test runner covers:

- masking email local parts while preserving domains and valid JSONL
- ensuring no unmasked email-like values remain in publishable transcripts
- parsing the seven-column table
- treating both `hide` and `hidden` as private
- treating blank visibility as publishable
- rejecting unknown visibility values
- resolving shortened IDs uniquely
- preserving chronological order
- placing featured sessions first in chronological order

End-to-end verification checks:

- private JSONLs are ignored and absent from Git
- committed JSONLs contain only `****@domain` email-like values
- publishable JSONLs, README, tooling, and generated output are tracked
- generated session IDs exactly equal publishable catalog IDs
- gallery links resolve to existing replay files
- no private transcript ID or content appears under `replays/`
- `npm test` and `npm run replay:build` exit successfully

## Commit Scope

Commit the granular ignore rules, archive README, publishable JSONLs, npm package
files, parser/build tooling, tests, configuration, generated gallery/replays, and
approved design/plan documentation. Do not commit private JSONLs. Preserve the
user's unrelated `.gitignore` edits while incorporating the transcript rules.
