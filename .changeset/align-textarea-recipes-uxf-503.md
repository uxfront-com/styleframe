---
"@styleframe/theme": minor
---

Bring `useTextareaRecipe` in line with the Open Components Textarea standard, and add an `autogrow` axis that defaults to `false`, so today's output stays the same. With `autogrow: true`, in browsers that support `field-sizing`, the textarea grows with its text through `field-sizing: content` and has no resize handle, up to the rows in its `data-max-rows` attribute. The nested textarea now has a `min-height` of its `rows` in lines, read with `attr()`, so resizing or growing never makes it shorter than its rows. On touch screens its text is at least 16px, so Safari on iOS doesn't zoom in on focus, and the field is at least 44px tall. `useTextareaPrefixRecipe` and `useTextareaSuffixRecipe` are unchanged.
