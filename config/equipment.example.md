---
# Cooking equipment available at home.
# The planner only suggests recipes you can actually make.
equipment:
  - stovetop
  - oven
  - microwave
  - air fryer
  - slow cooker
  - blender
  - sheet pans
# Add or remove freely, e.g. "instant pot", "grill", "sous vide", "stand mixer".
---

# Equipment

Template — copy to `equipment.md` (gitignored). List what you own so the planner won't
suggest a recipe that needs gear you don't have (e.g. no air-fryer recipes if you have none).
Each recipe's `equipment` field is checked against this list.
