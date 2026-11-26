import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useDirectionalModifiers } from "./useDirectionalModifiers";

describe("useDirectionalModifiers", () => {
	it("should register all directional modifier factories", () => {
		const s = styleframe();
		const modifiers = useDirectionalModifiers(s);

		expect(modifiers.rtl.key).toEqual(["rtl"]);
		expect(modifiers.ltr.key).toEqual(["ltr"]);
	});

	it("should add modifiers to root.modifiers", () => {
		const s = styleframe();
		useDirectionalModifiers(s);

		expect(s.root.modifiers).toHaveLength(2);
	});

	it("should generate correct CSS class names for rtl modifier", () => {
		const s = styleframe();
		const { rtl } = useDirectionalModifiers(s);

		const createMarginLeft = s.utility("margin-left", ({ value }) => ({
			marginLeft: value,
		}));
		createMarginLeft({ sm: "0.5rem" }, [rtl]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._margin-left\:sm {`);
		expect(css).toContain(String.raw`._rtl\:margin-left\:sm {`);
	});

	it("should generate correct CSS class names for ltr modifier", () => {
		const s = styleframe();
		const { ltr } = useDirectionalModifiers(s);

		const createTextAlign = s.utility("text-align", ({ value }) => ({
			textAlign: value,
		}));
		createTextAlign({ left: "left" }, [ltr]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._text-align\:left {`);
		expect(css).toContain(String.raw`._ltr\:text-align\:left {`);
	});

	it("should work with utility creation", () => {
		const s = styleframe();
		const { rtl } = useDirectionalModifiers(s);

		const createPadding = s.utility("padding-left", ({ value }) => ({
			paddingLeft: value,
		}));
		createPadding({ md: "1rem" }, [rtl]);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "padding-left",
		);
		expect(utilities).toHaveLength(2);

		const rtlUtility = utilities.find((u) => u.modifiers.includes("rtl"));
		expect(rtlUtility).toBeDefined();
	});
});
