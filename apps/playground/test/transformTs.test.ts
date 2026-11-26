import { beforeAll, describe, expect, it, vi } from "vitest";

import { initRealEsbuild } from "./helpers/esbuild";

vi.mock("@/pipeline/esbuild", () => ({
	getEsbuild: () => initRealEsbuild(),
}));

describe("transformTs", () => {
	beforeAll(async () => {
		await initRealEsbuild();
	});

	it("strips TypeScript type annotations", async () => {
		const { transformTs } = await import("@/pipeline/transformTs");
		const result = await transformTs("const x: number = 1;\n");
		expect(result).not.toContain(": number");
		expect(result).toContain("const x = 1");
	});

	it("preserves ESM import syntax", async () => {
		const { transformTs } = await import("@/pipeline/transformTs");
		const result = await transformTs('import { foo } from "./bar";\nexport const bar = foo;\n');
		expect(result).toContain('from "./bar"');
		expect(result).toContain("export");
	});

	it("preserves async/await at es2022 target", async () => {
		const { transformTs } = await import("@/pipeline/transformTs");
		const result = await transformTs("export async function run() { await Promise.resolve(); }\n");
		expect(result).toContain("async function run");
		expect(result).toContain("await Promise.resolve");
	});

	it("rejects when the source has a syntax error", async () => {
		const { transformTs } = await import("@/pipeline/transformTs");
		await expect(transformTs("const x = ;\n")).rejects.toThrow();
	});
});
