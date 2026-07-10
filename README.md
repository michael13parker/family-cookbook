# Family Cookbook

A collection of family recipes.

## Structure

- `config/*.example.md` — household config templates (copy to real filenames, gitignored)
- `recipes/` — one markdown file per recipe (the cookbook; source of truth)
- `.claude/commands/` — workflow commands (see below)
- `docs/` — requirements and setup guides

## Weekly workflow

Four Claude Code slash-commands drive the whole loop:

- **`/kickoff`** — one-time household setup. Interviews the family and writes the real
  `config/*.md` files from the templates (including which calendars to watch).
- **`/plan-week`** — reads the week's calendar to see who's home, picks recipes (your
  collection first, web to fill gaps) honoring dietary/prep/budget/equipment, then drafts a
  menu. On approval it writes a store-grouped grocery list to the Apple **Reminders
  "Groceries"** list, schedules prep reminders in **Reminders "Family Meals"**, and creates
  one **Google Doc per dinner** in a shared weekly folder.
- **`/review-recipes`** — prompts the family to rate recently cooked dinners (1–5 + notes)
  and writes ratings back into each recipe's frontmatter, which biases future planning.
- **`/import-recipe`** — turns a pasted link or a photo into a structured recipe file in
  `recipes/`.

Run these manually today. The intended cadence — `/plan-week` on your configured planning
day (`meal_planner_run`, default Sunday morning) and `/review-recipes` Wednesday + Friday
evenings — is documented but **not yet auto-scheduled** (see *Automation status* below).

## Setup (new household)

1. **Config:** copy each `config/*.example.md` to the same name without `.example` and fill
   it in — or run **`/kickoff`** to be interviewed and have the files written for you.
2. **Apple Calendar + Reminders:** the `apple-events` MCP loads automatically; grant macOS
   Calendar/Reminders access on first use. Calendar is read-only; reminders go to a
   "Family Meals" (prep) list and a "Groceries" (shopping) list.
3. **Google Docs (recipe delivery):** follow
   **[docs/google-docs-mcp-setup.md](docs/google-docs-mcp-setup.md)** to create your own
   Google credentials (~15 min, one-time).
4. **Recipe import from URLs:** requires the [Defuddle CLI](https://github.com/kepano/defuddle)
   (`npm install -g defuddle`) to extract clean recipe content from web pages.

## Automation status

Scheduling is **not yet automated** — the commands are run by hand. Both scheduled jobs
depend on **local Mac resources** (the `apple-events` MCP is macOS-local and TCC-gated, and
they read/write the local repo), so cloud/headless routines cannot host them. When automated,
the intended home is **macOS `launchd`** agents invoking `claude -p "/plan-week"` and
`claude -p "/review-recipes"` on schedule, with `PushNotification` alerting the family to
review a drafted plan or rate the week's meals. This is the one open item deferred to a
follow-up.

## Claude Code

This project uses [Claude Code](https://claude.com/claude-code). The `apple-events`
MCP server (defined in `.mcp.json`) is trusted for all sessions via
`.claude/settings.json`.
