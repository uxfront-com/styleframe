import { describe, expect, it } from "vitest";

import { genAtRuleQuery } from "./genAtRuleQuery";

describe("genAtRuleQuery", () => {
	it("should generate a basic media query", () => {
		const result = genAtRuleQuery("media", "(min-width: 768px)");
		expect(result).toBe("@media (min-width: 768px)");
	});

	it("should generate a supports query", () => {
		const result = genAtRuleQuery("supports", "(display: grid)");
		expect(result).toBe("@supports (display: grid)");
	});

	it("should generate a container query", () => {
		const result = genAtRuleQuery("container", "sidebar (min-width: 400px)");
		expect(result).toBe("@container sidebar (min-width: 400px)");
	});

	it("should generate a layer rule", () => {
		const result = genAtRuleQuery("layer", "utilities");
		expect(result).toBe("@layer utilities");
	});

	it("should generate a scope rule", () => {
		const result = genAtRuleQuery("scope", "(.component)");
		expect(result).toBe("@scope (.component)");
	});

	it("should handle complex media queries", () => {
		const result = genAtRuleQuery("media", "screen and (min-width: 768px) and (max-width: 1024px)");
		expect(result).toBe("@media screen and (min-width: 768px) and (max-width: 1024px)");
	});

	it("should handle print media type", () => {
		const result = genAtRuleQuery("media", "print");
		expect(result).toBe("@media print");
	});

	it("should handle import rules", () => {
		const result = genAtRuleQuery("import", "url('styles.css')");
		expect(result).toBe("@import url('styles.css')");
	});

	it("should handle charset rules", () => {
		const result = genAtRuleQuery("charset", '"UTF-8"');
		expect(result).toBe('@charset "UTF-8"');
	});

	it("should handle namespace rules", () => {
		const result = genAtRuleQuery("namespace", "url(http://www.w3.org/1999/xhtml)");
		expect(result).toBe("@namespace url(http://www.w3.org/1999/xhtml)");
	});

	it("should handle page rules", () => {
		const result = genAtRuleQuery("page", ":first");
		expect(result).toBe("@page :first");
	});

	it("should handle font-face (even though typically used without a rule)", () => {
		const result = genAtRuleQuery("font-face", "");
		expect(result).toBe("@font-face");
	});

	it("should handle keyframes", () => {
		const result = genAtRuleQuery("keyframes", "slideIn");
		expect(result).toBe("@keyframes slideIn");
	});

	it("should handle counter-style", () => {
		const result = genAtRuleQuery("counter-style", "custom-counter");
		expect(result).toBe("@counter-style custom-counter");
	});

	it("should handle property rules", () => {
		const result = genAtRuleQuery("property", "--my-color");
		expect(result).toBe("@property --my-color");
	});

	it("should handle document rules (deprecated but still valid)", () => {
		const result = genAtRuleQuery("document", "url(http://www.example.com/)");
		expect(result).toBe("@document url(http://www.example.com/)");
	});

	it("should handle empty rule string", () => {
		const result = genAtRuleQuery("media", "");
		expect(result).toBe("@media");
	});

	it("should handle whitespace in rule string", () => {
		const result = genAtRuleQuery("media", "   (min-width: 768px)   ");
		expect(result).toBe("@media    (min-width: 768px)   ");
	});

	it("should handle special characters in identifier", () => {
		const result = genAtRuleQuery("-webkit-keyframes", "bounce");
		expect(result).toBe("@-webkit-keyframes bounce");
	});

	it("should handle multiple conditions in supports", () => {
		const result = genAtRuleQuery("supports", "(display: grid) and (aspect-ratio: 1/1)");
		expect(result).toBe("@supports (display: grid) and (aspect-ratio: 1/1)");
	});

	it("should handle not operator in supports", () => {
		const result = genAtRuleQuery("supports", "not (display: grid)");
		expect(result).toBe("@supports not (display: grid)");
	});

	it("should handle or operator in supports", () => {
		const result = genAtRuleQuery("supports", "(display: flex) or (display: grid)");
		expect(result).toBe("@supports (display: flex) or (display: grid)");
	});

	it("should preserve exact spacing in complex queries", () => {
		const result = genAtRuleQuery("media", "(prefers-color-scheme: dark) and (min-width: 900px)");
		expect(result).toBe("@media (prefers-color-scheme: dark) and (min-width: 900px)");
	});

	it("should handle nested parentheses in queries", () => {
		const result = genAtRuleQuery(
			"supports",
			"((display: flex) and (gap: 1rem)) or (display: grid)",
		);
		expect(result).toBe("@supports ((display: flex) and (gap: 1rem)) or (display: grid)");
	});
});
