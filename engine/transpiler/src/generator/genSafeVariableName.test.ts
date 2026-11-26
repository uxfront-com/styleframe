import { describe, expect, it } from "vitest";
import { genSafeVariableName } from "./genSafeVariableName";

describe("genSafeVariableName", () => {
	it("should add -- prefix to a simple name", () => {
		const result = genSafeVariableName("primary-color");
		expect(result).toBe("--primary-color");
	});

	it("should preserve existing -- prefix", () => {
		const result = genSafeVariableName("--secondary-color");
		expect(result).toBe("--secondary-color");
	});

	it("should add -- prefix to camelCase names", () => {
		const result = genSafeVariableName("primaryColor");
		expect(result).toBe("--primaryColor");
	});

	it("should add -- prefix to snake_case names", () => {
		const result = genSafeVariableName("primary_color");
		expect(result).toBe("--primary_color");
	});

	it("should add -- prefix to single word names", () => {
		const result = genSafeVariableName("color");
		expect(result).toBe("--color");
	});

	it("should add -- prefix to names with numbers", () => {
		const result = genSafeVariableName("spacing-2");
		expect(result).toBe("--spacing-2");
	});

	it("should add -- prefix to names starting with numbers", () => {
		const result = genSafeVariableName("1-column");
		expect(result).toBe("--1-column");
	});

	it("should add -- prefix to names ending with numbers", () => {
		const result = genSafeVariableName("column-1");
		expect(result).toBe("--column-1");
	});

	it("should handle names with only numbers", () => {
		const result = genSafeVariableName("123");
		expect(result).toBe("--123");
	});

	it("should handle single character names", () => {
		const result = genSafeVariableName("x");
		expect(result).toBe("--x");
	});

	it("should sanitize names with special characters (dots)", () => {
		const result = genSafeVariableName("theme.primary");
		expect(result).toBe("--theme-primary");
	});

	it("should sanitize names with colons", () => {
		const result = genSafeVariableName("hover:color");
		expect(result).toBe("--hover-color");
	});

	it("should sanitize names with forward slashes", () => {
		const result = genSafeVariableName("size/large");
		expect(result).toBe("--size-large");
	});

	it("should sanitize names with backslashes", () => {
		const result = genSafeVariableName(String.raw`size\small`);
		expect(result).toBe("--size-small");
	});

	it("should sanitize names with square brackets", () => {
		const result = genSafeVariableName("colors[primary]");
		expect(result).toBe("--colors-primary-");
	});

	it("should sanitize names with parentheses", () => {
		const result = genSafeVariableName("color(main)");
		expect(result).toBe("--color-main-");
	});

	it("should sanitize names with curly braces", () => {
		const result = genSafeVariableName("color{primary}");
		expect(result).toBe("--color-primary-");
	});

	it("should sanitize names with plus signs", () => {
		const result = genSafeVariableName("size+large");
		expect(result).toBe("--size-large");
	});

	it("should sanitize names with asterisks", () => {
		const result = genSafeVariableName("size*2");
		expect(result).toBe("--size-2");
	});

	it("should sanitize names with equal signs", () => {
		const result = genSafeVariableName("size=large");
		expect(result).toBe("--size-large");
	});

	it("should sanitize names with question marks", () => {
		const result = genSafeVariableName("enabled?");
		expect(result).toBe("--enabled-");
	});

	it("should sanitize names with exclamation marks", () => {
		const result = genSafeVariableName("important!");
		expect(result).toBe("--important-");
	});

	it("should sanitize names with at signs", () => {
		const result = genSafeVariableName("@media");
		expect(result).toBe("---media");
	});

	it("should sanitize names with hash symbols", () => {
		const result = genSafeVariableName("#primary");
		expect(result).toBe("---primary");
	});

	it("should sanitize names with dollar signs", () => {
		const result = genSafeVariableName("$variable");
		expect(result).toBe("---variable");
	});

	it("should sanitize names with percent signs", () => {
		const result = genSafeVariableName("size%");
		expect(result).toBe("--size-");
	});

	it("should sanitize names with ampersands", () => {
		const result = genSafeVariableName("black&white");
		expect(result).toBe("--black-white");
	});

	it("should sanitize names with tildes", () => {
		const result = genSafeVariableName("~approximate");
		expect(result).toBe("---approximate");
	});

	it("should sanitize names with backticks", () => {
		const result = genSafeVariableName("`template`");
		expect(result).toBe("---template-");
	});

	it("should sanitize names with single quotes", () => {
		const result = genSafeVariableName("'quoted'");
		expect(result).toBe("---quoted-");
	});

	it("should sanitize names with double quotes", () => {
		const result = genSafeVariableName('"quoted"');
		expect(result).toBe("---quoted-");
	});

	it("should sanitize names with spaces", () => {
		const result = genSafeVariableName("my variable");
		expect(result).toBe("--my-variable");
	});

	it("should sanitize names with tabs", () => {
		const result = genSafeVariableName("my\tvariable");
		expect(result).toBe("--my-variable");
	});

	it("should sanitize names with newlines", () => {
		const result = genSafeVariableName("my\nvariable");
		expect(result).toBe("--my-variable");
	});

	it("should handle empty string", () => {
		const result = genSafeVariableName("");
		expect(result).toBe("--unknown-variable");
	});

	it("should handle name with only dashes", () => {
		const result = genSafeVariableName("---");
		expect(result).toBe("---");
	});

	it("should handle name with single dash", () => {
		const result = genSafeVariableName("-");
		expect(result).toBe("---");
	});

	it("should not add prefix to name already starting with --", () => {
		const result = genSafeVariableName("--my-variable");
		expect(result).toBe("--my-variable");
	});

	it("should normalize name with triple dashes", () => {
		const result = genSafeVariableName("---extra");
		expect(result).toBe("---extra");
	});

	it("should normalize name with quadruple dashes", () => {
		const result = genSafeVariableName("----super-extra");
		expect(result).toBe("----super-extra");
	});

	it("should normalize name starting with single dash", () => {
		const result = genSafeVariableName("-webkit");
		expect(result).toBe("---webkit");
	});

	it("should handle unicode characters", () => {
		const result = genSafeVariableName("颜色");
		expect(result).toBe("--颜色");
	});

	it("should handle emoji", () => {
		const result = genSafeVariableName("🎨-color");
		expect(result).toBe("--🎨-color");
	});

	it("should handle emoji only", () => {
		const result = genSafeVariableName("🎉");
		expect(result).toBe("--🎉");
	});

	it("should handle mixed ASCII and unicode", () => {
		const result = genSafeVariableName("color-颜色");
		expect(result).toBe("--color-颜色");
	});

	it("should handle Arabic text", () => {
		const result = genSafeVariableName("لون");
		expect(result).toBe("--لون");
	});

	it("should handle Hebrew text", () => {
		const result = genSafeVariableName("צבע");
		expect(result).toBe("--צבע");
	});

	it("should handle Cyrillic text", () => {
		const result = genSafeVariableName("цвет");
		expect(result).toBe("--цвет");
	});

	it("should handle Greek text", () => {
		const result = genSafeVariableName("χρώμα");
		expect(result).toBe("--χρώμα");
	});

	it("should handle mathematical symbols", () => {
		const result = genSafeVariableName("π-value");
		expect(result).toBe("--π-value");
	});

	it("should handle currency symbols", () => {
		const result = genSafeVariableName("€-price");
		expect(result).toBe("--€-price");
	});

	it("should sanitize mixed special characters", () => {
		const result = genSafeVariableName("test@123#$%");
		expect(result).toBe("--test-123---");
	});

	it("should handle very long names", () => {
		const longName = "a".repeat(1000);
		const result = genSafeVariableName(longName);
		expect(result).toBe("--" + longName);
	});

	it("should sanitize names with control characters", () => {
		const result = genSafeVariableName("test\0null");
		expect(result).toBe("--test-null");
	});

	it("should sanitize names with escape sequences", () => {
		const result = genSafeVariableName(String.raw`test\nline`);
		expect(result).toBe("--test-nline");
	});

	it("should preserve zero-width characters (non-ASCII < 0x80)", () => {
		const result = genSafeVariableName("test\u200Bzero");
		expect(result).toBe("--test\u200Bzero");
	});

	it("should be case-sensitive", () => {
		const result1 = genSafeVariableName("MyVariable");
		const result2 = genSafeVariableName("myvariable");
		expect(result1).toBe("--MyVariable");
		expect(result2).toBe("--myvariable");
		expect(result1).not.toBe(result2);
	});

	it("should sanitize leading whitespace", () => {
		const result = genSafeVariableName("  spacing");
		expect(result).toBe("----spacing");
	});

	it("should sanitize trailing whitespace", () => {
		const result = genSafeVariableName("spacing  ");
		expect(result).toBe("--spacing--");
	});

	it("should sanitize surrounding whitespace", () => {
		const result = genSafeVariableName("  spacing  ");
		expect(result).toBe("----spacing--");
	});

	it("should sanitize name that looks like it starts with -- but doesn't", () => {
		const result = genSafeVariableName("-​-tricky"); // Zero-width space after first dash
		expect(result).toBe("---​-tricky");
	});

	it("should handle name with -- in the middle", () => {
		const result = genSafeVariableName("my--variable");
		expect(result).toBe("--my--variable");
	});

	it("should handle name ending with --", () => {
		const result = genSafeVariableName("variable--");
		expect(result).toBe("--variable--");
	});

	it("should handle BEM-style names", () => {
		const result = genSafeVariableName("button__text--primary");
		expect(result).toBe("--button__text--primary");
	});

	it("should sanitize namespace-style names", () => {
		const result = genSafeVariableName("app.theme.color.primary");
		expect(result).toBe("--app-theme-color-primary");
	});

	it("should sanitize path-style names", () => {
		const result = genSafeVariableName("colors/primary/500");
		expect(result).toBe("--colors-primary-500");
	});

	it("should handle CSS property-like names", () => {
		const result = genSafeVariableName("margin-top");
		expect(result).toBe("--margin-top");
	});

	it("should sanitize names that look like CSS functions", () => {
		const result = genSafeVariableName("calc(100%)");
		expect(result).toBe("--calc-100--");
	});

	it("should sanitize names with HTML entities", () => {
		const result = genSafeVariableName("&nbsp;space");
		expect(result).toBe("---nbsp-space");
	});

	it("should sanitize names with URL encoding", () => {
		const result = genSafeVariableName("color%20primary");
		expect(result).toBe("--color-20primary");
	});
});
