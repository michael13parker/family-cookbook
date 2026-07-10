---
description: Prompt the family to rate recently cooked dinners, then update each recipe's ratings frontmatter
---

# /review-recipes — Ratings feedback loop

Collect ratings on **recently cooked** dinners and write them back into each recipe's frontmatter
(requirements §5.7). This is the job scheduled twice weekly (Wed + Fri evenings, §5.8) so ratings
stay fresh for the next `/plan-week` run — but it's runnable manually anytime. Keep it quick and
conversational; a busy family should be able to rate a few meals in under a minute.

## Preflight — find what to review
1. Read every `recipes/*.md` **except** files starting with `_` (templates). Parse the frontmatter:
   `title`, `last_cooked`, `times_cooked`, `rating`, `rating_notes`, `liked_traits`, `tags`.
2. Build the review list = recipes **cooked recently and not yet rated for that cook**:
   - Include recipes with a `last_cooked` in roughly the **last 10 days**.
   - Prioritize ones with a **blank `rating`**, then ones cooked again since they were last rated
     (a fresh `last_cooked` on an already-rated recipe = worth re-rating).
   - Skip templates, and skip recipes never cooked (`times_cooked: 0` / blank `last_cooked`).
3. If nothing qualifies, say so ("No recently cooked dinners to rate — all caught up") and stop.

## Step 1 — Prompt for ratings (conversational)
For each recipe on the list, ask the family to rate it. Ask in **small batches** (2–3 at a time),
not one giant form. For each:
- Show the recipe title and when it was cooked (`last_cooked`).
- Ask for a **1–5 rating** and **optional free-text notes**. Make clear the notes are the valuable
  part — "loved the bowl format", "too spicy", "halve the garlic next time".
- Accept "we didn't actually make it" / "skip" → leave that recipe unchanged and move on.
- **No response at all** (unattended scheduled run) → capture nothing this cycle; that's fine, the
  next run re-prompts. Never invent a rating.

## Step 2 — Derive liked_traits from the notes
The point of ratings is to find *similar* winners later, so translate the free-text signal into
structured hooks:
- For a **positive** rating, pull `liked_traits` tags from what the family said + the recipe's own
  `tags` — e.g. a note praising "in a bowl" → add `bowl-format`; "so easy on a weeknight" →
  `one-pan` / `quick`. Merge with any existing `liked_traits` (union, don't duplicate).
- Keep traits as short kebab-case hooks (`bowl-format`, `one-pan`, `quick`, `make-ahead`,
  `kid-friendly`). Don't overfit — 1–3 new traits per recipe is plenty.
- For a **low** rating, it's fine to leave `liked_traits` as-is; the low `rating` itself tells
  `/plan-week` to suppress it.

## Step 3 — Write the ratings back
For each rated recipe, update **only** these frontmatter fields with the Edit tool:
- `rating:` → the new 1–5 value (**overwrite** — one current rating per recipe, §5.7).
- `rating_notes:` → the new notes (overwrite; if the family adds to earlier notes, keep the useful
  parts).
- `liked_traits:` → the merged list from Step 2.

**Do not touch** `last_cooked` or `times_cooked` — those are managed by `/plan-week` (they track
planning, not rating). **Do not edit the recipe body.** Make surgical frontmatter edits only, and
preserve YAML formatting/quoting so `/plan-week` can still parse the file.

## When done
- Summarize what changed: each recipe rated, its new score, and any new `liked_traits`.
- Note how it feeds forward — high-rated recipes and their traits get **boosted** in the next
  `/plan-week`; low-rated ones get **suppressed**.
- If some recipes on the list were skipped, list them so the family knows they're still unrated.
