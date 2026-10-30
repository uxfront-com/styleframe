---
"@styleframe/theme": patch
---

The `useInputDateRecipe` separator on `neutral` fields now takes `@color.gray-400` in the dark theme, as intended. Its dark-theme rule was emitted as a `:dark` pseudo-class that no browser matches, so the separator kept the light theme's colour token. It's now written under the dark-theme selector the rest of the theme uses.
