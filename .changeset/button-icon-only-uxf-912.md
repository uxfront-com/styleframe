---
"@styleframe/theme": minor
---

Add icon sizes and an icon-only style to `useButtonRecipe`. Each size now sets `--button--icon--size` for the icons in `data-slot="leading"` and `data-slot="trailing"` children, and a button with `data-icon-only` and `data-size` is square, with its `data-slot="label"` child hidden from view but kept as the accessible name. Buttons without these attributes look the same as before.
