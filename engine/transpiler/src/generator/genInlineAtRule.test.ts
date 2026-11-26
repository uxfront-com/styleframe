import { describe, expect, it } from "vitest";

import { genInlineAtRule } from "./genInlineAtRule";

describe("genInlineAtRule", () => {
	it("should generate a basic import rule", () => {
		const result = genInlineAtRule("import", "url('styles.css')");
		expect(result).toBe("@import url('styles.css');");
	});

	it("should generate a charset rule", () => {
		const result = genInlineAtRule("charset", '"UTF-8"');
		expect(result).toBe('@charset "UTF-8";');
	});

	it("should generate a namespace rule", () => {
		const result = genInlineAtRule("namespace", "url(http://www.w3.org/1999/xhtml)");
		expect(result).toBe("@namespace url(http://www.w3.org/1999/xhtml);");
	});

	it("should generate a namespace rule with prefix", () => {
		const result = genInlineAtRule("namespace", "svg url(http://www.w3.org/2000/svg)");
		expect(result).toBe("@namespace svg url(http://www.w3.org/2000/svg);");
	});

	it("should generate an import rule with media query", () => {
		const result = genInlineAtRule("import", "url('print.css') print");
		expect(result).toBe("@import url('print.css') print;");
	});

	it("should generate an import rule with complex media query", () => {
		const result = genInlineAtRule("import", "url('mobile.css') screen and (max-width: 768px)");
		expect(result).toBe("@import url('mobile.css') screen and (max-width: 768px);");
	});

	it("should generate an import rule with supports condition", () => {
		const result = genInlineAtRule("import", "url('grid.css') supports(display: grid)");
		expect(result).toBe("@import url('grid.css') supports(display: grid);");
	});

	it("should generate an import rule with layer", () => {
		const result = genInlineAtRule("import", "url('utilities.css') layer(utilities)");
		expect(result).toBe("@import url('utilities.css') layer(utilities);");
	});

	it("should handle import with relative path", () => {
		const result = genInlineAtRule("import", "'./components/button.css'");
		expect(result).toBe("@import './components/button.css';");
	});

	it("should handle import with absolute path", () => {
		const result = genInlineAtRule("import", "'/styles/global.css'");
		expect(result).toBe("@import '/styles/global.css';");
	});

	it("should handle import from node_modules", () => {
		const result = genInlineAtRule("import", "'normalize.css'");
		expect(result).toBe("@import 'normalize.css';");
	});

	it("should handle import with HTTP URL", () => {
		const result = genInlineAtRule("import", "url('http://example.com/style.css')");
		expect(result).toBe("@import url('http://example.com/style.css');");
	});

	it("should handle import with HTTPS URL", () => {
		const result = genInlineAtRule("import", "url('https://fonts.googleapis.com/css')");
		expect(result).toBe("@import url('https://fonts.googleapis.com/css');");
	});

	it("should handle import with data URI", () => {
		const result = genInlineAtRule("import", "url('data:text/css,body{margin:0}')");
		expect(result).toBe("@import url('data:text/css,body{margin:0}');");
	});

	it("should handle charset with different encodings", () => {
		const result = genInlineAtRule("charset", '"ISO-8859-1"');
		expect(result).toBe('@charset "ISO-8859-1";');
	});

	it("should handle namespace with default namespace", () => {
		const result = genInlineAtRule("namespace", "url(http://www.w3.org/1999/xhtml)");
		expect(result).toBe("@namespace url(http://www.w3.org/1999/xhtml);");
	});

	it("should handle namespace with XML namespace", () => {
		const result = genInlineAtRule("namespace", "xml url(http://www.w3.org/XML/1998/namespace)");
		expect(result).toBe("@namespace xml url(http://www.w3.org/XML/1998/namespace);");
	});

	it("should handle empty rule string", () => {
		const result = genInlineAtRule("import", "");
		expect(result).toBe("@import;");
	});

	it("should handle whitespace in rule string", () => {
		const result = genInlineAtRule("import", "   url('styles.css')   ");
		expect(result).toBe("@import    url('styles.css')   ;");
	});

	it("should handle layer statement", () => {
		const result = genInlineAtRule("layer", "reset");
		expect(result).toBe("@layer reset;");
	});

	it("should handle layer with multiple layers", () => {
		const result = genInlineAtRule("layer", "reset, base, utilities");
		expect(result).toBe("@layer reset, base, utilities;");
	});

	it("should handle property rule (although typically used with blocks)", () => {
		const result = genInlineAtRule("property", "--my-color");
		expect(result).toBe("@property --my-color;");
	});

	it("should handle counter-style (although typically used with blocks)", () => {
		const result = genInlineAtRule("counter-style", "custom-counter");
		expect(result).toBe("@counter-style custom-counter;");
	});

	it("should handle vendor-prefixed at-rules", () => {
		const result = genInlineAtRule("-webkit-keyframes", "bounce");
		expect(result).toBe("@-webkit-keyframes bounce;");
	});

	it("should handle import with multiple conditions", () => {
		const result = genInlineAtRule(
			"import",
			"url('styles.css') screen and (min-width: 768px) and (orientation: landscape)",
		);
		expect(result).toBe(
			"@import url('styles.css') screen and (min-width: 768px) and (orientation: landscape);",
		);
	});

	it("should handle import with nested parentheses", () => {
		const result = genInlineAtRule(
			"import",
			"url('modern.css') supports((display: grid) and (gap: 1rem))",
		);
		expect(result).toBe("@import url('modern.css') supports((display: grid) and (gap: 1rem));");
	});

	it("should handle import with layer and supports", () => {
		const result = genInlineAtRule(
			"import",
			"url('framework.css') layer(framework) supports(display: flex)",
		);
		expect(result).toBe("@import url('framework.css') layer(framework) supports(display: flex);");
	});

	it("should preserve exact spacing in complex rules", () => {
		const result = genInlineAtRule(
			"import",
			"url('responsive.css')  screen  and  (min-width: 768px)",
		);
		expect(result).toBe("@import url('responsive.css')  screen  and  (min-width: 768px);");
	});

	it("should handle import with query parameters in URL", () => {
		const result = genInlineAtRule(
			"import",
			"url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap')",
		);
		expect(result).toBe(
			"@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');",
		);
	});

	it("should handle import with hash in URL", () => {
		const result = genInlineAtRule("import", "url('styles.css#section')");
		expect(result).toBe("@import url('styles.css#section');");
	});

	it("should handle import with special characters in filename", () => {
		const result = genInlineAtRule("import", "url('my-styles_v2.0.css')");
		expect(result).toBe("@import url('my-styles_v2.0.css');");
	});

	it("should handle namespace with custom prefix", () => {
		const result = genInlineAtRule("namespace", "custom url(http://custom.namespace.com)");
		expect(result).toBe("@namespace custom url(http://custom.namespace.com);");
	});

	it("should handle import with base64 encoded data URI", () => {
		const result = genInlineAtRule(
			"import",
			"url('data:text/css;base64,Ym9keSB7IG1hcmdpbjogMDsgfQ==')",
		);
		expect(result).toBe("@import url('data:text/css;base64,Ym9keSB7IG1hcmdpbjogMDsgfQ==');");
	});

	it("should handle import with UTF-8 encoded data URI", () => {
		const result = genInlineAtRule(
			"import",
			"url('data:text/css;charset=utf-8,body%20%7B%20margin%3A%200%3B%20%7D')",
		);
		expect(result).toBe(
			"@import url('data:text/css;charset=utf-8,body%20%7B%20margin%3A%200%3B%20%7D');",
		);
	});

	it("should handle import with single quotes", () => {
		const result = genInlineAtRule("import", "'styles.css'");
		expect(result).toBe("@import 'styles.css';");
	});

	it("should handle import with double quotes", () => {
		const result = genInlineAtRule("import", '"styles.css"');
		expect(result).toBe('@import "styles.css";');
	});

	it("should handle import without quotes (bare URL)", () => {
		const result = genInlineAtRule("import", "styles.css");
		expect(result).toBe("@import styles.css;");
	});

	it("should handle layer with nested layer names", () => {
		const result = genInlineAtRule("layer", "framework.components.buttons");
		expect(result).toBe("@layer framework.components.buttons;");
	});

	it("should handle import with print media type", () => {
		const result = genInlineAtRule("import", "'print.css' print");
		expect(result).toBe("@import 'print.css' print;");
	});

	it("should handle import with screen media type", () => {
		const result = genInlineAtRule("import", "'screen.css' screen");
		expect(result).toBe("@import 'screen.css' screen;");
	});

	it("should handle import with all media type", () => {
		const result = genInlineAtRule("import", "'all.css' all");
		expect(result).toBe("@import 'all.css' all;");
	});

	it("should handle import with speech media type", () => {
		const result = genInlineAtRule("import", "'speech.css' speech");
		expect(result).toBe("@import 'speech.css' speech;");
	});

	it("should handle import with media feature queries", () => {
		const result = genInlineAtRule("import", "'dark.css' (prefers-color-scheme: dark)");
		expect(result).toBe("@import 'dark.css' (prefers-color-scheme: dark);");
	});

	it("should handle import with reduced motion query", () => {
		const result = genInlineAtRule(
			"import",
			"'animations.css' (prefers-reduced-motion: no-preference)",
		);
		expect(result).toBe("@import 'animations.css' (prefers-reduced-motion: no-preference);");
	});

	it("should handle import with high contrast query", () => {
		const result = genInlineAtRule("import", "'high-contrast.css' (prefers-contrast: high)");
		expect(result).toBe("@import 'high-contrast.css' (prefers-contrast: high);");
	});

	it("should handle import with orientation query", () => {
		const result = genInlineAtRule("import", "'landscape.css' (orientation: landscape)");
		expect(result).toBe("@import 'landscape.css' (orientation: landscape);");
	});

	it("should handle import with aspect ratio query", () => {
		const result = genInlineAtRule("import", "'wide.css' (min-aspect-ratio: 16/9)");
		expect(result).toBe("@import 'wide.css' (min-aspect-ratio: 16/9);");
	});

	it("should handle import with resolution query", () => {
		const result = genInlineAtRule("import", "'retina.css' (min-resolution: 2dppx)");
		expect(result).toBe("@import 'retina.css' (min-resolution: 2dppx);");
	});

	it("should handle import with not operator", () => {
		const result = genInlineAtRule("import", "'desktop.css' not (max-width: 768px)");
		expect(result).toBe("@import 'desktop.css' not (max-width: 768px);");
	});

	it("should handle import with only operator", () => {
		const result = genInlineAtRule("import", "'screen.css' only screen");
		expect(result).toBe("@import 'screen.css' only screen;");
	});
});
