import { copyFile, readdir, unlink } from "node:fs/promises";
import { resolve } from "node:path";

import dts from "unplugin-dts/vite";
import { defineConfig } from "vite";
import { configDefaults as vitestConfig } from "vitest/config";

/**
 * @typedef {import('vite').UserConfig} UserConfig
 */

/**
 * Post-process the emitted declarations. Two jobs, both keyed off a single
 * recursive walk of `outDir`:
 *
 * 1. Drop the build-config declarations. `vite.config.ts`/`tsdown.config.ts`
 *    stay in the dts program (see the `dts()` note below — they anchor
 *    `@types/node`, so `Buffer`/`process`/`node:*` resolve program-wide and the
 *    declaration pass stays free of non-fatal TS2591), but they are not public.
 *    Delete their emitted `*.config.d.ts` (and `.d.ts.map`) here so the
 *    published `dist/` — every package ships `files: ["dist"]` — carries only
 *    the consumer-facing set.
 * 2. Emit `.d.mts`/`.d.cts` copies of every remaining `.d.ts` so that `import`
 *    (ESM) and `require` (CJS) consumers each resolve a correctly flavored
 *    declaration instead of a single `.d.ts` that — under `"type": "module"` —
 *    masquerades as ESM for CJS consumers (attw "FalseESM"). Per-file
 *    declarations use relative `export *` re-exports, and the sibling
 *    `.d.mts`/`.d.cts` copies exist alongside them, so each flavor resolves its
 *    own siblings — the copy is safe.
 *
 * @returns {import('vite').Plugin}
 */
function dualDeclarations() {
	let outDir;
	const isConfigDeclaration = (name) => /\.config\.d\.ts(\.map)?$/.test(name);
	return {
		name: "styleframe:dual-declarations",
		apply: "build",
		configResolved(config) {
			outDir = resolve(config.root, config.build.outDir);
		},
		async closeBundle() {
			const entries = await readdir(outDir, {
				recursive: true,
				withFileTypes: true,
			});
			const files = entries
				.filter((entry) => entry.isFile())
				.map((entry) => ({
					name: entry.name,
					path: resolve(entry.parentPath ?? entry.path, entry.name),
				}));

			await Promise.all(
				files.filter((file) => isConfigDeclaration(file.name)).map((file) => unlink(file.path)),
			);

			await Promise.all(
				files
					.filter((file) => file.name.endsWith(".d.ts") && !isConfigDeclaration(file.name))
					.map((file) =>
						Promise.all([
							copyFile(file.path, file.path.replace(/\.d\.ts$/, ".d.mts")),
							copyFile(file.path, file.path.replace(/\.d\.ts$/, ".d.cts")),
						]),
					),
			);
		},
	};
}
export const createViteConfig = (name, cwd, options = {}) =>
	defineConfig({
		...options,
		plugins: [
			// Emit per-file `.d.ts` via unplugin-dts (Volar-based). We do NOT
			// roll declarations up through @microsoft/api-extractor: its
			// rollup relies on the TypeScript JavaScript Compiler API, which
			// TypeScript 7 (the native compiler) no longer ships, so the
			// extractor throws "Unable to follow symbol". The entry
			// `index.d.ts` becomes a re-export barrel over its siblings; the
			// resolved public type surface is unchanged, only the on-disk
			// layout differs from the old single-file rollup.
			//
			// Per-file emission follows the tsconfig `include`, which carries
			// `*.test.ts`, the `*.config.ts` build files, and (in the CLI) the
			// `playground/**` scaffolding templates. None are reachable through
			// any package's `exports` entry, but every package ships
			// `files: ["dist"]` wholesale — so without pruning them, their
			// declarations balloon the published tarball. api-extractor dropped
			// them for free by following only the entry; per-file emission must
			// prune them.
			//
			// Tests and the CLI `playground/**` templates are excluded from the
			// program outright. The `*.config.ts` build files are NOT — they are
			// the only files that import the toolchain (`vite`, `@styleframe/*`),
			// so they anchor `@types/node` into the program; drop them from the
			// program and `Buffer`/`process`/`node:*` lose their types and the
			// declaration pass emits non-fatal TS2591. Keep them in, then delete
			// their emitted `*.config.d.ts` in `dualDeclarations()` below.
			dts({
				entryRoot: resolve(cwd, "src"),
				exclude: [
					"**/node_modules/**",
					"**/*.test.ts",
					"**/*.test.tsx",
					"**/__tests__/**",
					"**/playground/**",
				],
			}),
			dualDeclarations(),
			...(options.plugins ?? []),
		],
		build: {
			...options.build,
			lib: {
				entry: resolve(cwd, "src/index.ts"),
				name,
				fileName: name,
				...options.build?.lib,
			},
		},
		test: {
			globals: true,
			include: [resolve(cwd, "src/**/*.test.{ts,tsx}")],
			exclude: vitestConfig.exclude,
			reporters: ["verbose"],
			coverage: {
				provider: "v8",
				exclude: [
					...vitestConfig.coverage.exclude,
					"**/*.styleframe.ts",
					"**/styleframe.config.ts",
				],
			},
		},
	});
