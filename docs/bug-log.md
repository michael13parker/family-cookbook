# Bug Log

Running log of issues found during testing. Add notes freely as you go — nothing here is actioned until you say so.

**Status key:** 🔴 Open · 🟡 In progress · 🟢 Fixed · ⚪ Won't fix / by design

---

## Open bugs

### BUG-001 — Example recipe treated as real collection entry
- **Status:** 🔴 Open
- **Found:** 2026-07-10
- **Where:** `/kickoff`, `/plan-week`, `recipes/sheet-pan-chicken-fajitas.md`
- **Severity:** medium
- **What happened:** Running `/kickoff` pre-loads `recipes/sheet-pan-chicken-fajitas.md` as a demo/example. When you then run `/plan-week` for your first week, the planner reads every `recipes/*.md` (except `_`-prefixed templates) and treats that file as a real recipe the household added — including its ratings (`rating: 5`), `times_cooked`, and `last_cooked` — and may suggest or schedule it as if it were a family favorite.
- **Expected:** Example/demo recipe files should be clearly marked and excluded from meal planning until the user explicitly adopts them (or adds their own). A fresh household with no recipes of their own should not inherit baked-in demo meals.
- **Steps to reproduce:**
  1. Clone the repo on a fresh machine (or delete any personal recipes you added).
  2. Run `/kickoff` and complete household setup without importing your own favorite recipes.
  3. Run `/plan-week` for the coming week.
  4. Observe that `sheet-pan-chicken-fajitas` (and any other committed demo recipes in `recipes/`) appear in the collection and influence selection as real, rated family recipes.
- **Notes / ideas:** Mirror the config pattern — e.g. rename to `*.example.md`, move demos under `recipes/examples/`, add an `_` prefix, or add frontmatter like `example: true` and teach `/plan-week` to skip those files. The `_template.md` convention already documents that `_`-prefixed files are skipped; example recipes need an equivalent signal.

### BUG-002 — Kickoff implies a 5-recipe collection limit
- **Status:** 🔴 Open
- **Found:** 2026-07-10
- **Where:** `/kickoff` (interview step F), `docs/requirements.md` §5.1 item 11
- **Severity:** low
- **What happened:** During kickoff, the favorite-recipes step reads like a hard cap on the whole cookbook — e.g. "Want to seed the collection with **up to 5** favorite recipes now?" and "Go ahead and tell me your favorite recipes — names and links if you have them (**up to 5**)." That makes it sound like the family can only ever have five recipes, not that kickoff is offering to import a few starters now and you can add more anytime.
- **Expected:** Wording should make clear that (a) this step is optional, (b) "up to 5" is only a kickoff seeding batch to get started quickly, and (c) the collection is unlimited — add recipes whenever via links, photos, or chat (requirements §5.3 collection growth).
- **Steps to reproduce:**
  1. Run `/kickoff` through to step F (favorite recipes).
  2. Note the prompt language ("up to 5") and optional multiple-choice framing.
  3. User may hesitate to paste more than five links or assume later imports aren't supported.
- **Notes / ideas:** Rephrase kickoff step F and requirements §5.1 item 11 — e.g. "Want to import a few favorites now to seed the collection? (optional — you can skip or add more anytime)." Drop or soften the "up to 5" ceiling in user-facing copy; keep a soft batch limit in the command only if needed to keep kickoff short, not as a product limit.

### BUG-003 — plan-week never asks library-only vs. new ideas
- **Status:** 🔴 Open
- **Found:** 2026-07-10
- **Where:** `/plan-week` (Step 3 — Select recipes), `docs/requirements.md` §5.3
- **Severity:** medium
- **What happened:** On first `/plan-week` run, the draft used only recipes already in the collection — no new AI/web suggestions, and no prompt asking whether this week should stick to the library or mix in new ideas.
- **Expected:** Before selecting recipes (after confirming dinner count in Step 2), ask the user how to source this week's meals — e.g. **library only**, **mix in new ideas** (hybrid), or **mostly new** — then follow that choice. Hybrid sourcing (§5.3) should not silently default to "exhaust the library first" when the collection already covers the week.
- **Steps to reproduce:**
  1. Complete `/kickoff` with enough imported favorites to cover `default_dinner_count` (e.g. 4–5 recipes for a 5-dinner week).
  2. Run `/plan-week` for the coming week.
  3. Confirm dinner count when prompted.
  4. Observe the draft pulls only from `recipes/*.md` with no new suggestions and no question about sourcing preference.
- **Notes / ideas:** Current command text says "fill from the personal collection first; fill **remaining slots** with AI/web suggestions" — so if the library is big enough, new ideas never appear. Add an explicit Step 2½ or expand Step 3 in `plan-week.md` (and optionally a `sourcing_mode` field in config for scheduled runs). First-time runs especially should surface the choice so families know hybrid exists.

### BUG-004 — Grocery list splits across too many stores; kickoff never asks trip count
- **Status:** 🔴 Open
- **Found:** 2026-07-10
- **Where:** `/kickoff` (step D — Shopping), `/plan-week` (Step 5 — grocery grouping), `config/store-rankings.md`
- **Severity:** medium
- **What happened:** On the first `/plan-week` run, the generated grocery list was grouped across **3 stores** (e.g. Costco, Jewel-Osco, Mariano's). For a family of four doing one weekly shop, that's too many stops — the list reads like a multi-store optimization pass, not a practical single-trip (or two-trip) plan.
- **Expected:** Kickoff should ask **how many stores the family actually shops at each week** (typically 1–2 for most households). That preference should be stored in config and `/plan-week` should cap grocery grouping to that many stores — consolidating items into the top-ranked store(s) rather than spreading every specialty item to a different `best_for` match.
- **Steps to reproduce:**
  1. Complete `/kickoff` with 3–4 ranked stores in `store-rankings.md` (each with a different `best_for`).
  2. Run `/plan-week` and approve the draft.
  3. Open the Groceries reminders list and count distinct store prefixes on line items.
  4. Observe 3+ stores despite no kickoff question about weekly shopping-trip habits.
- **Notes / ideas:** Kickoff step D currently only collects store names + rankings + `best_for`; requirements §5.1 item 2 is the same. Add something like `weekly_store_count: 1` (or `max_stores_per_week`) to `household.md` or `store-rankings.md`. Update plan-week Step 5: when `weekly_store_count` is 1, put everything at rank-1; when 2, allow bulk at rank-1 and everything else at rank-2, etc. Optionally still collect a longer ranked list for occasional runs, but default weekly output should respect the trip cap.

### BUG-005 — Grocery reminders: store in title not tag; fractional buy quantities
- **Status:** 🔴 Open
- **Found:** 2026-07-10
- **Where:** `/plan-week` (Step 5 aggregation, Step 7A — Groceries reminders), apple-events `reminders_tasks`
- **Severity:** medium
- **What happened:** When the approved grocery list is written to Apple Reminders, each item is saved with the **store name in the task title**, e.g. `Jewel-Osco: persian cucumber 2 whole`. All items show the same generic **"Store:"** tag (or no meaningful store tag). Separately, the list includes **non-shoppable fractional quantities** copied from recipe scaling — e.g. `Jewel-Osco: red onion 1/2 whole` — which you can't buy at the store.
- **Expected:**
  1. **Store → Reminder tag:** Task title should be the ingredient line only (e.g. `persian cucumber 2 whole`). The assigned store (Costco, Jewel-Osco, etc.) should be set on the reminder's **tag** so the Groceries list can be filtered/grouped by store in Reminders.
  2. **Shoppable quantities:** Grocery aggregation should round up to buyable units — e.g. `1/2 whole` onion → `1 whole`; never emit fractional "whole" counts for produce/pack items. Recipe-level fractions stay in the cooking doc; the shopping list uses practical purchase amounts.
- **Steps to reproduce:**
  1. Run `/plan-week` with meals whose scaled ingredients include fractional produce (e.g. half an onion in one recipe).
  2. Approve the plan so items are written to the **Groceries** Reminders list.
  3. Open Reminders: note store prefix in every title and missing/wrong store tags.
  4. Find at least one line with a fractional buy qty (e.g. `red onion 1/2 whole`).
- **Notes / ideas:** Step 7A in `plan-week.md` currently instructs `Costco: chicken breast 3 lb` title prefix — that's the root cause for (1). Update the command + requirements §5.5 to use `reminders_tasks` tag field (verify apple-events MCP supports tags on create). For (2), add a Step 5 rule: round up `qty` for grocery output when `unit` is `whole`, `count`, or similar; document in recipe schema / aggregation logic. Consider a small `grocery_rounding` note in requirements §5.4.

<!--
Copy this template for each new bug:

### BUG-006 — <short title>
- **Status:** 🔴 Open
- **Found:** YYYY-MM-DD
- **Where:** <command / file / step>
- **Severity:** low / medium / high
- **What happened:**
- **Expected:**
- **Steps to reproduce:**
- **Notes / ideas:**
-->

---

## Fixed / closed

<!-- Move bugs here once resolved, keep for reference -->
