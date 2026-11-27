import { beforeAll, describe, expect, it, vi } from "vitest";

import { initRealEsbuild } from "./helpers/esbuild";

vi.mock("@/pipeline/esbuild", () => ({
	getEsbuild: () => initRealEsbuild(),
}));

/**
 * Runs the shipped default project through the Styleframe stages of the
 * pipeline with the real esbuild, unmocked. Bundling the preview needs the
 * browser, so it stops after the transpile stage.
 */
describe("the default project", () => {
	beforeAll(async () => {
		await initRealEsbuild();
	});

	it("registers the Button sample's recipe and transpiles it", async () => {
		const { CONFIG_PATH, usePlaygroundState } = await import("@/state/playground");
		const { transformTs } = await import("@/pipeline/transformTs");
		const { evalStyleframeFile, evalUserConfig } = await import("@/pipeline/evalUserConfig");
		const { isStyleframeFile } = await import("@/pipeline/pipeline");
		const { scanAndRegisterUtilities } = await import("@/pipeline/scanAndRegisterUtilities");
		const { transpileStyleframe } = await import("@/pipeline/transpileStyleframe");

		const { files } = usePlaygroundState();
		const instance = await evalUserConfig(await transformTs(files[CONFIG_PATH] ?? ""));
		const styleframePaths = Object.keys(files)
			.filter((path) => path !== CONFIG_PATH && isStyleframeFile(path))
			.sort();
		for (const path of styleframePaths) {
			evalStyleframeFile(await transformTs(files[path] ?? ""), instance);
		}

		const button = instance.root.recipes.find((recipe) => recipe.name === "button");
		expect(button).toBeDefined();
		expect(Object.keys(button?.variants ?? {})).toEqual(["color", "variant", "size"]);

		const sources = Object.entries(files)
			.filter(([path]) => path !== CONFIG_PATH && !isStyleframeFile(path))
			.map(([filePath, content]) => ({ content, filePath }));
		scanAndRegisterUtilities(instance, sources);

		const { css, ts } = await transpileStyleframe(instance);
		expect(ts).toContain("button");
		expect(css).toContain(String.raw`._display\:inline-flex`);
		expect(css).toContain(String.raw`._background\:color\.primary`);
	});
});
