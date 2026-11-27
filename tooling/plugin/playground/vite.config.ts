import path from "node:path";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";

import Styleframe from "../src/vite";

export default defineConfig({
	plugins: [
		Inspect(),
		vue(),
		Styleframe({
			content: ["index.html", "src/**/*.vue"],
			resolve: {
				alias: {
					"@styleframe/theme": "../../../theme/src/index.ts",
				},
			},
		}),
	],
	resolve: {
		alias: {
			"@styleframe/theme": path.resolve(__dirname, "../../../theme/src/index.ts"),
		},
	},
});
