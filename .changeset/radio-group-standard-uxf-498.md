---
"@styleframe/theme": patch
---

Bring `useRadioRecipe`, `useRadioFieldRecipe` and `useRadioGroupRecipe` in line with the Open Components Radio Group standard. The focus ring is `@color.focus`, and the unchecked rings are now `@color.gray-450` on light surfaces and `@color.gray-500` on dark ones, so they keep 3:1 against the page and the fill in both modes. Each radio row has a `min-height` in `rem` (`2rem`, `2.25rem` and `2.5rem`, the standard's Input heights), and at least 44px on touch screens, and the circle is sized in `rem` with no margin of its own. In forced colors mode the browser draws its own radio, with a `Highlight` focus ring and a `GrayText` disabled label, and with `prefers-contrast: more` the rings are drawn at full strength. The group now resets its `<fieldset>`, styles its `<legend>`, a `data-slot="hint"` and a `data-slot="error"`, and turns every ring red, with an inset shadow, while it has `aria-invalid="true"`.
