import type { Utility } from "@styleframe/core";
import { isUtility, styleframe } from "@styleframe/core";
import { consumeCSS } from "@styleframe/transpiler";
import { useContainerQueryModifiers } from "./useContainerQueryModifiers";

describe("useContainerQueryModifiers", () => {
	it("should register all container-query modifier factories", () => {
		const s = styleframe();
		const modifiers = useContainerQueryModifiers(s);

		expect(modifiers.containerSm.key).toEqual(["container-sm"]);
		expect(modifiers.containerMd.key).toEqual(["container-md"]);
		expect(modifiers.containerLg.key).toEqual(["container-lg"]);
		expect(modifiers.containerXl.key).toEqual(["container-xl"]);
		expect(modifiers.container2xl.key).toEqual(["container-2xl"]);
	});

	it("should add modifiers to root.modifiers", () => {
		const s = styleframe();
		useContainerQueryModifiers(s);

		expect(s.root.modifiers).toHaveLength(5);
	});

	it("should generate correct CSS class names for the md modifier", () => {
		const s = styleframe();
		const { containerMd } = useContainerQueryModifiers(s);

		const createDisplay = s.utility("display", ({ value }) => ({
			display: value,
		}));
		createDisplay({ flex: "flex" }, [containerMd]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain(String.raw`._display\:flex {`);
		expect(css).toContain(String.raw`._container-md\:display\:flex {`);
	});

	it("should transpile to a valid @container block sized to the breakpoint", () => {
		const s = styleframe();
		const { containerMd } = useContainerQueryModifiers(s);

		const createDisplay = s.utility("display", ({ value }) => ({
			display: value,
		}));
		createDisplay({ flex: "flex" }, [containerMd]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("@container (min-width: 768px) {");
	});

	it("should render every breakpoint at its shared scale value", () => {
		const s = styleframe();
		const { containerSm, containerLg, containerXl, container2xl } =
			useContainerQueryModifiers(s);

		const createDisplay = s.utility("display", ({ value }) => ({
			display: value,
		}));
		createDisplay({ block: "block" }, [
			containerSm,
			containerLg,
			containerXl,
			container2xl,
		]);

		const css = consumeCSS(s.root, s.options);
		expect(css).toContain("@container (min-width: 576px) {");
		expect(css).toContain("@container (min-width: 992px) {");
		expect(css).toContain("@container (min-width: 1200px) {");
		expect(css).toContain("@container (min-width: 1440px) {");
	});

	it("should work with utility creation", () => {
		const s = styleframe();
		const { containerLg } = useContainerQueryModifiers(s);

		const createColor = s.utility("color", ({ value }) => ({
			color: value,
		}));
		createColor({ white: "#fff" }, [containerLg]);

		const utilities = s.root.children.filter(
			(u): u is Utility => isUtility(u) && u.name === "color",
		);
		expect(utilities).toHaveLength(2);

		const containerUtility = utilities.find((u) =>
			u.modifiers.includes("container-lg"),
		);
		expect(containerUtility).toBeDefined();
	});
});
