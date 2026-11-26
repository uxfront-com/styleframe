import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { usePseudoStateModifiers } from "./usePseudoStateModifiers";

describe("usePseudoStateModifiers", () => {
	it("should register all pseudo-state modifier factories", () => {
		const s = styleframe();
		const modifiers = usePseudoStateModifiers(s);

		expect(modifiers.hover).toBeDefined();
		expect(modifiers.hover.type).toBe("modifier");
		expect(modifiers.hover.key).toEqual(["hover"]);

		expect(modifiers.focus.key).toEqual(["focus"]);
		expect(modifiers.focusWithin.key).toEqual(["focus-within"]);
		expect(modifiers.focusVisible.key).toEqual(["focus-visible"]);
		expect(modifiers.active.key).toEqual(["active"]);
		expect(modifiers.visited.key).toEqual(["visited"]);
		expect(modifiers.target.key).toEqual(["target"]);
	});

	it("should add modifiers to root.modifiers", () => {
		const s = styleframe();
		usePseudoStateModifiers(s);

		expect(s.root.modifiers).toHaveLength(7);
	});

	it("should work with utility creation", () => {
		const s = styleframe();
		const { hover } = usePseudoStateModifiers(s);

		const createMargin = s.utility("margin", ({ value }) => ({
			margin: value,
		}));
		createMargin({ sm: "8px" }, [hover]);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "margin",
		);
		expect(utilities).toHaveLength(2);

		const hoverUtility = utilities.find((u) => u.modifiers.includes("hover"));
		expect(hoverUtility).toBeDefined();
	});

	it("should generate correct CSS class names for hover modifier", () => {
		const s = styleframe();
		const { hover } = usePseudoStateModifiers(s);

		const createBg = s.utility("background-color", ({ value }) => ({
			backgroundColor: value,
		}));
		createBg({ primary: "#006cff" }, [hover]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-color\:primary {`);
		expect(css).toContain(String.raw`._hover\:background-color\:primary {`);
	});

	it("should generate correct CSS class names for focus-visible modifier", () => {
		const s = styleframe();
		const { focusVisible } = usePseudoStateModifiers(s);

		const createOutline = s.utility("outline-color", ({ value }) => ({
			outlineColor: value,
		}));
		createOutline({ blue: "blue" }, [focusVisible]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._outline-color\:blue {`);
		expect(css).toContain(String.raw`._focus-visible\:outline-color\:blue {`);
	});

	it("should combine multiple modifiers", () => {
		const s = styleframe();
		const { hover, focus } = usePseudoStateModifiers(s);

		const createMargin = s.utility("margin", ({ value }) => ({
			margin: value,
		}));
		// Explicit: hover, focus as individual modifiers (no auto-combination)
		createMargin({ sm: "8px" }, [hover, focus]);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "margin",
		);
		// base + hover + focus = 3 (no auto-combination)
		expect(utilities).toHaveLength(3);
	});
});
