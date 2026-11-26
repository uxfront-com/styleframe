import { describe, expect, it } from "vitest";

import { genSelector } from "./genSelector";

describe("genSelector", () => {
	it("should generate a selector with empty declarations", () => {
		const result = genSelector(".container", []);
		expect(result).toBe(".container {}");
	});

	it("should generate a selector with a single declaration", () => {
		const result = genSelector(".button", ["color: red;"]);
		expect(result).toBe(".button {\n\tcolor: red;\n}");
	});

	it("should generate a selector with multiple declarations", () => {
		const result = genSelector(".card", ["color: red;", "background: blue;", "margin: 10px;"]);
		expect(result).toBe(".card {\n\tcolor: red;\n\tbackground: blue;\n\tmargin: 10px;\n}");
	});

	it("should handle class selectors", () => {
		const result = genSelector(".primary-button", ["display: inline-block;"]);
		expect(result).toBe(".primary-button {\n\tdisplay: inline-block;\n}");
	});

	it("should handle id selectors", () => {
		const result = genSelector("#header", ["height: 60px;"]);
		expect(result).toBe("#header {\n\theight: 60px;\n}");
	});

	it("should handle element selectors", () => {
		const result = genSelector("body", ["margin: 0;", "padding: 0;"]);
		expect(result).toBe("body {\n\tmargin: 0;\n\tpadding: 0;\n}");
	});

	it("should handle attribute selectors", () => {
		const result = genSelector("[type='text']", ["border: 1px solid #ccc;"]);
		expect(result).toBe("[type='text'] {\n\tborder: 1px solid #ccc;\n}");
	});

	it("should handle pseudo-class selectors", () => {
		const result = genSelector(".link:hover", ["color: blue;"]);
		expect(result).toBe(".link:hover {\n\tcolor: blue;\n}");
	});

	it("should handle pseudo-element selectors", () => {
		const result = genSelector(".text::before", ["content: '→';"]);
		expect(result).toBe(".text::before {\n\tcontent: '→';\n}");
	});

	it("should handle multiple pseudo-classes", () => {
		const result = genSelector("input:focus:valid", ["border-color: green;"]);
		expect(result).toBe("input:focus:valid {\n\tborder-color: green;\n}");
	});

	it("should handle descendant combinators", () => {
		const result = genSelector(".container .item", ["padding: 10px;"]);
		expect(result).toBe(".container .item {\n\tpadding: 10px;\n}");
	});

	it("should handle child combinators", () => {
		const result = genSelector("ul > li", ["list-style: none;"]);
		expect(result).toBe("ul > li {\n\tlist-style: none;\n}");
	});

	it("should handle adjacent sibling combinators", () => {
		const result = genSelector("h1 + p", ["margin-top: 0;"]);
		expect(result).toBe("h1 + p {\n\tmargin-top: 0;\n}");
	});

	it("should handle general sibling combinators", () => {
		const result = genSelector("h1 ~ p", ["color: gray;"]);
		expect(result).toBe("h1 ~ p {\n\tcolor: gray;\n}");
	});

	it("should handle multiple selectors", () => {
		const result = genSelector("h1, h2, h3", ["font-family: sans-serif;"]);
		expect(result).toBe("h1, h2, h3 {\n\tfont-family: sans-serif;\n}");
	});

	it("should handle universal selector", () => {
		const result = genSelector("*", ["box-sizing: border-box;"]);
		expect(result).toBe("* {\n\tbox-sizing: border-box;\n}");
	});

	it("should handle complex attribute selectors", () => {
		const result = genSelector("[class*='btn-']", ["border-radius: 4px;"]);
		expect(result).toBe("[class*='btn-'] {\n\tborder-radius: 4px;\n}");
	});

	it("should handle :not() pseudo-class", () => {
		const result = genSelector("input:not([type='submit'])", ["background: white;"]);
		expect(result).toBe("input:not([type='submit']) {\n\tbackground: white;\n}");
	});

	it("should handle :nth-child() pseudo-class", () => {
		const result = genSelector("li:nth-child(2n)", ["background: #f0f0f0;"]);
		expect(result).toBe("li:nth-child(2n) {\n\tbackground: #f0f0f0;\n}");
	});

	it("should handle :is() pseudo-class", () => {
		const result = genSelector(":is(h1, h2, h3)", ["margin-top: 1rem;"]);
		expect(result).toBe(":is(h1, h2, h3) {\n\tmargin-top: 1rem;\n}");
	});

	it("should handle :where() pseudo-class", () => {
		const result = genSelector(":where(.card, .panel)", ["border: 1px solid;"]);
		expect(result).toBe(":where(.card, .panel) {\n\tborder: 1px solid;\n}");
	});

	it("should handle :has() pseudo-class", () => {
		const result = genSelector(".container:has(> img)", ["display: flex;"]);
		expect(result).toBe(".container:has(> img) {\n\tdisplay: flex;\n}");
	});

	it("should handle namespace selectors", () => {
		const result = genSelector("svg|circle", ["fill: red;"]);
		expect(result).toBe("svg|circle {\n\tfill: red;\n}");
	});

	it("should handle complex nested selectors", () => {
		const result = genSelector(".container > .row .col:first-child::before", ["content: '';"]);
		expect(result).toBe(".container > .row .col:first-child::before {\n\tcontent: '';\n}");
	});

	it("should handle selectors with special characters", () => {
		const result = genSelector(String.raw`.btn-primary\:hover`, ["opacity: 0.8;"]);
		expect(result).toBe(".btn-primary\\:hover {\n\topacity: 0.8;\n}");
	});

	it("should handle case-sensitive attribute selectors", () => {
		const result = genSelector("[data-state='active' s]", ["color: green;"]);
		expect(result).toBe("[data-state='active' s] {\n\tcolor: green;\n}");
	});

	it("should handle case-insensitive attribute selectors", () => {
		const result = genSelector("[type='email' i]", ["text-transform: lowercase;"]);
		expect(result).toBe("[type='email' i] {\n\ttext-transform: lowercase;\n}");
	});

	it("should handle :root selector", () => {
		const result = genSelector(":root", ["--primary-color: #007bff;", "--font-size: 16px;"]);
		expect(result).toBe(":root {\n\t--primary-color: #007bff;\n\t--font-size: 16px;\n}");
	});

	it("should handle :host selector", () => {
		const result = genSelector(":host", ["display: block;"]);
		expect(result).toBe(":host {\n\tdisplay: block;\n}");
	});

	it("should handle :host() with argument", () => {
		const result = genSelector(":host(.dark)", ["background: black;"]);
		expect(result).toBe(":host(.dark) {\n\tbackground: black;\n}");
	});

	it("should handle ::slotted() pseudo-element", () => {
		const result = genSelector("::slotted(span)", ["color: red;"]);
		expect(result).toBe("::slotted(span) {\n\tcolor: red;\n}");
	});

	it("should handle :nth-of-type() pseudo-class", () => {
		const result = genSelector("p:nth-of-type(3)", ["font-weight: bold;"]);
		expect(result).toBe("p:nth-of-type(3) {\n\tfont-weight: bold;\n}");
	});

	it("should handle :first-child pseudo-class", () => {
		const result = genSelector("li:first-child", ["margin-top: 0;"]);
		expect(result).toBe("li:first-child {\n\tmargin-top: 0;\n}");
	});

	it("should handle :last-child pseudo-class", () => {
		const result = genSelector("li:last-child", ["margin-bottom: 0;"]);
		expect(result).toBe("li:last-child {\n\tmargin-bottom: 0;\n}");
	});

	it("should handle :only-child pseudo-class", () => {
		const result = genSelector(".item:only-child", ["width: 100%;"]);
		expect(result).toBe(".item:only-child {\n\twidth: 100%;\n}");
	});

	it("should handle :empty pseudo-class", () => {
		const result = genSelector("div:empty", ["display: none;"]);
		expect(result).toBe("div:empty {\n\tdisplay: none;\n}");
	});

	it("should handle :target pseudo-class", () => {
		const result = genSelector(":target", ["background: yellow;"]);
		expect(result).toBe(":target {\n\tbackground: yellow;\n}");
	});

	it("should handle :checked pseudo-class", () => {
		const result = genSelector("input:checked", ["opacity: 1;"]);
		expect(result).toBe("input:checked {\n\topacity: 1;\n}");
	});

	it("should handle :disabled pseudo-class", () => {
		const result = genSelector("button:disabled", ["cursor: not-allowed;"]);
		expect(result).toBe("button:disabled {\n\tcursor: not-allowed;\n}");
	});

	it("should handle :enabled pseudo-class", () => {
		const result = genSelector("input:enabled", ["background: white;"]);
		expect(result).toBe("input:enabled {\n\tbackground: white;\n}");
	});

	it("should handle :read-only pseudo-class", () => {
		const result = genSelector("input:read-only", ["background: #f5f5f5;"]);
		expect(result).toBe("input:read-only {\n\tbackground: #f5f5f5;\n}");
	});

	it("should handle :read-write pseudo-class", () => {
		const result = genSelector("input:read-write", ["background: white;"]);
		expect(result).toBe("input:read-write {\n\tbackground: white;\n}");
	});

	it("should handle :placeholder-shown pseudo-class", () => {
		const result = genSelector("input:placeholder-shown", ["opacity: 0.5;"]);
		expect(result).toBe("input:placeholder-shown {\n\topacity: 0.5;\n}");
	});

	it("should handle :valid pseudo-class", () => {
		const result = genSelector("input:valid", ["border-color: green;"]);
		expect(result).toBe("input:valid {\n\tborder-color: green;\n}");
	});

	it("should handle :invalid pseudo-class", () => {
		const result = genSelector("input:invalid", ["border-color: red;"]);
		expect(result).toBe("input:invalid {\n\tborder-color: red;\n}");
	});

	it("should handle :in-range pseudo-class", () => {
		const result = genSelector("input:in-range", ["background: lightgreen;"]);
		expect(result).toBe("input:in-range {\n\tbackground: lightgreen;\n}");
	});

	it("should handle :out-of-range pseudo-class", () => {
		const result = genSelector("input:out-of-range", ["background: lightcoral;"]);
		expect(result).toBe("input:out-of-range {\n\tbackground: lightcoral;\n}");
	});

	it("should handle :required pseudo-class", () => {
		const result = genSelector("input:required", ["border-width: 2px;"]);
		expect(result).toBe("input:required {\n\tborder-width: 2px;\n}");
	});

	it("should handle :optional pseudo-class", () => {
		const result = genSelector("input:optional", ["border-width: 1px;"]);
		expect(result).toBe("input:optional {\n\tborder-width: 1px;\n}");
	});

	it("should handle ::placeholder pseudo-element", () => {
		const result = genSelector("input::placeholder", ["color: #999;"]);
		expect(result).toBe("input::placeholder {\n\tcolor: #999;\n}");
	});

	it("should handle ::selection pseudo-element", () => {
		const result = genSelector("::selection", ["background: blue;", "color: white;"]);
		expect(result).toBe("::selection {\n\tbackground: blue;\n\tcolor: white;\n}");
	});

	it("should handle ::first-line pseudo-element", () => {
		const result = genSelector("p::first-line", ["font-weight: bold;"]);
		expect(result).toBe("p::first-line {\n\tfont-weight: bold;\n}");
	});

	it("should handle ::first-letter pseudo-element", () => {
		const result = genSelector("p::first-letter", ["font-size: 2em;", "float: left;"]);
		expect(result).toBe("p::first-letter {\n\tfont-size: 2em;\n\tfloat: left;\n}");
	});

	it("should handle ::backdrop pseudo-element", () => {
		const result = genSelector("dialog::backdrop", ["background: rgba(0,0,0,0.5);"]);
		expect(result).toBe("dialog::backdrop {\n\tbackground: rgba(0,0,0,0.5);\n}");
	});

	it("should handle ::marker pseudo-element", () => {
		const result = genSelector("li::marker", ["color: red;"]);
		expect(result).toBe("li::marker {\n\tcolor: red;\n}");
	});

	it("should handle complex declarations with selector", () => {
		const result = genSelector(".gradient-box", [
			"background: linear-gradient(to right, red, blue);",
			"box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);",
		]);
		expect(result).toBe(
			".gradient-box {\n\tbackground: linear-gradient(to right, red, blue);\n\tbox-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n}",
		);
	});

	it("should handle selectors with media query-like syntax", () => {
		const result = genSelector("@media (min-width: 768px)", ["display: flex;"]);
		expect(result).toBe("@media (min-width: 768px) {\n\tdisplay: flex;\n}");
	});

	it("should handle very long selector strings", () => {
		const longSelector = ".container .section .row .column .card .header .title .text";
		const result = genSelector(longSelector, ["color: blue;"]);
		expect(result).toBe(`${longSelector} {\n\tcolor: blue;\n}`);
	});

	it("should handle selector with trailing whitespace", () => {
		const result = genSelector(".button  ", ["padding: 10px;"]);
		expect(result).toBe(".button   {\n\tpadding: 10px;\n}");
	});

	it("should handle selector with leading whitespace", () => {
		const result = genSelector("  .button", ["padding: 10px;"]);
		expect(result).toBe("  .button {\n\tpadding: 10px;\n}");
	});

	it("should handle complex selector with all combinator types", () => {
		const result = genSelector(".parent > .child + .sibling ~ .distant", ["display: block;"]);
		expect(result).toBe(".parent > .child + .sibling ~ .distant {\n\tdisplay: block;\n}");
	});
});
