import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import {
	useContainerNameUtility,
	useContainerTypeUtility,
} from "./useContainerUtility";

describe("useContainerTypeUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useContainerTypeUtility(s, { size: "size", "inline-size": "inline-size" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "container-type",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useContainerTypeUtility(s, { "inline-size": "inline-size" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ containerType: "inline-size" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useContainerTypeUtility(s, { "inline-size": "inline-size" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._container-type\:inline-size {`);
		expect(css).toContain("container-type: inline-size;");
	});

	it("should register the default container-type values", () => {
		const s = styleframe();
		useContainerTypeUtility(s);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "container-type",
		);
		expect(utilities).toHaveLength(3);
	});
});

describe("useContainerNameUtility", () => {
	it("should set correct declarations", () => {
		const s = styleframe();
		useContainerNameUtility(s, { sidebar: "sidebar" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ containerName: "sidebar" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useContainerNameUtility(s, { sidebar: "sidebar" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._container-name\:sidebar {`);
		expect(css).toContain("container-name: sidebar;");
	});

	it("should ship without defaults", () => {
		const s = styleframe();
		useContainerNameUtility(s);

		expect(s.root.children).toHaveLength(0);
	});
});

describe("container query units", () => {
	it("should accept cqi/cqb/cqw/cqh as raw token values", () => {
		const s = styleframe();
		const createWidth = s.utility("width", ({ value }) => ({ width: value }));
		createWidth({
			"50cqi": "50cqi",
			"50cqb": "50cqb",
			"50cqw": "50cqw",
			"50cqh": "50cqh",
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("width: 50cqi;");
		expect(css).toContain("width: 50cqb;");
		expect(css).toContain("width: 50cqw;");
		expect(css).toContain("width: 50cqh;");
	});
});
