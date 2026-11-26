import { mkdtemp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { styleframe } from "@styleframe/core";
import type { Jiti } from "jiti";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { createLoader, loadExtensionModule, loadModule, trackExports } from "./module";

const packageDir = fileURLToPath(new URL(".", import.meta.url));

// Fixtures must live inside the package tree so jiti resolves the
// "@styleframe/core" workspace import from node_modules.
let fixtureDir: string;

beforeEach(async () => {
	fixtureDir = await mkdtemp(path.join(packageDir, "__fixtures-"));
});

afterEach(async () => {
	await rm(fixtureDir, { recursive: true, force: true });
});

async function writeFixture(name: string, content: string): Promise<string> {
	const filePath = path.join(fixtureDir, name);
	await writeFile(filePath, content);
	return filePath;
}

describe("trackExports", () => {
	test("tracks recipes and selectors and sets _exportName", () => {
		const s = styleframe();
		const buttonRecipe = s.recipe({ name: "button" });
		const cardSelector = s.selector(".card", {});

		const module: Record<string, unknown> = {
			buttonRecipe,
			cardSelector,
			someNumber: 42,
			default: s,
		};

		const exports = trackExports(module);

		expect(exports.size).toBe(2);
		expect(exports.get("buttonRecipe")).toEqual({
			name: "buttonRecipe",
			type: "recipe",
		});
		expect(exports.get("cardSelector")).toEqual({
			name: "cardSelector",
			type: "selector",
		});
		expect(buttonRecipe._exportName).toBe("buttonRecipe");
		expect(cardSelector._exportName).toBe("cardSelector");
	});

	test("skips the default export even when it is a recipe", () => {
		const s = styleframe();
		const module: Record<string, unknown> = {
			default: s.recipe({ name: "ignored" }),
		};

		expect(trackExports(module).size).toBe(0);
	});

	test("ignores exports that are neither recipes nor selectors", () => {
		expect(trackExports({ foo: 1, bar: "two", baz: {} }).size).toBe(0);
	});
});

describe("createLoader", () => {
	test("returns an importable jiti instance", () => {
		const jiti = createLoader(packageDir);
		expect(typeof jiti.import).toBe("function");
	});
});

describe("loadModule", () => {
	test("loads a module with a valid default export and tracks exports", async () => {
		const filePath = await writeFixture(
			"config.ts",
			`import { styleframe } from "@styleframe/core";
			const s = styleframe();
			export const cardSelector = s.selector(".card", {});
			export const buttonRecipe = s.recipe({ name: "button" });
			export default s;`,
		);

		const { instance, exports, module } = await loadModule(filePath);

		expect(instance).toBeDefined();
		expect(instance.id).toEqual(expect.any(String));
		expect(module.default).toBe(instance);
		expect(exports.get("cardSelector")?.type).toBe("selector");
		expect(exports.get("buttonRecipe")?.type).toBe("recipe");
	});

	test("throws when the default export is missing", async () => {
		// A module namespace with named exports but no default. Driven through a
		// stub jiti because the loader's real jiti interops a default in.
		const jiti = {
			import: async () => ({ value: 1 }),
		} as unknown as Jiti;

		await expect(loadModule(path.join(fixtureDir, "no-default.ts"), { jiti })).rejects.toThrow(
			/Missing default export/,
		);
	});

	test("throws when the default export is not a Styleframe instance", async () => {
		const filePath = await writeFixture(
			"invalid-default.ts",
			`export default { not: "styleframe" };`,
		);

		await expect(loadModule(filePath)).rejects.toThrow(/Invalid default export/);
	});

	test("skips validation when validateInstance is false", async () => {
		const filePath = await writeFixture(
			"invalid-default.ts",
			`export default { not: "styleframe" };`,
		);

		const { instance } = await loadModule(filePath, {
			validateInstance: false,
		});

		expect(instance).toEqual({ not: "styleframe" });
	});
});

describe("loadExtensionModule", () => {
	test("loads a module without a default export and tracks exports", async () => {
		const filePath = await writeFixture(
			"extension.ts",
			`import { styleframe } from "@styleframe/core";
			const s = styleframe();
			export const cardSelector = s.selector(".card", {});`,
		);

		const { module, exports } = await loadExtensionModule(filePath);

		expect(module.cardSelector).toBeDefined();
		expect(exports.get("cardSelector")?.type).toBe("selector");
	});
});
