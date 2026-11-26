import { describe, expect, it } from "vitest";

import {
	extractClasses,
	extractFromHTML,
	extractFromJSX,
	extractFromStringLiterals,
	extractFromSvelte,
	extractFromVue,
} from "./extractor";

describe("extractFromHTML", () => {
	it("should extract classes from class attribute with double quotes", () => {
		const content = '<div class="_margin:sm _padding:md">content</div>';
		const result = extractFromHTML(content);

		expect(result).toContain("_margin:sm");
		expect(result).toContain("_padding:md");
	});

	it("should extract classes from class attribute with single quotes", () => {
		const content = "<div class='_margin:sm _padding:md'>content</div>";
		const result = extractFromHTML(content);

		expect(result).toContain("_margin:sm");
		expect(result).toContain("_padding:md");
	});

	it("should extract from multiple elements", () => {
		const content = `
			<div class="_margin:sm">
				<span class="_text:lg">
					<button class="_hover:background:primary">Click</button>
				</span>
			</div>
		`;
		const result = extractFromHTML(content);

		expect(result).toContain("_margin:sm");
		expect(result).toContain("_text:lg");
		expect(result).toContain("_hover:background:primary");
	});

	it("should handle class with spaces around equals", () => {
		const content = '<div class = "_margin:sm">content</div>';
		const result = extractFromHTML(content);

		expect(result).toContain("_margin:sm");
	});
});

describe("extractFromJSX", () => {
	it("should extract classes from className with string", () => {
		const content = '<div className="_margin:sm _padding:md">content</div>';
		const result = extractFromJSX(content);

		expect(result).toContain("_margin:sm");
		expect(result).toContain("_padding:md");
	});

	it("should extract classes from className with expression", () => {
		const content = `<div className={"_margin:sm"}>content</div>`;
		const result = extractFromJSX(content);

		expect(result).toContain("_margin:sm");
	});

	it("should extract from className with nested braces (object syntax)", () => {
		const content = `<div className={{ '_margin:sm': true, '_padding:md': active }}>content</div>`;
		const result = extractFromJSX(content);

		expect(result).toContain("_margin:sm");
		expect(result).toContain("_padding:md");
	});

	it("should extract from className with clsx and nested objects", () => {
		const content = `<div className={clsx({ '_margin:sm': true }, { '_hover:background:primary': isActive })}>content</div>`;
		const result = extractFromJSX(content);

		expect(result).toContain("_margin:sm");
		expect(result).toContain("_hover:background:primary");
	});

	it("should extract from className with deeply nested braces", () => {
		const content = `<div className={cn('_margin:sm', { '_padding:md': condition }, getClasses({ size: 'lg' }))}>content</div>`;
		const result = extractFromJSX(content);

		expect(result).toContain("_margin:sm");
		expect(result).toContain("_padding:md");
	});

	it("should not extract from unrelated string literals outside className", () => {
		const content = `
			// This comment mentions _margin:sm
			const unrelated = "_padding:md";
			<div className="_text:lg">content</div>
		`;
		const result = extractFromJSX(content);

		// Should only extract from className attribute
		expect(result).toContain("_text:lg");
		expect(result).not.toContain("_margin:sm");
		expect(result).not.toContain("_padding:md");
	});
});

describe("extractFromVue", () => {
	it("should extract from template section", () => {
		const content = `
			<template>
				<div class="_margin:sm">content</div>
			</template>
		`;
		const result = extractFromVue(content);

		expect(result).toContain("_margin:sm");
	});

	it("should extract from :class binding with object syntax", () => {
		const content = `
			<template>
				<div :class="{ '_margin:sm': true, '_padding:md': active }">content</div>
			</template>
		`;
		const result = extractFromVue(content);

		expect(result).toContain("_margin:sm");
		expect(result).toContain("_padding:md");
	});

	it("should extract from script section", () => {
		const content = `
			<template>
				<div>content</div>
			</template>
			<script>
				const styles = "_margin:sm";
			</script>
		`;
		const result = extractFromVue(content);

		expect(result).toContain("_margin:sm");
	});

	it("should extract classes after nested slot templates", () => {
		const content = `
			<template>
				<Header>
					<template #title>Styleframe Playground</template>
					<template #actions>
						<button class="_padding:md">Click</button>
					</template>
				</Header>
				<p class="_margin:0">hello</p>
			</template>
		`;
		const result = extractFromVue(content);

		expect(result).toContain("_padding:md");
		expect(result).toContain("_margin:0");
	});
});

describe("extractFromSvelte", () => {
	it("should extract from class attributes", () => {
		const content = '<div class="_margin:sm _padding:md">content</div>';
		const result = extractFromSvelte(content);

		expect(result).toContain("_margin:sm");
		expect(result).toContain("_padding:md");
	});

	it("should extract from class={...} expressions", () => {
		const content = `<div class={"_margin:sm"}>content</div>`;
		const result = extractFromSvelte(content);

		expect(result).toContain("_margin:sm");
	});

	it("should extract from class:directive syntax", () => {
		const content = `<div class:_margin:sm={isActive}>content</div>`;
		const result = extractFromSvelte(content);

		expect(result).toContain("_margin:sm");
	});

	it("should extract from class:directive with complex utility names", () => {
		const content = `
			<div class:_hover:background:primary={hovered}>content</div>
			<div class:_dark:text:lg={isDark}>content</div>
		`;
		const result = extractFromSvelte(content);

		expect(result).toContain("_hover:background:primary");
		expect(result).toContain("_dark:text:lg");
	});

	it("should extract from class:directive with arbitrary values", () => {
		const content = `<div class:_margin:[16px]={hasMargin}>content</div>`;
		const result = extractFromSvelte(content);

		expect(result).toContain("_margin:[16px]");
	});

	it("should extract from script section", () => {
		const content = `
			<script>
				const styles = "_margin:sm";
			</script>
			<div>content</div>
		`;
		const result = extractFromSvelte(content);

		expect(result).toContain("_margin:sm");
	});

	it("should combine all extraction methods", () => {
		const content = `
			<script>
				const dynamicClass = "_text:xl";
			</script>
			<div class="_margin:sm" class:_padding:md={condition} class={"_background:primary"}>
				content
			</div>
		`;
		const result = extractFromSvelte(content);

		expect(result).toContain("_margin:sm");
		expect(result).toContain("_padding:md");
		expect(result).toContain("_background:primary");
		expect(result).toContain("_text:xl");
	});

	it("should extract custom-prefixed class from class:directive", () => {
		const content = `<div class:sf-margin-sm={isActive}>content</div>`;
		const result = extractFromSvelte(content);

		expect(result).toContain("sf-margin-sm");
	});
});

describe("extractFromStringLiterals", () => {
	it("should extract from single-quoted strings", () => {
		const content = "const a = '_margin:sm';";
		const result = extractFromStringLiterals(content);

		expect(result).toContain("_margin:sm");
	});

	it("should extract from double-quoted strings", () => {
		const content = 'const a = "_margin:sm";';
		const result = extractFromStringLiterals(content);

		expect(result).toContain("_margin:sm");
	});

	it("should extract from template literals", () => {
		const content = "const a = `_margin:sm`;";
		const result = extractFromStringLiterals(content);

		expect(result).toContain("_margin:sm");
	});

	it("should extract from multiple string types", () => {
		const content = `
			const a = '_margin:sm';
			const b = "_padding:md";
			const c = \`_text:lg\`;
		`;
		const result = extractFromStringLiterals(content);

		expect(result).toContain("_margin:sm");
		expect(result).toContain("_padding:md");
		expect(result).toContain("_text:lg");
	});

	it("should handle escaped quotes", () => {
		const content = String.raw`const a = "_margin:sm \"test\"";`;
		const result = extractFromStringLiterals(content);

		expect(result).toContain("_margin:sm");
	});
});

describe("extractClasses", () => {
	it("should use HTML extractor for .html files", () => {
		const content = '<div class="_margin:sm">content</div>';
		const result = extractClasses(content, "test.html");

		expect(result).toContain("_margin:sm");
	});

	it("should use JSX extractor for .tsx files", () => {
		const content = '<div className="_margin:sm">content</div>';
		const result = extractClasses(content, "test.tsx");

		expect(result).toContain("_margin:sm");
	});

	it("should use Vue extractor for .vue files", () => {
		const content = '<template><div class="_margin:sm">content</div></template>';
		const result = extractClasses(content, "test.vue");

		expect(result).toContain("_margin:sm");
	});

	it("should use string literal extractor for .ts files", () => {
		const content = 'const styles = "_margin:sm";';
		const result = extractClasses(content, "test.ts");

		expect(result).toContain("_margin:sm");
	});

	it("should use custom extractor", () => {
		const content = "/* custom: _margin:sm */";
		const customExtractor = (c: string) => {
			const match = c.match(/custom: (_[a-z:]+)/);
			return match ? [match[1]!] : [];
		};
		const result = extractClasses(content, "test.txt", [customExtractor]);

		expect(result).toContain("_margin:sm");
	});

	it("should combine custom and default extractors", () => {
		const content = `
			/* custom: _margin:sm */
			<div class="_padding:md">content</div>
		`;
		const customExtractor = (c: string) => {
			const match = c.match(/custom: (_[a-z:]+)/);
			return match ? [match[1]!] : [];
		};
		const result = extractClasses(content, "test.html", [customExtractor]);

		expect(result).toContain("_margin:sm");
		expect(result).toContain("_padding:md");
	});

	it("should deduplicate results", () => {
		const content = `
			<div class="_margin:sm">content</div>
			<div class="_margin:sm">content</div>
		`;
		const result = extractClasses(content, "test.html");

		expect(result.filter((c) => c === "_margin:sm")).toHaveLength(1);
	});

	it("should use custom utility pattern", () => {
		const content = '<div class="sf-margin-sm sf-padding-md">content</div>';
		const pattern = /sf-[a-zA-Z][a-zA-Z0-9-]*/g;
		const result = extractClasses(content, "test.html", undefined, pattern);

		expect(result).toContain("sf-margin-sm");
		expect(result).toContain("sf-padding-md");
	});

	it("should use custom utility pattern with JSX", () => {
		const content = '<div className="sf-margin-sm sf-padding-md">content</div>';
		const pattern = /sf-[a-zA-Z][a-zA-Z0-9-]*/g;
		const result = extractClasses(content, "test.tsx", undefined, pattern);

		expect(result).toContain("sf-margin-sm");
		expect(result).toContain("sf-padding-md");
	});
});
