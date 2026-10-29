import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useOtherStateModifiers } from "./useOtherStateModifiers";

describe("useOtherStateModifiers", () => {
	it("should register all other state modifier factories", () => {
		const s = styleframe();
		const modifiers = useOtherStateModifiers(s);

		expect(modifiers.open.key).toEqual(["open"]);
		expect(modifiers.inert.key).toEqual(["inert"]);
		expect(modifiers.dataLoading.key).toEqual(["data-loading"]);
	});

	it("should add modifiers to root.modifiers", () => {
		const s = styleframe();
		useOtherStateModifiers(s);

		expect(s.root.modifiers).toHaveLength(3);
	});

	it("should generate correct CSS class names for open modifier", () => {
		const s = styleframe();
		const { open } = useOtherStateModifiers(s);

		const createDisplay = s.utility("display", ({ value }) => ({
			display: value,
		}));
		createDisplay({ block: "block" }, [open]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._display\\:block {");
		expect(css).toContain("._open\\:display\\:block {");
	});

	it("should generate correct CSS class names for inert modifier", () => {
		const s = styleframe();
		const { inert } = useOtherStateModifiers(s);

		const createOpacity = s.utility("opacity", ({ value }) => ({
			opacity: value,
		}));
		createOpacity({ 50: "0.5" }, [inert]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._opacity\\:50 {");
		expect(css).toContain("._inert\\:opacity\\:50 {");
	});

	it("should target the data-loading attribute with the data-loading modifier", () => {
		const s = styleframe();
		const { dataLoading } = useOtherStateModifiers(s);

		const create = s.utility("cursor", ({ value }) => ({
			cursor: value,
		}));
		create({ progress: "progress" }, [dataLoading]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("._data-loading\\:cursor\\:progress {");
		expect(css).toContain("&[data-loading] {");
	});

	it("should work with utility creation", () => {
		const s = styleframe();
		const { open } = useOtherStateModifiers(s);

		const createBg = s.utility("background-color", ({ value }) => ({
			backgroundColor: value,
		}));
		createBg({ white: "#fff" }, [open]);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "background-color",
		);
		expect(utilities).toHaveLength(2);

		const openUtility = utilities.find((u) => u.modifiers.includes("open"));
		expect(openUtility).toBeDefined();
	});
});
