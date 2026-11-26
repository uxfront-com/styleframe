import { describe, expect, it } from "vitest";

import { genDeclareVariable } from "./genDeclareVariable";

describe("genDeclareVariable", () => {
	it("should generate a CSS variable declaration with -- prefix", () => {
		const result = genDeclareVariable("primary-color", "#007bff");
		expect(result).toBe("--primary-color: #007bff;");
	});

	it("should preserve existing -- prefix", () => {
		const result = genDeclareVariable("--secondary-color", "#6c757d");
		expect(result).toBe("--secondary-color: #6c757d;");
	});

	it("should handle simple color values", () => {
		const result = genDeclareVariable("text-color", "black");
		expect(result).toBe("--text-color: black;");
	});

	it("should handle hex color values", () => {
		const result = genDeclareVariable("background", "#ffffff");
		expect(result).toBe("--background: #ffffff;");
	});

	it("should handle rgb values", () => {
		const result = genDeclareVariable("accent", "rgb(255, 0, 0)");
		expect(result).toBe("--accent: rgb(255, 0, 0);");
	});

	it("should handle rgba values", () => {
		const result = genDeclareVariable("overlay", "rgba(0, 0, 0, 0.5)");
		expect(result).toBe("--overlay: rgba(0, 0, 0, 0.5);");
	});

	it("should handle hsl values", () => {
		const result = genDeclareVariable("theme-color", "hsl(210, 100%, 50%)");
		expect(result).toBe("--theme-color: hsl(210, 100%, 50%);");
	});

	it("should handle numeric values", () => {
		const result = genDeclareVariable("spacing", "16px");
		expect(result).toBe("--spacing: 16px;");
	});

	it("should handle percentage values", () => {
		const result = genDeclareVariable("width", "100%");
		expect(result).toBe("--width: 100%;");
	});

	it("should handle em values", () => {
		const result = genDeclareVariable("font-size", "1.5em");
		expect(result).toBe("--font-size: 1.5em;");
	});

	it("should handle rem values", () => {
		const result = genDeclareVariable("margin", "2rem");
		expect(result).toBe("--margin: 2rem;");
	});

	it("should handle viewport units", () => {
		const result = genDeclareVariable("height", "100vh");
		expect(result).toBe("--height: 100vh;");
	});

	it("should handle calc() expressions", () => {
		const result = genDeclareVariable("computed-width", "calc(100% - 20px)");
		expect(result).toBe("--computed-width: calc(100% - 20px);");
	});

	it("should handle var() references", () => {
		const result = genDeclareVariable("derived-color", "var(--primary-color)");
		expect(result).toBe("--derived-color: var(--primary-color);");
	});

	it("should handle var() with fallback", () => {
		const result = genDeclareVariable("safe-color", "var(--custom-color, #000000)");
		expect(result).toBe("--safe-color: var(--custom-color, #000000);");
	});

	it("should handle gradient values", () => {
		const result = genDeclareVariable("gradient", "linear-gradient(to right, red, blue)");
		expect(result).toBe("--gradient: linear-gradient(to right, red, blue);");
	});

	it("should handle shadow values", () => {
		const result = genDeclareVariable("shadow", "0 4px 6px rgba(0, 0, 0, 0.1)");
		expect(result).toBe("--shadow: 0 4px 6px rgba(0, 0, 0, 0.1);");
	});

	it("should handle font-family values", () => {
		const result = genDeclareVariable("font-stack", "'Helvetica Neue', Arial, sans-serif");
		expect(result).toBe("--font-stack: 'Helvetica Neue', Arial, sans-serif;");
	});

	it("should handle transition timing", () => {
		const result = genDeclareVariable("transition", "all 0.3s ease-in-out");
		expect(result).toBe("--transition: all 0.3s ease-in-out;");
	});

	it("should handle transform functions", () => {
		const result = genDeclareVariable("transform", "rotate(45deg) scale(1.5)");
		expect(result).toBe("--transform: rotate(45deg) scale(1.5);");
	});

	it("should handle url() values", () => {
		const result = genDeclareVariable("background-image", "url('image.jpg')");
		expect(result).toBe("--background-image: url('image.jpg');");
	});

	it("should handle multiple values", () => {
		const result = genDeclareVariable("margin-values", "10px 20px 30px 40px");
		expect(result).toBe("--margin-values: 10px 20px 30px 40px;");
	});

	it("should handle empty string value", () => {
		const result = genDeclareVariable("empty", "");
		expect(result).toBe("--empty: ;");
	});

	it("should handle quoted string values", () => {
		const result = genDeclareVariable("content", '"Hello World"');
		expect(result).toBe('--content: "Hello World";');
	});

	it("should handle single quoted string values", () => {
		const result = genDeclareVariable("label", "'Click here'");
		expect(result).toBe("--label: 'Click here';");
	});

	it("should handle numeric values without units", () => {
		const result = genDeclareVariable("line-height", "1.5");
		expect(result).toBe("--line-height: 1.5;");
	});

	it("should handle zero value", () => {
		const result = genDeclareVariable("reset", "0");
		expect(result).toBe("--reset: 0;");
	});

	it("should handle negative values", () => {
		const result = genDeclareVariable("offset", "-10px");
		expect(result).toBe("--offset: -10px;");
	});

	it("should handle decimal values", () => {
		const result = genDeclareVariable("opacity", "0.75");
		expect(result).toBe("--opacity: 0.75;");
	});

	it("should handle CSS keywords", () => {
		const result = genDeclareVariable("display", "none");
		expect(result).toBe("--display: none;");
	});

	it("should handle inherit keyword", () => {
		const result = genDeclareVariable("color", "inherit");
		expect(result).toBe("--color: inherit;");
	});

	it("should handle initial keyword", () => {
		const result = genDeclareVariable("value", "initial");
		expect(result).toBe("--value: initial;");
	});

	it("should handle unset keyword", () => {
		const result = genDeclareVariable("property", "unset");
		expect(result).toBe("--property: unset;");
	});

	it("should handle currentColor keyword", () => {
		const result = genDeclareVariable("border-color", "currentColor");
		expect(result).toBe("--border-color: currentColor;");
	});

	it("should handle transparent keyword", () => {
		const result = genDeclareVariable("bg", "transparent");
		expect(result).toBe("--bg: transparent;");
	});

	it("should handle variable names with numbers", () => {
		const result = genDeclareVariable("spacing-2", "8px");
		expect(result).toBe("--spacing-2: 8px;");
	});

	it("should handle variable names with underscores", () => {
		const result = genDeclareVariable("primary_color", "#007bff");
		expect(result).toBe("--primary_color: #007bff;");
	});

	it("should handle camelCase variable names", () => {
		const result = genDeclareVariable("primaryColor", "#007bff");
		expect(result).toBe("--primaryColor: #007bff;");
	});

	it("should handle variable names starting with numbers (CSS allows this with --)", () => {
		const result = genDeclareVariable("1-column", "100px");
		expect(result).toBe("--1-column: 100px;");
	});

	it("should handle complex calc with nested operations", () => {
		const result = genDeclareVariable("complex", "calc((100% - 20px) / 2)");
		expect(result).toBe("--complex: calc((100% - 20px) / 2);");
	});

	it("should handle min() function", () => {
		const result = genDeclareVariable("width", "min(100%, 500px)");
		expect(result).toBe("--width: min(100%, 500px);");
	});

	it("should handle max() function", () => {
		const result = genDeclareVariable("height", "max(50vh, 300px)");
		expect(result).toBe("--height: max(50vh, 300px);");
	});

	it("should handle clamp() function", () => {
		const result = genDeclareVariable("font-size", "clamp(1rem, 2vw, 3rem)");
		expect(result).toBe("--font-size: clamp(1rem, 2vw, 3rem);");
	});

	it("should handle cubic-bezier timing function", () => {
		const result = genDeclareVariable("easing", "cubic-bezier(0.4, 0, 0.2, 1)");
		expect(result).toBe("--easing: cubic-bezier(0.4, 0, 0.2, 1);");
	});

	it("should handle filter functions", () => {
		const result = genDeclareVariable("blur", "blur(5px)");
		expect(result).toBe("--blur: blur(5px);");
	});

	it("should handle multiple box-shadow values", () => {
		const result = genDeclareVariable(
			"shadows",
			"0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
		);
		expect(result).toBe("--shadows: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);");
	});

	it("should handle grid template values", () => {
		const result = genDeclareVariable("grid-columns", "repeat(3, 1fr)");
		expect(result).toBe("--grid-columns: repeat(3, 1fr);");
	});

	it("should handle CSS Grid line names", () => {
		const result = genDeclareVariable(
			"grid-rows",
			"[header-start] 100px [header-end content-start] 1fr [content-end]",
		);
		expect(result).toBe(
			"--grid-rows: [header-start] 100px [header-end content-start] 1fr [content-end];",
		);
	});

	it("should handle env() function", () => {
		const result = genDeclareVariable("safe-top", "env(safe-area-inset-top)");
		expect(result).toBe("--safe-top: env(safe-area-inset-top);");
	});

	it("should handle attr() function", () => {
		const result = genDeclareVariable("content", "attr(data-label)");
		expect(result).toBe("--content: attr(data-label);");
	});

	it("should handle counter() function", () => {
		const result = genDeclareVariable("counter", "counter(section)");
		expect(result).toBe("--counter: counter(section);");
	});

	it("should handle whitespace in values", () => {
		const result = genDeclareVariable("padding", "  10px   20px  ");
		expect(result).toBe("--padding:   10px   20px  ;");
	});

	it("should handle special CSS color names", () => {
		const result = genDeclareVariable("color", "rebeccapurple");
		expect(result).toBe("--color: rebeccapurple;");
	});

	it("should handle system colors", () => {
		const result = genDeclareVariable("color", "ButtonText");
		expect(result).toBe("--color: ButtonText;");
	});

	it("should handle variable name with single dash", () => {
		const result = genDeclareVariable("-custom", "value");
		expect(result).toBe("---custom: value;");
	});

	it("should handle variable name with triple dash", () => {
		const result = genDeclareVariable("---extra", "value");
		expect(result).toBe("---extra: value;");
	});

	it("should handle emoji in values", () => {
		const result = genDeclareVariable("emoji", "'🎉'");
		expect(result).toBe("--emoji: '🎉';");
	});

	it("should handle unicode escape sequences", () => {
		const result = genDeclareVariable("unicode", String.raw`'\2022'`);
		expect(result).toBe(String.raw`--unicode: '\2022';`);
	});

	it("should handle data URI values", () => {
		const result = genDeclareVariable("icon", "url('data:image/svg+xml;base64,PHN2ZyB4...')");
		expect(result).toBe("--icon: url('data:image/svg+xml;base64,PHN2ZyB4...');");
	});
});
