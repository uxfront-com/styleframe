---
title: styleframe.config.ts
---

```ts
import { styleframe } from 'styleframe';
import { useDesignTokensPreset, useGlobalPreset, useModifiersPreset, useSanitizePreset, useUtilitiesPreset, useButtonRecipe } from '@styleframe/theme';

const s = styleframe();

useDesignTokensPreset(s, {
  colors: {
    primary: '#0066ff',
    secondary: '#7c3aed'
  }
});
useSanitizePreset(s);
useGlobalPreset(s);
useUtilitiesPreset(s);
useModifiersPreset(s);

useButtonRecipe(s);

export default s;
```
