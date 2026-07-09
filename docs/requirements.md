# Requirements: Family Meal Planning Workflow

Derived from [[Project Plan]]. This document captures the MVP requirements for a
Claude-powered weekly dinner-planning workflow for a household, designed to be
backed up on GitHub and shared with other families.

---

## 1. Purpose & Problem

Family meal planning is a burdensome weekly task with many inputs and
dependencies that affects daily happiness. Done well it improves day-to-day life
with compounding effects on health and budget; done poorly it adds stress at the
end of a long day. Today the process is inconsistent week to week, rushed, and
cascades into either food waste (few shared ingredients) or overspending (one
convenient store).

**Goal:** a repeatable workflow that plans the week's dinners, produces a
store-grouped grocery list, and schedules prep reminders — so the family sticks
to dietary goals, shops smarter, and wastes less food.

## 2. Users

- **Primary:** the two partners in the household who alternate meal-planning duty
  each week.
- **Secondary:** other families who clone the shared GitHub project and run it
  for their own household after completing kickoff.

## 3. Success Criteria

- A full week of needed dinners is planned in a single sitting (no mid-week
  "rush and order out").
- Weekly planning time drops meaningfully below the current ~1 hr + ~15 min/day.
- Grocery list is organized so shopping is efficient and cost-aware.
- Prep reminders remove the daily "did we thaw the beef?" scramble.
- Another family can clone the repo, complete kickoff, and run their first week.

---

## 4. Scope

### 4.1 In Scope (MVP)

- One-time **kickoff** to capture household config.
- **Weekly run** (scheduled + manual) that plans dinners, builds the grocery
  list, and schedules prep reminders.
- **Hybrid recipe sourcing**: personal collection first, AI/web suggestions to
  fill gaps.
- **Store-grouped grocery list** using simple ranked-store logic.
- **Ratings** feedback loop collected twice weekly.
- **Shareable** project structure (templates + gitignored personal data).

### 4.2 Out of Scope (deferred to later versions)

- **Full grocery price optimization** — splitting a shopping trip across multiple
  stores based on live sale/circular pricing to minimize spend. MVP uses only
  simple ranked-store grouping (see 5.4). True price optimization requires sale
  data that stores do not expose via API.
- Breakfast/lunch planning (dinners only for MVP).
- Automated ordering / grocery delivery integration.
- Nutrition/macro tracking.

---

## 5. Functional Requirements

### 5.1 Kickoff (one-time per household)

Captured once and stored as editable config files (see 7). Collect:

1. Home address (used to derive nearby grocery stores).
2. Ranked list of grocery stores the family shops at.
3. Ideal/target dinner prep time.
4. Weekly budget.
5. Household members (names, ages).
6. Per-individual dietary preferences and requirements, including ingredients to
   avoid per person.
7. Ingredients typically on hand (spices, canned items, oils — pantry staples).
8. Cooking equipment available (stovetop, oven, air fryer, crockpot, etc.).
9. **Portion strategy** — how to size cooking when members are out on different
   nights (e.g. scale to who's home, plan deliberate leftovers, always
   full-family). This is a per-family preference, not fixed logic.
10. **Meal-planner run timing & shopping day** — the family's preferred day/time
    for the weekly planning job, plus the family's weekly grocery-shopping day
    (used to set the plan-approval deadline; see 5.8). Per-family.
11. Examples of up to 5 favorite dinner recipes (optional; seeds the collection).

### 5.2 Weekly Run

Triggered by the scheduled **meal-planner** job at the family's configured
day/time (set at kickoff; see 5.8), and also runnable **manually** at any time.
The job **pre-drafts** a plan and waits for the family's review/approval before
finalizing. Steps:

1. **Read the calendar first.** Pull the week's schedule from Apple Calendar to
   detect dinners-out (work dinners, dinner at a friend's, travel) and determine
   how many dinners are needed, and for whom, each night.
2. Confirm/adjust the number of dinners to plan for the week (configurable).
3. Select dinners using **hybrid sourcing** (5.3), respecting dietary
   requirements, prep-time target, budget, and available equipment.
4. Favor recipes with **shared ingredients** to reduce waste.
5. Assign meals to days based on who is home and prep constraints.
6. Generate the **store-grouped grocery list** (5.4), excluding pantry staples
   already on hand.
7. Schedule **prep reminders** (5.6).
8. Deliver outputs (5.5).

### 5.3 Recipe Sourcing (Hybrid)

- Draw first from the family's **personal recipe collection**.
- Fill remaining slots with **AI-generated and/or web-sourced** suggestions
  matched to the family's preferences and ratings (5.7).
- **Collection growth:** the user pastes a recipe link (NYT, TikTok, Instagram,
  blog) or a photo of a recipe card, and Claude extracts it into a structured
  markdown file in the project's recipe collection.

### 5.4 Grocery List (MVP)

- Aggregate all needed ingredients across the week's recipes.
- Exclude items already on hand (pantry staples from kickoff).
- **Group the list by store** using simple ranked-store logic — e.g. if multiple
  recipes need chicken, assign chicken to the preferred bulk store (Costco).
- No live pricing/sale lookups in MVP (see Out of Scope).

### 5.5 Outputs

1. **Menu for the week, by day.**
2. **Recipes + step-by-step instructions.**
3. **Grocery list grouped by store**, delivered to **Apple Notes** (shared, so
   both partners can access; can be uploaded back into Claude for the guided
   cooking UX with timers).
4. **Prep reminders** in Apple Reminders (5.6).

### 5.6 Prep Reminders

- Written to a dedicated Apple Reminders list named **"Family Meals"**.
- **Per-recipe timing** based on what each recipe needs (e.g. defrost = night
  before, marinate = morning of).

### 5.7 Ratings Feedback Loop

- **Scale:** 1–5, with optional free-text notes (e.g. "loved the bowl format,"
  "too spicy," "halve the garlic next time"). The notes carry the real signal.
- **One rating per recipe** — the current rating, overwritten when re-rated —
  stored in the recipe's own markdown file (frontmatter), so the rating travels
  with the recipe and stays personal-but-shareable.
- **Captured by the recipe-reviewer job** (5.8), which prompts the family to
  rate recently cooked meals.
- **Usage in planning:**
  - Boost highly-rated recipes for re-suggestion.
  - Suppress low-rated recipes.
  - Use ratings **and notes** to find *similar* highly-rated recipes — the notes
    reveal the pattern the family likes. (Example: a note that they loved the
    "in a bowl" format of a taco bowl signals suggesting more "X in a bowl"
    meals, not just that specific taco recipe.)
- **Frontmatter schema** (lives in each recipe file, alongside `title`, `source`,
  `servings`, `prep_time`):

  ```yaml
  rating: 4                             # 1–5, current only (overwritten on re-rate)
  rating_notes: "loved the bowl format" # free text; carries the real signal
  liked_traits: [bowl-format, one-pan]  # structured hooks for "find similar"
  last_cooked: 2026-07-08
  times_cooked: 3                       # increments each time the recipe is planned
  ```

### 5.8 Scheduled Automation

Two **independent** scheduled jobs, kept separate so feedback is collected more
frequently and feeds the next week's planning. Both notify via **push
notification**.

1. **Recipe reviewer** — runs **twice weekly, Wednesday and Friday evenings**.
   Prompts the family to rate recently cooked meals (5.7). The higher review
   cadence keeps ratings fresh for the next planning run.
2. **Meal planner** — runs at the family's **preferred day/time (set at kickoff;
   5.1)**. **Pre-drafts** the week's plan from the calendar and preferences, then
   waits for the family's review/approval before finalizing. Also runnable
   manually (5.2).

**Failure & no-response handling:**

- **Empty calendar** (meal planner can't tell who's home): draft the plan anyway
  using the configured default dinner count and assuming the **full family is
  home every night**, and flag the assumption prominently at the top of the
  output ("Calendar was empty — assumed full family home all week; edit &
  re-run if wrong").
- **No approval by deadline** (meal planner): if the pre-drafted plan isn't
  approved by the **evening before the family's shopping day** (5.1),
  **auto-finalize the draft as-is** — write the grocery list to Apple Notes and
  schedule prep reminders — so shopping isn't blocked.
- **No response to a ratings prompt** (recipe reviewer): no rating is captured
  that cycle (harmless); the next scheduled run re-prompts.

---

## 6. Integrations & Platform

- **Claude Desktop** — build and run platform; user-facing interface. Claude's
  mobile app provides the guided recipe/cooking UX (timers) when a recipe note
  is uploaded.
- **apple-events MCP** (`FradSer/mcp-server-apple-events`, installed
  project-scoped via `.mcp.json`) — reads **Apple Calendar** (schedule) and
  writes **Apple Reminders** (the "Family Meals" prep list).
  - Note: this changes the original plan's "Google Calendar" — schedule lives in
    Apple Calendar (confirmed).
- **Apple Notes** — destination for the weekly grocery list and recipe handoff to
  mobile.
- **GitHub** — the workflow is backed up as a shareable project so other
  households can clone and run it.

---

## 7. Data & Storage Model

All persistent config and state live as **markdown files in the project** so they
can be edited directly or by chatting with Claude, and version-controlled.

- **Template files** (committed, shareable): `*.example.md` with placeholder
  values and field explanations — e.g. `config/household.example.md`,
  `config/pantry-staples.example.md`, `config/store-rankings.example.md`.
- **Real files** (gitignored — personal data): the filled-in versions Claude
  reads/writes — e.g. `config/household.md`, etc.
- **Recipe collection:** structured markdown files, one per recipe. Each recipe's
  rating (1–5) and notes live in that file's frontmatter (5.7).
- **Grocery list output:** Apple Notes (not a project file).

`.gitignore` must exclude all real personal-data files while keeping `.example`
templates.

---

## 8. Non-Functional Requirements

- **Shareable & reproducible:** a new family clones the repo, copies `.example`
  templates to real filenames, completes kickoff, and runs. No personal data is
  ever committed.
- **Privacy:** addresses, names, ages, budget, and schedule stay in gitignored
  files / the user's own Apple account — never pushed to a public repo.
- **Low-friction editing:** config editable via files or natural-language chat
  with Claude.

---

## 9. Open Follow-ups

_All prior open items resolved (2026-07-09):_

- **Scheduled-job failure handling** — decided (see 5.8): empty calendar → draft
  with defaults; no approval by the eve-before-shopping deadline → auto-finalize.
- **Ratings frontmatter schema** — decided (see 5.7): `rating`, `rating_notes`,
  `liked_traits`, `last_cooked`, `times_cooked`.

No open follow-ups remain; details refined during build.
