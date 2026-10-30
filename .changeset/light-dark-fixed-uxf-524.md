---
"@styleframe/theme": patch
---

The `useInputDateRecipe` separator on `light` and `dark` fields now takes the field's muted text color, the same one the placeholder uses, so it keeps one color in both themes. The wrapper gets a `-light` or `-dark` class for it. The separator on `neutral` fields doesn't change.
