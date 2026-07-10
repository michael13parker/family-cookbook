---
# Your grocery stores in ranked preference order.
# The grocery list is grouped by store using this ranking — but only up to
# `weekly_store_count` from household.md (typical weekly trip cap). Extra ranked
# stores are available for occasional runs; they are not used every week by default.
stores:
  - name: Costco
    rank: 1
    best_for: "bulk proteins, staples, large quantities"
  - name: Trader Joe's
    rank: 2
    best_for: "produce, snacks, quick-prep items"
  - name: Kroger
    rank: 3
    best_for: "everyday fill-ins and anything missing elsewhere"
---

# Store rankings

Template — copy to `store-rankings.md` (gitignored). Rank the stores you actually shop at.
The weekly run groups the grocery list by store so shopping is efficient, capped by
`weekly_store_count` in `household.md` (usually 1–2 stops per week).

**MVP scope:** this uses simple ranked-store grouping only — no live sale/price lookups or
multi-store price optimization (deferred; see requirements §4.2). `home_address` in
`household.md` can help Claude suggest nearby stores during kickoff.
