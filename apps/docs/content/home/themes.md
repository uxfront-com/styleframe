---
title: styleframe.config.ts
---

```ts
import { styleframe } from 'styleframe';

const s = styleframe();
const { variable, ref, selector, theme } = s;

const surface = variable('color.surface', '#ffffff');
const text = variable('color.text', '#18181b');

selector('.card', {
    background: ref(surface),
    color: ref(text),
});

// Every theme reuses the same tokens — just override their values
theme('dark', (ctx) => {
    ctx.variable(surface, '#18181b');
    ctx.variable(text, '#ffffff');
});

export default s;
```
