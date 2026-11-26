import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";

import { useResponsiveModifiers } from "./useResponsiveModifiers";

describe("useResponsiveModifiers", () => {
	it("should register all responsive modifier factories", () => {
		const s = styleframe();
		const modifiers = useResponsiveModifiers(s);

		expect(modifiers.sm.key).toEqual(["sm"]);
		expect(modifiers.md.key).toEqual(["md"]);
		expect(modifiers.lg.key).toEqual(["lg"]);
		expect(modifiers.xl.key).toEqual(["xl"]);
		expect(modifiers["2xl"].key).toEqual(["2xl"]);
	});

	it("should add modifiers to root.modifiers", () => {
		const s = styleframe();
		useResponsiveModifiers(s);

		expect(s.root.modifiers).toHaveLength(5);
	});

	it("should generate correct CSS class names for the md modifier", () => {
		const s = styleframe();
		const { md } = useResponsiveModifiers(s);

		const createDisplay = s.utility("display", ({ value }) => ({
			display: value,
		}));
		createDisplay({ flex: "flex" }, [md]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._display\:flex {`);
		expect(css).toContain(String.raw`._md\:display\:flex {`);
	});

	it("should transpile to a real @media (min-width) block sized to the breakpoint", () => {
		const s = styleframe();
		const { md } = useResponsiveModifiers(s);

		const createDisplay = s.utility("display", ({ value }) => ({
			display: value,
		}));
		createDisplay({ flex: "flex" }, [md]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("@media (min-width: 768px) {");
	});

	it("should render every breakpoint at its shared scale value", () => {
		const s = styleframe();
		const { sm, lg, xl, "2xl": xxl } = useResponsiveModifiers(s);

		const createDisplay = s.utility("display", ({ value }) => ({
			display: value,
		}));
		createDisplay({ block: "block" }, [sm, lg, xl, xxl]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("@media (min-width: 576px) {");
		expect(css).toContain("@media (min-width: 992px) {");
		expect(css).toContain("@media (min-width: 1200px) {");
		expect(css).toContain("@media (min-width: 1440px) {");
	});

	it("should work with utility creation", () => {
		const s = styleframe();
		const { lg } = useResponsiveModifiers(s);

		const createColor = s.utility("color", ({ value }) => ({
			color: value,
		}));
		createColor({ white: "#fff" }, [lg]);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "color",
		);
		expect(utilities).toHaveLength(2);

		const responsiveUtility = utilities.find((u) => u.modifiers.includes("lg"));
		expect(responsiveUtility).toBeDefined();
	});
});
