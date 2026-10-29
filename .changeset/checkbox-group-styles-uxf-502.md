---
"@styleframe/theme": patch
---

Make `useCheckboxGroupRecipe` meet the Open Components Checkbox Group page. The group now resets its `<fieldset>` and styles its `<legend>` at the options' text size in a heavier weight, and dims the legend of a disabled fieldset, in `GrayText` in forced colors mode. A horizontal group puts 24px between its options, the size axis sets the row gap with `gap-y` rather than `gap`, and options in `[data-slot="options"]` after a `[data-slot="select-all"]` box sit in from it with `padding-inline-start`, so their boxes line up with its label. The group's `aria-invalid="true"` gives every box the checkbox's invalid border. Each size adds a `-size-<size>` class to the group.
