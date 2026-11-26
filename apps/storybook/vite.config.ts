/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import styleframe from "@styleframe/plugin/vite";

// https://vite.dev/config/
import path from "node:path";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
const dirname =
	typeof __dirname !== "undefined" ? __dirname : import.meta.dirname;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
	plugins: [
		styleframe({
			scanner: {
				content: ["./stories/**/*.stories.{ts,tsx}", "./src/**/*.{vue,ts,tsx}"],
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
			{ find: /^@\//, replacement: path.resolve(dirname, "./src") + "/" },
			{
				find: "@styleframe/theme",
				replacement: path.resolve(dirname, "../../theme/src/index.ts"),
			},
		],
	},
	test: {
		projects: [
			{
				extends: true,
				plugins: [
					// The plugin will run tests for the stories defined in your Storybook config
					// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
					storybookTest({
						configDir: path.join(dirname, ".storybook"),
					}),
				],
				test: {
					name: "storybook",
					browser: {
						enabled: true,
						headless: true,
						provider: playwright({}),
						instances: [
							{
								browser: "chromium",
							},
						],
					},
					setupFiles: [".storybook/vitest.setup.ts"],
				},
			},
		],
	},
});
