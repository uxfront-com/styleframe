---
"@styleframe/theme": patch
---

Give the Select trigger a border that meets the 3:1 contrast WCAG 1.4.11 asks of a control's boundary, in light and dark mode. In `useSelectRecipe`, the `solid` and `soft` borders move from `gray-200` (and `gray-700` in dark) to `gray-450` and `gray-500`, with the other one on hover. The `ghost` trigger now shows a bottom border in the same colour, with square bottom corners, and an invalid ghost trigger keeps its bottom border in `@color.error` along with the rest. A read-only trigger gets a dashed border on top of its tinted fill.
