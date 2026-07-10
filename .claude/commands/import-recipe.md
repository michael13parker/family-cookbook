---
description: Extract a recipe from a pasted link or a photo into a structured markdown file in the collection
---

# /import-recipe — Grow the recipe collection

Turn a **recipe link** (NYT, a food blog, TikTok/Instagram) or a **photo of a recipe card**
into a structured `recipes/<slug>.md` file (requirements §5.3 "collection growth"). The
frontmatter `ingredients` block drives the grocery list, so getting it structured correctly is
the whole point — this is what makes an imported recipe usable by `/plan-week`.

## Preflight — load schema & config
1. Read `recipes/_template.md` — the exact frontmatter schema and body layout to reproduce.
2. Read config so the extracted recipe fits the household:
   - `config/equipment.md` — the gear the family actually owns (constrains the `equipment` field).
   - `config/pantry-staples.md` — items to mark `staple: true` (so they're excluded from grocery lists).
   - If a real `config/*.md` is missing, you can still import — just skip the staple/equipment
     cross-check and note that `/kickoff` hasn't been run.
3. Identify the input the user gave:
   - **URL** → extract its content (see Step 1).
   - **Image** (uploaded photo / screenshot of a recipe card) → read it directly with the Read
     tool, which renders the image; transcribe every ingredient and step.
   - **Pasted text** → use it as-is.
   - If none was provided, ask the user to paste a link, attach a photo, or paste the recipe text.

## Step 1 — Extract the source content
- **Standard web page / blog** → use the **defuddle** skill to pull clean markdown (strips ads,
  nav, life-story preamble). Do NOT use it for `.md` URLs — fetch those directly with WebFetch.
- **TikTok / Instagram / video links** → the recipe usually lives in the caption/description, not
  a structured ingredients block. Extract what's there; if quantities are missing or vague, say so
  and ask the user to fill the gaps rather than inventing amounts.
- **Photo** → transcribe from the image. If part is illegible, flag exactly what you couldn't read
  and ask, rather than guessing.
- Keep the `source` field = the original URL, or the cookbook/card name, or `"family"` for a
  photo of a handwritten card.

## Step 2 — Structure it into the schema
Fill the frontmatter to match `recipes/_template.md` **exactly**:
- `title`, `source`, `servings`, `prep_time_min` (hands-on), `total_time_min` (incl. passive).
- `equipment`: only the gear the recipe needs. **Cross-check against `config/equipment.md`** — if
  the recipe requires equipment the family doesn't own (e.g. air fryer, stand mixer), keep it in
  the field but **flag it** to the user so they can pick a workaround or skip the recipe.
- `tags`: protein / cuisine / format hooks (e.g. `[chicken, one-pan, weeknight]`) — these seed
  `/plan-week` suggestions.
- `ingredients`: the **structured source of truth**. One entry per ingredient with `item`, `qty`,
  `unit`, and `aisle` (`meat | produce | dairy | pantry | frozen | bakery | ...`). Add
  `staple: true` to any item present in `config/pantry-staples.md` or that's obviously a
  pantry staple (oil, salt, common spices) — these get excluded from the grocery list.
  - Normalize amounts to numbers + a unit (`0.5` + `tsp`, not `"½ tsp"`). Split "1 lime, juiced"
    into item `lime`, qty `1`, unit `whole`.
- **Ratings fields start empty** (not cooked yet): `rating:` blank, `rating_notes: ""`,
  `liked_traits: []`, `last_cooked:` blank, `times_cooked: 0`. These are managed later by
  `/review-recipes` and `/plan-week` — don't set them here.

## Step 3 — Write the body (kept in sync with frontmatter)
- `# Title`, one-line description, then `## Ingredients` (human-readable, may be grouped like
  "Chicken / Dressing / Salad"), `## Steps` (numbered), `## Notes` (tips, subs, scaling).
- The body `## Ingredients` must list the **same** items as the frontmatter `ingredients` block —
  the frontmatter is what the grocery list reads; the body is the cooking view. Keep them matched.
- If the family's `dietary.md` has a relevant quirk (e.g. a member only eats chicken grilled),
  it's fine to add a line to `## Notes`, but don't alter the recipe itself.

## Step 4 — Confirm, then save
- Pick a filename: `recipes/<slug>.md` where `<slug>` is the kebab-case title
  (e.g. `sheet-pan-chicken-fajitas.md`). **Check for an existing file first** — if one exists, ask
  whether to overwrite, save under a variant name, or cancel. Never silently clobber.
- Show the user the drafted recipe (frontmatter + body) and any flags (missing quantities,
  unavailable equipment) and get a thumbs-up **before** writing.
- Write the file with the Write tool.

## When done
- Confirm the path written and give a one-line summary (protein, format, prep time).
- Mention it's now in the collection and `/plan-week` can suggest it. Note it's **unrated** until
  the family cooks it and `/review-recipes` captures a rating.
- Offer to import another.
