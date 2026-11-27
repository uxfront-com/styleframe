# Theme Package Rules

**Scope:** `theme/**/*`

## Composable Conventions

- All composables must accept `Styleframe` instance as first parameter
- All variables in composables must use `{ default: true }` option
- Return destructured objects with typed token exports
- Naming: `use<Context>Variables`, `use<Context>Utilities`, `use<Context>Recipe`

## Design Tokens

- Use semantic names, not appearance-based: `color.primary` not `color.blue`
- Reference tokens with `ref()` or `@` prefix: `ref(colorPrimary)` or `"@color.primary"`
- Scale-based spacing: use `useScalePowersDesignTokens` for consistent spacing
- All token values should be customizable via composable parameters

## Recipes

- The theme ships no component recipes: they moved to `@inkline/theme` in 4.0.0
- `createUseRecipe` (`theme/src/utils/createUseRecipe.ts`) stays, for writing recipe composables
- A recipe written with it includes base styles, variants and defaultVariants

## Testing

- Test composables return correct token structure
- Verify CSS output matches expectations
- Test token references resolve correctly
