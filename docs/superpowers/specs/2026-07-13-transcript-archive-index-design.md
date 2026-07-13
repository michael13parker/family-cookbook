# Transcript Archive Index Design

## Goal

Extend the local transcript archive so it contains the project's top-level Cursor
sessions alongside its Claude Code sessions and can serve as the source catalog for
a future customized `claude-replay` experience.

## Scope

- Copy all 10 top-level Cursor session JSONL files into `session-transcripts/`.
- Exclude Cursor subagent transcripts.
- Update only `session-transcripts/README.md`; do not change the root README.
- Keep `session-transcripts/` local and gitignored.

## Archive Structure

All Claude Code and Cursor JSONL files remain in the existing flat
`session-transcripts/` directory and retain their source session IDs as filenames.
This keeps paths simple and allows `claude-replay` to consume each file directly.

## Index Schema

The existing chronological table will use these columns:

1. `Start (UTC)`
2. `End`
3. `File`
4. `Source`
5. `Visibility`
6. `Bookmarks`
7. `Summary`

Existing rows will identify their source as `Claude Code`. New rows will identify
their source as `Cursor`. `Visibility` and `Bookmarks` will be blank for every row
until those values are curated later.

Cursor times will be taken from embedded session timestamps and converted to UTC.
Unavailable end times will be represented with an em dash. Existing shortened file
IDs and concise summaries will remain the display convention.

## Sync Instructions

The archive README will retain the Claude Code sync command and add a separate
Cursor command that copies only top-level session JSONL files. The documented
command must not copy files from nested `subagents/` directories.

## Validation

- Confirm all 10 selected Cursor files exist in the archive and preserve their
  original contents.
- Confirm the subagent transcript is absent.
- Confirm every indexed file resolves to an archived JSONL file.
- Confirm every row has seven cells and the source is either `Claude Code` or
  `Cursor`.
- Confirm `Visibility` and `Bookmarks` cells are blank.
- Confirm the table remains chronologically ordered in UTC.

## Privacy

The archive remains gitignored because raw transcripts can contain source code,
local paths, tool results, and private data. Visibility values are intentionally
left blank until each transcript has been reviewed before replay export or sharing.
