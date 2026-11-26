import { describe, expect, it } from "vitest";

import { genDeclaration } from "./genDeclaration";

describe("genDeclaration", () => {
	it("should generate a basic CSS declaration", () => {
		const result = genDeclaration("color", "red");
		expect(result).toBe("color: red;");
	});

	it("should generate a declaration with hex color value", () => {
		const result = genDeclaration("background-color", "#ff0000");
		expect(result).toBe("background-color: #ff0000;");
	});

	it("should generate a declaration with rgb value", () => {
		const result = genDeclaration("color", "rgb(255, 0, 0)");
		expect(result).toBe("color: rgb(255, 0, 0);");
	});

	it("should generate a declaration with rgba value", () => {
		const result = genDeclaration("background", "rgba(0, 0, 0, 0.5)");
		expect(result).toBe("background: rgba(0, 0, 0, 0.5);");
	});

	it("should generate a declaration with hsl value", () => {
		const result = genDeclaration("color", "hsl(120, 100%, 50%)");
		expect(result).toBe("color: hsl(120, 100%, 50%);");
	});

	it("should generate a declaration with pixel value", () => {
		const result = genDeclaration("width", "100px");
		expect(result).toBe("width: 100px;");
	});

	it("should generate a declaration with percentage value", () => {
		const result = genDeclaration("width", "50%");
		expect(result).toBe("width: 50%;");
	});

	it("should generate a declaration with em value", () => {
		const result = genDeclaration("font-size", "1.5em");
		expect(result).toBe("font-size: 1.5em;");
	});

	it("should generate a declaration with rem value", () => {
		const result = genDeclaration("margin", "2rem");
		expect(result).toBe("margin: 2rem;");
	});

	it("should generate a declaration with viewport units", () => {
		const result = genDeclaration("height", "100vh");
		expect(result).toBe("height: 100vh;");
	});

	it("should generate a declaration with multiple values", () => {
		const result = genDeclaration("margin", "10px 20px 30px 40px");
		expect(result).toBe("margin: 10px 20px 30px 40px;");
	});

	it("should generate a declaration with important flag", () => {
		const result = genDeclaration("color", "blue !important");
		expect(result).toBe("color: blue !important;");
	});

	it("should handle CSS custom properties", () => {
		const result = genDeclaration("--primary-color", "#007bff");
		expect(result).toBe("--primary-color: #007bff;");
	});

	it("should handle var() function", () => {
		const result = genDeclaration("color", "var(--primary-color)");
		expect(result).toBe("color: var(--primary-color);");
	});

	it("should handle var() with fallback", () => {
		const result = genDeclaration("color", "var(--text-color, black)");
		expect(result).toBe("color: var(--text-color, black);");
	});

	it("should handle calc() function", () => {
		const result = genDeclaration("width", "calc(100% - 20px)");
		expect(result).toBe("width: calc(100% - 20px);");
	});

	it("should handle url() function", () => {
		const result = genDeclaration("background-image", "url('image.jpg')");
		expect(result).toBe("background-image: url('image.jpg');");
	});

	it("should handle linear-gradient", () => {
		const result = genDeclaration("background", "linear-gradient(to right, red, blue)");
		expect(result).toBe("background: linear-gradient(to right, red, blue);");
	});

	it("should handle transform functions", () => {
		const result = genDeclaration("transform", "rotate(45deg) scale(1.5)");
		expect(result).toBe("transform: rotate(45deg) scale(1.5);");
	});

	it("should handle transition shorthand", () => {
		const result = genDeclaration("transition", "all 0.3s ease-in-out");
		expect(result).toBe("transition: all 0.3s ease-in-out;");
	});

	it("should handle box-shadow", () => {
		const result = genDeclaration("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)");
		expect(result).toBe("box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);");
	});

	it("should handle font shorthand", () => {
		const result = genDeclaration("font", "italic bold 16px/1.5 Arial, sans-serif");
		expect(result).toBe("font: italic bold 16px/1.5 Arial, sans-serif;");
	});

	it("should handle grid template", () => {
		const result = genDeclaration("grid-template-columns", "repeat(3, 1fr)");
		expect(result).toBe("grid-template-columns: repeat(3, 1fr);");
	});

	it("should handle flex shorthand", () => {
		const result = genDeclaration("flex", "1 1 auto");
		expect(result).toBe("flex: 1 1 auto;");
	});

	it("should handle animation shorthand", () => {
		const result = genDeclaration("animation", "slide 2s ease-in-out infinite");
		expect(result).toBe("animation: slide 2s ease-in-out infinite;");
	});

	it("should handle vendor prefixes", () => {
		const result = genDeclaration("-webkit-transform", "rotate(45deg)");
		expect(result).toBe("-webkit-transform: rotate(45deg);");
	});

	it("should handle empty string value", () => {
		const result = genDeclaration("content", "");
		expect(result).toBe("content: ;");
	});

	it("should handle quoted string value", () => {
		const result = genDeclaration("content", '"Hello World"');
		expect(result).toBe('content: "Hello World";');
	});

	it("should handle single quoted string value", () => {
		const result = genDeclaration("font-family", "'Helvetica Neue', sans-serif");
		expect(result).toBe("font-family: 'Helvetica Neue', sans-serif;");
	});

	it("should preserve whitespace in value", () => {
		const result = genDeclaration("margin", "  10px   20px  ");
		expect(result).toBe("margin:   10px   20px  ;");
	});

	it("should handle special CSS keywords", () => {
		const result = genDeclaration("display", "none");
		expect(result).toBe("display: none;");
	});

	it("should handle inherit keyword", () => {
		const result = genDeclaration("color", "inherit");
		expect(result).toBe("color: inherit;");
	});

	it("should handle initial keyword", () => {
		const result = genDeclaration("margin", "initial");
		expect(result).toBe("margin: initial;");
	});

	it("should handle unset keyword", () => {
		const result = genDeclaration("padding", "unset");
		expect(result).toBe("padding: unset;");
	});

	it("should handle revert keyword", () => {
		const result = genDeclaration("font-size", "revert");
		expect(result).toBe("font-size: revert;");
	});

	it("should handle auto keyword", () => {
		const result = genDeclaration("margin", "auto");
		expect(result).toBe("margin: auto;");
	});

	it("should handle multiple box-shadow values", () => {
		const result = genDeclaration(
			"box-shadow",
			"0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
		);
		expect(result).toBe("box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);");
	});

	it("should handle CSS math functions", () => {
		const result = genDeclaration("width", "min(100%, 500px)");
		expect(result).toBe("width: min(100%, 500px);");
	});

	it("should handle clamp function", () => {
		const result = genDeclaration("font-size", "clamp(1rem, 2vw, 3rem)");
		expect(result).toBe("font-size: clamp(1rem, 2vw, 3rem);");
	});

	it("should handle max function", () => {
		const result = genDeclaration("width", "max(50%, 300px)");
		expect(result).toBe("width: max(50%, 300px);");
	});

	it("should handle filter functions", () => {
		const result = genDeclaration("filter", "blur(5px) brightness(1.5)");
		expect(result).toBe("filter: blur(5px) brightness(1.5);");
	});

	it("should handle cubic-bezier timing function", () => {
		const result = genDeclaration("transition-timing-function", "cubic-bezier(0.4, 0, 0.2, 1)");
		expect(result).toBe("transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);");
	});

	it("should handle steps timing function", () => {
		const result = genDeclaration("animation-timing-function", "steps(4, end)");
		expect(result).toBe("animation-timing-function: steps(4, end);");
	});

	it("should handle negative values", () => {
		const result = genDeclaration("margin-top", "-10px");
		expect(result).toBe("margin-top: -10px;");
	});

	it("should handle decimal values", () => {
		const result = genDeclaration("opacity", "0.75");
		expect(result).toBe("opacity: 0.75;");
	});

	it("should handle zero without unit", () => {
		const result = genDeclaration("margin", "0");
		expect(result).toBe("margin: 0;");
	});

	it("should handle CSS Grid line names", () => {
		const result = genDeclaration(
			"grid-template-rows",
			"[header-start] 100px [header-end content-start] 1fr [content-end]",
		);
		expect(result).toBe(
			"grid-template-rows: [header-start] 100px [header-end content-start] 1fr [content-end];",
		);
	});

	it("should handle attr() function", () => {
		const result = genDeclaration("content", "attr(data-label)");
		expect(result).toBe("content: attr(data-label);");
	});

	it("should handle counter() function", () => {
		const result = genDeclaration("content", "counter(section)");
		expect(result).toBe("content: counter(section);");
	});

	it("should handle env() function", () => {
		const result = genDeclaration("padding-top", "env(safe-area-inset-top)");
		expect(result).toBe("padding-top: env(safe-area-inset-top);");
	});

	it("should handle complex nested calc", () => {
		const result = genDeclaration("width", "calc(100% - calc(20px + 2em))");
		expect(result).toBe("width: calc(100% - calc(20px + 2em));");
	});
});
