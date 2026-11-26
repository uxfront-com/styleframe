import path from "node:path";

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: 0,
	workers: 1,
	reporter: [["list"], ["html", { outputFolder: "results/playwright-report", open: "never" }]],
	outputDir: "results/playwright-artifacts",
	snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",
	use: {
		baseURL: `file://${path.join(import.meta.dirname, "results")}`,
		trace: "retain-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 1280, height: 800 },
			},
		},
	],
});
