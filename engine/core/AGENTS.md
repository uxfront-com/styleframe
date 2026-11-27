# @styleframe/core

`@styleframe/core` is the core engine of Styleframe — a type-safe, composable CSS-in-TypeScript framework for building design systems. It provides a token-based AST (Abstract Syntax Tree) that represents CSS variables, selectors, utilities, modifiers, recipes, themes, animations, and at-rules as structured, composable TypeScript objects.

## Package Info

- **Name:** `@styleframe/core`
- **Import:** `import { styleframe, merge } from 'styleframe'`
- **Dependency:** `csstype` (TypeScript CSS property definitions)
- **Peer dependency:** `@styleframe/license`

## Core Concept

Everything starts with creating a Styleframe instance. The instance holds a `Root` AST node and provides factory methods for building the design system declaratively. All tokens are registered on the root and later compiled to CSS by downstream packages.

```ts
import { styleframe } from 'styleframe';

const s = styleframe();
const { variable, ref, selector, utility, modifier, recipe, theme, atRule, keyframes, media, css } = s;

export default s;
```

---

## API Reference

### `styleframe(options?): Styleframe`

Creates a new Styleframe instance with all token creation methods.

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `indent` | `string` | Indentation string for output |
| `variables.name` | `(options: { name: string }) => string` | Custom CSS variable naming function |
| `utilities.selector` | `(options: { name, value, modifiers }) => string` | Custom utility class naming function |
| `themes.selector` | `(options: { name: string }) => string` | Custom theme selector function |

**Returns:** `Styleframe` — an object with `id`, `root`, `options`, and all token creation methods.

---

### `variable(name, value, options?)`

Creates a CSS custom property token.

- **`name`** (`string`) — Dot-notation name. `'color.primary'` becomes CSS `--color--primary`.
- **`value`** (`TokenValue`) — A primitive value, `ref()`, or `css` template literal.
- **`options.default`** (`boolean`) — When `true`, only sets the variable if not already defined. Required for reusable composables.

**Returns:** `Variable<Name>` token.

```ts
const colorPrimary = variable('color.primary', '#006cff');
const spacing = variable('spacing', '1rem', { default: true });
const colorAccent = variable('color.accent', ref(colorPrimary));
```

---

### `ref(variable, fallback?)`

Creates a reference to a CSS variable, resolved to `var(--name)` at compile time.

- **`variable`** (`Variable | string`) — A variable token or dot-notation name string.
- **`fallback`** (`string`) — Optional fallback value.

```ts
backgroundColor: ref(colorPrimary)
color: ref('color.text', '#333')
```

**Shorthand:** Use `@`-prefixed strings in declaration values: `"@color.primary"`.

---

### `selector(query, declarations | callback)`

Creates a CSS selector rule.

- **`query`** (`string`) — CSS selector string.
- **`declarations`** (`DeclarationsBlock | DeclarationsCallback`) — Style declarations or a callback that receives a context with `variable`, `selector`, `ref`, `css`, `atRule`, `keyframes`, `media`.

Supports nested selectors (`'&:hover'`, `'.child'`), nested `@media`, and nested `@supports` via object keys.

```ts
selector('.button', {
    padding: ref(spacing),
    '&:hover': { opacity: 0.9 },
    '@media (min-width: 768px)': { padding: '2rem' },
});

// Callback form for complex nesting
selector('.container', ({ selector, media }) => {
    selector('.inner', { padding: '1rem' });
    media('(min-width: 768px)', { padding: '2rem' });
    return { display: 'flex' };
});
```

---

### `utility(name, factory, options?)`

Creates a utility class generator. Returns a **creator function** that must be called to register utility values.

- **`name`** (`string`) — Utility base name.
- **`factory`** (`(ctx) => DeclarationsBlock`) — Receives `{ value, selector, variable, ref, media }` context.
- **`options.autogenerate`** (`function`) — Custom key generation for array syntax.

**Returns:** `UtilityCreatorFn` — call with `(values, modifiers?)`.

```ts
const createPadding = utility('padding', ({ value }) => ({ padding: value }));

// Object syntax (explicit keys)
createPadding({ sm: ref(spacingSm), md: ref(spacingMd) });

// Array syntax (auto-generated keys)
createPadding([ref(spacingSm), '@spacing.md', '1rem']);

// With modifiers
createPadding({ sm: ref(spacingSm) }, [hover, focus]);
```

**Generated class format:** `_property-name:value` (e.g., `_padding:sm`).
**With modifiers:** `_modifier:property:value` (e.g., `_hover:padding:sm`).

> **Critical:** Always invoke the creator function. Defining a utility without calling it produces no CSS.

---

### `modifier(name, factory)`

Creates a reusable modifier that wraps utility declarations.

- **`name`** (`string | string[]`) — Modifier name(s). An array registers the same factory under several keys; the factory receives **no** key argument, so every key produces identical output. Use it only for aliases, not for per-key output like breakpoints.
- **`factory`** (`(ctx) => DeclarationsBlock | void`) — Receives `{ declarations, variables, children }` plus the standard declarations context (`variable`, `selector`, `atRule`, `keyframes`, `media`, `ref`, `css`).

```ts
const hover = modifier('hover', ({ declarations }) => ({
    '&:hover': declarations,
}));

// Breakpoints: one modifier per value, each closing over its own width.
// (There is no `key` param — a single array-key modifier cannot tell sm/md/lg apart.)
const smUp = modifier('sm', ({ declarations }) => ({
    [`@media (min-width: ${breakpoints.sm})`]: declarations,
}));
const mdUp = modifier('md', ({ declarations }) => ({
    [`@media (min-width: ${breakpoints.md})`]: declarations,
}));
const lgUp = modifier('lg', ({ declarations }) => ({
    [`@media (min-width: ${breakpoints.lg})`]: declarations,
}));
```

---

### `recipe(config)`

Creates a component variant system with base styles, variants, defaults, and compound variants.

| Config Key | Type | Description |
|------------|------|-------------|
| `name` | `string` | Recipe name (base class) |
| `base` | `VariantDeclarationsBlock` | Always-applied utility declarations |
| `variants` | `Record<string, Record<string, VariantDeclarationsBlock>>` | Variant group definitions |
| `defaultVariants` | `Record<string, string>` | Default variant selections |
| `compoundVariants` | `Array<{ match, css }>` | Conditional variant combinations |

```ts
recipe({
    name: 'button',
    base: { borderWidth: ref(borderWidthThin), borderStyle: 'solid' },
    variants: {
        color: {
            primary: { background: ref(colorPrimary), color: ref(colorWhite) },
            secondary: { background: ref(colorSecondary) },
        },
        size: {
            sm: { padding: ref(spacingSm) },
            md: { padding: ref(spacingMd) },
        },
    },
    defaultVariants: { color: 'primary', size: 'md' },
    compoundVariants: [
        {
            match: { color: 'primary', disabled: false },
            css: { hover: { background: '@color.primary-dark' } },
        },
    ],
});
```

**Runtime usage:** `button({ color: 'secondary', size: 'lg' })` returns a class string.

---

### `theme(name, callback)`

Creates a theme variant scoped to `[data-theme="name"]`.

- **`name`** (`string`) — Theme name.
- **`callback`** (`(ctx) => void`) — Receives `{ variable, selector }` for overriding variables and selectors within the theme scope.

```ts
theme('dark', (ctx) => {
    ctx.variable(colorBackground, '#18181b');
    ctx.variable(colorText, '#ffffff');
    ctx.selector('.card', { boxShadow: '0 4px 6px rgba(0,0,0,0.3)' });
});
```

**HTML:** `<div data-theme="dark">Dark themed content</div>`

---

### `css` (template literal)

Interpolates token values into CSS strings for complex expressions.

```ts
padding: css`${ref(spacingSm)} ${ref(spacingMd)}`
width: css`calc(100% - ${ref(sidebarWidth)})`
background: css`linear-gradient(135deg, ${ref(colorPrimary)} 0%, ${ref(colorSecondary)} 100%)`
```

Supports `@variablename` notation inline — `@name` is automatically converted to a variable reference:

```ts
border: css`1px solid @color.primary`
padding: css`@spacing.x @spacing.y`
```

---

### `keyframes(name, frames)`

Defines a CSS `@keyframes` animation.

- **`name`** (`string`) — Animation name.
- **`frames`** (`Record<string, DeclarationsBlock>`) — Keyframe stops.

**Returns:** AtRule token with a `.rule` property containing the animation name.

```ts
const fadeIn = keyframes('fade-in', {
    '0%': { opacity: 0, transform: 'translateY(10px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
});

selector('.animated', {
    animation: `${fadeIn.rule} 0.3s ease-out`,
});
```

---

### `media(query, callback | declarations)`

Creates `@media` rules.

```ts
media('(min-width: 768px)', ({ selector }) => {
    selector('.container', { maxWidth: '750px' });
});
```

Can also be used inline in selectors via object keys:

```ts
selector('.container', {
    padding: '1rem',
    '@media (min-width: 768px)': { padding: '2rem' },
});
```

---

### `atRule(identifier, rule, declarations | callback)`

Creates arbitrary CSS at-rules (`@supports`, `@font-face`, `@layer`, `@container`, `@property`).

```ts
atRule('supports', '(display: grid)', ({ selector }) => {
    selector('.grid', { display: 'grid' });
});

atRule('font-face', '', {
    fontFamily: "'CustomFont'",
    src: "url('font.woff2') format('woff2')",
});
```

---

### `merge(base, ...instances)`

Combines multiple Styleframe instances into one.

```ts
import { merge } from 'styleframe';
const s = merge(base, components, themes);
```

**Merge behavior:**
- Variables: Later instances override earlier ones.
- Arrays (utilities, modifiers, recipes, children): Concatenated.
- Themes with the same name: Merged together.

Merge from general to specific for proper overrides.

---

## AST Structure

The engine builds a tree-based AST. All tokens register on the `Root` node:

```
Root
├── variables: Variable[]       — CSS custom properties
├── utilities: UtilityFactory[] — Utility class generators
├── modifiers: ModifierFactory[] — Modifier wrappers
├── recipes: Recipe[]           — Component variant systems
├── themes: Theme[]             — Theme-scoped overrides
└── children: ContainerChild[]  — Selector | AtRule | Utility | Variable
```

**Token types:** `variable`, `reference`, `selector`, `at-rule`, `css`, `utility`, `modifier`, `recipe`, `theme`, `root`.

**Token value types:**

```ts
type PrimitiveTokenValue = number | string | boolean | null | undefined;
type TokenValue = PrimitiveTokenValue | Reference | CSS | Array<PrimitiveTokenValue | Reference | CSS>;
```

---

## Type Guards

All exported from `styleframe`:

| Function | Checks for |
|----------|-----------|
| `isVariable(value)` | Variable token |
| `isRef(value)` | Reference token |
| `isSelector(value)` | Selector token |
| `isAtRule(value)` | AtRule token |
| `isCSS(value)` | CSS template token |
| `isUtility(value)` | Utility token |
| `isModifier(value)` | ModifierFactory token |
| `isRecipe(value)` | Recipe token |
| `isTheme(value)` | Theme token |
| `isRoot(value)` | Root token |
| `isToken(value, type)` | Generic token check |
| `isContainer(value)` | Container interface |
| `isStyleframe(value)` | Styleframe instance |
| `isPrimitiveTokenValue(value)` | Primitive token value |
| `isTokenValue(value)` | Any token value |

---

## Utility Functions

| Function | Description |
|----------|-------------|
| `merge(base, ...instances)` | Merge Styleframe instances |
| `hashValue(value)` | DJB2 hash for CSS-safe strings (7-char hex) |
| `deepClone(value)` | Deep clone with circular reference support |
| `generateRandomId(prefix?, length?)` | Generate random ID strings |
| `getVariable(root, name)` | Look up a variable by name (throws if not found) |
| `getUtility(root, name)` | Look up a utility by name (throws if not found) |
| `getModifier(root, name)` | Look up a modifier by name (throws if not found) |
| `isTokenEqual(a, b)` | Deep equality check for token values |
| `classNameToCssSelector(className)` | Escape class name for CSS selectors |
| `capitalizeFirst(str)` | Capitalize first letter |
| `transformUtilityKey(options)` | Transform utility class names with namespaces |

---

## Composable Naming Conventions

When building reusable composable functions:

| Type | Naming Pattern | Example |
|------|---------------|---------|
| Variables | `use<Context>Variables()` | `useColorVariables(s)` |
| Selectors | `use<Context>Selectors()` | `useButtonSelectors(s)` |
| Utilities | `use<Context>Utilities()` | `useSpacingUtilities(s)` |
| Recipes | `use<Context>Recipe()` | `useExampleButtonRecipe(s)` |

Composable variables must use `{ default: true }` to prevent overwriting:

```ts
export function useColorVariables(s: Styleframe) {
    const { variable, ref } = s;
    const colorPrimary = variable('color.primary', '#006cff', { default: true });
    return { colorPrimary };
}
```

---

## Best Practices

1. **Always destructure from the instance** — never import token creation functions directly.
2. **Use `ref()` for all variable references** — never hardcode values that should be tokens.
3. **Use dot notation for variable names** — `'color.primary'` not `'colorPrimary'`.
4. **Use `@`-prefixed strings** as shorthand refs in declarations: `"@color.primary"`.
5. **Use `{ default: true }`** for variables in reusable composables.
6. **Always call the utility creator function** — `utility()` returns a function, not CSS.
7. **Export the Styleframe instance as default** — `export default s`.
8. **Use semantic names** — `color.primary` not `color.blue`.
9. **Use `css` template literals** for complex CSS expressions with interpolations.
10. **Use `as const`** on value objects passed to theme composables for proper type inference.

## Anti-Patterns

- Hardcoding colors, spacing, or sizes instead of using variables.
- Using `ref()` without destructuring it from the Styleframe instance.
- Forgetting `{ default: true }` in composable variables.
- Defining utilities without invoking the creator function.
- Using named exports in index files instead of `export *`.
- Using appearance-based names (`color.blue`) instead of semantic names (`color.primary`).
