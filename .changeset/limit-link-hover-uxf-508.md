---
"@styleframe/theme": patch
---

Apply the hover styles of `useLinkElement` only on devices that can hover. The `a:hover` color and text decoration now sit inside `@media (hover: hover)`, so a tap on a touch screen no longer leaves a link, or a recipe rendered as `<a href>` like a Button, looking hovered. The `link.hover.color` and `link.hover.text-decoration` variables, their defaults and the `useLinkElement` options stay the same.
