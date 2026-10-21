# styleframe

## 3.9.2

### Patch Changes

- [#323](https://github.com/uxfront-com/styleframe/pull/323) [`a03a29b`](https://github.com/uxfront-com/styleframe/commit/a03a29b4e44e29f3ffe7acf94f493bed7d82cb02) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Boundary-guard `@`-reference parsing so a `@` mid-token is a literal, not a reference. `AT_VARIABLE_REGEX` matched `@` anywhere in a string, so a retina URL like `url("image@2x.png")` parsed `@2x.png` as a variable reference — silently emitting a dead `var(--2x--png)` before SF-13, and _throwing_ `Variable "2x.png" is not defined` after SF-13 tightened ref validation. The regex now requires a non-word boundary before `@` (`(?<!\w)`), so `@` only starts a reference when not preceded by a word character. Genuine leading-`@` refs (`@color.primary`, `1px solid @spacing.sm`, `@border.width solid @color.primary`) are unchanged, byte for byte; only `@`-mid-token literals change — from broken/throwing to passthrough.

- [#316](https://github.com/uxfront-com/styleframe/pull/316) [`dc08e92`](https://github.com/uxfront-com/styleframe/commit/dc08e92a22db0ec29c2837504d84e3401b0ae9e2) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Validate variable references inside compound `@`-shorthand values. `resolvePropertyValue` already threw `Variable "X" is not defined` for a single exact ref (`padding: "@0.5"`), but the embedded/compound path (`padding: "@0.25 @0.5"`, `border: "1px solid @undefined"`) only recorded usage and skipped `validateReference`, so a compound ref to an undefined variable silently emitted a dead `var(--…)`. The embedded branch now calls `validateReference` for each ref part, matching the single-ref path. Compound refs whose variables are all defined are unchanged (byte-for-byte identical output); only compound refs to undefined variables change — from a silent dead `var(--…)` to a thrown error.

- [#343](https://github.com/uxfront-com/styleframe/pull/343) [`23efb06`](https://github.com/uxfront-com/styleframe/commit/23efb062135ca8e843466da372d90f4cb4173602) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Report token references that resolve to nothing, theme overrides of undefined variables and duplicate variables when the build runs. The new `validate(instance)` returns every problem in one pass as a `Diagnostic` with a `code`, `severity`, `message`, `path` and, when a token name is within two edits, a `suggestion`. It reports an `@token` in a recipe, a utility value or a `css` template literal, and a `ref()` anywhere, that resolves to no variable (`unresolved-reference`), a theme variable that isn't defined at root (`undefined-theme-override`), and two `variable()` calls with the same name and without `default: true` (`duplicate-variable`). A plain `@token` string in a selector or theme declaration still throws when it's defined, as before. `transpile()` runs `validate()` once and returns the diagnostics as `diagnostics` beside `files`, and with the new `strict: true` option on `styleframe()` it throws one error that lists them all instead. Nested at-rules with a hyphen in their name, like `@starting-style` and `@font-feature-values`, now keep the whole name. The theme adds the `z-index.tooltip` token (`700`), which the tooltip recipe already referenced, and the `xs` chip indicator uses `@font-size.3xs` instead of the undefined `@font-size.4xs`. `styleframe` and `@styleframe/transpiler` now accept the `@styleframe/core` release that ships `validate()`.

- [#299](https://github.com/uxfront-com/styleframe/pull/299) [`a22a813`](https://github.com/uxfront-com/styleframe/commit/a22a813a35742992212351f0d2b11eaac3360401) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Fix inset utilities dropping the spacing multiplier scale. The nine inset composables (`inset`, `inset-x`, `inset-y`, `inset-inline-start`, `inset-inline-end`, `top`, `right`, `bottom`, `left`) were plain `createUseUtility`, so a numeric ref like `@0.5` fell through to a bare lookup for a non-existent `0.5` variable and silently emitted an undefined `var(--0--5)`. They now use `createUseSpacingUtility(..., { namespace: "spacing" })` like `margin`/`padding`/`height`, so `@0.5` resolves to `calc(var(--spacing) * 0.5)`. Object-syntax literals and preset `undefined` calls are unchanged — purely a fix for numeric-multiplier insets. Note: existing `@spacing.xs` inset usages shorten the utility class key `spacing.xs` → `xs` (resolved var identical), matching margin.

## 3.9.1

### Patch Changes

- [#268](https://github.com/styleframe-dev/styleframe/pull/268) [`778bfc9`](https://github.com/styleframe-dev/styleframe/commit/778bfc96e56fcf4bfb03ea485de0bc716b9b98b8) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Upgrade runtime and dev dependencies across all packages (jiti, csstype, citty, rollup, vitest, turbo, oxlint, biome, changesets, and Nuxt ecosystem packages).

- Updated dependencies [[`778bfc9`](https://github.com/styleframe-dev/styleframe/commit/778bfc96e56fcf4bfb03ea485de0bc716b9b98b8)]:
  - @styleframe/cli@4.1.2

## 3.9.0

### Minor Changes

- [#247](https://github.com/styleframe-dev/styleframe/pull/247) [`ed847bb`](https://github.com/styleframe-dev/styleframe/commit/ed847bbe64414b921a52d413cf09d89a4d51fc13) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Accordion recipe.

  Adds a multi-part Accordion recipe composed of five composables: `useAccordionRecipe`, `useAccordionItemRecipe`, `useAccordionTriggerRecipe`, `useAccordionBodyRecipe`, and `useAccordionContentRecipe`. Supports `primary`, `secondary`, `light`, `dark`, and `neutral` colors and `sm`, `md`, and `lg` sizes. The trigger uses a chevron icon that rotates via a CSS transition when the item is in the `open` state (driven by the `[open]` attribute on `<details>`). Each part is independently composable and all five are re-exported from the `@styleframe/theme` barrel.

- [#249](https://github.com/styleframe-dev/styleframe/pull/249) [`a3f98c8`](https://github.com/styleframe-dev/styleframe/commit/a3f98c8b53cdfb8194917a520b072da3fe41db20) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Avatar, AvatarBadge, and AvatarGroup recipes.

  Adds `useAvatarRecipe`, `useAvatarBadgeRecipe`, and `useAvatarGroupRecipe` to `@styleframe/theme`. The Avatar supports `color`, `size` (`xs`–`xl`), and `shape` (`circle` / `square`) variants. The AvatarBadge overlays a status indicator with configurable `color`, `size`, and `position` (all four corners). AvatarGroup stacks avatars with a configurable `size` and `max` overlap, rendering a `+N` overflow badge when the count exceeds the limit.

- [#250](https://github.com/styleframe-dev/styleframe/pull/250) [`e299dd2`](https://github.com/styleframe-dev/styleframe/commit/e299dd26cabf809ba74dd22d79f3a22b99c8a266) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Calendar recipe.

  Adds `useCalendarRecipe()` and `useCalendarDayRecipe()` composables for building date, month, and year pickers. The calendar supports `day`, `month`, and `year` display types, `single` and `range` selection modes, and `light`, `dark`, and `neutral` surface colors across `sm`, `md`, and `lg` sizes. The day recipe handles `selected`, `today`, `disabled`, `inRange`, `rangeStart`, and `rangeEnd` states via compound variants.

- [#244](https://github.com/styleframe-dev/styleframe/pull/244) [`bd07eb2`](https://github.com/styleframe-dev/styleframe/commit/bd07eb238aa9e714644e459104063dc928f1b484) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Checkbox, CheckboxField, and CheckboxGroup recipes.

  Adds three Inkline-style form-control recipes built on the native `<input type="checkbox">`. The `useCheckboxFieldRecipe()` composable styles the box with `appearance: none` and an SVG checkmark/dash `background-image`; `:checked`, `:indeterminate`, `:disabled`, and `:focus-visible` states are driven by native pseudo-classes. The `useCheckboxRecipe()` composable wraps the label, and `useCheckboxGroupRecipe()` lays out a set with `vertical` / `horizontal` orientation. All three support `light`, `dark`, and `neutral` surface colors and `sm` / `md` / `lg` sizes.

  Also adds `useWebkitAppearanceUtility` (`-webkit-appearance`) to `@styleframe/theme` and registers it in `useUtilitiesPreset`, enabling recipes to set the vendor-prefixed appearance property.

- [#254](https://github.com/styleframe-dev/styleframe/pull/254) [`2188938`](https://github.com/styleframe-dev/styleframe/commit/2188938a5eec1e694ea54101b884dccde3f38b5e) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `color-picker` recipe — a 4-part color picker control.

  Adds `useColorPickerRecipe`, `useColorPickerSelectorRecipe`, `useColorPickerTrackRecipe`, and `useColorPickerThumbRecipe` to `@styleframe/theme`. The root follows the standard color (light/dark/neutral), size (xs/sm/md/lg/xl), and variant (solid/soft/ghost) axes with disabled and invalid state handling. The selector renders the gradient canvas area, the track renders the hue/alpha slider rail, and the thumb renders the draggable handle shared across both.

- [#260](https://github.com/styleframe-dev/styleframe/pull/260) [`bf74401`](https://github.com/styleframe-dev/styleframe/commit/bf74401f58c9d178150fa163e98b18042e4e69f3) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `context-menu` recipe — a 6-part right-click context menu.

  Adds `useContextMenuRecipe`, `useContextMenuItemRecipe`, `useContextMenuSubTriggerRecipe`, `useContextMenuLabelRecipe`, `useContextMenuSeparatorRecipe`, and `useContextMenuShortcutRecipe` to `@styleframe/theme`. The panel and item styling mirror the Dropdown family (color: light/dark/neutral, variant: solid/soft/subtle, size: sm/md/lg), with a sub-trigger arrow indicator and an inline keyboard shortcut slot.

  Extracts shared menu-surface logic into `createMenuRecipe.ts` in the dropdown folder, which the Dropdown, Select panel, and Context Menu recipes all now delegate to — eliminating ~1100 lines of duplicated compound-variant declarations.

- [#262](https://github.com/styleframe-dev/styleframe/pull/262) [`2994375`](https://github.com/styleframe-dev/styleframe/commit/299437563582b7b91ecceeaed197defa267f7f4c) Thanks [@alexgrozav](https://github.com/alexgrozav)! - The built-in `dark` modifier is now theme-driven. It no longer emits `@media (prefers-color-scheme: dark)`; `_dark:` / `&:dark` now respond solely to `.dark-theme` / `[data-theme="dark"]`, matching the values set by the `dark` theme. This fixes light surfaces showing inverted (unreadable) text when the OS is in dark mode but no `data-theme` is set.

  Migration: to follow the operating-system preference, mirror it into `data-theme` — e.g. `window.matchMedia('(prefers-color-scheme: dark)')` → set `document.documentElement.dataset.theme`. See the theme-switcher guide.

- [#251](https://github.com/styleframe-dev/styleframe/pull/251) [`d758990`](https://github.com/styleframe-dev/styleframe/commit/d7589909ca21bff0c92c950f2dae2be5d1cce6e3) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `field-group` recipe and replace the per-field grouping recipes with it.

  Adds `useFieldGroupRecipe` — an explicit, composable wrapper (modeled on Nuxt UI's FieldGroup) that joins bordered controls (buttons, inputs, selects, badges) placed as **direct children** into one unit, merging border radii and collapsing the inner border at the seams. Supports `orientation` (horizontal/vertical) and `block` mode; in a horizontal group inputs/selects/textareas flex-grow while buttons stay intrinsic.

  Replaces the per-field grouping recipes, which are superseded by `useFieldGroupRecipe`:
  - Removed `useButtonGroupRecipe` — a group of buttons now works the same way as direct children of a field group.
  - Removed `useInputGroupRecipe`, `useInputPrependRecipe`, and `useInputAppendRecipe` — attach a control outside an input by making it a direct child of a field group.
  - Removed the internal `createFieldSlotRecipe` and `createFieldGroupRecipe` builders.

  Inline `useInputPrefixRecipe` / `useInputSuffixRecipe` (and the textarea equivalents) are unchanged.

- [#253](https://github.com/styleframe-dev/styleframe/pull/253) [`e316dea`](https://github.com/styleframe-dev/styleframe/commit/e316dea099d3b2cfdceb37fb9d4b7d06f773863f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add fullscreen variant to modal and modal-body recipes.

  Adds a `fullscreen` boolean variant to `useModalRecipe` (fills the viewport with `width: 100%`, `height: 100%`, `max-width: none`, and `border-radius: 0`) and a matching variant to `useModalBodyRecipe` (`flex-grow: 1`) so the footer stays pinned to the bottom. Pass `fullscreen="true"` to both the container and the body to opt in.

- [#252](https://github.com/styleframe-dev/styleframe/pull/252) [`aaf8f94`](https://github.com/styleframe-dev/styleframe/commit/aaf8f947526cdeb2d7bda6f473ff739d36e1a5a3) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add OTP recipe with shared field surface abstraction.

  Adds `useOtpRecipe` and `useOtpCellRecipe` for styling one-time password inputs. The cell recipe targets a single `<input>` with `:focus-visible` ring and supports the full color × variant × size matrix matching Input/Textarea parity.

  Extracts `fieldSurfaceCompoundVariants()` from `createFieldRecipe` so the OTP cell can share the same nine color×variant surface declarations without duplication.

- [#245](https://github.com/styleframe-dev/styleframe/pull/245) [`7faecd4`](https://github.com/styleframe-dev/styleframe/commit/7faecd40ff07a57b22204d143b2153230f857aec) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Radio, RadioField, and RadioGroup recipes.

  Adds three form-control recipes built on the native `<input type="radio">`. The `useRadioFieldRecipe()` composable styles the radio indicator with `appearance: none` and a filled inner circle driven by a `background-image`; `:checked`, `:disabled`, and `:focus-visible` states are driven by native pseudo-classes. The `useRadioRecipe()` composable wraps the label, and `useRadioGroupRecipe()` lays out a set with `vertical` / `horizontal` orientation. All three support `light`, `dark`, and `neutral` surface colors and `sm` / `md` / `lg` sizes.

- [#243](https://github.com/styleframe-dev/styleframe/pull/243) [`e4ba4cf`](https://github.com/styleframe-dev/styleframe/commit/e4ba4cfc35f24f66e5b5207f8096ebb89ee06ab1) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `select` recipe — a 7-part multi-select form control.

  Adds `useSelectRecipe`, `useSelectPanelRecipe`, `useSelectOptionRecipe`, `useSelectChipRecipe`, `useSelectArrowRecipe`, `useSelectLabelRecipe`, and `useSelectSeparatorRecipe` to `@styleframe/theme`. The trigger follows the Input recipe's structure (color: light/dark/neutral, size, invalid/disabled/readonly states) with a `solid`/`soft`/`ghost` variant axis, the panel and options mirror Dropdown (solid/soft/subtle), and the chips mirror Badge (Container-3 palette) with a nested `.select-chip-remove` dismiss button. The chevron rotates via `.-open`/`data-open`.

  Supports both single- and multi-selection. A shared `.select-icon` slot adds a leading icon/media element (e.g. a country flag) to the trigger's selected value, options, and chips. Selected options are driven by `aria-selected`, with the `.select-option-check` indicator pinned to the trailing edge so the leading edge is free for an icon.

- [#258](https://github.com/styleframe-dev/styleframe/pull/258) [`ef61c3e`](https://github.com/styleframe-dev/styleframe/commit/ef61c3e84e7dfe8bd6a09463e3bf9b201a387ea1) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `sidebar` recipe — a 16-part navigation sidebar component.

  Adds `useSidebarRecipe`, `useSidebarContentRecipe`, `useSidebarHeaderRecipe`, `useSidebarFooterRecipe`, `useSidebarInsetRecipe`, `useSidebarGroupRecipe`, `useSidebarGroupLabelRecipe`, `useSidebarGroupActionRecipe`, `useSidebarSeparatorRecipe`, `useSidebarMenuRecipe`, `useSidebarMenuButtonRecipe`, `useSidebarMenuActionRecipe`, `useSidebarMenuBadgeRecipe`, `useSidebarMenuSubRecipe`, and `useSidebarMenuSubButtonRecipe` to `@styleframe/theme`.

  The root sidebar supports `side` (left/right), `variant` (sidebar/floating/inset), and `collapsible` (offcanvas/icon/none) axes, with responsive collapse behavior driven by `data-state` and `data-collapsible`. Menu buttons follow the Input recipe's color palette with `size` and `variant` (default/outline/ghost) axes. Includes full Storybook showcase and documentation.

- [#256](https://github.com/styleframe-dev/styleframe/pull/256) [`689d959`](https://github.com/styleframe-dev/styleframe/commit/689d95988e4870dc8b261b9aed891208a29d8353) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `slider` recipe — a 4-part range input component.

  Adds `useSliderRecipe`, `useSliderTrackRecipe`, `useSliderRangeRecipe`, and `useSliderThumbRecipe` to `@styleframe/theme`. The root follows the standard color (light/dark/neutral), size (xs/sm/md/lg/xl), and orientation (horizontal/vertical) axes with disabled and invalid states. The track renders the unfilled groove, the range fills the selected region, and the thumb is the draggable handle with focus-ring, hover, and active states.

- [#246](https://github.com/styleframe-dev/styleframe/pull/246) [`3475d9e`](https://github.com/styleframe-dev/styleframe/commit/3475d9e0a71ace6545e0c1ff7047d36f97fb633d) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Switch and SwitchField recipes.

  Adds two form-control recipes built on the native `<input type="checkbox" role="switch">`. The `useSwitchFieldRecipe()` composable styles a pill-shaped track with a sliding white knob; `:checked` recolors the track to `@color.primary` and translates the knob, `:focus-visible` shows a focus ring, and `:disabled` dims the control — all driven by native pseudo-classes with zero runtime JavaScript. The `useSwitchRecipe()` composable wraps the label with inline layout, gap, and label typography. Both support `light`, `dark`, and `neutral` surface colors and `sm` / `md` / `lg` sizes.

- [#261](https://github.com/styleframe-dev/styleframe/pull/261) [`f20f0ae`](https://github.com/styleframe-dev/styleframe/commit/f20f0aec9f38a29e209c61b7b427c78e62be4494) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Toggle and ToggleGroup recipes.

  Adds two interactive button recipes: `useToggleRecipe()` styles a single toggleable button with pressed/active states driven by `aria-pressed`, and `useToggleGroupRecipe()` composes multiple toggles into a segmented control with connected borders. Both support `solid`, `outline`, `soft`, `subtle`, and `ghost` variants, `primary`, `secondary`, `success`, `info`, `warning`, `error`, and `neutral` colors, and `xs` / `sm` / `md` / `lg` / `xl` sizes.

### Patch Changes

- [#264](https://github.com/styleframe-dev/styleframe/pull/264) [`760c167`](https://github.com/styleframe-dev/styleframe/commit/760c1677f1927c143b090a7020e1f5bc3ccf9f33) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Use `gray-50` instead of `gray-100` for soft and subtle variants in callout, card, modal, popover, and tooltip recipes.

- [#238](https://github.com/styleframe-dev/styleframe/pull/238) [`4ace91d`](https://github.com/styleframe-dev/styleframe/commit/4ace91d5e15020c29d585848ee66f6250946b2d1) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Emit explicit `.d.mts` and `.d.cts` type declarations per export condition so `import` and `require` consumers each resolve a correctly-formatted declaration file.

- Updated dependencies [[`4ace91d`](https://github.com/styleframe-dev/styleframe/commit/4ace91d5e15020c29d585848ee66f6250946b2d1)]:
  - @styleframe/core@3.6.1
  - @styleframe/loader@3.0.3
  - @styleframe/transpiler@3.4.1
  - @styleframe/cli@4.1.1

## 3.8.0

### Minor Changes

- [#234](https://github.com/styleframe-dev/styleframe/pull/234) [`c7ff8c8`](https://github.com/styleframe-dev/styleframe/commit/c7ff8c89776b2e117b0f45f3e1f8ca6695f24a29) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add recipe-level tree-shaking. Unused recipes and their utility classes are excluded from the CSS and TypeScript consumer module during production builds.
  - **Core**: `Root._usage` gains `recipes` and `recipeUtilities` fields. Recipe utility class names are tracked per-recipe in `recipeUtilities` and promoted to `utilities` via `registerRecipeUtilities()`.
  - **Scanner**: New `scanImports()` and `scanFileImports()` methods use importree v2's `parseImports()` to detect which recipes are imported from `virtual:styleframe`.
  - **Transpiler**: TS and DTS consumers filter recipes by `_usage.recipes` — only emitting used recipes when the set is populated.
  - **Plugin**: Recipe scanning integrated into the build flow after content scanning. Defaults to tree-shaking ON for builds, OFF for dev. Safety: namespace/dynamic imports include all recipes with a warning. `recipes.include` option provides an escape hatch for force-including recipes.

- [#228](https://github.com/styleframe-dev/styleframe/pull/228) [`770ecca`](https://github.com/styleframe-dev/styleframe/commit/770ecca2dbf3cb4afa7406e310ba74b0dfcfdad7) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add dynamic utility creation for unmatched CSS properties.

  Automatically creates utility factories on-the-fly for unmatched class names that correspond to known CSS properties. Enables fallback support for arbitrary CSS values without pre-registration (e.g., `_display:flex`, `_background:[red]`). Includes comprehensive test coverage for dynamic factory creation, deduplication, and modifier preservation.

- [#226](https://github.com/styleframe-dev/styleframe/pull/226) [`dc99d46`](https://github.com/styleframe-dev/styleframe/commit/dc99d4699046f5e5f3dcac965648fd50b0339412) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add build-time utility class name shortening for production builds.

  Generates shortening maps at transpile time with collision-safe abbreviation and built-in defaults for common CSS properties. Hashes long arbitrary values for stable compact names. Supports underscore-as-space in arbitrary values (`_padding:[10px_20px]`). Exposes `minify` plugin option with user-overridable defaults.

- [#224](https://github.com/styleframe-dev/styleframe/pull/224) [`6941920`](https://github.com/styleframe-dev/styleframe/commit/6941920a50e560e4686aebd154bb6aea4c59c258) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Export named Props types from `virtual:styleframe` for each recipe (e.g. `import { button, type ButtonProps } from 'virtual:styleframe'`).

### Patch Changes

- [#222](https://github.com/styleframe-dev/styleframe/pull/222) [`80f84dd`](https://github.com/styleframe-dev/styleframe/commit/80f84dd9c32ec3361c69b30f5a9c725b2e1b8fc2) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Fix `chat-message` recipe `side="end"` alignment.

  The `side="end"` variant now correctly packs the avatar and content group to the right side of the container. Three issues were resolved:
  - Root recipe: `justify-content` was `flex-end` which, combined with `flex-direction: row-reverse`, pushed items to the left. Changed to `flex-start`.
  - Content recipe: added `side` variant with `alignSelf: flex-end` so the bubble right-aligns within its column stack.
  - Actions recipe: added `side` variant with `justifyContent: flex-end` so action buttons align under the bubble.

- [#235](https://github.com/styleframe-dev/styleframe/pull/235) [`6acd766`](https://github.com/styleframe-dev/styleframe/commit/6acd766eefc82139d8cd98dfb9b553449945d704) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Generate DTS output as two files that describe the virtual modules in two complementary forms. The transpiler's `dts` mode now emits:
  - `styleframe.d.ts` — top-level exports describing the `virtual:styleframe` module
  - `shims.d.ts` — self-contained ambient declarations: a `declare module "virtual:styleframe"` carrying the full typed exports, plus the `virtual:styleframe.css` string shim

  Non-Vue consumers resolve both virtual modules from `shims.d.ts` alone (picked up via the `.styleframe/**/*.d.ts` include) with **zero `paths` configuration**. Vue consumers additionally map `virtual:styleframe` to `styleframe.d.ts` via a `compilerOptions.paths` entry, because `vue-tsc` won't resolve a bare-specifier ambient module imported inside a `.vue` SFC. `styleframe init` detects plain Vue projects (a `vue` dependency without `nuxt`) and writes that `paths` entry only for them, merging into any existing `paths`; non-Vue projects just get the includes. Nuxt is excluded because its module already injects the mapping via `prepare:types`, and writing `paths` into an `extends`-based Nuxt root tsconfig would replace (not merge) Nuxt's inherited aliases.

  The Nuxt module registers the same `virtual:styleframe` path mapping into Nuxt's generated types via the `prepare:types` hook, so imports type-check without manual tsconfig changes. It also fixes the module's `configKey`/`name`, which were leftover `unpluginStarter` placeholders that caused `styleframe: {}` options in `nuxt.config` to be ignored.

- [#232](https://github.com/styleframe-dev/styleframe/pull/232) [`83d39dd`](https://github.com/styleframe-dev/styleframe/commit/83d39ddaf1739a22d2cc8b4a6a509fa490e30fee) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Update importree from v1 to v2. Adapt dependency graph merging to the new `ImportEdge[]` type in `graph` and `reverseGraph`.

- [#233](https://github.com/styleframe-dev/styleframe/pull/233) [`0ef38e6`](https://github.com/styleframe-dev/styleframe/commit/0ef38e69ca941cefab31463c23980f52cae1541f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Migrate from Vite 7 to Vite 8 with native Rolldown integration. Replace esbuild transforms with Oxc in the plugin, rename `rollupOptions` to `rolldownOptions`, upgrade `vite-plugin-dts` v4 to v5 (`rollupTypes` → `bundleTypes`), and bump vitest from v3 to v4.

- Updated dependencies [[`c0cfbdc`](https://github.com/styleframe-dev/styleframe/commit/c0cfbdc65ddca0b5ea4a420902be2a23580b392f), [`19e9866`](https://github.com/styleframe-dev/styleframe/commit/19e986618c669546972924840189fc5f16f1a1cd), [`c7ff8c8`](https://github.com/styleframe-dev/styleframe/commit/c7ff8c89776b2e117b0f45f3e1f8ca6695f24a29), [`6acd766`](https://github.com/styleframe-dev/styleframe/commit/6acd766eefc82139d8cd98dfb9b553449945d704), [`83d39dd`](https://github.com/styleframe-dev/styleframe/commit/83d39ddaf1739a22d2cc8b4a6a509fa490e30fee), [`dc99d46`](https://github.com/styleframe-dev/styleframe/commit/dc99d4699046f5e5f3dcac965648fd50b0339412), [`6941920`](https://github.com/styleframe-dev/styleframe/commit/6941920a50e560e4686aebd154bb6aea4c59c258), [`0ef38e6`](https://github.com/styleframe-dev/styleframe/commit/0ef38e69ca941cefab31463c23980f52cae1541f)]:
  - @styleframe/cli@4.1.0
  - @styleframe/core@3.6.0
  - @styleframe/transpiler@3.4.0
  - @styleframe/plugin@3.4.0
  - @styleframe/loader@3.0.2

## 3.7.0

### Minor Changes

- [#221](https://github.com/styleframe-dev/styleframe/pull/221) [`6d406c2`](https://github.com/styleframe-dev/styleframe/commit/6d406c289b39c666a3fb7468aa3ec08f5a6d316b) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `treeshake` option to remove unused variables from CSS output.

  `root._usage` now tracks both `variables` and `utilities` referenced during config execution and scanner registration. The transpiler's new `treeshake: true` option filters `root.variables` and theme variables down to only those present in `_usage.variables`. The plugin enables treeshaking by default when generating global CSS.

- [#215](https://github.com/styleframe-dev/styleframe/pull/215) [`43f8f4f`](https://github.com/styleframe-dev/styleframe/commit/43f8f4f322d120def777262277aa40c5d84736a8) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Unify fluid and fixed font sizes under `useFontSizeDesignTokens`. Tuple `[min, max]` and object `{ min, max }` values are now treated as **absolute pixel ranges** and routed through `useFluidClamp`; plain `TokenValue` values stay static. The same call accepts mixed fluid + fixed entries.

  ```ts
  useFontSizeDesignTokens(s, {
    default: "@font-size.md",
    md: [16, 18], // fluid
    sm: "0.8rem", // fixed
    lg: { min: 18, max: 24 }, // fluid (object form)
  });
  ```

  Breaking changes:
  - `useFluidFontSizeDesignTokens` is removed. Pass ranges directly to `useFontSizeDesignTokens` instead.
  - `useDesignTokensPreset`'s `fluidFontSize.values` config now expects the unified `FontSizeValue` (`TokenValue | RangeInput<TokenValue>`) per key. Existing `[min, max]` / `{ min, max }` shapes still work but are interpreted as **absolute pixels**, not multipliers of a base.
  - When `fluidFontSize` is enabled and the user passes their own `fontSize` config, those values now win over the fluid defaults instead of being silently dropped.
  - `fontSizeValues` is renamed to `fontSizeStaticValues`. The pixel base used by the default fluid scale is emitted as configurable CSS variables (`--font-size--min: 16;` / `--font-size--max: 18;`); each fluid `font-size.*` `calc()` references them via `var()`, so the base can be retargeted by overriding those custom properties.

  Internal: `createUseVariable` gains a `fluid?: boolean` opt-in flag plus a `breakpoint` options-bag arg on the returned composable, so any composable can adopt range-aware values with a single line.

### Patch Changes

- Updated dependencies [[`6d406c2`](https://github.com/styleframe-dev/styleframe/commit/6d406c289b39c666a3fb7468aa3ec08f5a6d316b)]:
  - @styleframe/core@3.5.0
  - @styleframe/transpiler@3.3.0
  - @styleframe/plugin@3.3.0

## 3.6.0

### Minor Changes

- [#204](https://github.com/styleframe-dev/styleframe/pull/204) [`1d57ffa`](https://github.com/styleframe-dev/styleframe/commit/1d57ffaa2861fd05a03f370cf3948d772d6be237) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `Media` recipe — a layout-only multi-part recipe modeled on the Bootstrap/Inkline media object pattern for image-plus-content layouts (comments, posts, list items)
  - New recipes: `useMediaRecipe`, `useMediaFigureRecipe`, `useMediaBodyRecipe`, `useMediaTitleRecipe`
  - Root recipe exposes `orientation` (`horizontal`/`vertical`), `align` (`start`/`center`/`end`), and `size` (`sm`/`md`/`lg`) axes — no color or surface styling, so it composes inside Card, Callout, etc.
  - `useMediaBodyRecipe` sets `min-width: 0` to safely wrap long titles inside flex containers
  - Designed for nesting (parent Media → child Media inside `MediaBody`) for comment threads and reply chains

- [#208](https://github.com/styleframe-dev/styleframe/pull/208) [`787cf14`](https://github.com/styleframe-dev/styleframe/commit/787cf143c925ac9caacb3df1c72c3aeb2d626419) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `PageHero` recipe — a multi-part composable for full-width hero sections with color, size, orientation, alignment, and reverse axes
  - New recipes: `usePageHeroRecipe`, `usePageHeroBodyRecipe`, `usePageHeroHeadlineRecipe`, `usePageHeroTitleRecipe`, `usePageHeroDescriptionRecipe`, `usePageHeroActionsRecipe`, `usePageHeroLinksRecipe`, `usePageHeroImageRecipe`
  - Container exposes `color` (`light`/`dark`/`neutral` with adaptive dark mode), `size` (`sm`/`md`/`lg`), `orientation` (`vertical`/`horizontal`), `alignment` (`start`/`center`/`end`), and `reverse` axes
  - Sub-recipes mirror the `size` and `alignment` axes and override alignment to `start` in horizontal orientation for correct two-column layout
  - Adds a generic `useFilterUtility` and registers it in `useUtilitiesPreset`

- [#209](https://github.com/styleframe-dev/styleframe/pull/209) [`3559b70`](https://github.com/styleframe-dev/styleframe/commit/3559b70dedcc13ad191c78869cd86407b8470604) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add pagination recipe with `usePaginationRecipe`, `usePaginationItemRecipe`, and `usePaginationEllipsisRecipe`. Supports 3 color modes (light, dark, neutral), 6 style variants (solid, outline, soft, subtle, ghost, link), 3 sizes (sm, md, lg), and active/disabled item states.

- [#203](https://github.com/styleframe-dev/styleframe/pull/203) [`c314dbc`](https://github.com/styleframe-dev/styleframe/commit/c314dbc78872df38efe72d7931faf86afce5ffcc) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Track variable references in `root._usage.variables` for future transpiler optimizations
  - Add `_usage: { variables: Set<string> }` to `Root` type and initialize in `createRoot()`
  - Record variable names whenever `ref()` is called or `@`-prefixed syntax is resolved

### Patch Changes

- Updated dependencies [[`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f), [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f), [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f), [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f), [`8826eda`](https://github.com/styleframe-dev/styleframe/commit/8826edad3fcb2e969024a586a20c2059229d958f), [`24eebba`](https://github.com/styleframe-dev/styleframe/commit/24eebba87c8fa6fc6822e18d67f4c0412192e793), [`c314dbc`](https://github.com/styleframe-dev/styleframe/commit/c314dbc78872df38efe72d7931faf86afce5ffcc)]:
  - @styleframe/cli@4.0.0
  - @styleframe/core@3.4.0

## 3.5.1

### Patch Changes

- [#201](https://github.com/styleframe-dev/styleframe/pull/201) [`4ae6cd4`](https://github.com/styleframe-dev/styleframe/commit/4ae6cd46269f4619f6d8f3eb481f7aed29450db3) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Lock `fluid.screen` at `fluid.max-width` past the maximum viewport to prevent fluid values from extrapolating beyond their intended ceiling
  - `useFluidViewportDesignTokens` now registers a media query at `min-width: <maxWidth>` that pins `fluid.screen` to `calc(var(--fluid--max-width) * 1px)`
  - The lock breakpoint derives from the `maxWidth` option, supporting both numeric (`1440`) and string (`90rem`) values

## 3.5.0

### Minor Changes

- [#196](https://github.com/styleframe-dev/styleframe/pull/196) [`5a37154`](https://github.com/styleframe-dev/styleframe/commit/5a37154540057d115a834961b708a77cbf032783) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Dropdown recipe with item, separator, label, arrow, tests, and documentation
  - Add `useDropdownRecipe` container recipe with 3 colors (light, dark, neutral), 3 visual styles (solid, soft, subtle), and 3 sizes (sm, md, lg) — uses `@z-index.dropdown` for surface stacking
  - Add `useDropdownItemRecipe` for clickable menu options with hover, focus, active, and disabled states across all color × variant combinations
  - Add `useDropdownSeparatorRecipe` for visual dividers between item groups (color axis only)
  - Add `useDropdownLabelRecipe` for uppercase muted group headings (color and size axes)
  - Add `useDropdownArrowRecipe` using the CSS border-triangle technique — points upward by default to sit above the panel, registers an `@dropdown.arrow.size` variable (default `6px`)
  - Add Dropdown documentation page with usage examples, anatomy, accessibility guidance (menu/menuitem/separator roles, keyboard navigation, roving tabindex), API reference, and FAQ

- [#198](https://github.com/styleframe-dev/styleframe/pull/198) [`eabf9f4`](https://github.com/styleframe-dev/styleframe/commit/eabf9f4150cddc240065e72d38d3c01042fb140c) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add fluid typography to the default design tokens preset
  - Add `useFluidClamp` to compose a `clamp()`-style fluid value between a min/max pair using a viewport-driven breakpoint reference
  - Add `useFluidViewportDesignTokens` registering `fluid.breakpoint`, `fluid.min`, and `fluid.max` viewport variables that drive the clamp interpolation
  - Add `useFluidFontSizeDesignTokens` registering `font-size.min/max` (with `xs`–`xl` multipliers off the type scale) and resolving `font-size.{xs..xl}` to fluid clamp values
  - Wire fluid font sizing into `useDesignTokensPreset` so the default preset ships fluid type out of the box
  - Add `fluidFontSize` and `fluidViewport` value helpers and documentation for the new fluid composables and the presets reference page

- [#195](https://github.com/styleframe-dev/styleframe/pull/195) [`73a4c55`](https://github.com/styleframe-dev/styleframe/commit/73a4c551a403fcda250b108fb93c9ab7394b27c2) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add HamburgerMenu recipe with toggle button, animations, tests, and documentation
  - Add `useHamburgerMenuRecipe` icon-toggle button recipe with 3 colors (light, dark, neutral), 3 sizes (sm, md, lg), 7 open-state animations (close, arrow-{up,down,left,right}, minus, plus), and a boolean `active` axis
  - Inner bars rendered via `.hamburger-menu-inner` + `::before`/`::after` pseudo-elements; per-size dimensions and per-animation transforms registered via `setup(s)` callback
  - Add HamburgerMenu Storybook stories with all-variants and all-sizes preview grids, plus per-color, per-size, per-animation, and disabled/active stories
  - Add HamburgerMenu documentation page with usage examples, accessibility guidance (`aria-expanded`, `aria-label`), API reference, and best practices

- [#189](https://github.com/styleframe-dev/styleframe/pull/189) [`689f02b`](https://github.com/styleframe-dev/styleframe/commit/689f02bd98262c4ee7b35b92ca537ac0e50af013) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Input recipe with prefix/suffix and prepend/append slots
  - Add `useInputRecipe` wrapper recipe with 3 colors (light, dark, neutral), 3 variants (default, soft, ghost), 3 sizes, and `invalid`/`disabled`/`readonly` boolean state axes; the wrapper owns the visual field and inherits typography into a nested `<input class="input-field">` styled via setup callback
  - Add `useInputPrefixRecipe` and `useInputSuffixRecipe` for inline addons rendered inside the field, beside the text
  - Add `useInputPrependRecipe` and `useInputAppendRecipe` as transparent slot containers for external addons (Buttons, dropdowns, plain text) — content brings its own visual language
  - Add `useInputGroupRecipe` as a pure layout coordinator that flattens border-radius and collapses border-width at the seams where prepend/append meet the input, using `:has()` selectors

- [`ef662ae`](https://github.com/styleframe-dev/styleframe/commit/ef662ae696acf138a14c246b4b6f7a65ebae53c1) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Spinner recipe with circle, text, overlay, tests, and documentation
  - Add `useSpinnerRecipe` container recipe with 4 colors (primary, light, dark, neutral) and 4 sizes (auto, sm, md, lg)
  - Add `useSpinnerCircleRecipe` with SVG stroke-dasharray animation and keyframes
  - Add `useSpinnerTextRecipe` for centered label overlay on the spinner
  - Add `useSpinnerOverlayRecipe` for fixed/absolute backdrop
  - Add Spinner documentation page with usage examples, API reference, and FAQ

- [#198](https://github.com/styleframe-dev/styleframe/pull/198) [`eabf9f4`](https://github.com/styleframe-dev/styleframe/commit/eabf9f4150cddc240065e72d38d3c01042fb140c) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Enable `fluidFontSize` by default in `useDesignTokensPreset`
  - Calling `useDesignTokensPreset(s)` with no config now emits the fluid
    font-size scale (`clamp()`-based `font-size.*`, `font-size.min/max`,
    `scale.min/max`, and per-power scale variables). Previously, fluid was
    opt-in via `fluidFontSize: true`.
  - Pass `fluidFontSize: false` to fall back to the static `fontSize` domain.
  - Custom `fontSize: { ... }` config is silently ignored when fluid is
    active. Migration: add `fluidFontSize: false` alongside any custom
    `fontSize` config you want to keep applying.
  - Domain dependencies are now validated up front. Setting `fluidViewport:
false` or `scale: false` while leaving `fluidFontSize` enabled throws a
    configuration error — both are required for the fluid scale to function.
    Migration: add `fluidFontSize: false` whenever you disable `fluidViewport`
    or `scale`.
  - Internally, domains can now declare `enabled` predicates and a `requires`
    list of config keys that must not be `false`. The preset uses this to gate
    the fluid `scale` and `font-size` domains generically rather than via
    ad-hoc checks inside each composable.

- [#198](https://github.com/styleframe-dev/styleframe/pull/198) [`eabf9f4`](https://github.com/styleframe-dev/styleframe/commit/eabf9f4150cddc240065e72d38d3c01042fb140c) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Accept `{ min, max }` objects in fluid range APIs

  `useFluidClamp` and the per-step `values` of `useFluidFontSizeDesignTokens`
  now accept ranges as either `[min, max]` tuples or `{ min, max }` objects.
  The `fluidFontSize.values` config in `useDesignTokensPreset` accepts both
  forms as well. Existing tuple call sites are unaffected.

## 3.4.0

### Minor Changes

- [#165](https://github.com/styleframe-dev/styleframe/pull/165) [`5ef9019`](https://github.com/styleframe-dev/styleframe/commit/5ef9019fd0121cf95bd4e7373dbd55028f25b6d0) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add ButtonGroup recipe for grouping buttons with joined borders
  - Add `useButtonGroupRecipe` with orientation (`horizontal`, `vertical`) and block (`true`, `false`) variants
  - Use compound variant `className` with RSCSS modifiers (`-horizontal`, `-vertical`, `-block`) to emit helper classes
  - Use `setup` callback to register nested selectors for joined-button effects (border-radius and border removal on inner children)
  - Add ButtonGroup storybook component, grid preview, and stories

- [#162](https://github.com/styleframe-dev/styleframe/pull/162) [`990ed33`](https://github.com/styleframe-dev/styleframe/commit/990ed33078b61ddf1cd025ce358862d103e0ea84) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Card recipe with border style utility improvements
  - Add `useCardRecipe` with size (`sm`, `md`, `lg`), variant (`elevated`, `outline`, `filled`, `ghost`), and color variants including light, dark, and neutral
  - Add border style utility support (`solid`, `dashed`, `dotted`, `double`, `hidden`, `none`) with responsive and state modifier capabilities
  - Normalize light/dark color variants across Badge, Button, and Callout recipes using `text-inverted` token
  - Add Card storybook components, grid previews, and stories

- [#180](https://github.com/styleframe-dev/styleframe/pull/180) [`d2c1ed6`](https://github.com/styleframe-dev/styleframe/commit/d2c1ed65b1a268647e4789a20341d8da61fb9f74) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Chip recipe with indicator, tests, and documentation
  - Add `useChipRecipe` wrapper recipe with relative positioning context
  - Add `useChipIndicatorRecipe` with 9 colors, 2 variants (solid/soft), 5 sizes, 4 corner positions, and inset mode
  - Wire `useTransformUtility` into `useUtilitiesPreset`
  - Convert min/max width/height utilities to spacing multiplier utilities for consistency
  - Add Chip documentation page with usage examples, API reference, and FAQ

- [#160](https://github.com/styleframe-dev/styleframe/pull/160) [`cb053e0`](https://github.com/styleframe-dev/styleframe/commit/cb053e0135fef47161537516c53e3fc0e8b238cb) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add light, dark, and neutral colors to Badge and Button recipes
  - Add `light`, `dark`, and `neutral` color variants to `useBadgeRecipe` with compound variants for solid, outline, soft, and subtle styles
  - Add `light`, `dark`, and `neutral` color variants to `useButtonRecipe` with compound variants for solid, outline, soft, subtle, ghost, and link styles
  - Update storybook Badge and Button components, grid previews, and stories to document the new colors

- [#171](https://github.com/styleframe-dev/styleframe/pull/171) [`6f6a360`](https://github.com/styleframe-dev/styleframe/commit/6f6a360b838188eae8244353351e8b458792c95d) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Modal recipe with overlay, header, body, and footer parts
  - Add `useModalRecipe` with size (`sm`, `md`, `lg`), variant (`solid`, `soft`, `subtle`), and color (`light`, `dark`, `neutral`) variants matching the Card recipe structure
  - Add `useModalHeaderRecipe` and `useModalFooterRecipe` with separator border compound variants and setup functions for `:first-child`/`:last-child` border collapse
  - Add `useModalBodyRecipe` with size-based padding and gap, no compound variants
  - Add `useModalOverlayRecipe` with fixed-position full-screen backdrop (`rgba(0, 0, 0, 0.75)`) and centered flex layout
  - Add Modal storybook components, grid previews, and stories with interactive open/close and fullscreen example
  - Add Modal documentation page

- [#168](https://github.com/styleframe-dev/styleframe/pull/168) [`0250281`](https://github.com/styleframe-dev/styleframe/commit/02502814c4ec5fba342d7dd20a72180635caf7d8) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Nav recipe with list-style utility
  - Add `useNavRecipe` and `useNavItemRecipe` multi-part recipes with size (xs–xl), color, and variant (pills, underline, default) support
  - Add `useListStyleUtility` shorthand utility for the `list-style` CSS property
  - Add Nav storybook components, grid previews, and stories

- [#176](https://github.com/styleframe-dev/styleframe/pull/176) [`cccd1cd`](https://github.com/styleframe-dev/styleframe/commit/cccd1cdab769a7fb8d3cbfb4620ad2926099f0fc) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Placeholder recipe with dashed border and CSS hatch pattern
  - Add `usePlaceholderRecipe` as a base-only recipe (no variants) with a dashed border, hatch background pattern, and automatic dark mode support
  - Add Placeholder documentation page with usage examples, API reference, and FAQ

- [#179](https://github.com/styleframe-dev/styleframe/pull/179) [`8eadb4b`](https://github.com/styleframe-dev/styleframe/commit/8eadb4b8e6200b962f114d8bf48578eb17e85d95) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Popover recipe with composable sub-recipes and documentation
  - Add `usePopoverRecipe` with size (`sm`, `md`, `lg`), variant (`solid`, `soft`, `subtle`), and color (`light`, `dark`, `neutral`) variants
  - Add `usePopoverHeaderRecipe` and `usePopoverFooterRecipe` with border collapsing via `:first-child`/`:last-child` selectors
  - Add `usePopoverBodyRecipe` for content area styling
  - Add `usePopoverArrowRecipe` with CSS border triangle implementation using `@popover.arrow.size` variable and `&:after` pseudo-element for border/fill separation
  - Add Popover storybook components, grid previews, and stories
  - Add complete documentation page covering usage, anatomy, accessibility, and API reference

- [#178](https://github.com/styleframe-dev/styleframe/pull/178) [`2bcd961`](https://github.com/styleframe-dev/styleframe/commit/2bcd961d109c1a3c647a777256b81b2ce3d50d5a) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Progress recipe with orientation, inverted, and indeterminate animation support
  - Add `useProgressRecipe` (track) and `useProgressBarRecipe` (bar) with 9 bar colors, 3 track colors, 5 sizes, horizontal/vertical orientation, inverted fill direction, and 4 indeterminate animations (carousel, carousel-inverse, swing, elastic)
  - Register 8 keyframes automatically (4 horizontal + 4 vertical) via setup callback
  - Add Progress documentation page with usage examples, API reference, and FAQ

- [#175](https://github.com/styleframe-dev/styleframe/pull/175) [`b506ea5`](https://github.com/styleframe-dev/styleframe/commit/b506ea5c3c36fa24fea19a69ee3fef7035397dda) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Skeleton recipe with pulse animation and supporting utilities
  - Add `useSkeletonRecipe` with size (`xs`, `sm`, `md`, `lg`, `xl`) and rounded (`true`, `false`) variants, pulse animation, and dark mode support
  - Add granular animation utilities: `useAnimationNameUtility`, `useAnimationDurationUtility`, `useAnimationTimingFunctionUtility`, `useAnimationIterationCountUtility`
  - Switch `useWidthUtility` and `useHeightUtility` to `createUseSpacingUtility` for `@N` multiplier support
  - Add compound keyframe selector support in core engine (e.g. `"0%, 100%"`)
  - Add Skeleton storybook component, grid previews, and stories
  - Add Skeleton documentation page

- [#172](https://github.com/styleframe-dev/styleframe/pull/172) [`7620771`](https://github.com/styleframe-dev/styleframe/commit/7620771ede3b1e6e9a2f14cf20e845af1078635e) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Tooltip recipe with arrow sub-recipe and transform utility
  - Add `useTooltipRecipe` with size (`sm`, `md`, `lg`), variant (`solid`, `soft`, `subtle`), and color (`light`, `dark`, `neutral`) variants
  - Add `useTooltipArrowRecipe` with CSS border triangle implementation using `@tooltip.arrow.size` variable and `&:after` pseudo-element for border/fill separation
  - Add `useTransformUtility` for arbitrary `transform` CSS property values
  - Add Tooltip storybook components, grid previews, and stories including freeform rich content example

- [#163](https://github.com/styleframe-dev/styleframe/pull/163) [`1a7dc77`](https://github.com/styleframe-dev/styleframe/commit/1a7dc77600b6c9766ed69bf00338a225f5188b12) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add per-part borders with adjacency collapsing to Card recipe
  - Add independent `borderTop` and `borderBottom` to each card part (header, body, footer) with compound variants per color×variant
  - Add `:first-child` / `:last-child` collapse selectors to header and footer recipes to remove duplicate borders at card edges
  - Extend `createUseRecipe` with an optional `setup` callback for registering selectors alongside recipes
  - Add `color` and `variant` props to `CardBody` component

- [#164](https://github.com/styleframe-dev/styleframe/pull/164) [`efd99f7`](https://github.com/styleframe-dev/styleframe/commit/efd99f70a30f9a42c6e1793ed777b1565fb47a82) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add className support for compound variants in recipes
  - Add optional `className` field to compound variants, appended to output when conditions match
  - Make `css` optional on compound variants, allowing className-only compound variants

- [#167](https://github.com/styleframe-dev/styleframe/pull/167) [`179c90d`](https://github.com/styleframe-dev/styleframe/commit/179c90d9f73dadbbeb9159ab9fbd7287ceba1f20) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add boolean support for recipe variant props
  - When a variant defines both `true` and `false` keys, the runtime now accepts boolean `true`/`false` values in addition to string `"true"`/`"false"`
  - Generated `.d.ts` type declarations include `| boolean` in the type union for boolean variants

- [#158](https://github.com/styleframe-dev/styleframe/pull/158) [`90f1862`](https://github.com/styleframe-dev/styleframe/commit/90f1862e12596943fb739b7cf98e2dfc8c47ff6d) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Rename Alert recipe to Callout recipe
  - Rename `useAlertRecipe` to `useCalloutRecipe` with updated recipe name from `alert` to `callout`
  - Add `CalloutContent`, `CalloutTitle`, and `CalloutDescription` sub-components for better composability
  - Move storybook grid preview components into `preview/` subdirectories for cleaner organization
  - Add Callout documentation page

- [#166](https://github.com/styleframe-dev/styleframe/pull/166) [`ff13980`](https://github.com/styleframe-dev/styleframe/commit/ff139805c9839da9b4d4511099e7838f7e159ba7) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Rename `danger` semantic color to `error` across the design system
  - Rename `danger` color token to `error` in default color values and border color values
  - Update all recipes (badge, button, callout) to use `error` instead of `danger` in color variants
  - Update all documentation, storybook stories, and playground examples

### Patch Changes

- [#181](https://github.com/styleframe-dev/styleframe/pull/181) [`e77988d`](https://github.com/styleframe-dev/styleframe/commit/e77988dda7f019d3a32f5e0cb7ba44930aee6a6d) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Remove vite-plugin-node and externalize peer deps in scanner/loader builds
  - Remove `vite-plugin-node` which was injecting dead code (rfdc deep-clone, Buffer utilities) into dist bundles
  - Replace with native Vite library mode and explicit `rollupOptions.external` for peer dependencies and Node.js builtins
  - Scanner dist: 23.21 kB → 11.18 kB (52% smaller), Loader dist: 43.83 kB → 4.10 kB (91% smaller)

- Updated dependencies [[`b506ea5`](https://github.com/styleframe-dev/styleframe/commit/b506ea5c3c36fa24fea19a69ee3fef7035397dda), [`efd99f7`](https://github.com/styleframe-dev/styleframe/commit/efd99f70a30f9a42c6e1793ed777b1565fb47a82), [`e77988d`](https://github.com/styleframe-dev/styleframe/commit/e77988dda7f019d3a32f5e0cb7ba44930aee6a6d), [`179c90d`](https://github.com/styleframe-dev/styleframe/commit/179c90d9f73dadbbeb9159ab9fbd7287ceba1f20)]:
  - @styleframe/core@3.3.0
  - @styleframe/loader@3.0.1
  - @styleframe/transpiler@3.2.0

## 3.3.0

### Minor Changes

- [#154](https://github.com/styleframe-dev/styleframe/pull/154) [`352f10c`](https://github.com/styleframe-dev/styleframe/commit/352f10c958ac12b7dde245657f3ae8d548e9378b) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Update color palette for accessibility and show hex values in swatches
  - Revise base color values to OKLCH-aligned accessible colors for both light and dark modes
  - Remove per-color `text.on-*` tokens in favor of a single `colorTextInverted` reference
  - Display computed hex values inside color swatch previews
  - Add `color.<name>` labels below each swatch with monospace styling

- [#149](https://github.com/styleframe-dev/styleframe/pull/149) [`b9e54ed`](https://github.com/styleframe-dev/styleframe/commit/b9e54eda1acbf1b1b256f96bf6306dc300602618) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Flatten design tokens preset result and rename variable composables
  - Rename all variable composables from `use{Name}` to `use{Name}DesignTokens` for clearer naming
  - Flatten `useDesignTokensPreset` result so variables are directly destructurable instead of nested by domain
  - Add OKLCH gamut mapping utilities for color processing
  - Add color reference value support so colors can reference generated shade/tint variants
  - Add border, transition, and animation utility implementations

- [#155](https://github.com/styleframe-dev/styleframe/pull/155) [`cc4f170`](https://github.com/styleframe-dev/styleframe/commit/cc4f170c56ad2e246b94ab4d64b7f6c3097c7223) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Refactor recipes, improve modifier at-rule support, and forward variables through modifier factories
  - Refactor recipes and utilities with improved color theming composables
  - Add at-rule support for modifiers (e.g. media preference modifiers)
  - Forward variables and children through all modifier factory functions
  - Restructure docs for components, utilities, and modifiers into composable subdirectories
  - Add Button composable recipe documentation
  - Update plugin scanner for improved recipe handling

- [#151](https://github.com/styleframe-dev/styleframe/pull/151) [`6a18eeb`](https://github.com/styleframe-dev/styleframe/commit/6a18eeb5e36d9f66ef48f2e107d2b6ff65b2a792) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Rename colorLightness to colorLevel across theme, docs, and storybook
  - Rename `colorLightness` value to `colorLevel` for clearer terminology
  - Rename `useColorLightnessDesignTokens` to `useColorLevelDesignTokens`
  - Update all color-related design token references from lightness to level

### Patch Changes

- [#152](https://github.com/styleframe-dev/styleframe/pull/152) [`d7f4405`](https://github.com/styleframe-dev/styleframe/commit/d7f440585c942842b20bd97e2781131d28c3ee08) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Reorganize composable documentation into dedicated subdirectories
  - Move design token, utility, and modifier composable docs into `02.composables/` subdirectories
  - Update content to use "composable" terminology consistently
  - Add animations composable documentation page
  - Split transitions-animation into separate transitions and animations pages

- Updated dependencies [[`cc4f170`](https://github.com/styleframe-dev/styleframe/commit/cc4f170c56ad2e246b94ab4d64b7f6c3097c7223)]:
  - @styleframe/core@3.2.0
  - @styleframe/transpiler@3.1.0
  - @styleframe/plugin@3.2.0

## 3.2.0

### Minor Changes

- [#145](https://github.com/styleframe-dev/styleframe/pull/145) [`1597105`](https://github.com/styleframe-dev/styleframe/commit/1597105d55c1dd43adc6ec146858770a830dc1fb) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add duration design tokens for consistent animation and transition timing
  - Add `useDuration` composable with semantic duration scale from `instant` (0ms) through `slowest` (1000ms)
  - Add `durationValues` default token values: instant, fastest, faster, fast, normal, slow, slower, slowest
  - Register `duration` domain in `useDesignTokensPreset` with full theming and override support
  - Add `duration` namespace to `useTransitionDurationUtility` and `useTransitionDelayUtility` for `@token` references
  - Replace hardcoded `150ms` with `@duration.fast` in `useTransitionPropertyUtility`

- [#129](https://github.com/styleframe-dev/styleframe/pull/129) [`2610041`](https://github.com/styleframe-dev/styleframe/commit/2610041beb03a8afc8de17af8857b9931f3359b0) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add custom utility syntax support and separate class name generation from CSS escaping
  - Extract `defaultUtilitySelectorFn` to `@styleframe/core` returning raw class names; add `classNameToCssSelector` for consistent CSS escaping
  - Add `ScannerUtilitiesConfig` with pluggable `pattern`, `parse`, and `selector` functions for custom utility naming conventions
  - Thread custom utilities config through extractor, matcher, scanner, and plugin layers

- [#146](https://github.com/styleframe-dev/styleframe/pull/146) [`bff61d1`](https://github.com/styleframe-dev/styleframe/commit/bff61d104eca9b1f2a72911593abf0a7fc90ec34) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Close 416px breakpoint gap by adding 768px md breakpoint
  - Shift default breakpoint scale to align with industry standards (Tailwind, Bootstrap, Chakra)
  - Change md from 992px to 768px to cover the tablet range
  - Shift lg to 992px, xl to 1200px, and add new 2xl at 1440px

- [#135](https://github.com/styleframe-dev/styleframe/pull/135) [`228b0c0`](https://github.com/styleframe-dev/styleframe/commit/228b0c0bc36332d371dd8a7ca430ebe2be3ac046) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Implement importree-based HMR with selective cache invalidation
  - Replace full-reload HMR with importree-powered dependency graph for selective Jiti cache invalidation
  - Use persistent shared Jiti instance with `moduleCache: true` so unchanged dependencies stay cached across reloads
  - Add `dependency-graph` module that builds merged forward/reverse import trees for cross-entry dependency tracking
  - Export `createSharedJiti`, `clearJitiCache`, and `clearAllJitiCache` from `@styleframe/loader`
  - Remove `resolve.alias` option in favor of automatic dependency detection via importree

- [#137](https://github.com/styleframe-dev/styleframe/pull/137) [`8d6e731`](https://github.com/styleframe-dev/styleframe/commit/8d6e7316dff6ebd0ed5cc29a4061c50786e9e8f5) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `resolve.alias` option to plugin for custom path resolution
  - Add `resolve.alias` option to plugin types for configuring module path alias mappings
  - Resolve relative alias paths to absolute paths relative to the plugin working directory
  - Pass aliases through to Jiti loader and importree dependency graph for proper module resolution and HMR tracking

- [#133](https://github.com/styleframe-dev/styleframe/pull/133) [`ce62d31`](https://github.com/styleframe-dev/styleframe/commit/ce62d318275deed277d828fdd8d2500c1a9d767f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Refactor design tokens preset, add Button recipe, and improve Badge recipe
  - Refactor `useDesignTokensPreset` with improved variable composables and `createUseDerivedVariable` utility
  - Add `useButtonRecipe` with color, variant, and size support including compound variant styles
  - Improve `useBadgeRecipe` sizing, contrast, and accessibility
  - Update color references from `@color.light`/`@color.dark` to `@color.white`/`@color.black`
  - Enhance `createUseRecipe` with better types and `@`-prefixed token reference support in recipe definitions

- [#138](https://github.com/styleframe-dev/styleframe/pull/138) [`5f06459`](https://github.com/styleframe-dev/styleframe/commit/5f064599bae7a3679aeef0dbcb9bfaf0c4167355) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add sanitize.css preset with configurable normalization categories
  - Add `useSanitizePreset` with opt-out config for base, forms, typography, and reduced motion
  - Add `useSanitizeBaseSelectors` with cross-browser normalization (box-sizing, margins, forms, accessibility)
  - Add `useSanitizeFormsSelectors` with form element normalization and consistent select appearance
  - Add `useSanitizeTypographySelectors` with system font stack defaults
  - Add `useSanitizeReduceMotionSelectors` with `prefers-reduced-motion` media query support

- [#133](https://github.com/styleframe-dev/styleframe/pull/133) [`ce62d31`](https://github.com/styleframe-dev/styleframe/commit/ce62d318275deed277d828fdd8d2500c1a9d767f) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add unique id and parent-child traversal to token types, validate @ references, and resolve utility sibling keys
  - Add unique `id` field to Root, Selector, AtRule, Theme, Utility, Modifier, and Variable token types for stable identity tracking
  - Add `parentId` to track parent-child relationships across the token tree
  - Add `root._registry` for efficient id-based lookups and tree traversal
  - Validate `@`-prefixed string references against root-level variables in `parseDeclarationsBlock`, throwing descriptive errors for undefined variables
  - Add null/undefined guard to `ref()` with clear error messages
  - Support `@`-prefixed values in utility entries that resolve to sibling keys (e.g., `{ default: "@solid", solid: "solid" }`)

- [#130](https://github.com/styleframe-dev/styleframe/pull/130) [`7ec356a`](https://github.com/styleframe-dev/styleframe/commit/7ec356a0ff945c58df7de5740ef85c6ed781a50a) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add custom utility name support and shorthand utilities preset
  - Add `names` config option to `useUtilitiesPreset` for custom CSS class name prefixes on any utility
  - Add `utilityOptions` parameter to `createUseUtility` and `createUseSpacingUtility` to support name overrides
  - Add `useShorthandUtilitiesPreset` with TailwindCSS-compatible shorthand mappings (e.g., `._m:sm` instead of `._margin:sm`)

- [#142](https://github.com/styleframe-dev/styleframe/pull/142) [`89032b8`](https://github.com/styleframe-dev/styleframe/commit/89032b86dee47538a85f10e3083d128aaf60f864) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add z-index design token with semantic stacking scale
  - Add `useZIndex` composable with semantic layer names (base, dropdown, sticky, overlay, modal, popover, toast, max)
  - Add `zIndexValues` defaults with 100-increment scale for consistent stacking order
  - Integrate z-index into `useDesignTokensPreset` and `useUtilitiesPreset`
  - Update z-index utility docs to use semantic token values instead of arbitrary numbers

### Patch Changes

- [#141](https://github.com/styleframe-dev/styleframe/pull/141) [`295f04e`](https://github.com/styleframe-dev/styleframe/commit/295f04e6fdd011df6437986cc179e17efd8cd1be) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `@variablename` notation support in `css` template literals
  - `@variablename` strings in static parts of `css` template literals are automatically converted to variable references: `` css`1px solid @color.primary` `` resolves `@color.primary` to `ref("color.primary")`
  - Supports dotted names (e.g., `@color.primary.500`) and multiple references per segment (e.g., `` css`@spacing.x @spacing.y` ``)

- [#128](https://github.com/styleframe-dev/styleframe/pull/128) [`71009c2`](https://github.com/styleframe-dev/styleframe/commit/71009c2c0a07a0bfd240e70e61020c8b7e923edb) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add auto-resolve for variables and at-rules in `css` template literal interpolations
  - Variables interpolated directly in `css` are automatically converted to references: `` css`${variable}` `` is equivalent to `` css`${ref(variable)}` ``
  - AtRule and keyframes instances interpolated in `css` resolve to their rule name: `` css`${keyframeInstance}` `` is equivalent to `` css`${keyframeInstance.rule}` ``

- [#126](https://github.com/styleframe-dev/styleframe/pull/126) [`3ffb881`](https://github.com/styleframe-dev/styleframe/commit/3ffb8814f9b7db1912180b2e0c53e1b6675df4d6) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Extract modifier registration from `useUtilitiesPreset` into a dedicated `useModifiersPreset` composable with independent configuration

- [#140](https://github.com/styleframe-dev/styleframe/pull/140) [`7a61df0`](https://github.com/styleframe-dev/styleframe/commit/7a61df083bc534caa9271a1ef4535f7be979d7c2) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `@variablename` reference support in `variable()` values, `ref()` fallbacks, and `selector()` declaration values
  - `variable('name', '1px solid @color.primary')` resolves embedded `@` references to a CSS object with mixed text and reference parts
  - `ref('name', '@fallbackvar')` resolves `@`-prefixed fallback values to nested references
  - `selector({ border: "1px solid @color.primary" })` resolves embedded `@` references in declaration values
  - Extract shared `resolvePropertyValue()` utility for consistent `@` reference resolution across all contexts

- [#130](https://github.com/styleframe-dev/styleframe/pull/130) [`7ec356a`](https://github.com/styleframe-dev/styleframe/commit/7ec356a0ff945c58df7de5740ef85c6ed781a50a) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Document custom utility names and `useShorthandUtilitiesPreset` in utilities preset docs
  - Add `Custom Names` section documenting the `names` config option in `useUtilitiesPreset`
  - Add `useShorthandUtilitiesPreset` section with usage examples and full shorthand name mapping table

- Updated dependencies [[`295f04e`](https://github.com/styleframe-dev/styleframe/commit/295f04e6fdd011df6437986cc179e17efd8cd1be), [`71009c2`](https://github.com/styleframe-dev/styleframe/commit/71009c2c0a07a0bfd240e70e61020c8b7e923edb), [`2610041`](https://github.com/styleframe-dev/styleframe/commit/2610041beb03a8afc8de17af8857b9931f3359b0), [`228b0c0`](https://github.com/styleframe-dev/styleframe/commit/228b0c0bc36332d371dd8a7ca430ebe2be3ac046), [`8d6e731`](https://github.com/styleframe-dev/styleframe/commit/8d6e7316dff6ebd0ed5cc29a4061c50786e9e8f5), [`7a61df0`](https://github.com/styleframe-dev/styleframe/commit/7a61df083bc534caa9271a1ef4535f7be979d7c2), [`ce62d31`](https://github.com/styleframe-dev/styleframe/commit/ce62d318275deed277d828fdd8d2500c1a9d767f)]:
  - @styleframe/core@3.1.0
  - @styleframe/plugin@3.1.0
  - @styleframe/transpiler@3.0.1

## 3.1.0

### Minor Changes

- [#121](https://github.com/styleframe-dev/styleframe/pull/121) [`0242bd6`](https://github.com/styleframe-dev/styleframe/commit/0242bd65028cfc9216ed56e06d52de75ceff4d4b) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add utility modifier composables with auto-registration in useUtilitiesPreset
  - Add 68 modifiers across 8 categories: pseudo-states, form states, structural, pseudo-elements, media preferences, ARIA states, directional, and other states
  - Each modifier is individually importable (e.g., `useHoverModifier`, `useDisabledModifier`)
  - Grouped composables available for convenience (e.g., `usePseudoStateModifiers`)
  - Per-category configuration to enable/disable modifier groups via `ModifiersConfig`

### Patch Changes

- [#120](https://github.com/styleframe-dev/styleframe/pull/120) [`fa48802`](https://github.com/styleframe-dev/styleframe/commit/fa488027d32956e20fa26dc92ee1a3b3583671ad) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add hash-based utility class names for arbitrary CSS values containing whitespace. Values like `transition: 'all 0.3s ease'` now produce valid CSS class names using a deterministic hash (e.g., `_transition:2f7a3b1`) instead of invalid bracket notation with spaces.

- Updated dependencies [[`fa48802`](https://github.com/styleframe-dev/styleframe/commit/fa488027d32956e20fa26dc92ee1a3b3583671ad)]:
  - @styleframe/core@3.0.1

## 3.0.0

### Major Changes

- [#117](https://github.com/styleframe-dev/styleframe/pull/117) [`ffe6764`](https://github.com/styleframe-dev/styleframe/commit/ffe6764a2e6c84d5b3cfdf431bf11f17a3f3f118) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Introduce global Styleframe single-instance architecture. Extension files (`*.styleframe.ts`) now share the same instance created in `styleframe.config.ts` instead of creating independent instances. This is a breaking change that affects how styles are imported and composed across files.

### Minor Changes

- [#81](https://github.com/styleframe-dev/styleframe/pull/81) [`266f961`](https://github.com/styleframe-dev/styleframe/commit/266f96143e9ffb47e0e6326d0e5e7cc9d974ab83) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add @-prefixed string reference shorthand and fix keyframes object API
  - Add `@`-prefixed string reference shorthand for inline token references in declarations (e.g., `"@color.primary"`)
  - Fix keyframes object API outputting `[object Object]` by parsing percentage, `from`, and `to` keys as nested selectors
  - Prevent namespace double-prepending for `@`-prefixed values in utilities and defaults

### Patch Changes

- Updated dependencies [[`266f961`](https://github.com/styleframe-dev/styleframe/commit/266f96143e9ffb47e0e6326d0e5e7cc9d974ab83), [`ffe6764`](https://github.com/styleframe-dev/styleframe/commit/ffe6764a2e6c84d5b3cfdf431bf11f17a3f3f118)]:
  - @styleframe/core@3.0.0
  - @styleframe/transpiler@3.0.0
  - @styleframe/loader@3.0.0
  - @styleframe/cli@3.0.0
  - @styleframe/plugin@3.0.0

## 2.6.0

### Minor Changes

- [#83](https://github.com/styleframe-dev/styleframe/pull/83) [`6deddfd`](https://github.com/styleframe-dev/styleframe/commit/6deddfd7a97df13a7fcb865dbf088995f79bd4f3) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add Figma plugin for syncing Styleframe variables with Figma variables and CLI commands for Figma import/export

- [#105](https://github.com/styleframe-dev/styleframe/pull/105) [`b109ac1`](https://github.com/styleframe-dev/styleframe/commit/b109ac148d837ae0a060c34f0236338bf4deca36) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add multiplier support to spacing utilities (margin, padding, gap, space) with @-prefixed numeric values that generate calc() expressions based on a base spacing variable

### Patch Changes

- Updated dependencies [[`6deddfd`](https://github.com/styleframe-dev/styleframe/commit/6deddfd7a97df13a7fcb865dbf088995f79bd4f3)]:
  - @styleframe/cli@2.4.0

## 2.5.2

### Patch Changes

- [#102](https://github.com/styleframe-dev/styleframe/pull/102) [`90c3ae8`](https://github.com/styleframe-dev/styleframe/commit/90c3ae8dd19a688f88d1b362af6bef732de988d6) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `@styleframe/license` dependency and move runtime to production dependencies in init command

- Updated dependencies [[`90c3ae8`](https://github.com/styleframe-dev/styleframe/commit/90c3ae8dd19a688f88d1b362af6bef732de988d6)]:
  - @styleframe/cli@2.3.3

## 2.5.1

### Patch Changes

- [#100](https://github.com/styleframe-dev/styleframe/pull/100) [`6ae30fd`](https://github.com/styleframe-dev/styleframe/commit/6ae30fdd281033eb3a37c0a0b0388692506a0e58) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `@styleframe/license` as a dependency to the main `styleframe` package and update the CLI init command to add `@styleframe/runtime` as a production dependency instead of a dev dependency.

- Updated dependencies [[`6ae30fd`](https://github.com/styleframe-dev/styleframe/commit/6ae30fdd281033eb3a37c0a0b0388692506a0e58)]:
  - @styleframe/cli@2.3.2

## 2.5.0

### Minor Changes

- [#93](https://github.com/styleframe-dev/styleframe/pull/93) [`4ebc385`](https://github.com/styleframe-dev/styleframe/commit/4ebc3856ad4468e6caea5f72e595e781e2651b09) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Add `useDesignTokensPreset` composable for quick design token system setup
  - Introduces a comprehensive preset function that bootstraps complete design token systems with sensible defaults in a single function call
  - Full TypeScript type inference for all configuration options
  - Flexible domain configuration: use defaults, disable domains with `false`, or provide custom values
  - Automatic color variation generation (lightness, shades, tints) with configurable levels
  - Exports default values from variable composables (`defaultSpacingValues`, `defaultColorValues`, etc.)
  - Adds `useFontStyle` variable composable
  - Includes 54 comprehensive tests and detailed documentation

- [#95](https://github.com/styleframe-dev/styleframe/pull/95) [`75fd781`](https://github.com/styleframe-dev/styleframe/commit/75fd78196d61498db066de6e355eabcebbd39071) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Rename `useUtilities` to `useUtilitiesPreset` for consistency with design tokens preset naming
  - **BREAKING**: Renamed `useUtilities()` to `useUtilitiesPreset()` to align with `useDesignTokensPreset()` naming convention
  - Added comprehensive presets documentation page with complete API reference for 200+ utility creators
  - Updated all documentation examples and storybook files to use the new function name
  - Clarified CHANGELOG entries to indicate this is a rename from the previous function

- [#96](https://github.com/styleframe-dev/styleframe/pull/96) [`8460f16`](https://github.com/styleframe-dev/styleframe/commit/8460f169cec1199810e9203b357dac9f2f128c56) Thanks [@alexgrozav](https://github.com/alexgrozav)! - Rename `?recipe` imports to `?ts` and add named selector export support
  - **Breaking:** Renamed import query parameter from `?recipe` to `?ts` for styleframe files
  - Add support for exporting named selectors alongside recipes via `?ts` imports
  - Add `_exportName` property to `Selector` and `Recipe` types for tracking named exports
  - Replace `c12` with `chokidar` + `jiti` for simpler, more reliable config loading
  - Add `onError` callback to `watchConfiguration` for error reporting during file watch
  - Add file deletion detection with `unlink` handler in watch mode
  - Simplify `loadConfiguration` API by merging `loadConfigurationFromPath`
  - Add comprehensive unit tests for TypeScript selector consumer

### Patch Changes

- [`1f60314`](https://github.com/styleframe-dev/styleframe/commit/1f60314cde97278294f06e248682026eb53a8af9) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: update cli dependency

- Updated dependencies [[`1f60314`](https://github.com/styleframe-dev/styleframe/commit/1f60314cde97278294f06e248682026eb53a8af9), [`8460f16`](https://github.com/styleframe-dev/styleframe/commit/8460f169cec1199810e9203b357dac9f2f128c56), [`4e06424`](https://github.com/styleframe-dev/styleframe/commit/4e064245e78903307e6996eebf3f6dae5565de5f)]:
  - @styleframe/cli@2.3.1
  - @styleframe/loader@2.4.0
  - @styleframe/transpiler@2.6.0
  - @styleframe/plugin@2.4.0
  - @styleframe/core@2.6.0

## 2.4.0

### Minor Changes

- [#72](https://github.com/styleframe-dev/styleframe/pull/72) [`d98b650`](https://github.com/styleframe-dev/styleframe/commit/d98b65030170582ceacfabde3ba9ff7d92105389) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add support for .styleframe file imports

- [#75](https://github.com/styleframe-dev/styleframe/pull/75) [`72bb1f6`](https://github.com/styleframe-dev/styleframe/commit/72bb1f64aae1531496c5e7398c4bd3c11f5433f9) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add Tailwind-style utility functions

  Add `createUseUtility` factory function and 15 utility categories (accessibility, backgrounds, borders, effects, filters, flexbox-grid, interactivity, layout, sizing, spacing, svg, tables, transforms, transitions-animation, typography) for generating composable CSS utility classes.

### Patch Changes

- [#80](https://github.com/styleframe-dev/styleframe/pull/80) [`ff1a689`](https://github.com/styleframe-dev/styleframe/commit/ff1a689f36dc4294b2a7353949c6efd220451e9d) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: Expand CSS selector escaping for arbitrary values

  Consolidate escape logic into a single regex and extend escaping to cover additional special characters (#, (, ), %, ,) needed for arbitrary CSS value syntax like `[#1E3A8A]`, `[rgb(255,0,0)]`, and `[calc(100%-20px)]`.

- [#76](https://github.com/styleframe-dev/styleframe/pull/76) [`06afe2a`](https://github.com/styleframe-dev/styleframe/commit/06afe2af66c3ecd8c6a516336e594c1e8cb56de1) Thanks [@alexgrozav](https://github.com/alexgrozav)! - **BREAKING**: rename `useUtilities` to `useUtilitiesPreset` for consistency with design tokens preset naming

  Renamed `useUtilities()` to `useUtilitiesPreset()` to align with the naming convention established by `useDesignTokensPreset()`. The function registers all ~180 utility composables with a Styleframe instance and returns their creator functions, enabling automatic utility class generation for recipe declarations.

  Updated recipe documentation examples to use `useUtilitiesPreset()` with destructured functions and demonstrate both `ref()` and `@variable.name` syntax for referencing design tokens.

- Updated dependencies [[`ff1a689`](https://github.com/styleframe-dev/styleframe/commit/ff1a689f36dc4294b2a7353949c6efd220451e9d), [`d98b650`](https://github.com/styleframe-dev/styleframe/commit/d98b65030170582ceacfabde3ba9ff7d92105389)]:
  - @styleframe/transpiler@2.5.0
  - @styleframe/plugin@2.3.0
  - @styleframe/loader@2.3.0
  - @styleframe/core@2.5.0

## 2.3.0

### Minor Changes

- [#63](https://github.com/styleframe-dev/styleframe/pull/63) [`ec430e1`](https://github.com/styleframe-dev/styleframe/commit/ec430e11502b3dba69c20ee10b24f0302008883c) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add styleframe runtime for recipes

### Patch Changes

- Updated dependencies [[`ec430e1`](https://github.com/styleframe-dev/styleframe/commit/ec430e11502b3dba69c20ee10b24f0302008883c)]:
  - @styleframe/transpiler@2.4.0
  - @styleframe/plugin@2.2.0
  - @styleframe/core@2.4.0
  - @styleframe/cli@2.3.0

## 2.2.0

### Minor Changes

- [#68](https://github.com/styleframe-dev/styleframe/pull/68) [`653d1fc`](https://github.com/styleframe-dev/styleframe/commit/653d1fc4e8fb80f8c3371e728ffc962cf1fb1cec) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add support for dot notation in variable names

### Patch Changes

- Updated dependencies [[`7d32059`](https://github.com/styleframe-dev/styleframe/commit/7d320590a311ace8882a5a29db3a911c24b53710), [`653d1fc`](https://github.com/styleframe-dev/styleframe/commit/653d1fc4e8fb80f8c3371e728ffc962cf1fb1cec)]:
  - @styleframe/transpiler@2.3.0
  - @styleframe/core@2.3.0

## 2.1.1

### Patch Changes

- [`ff9d806`](https://github.com/styleframe-dev/styleframe/commit/ff9d806a8f815f94225851db000f6428b07cd305) Thanks [@alexgrozav](https://github.com/alexgrozav)! - docs: update readme

## 2.1.0

### Minor Changes

- [`628e650`](https://github.com/styleframe-dev/styleframe/commit/628e65039bae5e21ab9a66e16037e7e2791f8c8b) Thanks [@alexgrozav](https://github.com/alexgrozav)! - chore: update dependencies

### Patch Changes

- Updated dependencies [[`628e650`](https://github.com/styleframe-dev/styleframe/commit/628e65039bae5e21ab9a66e16037e7e2791f8c8b), [`48ea659`](https://github.com/styleframe-dev/styleframe/commit/48ea659789c9cdaf64a86bad7b05f38562d987c9)]:
  - @styleframe/transpiler@2.2.0
  - @styleframe/plugin@2.1.0
  - @styleframe/loader@2.2.0
  - @styleframe/core@2.2.0
  - @styleframe/cli@2.2.0

## 2.0.2

### Patch Changes

- [`1ead424`](https://github.com/styleframe-dev/styleframe/commit/1ead424825a6696969294d3127ac79298da03182) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: update license package version

- [`a08c996`](https://github.com/styleframe-dev/styleframe/commit/a08c996b3b781ead2000b087b3b16906821ba5e3) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: update package dependencies

- Updated dependencies [[`1ead424`](https://github.com/styleframe-dev/styleframe/commit/1ead424825a6696969294d3127ac79298da03182), [`a08c996`](https://github.com/styleframe-dev/styleframe/commit/a08c996b3b781ead2000b087b3b16906821ba5e3)]:
  - @styleframe/core@2.0.2
  - @styleframe/loader@2.0.2
  - @styleframe/transpiler@2.0.2
  - @styleframe/cli@2.0.2
  - @styleframe/plugin@2.0.2

## 2.0.1

### Patch Changes

- [#52](https://github.com/styleframe-dev/styleframe/pull/52) [`d3039fc`](https://github.com/styleframe-dev/styleframe/commit/d3039fc548972d01a5db6bd1b65ff7495047b5ae) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix(cli): update install version

- Updated dependencies [[`d3039fc`](https://github.com/styleframe-dev/styleframe/commit/d3039fc548972d01a5db6bd1b65ff7495047b5ae)]:
  - @styleframe/cli@2.0.1
  - @styleframe/core@2.0.1
  - @styleframe/loader@2.0.1
  - @styleframe/transpiler@2.0.1
  - @styleframe/plugin@2.0.1

## 2.0.0

### Minor Changes

- [#50](https://github.com/styleframe-dev/styleframe/pull/50) [`0593c52`](https://github.com/styleframe-dev/styleframe/commit/0593c52798b8846d3c49762621baeb66354e0356) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add license check integration

### Patch Changes

- Updated dependencies [[`0593c52`](https://github.com/styleframe-dev/styleframe/commit/0593c52798b8846d3c49762621baeb66354e0356)]:
  - @styleframe/transpiler@1.1.0
  - @styleframe/plugin@1.1.0
  - @styleframe/loader@1.1.0
  - @styleframe/core@1.1.0
  - @styleframe/cli@1.1.0

## 1.0.5

### Patch Changes

- [#45](https://github.com/styleframe-dev/styleframe/pull/45) [`6700e6f`](https://github.com/styleframe-dev/styleframe/commit/6700e6fa835183ac50808c05d44154c25e85e9e1) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add license package for license interactions

- Updated dependencies []:
  - @styleframe/core@1.0.3

## 1.0.4

### Patch Changes

- [#43](https://github.com/styleframe-dev/styleframe/pull/43) [`7e3d008`](https://github.com/styleframe-dev/styleframe/commit/7e3d00849067618802334d5e6823fc31f3aa2612) Thanks [@alexgrozav](https://github.com/alexgrozav)! - feat: add support for generic records in createUseVariable

- Updated dependencies [[`7e3d008`](https://github.com/styleframe-dev/styleframe/commit/7e3d00849067618802334d5e6823fc31f3aa2612)]:
  - @styleframe/cli@1.0.5

## 1.0.3

### Patch Changes

- [#35](https://github.com/styleframe-dev/styleframe/pull/35) [`5d53569`](https://github.com/styleframe-dev/styleframe/commit/5d5356960af687884703f3de5d3d1638d8ee9d8a) Thanks [@alexgrozav](https://github.com/alexgrozav)! - fix: Update published files references in package.json

- Updated dependencies [[`5d53569`](https://github.com/styleframe-dev/styleframe/commit/5d5356960af687884703f3de5d3d1638d8ee9d8a), [`5d53569`](https://github.com/styleframe-dev/styleframe/commit/5d5356960af687884703f3de5d3d1638d8ee9d8a)]:
  - @styleframe/core@1.0.2
  - @styleframe/loader@1.0.3
  - @styleframe/transpiler@1.0.3
  - @styleframe/plugin@1.0.1
  - @styleframe/cli@1.0.3

## 1.0.2

### Patch Changes

- Updated dependencies [[`68cd004`](https://github.com/styleframe-dev/styleframe/commit/68cd004b04395797876b5e805c0b910d6b665f35), [`68cd004`](https://github.com/styleframe-dev/styleframe/commit/68cd004b04395797876b5e805c0b910d6b665f35), [`68cd004`](https://github.com/styleframe-dev/styleframe/commit/68cd004b04395797876b5e805c0b910d6b665f35), [`68cd004`](https://github.com/styleframe-dev/styleframe/commit/68cd004b04395797876b5e805c0b910d6b665f35)]:
  - @styleframe/cli@1.0.2
  - @styleframe/loader@1.0.2
  - @styleframe/plugin@1.0.0
  - @styleframe/transpiler@1.0.2

## 1.0.1

### Patch Changes

- Update README.md
- Updated dependencies
  - @styleframe/cli@1.0.1
  - @styleframe/core@1.0.1
  - @styleframe/loader@1.0.1
  - @styleframe/transpiler@1.0.1

## 1.0.0

### Major Changes

- 8204e6d: Official styleframe release. Start writing modern, clean, composable CSS using TypeScript, with a focus on simplicity and performance.

### Patch Changes

- Updated dependencies [8204e6d]
  - @styleframe/cli@1.0.0
  - @styleframe/core@1.0.0
  - @styleframe/loader@1.0.0
  - @styleframe/transpiler@1.0.0
