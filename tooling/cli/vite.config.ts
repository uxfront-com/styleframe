import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createViteConfig } from "@styleframe/config-vite";
import { VitePluginNode } from "vite-plugin-node";

const __dirname = new URL(".", import.meta.url).pathname;

function readPackageJson(packageDir: string) {
	return JSON.parse(readFileSync(resolve(__dirname, packageDir, "package.json"), "utf8"));
}

function getMajorVersionRange(packageDir: string): string {
	const major = readPackageJson(packageDir).version.split(".")[0];
	return `^${major}.0.0`;
}

const cliPackageJson = readPackageJson(".");

export default createViteConfig("cli", __dirname, {
	define: {
		__CLI_VERSION__: JSON.stringify(cliPackageJson.version),
		__CLI_DESCRIPTION__: JSON.stringify(cliPackageJson.description),
		__INIT_VERSIONS__: JSON.stringify({
			devDependencies: {
				styleframe: getMajorVersionRange("../../engine/styleframe"),
				"@styleframe/cli": getMajorVersionRange("."),
				"@styleframe/core": getMajorVersionRange("../../engine/core"),
				"@styleframe/loader": getMajorVersionRange("../../engine/loader"),
				"@styleframe/plugin": getMajorVersionRange("../plugin"),
				"@styleframe/theme": getMajorVersionRange("../../theme"),
				"@styleframe/transpiler": getMajorVersionRange("../../engine/transpiler"),
			},
			dependencies: {
				"@styleframe/runtime": getMajorVersionRange("../../engine/runtime"),
			},
		}),
	},
	plugins: [
		VitePluginNode({
			appPath: "./src/index.ts",
			adapter: "express",
		}),
	],
	build: {
		lib: {
			fileName: "index",
			formats: ["es", "cjs"],
		},
		rolldownOptions: {
			external: [
				"node:fs",
				"node:fs/promises",
				"node:path",
				"node:url",
				"@styleframe/dtcg",
				"@styleframe/figma",
				"@styleframe/loader",
				"citty",
				"consola",
				"magicast",
				"jiti",
			],
		},
	},
});
