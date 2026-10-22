---
title: Utility Scanner - Automatic CSS Generation
description: Write utility classes directly in your markup. Styleframe's utility scanner detects them and generates only the CSS you use at build time — type-safe, framework-agnostic, with full HMR support.
---

## Next Generation Utility-First Integration

If you've used Tailwind JIT, you already know the workflow. Write utility classes in your markup, and the utility scanner generates only the CSS you use at build time. The difference: your classes are backed by type-safe factories and your own design tokens — with complete control over syntax, naming, and generation behavior.

[Get started](/docs/getting-started/introduction) · [Read utility scanner docs](/docs/getting-started/tooling/scanner)

## Write Classes. The Utility Scanner Handles the Rest

Use utility classes directly in your templates — no need to pre-define every value. The scanner reads your source files, detects your classes, and generates only the CSS you actually use.

- **Zero Registration**: Use utility classes directly in your markup without pre-defining every value. The scanner detects and registers them for you.
- **Only Used CSS**: Unused utilities produce no output. Your stylesheet contains exactly what your templates reference — nothing more, nothing less.
- **Arbitrary Values**: Need a one-off value? Use bracket syntax like `_padding:[2.5rem]`. No need to register a design token for every edge case.
- **Stacked Modifiers**: Chain modifiers freely. `_dark:hover:color:primary` just works — detected and generated automatically.
- **Your Syntax, Your Rules**: Unlike fixed utility catalogs, you define the factories behind your classes. Control naming conventions, allowed values, and generation behavior — the scanner adapts to your system.
- **Instant HMR**: Template changes trigger incremental rescans during development. Only changed files are re-processed — your feedback loop stays instant.

## Write Classes in Your Templates

Use utility classes in your markup like you would with Tailwind. The scanner reads your source files, extracts every `_property:value` class, and generates the matching CSS at build time.

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

- **12+ File Types**: Vue, React, Svelte, Astro, MDX, PHP, ERB, Twig, Blade, and plain HTML — each with a specialized extractor optimized for its syntax.
- **Custom Extractors**: Working with an unsupported file type? Write a custom extractor function in a few lines and plug it in.

## See Exactly What Gets Generated

Design tokens resolve to CSS custom properties. Arbitrary bracket values produce literal CSS. Modifiers wrap declarations in the correct pseudo-selectors and media queries.

What you write is what you get — predictable, readable output.

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

Enable the scanner, register your factories, and let your templates drive your CSS output. Type-safe, JIT, and built on your own design tokens.

[Get started](/docs/getting-started/introduction) · [Read utility scanner docs](/docs/getting-started/tooling/scanner)
