import { createRequire } from "node:module";
import path from "node:path";
import { build } from "esbuild";
import vue from "@vitejs/plugin-vue";
import styleframe from "@styleframe/plugin/vite";
import { defineConfig } from "vite";
import type { Plugin } from "vite";

const dirname =
	typeof __dirname !== "undefined" ? __dirname : import.meta.dirname;

const require = createRequire(import.meta.url);

function moduleKeys(specifier: string): Array<string> {
	const mod = require(specifier) as Record<string, unknown>;
	return Object.keys(mod).filter(
		(key) => key !== "default" && /^[A-Za-z_$][\w$]*$/.test(key),
	);
}

/**
 * Bundle React, ReactDOM and the automatic JSX runtime into a single IIFE that
 * publishes them on `globalThis.PGReactVendor`. The preview iframe runs this
 * once, then the compiled preview module reads React off the global through
 * thin shims (see `bundlePreview.ts`). Bundling everything together guarantees
 * a single React instance — externalizing `react` would emit a browser-invalid
 * `__require("react")` call instead.
 */
async function buildReactVendor(): Promise<string> {
	const result = await build({
		stdin: {
			contents: `
import React from "react";
import ReactDOMClient from "react-dom/client";
import JsxRuntime from "react/jsx-runtime";
globalThis.PGReactVendor = { React, ReactDOMClient, JsxRuntime };
`,
			resolveDir: dirname,
			loader: "js",
		},
		bundle: true,
		format: "iife",
		platform: "browser",
		minify: true,
		write: false,
		define: { "process.env.NODE_ENV": '"production"' },
	});
	return result.outputFiles[0]!.text;
}

function resolveRuntimeEsm(): string {
	const entry = require.resolve("@styleframe/runtime");
	return path.resolve(path.dirname(entry), "runtime.js");
}

/**
 * Exposes the self-contained vendor sources the preview pipeline bundles into
 * the iframe. Everything is delivered as plain string exports, so dev and build
 * behave identically and the preview stays fully offline.
 */
function vendorModules(): Plugin {
	const REACT_ID = "virtual:pg-react-vendor";
	const RUNTIME_ID = "virtual:pg-runtime-src";

	let reactVendor: Promise<string> | null = null;

	return {
		name: "pg-vendor-modules",
		enforce: "pre",
		resolveId(id) {
			if (id === REACT_ID || id === RUNTIME_ID) {
				return id;
			}
			return null;
		},
		async load(id) {
			if (id === REACT_ID) {
				if (!reactVendor) {
					reactVendor = buildReactVendor();
				}
				const payload = {
					iife: await reactVendor,
					reactKeys: moduleKeys("react"),
					reactDomClientKeys: moduleKeys("react-dom/client"),
					jsxRuntimeKeys: moduleKeys("react/jsx-runtime"),
				};
				return `export default ${JSON.stringify(payload)};`;
			}
			if (id === RUNTIME_ID) {
				const fs = await import("node:fs/promises");
				const source = await fs.readFile(resolveRuntimeEsm(), "utf8");
				return `export default ${JSON.stringify(source)};`;
			}
			return null;
		},
	};
}

export default defineConfig({
	plugins: [
		vendorModules(),
		styleframe({
			// The dogfooded shell keeps full `_property:value` class names so they
			// stay readable when inspecting the deployed playground.
			minify: false,
			scanner: {
				content: ["./src/**/*.{vue,ts,tsx}", "./index.html"],
			},
			resolve: {
				alias: {
					"@/*": path.resolve(dirname, "./src/*"),
					"@styleframe/theme": "../../theme/src/index.ts",
				},
			},
		}),
		vue(),
	],
	resolve: {
		alias: [
			{ find: /^@\//, replacement: `${path.resolve(dirname, "./src")}/` },
			{
				find: "@styleframe/theme",
				replacement: path.resolve(dirname, "../../theme/src/index.ts"),
			},
		],
	},
	optimizeDeps: {
		exclude: ["esbuild-wasm"],
	},
	server: {
		fs: {
			allow: [path.resolve(dirname, "../.."), dirname],
		},
	},
	test: {
		include: ["test/**/*.test.ts"],
	},
});
