import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useStructuralModifiers } from "./useStructuralModifiers";

describe("useStructuralModifiers", () => {
	it("should register all structural modifier factories", () => {
		const s = styleframe();
		const modifiers = useStructuralModifiers(s);

		expect(modifiers.first.key).toEqual(["first"]);
		expect(modifiers.last.key).toEqual(["last"]);
		expect(modifiers.only.key).toEqual(["only"]);
		expect(modifiers.odd.key).toEqual(["odd"]);
		expect(modifiers.even.key).toEqual(["even"]);
		expect(modifiers.firstOfType.key).toEqual(["first-of-type"]);
		expect(modifiers.lastOfType.key).toEqual(["last-of-type"]);
		expect(modifiers.onlyOfType.key).toEqual(["only-of-type"]);
		expect(modifiers.empty.key).toEqual(["empty"]);
	});

	it("should add modifiers to root.modifiers", () => {
		const s = styleframe();
		useStructuralModifiers(s);

		expect(s.root.modifiers).toHaveLength(9);
	});

	it("should generate correct CSS class names for first modifier", () => {
		const s = styleframe();
		const { first } = useStructuralModifiers(s);

		const createBorderWidth = s.utility("border-width", ({ value }) => ({
			borderWidth: value,
		}));
		createBorderWidth({ 0: "0" }, [first]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._border-width\:0 {`);
		expect(css).toContain(String.raw`._first\:border-width\:0 {`);
	});

	it("should generate correct CSS class names for odd modifier", () => {
		const s = styleframe();
		const { odd } = useStructuralModifiers(s);

		const createBg = s.utility("background-color", ({ value }) => ({
			backgroundColor: value,
		}));
		createBg({ gray: "#f0f0f0" }, [odd]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-color\:gray {`);
		expect(css).toContain(String.raw`._odd\:background-color\:gray {`);
	});

	it("should generate correct CSS class names for even modifier", () => {
		const s = styleframe();
		const { even } = useStructuralModifiers(s);

		const createBg = s.utility("background-color", ({ value }) => ({
			backgroundColor: value,
		}));
		createBg({ white: "#fff" }, [even]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._background-color\:white {`);
		expect(css).toContain(String.raw`._even\:background-color\:white {`);
	});

	it("should work with utility creation", () => {
		const s = styleframe();
		const { last } = useStructuralModifiers(s);

		const createMargin = s.utility("margin-bottom", ({ value }) => ({
			marginBottom: value,
		}));
		createMargin({ 0: "0" }, [last]);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "margin-bottom",
		);
		expect(utilities).toHaveLength(2);

		const lastUtility = utilities.find((u) => u.modifiers.includes("last"));
		expect(lastUtility).toBeDefined();
	});
});
