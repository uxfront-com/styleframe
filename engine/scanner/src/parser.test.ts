import { describe, expect, it } from "vitest";

import { extractUtilityClasses, generateUtilityClassName, parseUtilityClass } from "./parser";

describe("parseUtilityClass", () => {
	describe("basic parsing", () => {
		it("should parse simple utility class", () => {
			const result = parseUtilityClass("_margin:sm");

			expect(result).toEqual({
				raw: "_margin:sm",
				name: "margin",
				value: "sm",
				modifiers: [],
				isArbitrary: false,
				arbitraryValue: undefined,
			});
		});

		it("should parse utility class with default value", () => {
			const result = parseUtilityClass("_hidden");

			expect(result).toEqual({
				raw: "_hidden",
				name: "hidden",
				value: "default",
				modifiers: [],
				isArbitrary: false,
				arbitraryValue: undefined,
			});
		});

		it("should parse utility class with dotted value", () => {
			const result = parseUtilityClass("_background:color.primary");

			expect(result).toEqual({
				raw: "_background:color.primary",
				name: "background",
				value: "color.primary",
				modifiers: [],
				isArbitrary: false,
				arbitraryValue: undefined,
			});
		});
	});

	describe("modifier parsing", () => {
		it("should parse utility class with single modifier", () => {
			const result = parseUtilityClass("_hover:margin:sm");

			expect(result).toEqual({
				raw: "_hover:margin:sm",
				name: "margin",
				value: "sm",
				modifiers: ["hover"],
				isArbitrary: false,
				arbitraryValue: undefined,
			});
		});

		it("should parse utility class with multiple modifiers", () => {
			const result = parseUtilityClass("_dark:hover:background:primary");

			expect(result).toEqual({
				raw: "_dark:hover:background:primary",
				name: "background",
				value: "primary",
				modifiers: ["dark", "hover"],
				isArbitrary: false,
				arbitraryValue: undefined,
			});
		});

		it("should parse utility class with three modifiers", () => {
			const result = parseUtilityClass("_sm:dark:focus:text:lg");

			expect(result).toEqual({
				raw: "_sm:dark:focus:text:lg",
				name: "text",
				value: "lg",
				modifiers: ["sm", "dark", "focus"],
				isArbitrary: false,
				arbitraryValue: undefined,
			});
		});
	});

	describe("arbitrary value parsing", () => {
		it("should parse utility class with arbitrary pixel value", () => {
			const result = parseUtilityClass("_margin:[16px]");

			expect(result).toEqual({
				raw: "_margin:[16px]",
				name: "margin",
				value: "[16px]",
				modifiers: [],
				isArbitrary: true,
				arbitraryValue: "16px",
			});
		});

		it("should parse utility class with arbitrary color value", () => {
			const result = parseUtilityClass("_background:[#1E3A8A]");

			expect(result).toEqual({
				raw: "_background:[#1E3A8A]",
				name: "background",
				value: "[#1E3A8A]",
				modifiers: [],
				isArbitrary: true,
				arbitraryValue: "#1E3A8A",
			});
		});

		it("should parse arbitrary value with modifier", () => {
			const result = parseUtilityClass("_hover:padding:[10px_20px]");

			expect(result).toEqual({
				raw: "_hover:padding:[10px_20px]",
				name: "padding",
				value: "[10px_20px]",
				modifiers: ["hover"],
				isArbitrary: true,
				arbitraryValue: "10px_20px",
			});
		});

		it("should handle arbitrary value with colon inside brackets", () => {
			const result = parseUtilityClass("_content:[url(https://example.com)]");

			expect(result).toEqual({
				raw: "_content:[url(https://example.com)]",
				name: "content",
				value: "[url(https://example.com)]",
				modifiers: [],
				isArbitrary: true,
				arbitraryValue: "url(https://example.com)",
			});
		});
	});

	describe("invalid inputs", () => {
		it("should return null for non-utility class", () => {
			expect(parseUtilityClass("margin-sm")).toBeNull();
		});

		it("should return null for empty string", () => {
			expect(parseUtilityClass("")).toBeNull();
		});

		it("should return null for just underscore", () => {
			expect(parseUtilityClass("_")).toBeNull();
		});

		it("should return null for class not starting with underscore", () => {
			expect(parseUtilityClass("btn-primary")).toBeNull();
		});

		it("should return null for unbalanced brackets", () => {
			expect(parseUtilityClass("_margin:[16px")).toBeNull();
			expect(parseUtilityClass("_margin:16px]")).toBeNull();
			expect(parseUtilityClass("_margin:[[16px]")).toBeNull();
		});
	});
});

describe("extractUtilityClasses", () => {
	it("should extract utility classes from HTML class attribute", () => {
		const content = '<div class="_margin:sm _padding:md">content</div>';
		const result = extractUtilityClasses(content);

		expect(result).toContain("_margin:sm");
		expect(result).toContain("_padding:md");
	});

	it("should extract utility classes with modifiers", () => {
		const content = '<div class="_hover:background:primary">content</div>';
		const result = extractUtilityClasses(content);

		expect(result).toContain("_hover:background:primary");
	});

	it("should extract arbitrary value utilities", () => {
		const content = '<div class="_margin:[16px]">content</div>';
		const result = extractUtilityClasses(content);

		expect(result).toContain("_margin:[16px]");
	});

	it("should deduplicate classes", () => {
		const content = '<div class="_margin:sm _margin:sm _margin:sm">content</div>';
		const result = extractUtilityClasses(content);

		expect(result).toHaveLength(1);
		expect(result).toContain("_margin:sm");
	});

	it("should not match non-utility classes", () => {
		const content = '<div class="btn-primary text-lg">content</div>';
		const result = extractUtilityClasses(content);

		expect(result).toHaveLength(0);
	});

	it("should extract from mixed content", () => {
		const content = '<div class="btn _margin:sm primary _padding:lg">content</div>';
		const result = extractUtilityClasses(content);

		expect(result).toContain("_margin:sm");
		expect(result).toContain("_padding:lg");
		expect(result).not.toContain("btn");
		expect(result).not.toContain("primary");
	});

	it("should extract using custom pattern", () => {
		const content = "sf-margin-sm sf-hover-padding-lg btn-primary";
		const pattern = /sf-[a-zA-Z][a-zA-Z0-9-]*/g;
		const result = extractUtilityClasses(content, pattern);

		expect(result).toContain("sf-margin-sm");
		expect(result).toContain("sf-hover-padding-lg");
		expect(result).not.toContain("btn-primary");
	});

	it("should deduplicate with custom pattern", () => {
		const content = "sf-margin-sm sf-margin-sm sf-padding-md";
		const pattern = /sf-[a-zA-Z][a-zA-Z0-9-]*/g;
		const result = extractUtilityClasses(content, pattern);

		expect(result).toHaveLength(2);
	});
});

describe("generateUtilityClassName", () => {
	it("should generate simple utility class name", () => {
		const result = generateUtilityClassName("margin", "sm");

		expect(result).toBe("_margin:sm");
	});

	it("should generate utility class name with default value", () => {
		const result = generateUtilityClassName("hidden", "default");

		expect(result).toBe("_hidden");
	});

	it("should generate utility class name with modifier", () => {
		const result = generateUtilityClassName("margin", "sm", ["hover"]);

		expect(result).toBe("_hover:margin:sm");
	});

	it("should generate utility class name with multiple modifiers", () => {
		const result = generateUtilityClassName("background", "primary", ["dark", "hover"]);

		expect(result).toBe("_dark:hover:background:primary");
	});

	it("should handle empty modifiers array", () => {
		const result = generateUtilityClassName("padding", "md", []);

		expect(result).toBe("_padding:md");
	});
});
