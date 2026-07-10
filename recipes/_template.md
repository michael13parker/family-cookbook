---
title: "Recipe Title"
source: ""                     # URL, cookbook name, "AI-generated", or "family"
example: false                 # true = committed demo; /plan-week skips until you adopt it
servings: 4
prep_time_min: 30              # hands-on time
total_time_min: 45             # including passive cook time
equipment: [stovetop, oven]    # must be a subset of config/equipment.md
tags: [chicken, one-pan, weeknight]   # protein / cuisine / format hooks for suggestions
ingredients:                   # STRUCTURED list — drives grocery aggregation & shared-ingredient logic
  - item: chicken thighs
    qty: 1.5
    unit: lb
    aisle: meat                # meat | produce | dairy | pantry | frozen | bakery | ...
  - item: yellow onion
    qty: 1
    unit: whole
    aisle: produce
  - item: olive oil
    qty: 2
    unit: tbsp
    aisle: pantry
    staple: true               # true = usually on hand; excluded from the grocery list
# ── Ratings (managed by the recipe-reviewer job; requirements §5.7) ──
rating:                        # 1–5, current only (overwritten on re-rate). Blank until cooked.
rating_notes: ""               # free text — carries the real signal for "find similar"
liked_traits: []               # structured hooks, e.g. [bowl-format, one-pan, quick]
last_cooked:                   # YYYY-MM-DD
times_cooked: 0                # increments each time the recipe is planned
---

# Recipe Title

One-line description (optional).

## Ingredients
- 1.5 lb chicken thighs
- 1 yellow onion, diced
- 2 tbsp olive oil

## Steps
1. First step.
2. Second step.
3. Third step.

## Notes
Tips, substitutions, or scaling notes.

<!--
Conventions:
- Files starting with "_" (like this one) are templates and are skipped by the planner.
- Files with `example: true` are committed demos and are also skipped by the planner.
  To adopt a demo: set `example: false` (or remove the field) and clear/reset ratings if
  you want a fresh history — or copy it to a new slug under your personal recipes.
- The frontmatter `ingredients` block is the source of truth for the grocery list; the
  body Ingredients section is the human-readable cooking view. Keep them in sync (the
  recipe-import skill generates both).
-->
