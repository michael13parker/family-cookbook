# Family Cookbook

A collection of family recipes.

## Structure

- `config/*.example.md` — household config templates (copy to real filenames, gitignored)
- `recipes/` — one markdown file per recipe (the cookbook; source of truth)
- `.claude/commands/` — workflow commands (e.g. `/kickoff`)
- `docs/` — requirements and setup guides

## Setup (new household)

1. **Config:** copy each `config/*.example.md` to the same name without `.example` and fill
   it in — or run **`/kickoff`** to be interviewed and have the files written for you.
2. **Apple Calendar + Reminders:** the `apple-events` MCP loads automatically; grant macOS
   Calendar/Reminders access on first use. Calendar is read-only; reminders go to a
   "Family Meals" (prep) list and a "Groceries" (shopping) list.
3. **Google Docs (recipe delivery):** follow
   **[docs/google-docs-mcp-setup.md](docs/google-docs-mcp-setup.md)** to create your own
   Google credentials (~15 min, one-time).

## Claude Code

This project uses [Claude Code](https://claude.com/claude-code). The `apple-events`
MCP server (defined in `.mcp.json`) is trusted for all sessions via
`.claude/settings.json`.
