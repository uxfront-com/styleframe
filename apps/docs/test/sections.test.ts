import { describe, expect, it } from "vitest";
import {
	DOCS_FOLDERS,
	docsFolderPrefix,
	docsSourceStem,
	docsStem,
} from "../app/constants/sections";

describe("docsFolderPrefix", () => {
	it("mounts each folder under its section, as main's URLs have it", () => {
		expect(
			Object.fromEntries(
				DOCS_FOLDERS.map((folder) => [folder, docsFolderPrefix(folder)]),
			),
		).toEqual({
			"01.getting-started": "/docs/getting-started",
			"08.tooling": "/docs/getting-started/tooling",
			"09.integrations": "/docs/getting-started/integrations",
			"10.migration": "/docs/getting-started/migration",
			"02.api": "/docs/api",
			"03.design-tokens": "/docs/theme/design-tokens",
			"04.elements": "/docs/theme/elements",
			"05.components": "/docs/theme/components",
			"06.utilities": "/docs/theme/utilities",
			"07.modifiers": "/docs/theme/modifiers",
		});
	});

	it("has no prefix for a folder outside the sections", () => {
		expect(docsFolderPrefix("11.unknown")).toBeUndefined();
	});
});

describe("docsStem", () => {
	it.each([
		[
			"docs/01.getting-started/01.introduction",
			"docs/1.getting-started/01.getting-started/01.introduction",
		],
		["docs/08.tooling/01.cli", "docs/1.getting-started/08.tooling/01.cli"],
		[
			"docs/02.api/11.recipes/00.index",
			"docs/2.api/02.api/11.recipes/00.index",
		],
		["docs/05.components/02.actions", "docs/3.theme/05.components/02.actions"],
	])("puts the section in front of %s", (file, stem) => {
		expect(docsStem(file)).toBe(stem);
		expect(docsSourceStem(stem)).toBe(file);
	});

	it("orders every section's pages together, in file order", () => {
		const files = [
			"docs/02.api/00.index",
			"docs/10.migration/01.tailwind",
			"docs/07.modifiers/00.index",
			"docs/01.getting-started/07.licensing",
			"docs/08.tooling/01.cli",
			"docs/06.utilities/00.index",
		];
		expect(files.map(docsStem).sort().map(docsSourceStem)).toEqual([
			"docs/01.getting-started/07.licensing",
			"docs/08.tooling/01.cli",
			"docs/10.migration/01.tailwind",
			"docs/02.api/00.index",
			"docs/06.utilities/00.index",
			"docs/07.modifiers/00.index",
		]);
	});

	it("leaves paths outside the docs sections as they are", () => {
		expect(docsStem("changelog/3.9.0")).toBe("changelog/3.9.0");
	});
});
