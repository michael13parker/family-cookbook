---
description: Draft the week's dinners from the family's calendar + preferences, then (on approval) write the grocery list, prep reminders, and per-dinner Google Docs
---

# /plan-week — Weekly meal planner

Run the weekly meal-planning flow (requirements §5.2). **Pre-draft** a plan, show it to the
family for review, and only **on approval** write the outputs. Runnable manually anytime; the
scheduled job (Phase 5) reuses this same flow.

## Preflight — load config & inputs
1. Read the family's **real** config (gitignored; written by `/kickoff`):
   - `config/household.md` — members, budget, `target_prep_time_min`, `default_dinner_count`,
     `weekly_store_count`, `portion_strategy`, `shopping_day`, `watch_calendars`
   - `config/dietary.md` — per-person `diet` / `allergies` (hard) / `avoid` (soft) / `preferences`
   - `config/pantry-staples.md` — items to EXCLUDE from the grocery list
   - `config/store-rankings.md` — ranked stores + `best_for` (drives grocery grouping)
   - `config/equipment.md` — the only gear a recipe may require
   - **If any real `config/*.md` is missing**, stop and tell the user to run **`/kickoff`** first
     (don't invent values or read from the `.example` templates).
2. Read the recipe collection: every `recipes/*.md` **except** (a) files starting with `_`
   (templates) and (b) files whose frontmatter has `example: true` (committed demos — not
   yet adopted by this household). Parse frontmatter (`ingredients`, `tags`, `equipment`,
   `rating`, `rating_notes`, `liked_traits`, `times_cooked`).
3. If the apple-events / google-docs MCP tools aren't loaded, load them first.

## Step 1 — Read the calendar (read-only)
- Determine the target week (the 7 days starting the coming Monday, or ask if ambiguous).
- Call the apple-events MCP `calendar_calendars` only if you need to reconcile names; then
  `calendar_events` for the week, **filtered to `watch_calendars` only** (ignore every other
  calendar — sports/holidays/subscriptions are noise).
- From those events infer, per night: who's home and which nights are **dinners-out** (travel,
  work dinners, dinner at a friend's). Never write to the calendar.

## Step 2 — How many dinners
- Count nights that need a home-cooked dinner from Step 1.
- **Empty calendar / nothing relevant found** → fall back to `default_dinner_count`, assume the
  **full family is home every night**, and **flag this assumption at the very top** of the draft
  ("Calendar was empty — assumed full family home all week; edit & re-run if wrong").
- Show the count and let the user adjust before selecting recipes.

## Step 2.5 — Sourcing preference (hybrid §5.3)
After the dinner count is confirmed, **ask how to source this week's meals** before picking
recipes. Do not silently default to "exhaust the library first." Offer:

1. **Library only** — use only recipes already in the collection (skip AI/web suggestions).
2. **Mix in new ideas** (hybrid, default) — blend collection recipes with some AI/web
   suggestions even when the library could fill the week alone.
3. **Mostly new** — prefer AI/web suggestions; pull from the collection only when a clear
   favorite fits.

For scheduled/unattended runs (Phase 5), use hybrid unless `sourcing_mode` is set in
`household.md` (`library-only` | `hybrid` | `mostly-new`). Always surface the choice on
manual runs, especially the first week.

## Step 3 — Select recipes (hybrid sourcing §5.3)
Honor, as hard vs. soft constraints:
- **Hard:** every member's `allergies`; `diet` type; recipe `equipment` ⊆ `config/equipment.md`.
- **Soft (bias, don't forbid):** `avoid` items (flag if unavoidable), `target_prep_time_min`,
  `weekly_budget_usd`, each person's `preferences`.
- **Ratings (§5.7):** boost high `rating`; suppress low; use `rating_notes` + `liked_traits` to
  find *similar* winners (e.g. a loved "bowl format" → favor more bowl-style meals, not just that
  recipe). Avoid repeating anything cooked very recently (`last_cooked`).
- **Sourcing (follow Step 2.5 choice):**
  - *Library only* — fill all slots from the personal collection.
  - *Mix in new ideas* — intentionally include some AI/web suggestions alongside collection
    picks; do **not** wait until the library is exhausted.
  - *Mostly new* — fill primarily with AI/web suggestions matched to preferences+ratings;
    use collection recipes sparingly for clear favorites.
  Mark suggested-new recipes clearly in the draft (they aren't in the collection yet).
- **Favor shared ingredients** across the chosen set to cut waste (e.g. reuse peppers/onion/lime
  across two meals) — this is an explicit selection tiebreaker.

## Step 4 — Assign meals to days
- Map each chosen dinner to a specific night based on who's home and prep effort (lighter/faster
  meals on busy nights; leftover-friendly meals before out-nights).
- Apply `portion_strategy`: `scale-to-whos-home` (size to headcount that night) /
  `deliberate-leftovers` (scale up to cover a future night — note the planned leftover) /
  `always-full-family` (always full servings).

## Step 5 — Grocery list, grouped by store (§5.4)
- Aggregate `ingredients` across all chosen recipes; **sum quantities per item**, scaling by the
  Step-4 servings vs. each recipe's `servings`. If two entries share an item but differ in unit,
  keep them as separate lines and note the unit mismatch rather than guessing a conversion.
- **Shoppable quantities:** for grocery output, round **up** fractional quantities when `unit`
  is a buyable discrete unit (`whole`, `count`, `can`, `bunch`, `head`, `clove`, or similar) —
  e.g. `0.5 whole` onion → `1 whole`. Never emit fractional "whole"/"count" buy amounts.
  Recipe-level fractions stay in the cooking docs; the shopping list uses practical purchase
  amounts. Weight/volume units (`lb`, `oz`, `cup`, `tbsp`, etc.) may stay fractional if that's
  how they're sold/measured.
- **Exclude** anything with `staple: true` in a recipe **or** present in `config/pantry-staples.md`.
- **Group by store** using `store-rankings.md`, capped by `weekly_store_count` from
  `household.md` (default **2** if unset):
  - Use only the top `weekly_store_count` ranked stores for this week's list.
  - When `weekly_store_count` is **1**: put **everything** at the rank-1 store.
  - When **2**: bulk/shared proteins & staples → rank-1; everything else → rank-2 (do not
    open a third store just because a `best_for` matches better).
  - When higher: assign within the allowed top-N by `best_for`, then fall back to the
    lowest-ranked allowed store for leftovers — never exceed the cap.
  Order groups by store rank.

## Step 6 — Present the draft & get approval
Show a single review block, top to bottom:
1. Any assumption flags (empty-calendar, unavoidable `avoid` hits, suggested-new recipes).
2. **Menu by day** (date · who's home · recipe · prep time).
3. **Grocery list grouped by store**.
4. **Prep reminders preview** (Step 7).
Then ask the user to **approve, edit, or reject**. Do NOT write any outputs until approved.
- On "edit": apply changes (swap a recipe, change a night, adjust count) and re-show.
- **Scheduled-run deadline rule (Phase 5):** if this runs unattended and isn't approved by the
  **evening before `shopping_day`**, auto-finalize the draft as-is so shopping isn't blocked.

## Step 7 — On approval, write outputs
Do these only after explicit approval (or the deadline auto-finalize).

**A. Grocery list → Apple Reminders "Groceries" list**
- Use apple-events `reminders_lists` to find/create a list named exactly **Groceries**.
- Add one task per grocery line via `reminders_tasks`. **Plain text titles only — no emoji, no
  em-dashes** (constraint).
  - **Title** = ingredient line only, e.g. `chicken breast 3 lb` or `persian cucumber 2 whole`
    (no store prefix in the title).
  - **Tag** = the assigned store name via the `tags` parameter, e.g. `tags: ["Costco"]` or
    `tags: ["Jewel-Osco"]`, so the Groceries list can be filtered/grouped by store in Reminders.
    (apple-events stores tags as `[#StoreName]` in notes — that is expected.)

**B. Prep reminders → Apple Reminders "Family Meals" list**
- Find/create a list named exactly **Family Meals**.
- One reminder per recipe that needs prep, with **per-recipe timing**: frozen protein → "Defrost
  <item>" due the **night before** (~7pm); marinade/brine → "Marinate <item>" the **morning of**;
  slow-cooker meals → morning-of start. Title plain-text, e.g. `Defrost chicken for Tue fajitas`.
  Set the reminder due date/time accordingly.

**C. Recipes → Google Docs (one Doc per dinner)**
- Find or create a top-level Drive folder named **Family Dinners** (search first via
  `searchDriveFiles` mimeType `folder`; create with `createFolder` if absent). Tell the user to
  share this top folder once with their partner — everything nests under it.
- Under it, create a weekly subfolder **Week of YYYY-MM-DD** (the Monday date).
- For each dinner, `createDocument` in that weekly folder with `initialContent` = the recipe's
  markdown (title, servings scaled to the plan, Ingredients, Steps, Notes). **Name each doc
  `YYYY-MM-DD (Day) — <Recipe Title>`** so they sort by date and read as the daily menu index (no
  separate menu doc — the folder *is* the index).
- New-doc-per-dinner is **create-only** — never edit an existing week's docs in place.

**D. Update recipe frontmatter**
- For each collection recipe used, increment `times_cooked` and set `last_cooked` to its assigned
  date. For AI/web-sourced picks the user wants to keep, offer to save them into `recipes/<slug>.md`
  via `recipes/_template.md` (structured `ingredients` + body in sync).

## When done
- Summarize: menu by day, the Groceries list count, the prep reminders set, and a link to the
  weekly Drive folder.
- Remind the user the grocery list is checkable on their phone and the recipes are in the shared
  folder for the mobile cooking UX.
