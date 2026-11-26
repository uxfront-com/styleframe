import { describe, expect, it } from "vitest";

import { genReferenceVariable } from "./genReferenceVariable";

describe("genReferenceVariable", () => {
	it("should generate a basic variable reference", () => {
		const result = genReferenceVariable("primary-color");
		expect(result).toBe("var(--primary-color)");
	});

	it("should preserve existing -- prefix", () => {
		const result = genReferenceVariable("--secondary-color");
		expect(result).toBe("var(--secondary-color)");
	});

	it("should generate a variable reference with fallback", () => {
		const result = genReferenceVariable("primary-color", "#007bff");
		expect(result).toBe("var(--primary-color, #007bff)");
	});

	it("should handle variable reference with color name fallback", () => {
		const result = genReferenceVariable("text-color", "black");
		expect(result).toBe("var(--text-color, black)");
	});

	it("should handle variable reference with hex color fallback", () => {
		const result = genReferenceVariable("background", "#ffffff");
		expect(result).toBe("var(--background, #ffffff)");
	});

	it("should handle variable reference with rgb fallback", () => {
		const result = genReferenceVariable("accent", "rgb(255, 0, 0)");
		expect(result).toBe("var(--accent, rgb(255, 0, 0))");
	});

	it("should handle variable reference with rgba fallback", () => {
		const result = genReferenceVariable("overlay", "rgba(0, 0, 0, 0.5)");
		expect(result).toBe("var(--overlay, rgba(0, 0, 0, 0.5))");
	});

	it("should handle variable reference with hsl fallback", () => {
		const result = genReferenceVariable("theme-color", "hsl(210, 100%, 50%)");
		expect(result).toBe("var(--theme-color, hsl(210, 100%, 50%))");
	});

	it("should handle variable reference with numeric fallback", () => {
		const result = genReferenceVariable("spacing", "16px");
		expect(result).toBe("var(--spacing, 16px)");
	});

	it("should handle variable reference with percentage fallback", () => {
		const result = genReferenceVariable("width", "100%");
		expect(result).toBe("var(--width, 100%)");
	});

	it("should handle variable reference with em fallback", () => {
		const result = genReferenceVariable("font-size", "1.5em");
		expect(result).toBe("var(--font-size, 1.5em)");
	});

	it("should handle variable reference with rem fallback", () => {
		const result = genReferenceVariable("margin", "2rem");
		expect(result).toBe("var(--margin, 2rem)");
	});

	it("should handle variable reference with viewport unit fallback", () => {
		const result = genReferenceVariable("height", "100vh");
		expect(result).toBe("var(--height, 100vh)");
	});

	it("should handle variable reference with calc() fallback", () => {
		const result = genReferenceVariable("computed-width", "calc(100% - 20px)");
		expect(result).toBe("var(--computed-width, calc(100% - 20px))");
	});

	it("should handle nested var() as fallback", () => {
		const result = genReferenceVariable("primary", "var(--fallback-color)");
		expect(result).toBe("var(--primary, var(--fallback-color))");
	});

	it("should handle nested var() with its own fallback", () => {
		const result = genReferenceVariable("primary", "var(--secondary, blue)");
		expect(result).toBe("var(--primary, var(--secondary, blue))");
	});

	it("should handle gradient as fallback", () => {
		const result = genReferenceVariable("gradient", "linear-gradient(to right, red, blue)");
		expect(result).toBe("var(--gradient, linear-gradient(to right, red, blue))");
	});

	it("should handle shadow as fallback", () => {
		const result = genReferenceVariable("shadow", "0 4px 6px rgba(0, 0, 0, 0.1)");
		expect(result).toBe("var(--shadow, 0 4px 6px rgba(0, 0, 0, 0.1))");
	});

	it("should handle font-family as fallback", () => {
		const result = genReferenceVariable("font-stack", "'Helvetica Neue', Arial, sans-serif");
		expect(result).toBe("var(--font-stack, 'Helvetica Neue', Arial, sans-serif)");
	});

	it("should handle transition timing as fallback", () => {
		const result = genReferenceVariable("transition", "all 0.3s ease-in-out");
		expect(result).toBe("var(--transition, all 0.3s ease-in-out)");
	});

	it("should handle transform as fallback", () => {
		const result = genReferenceVariable("transform", "rotate(45deg) scale(1.5)");
		expect(result).toBe("var(--transform, rotate(45deg) scale(1.5))");
	});

	it("should handle url() as fallback", () => {
		const result = genReferenceVariable("background-image", "url('default.jpg')");
		expect(result).toBe("var(--background-image, url('default.jpg'))");
	});

	it("should handle multiple values as fallback", () => {
		const result = genReferenceVariable("margin", "10px 20px 30px 40px");
		expect(result).toBe("var(--margin, 10px 20px 30px 40px)");
	});

	it("should handle empty string as fallback", () => {
		const result = genReferenceVariable("content", "");
		expect(result).toBe("var(--content)");
	});

	it("should handle quoted string as fallback", () => {
		const result = genReferenceVariable("content", '"Hello World"');
		expect(result).toBe('var(--content, "Hello World")');
	});

	it("should handle single quoted string as fallback", () => {
		const result = genReferenceVariable("label", "'Click here'");
		expect(result).toBe("var(--label, 'Click here')");
	});

	it("should handle numeric value without units as fallback", () => {
		const result = genReferenceVariable("line-height", "1.5");
		expect(result).toBe("var(--line-height, 1.5)");
	});

	it("should handle zero as fallback", () => {
		const result = genReferenceVariable("reset", "0");
		expect(result).toBe("var(--reset, 0)");
	});

	it("should handle negative value as fallback", () => {
		const result = genReferenceVariable("offset", "-10px");
		expect(result).toBe("var(--offset, -10px)");
	});

	it("should handle decimal value as fallback", () => {
		const result = genReferenceVariable("opacity", "0.75");
		expect(result).toBe("var(--opacity, 0.75)");
	});

	it("should handle CSS keywords as fallback", () => {
		const result = genReferenceVariable("display", "none");
		expect(result).toBe("var(--display, none)");
	});

	it("should handle inherit keyword as fallback", () => {
		const result = genReferenceVariable("color", "inherit");
		expect(result).toBe("var(--color, inherit)");
	});

	it("should handle initial keyword as fallback", () => {
		const result = genReferenceVariable("value", "initial");
		expect(result).toBe("var(--value, initial)");
	});

	it("should handle unset keyword as fallback", () => {
		const result = genReferenceVariable("property", "unset");
		expect(result).toBe("var(--property, unset)");
	});

	it("should handle currentColor keyword as fallback", () => {
		const result = genReferenceVariable("border-color", "currentColor");
		expect(result).toBe("var(--border-color, currentColor)");
	});

	it("should handle transparent keyword as fallback", () => {
		const result = genReferenceVariable("bg", "transparent");
		expect(result).toBe("var(--bg, transparent)");
	});

	it("should handle variable names with numbers", () => {
		const result = genReferenceVariable("spacing-2");
		expect(result).toBe("var(--spacing-2)");
	});

	it("should handle variable names with underscores", () => {
		const result = genReferenceVariable("primary_color");
		expect(result).toBe("var(--primary_color)");
	});

	it("should handle camelCase variable names", () => {
		const result = genReferenceVariable("primaryColor");
		expect(result).toBe("var(--primaryColor)");
	});

	it("should handle variable names starting with numbers", () => {
		const result = genReferenceVariable("1-column");
		expect(result).toBe("var(--1-column)");
	});

	it("should handle complex calc with nested operations as fallback", () => {
		const result = genReferenceVariable("complex", "calc((100% - 20px) / 2)");
		expect(result).toBe("var(--complex, calc((100% - 20px) / 2))");
	});

	it("should handle min() function as fallback", () => {
		const result = genReferenceVariable("width", "min(100%, 500px)");
		expect(result).toBe("var(--width, min(100%, 500px))");
	});

	it("should handle max() function as fallback", () => {
		const result = genReferenceVariable("height", "max(50vh, 300px)");
		expect(result).toBe("var(--height, max(50vh, 300px))");
	});

	it("should handle clamp() function as fallback", () => {
		const result = genReferenceVariable("font-size", "clamp(1rem, 2vw, 3rem)");
		expect(result).toBe("var(--font-size, clamp(1rem, 2vw, 3rem))");
	});

	it("should handle cubic-bezier as fallback", () => {
		const result = genReferenceVariable("easing", "cubic-bezier(0.4, 0, 0.2, 1)");
		expect(result).toBe("var(--easing, cubic-bezier(0.4, 0, 0.2, 1))");
	});

	it("should handle filter functions as fallback", () => {
		const result = genReferenceVariable("blur", "blur(5px)");
		expect(result).toBe("var(--blur, blur(5px))");
	});

	it("should handle multiple shadows as fallback", () => {
		const result = genReferenceVariable(
			"shadows",
			"0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
		);
		expect(result).toBe("var(--shadows, 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24))");
	});

	it("should handle grid template as fallback", () => {
		const result = genReferenceVariable("grid-columns", "repeat(3, 1fr)");
		expect(result).toBe("var(--grid-columns, repeat(3, 1fr))");
	});

	it("should handle CSS Grid line names as fallback", () => {
		const result = genReferenceVariable(
			"grid-rows",
			"[header-start] 100px [header-end content-start] 1fr [content-end]",
		);
		expect(result).toBe(
			"var(--grid-rows, [header-start] 100px [header-end content-start] 1fr [content-end])",
		);
	});

	it("should handle env() function as fallback", () => {
		const result = genReferenceVariable("safe-top", "env(safe-area-inset-top)");
		expect(result).toBe("var(--safe-top, env(safe-area-inset-top))");
	});

	it("should handle attr() function as fallback", () => {
		const result = genReferenceVariable("content", "attr(data-label)");
		expect(result).toBe("var(--content, attr(data-label))");
	});

	it("should handle counter() function as fallback", () => {
		const result = genReferenceVariable("counter", "counter(section)");
		expect(result).toBe("var(--counter, counter(section))");
	});

	it("should handle whitespace in fallback values", () => {
		const result = genReferenceVariable("padding", "  10px   20px  ");
		expect(result).toBe("var(--padding,   10px   20px  )");
	});

	it("should handle special CSS color names as fallback", () => {
		const result = genReferenceVariable("color", "rebeccapurple");
		expect(result).toBe("var(--color, rebeccapurple)");
	});

	it("should handle system colors as fallback", () => {
		const result = genReferenceVariable("color", "ButtonText");
		expect(result).toBe("var(--color, ButtonText)");
	});

	it("should handle variable name with single dash", () => {
		const result = genReferenceVariable("-custom");
		expect(result).toBe("var(---custom)");
	});

	it("should handle variable name with triple dash", () => {
		const result = genReferenceVariable("---extra");
		expect(result).toBe("var(---extra)");
	});

	it("should handle emoji in fallback", () => {
		const result = genReferenceVariable("emoji", "'🎉'");
		expect(result).toBe("var(--emoji, '🎉')");
	});

	it("should handle unicode escape sequences in fallback", () => {
		const result = genReferenceVariable("unicode", String.raw`'\2022'`);
		expect(result).toBe(String.raw`var(--unicode, '\2022')`);
	});

	it("should handle data URI as fallback", () => {
		const result = genReferenceVariable("icon", "url('data:image/svg+xml;base64,PHN2ZyB4...')");
		expect(result).toBe("var(--icon, url('data:image/svg+xml;base64,PHN2ZyB4...'))");
	});

	it("should handle undefined fallback", () => {
		const result = genReferenceVariable("variable", undefined);
		expect(result).toBe("var(--variable)");
	});

	it("should handle invalid empty variable name with prefix", () => {
		const result = genReferenceVariable("--");
		expect(result).toBe("var(--unknown-variable)");
	});

	it("should handle variable reference without fallback", () => {
		const result = genReferenceVariable("theme-primary");
		expect(result).toBe("var(--theme-primary)");
	});

	it("should handle !important in fallback (though unusual)", () => {
		const result = genReferenceVariable("color", "red !important");
		expect(result).toBe("var(--color, red !important)");
	});

	it("should handle comma-separated fallback values", () => {
		const result = genReferenceVariable("fonts", "Arial, Helvetica, sans-serif");
		expect(result).toBe("var(--fonts, Arial, Helvetica, sans-serif)");
	});

	it("should handle steps timing function as fallback", () => {
		const result = genReferenceVariable("animation-timing", "steps(4, end)");
		expect(result).toBe("var(--animation-timing, steps(4, end))");
	});

	it("should handle complex nested calc as fallback", () => {
		const result = genReferenceVariable("width", "calc(100% - calc(20px + 2em))");
		expect(result).toBe("var(--width, calc(100% - calc(20px + 2em)))");
	});

	it("should handle auto keyword as fallback", () => {
		const result = genReferenceVariable("margin", "auto");
		expect(result).toBe("var(--margin, auto)");
	});

	it("should handle revert keyword as fallback", () => {
		const result = genReferenceVariable("font-size", "revert");
		expect(result).toBe("var(--font-size, revert)");
	});
});
