---
"@styleframe/theme": minor
---

Align the Spinner recipes with the Open Components Spinner standard. `useSpinnerRecipe`, `useSpinnerCircleRecipe` and `useSpinnerTextRecipe` gain an `em` size, which makes the spinner `1em` wide and tall so it matches the text around it, and the spinner no longer shrinks in a flex row. With reduced motion, `useSpinnerCircleRecipe` swaps the turn for a pulse that fades the spinner to 40% and back every 1.6 seconds, and stops the arc from growing and shrinking. The pulse uses `!important` for its duration and iteration count, so it keeps going under the sanitize preset. The `light` color of `useSpinnerRecipe` now switches to `@color.white` in the dark theme, because the spinner has no background of its own and a `gray-700` spinner was nearly invisible on a dark page. The `dark` color stays white in both themes, for dark surfaces like the overlay's backdrop.
