import type { Styleframe } from "@styleframe/core";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { generateConsumerModule } from "../../src/plugin/generate/consumer-module";
import type { PluginGlobalState } from "../../src/plugin/state";

vi.mock("@styleframe/transpiler", () => ({
	transpile: vi.fn(),
}));

import { transpile } from "@styleframe/transpiler";

describe("generateConsumerModule", () => {
	const createMockState = (globalInstance: Styleframe | null = null): PluginGlobalState => ({
		globalInstance,
		configFile: {
			path: "/path/to/config.ts",
			loadOrder: -1,
			exports: new Map(),
			lastModified: 0,
		},
		files: new Map(),
		loadingFiles: new Set(),
		initialized: false,
		classNameLookup: null,
	});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return comment when globalInstance is null", async () => {
		const state = createMockState(null);
		const result = await generateConsumerModule(state);

		expect(result).toBe("// Styleframe not initialized");
		expect(transpile).not.toHaveBeenCalled();
	});

	it("should call transpile with ts type when instance exists", async () => {
		const mockInstance = {} as Styleframe;
		const state = createMockState(mockInstance);

		vi.mocked(transpile).mockResolvedValue({
			files: [{ name: "index.ts", content: "export const button = {};" }],
		});

		const result = await generateConsumerModule(state);

		expect(transpile).toHaveBeenCalledWith(mockInstance, {
			type: "ts",
			minify: false,
			minifyOptions: undefined,
		});
		expect(result).toBe("export const button = {};");
	});

	it("should return empty string when index.ts not found in transpile result", async () => {
		const mockInstance = {} as Styleframe;
		const state = createMockState(mockInstance);

		vi.mocked(transpile).mockResolvedValue({
			files: [{ name: "other.ts", content: "some content" }],
		});

		const result = await generateConsumerModule(state);

		expect(result).toBe("");
	});

	it("should return empty string when transpile returns empty files", async () => {
		const mockInstance = {} as Styleframe;
		const state = createMockState(mockInstance);

		vi.mocked(transpile).mockResolvedValue({
			files: [],
		});

		const result = await generateConsumerModule(state);

		expect(result).toBe("");
	});
});
