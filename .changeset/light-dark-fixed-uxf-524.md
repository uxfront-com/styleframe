---
"@styleframe/theme": patch
---

The `useInputDateRecipe` separator now takes the field's muted text color, the same one the placeholder uses, instead of `@color.text-weak` with a `gray-400` override in the dark theme. It keeps one color on `light` and `dark` fields in both themes, and still adapts on `neutral` ones.
