---
# Per-person dietary preferences and requirements.
# One entry per household member — names should match household.example.md.
people:
  - name: Alex
    diet: omnivore            # omnivore | vegetarian | vegan | pescatarian | ...
    allergies: [shellfish]    # HARD exclusions — never suggested
    avoid: [cilantro]         # soft dislikes — avoided when possible
    preferences: "loves spicy food and big salads"
  - name: Sam
    diet: omnivore
    allergies: []
    avoid: [mushrooms, blue cheese]
    preferences: "prefers chicken over red meat"
  - name: Riley
    diet: omnivore
    allergies: [peanuts]      # child — strict
    avoid: [very spicy]
    preferences: "kid-friendly, mild flavors, loves pasta"
---

# Dietary preferences & requirements

Template — copy to `dietary.md` (gitignored) and fill in your family's real needs.

- **allergies** are hard rules: any recipe containing these is never suggested.
- **avoid** are soft: the planner steers around them but may include if unavoidable, and
  will flag it.
- **preferences** is free text the planner uses to bias suggestions toward what each person
  enjoys.
