import type { Variable } from "@styleframe/core";
import { styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { lineHeightValues } from "../values";
import { useLineHeightDesignTokens } from "./useLineHeightDesignTokens";

describe("useLineHeightDesignTokens", () => {
	it("should create all line height variables with correct names and values", () => {
		const s = styleframe();
		const {
			lineHeightTight,
			lineHeightSnug,
			lineHeightNormal,
			lineHeightRelaxed,
			lineHeightLoose,
			lineHeight,
		} = useLineHeightDesignTokens(s);

		expect(lineHeightTight).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "line-height.tight",
			value: 1.2,
		});

		expect(lineHeightSnug).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "line-height.snug",
			value: 1.35,
		});

		expect(lineHeightNormal).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "line-height.normal",
			value: 1.5,
		});

		expect(lineHeightRelaxed).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "line-height.relaxed",
			value: 1.65,
		});

		expect(lineHeightLoose).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "line-height.loose",
			value: 1.9,
		});

		expect(lineHeight).toEqual({
			type: "variable",
			id: expect.any(String),
			parentId: expect.any(String),
			name: "line-height",
			value: {
				type: "reference",
				name: "line-height.normal",
			},
		});
	});

	it("should add all line height variables to root", () => {
		const s = styleframe();
		useLineHeightDesignTokens(s);

		expect(s.root.variables).toHaveLength(6);
		expect(s.root.variables[0]?.name).toBe("line-height.tight");
		expect(s.root.variables[1]?.name).toBe("line-height.snug");
		expect(s.root.variables[2]?.name).toBe("line-height.normal");
		expect(s.root.variables[3]?.name).toBe("line-height.relaxed");
		expect(s.root.variables[4]?.name).toBe("line-height.loose");
		expect(s.root.variables[5]?.name).toBe("line-height");
	});

	it("should return all line height variables in an object", () => {
		const s = styleframe();
		const lineHeights = useLineHeightDesignTokens(s);

		expect(Object.keys(lineHeights)).toEqual([
			"lineHeightTight",
			"lineHeightSnug",
			"lineHeightNormal",
			"lineHeightRelaxed",
			"lineHeightLoose",
			"lineHeight",
		]);
	});

	it("should compile to correct CSS output using consumeCSS", () => {
		const s = styleframe();
		useLineHeightDesignTokens(s);

		const css = consumeCSS(s.root, s.options);

		expect(css).toBe(`:root {
	--line-height--tight: 1.2;
	--line-height--snug: 1.35;
	--line-height--normal: 1.5;
	--line-height--relaxed: 1.65;
	--line-height--loose: 1.9;
	--line-height: var(--line-height--normal);
}`);
	});

	it("should compile individual line height variable to correct CSS", () => {
		const s = styleframe();
		const { lineHeightRelaxed } = useLineHeightDesignTokens(s);

		const css = consumeCSS(lineHeightRelaxed, s.options);

		expect(css).toBe("--line-height--relaxed: 1.65;");
	});

	it("should not create duplicate variables when called multiple times", () => {
		const s = styleframe();
		const lineHeights1 = useLineHeightDesignTokens(s);
		const lineHeights2 = useLineHeightDesignTokens(s);

		// Should return the same variables (default: true behavior)
		expect(lineHeights1.lineHeightTight).toBe(lineHeights2.lineHeightTight);
		expect(lineHeights1.lineHeight).toBe(lineHeights2.lineHeight);
		expect(s.root.variables).toHaveLength(6);
	});

	it("should allow line height variables to be used as references", () => {
		const s = styleframe();
		const { lineHeightLoose } = useLineHeightDesignTokens(s);

		const customLineHeight = s.variable("custom-line-height", s.ref(lineHeightLoose));

		expect(customLineHeight.value).toEqual({
			type: "reference",
			name: "line-height.loose",
		});

		const css = consumeCSS(s.root, s.options);
		expect(css).toEqual(`:root {
	--line-height--tight: 1.2;
	--line-height--snug: 1.35;
	--line-height--normal: 1.5;
	--line-height--relaxed: 1.65;
	--line-height--loose: 1.9;
	--line-height: var(--line-height--normal);
	--custom-line-height: var(--line-height--loose);
}`);
	});

	it("should work with selector overrides", () => {
		const s = styleframe();
		const { lineHeightNormal } = useLineHeightDesignTokens(s);

		s.selector(".custom-line-height", ({ variable }) => {
			variable(lineHeightNormal, 1.8);
		});

		const css = consumeCSS(s.root, s.options);

		expect(css).toEqual(`:root {
	--line-height--tight: 1.2;
	--line-height--snug: 1.35;
	--line-height--normal: 1.5;
	--line-height--relaxed: 1.65;
	--line-height--loose: 1.9;
	--line-height: var(--line-height--normal);
}

.custom-line-height {
	--line-height--normal: 1.8;
}`);
	});

	describe("type safety", () => {
		it("should preserve exact line height variable names in return type", () => {
			const s = styleframe();
			const lineHeights = useLineHeightDesignTokens(s);

			// Type assertions to verify the generic types are preserved
			const tight: Variable<"line-height.tight"> = lineHeights.lineHeightTight;
			const snug: Variable<"line-height.snug"> = lineHeights.lineHeightSnug;
			const normal: Variable<"line-height.normal"> = lineHeights.lineHeightNormal;
			const relaxed: Variable<"line-height.relaxed"> = lineHeights.lineHeightRelaxed;
			const loose: Variable<"line-height.loose"> = lineHeights.lineHeightLoose;
			const lineHeight: Variable<"line-height"> = lineHeights.lineHeight;

			expect(tight.name).toBe("line-height.tight");
			expect(snug.name).toBe("line-height.snug");
			expect(normal.name).toBe("line-height.normal");
			expect(relaxed.name).toBe("line-height.relaxed");
			expect(loose.name).toBe("line-height.loose");
			expect(lineHeight.name).toBe("line-height");
		});

		it("should have correct numeric value types", () => {
			const s = styleframe();
			const lineHeights = useLineHeightDesignTokens(s);

			expect(typeof lineHeights.lineHeightTight.value).toBe("number");
			expect(typeof lineHeights.lineHeightSnug.value).toBe("number");
			expect(typeof lineHeights.lineHeightNormal.value).toBe("number");
			expect(typeof lineHeights.lineHeightRelaxed.value).toBe("number");
			expect(typeof lineHeights.lineHeightLoose.value).toBe("number");
			expect(typeof lineHeights.lineHeight.value).toBe("object");
		});
	});

	describe("default line height", () => {
		it("should create a default line height variable referencing normal by default", () => {
			const s = styleframe();
			const { lineHeight } = useLineHeightDesignTokens(s);

			expect(lineHeight).toEqual({
				type: "variable",
				id: expect.any(String),
				parentId: expect.any(String),
				name: "line-height",
				value: {
					type: "reference",
					name: "line-height.normal",
				},
			});
		});

		it("should allow customizing the default line height", () => {
			const s = styleframe();
			const { lineHeight } = useLineHeightDesignTokens(s, {
				...lineHeightValues,
				default: "@line-height.relaxed",
			});

			expect(lineHeight.value).toEqual({
				type: "reference",
				name: "line-height.relaxed",
			});
		});

		it("should compile default line height to CSS correctly", () => {
			const s = styleframe();
			useLineHeightDesignTokens(s, {
				...lineHeightValues,
				default: "@line-height.loose",
			});

			const css = consumeCSS(s.root, s.options);

			expect(css).toEqual(`:root {
	--line-height--tight: 1.2;
	--line-height--snug: 1.35;
	--line-height--normal: 1.5;
	--line-height--relaxed: 1.65;
	--line-height--loose: 1.9;
	--line-height: var(--line-height--loose);
}`);
		});

		it("should work with different default line heights", () => {
			const lineHeights = ["tight", "snug", "normal", "relaxed", "loose"];

			for (const lineHeightName of lineHeights) {
				const s = styleframe();
				const { lineHeight } = useLineHeightDesignTokens(s, {
					...lineHeightValues,
					default: `@line-height.${lineHeightName}`,
				});

				expect(lineHeight.value).toEqual({
					type: "reference",
					name: `line-height.${lineHeightName}`,
				});
			}
		});
	});

	describe("line height value relationships", () => {
		it("should have line heights in ascending order", () => {
			const s = styleframe();
			const {
				lineHeightTight,
				lineHeightSnug,
				lineHeightNormal,
				lineHeightRelaxed,
				lineHeightLoose,
			} = useLineHeightDesignTokens(s);

			expect(lineHeightTight.value).toBeLessThan(lineHeightSnug.value as number);
			expect(lineHeightSnug.value).toBeLessThan(lineHeightNormal.value as number);
			expect(lineHeightNormal.value).toBeLessThan(lineHeightRelaxed.value as number);
			expect(lineHeightRelaxed.value).toBeLessThan(lineHeightLoose.value as number);
		});

		it("should have loose as the largest line height", () => {
			const s = styleframe();
			const lineHeights = useLineHeightDesignTokens(s);
			const values = Object.values(lineHeights)
				.filter((v) => typeof v.value === "number")
				.map((v) => v.value as number);
			const maxValue = Math.max(...values);

			expect(lineHeights.lineHeightLoose.value).toBe(maxValue);
			expect(lineHeights.lineHeightLoose.value).toBe(1.9);
		});

		it("should have tight as the smallest line height", () => {
			const s = styleframe();
			const lineHeights = useLineHeightDesignTokens(s);
			const values = Object.values(lineHeights)
				.filter((v) => typeof v.value === "number")
				.map((v) => v.value as number);
			const minValue = Math.min(...values);

			expect(lineHeights.lineHeightTight.value).toBe(minValue);
			expect(lineHeights.lineHeightTight.value).toBe(1.2);
		});
	});

	describe("practical usage", () => {
		it("should work for creating typography with different line heights", () => {
			const s = styleframe();
			const { lineHeightTight, lineHeightRelaxed } = useLineHeightDesignTokens(s);

			s.selector("h1, h2, h3", ({ variable }) => {
				variable("line-height", s.ref(lineHeightTight));
			});

			s.selector("p, li", ({ variable }) => {
				variable("line-height", s.ref(lineHeightRelaxed));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--line-height--tight: 1.2;
	--line-height--snug: 1.35;
	--line-height--normal: 1.5;
	--line-height--relaxed: 1.65;
	--line-height--loose: 1.9;
	--line-height: var(--line-height--normal);
}

h1, h2, h3 {
	--line-height: var(--line-height--tight);
}

p, li {
	--line-height: var(--line-height--relaxed);
}`);
		});

		it("should work for responsive line height adjustments", () => {
			const s = styleframe();
			const { lineHeightNormal, lineHeightRelaxed } = useLineHeightDesignTokens(s);

			const bodyLineHeight = s.variable("body-line-height", s.ref(lineHeightNormal));

			s.selector("@media (min-width: 768px)", ({ variable }) => {
				variable(bodyLineHeight, s.ref(lineHeightRelaxed));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--line-height--tight: 1.2;
	--line-height--snug: 1.35;
	--line-height--normal: 1.5;
	--line-height--relaxed: 1.65;
	--line-height--loose: 1.9;
	--line-height: var(--line-height--normal);
	--body-line-height: var(--line-height--normal);
}

@media (min-width: 768px) {
	--body-line-height: var(--line-height--relaxed);
}`);
		});

		it("should work for theme-specific line height overrides", () => {
			const s = styleframe();
			const { lineHeightNormal, lineHeightLoose } = useLineHeightDesignTokens(s);

			s.selector(".theme-readable", ({ variable }) => {
				variable(lineHeightNormal, s.ref(lineHeightLoose));
			});

			const css = consumeCSS(s.root, s.options);
			expect(css).toEqual(`:root {
	--line-height--tight: 1.2;
	--line-height--snug: 1.35;
	--line-height--normal: 1.5;
	--line-height--relaxed: 1.65;
	--line-height--loose: 1.9;
	--line-height: var(--line-height--normal);
}

.theme-readable {
	--line-height--normal: var(--line-height--loose);
}`);
		});
	});
});
