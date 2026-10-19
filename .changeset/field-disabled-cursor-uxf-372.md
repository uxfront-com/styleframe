---
"@styleframe/theme": patch
---

Show the `not-allowed` cursor on a disabled field. In `useInputRecipe`, `useTextareaRecipe`, `useInputDateRecipe` and `useOtpCellRecipe`, the disabled state set `pointer-events: none`, which hid its own cursor too. It now sets only the opacity and the cursor. The nested `.input-field` and `.textarea-field` get `cursor: not-allowed` when disabled, and a disabled textarea gets `resize: none`, so its resize handle stays off.
