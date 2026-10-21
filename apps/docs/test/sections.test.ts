import { describe, expect, it } from "vitest";
import {
	DOCS_FOLDERS,
	docsFolderPrefix,
	docsSourceStem,
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

describe("docsSourceStem", () => {
	it.each([
		[
			"docs/getting-started/01.introduction",
			"docs/01.getting-started/01.introduction",
		],
		["docs/getting-started/tooling/01.cli", "docs/08.tooling/01.cli"],
		["docs/api/11.recipes/00.index", "docs/02.api/11.recipes/00.index"],
		[
			"docs/theme/components/02.actions/00.button",
			"docs/05.components/02.actions/00.button",
		],
	])("finds the file of %s", (stem, file) => {
		expect(docsSourceStem(stem)).toBe(file);
	});
});
