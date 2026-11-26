import vue from "@uxfront/oxlint-config/vue";
import { defineConfig } from "oxlint";

export default defineConfig({
	extends: [vue],
	// oxlint reads `env` and `ignorePatterns` from the root config only, so they're restated here.
	env: vue.env,
	ignorePatterns: [
		...vue.ignorePatterns,
		// Tailwind's own output, kept as it is for the benchmark to measure against, as in `.oxfmtrc.json`.
		"testing/benchmark/src/tailwind/**",
	],
	rules: {
		// `== null` checks for `null` and `undefined` in one comparison, as the engine does for an
		// optional fallback or variable. Every other comparison stays strict.
		eqeqeq: ["error", "always", { null: "ignore" }],
		// `noUncheckedIndexedAccess` types every index and key read as possibly `undefined`, and the
		// code reads arrays, maps and regular expression groups at indexes its own checks guarantee.
		// Each `!` marks such a read, where a runtime check would be a branch no input reaches.
		"typescript/no-non-null-assertion": "off",
		// Design tokens, DTCG documents, Figma variables and CSS declarations are keyed by names their
		// authors choose. `Record<string, unknown>` says so, and each reader checks what it reads.
		"quality/no-unsafe-dictionary-type": "off",
		// A DTCG document, a loaded config and a token's value reach the code as `unknown` and pass
		// through it to the shape a check has proved, which TypeScript can't follow.
		"quality/no-chained-type-assertions": "off",
		// Lookup tables are read with any string, like a prop's value or a token's name, so
		// `Record<string, string>` is the type they're read through. The exported ones, like
		// `defaultPropertyShortNames` and `shorthandNames`, are public, and inferring them would
		// change their types.
		"quality/no-known-value-widening": "off",
		// The API is factories, like `createUseVariable` and `createScanner`, whose inner functions
		// are what they return, and a test keeps its helpers beside the case that uses them.
		"unicorn/consistent-function-scoping": "off",
		// A DTCG `$value`, an alias's target and a loaded module can hold any value, so the resolvers
		// and loaders hand them on as `unknown` for the caller to check.
		"quality/no-unknown-returns": "off",
		// A field with no value is left out, not set to `undefined`, and the object that holds it is
		// built in one expression with a conditional spread.
		"quality/no-conditional-empty-object-spread": "off",
		// A namespace import names a module's whole API as one value: esbuild, the exports the
		// playground hands to a user's config, Storybook's annotations and Nuxt UI's locales.
		"import/no-namespace": "off",
	},
	overrides: [
		{
			files: ["**/*.test.ts"],
			rules: {
				// Type tests read a property to check that it exists, or under `@ts-expect-error` that it
				// doesn't. The expression is the check.
				"no-unused-expressions": "off",
				// Tests that read values as data: a filter, then a map, over a few rows, as the case reads
				// them.
				"quality/no-array-filter-map": "off",
			},
		},
		{
			files: [
				"tooling/**",
				"engine/scanner/src/node.ts",
				"engine/loader/playground/**",
				"testing/**",
				"apps/**",
			],
			rules: {
				// The console is what these report to: the CLI and the bundler plugin print to the
				// terminal, the scanner and the Figma plugin warn about input they skip, the apps log the
				// errors they catch, and the scripts, playgrounds and benchmarks print their results.
				"no-console": "off",
			},
		},
		{
			files: ["**/playground/*.ts", "testing/benchmark/src/*.ts"],
			rules: {
				// These scripts run as their own entry points and handle a failure themselves, in an async
				// function or with `main().catch`, which prints it and sets the exit code.
				"unicorn/prefer-top-level-await": "off",
			},
		},
		{
			files: ["engine/core/src/utils/deepClone.ts"],
			rules: {
				// A port of rfdc, which clones a value of any type.
				"typescript/no-explicit-any": "off",
				// A clone is made for a buffer, a `Map` or a `Set` by its class.
				"@nkzw/no-instanceof": "off",
			},
		},
		{
			files: ["engine/loader/src/jiti.ts"],
			rules: {
				// jiti's cache is a `Map` or a plain object, depending on its version.
				"@nkzw/no-instanceof": "off",
			},
		},
		{
			files: ["testing/integration/tests/keyframes.spec.ts"],
			rules: {
				// The test runs in the browser and finds a `@keyframes` rule by its CSSOM class.
				"@nkzw/no-instanceof": "off",
			},
		},
		{
			files: ["apps/storybook/src/utils/eventBus.ts"],
			rules: {
				// An event bus with no listener map takes any payload, as its untyped callers expect.
				"typescript/no-explicit-any": "off",
			},
		},
		{
			files: ["**/env.d.ts"],
			rules: {
				// Vue's shim for `*.vue` modules types a component's props as `any`, as Vue gives it.
				"typescript/no-explicit-any": "off",
				// The same shim leaves a component's props and emits open with `{}`.
				"typescript/no-empty-object-type": "off",
			},
		},
		{
			files: ["tooling/cli/playground/*.ts"],
			rules: {
				// The playground scripts call a citty command with the arguments it reads, which its types
				// don't describe.
				"typescript/no-explicit-any": "off",
			},
		},
		{
			files: ["tooling/plugin/src/astro.ts"],
			rules: {
				// Astro's integration and its hook are typed `any`, so the plugin doesn't depend on Astro.
				"typescript/no-explicit-any": "off",
			},
		},
		{
			files: ["theme/src/utils/createUseRecipe.ts", "theme/src/presets/useDesignTokensPreset.ts"],
			rules: {
				// `{}` is the type of "no keys" here: a recipe with no filter, and a preset group that's
				// turned off.
				"typescript/no-empty-object-type": "off",
			},
		},
		{
			files: ["tooling/plugin/src/nuxt.ts"],
			rules: {
				// `ModuleOptions` is the Nuxt module's public options type, the plugin's `Options` under
				// Nuxt's name.
				"typescript/no-empty-object-type": "off",
			},
		},
		{
			files: ["theme/src/presets/useDesignTokensPreset.ts", "engine/core/src/utils/merge.ts"],
			rules: {
				// The design token preset merges each colour's levels into one result, a few times per
				// config. The merge in `merge.ts` combines a few instances, once.
				"oxc/no-accumulating-spread": "off",
			},
		},
		{
			files: ["theme/src/values/scale.ts", "theme/src/variables/useScaleDesignTokens.test.ts"],
			rules: {
				// The augmented fourth's ratio is 1.414 as the type scales write it, not `Math.SQRT2`.
				"oxc/approx-constant": "off",
			},
		},
		{
			files: ["engine/core/src/tokens/atRule.test.ts"],
			rules: {
				// `@charset` takes the encoding's name as CSS spells it, `UTF-8`.
				"unicorn/text-encoding-identifier-case": "off",
			},
		},
		{
			files: ["engine/core/src/inspect/inspect.test.ts", "tooling/dtcg/test/**/*.test.ts"],
			rules: {
				// These tests copy a JSON document as JSON, or check that a value survives a JSON round
				// trip, which `structuredClone` would carry through whatever it is.
				"unicorn/prefer-structured-clone": "off",
			},
		},
		{
			files: ["tooling/figma/src/plugin/code.ts"],
			rules: {
				// The Figma plugin fills a variable's values mode by mode, then hands them on as the
				// export's type.
				"quality/no-widen-then-assert": "off",
			},
		},
		{
			files: ["apps/playground/src/state/playground.ts"],
			rules: {
				// Vite's `?raw` suffix gives the file's text as the default export, which the rule reads
				// as the TypeScript module itself.
				"import/default": "off",
			},
		},
		{
			files: ["apps/app/app/app.vue", "apps/app/app/error.vue"],
			rules: {
				// The licence app reads Nuxt UI's locales by the current locale's code.
				"import/namespace": "off",
			},
		},
		{
			files: ["apps/app/app/types/database.types.ts", "apps/app/app/types/index.ts"],
			rules: {
				// Supabase's generated database types, which are empty until `supabase gen types` writes
				// them.
				"unicorn/no-empty-file": "off",
				// The types index exports the generated file, which has no exports until it's written.
				"import/export": "off",
			},
		},
	],
});
