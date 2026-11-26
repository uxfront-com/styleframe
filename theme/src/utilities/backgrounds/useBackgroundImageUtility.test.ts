import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import {
	useBackgroundImageUtility,
	useGradientFromUtility,
	useGradientViaUtility,
	useGradientToUtility,
} from "./useBackgroundImageUtility";

describe("useBackgroundImageUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useBackgroundImageUtility(s, {
			none: "none",
			"gradient-to-t": "linear-gradient(to top, var(--background-image-gradient-stops))",
		});

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "background-image",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useBackgroundImageUtility(s, { none: "none" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({ backgroundImage: "none" });
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useBackgroundImageUtility(s, {
			"gradient-to-r": "linear-gradient(to right, var(--background-image-gradient-stops))",
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-image\:gradient-to-r {`);
		expect(css).toContain(
			"background-image: linear-gradient(to right, var(--background-image-gradient-stops));",
		);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useBackgroundImageUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useGradientFromUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useGradientFromUtility(s, { red: "red", blue: "blue" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "gradient-from",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useGradientFromUtility(s, { red: "red" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--background-image-gradient-from": "red var(--background-image-gradient-from-position)",
			"--background-image-gradient-to": "transparent var(--background-image-gradient-to-position)",
			"--background-image-gradient-stops":
				"var(--background-image-gradient-from), var(--background-image-gradient-to)",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGradientFromUtility(s, { blue: "blue" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._gradient-from\:blue {`);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useGradientFromUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useGradientViaUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useGradientViaUtility(s, { red: "red", blue: "blue" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "gradient-via",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useGradientViaUtility(s, { green: "green" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--background-image-gradient-to": "transparent var(--background-image-gradient-to-position)",
			"--background-image-gradient-stops":
				"var(--background-image-gradient-from), green var(--background-image-gradient-via-position), var(--background-image-gradient-to)",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGradientViaUtility(s, { yellow: "yellow" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._gradient-via\:yellow {`);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useGradientViaUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});

describe("useGradientToUtility", () => {
	it("should create utility instances with provided values", () => {
		const s = styleframe();
		useGradientToUtility(s, { red: "red", blue: "blue" });

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "gradient-to",
		);
		expect(utilities).toHaveLength(2);
	});

	it("should set correct declarations", () => {
		const s = styleframe();
		useGradientToUtility(s, { purple: "purple" });

		const utility = s.root.children[0] as Utility;
		expect(utility.declarations).toEqual({
			"--background-image-gradient-to": "purple var(--background-image-gradient-to-position)",
		});
	});

	it("should compile to correct CSS output", () => {
		const s = styleframe();
		useGradientToUtility(s, { orange: "orange" });

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._gradient-to\:orange {`);
	});

	it("should handle empty values object", () => {
		const s = styleframe();
		useGradientToUtility(s, {});

		expect(s.root.children).toHaveLength(0);
	});
});
