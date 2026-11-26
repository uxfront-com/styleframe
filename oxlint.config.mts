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
			// Type tests read a property to check that it exists, or under `@ts-expect-error` that it
			// doesn't. The expression is the check.
			files: ["**/*.test.ts"],
			rules: {
				"no-unused-expressions": "off",
			},
		},
		{
			// Tests that read values as data: a filter, then a map, over a few rows, as the case reads
			// them.
			files: ["**/*.test.ts"],
			rules: {
				"quality/no-array-filter-map": "off",
			},
		},
		{
			// The console is what these report to: the CLI and the bundler plugin print to the
			// terminal, the scanner and the Figma plugin warn about input they skip, the apps log the
			// errors they catch, and the scripts, playgrounds and benchmarks print their results.
			files: [
				"tooling/**",
				"engine/scanner/src/node.ts",
				"engine/loader/playground/**",
				"testing/**",
				"apps/**",
			],
			rules: {
				"no-console": "off",
			},
		},
		{
			// These scripts run as their own entry points and handle a failure themselves, in an async
			// function or with `main().catch`, which prints it and sets the exit code.
			files: ["**/playground/*.ts", "testing/benchmark/src/*.ts"],
			rules: {
				"unicorn/prefer-top-level-await": "off",
			},
		},
		{
			// A port of rfdc, which clones a value of any type.
			files: ["engine/core/src/utils/deepClone.ts"],
			rules: {
				"typescript/no-explicit-any": "off",
				// A clone is made for a buffer, a `Map` or a `Set` by its class.
				"@nkzw/no-instanceof": "off",
			},
		},
		{
			// jiti's cache is a `Map` or a plain object, depending on its version.
			files: ["engine/loader/src/jiti.ts"],
			rules: {
				"@nkzw/no-instanceof": "off",
			},
		},
		{
			// The test runs in the browser and finds a `@keyframes` rule by its CSSOM class.
			files: ["testing/integration/tests/keyframes.spec.ts"],
			rules: {
				"@nkzw/no-instanceof": "off",
			},
		},
		{
			// An event bus with no listener map takes any payload, as its untyped callers expect.
			files: ["apps/storybook/src/utils/eventBus.ts"],
			rules: {
				"typescript/no-explicit-any": "off",
			},
		},
		{
			// Vue's shim for `*.vue` modules, in the form Vue gives it.
			files: ["**/env.d.ts"],
			rules: {
				"typescript/no-explicit-any": "off",
				"typescript/no-empty-object-type": "off",
			},
		},
		{
			// The playground scripts call a citty command with the arguments it reads, which its types
			// don't describe.
			files: ["tooling/cli/playground/*.ts"],
			rules: {
				"typescript/no-explicit-any": "off",
			},
		},
		{
			// Astro's integration and its hook are typed `any`, so the plugin doesn't depend on Astro.
			files: ["tooling/plugin/src/astro.ts"],
			rules: {
				"typescript/no-explicit-any": "off",
			},
		},
		{
			// `{}` is the type of "no keys" here: a recipe with no filter, and a preset group that's
			// turned off.
			files: ["theme/src/utils/createUseRecipe.ts", "theme/src/presets/useDesignTokensPreset.ts"],
			rules: {
				"typescript/no-empty-object-type": "off",
			},
		},
		{
			// `ModuleOptions` is the Nuxt module's public options type, the plugin's `Options` under
			// Nuxt's name.
			files: ["tooling/plugin/src/nuxt.ts"],
			rules: {
				"typescript/no-empty-object-type": "off",
			},
		},
		{
			// The design token preset merges each colour's levels into one result, a few times per
			// config. The merge in `merge.ts` combines a few instances, once.
			files: ["theme/src/presets/useDesignTokensPreset.ts", "engine/core/src/utils/merge.ts"],
			rules: {
				"oxc/no-accumulating-spread": "off",
			},
		},
		{
			// The augmented fourth's ratio is 1.414 as the type scales write it, not `Math.SQRT2`.
			files: ["theme/src/values/scale.ts", "theme/src/variables/useScaleDesignTokens.test.ts"],
			rules: {
				"oxc/approx-constant": "off",
			},
		},
		{
			// `@charset` takes the encoding's name as CSS spells it, `UTF-8`.
			files: ["engine/core/src/tokens/atRule.test.ts"],
			rules: {
				"unicorn/text-encoding-identifier-case": "off",
			},
		},
		{
			// These tests copy a JSON document as JSON, or check that a value survives a JSON round
			// trip, which `structuredClone` would carry through whatever it is.
			files: [
				"engine/core/src/inspect/inspect.test.ts",
				"tooling/dtcg/test/**/*.test.ts",
			],
			rules: {
				"unicorn/prefer-structured-clone": "off",
			},
		},
		{
			// The Figma plugin fills a variable's values mode by mode, then hands them on as the
			// export's type.
			files: ["tooling/figma/src/plugin/code.ts"],
			rules: {
				"quality/no-widen-then-assert": "off",
			},
		},
		{
			// Vite's `?raw` suffix gives the file's text as the default export, which the rule reads
			// as the TypeScript module itself.
			files: ["apps/playground/src/state/playground.ts"],
			rules: {
				"import/default": "off",
			},
		},
		{
			// The licence app reads Nuxt UI's locales by the current locale's code.
			files: ["apps/app/app/app.vue", "apps/app/app/error.vue"],
			rules: {
				"import/namespace": "off",
			},
		},
		{
			// Supabase's generated database types, which are empty until `supabase gen types` writes
			// them, and the index that exports them.
			files: ["apps/app/app/types/database.types.ts", "apps/app/app/types/index.ts"],
			rules: {
				"unicorn/no-empty-file": "off",
				"import/export": "off",
			},
		},
	],
});
