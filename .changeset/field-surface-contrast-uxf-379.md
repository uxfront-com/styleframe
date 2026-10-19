---
"@styleframe/theme": patch
---

Give every field an edge that people can see. In `useInputRecipe`, `useTextareaRecipe`, `useInputDateRecipe` and `useOtpCellRecipe`, the border was `gray-200` (1.58:1 on white), the ghost variant had no edge at rest and the read-only state differed only by a faint tint. The borders are now `gray-450` and `gray-500`, at least 3:1 against the field and the page in light and dark mode, as WCAG 1.4.11 asks of a control's boundary. The ghost variant shows a bottom border with square bottom corners, which turns to the error color when the field is invalid, and the read-only state adds a dashed border.
