import vue from "@uxfront/oxlint-config/vue";
import { defineConfig } from "oxlint";

export default defineConfig({
	extends: [vue],
	// oxlint reads `env` and `ignorePatterns` from the root config only, so they're restated here.
	env: vue.env,
	ignorePatterns: [
		...vue.ignorePatterns,
		// Tailwind's own output, copied in to measure against, as in `.oxfmtrc.json`.
		"testing/benchmark/src/tailwind/**",
	],
});
