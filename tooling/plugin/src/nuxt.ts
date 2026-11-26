import path from "node:path";

import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from "@nuxt/kit";
import type { NuxtModule } from "@nuxt/schema";
import { DTS_TYPES_FILENAME } from "@styleframe/transpiler";

import type { Options } from "./plugin";
import { DEFAULT_DTS_OUT_DIR, VIRTUAL_TS_MODULE_ID } from "./plugin/constants";
import vite from "./vite";
import webpack from "./webpack";

export interface ModuleOptions extends Options {}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: "styleframe",
		configKey: "styleframe",
	},
	defaults: {},
	setup(options, nuxt) {
		if (nuxt.options.builder === "@nuxt/webpack-builder") {
			addWebpackPlugin(webpack(options));
		} else {
			addVitePlugin(vite(options));
		}

		// Nuxt manages its own (multi-file) tsconfig, so register the
		// `virtual:styleframe` mapping directly into Nuxt's generated types via
		// the `prepare:types` hook — it merges with Nuxt's own `paths` aliases
		// instead of fighting them.
		if (options.dts?.enabled === false) {
			return;
		}

		const outDir = options.dts?.outDir ?? DEFAULT_DTS_OUT_DIR;
		const typesPath = path.resolve(nuxt.options.rootDir, outDir, DTS_TYPES_FILENAME);

		nuxt.hook("prepare:types", ({ tsConfig }) => {
			tsConfig.compilerOptions ??= {};
			tsConfig.compilerOptions.paths ??= {};
			tsConfig.compilerOptions.paths[VIRTUAL_TS_MODULE_ID] = [typesPath];
		});
	},
}) satisfies NuxtModule<ModuleOptions>;
