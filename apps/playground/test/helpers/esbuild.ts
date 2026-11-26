import { createRequire } from "node:module";

import type * as esbuildTypes from "esbuild-wasm";

const require = createRequire(import.meta.url);

let initPromise: Promise<typeof esbuildTypes> | null = null;

export function initRealEsbuild(): Promise<typeof esbuildTypes> {
	if (!initPromise) {
		const esbuild = require("esbuild-wasm/lib/main.js") as typeof esbuildTypes;
		initPromise = Promise.resolve(esbuild);
	}
	return initPromise;
}
