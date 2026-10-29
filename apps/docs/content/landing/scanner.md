---
title: Utility Scanner - Automatic CSS Generation
description: Write utility classes directly in your markup. Styleframe's utility scanner detects them and generates only the CSS you use at build time — type-safe, framework-agnostic, with full HMR support.
---

## Utility-First Markup to CSS at Build Time

If you've used Tailwind JIT, you already know the workflow. The difference: your classes are backed by type-safe factories and your own design tokens, and you control their syntax and naming.

[Get started](/docs/getting-started/introduction) · [Read utility scanner docs](/docs/getting-started/tooling/scanner)

## Write Classes. The Utility Scanner Handles the Rest

- **Zero Registration**: Use utility classes without pre-defining every value. The scanner registers them for you.
- **Only Used CSS**: Your stylesheet holds exactly what your templates reference.
- **Arbitrary Values**: Write a one-off value in brackets, like `_padding:[2.5rem]`, without a token for it.
- **Stacked Modifiers**: Chain modifiers freely, like `_dark:hover:color:primary`.
- **Your Syntax, Your Rules**: You define the factories behind your classes: their names, allowed values and output.
- **Instant HMR**: In development, only the files you change are rescanned.

## Write Classes in Your Templates

The scanner reads your source files, extracts every `_property:value` class, and generates the matching CSS at build time.

```html [Button.vue]
<template>
    <div class="_display:flex _gap:1rem _padding:lg">
        <button class="_background:primary
                       _hover:background:secondary
                       _padding:md
                       _font-weight:bold">
            Click me
        </button>
        <span class="_color:muted _font-size:sm">
            Detected and generated automatically.
        </span>
    </div>
</template>
```

- **12+ File Types**: Vue, React, Svelte, Astro, MDX, PHP, ERB, Twig, Blade and plain HTML, each with its own extractor.
- **Custom Extractors**: For any other file type, write an extractor in a few lines and plug it in.

## See Exactly What Gets Generated

Design tokens resolve to CSS custom properties. Arbitrary bracket values produce literal CSS. Modifiers wrap declarations in the correct pseudo-selectors and media queries.

```css [Output CSS]
/* Only the utilities your templates reference */

._padding\:lg {
        padding: var(--spacing-lg);
}

._background\:primary {
        background: var(--color-primary);
}

._hover\:background\:secondary:hover {
        background: var(--color-secondary);
}

/* Arbitrary values generate literal CSS */
._padding\:\[2\.5rem\] {
        padding: 2.5rem;
}
```

## Start Writing Utility Classes Today

Enable the scanner, register your factories, and let your templates drive your CSS output.

[Get started](/docs/getting-started/introduction) · [Read utility scanner docs](/docs/getting-started/tooling/scanner)
