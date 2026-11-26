import base from "@uxfront/oxfmt-config";
import { defineConfig } from "oxfmt";

export default defineConfig({
	...base,
	// The content of a `css` tagged template is a value the engine parses, so formatting it
	// would change the CSS it emits, like the `css` tests' expected values.
	embeddedLanguageFormatting: "off",
	ignorePatterns: [
		...(base.ignorePatterns ?? []),
		// The docs are MDC, which oxfmt would rewrite, and Changesets writes `CHANGELOG.md` and
		// `.changeset/*.md`.
		"**/*.md",
		// Tailwind's own output, kept as it is for the benchmark to measure against.
		"testing/benchmark/src/tailwind/**",
	],
});
