import path from "node:path";

import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __dirname = import.meta.dirname;

// Figma plugin requires two separate builds:
// 1. code.js - The sandbox code (IIFE, no DOM access)
// 2. ui.html - The UI (HTML with inline CSS/JS)

export default defineConfig(({ mode }) => {
	if (mode === "code") {
		// Build the plugin sandbox code
		// Figma's sandbox has limited ES support, so we target ES2017
		return {
			oxc: {
				target: "es2017",
			},
			build: {
				target: "es2017",
				outDir: "dist/plugin",
				emptyDirOnBuild: false,
				lib: {
					entry: path.resolve(__dirname, "src/plugin/code.ts"),
					name: "code",
					formats: ["iife"],
					fileName: () => "code.js",
				},
				minify: false,
				sourcemap: false,
			},
		};
	}

	// Build the UI (default mode)
	return {
		plugins: [viteSingleFile()],
		root: path.resolve(__dirname, "src/plugin/ui"),
		build: {
			outDir: path.resolve(__dirname, "dist/plugin"),
			emptyDirOnBuild: false,
			rolldownOptions: {
				input: path.resolve(__dirname, "src/plugin/ui/ui.html"),
				output: {
					entryFileNames: "ui.js",
					assetFileNames: "[name].[ext]",
				},
			},
			minify: false,
			sourcemap: false,
		},
	};
});
