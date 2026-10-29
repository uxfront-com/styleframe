import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useFormStateModifiers } from "./useFormStateModifiers";

describe("useFormStateModifiers", () => {
	it("should register all form state modifier factories", () => {
		const s = styleframe();
		const modifiers = useFormStateModifiers(s);

		expect(modifiers.disabled.key).toEqual(["disabled"]);
		expect(modifiers.enabled.key).toEqual(["enabled"]);
		expect(modifiers.checked.key).toEqual(["checked"]);
		expect(modifiers.indeterminate.key).toEqual(["indeterminate"]);
		expect(modifiers.required.key).toEqual(["required"]);
		expect(modifiers.optional.key).toEqual(["optional"]);
		expect(modifiers.valid.key).toEqual(["valid"]);
		expect(modifiers.invalid.key).toEqual(["invalid"]);
		expect(modifiers.placeholderShown.key).toEqual(["placeholder-shown"]);
		expect(modifiers.autofill.key).toEqual(["autofill"]);
		expect(modifiers.readOnly.key).toEqual(["read-only"]);
		expect(modifiers.readonly.key).toEqual(["readonly"]);
		expect(modifiers.readonlyAttr.key).toEqual(["readonly-attr"]);
	});

	it("should add modifiers to root.modifiers", () => {
		const s = styleframe();
		useFormStateModifiers(s);

		expect(s.root.modifiers).toHaveLength(13);
	});

	it("should generate correct CSS class names for disabled modifier", () => {
		const s = styleframe();
		const { disabled } = useFormStateModifiers(s);

		const createOpacity = s.utility("opacity", ({ value }) => ({
			opacity: value,
		}));
		createOpacity({ 50: "0.5" }, [disabled]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._opacity\\:50 {");
		expect(css).toContain("._disabled\\:opacity\\:50 {");
	});

	it("should generate correct CSS class names for invalid modifier", () => {
		const s = styleframe();
		const { invalid } = useFormStateModifiers(s);

		const createBorderColor = s.utility("border-color", ({ value }) => ({
			borderColor: value,
		}));
		createBorderColor({ red: "red" }, [invalid]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._border-color\\:red {");
		expect(css).toContain("._invalid\\:border-color\\:red {");
	});

	it("should generate correct CSS class names for placeholder-shown modifier", () => {
		const s = styleframe();
		const { placeholderShown } = useFormStateModifiers(s);

		const createColor = s.utility("color", ({ value }) => ({
			color: value,
		}));
		createColor({ muted: "#999" }, [placeholderShown]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._color\\:muted {");
		expect(css).toContain("._placeholder-shown\\:color\\:muted {");
	});

	it("should generate correct CSS class names for readonly alias modifier", () => {
		const s = styleframe();
		const { readonly } = useFormStateModifiers(s);

		const createOpacity = s.utility("opacity", ({ value }) => ({
			opacity: value,
		}));
		createOpacity({ 50: "0.5" }, [readonly]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._opacity\\:50 {");
		expect(css).toContain("._readonly\\:opacity\\:50 {");
	});

	it("should target the readonly attribute with the readonly-attr modifier", () => {
		const s = styleframe();
		const { readonlyAttr } = useFormStateModifiers(s);

		const create = s.utility("cursor", ({ value }) => ({
			cursor: value,
		}));
		create({ text: "text" }, [readonlyAttr]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._readonly-attr\\:cursor\\:text {");
		expect(css).toContain("&[readonly] {");
	});

	it("should work with utility creation", () => {
		const s = styleframe();
		const { checked } = useFormStateModifiers(s);

		const createBg = s.utility("background-color", ({ value }) => ({
			backgroundColor: value,
		}));
		createBg({ blue: "blue" }, [checked]);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "background-color",
		);
		expect(utilities).toHaveLength(2);

		const checkedUtility = utilities.find((u) =>
			u.modifiers.includes("checked"),
		);
		expect(checkedUtility).toBeDefined();
	});
});
