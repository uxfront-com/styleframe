import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useAriaStateModifiers } from "./useAriaStateModifiers";

describe("useAriaStateModifiers", () => {
	it("should register all ARIA state modifier factories", () => {
		const s = styleframe();
		const modifiers = useAriaStateModifiers(s);

		expect(modifiers.ariaBusy.key).toEqual(["aria-busy"]);
		expect(modifiers.ariaChecked.key).toEqual(["aria-checked"]);
		expect(modifiers.ariaDisabled.key).toEqual(["aria-disabled"]);
		expect(modifiers.ariaExpanded.key).toEqual(["aria-expanded"]);
		expect(modifiers.ariaHidden.key).toEqual(["aria-hidden"]);
		expect(modifiers.ariaInvalid.key).toEqual(["aria-invalid"]);
		expect(modifiers.ariaPressed.key).toEqual(["aria-pressed"]);
		expect(modifiers.ariaReadonly.key).toEqual(["aria-readonly"]);
		expect(modifiers.ariaRequired.key).toEqual(["aria-required"]);
		expect(modifiers.ariaSelected.key).toEqual(["aria-selected"]);
	});

	it("should add modifiers to root.modifiers", () => {
		const s = styleframe();
		useAriaStateModifiers(s);

		expect(s.root.modifiers).toHaveLength(10);
	});

	it("should generate correct CSS class names for aria-expanded modifier", () => {
		const s = styleframe();
		const { ariaExpanded } = useAriaStateModifiers(s);

		const createDisplay = s.utility("display", ({ value }) => ({
			display: value,
		}));
		createDisplay({ block: "block" }, [ariaExpanded]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._display\\:block {");
		expect(css).toContain("._aria-expanded\\:display\\:block {");
	});

	it("should generate correct CSS class names for aria-disabled modifier", () => {
		const s = styleframe();
		const { ariaDisabled } = useAriaStateModifiers(s);

		const createOpacity = s.utility("opacity", ({ value }) => ({
			opacity: value,
		}));
		createOpacity({ 50: "0.5" }, [ariaDisabled]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._opacity\\:50 {");
		expect(css).toContain("._aria-disabled\\:opacity\\:50 {");
	});

	it("should generate correct CSS class names for aria-selected modifier", () => {
		const s = styleframe();
		const { ariaSelected } = useAriaStateModifiers(s);

		const createBg = s.utility("background-color", ({ value }) => ({
			backgroundColor: value,
		}));
		createBg({ blue: "blue" }, [ariaSelected]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._background-color\\:blue {");
		expect(css).toContain("._aria-selected\\:background-color\\:blue {");
	});

	it("should target aria-invalid true with the aria-invalid modifier", () => {
		const s = styleframe();
		const { ariaInvalid } = useAriaStateModifiers(s);

		const create = s.utility("border-color", ({ value }) => ({
			borderColor: value,
		}));
		create({ error: "red" }, [ariaInvalid]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._aria-invalid\\:border-color\\:error {");
		expect(css).toContain('&[aria-invalid="true"] {');
	});

	it("should work with utility creation", () => {
		const s = styleframe();
		const { ariaHidden } = useAriaStateModifiers(s);

		const createDisplay = s.utility("display", ({ value }) => ({
			display: value,
		}));
		createDisplay({ none: "none" }, [ariaHidden]);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "display",
		);
		expect(utilities).toHaveLength(2);

		const ariaHiddenUtility = utilities.find((u) =>
			u.modifiers.includes("aria-hidden"),
		);
		expect(ariaHiddenUtility).toBeDefined();
	});
});
