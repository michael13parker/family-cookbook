# Bug Log

Running log of issues found during testing. Add notes freely as you go — nothing here is actioned until you say so.

**Status key:** 🔴 Open · 🟡 In progress · 🟢 Fixed · ⚪ Won't fix / by design

---

## Open bugs

<!-- None open -->

---

## Fixed / closed

### BUG-001 — Example recipe treated as real collection entry
- **Status:** 🟢 Fixed
- **GitHub:** https://github.com/michael13parker/family-cookbook/issues/1
- **Found:** 2026-07-10
- **Fixed:** 2026-07-10
- **Where:** `/kickoff`, `/plan-week`, `recipes/sheet-pan-chicken-fajitas.md`
- **Severity:** medium
- **What happened:** Running `/kickoff` pre-loads `recipes/sheet-pan-chicken-fajitas.md` as a demo/example. When you then run `/plan-week` for your first week, the planner reads every `recipes/*.md` (except `_`-prefixed templates) and treats that file as a real recipe the household added — including its ratings (`rating: 5`), `times_cooked`, and `last_cooked` — and may suggest or schedule it as if it were a family favorite.
- **Expected:** Example/demo recipe files should be clearly marked and excluded from meal planning until the user explicitly adopts them (or adds their own). A fresh household with no recipes of their own should not inherit baked-in demo meals.
- **Fix:** Added `example: true` to committed demos (`sheet-pan-chicken-fajitas`, `beef-taco-bowls`). `/plan-week` skips `_`-prefixed files **and** `example: true`. Documented adopt path in `_template.md` and kickoff step F; requirements §5.3 / §7 updated.

### BUG-002 — Kickoff implies a 5-recipe collection limit
- **Status:** 🟢 Fixed
- **GitHub:** https://github.com/michael13parker/family-cookbook/issues/2
- **Found:** 2026-07-10
- **Fixed:** 2026-07-10
- **Where:** `/kickoff` (interview step F), `docs/requirements.md` §5.1 item 11
- **Severity:** low
- **What happened:** During kickoff, the favorite-recipes step reads like a hard cap on the whole cookbook — e.g. "Want to seed the collection with **up to 5** favorite recipes now?" That makes it sound like the family can only ever have five recipes.
- **Expected:** Wording should make clear that (a) this step is optional, (b) "up to 5" is only a kickoff seeding batch, and (c) the collection is unlimited.
- **Fix:** Rewrote kickoff step F as optional starter batch (~5 soft limit for kickoff length only). Requirements §5.1 item 11 now says seed-only, unlimited growth via §5.3.

### BUG-003 — plan-week never asks library-only vs. new ideas
- **Status:** 🟢 Fixed
- **GitHub:** https://github.com/michael13parker/family-cookbook/issues/3
- **Found:** 2026-07-10
- **Fixed:** 2026-07-10
- **Where:** `/plan-week` (Step 3 — Select recipes), `docs/requirements.md` §5.3
- **Severity:** medium
- **What happened:** On first `/plan-week` run, the draft used only recipes already in the collection — no new AI/web suggestions, and no prompt asking whether this week should stick to the library or mix in new ideas.
- **Expected:** Before selecting recipes, ask library only / mix in new ideas / mostly new, then follow that choice.
- **Fix:** Added Step 2.5 sourcing preference; Step 3 follows the choice (no silent "exhaust library first"). Optional `sourcing_mode` in `household.example.md` for scheduled runs. Requirements §5.2 / §5.3 updated.

### BUG-004 — Grocery list splits across too many stores; kickoff never asks trip count
- **Status:** 🟢 Fixed
- **GitHub:** https://github.com/michael13parker/family-cookbook/issues/4
- **Found:** 2026-07-10
- **Fixed:** 2026-07-10
- **Where:** `/kickoff` (step D — Shopping), `/plan-week` (Step 5 — grocery grouping), `config/store-rankings.md`
- **Severity:** medium
- **What happened:** First `/plan-week` grocery list was grouped across 3+ stores despite a typical one- or two-stop weekly shop.
- **Expected:** Kickoff asks weekly store trip count; plan-week caps grouping to that many stores.
- **Fix:** Added `weekly_store_count` to `household.example.md` and kickoff step D. Plan-week Step 5 caps to top-N stores (1 → all at rank-1; 2 → bulk at rank-1, rest at rank-2). Requirements §5.1 / §5.4 updated.

### BUG-005 — Grocery reminders: store in title not tag; fractional buy quantities
- **Status:** 🟢 Fixed
- **GitHub:** https://github.com/michael13parker/family-cookbook/issues/5
- **Found:** 2026-07-10
- **Fixed:** 2026-07-10
- **Where:** `/plan-week` (Step 5 aggregation, Step 7A — Groceries reminders), apple-events `reminders_tasks`
- **Severity:** medium
- **What happened:** Reminder titles were `Store: item qty`; store wasn't a useful tag. Fractional buy qtys like `1/2 whole` onion appeared on the shopping list.
- **Expected:** Title = ingredient only; store via `tags`; round up discrete buy units.
- **Fix:** Step 7A uses title without store prefix + `tags: ["StoreName"]` (apple-events supported). Step 5 rounds up `whole`/`count`/`can`/etc. Requirements §5.4 / §5.5 updated.

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
