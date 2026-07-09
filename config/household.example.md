---
# ── Household core ──────────────────────────────────────────────
home_address: "123 Example St, Springfield, IL 62704"  # used to find nearby grocery stores
weekly_budget_usd: 150          # target grocery spend per week
target_prep_time_min: 40        # ideal hands-on dinner prep time
default_dinner_count: 5         # dinners to plan when the calendar is empty (requirements §5.8)

# ── Members ─────────────────────────────────────────────────────
# Everyone the workflow cooks for. Dietary needs live in dietary.example.md.
members:
  - name: Alex
    age: 38
  - name: Sam
    age: 36
  - name: Riley
    age: 6

# ── Portion strategy ────────────────────────────────────────────
# How to size cooking when people are out on different nights.
# Options: scale-to-whos-home | deliberate-leftovers | always-full-family
portion_strategy: deliberate-leftovers

# ── Scheduling ──────────────────────────────────────────────────
meal_planner_run: "Sunday 09:00"  # when the weekly planner drafts the plan
shopping_day: "Sunday"            # weekly grocery day; approval deadline = the evening before

# ── Calendars to watch ──────────────────────────────────────────
# ONLY these calendars are read to detect who's home / dinners-out.
# Everything else (sports, holidays, subscriptions) is ignored.
# Names must match your Apple Calendar EXACTLY — kickoff will list yours.
watch_calendars:
  - Family
  - Work
  - Block Outs
  - Travel
  - School/Sports
---

# Household config

This is the **template**. Copy it to `household.md` (drop the `.example`) and fill in your
real values. `household.md` is gitignored, so your address, budget, and family details are
never committed or shared.

You can edit these fields directly, or just tell Claude *"bump our budget to $175"* or
*"add our new baby to the household"* and it will update this file for you.

**Related config files** (same copy-the-template pattern):
- `dietary.example.md` — per-person preferences and ingredients to avoid
- `pantry-staples.example.md` — what's always on hand (excluded from grocery lists)
- `store-rankings.example.md` — your ranked grocery stores
- `equipment.example.md` — cooking equipment available

**Note on calendars:** the workflow only ever *reads* these calendars — it never creates or
edits calendar events. The only things it writes are prep reminders (to a dedicated "Family
Meals" Reminders list) and the grocery list (to Apple Notes).
