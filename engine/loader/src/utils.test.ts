import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { directoryExists } from "./utils";

describe("directoryExists", () => {
	let dir: string;

	beforeEach(async () => {
		dir = await mkdtemp(path.join(tmpdir(), "sf-loader-utils-"));
	});

	afterEach(async () => {
		await rm(dir, { recursive: true, force: true });
	});

	test("returns true for an existing directory", async () => {
		expect(await directoryExists(dir)).toBe(true);
	});

	test("returns false for a path that does not exist", async () => {
		expect(await directoryExists(path.join(dir, "missing"))).toBe(false);
	});

	test("returns false when the path is a file, not a directory", async () => {
		const filePath = path.join(dir, "file.txt");
		await writeFile(filePath, "content");
		expect(await directoryExists(filePath)).toBe(false);
	});
});
