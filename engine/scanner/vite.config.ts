import { resolve } from "node:path";

import { createViteConfig } from "@styleframe/config-vite";

const __dirname = new URL(".", import.meta.url).pathname;

export default createViteConfig("index", __dirname, {
	build: {
		lib: {
			entry: {
				index: resolve(__dirname, "src/index.ts"),
				node: resolve(__dirname, "src/node.ts"),
			},
			formats: ["es", "cjs"],
			fileName: (format: string, entryName: string) =>
				`${entryName}.${format === "es" ? "js" : "cjs"}`,
		},
		rolldownOptions: {
			external: [
				"node:fs/promises",
				"@styleframe/core",
				"@styleframe/license",
				"fast-glob",
				"importree",
			],
		},
	},
});
