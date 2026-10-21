---
title: styleframe.config.ts
---

```ts
import { styleframe } from 'styleframe';
import { useColorDesignTokens } from '@styleframe/theme';
import { useTypographyDesignTokens, useSpacingDesignTokens } from '@orgname/theme-minimal';
import { useComponents } from './my-components';

const s = styleframe();

// Colors from the default theme
useColorDesignTokens(s, {
    primary: '#318fa0',
    secondary: '#ff6b6b'
});

// Typography and spacing from another theme
useTypographyDesignTokens(s);
useSpacingDesignTokens(s);

// Plus your custom components
useComponents(s);

export default s;
```
