---
description: One-time household setup — interview the family and write their real config files
---

# /kickoff — Household setup

Run the one-time kickoff for the family meal-planning workflow. Interview the user
conversationally, then write their **real** (gitignored) config files based on the
`.example` templates in `config/`. Keep it friendly and low-friction — this should feel
like a chat, not a form.

## Before you start
1. Read the templates so you know the exact fields and structure to fill:
   - `config/household.example.md`
   - `config/dietary.example.md`
   - `config/pantry-staples.example.md`
   - `config/store-rankings.example.md`
   - `config/equipment.example.md`
2. Check whether real config files already exist (`config/household.md`, etc.).
   - If they do, tell the user and ask whether to **update** specific values or **start
     fresh**. Never silently overwrite existing config.

## Interview — ask in small, friendly groups (never all at once)
Collect everything in requirements §5.1. Confirm each group back before moving on.

**A. Basics**
- Home address (used to suggest nearby stores; stays local/gitignored)
- Weekly grocery budget
- Ideal/target hands-on dinner prep time
- Default number of dinners per week (used when the calendar is empty)

**B. Household members** → writes `dietary.md` + members in `household.md`
- Each member: name, age
- Per member: diet type, allergies (hard exclusions), foods to avoid (soft), free-text
  preferences

**C. Kitchen**
- Cooking equipment (offer the template's list; let them add/remove) → `equipment.md`
- Pantry staples always on hand (offer the template's grouped list; adjust) → `pantry-staples.md`.
  Explain these are excluded from grocery lists.

**D. Shopping** → `store-rankings.md` + `household.md`
- Ranked grocery stores + what each is best for. Use the home address to suggest nearby
  options if that helps. Collect a longer ranked list if useful for occasional runs.
- **Weekly store trip count** (`weekly_store_count` in `household.md`): how many stores the
  family actually shops at in a typical week (usually **1 or 2**). This caps how many stores
  `/plan-week` spreads the grocery list across — not how many stores they may rank overall.

**E. Scheduling** → `household.md`
- Portion strategy: `scale-to-whos-home` | `deliberate-leftovers` | `always-full-family`
- Preferred day/time for the weekly meal-planner to run
- Weekly grocery **shopping day** (this sets the plan-approval deadline = the evening before)
- **Calendars to watch:** use the `apple-events` MCP `calendar_calendars` tool (action:
  `read`) to list the user's actual calendars. Show them and let the user pick ONLY the
  calendars that reveal who's home / dinners-out. Steer them away from sports/holiday/
  subscription calendars (noise). Save the exact calendar names into `watch_calendars`.
  - If the `apple-events` tools aren't loaded, load them first (they're MCP tools).

**F. Favorite recipes (optional — seed only)**
- Offer to import a **small starter batch** of favorites now (a soft batch of ~5 keeps kickoff
  short — not a collection limit). Make clear they can **skip**, paste fewer or more if they
  insist, and **add unlimited recipes anytime** later via `/import-recipe`, links, photos, or
  chat. For each accepted now, offer to import from a link or photo, or capture a quick
  version into `recipes/<slug>.md` using `recipes/_template.md`.
- Mention that any committed demo recipes in `recipes/` with `example: true` are samples only
  and won't appear in meal plans until the family adopts them.

## Writing the files
- Write real files **without** the `.example` suffix: `config/household.md`,
  `config/dietary.md`, `config/pantry-staples.md`, `config/store-rankings.md`,
  `config/equipment.md`.
- Mirror each template's structure and field names **exactly** so the weekly planner can
  read them reliably.
- Show the user a concise summary of what you captured and get a thumbs-up **before**
  writing.
- Remind them these files are gitignored — their address, budget, and family details stay
  local and are never committed.

## When done
- Confirm which files were created.
- Tell them they can change any value later just by chatting (e.g. "bump our budget to
  $175" or "add jasmine rice to our staples").
- Point to the next step: running the weekly meal-planner.
