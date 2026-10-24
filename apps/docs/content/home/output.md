---
title: Output
---

```css
/* Static CSS generated at build time */
.button {
    background-color: var(--color--primary);
    padding: var(--spacing);
}
```

```ts
/* Optional runtime for prop-based Recipes */
recipe({
    name: 'button',
    base: { background: '@color.primary' },
    variants: {
        size: {
            sm: { padding: '@spacing.sm' },
            md: { padding: '@spacing.md' },
            lg: { padding: '@spacing.lg' },
        },
    },
    defaultVariants: { size: 'md' },
});
```
