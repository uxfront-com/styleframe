import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { styleframe } from "@styleframe/core";
import { validateInstanceLicense } from "@styleframe/license";
import { transpile } from "@styleframe/transpiler";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { build } from "./build";

vi.mock("@styleframe/transpiler", () => ({ transpile: vi.fn() }));
vi.mock("@styleframe/license", () => ({
	validateInstanceLicense: vi.fn(),
	getLicenseKeyFromEnv: vi.fn(() => ""),
}));

const mockedTranspile = vi.mocked(transpile);
const mockedValidate = vi.mocked(validateInstanceLicense);

let outputDir: string;

beforeEach(async () => {
	vi.clearAllMocks();
	mockedValidate.mockResolvedValue(undefined as never);
	mockedTranspile.mockResolvedValue({
		files: [
			{ name: "index.css", content: ".a{color:red}" },
			{ name: "nested/deep.css", content: ".b{color:blue}" },
		],
	} as never);
	outputDir = await mkdtemp(path.join(tmpdir(), "sf-loader-build-"));
});

afterEach(async () => {
	await rm(outputDir, { recursive: true, force: true });
});

describe("build", () => {
	test("validates the license then writes transpiled files, creating nested dirs", async () => {
		const instance = styleframe();

		await build(instance, { outputDir });

		expect(mockedValidate).toHaveBeenCalledOnce();
		expect(mockedTranspile).toHaveBeenCalledWith(instance, undefined);

		expect(await readFile(path.join(outputDir, "index.css"), "utf8")).toBe(".a{color:red}");
		expect(await readFile(path.join(outputDir, "nested/deep.css"), "utf8")).toBe(".b{color:blue}");
	});

	test("removes existing output when clean is true (default)", async () => {
		const stalePath = path.join(outputDir, "stale.css");
		await writeFile(stalePath, "stale");

		await build(styleframe(), { outputDir });

		expect(existsSync(stalePath)).toBe(false);
		expect(existsSync(path.join(outputDir, "index.css"))).toBe(true);
	});

	test("keeps existing output when clean is false", async () => {
		const stalePath = path.join(outputDir, "stale.css");
		await writeFile(stalePath, "stale");

		await build(styleframe(), { outputDir, clean: false });

		expect(existsSync(stalePath)).toBe(true);
		expect(existsSync(path.join(outputDir, "index.css"))).toBe(true);
	});

	test("forwards transpiler options", async () => {
		const transpiler = { minify: true };
		await build(styleframe(), { outputDir, transpiler });

		expect(mockedTranspile).toHaveBeenCalledWith(expect.anything(), transpiler);
	});

	test("does not transpile or write when license validation fails", async () => {
		mockedValidate.mockRejectedValueOnce(new Error("invalid license"));

		await expect(build(styleframe(), { outputDir })).rejects.toThrow(/invalid license/);
		expect(mockedTranspile).not.toHaveBeenCalled();
	});
});
