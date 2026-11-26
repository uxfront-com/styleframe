import { describe, expect, it } from "vitest";
import { genDeclarationsBlock } from "./genDeclarationsBlock";

describe("genDeclarationsBlock", () => {
	it("should generate an empty block for empty declarations array", () => {
		const result = genDeclarationsBlock([]);
		expect(result).toBe("{}");
	});

	it("should generate a block with a single declaration", () => {
		const result = genDeclarationsBlock(["color: red;"]);
		expect(result).toBe("{\n\tcolor: red;\n}");
	});

	it("should generate a block with multiple declarations", () => {
		const result = genDeclarationsBlock([
			"color: red;",
			"background: blue;",
			"margin: 10px;",
		]);
		expect(result).toBe(
			"{\n\tcolor: red;\n\tbackground: blue;\n\tmargin: 10px;\n}",
		);
	});

	it("should handle declarations with complex values", () => {
		const result = genDeclarationsBlock([
			"background: linear-gradient(to right, red, blue);",
			"box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);",
		]);
		expect(result).toBe(
			"{\n\tbackground: linear-gradient(to right, red, blue);\n\tbox-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n}",
		);
	});

	it("should handle CSS custom properties", () => {
		const result = genDeclarationsBlock([
			"--primary-color: #007bff;",
			"--spacing: 1rem;",
			"color: var(--primary-color);",
		]);
		expect(result).toBe(
			"{\n\t--primary-color: #007bff;\n\t--spacing: 1rem;\n\tcolor: var(--primary-color);\n}",
		);
	});

	it("should handle declarations with !important", () => {
		const result = genDeclarationsBlock([
			"color: red !important;",
			"display: none !important;",
		]);
		expect(result).toBe(
			"{\n\tcolor: red !important;\n\tdisplay: none !important;\n}",
		);
	});

	it("should handle vendor-prefixed properties", () => {
		const result = genDeclarationsBlock([
			"-webkit-transform: rotate(45deg);",
			"-moz-transform: rotate(45deg);",
			"transform: rotate(45deg);",
		]);
		expect(result).toBe(
			"{\n\t-webkit-transform: rotate(45deg);\n\t-moz-transform: rotate(45deg);\n\ttransform: rotate(45deg);\n}",
		);
	});

	it("should handle declarations with calc() values", () => {
		const result = genDeclarationsBlock([
			"width: calc(100% - 20px);",
			"height: calc(100vh - 80px);",
		]);
		expect(result).toBe(
			"{\n\twidth: calc(100% - 20px);\n\theight: calc(100vh - 80px);\n}",
		);
	});

	it("should handle declarations with url() values", () => {
		const result = genDeclarationsBlock([
			"background-image: url('image.jpg');",
			"cursor: url('cursor.png'), auto;",
		]);
		expect(result).toBe(
			"{\n\tbackground-image: url('image.jpg');\n\tcursor: url('cursor.png'), auto;\n}",
		);
	});

	it("should handle grid and flexbox properties", () => {
		const result = genDeclarationsBlock([
			"display: grid;",
			"grid-template-columns: repeat(3, 1fr);",
			"gap: 20px;",
			"align-items: center;",
		]);
		expect(result).toBe(
			"{\n\tdisplay: grid;\n\tgrid-template-columns: repeat(3, 1fr);\n\tgap: 20px;\n\talign-items: center;\n}",
		);
	});

	it("should handle animation and transition properties", () => {
		const result = genDeclarationsBlock([
			"animation: slide 2s ease-in-out infinite;",
			"transition: all 0.3s ease;",
		]);
		expect(result).toBe(
			"{\n\tanimation: slide 2s ease-in-out infinite;\n\ttransition: all 0.3s ease;\n}",
		);
	});

	it("should handle shorthand properties", () => {
		const result = genDeclarationsBlock([
			"margin: 10px 20px 30px 40px;",
			"padding: 10px;",
			"border: 1px solid #ccc;",
		]);
		expect(result).toBe(
			"{\n\tmargin: 10px 20px 30px 40px;\n\tpadding: 10px;\n\tborder: 1px solid #ccc;\n}",
		);
	});

	it("should handle font properties", () => {
		const result = genDeclarationsBlock([
			"font-family: 'Helvetica Neue', Arial, sans-serif;",
			"font-size: 16px;",
			"font-weight: bold;",
			"line-height: 1.5;",
		]);
		expect(result).toBe(
			"{\n\tfont-family: 'Helvetica Neue', Arial, sans-serif;\n\tfont-size: 16px;\n\tfont-weight: bold;\n\tline-height: 1.5;\n}",
		);
	});

	it("should handle transform functions", () => {
		const result = genDeclarationsBlock([
			"transform: translateX(50%) rotate(45deg) scale(1.5);",
		]);
		expect(result).toBe(
			"{\n\ttransform: translateX(50%) rotate(45deg) scale(1.5);\n}",
		);
	});

	it("should handle filter functions", () => {
		const result = genDeclarationsBlock([
			"filter: blur(5px) brightness(1.5) contrast(2);",
		]);
		expect(result).toBe(
			"{\n\tfilter: blur(5px) brightness(1.5) contrast(2);\n}",
		);
	});

	it("should handle declarations with empty values", () => {
		const result = genDeclarationsBlock(["content: '';", 'content: "";']);
		expect(result).toBe("{\n\tcontent: '';\n\tcontent: \"\";\n}");
	});

	it("should handle declarations with special characters", () => {
		const result = genDeclarationsBlock([
			String.raw`content: '\2022';`,
			String.raw`content: '\00a0';`,
		]);
		expect(result).toBe("{\n\tcontent: '\\2022';\n\tcontent: '\\00a0';\n}");
	});

	it("should handle declarations with data URIs", () => {
		const result = genDeclarationsBlock([
			"background-image: url('data:image/png;base64,iVBORw0KGgo...');",
		]);
		expect(result).toBe(
			"{\n\tbackground-image: url('data:image/png;base64,iVBORw0KGgo...');\n}",
		);
	});

	it("should handle CSS math functions", () => {
		const result = genDeclarationsBlock([
			"width: min(100%, 500px);",
			"height: max(50vh, 300px);",
			"font-size: clamp(1rem, 2vw, 3rem);",
		]);
		expect(result).toBe(
			"{\n\twidth: min(100%, 500px);\n\theight: max(50vh, 300px);\n\tfont-size: clamp(1rem, 2vw, 3rem);\n}",
		);
	});

	it("should handle CSS logical properties", () => {
		const result = genDeclarationsBlock([
			"margin-block-start: 1rem;",
			"padding-inline-end: 2rem;",
			"border-block-end: 1px solid black;",
		]);
		expect(result).toBe(
			"{\n\tmargin-block-start: 1rem;\n\tpadding-inline-end: 2rem;\n\tborder-block-end: 1px solid black;\n}",
		);
	});

	it("should handle CSS environment variables", () => {
		const result = genDeclarationsBlock([
			"padding-top: env(safe-area-inset-top);",
			"padding-bottom: env(safe-area-inset-bottom);",
		]);
		expect(result).toBe(
			"{\n\tpadding-top: env(safe-area-inset-top);\n\tpadding-bottom: env(safe-area-inset-bottom);\n}",
		);
	});

	it("should handle CSS counters", () => {
		const result = genDeclarationsBlock([
			"counter-reset: section;",
			"counter-increment: section;",
			"content: counter(section);",
		]);
		expect(result).toBe(
			"{\n\tcounter-reset: section;\n\tcounter-increment: section;\n\tcontent: counter(section);\n}",
		);
	});

	it("should handle CSS attr() function", () => {
		const result = genDeclarationsBlock([
			"content: attr(data-label);",
			"content: attr(href);",
		]);
		expect(result).toBe(
			"{\n\tcontent: attr(data-label);\n\tcontent: attr(href);\n}",
		);
	});

	it("should handle single declaration without array wrapper", () => {
		const result = genDeclarationsBlock(["display: block;"]);
		expect(result).toBe("{\n\tdisplay: block;\n}");
	});

	it("should preserve exact declaration strings", () => {
		const result = genDeclarationsBlock([
			"color:red;",
			"background:    blue    ;",
			"margin:10px 20px;",
		]);
		expect(result).toBe(
			"{\n\tcolor:red;\n\tbackground:    blue    ;\n\tmargin:10px 20px;\n}",
		);
	});

	it("should handle declarations with newlines in values", () => {
		const result = genDeclarationsBlock([
			"white-space: pre-wrap;",
			String.raw`content: 'Line 1\A Line 2';`,
		]);
		expect(result).toBe(
			"{\n\twhite-space: pre-wrap;\n\tcontent: 'Line 1\\A Line 2';\n}",
		);
	});

	it("should handle very long declaration values", () => {
		const longGradient =
			"linear-gradient(to right, red 0%, orange 10%, yellow 20%, green 30%, blue 40%, indigo 50%, violet 60%, red 70%, orange 80%, yellow 90%, green 100%)";
		const result = genDeclarationsBlock([`background: ${longGradient};`]);
		expect(result).toBe(`{\n\tbackground: ${longGradient};\n}`);
	});

	it("should handle declarations with multiple semicolons", () => {
		const result = genDeclarationsBlock(["content: ';';", "content: ';;';"]);
		expect(result).toBe("{\n\tcontent: ';';\n\tcontent: ';;';\n}");
	});

	it("should handle CSS container queries", () => {
		const result = genDeclarationsBlock([
			"container-type: inline-size;",
			"container-name: sidebar;",
		]);
		expect(result).toBe(
			"{\n\tcontainer-type: inline-size;\n\tcontainer-name: sidebar;\n}",
		);
	});

	it("should handle CSS cascade layers", () => {
		const result = genDeclarationsBlock(["layer: utilities;", "layer: base;"]);
		expect(result).toBe("{\n\tlayer: utilities;\n\tlayer: base;\n}");
	});
});
