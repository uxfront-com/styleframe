import { copyFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

import { defineConfig } from "tsdown";

const distDir = resolve(new URL(".", import.meta.url).pathname, "dist");

/**
 * tsdown emits `<name>.d.ts` (ESM) and `<name>.d.cts` (CJS) per entry. Copy
 * each `.d.ts` to a `.d.mts` so the `import` condition resolves an explicit
 * ESM declaration (paired with tsdown's `.d.cts` for `require`), preventing
 * the single declaration from masquerading as ESM for CJS consumers.
 *
 * Attached to every entry's `build:done`; each fire is idempotent and at
 * minimum covers its own entry's declarations.
 */
async function emitEsmDeclarations() {
	const entries = await readdir(distDir, {
		recursive: true,
		withFileTypes: true,
	});
	await Promise.all(
		entries
			.filter((entry) => entry.isFile() && entry.name.endsWith(".d.ts"))
			.map((entry) => {
				const dtsPath = resolve(entry.parentPath ?? entry.path, entry.name);
				return copyFile(dtsPath, dtsPath.replace(/\.d\.ts$/, ".d.mts"));
			}),
	);
}

const hooks = { "build:done": emitEsmDeclarations };

// tsdown 0.22+ defaults output to `.mjs`/`.d.mts` (notably for `platform: "node"`
// entries); keep `.js`/`.d.ts` so the package.json `bin`/`exports`/`types` paths resolve.
export default defineConfig([
	{
		entry: ["./src/index.ts"],
		platform: "neutral",
		dts: true,
		format: ["esm", "cjs"],
		fixedExtension: false,
		hooks,
	},
	{
		entry: ["./src/cli.ts"],
		platform: "node",
		dts: true,
		format: ["esm", "cjs"],
		fixedExtension: false,
		hooks,
	},
	{
		entry: ["./src/loader.ts"],
		platform: "node",
		dts: true,
		format: ["esm", "cjs"],
		fixedExtension: false,
		hooks,
	},
	{
		entry: ["./src/transpiler.ts"],
		platform: "neutral",
		dts: true,
		format: ["esm", "cjs"],
		fixedExtension: false,
		hooks,
	},
	{
		entry: ["./src/plugin/*.ts"],
		outDir: "./dist/plugin",
		platform: "node",
		dts: true,
		format: ["esm", "cjs"],
		fixedExtension: false,
		hooks,
	},
]);
